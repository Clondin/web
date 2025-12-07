import { HealthPlan, UserScenario, CostBreakdown, EnrollmentType, IncomeTier } from '@/types';

// Average costs for medical services (used for coinsurance calculations)
const SERVICE_COSTS = {
  pcpVisit: 250,
  specialistVisit: 400,
  labTest: 150,
  imagingTest: 600,
  erVisit: 2500,
  urgentCareVisit: 200,
};

// Average costs for prescriptions
const RX_COSTS = {
  generic: 30,
  brand: 250,
  specialty: 5000, // Monthly
};

function getDeductibleForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  if (enrollmentType === 'single') {
    return plan.deductible.single;
  }
  return plan.deductible.family;
}

function getOopMaxForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  if (enrollmentType === 'single') {
    return plan.oopMax.single;
  }
  return plan.oopMax.family;
}

function getPremiumForEnrollment(
  plan: HealthPlan,
  enrollmentType: EnrollmentType,
  incomeTier: IncomeTier
): number {
  // Check if plan has high-income premiums and user is high income
  const premiums = incomeTier === 'high' && plan.premiumsHighIncome
    ? plan.premiumsHighIncome
    : plan.premiums;

  return premiums[enrollmentType];
}

function getHraForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  if (!plan.hraAmount) return 0;
  if (enrollmentType === 'single') {
    return plan.hraAmount.single;
  }
  return plan.hraAmount.family;
}

// Parse copay value - can be a number or a string like "Deductible + 30%"
function parseCopay(copayValue: number | string): { isFlat: boolean; amount: number; coinsurancePercent?: number } {
  if (typeof copayValue === 'number') {
    return { isFlat: true, amount: copayValue };
  }

  // Parse string copays like "Deductible + 30%" or "100 + Deductible + 50%"
  const lowerValue = copayValue.toLowerCase();

  if (lowerValue.includes('deductible')) {
    // Extract any flat copay amount (e.g., "100 + Deductible + 50%" -> 100)
    const flatMatch = copayValue.match(/^(\d+)\s*\+/);
    const flatAmount = flatMatch ? parseInt(flatMatch[1]) : 0;

    // Extract coinsurance percentage
    const percentMatch = copayValue.match(/(\d+)%/);
    const coinsurancePercent = percentMatch ? parseInt(percentMatch[1]) : 0;

    return { isFlat: false, amount: flatAmount, coinsurancePercent };
  }

  // Default fallback
  return { isFlat: true, amount: 0 };
}

// Get coinsurance rate (plan pays this percentage, patient pays the rest)
function getPatientCoinsurance(plan: HealthPlan): number {
  return 100 - plan.coinsurance;
}

