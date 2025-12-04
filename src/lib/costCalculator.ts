import { HealthPlan, UserScenario, CostBreakdown, EnrollmentType } from '@/types';

// Average costs for medical services (used for coinsurance calculations)
const SERVICE_COSTS = {
  pcpVisit: 200,
  specialistVisit: 350,
  labTest: 150,
  imagingTest: 500,
  erVisit: 2500,
  urgentCareVisit: 300,
};

// Average costs for prescriptions
const RX_COSTS = {
  generic: 30,
  brand: 200,
  specialty: 3000, // Monthly
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

function getPremiumForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  return plan.premiums[enrollmentType];
}

function getHraForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  if (!plan.hraAmount) return 0;
  if (enrollmentType === 'single') {
    return plan.hraAmount.single;
  }
  return plan.hraAmount.family;
}

export function calculateCosts(plan: HealthPlan, scenario: UserScenario): CostBreakdown {
  const deductible = getDeductibleForEnrollment(plan, scenario.enrollmentType);
  const oopMax = getOopMaxForEnrollment(plan, scenario.enrollmentType);
  const weeklyPremium = getPremiumForEnrollment(plan, scenario.enrollmentType);
  const annualPremium = weeklyPremium * 52;
  const hraCredit = getHraForEnrollment(plan, scenario.enrollmentType);

  // Track spending against deductible and OOP max
  let runningDeductible = 0;
  let runningOop = 0;

  // Helper to apply costs considering deductible and OOP max
  const applyCost = (
    serviceCost: number,
    copay: number,
    countsToDeductible: boolean = true,
    copaysBeforeDeductible: boolean = plan.copaysBeforeDeductible
  ): number => {
    let patientCost = 0;

    if (copaysBeforeDeductible) {
      // Copay structure - patient pays copay, plan pays rest
      patientCost = copay;
    } else {
      // Deductible-first structure
      if (runningDeductible < deductible && countsToDeductible) {
        // Still paying toward deductible
        const remainingDeductible = deductible - runningDeductible;
        const deductiblePortion = Math.min(serviceCost, remainingDeductible);
        patientCost = deductiblePortion;
        runningDeductible += deductiblePortion;

        // After deductible, apply coinsurance
        if (serviceCost > deductiblePortion) {
          const afterDeductible = serviceCost - deductiblePortion;
          patientCost += afterDeductible * (plan.coinsurance / 100);
        }
      } else {
        // Deductible met, apply coinsurance
        patientCost = serviceCost * (plan.coinsurance / 100);
      }
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

  // Generic prescriptions (typically 12 fills per year per prescription)
  const genericFills = scenario.genericRxCount * 12;
  for (let i = 0; i < genericFills; i++) {
    if (plan.rxDeductibleApplies) {
      rxCosts.genericCosts += applyCost(RX_COSTS.generic, plan.rxTiers.generic);
    } else {
      rxCosts.genericCosts += plan.rxTiers.generic;
      runningOop += plan.rxTiers.generic;
      if (runningOop > oopMax) {
        rxCosts.genericCosts -= (runningOop - oopMax);
        runningOop = oopMax;
      }
    }
  }

  // Brand prescriptions
  const brandFills = scenario.brandRxCount * 12;
  for (let i = 0; i < brandFills; i++) {
    if (plan.rxDeductibleApplies) {
      rxCosts.brandCosts += applyCost(RX_COSTS.brand, plan.rxTiers.preferred);
    } else {
      rxCosts.brandCosts += plan.rxTiers.preferred;
      runningOop += plan.rxTiers.preferred;
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
        // Manufacturer copay card logic
        const manufacturerPays = Math.min(monthlySpecialtyCost * 0.9, 15000); // Most cards cap at ~$15k/year

        if (plan.specialtyAccumulatorProgram) {
          // Accumulator program - manufacturer payment doesn't count toward deductible/OOP
          if (!scenario.manufacturerCardCountsToDeductible && !scenario.manufacturerCardCountsToOopMax) {
            // Patient pays full copay/coinsurance, manufacturer covers most
            const patientResponsibility = plan.rxTiers.specialty || monthlySpecialtyCost * (plan.coinsurance / 100);
            specialtyCostThisMonth = Math.min(patientResponsibility, monthlySpecialtyCost - manufacturerPays);
          } else {
            // Depends on specific accumulator rules
            specialtyCostThisMonth = plan.rxTiers.specialty;
          }
        } else {
          // No accumulator - manufacturer payment counts toward deductible/OOP
          const totalForAccumulator = plan.rxDeductibleApplies
            ? Math.min(monthlySpecialtyCost, deductible - runningDeductible + monthlySpecialtyCost * (plan.coinsurance / 100))
            : plan.rxTiers.specialty;

          // Manufacturer covers most, patient pays remainder
          specialtyCostThisMonth = Math.max(0, totalForAccumulator - manufacturerPays);

          // But the full amount counts toward deductible/OOP
          if (plan.rxDeductibleApplies) {
            const deductiblePortion = Math.min(monthlySpecialtyCost, deductible - runningDeductible);
            runningDeductible += deductiblePortion;
          }
          runningOop += totalForAccumulator;
        }
      } else {
        // No manufacturer card - patient pays according to plan rules
        if (plan.rxDeductibleApplies) {
          specialtyCostThisMonth = applyCost(monthlySpecialtyCost, plan.rxTiers.specialty);
        } else {
          specialtyCostThisMonth = plan.rxTiers.specialty;
          runningOop += plan.rxTiers.specialty;
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
  pcpVisits: 4,
  specialistVisits: 2,
  labTests: 4,
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
  marginalTaxRate: 22,
};