export function calculateCosts(plan: HealthPlan, scenario: UserScenario): CostBreakdown {
  const deductible = getDeductibleForEnrollment(plan, scenario.enrollmentType);
  const oopMax = getOopMaxForEnrollment(plan, scenario.enrollmentType);
  const weeklyPremium = getPremiumForEnrollment(plan, scenario.enrollmentType, scenario.incomeTier);
  const annualPremium = weeklyPremium * 52;
  const hraCredit = getHraForEnrollment(plan, scenario.enrollmentType);
  const patientCoinsurance = getPatientCoinsurance(plan);

  // Track spending against deductible and OOP max
  let runningDeductible = 0;
  let runningOop = 0;

  // Helper to apply costs considering deductible and OOP max
  const applyCost = (
    serviceCost: number,
    copayValue: number | string,
    applyBeforeDeductible: boolean = plan.copaysBeforeDeductible
  ): number => {
    const copay = parseCopay(copayValue);
    let patientCost = 0;

    if (copay.isFlat && applyBeforeDeductible) {
      // Simple flat copay before deductible
      patientCost = copay.amount;
    } else if (copay.isFlat && !applyBeforeDeductible) {
      // Flat copay after deductible
      if (runningDeductible < deductible) {
        const remainingDeductible = deductible - runningDeductible;
        const deductiblePortion = Math.min(serviceCost, remainingDeductible);
        runningDeductible += deductiblePortion;

        if (serviceCost > deductiblePortion) {
          patientCost = deductiblePortion + copay.amount;
        } else {
          patientCost = deductiblePortion;
        }
      } else {
        patientCost = copay.amount;
      }
    } else {
      // Deductible + coinsurance structure
      const coinsuranceRate = (copay.coinsurancePercent || patientCoinsurance) / 100;

      if (runningDeductible < deductible) {
        const remainingDeductible = deductible - runningDeductible;
        const deductiblePortion = Math.min(serviceCost, remainingDeductible);
        patientCost = deductiblePortion;
        runningDeductible += deductiblePortion;

        if (serviceCost > deductiblePortion) {
          const afterDeductible = serviceCost - deductiblePortion;
          patientCost += afterDeductible * coinsuranceRate;
        }
      } else {
        patientCost = serviceCost * coinsuranceRate;
      }

      // Add any flat copay component (e.g., ER $100 + deductible + coinsurance)
      patientCost += copay.amount;
    }

    // Apply OOP max cap
    if (runningOop + patientCost > oopMax) {
      patientCost = Math.max(0, oopMax - runningOop);
    }
    runningOop += patientCost;

    return patientCost;
  };

  // Calculate medical costs
  const medicalCosts = {
    pcpCosts: 0,
    specialistCosts: 0,
    labCosts: 0,
    imagingCosts: 0,
    erCosts: 0,
    urgentCareCosts: 0,
    coinsuranceCosts: 0,
  };

  // PCP visits
  for (let i = 0; i < scenario.pcpVisits; i++) {
    medicalCosts.pcpCosts += applyCost(SERVICE_COSTS.pcpVisit, plan.copays.pcp);
  }

  // Specialist visits
  for (let i = 0; i < scenario.specialistVisits; i++) {
    medicalCosts.specialistCosts += applyCost(SERVICE_COSTS.specialistVisit, plan.copays.specialist);
  }

  // Lab tests
  for (let i = 0; i < scenario.labTests; i++) {
    medicalCosts.labCosts += applyCost(SERVICE_COSTS.labTest, plan.copays.labs);
  }

  // Imaging tests
  for (let i = 0; i < scenario.imagingTests; i++) {
    medicalCosts.imagingCosts += applyCost(SERVICE_COSTS.imagingTest, plan.copays.imaging);
  }

  // ER visits
  for (let i = 0; i < scenario.erVisits; i++) {
    medicalCosts.erCosts += applyCost(SERVICE_COSTS.erVisit, plan.copays.er);
  }

  // Urgent care visits
  for (let i = 0; i < scenario.urgentCareVisits; i++) {
    medicalCosts.urgentCareCosts += applyCost(SERVICE_COSTS.urgentCareVisit, plan.copays.urgentCare);
  }

  // Calculate RX costs
  const rxCosts = {
    genericCosts: 0,
    brandCosts: 0,
    specialtyCosts: 0,
    totalRxCosts: 0,
  };

  // Determine if Rx deductible applies
  const rxDeductibleApplies = plan.rxTiers.deductible === 'medical';
  const rxDeductibleAmount = typeof plan.rxTiers.deductible === 'number' ? plan.rxTiers.deductible : 0;
  let rxDeductibleMet = rxDeductibleAmount === 0;

  // Generic prescriptions (typically 12 fills per year per prescription)
  const genericFills = scenario.genericRxCount * 12;
  for (let i = 0; i < genericFills; i++) {
    if (rxDeductibleApplies) {
      rxCosts.genericCosts += applyCost(RX_COSTS.generic, plan.rxTiers.tier1, false);
    } else {
      // Check Rx deductible first
      if (!rxDeductibleMet && rxDeductibleAmount > 0) {
        const costTowardsDeductible = Math.min(RX_COSTS.generic, rxDeductibleAmount);
        rxCosts.genericCosts += costTowardsDeductible;
        rxDeductibleMet = true;
      } else {
        rxCosts.genericCosts += plan.rxTiers.tier1;
      }
      runningOop += rxCosts.genericCosts;
      if (runningOop > oopMax) {
        rxCosts.genericCosts = Math.max(0, rxCosts.genericCosts - (runningOop - oopMax));
        runningOop = oopMax;
      }
    }
  }

  // Brand prescriptions
  const brandFills = scenario.brandRxCount * 12;
  for (let i = 0; i < brandFills; i++) {
    if (rxDeductibleApplies) {
      rxCosts.brandCosts += applyCost(RX_COSTS.brand, plan.rxTiers.tier2, false);
    } else {
      rxCosts.brandCosts += plan.rxTiers.tier2;
      runningOop += plan.rxTiers.tier2;
      if (runningOop > oopMax) {
        rxCosts.brandCosts -= (runningOop - oopMax);
        runningOop = oopMax;
      }
    }
  }

  // Specialty prescriptions (monthly fills)
  if (scenario.hasSpecialtyDrug) {
    const monthlySpecialtyCost = scenario.specialtyDrugMonthlyCost || RX_COSTS.specialty;

    for (let month = 0; month < 12; month++) {
      let specialtyCostThisMonth = 0;

      if (scenario.usesManufacturerCopayCard) {
        // Manufacturer copay card typically covers most of patient responsibility
        const manufacturerCoverage = Math.min(monthlySpecialtyCost * 0.9, 15000 / 12);

        if (rxDeductibleApplies) {
          const fullCost = applyCost(monthlySpecialtyCost, plan.rxTiers.tier3, false);
          specialtyCostThisMonth = Math.max(0, fullCost - manufacturerCoverage);
        } else {
          specialtyCostThisMonth = Math.max(0, plan.rxTiers.tier3 - manufacturerCoverage);
        }
      } else {
        if (rxDeductibleApplies) {
          specialtyCostThisMonth = applyCost(monthlySpecialtyCost, plan.rxTiers.tier3, false);
        } else {
          specialtyCostThisMonth = plan.rxTiers.tier3;
          runningOop += plan.rxTiers.tier3;
        }
      }

      // Apply OOP max cap
      if (runningOop > oopMax) {
        const excess = runningOop - oopMax;
        specialtyCostThisMonth = Math.max(0, specialtyCostThisMonth - excess);
        runningOop = oopMax;
      }

      rxCosts.specialtyCosts += specialtyCostThisMonth;
    }
  }

  rxCosts.totalRxCosts = rxCosts.genericCosts + rxCosts.brandCosts + rxCosts.specialtyCosts;

  // Calculate totals
  const totalMedicalCosts =
    medicalCosts.pcpCosts +
    medicalCosts.specialistCosts +
    medicalCosts.labCosts +
    medicalCosts.imagingCosts +
    medicalCosts.erCosts +
    medicalCosts.urgentCareCosts;

  const totalOutOfPocket = totalMedicalCosts + rxCosts.totalRxCosts;

  // Calculate tax savings
  const hsaTaxSavings = plan.hsaEligible
    ? scenario.hsaContribution * (scenario.marginalTaxRate / 100)
    : 0;

  const fsaMedicalTaxSavings = scenario.fsaMedicalContribution * (scenario.marginalTaxRate / 100);
  const fsaDependentCareTaxSavings = scenario.fsaDependentCareContribution * (scenario.marginalTaxRate / 100);
  const totalTaxSavings = hsaTaxSavings + fsaMedicalTaxSavings + fsaDependentCareTaxSavings;

  // Calculate final costs
  const totalAnnualCost = annualPremium + totalOutOfPocket;
  const netAnnualCost = totalAnnualCost - totalTaxSavings - hraCredit;

  return {
    planId: plan.id,
    planName: plan.name,
    year: plan.year,

    annualPremium,
    medicalCosts,
    rxCosts,

    totalMedicalCosts,
    totalRxCosts: rxCosts.totalRxCosts,
    totalOutOfPocket,

    deductibleMet: runningDeductible >= deductible,
    deductibleSpend: Math.min(runningDeductible, deductible),
    oopMaxMet: runningOop >= oopMax,
    oopMaxSpend: Math.min(runningOop, oopMax),

    hsaTaxSavings,
    fsaMedicalTaxSavings,
    fsaDependentCareTaxSavings,
    totalTaxSavings,

    hraCredit,

    totalAnnualCost,
    netAnnualCost,
  };
}

export function compareAllPlans(plans: HealthPlan[], scenario: UserScenario): {
  breakdowns: CostBreakdown[];
  lowestCostPlan: CostBreakdown;
  highestCostPlan: CostBreakdown;
  potentialSavings: number;
} {
  const breakdowns = plans.map(plan => calculateCosts(plan, scenario));

  const sorted = [...breakdowns].sort((a, b) => a.netAnnualCost - b.netAnnualCost);
  const lowestCostPlan = sorted[0];
  const highestCostPlan = sorted[sorted.length - 1];
  const potentialSavings = highestCostPlan.netAnnualCost - lowestCostPlan.netAnnualCost;

  return {
    breakdowns,
    lowestCostPlan,
    highestCostPlan,
    potentialSavings,
  };
}

export const defaultScenario: UserScenario = {
  enrollmentType: 'single',
  incomeTier: 'standard',
  pcpVisits: 3,
  specialistVisits: 2,
  labTests: 3,
  imagingTests: 1,
  erVisits: 0,
  urgentCareVisits: 1,
  genericRxCount: 1,
  brandRxCount: 0,
  specialtyRxCount: 0,
  hasSpecialtyDrug: false,
  specialtyDrugMonthlyCost: 0,
  usesManufacturerCopayCard: false,
  manufacturerCardCountsToDeductible: false,
  manufacturerCardCountsToOopMax: false,
  hsaContribution: 0,
  fsaMedicalContribution: 0,
  fsaDependentCareContribution: 0,
  marginalTaxRate: 25,
};
