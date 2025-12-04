import { HealthPlan, UserScenario, CostBreakdown, EnrollmentType } from '@/types';

const SERVICE_COSTS = {
  pcpVisit: 200,
  specialistVisit: 350,
  labTest: 150,
  imagingTest: 500,
  erVisit: 2500,
  urgentCareVisit: 300,
};

const RX_COSTS = {
  tier1: 30,
  tier2: 200,
  tier3: 500,
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

function getPremiumForEnrollment(plan: HealthPlan, scenario: UserScenario): number {
  const { enrollmentType, incomeOver200k } = scenario;
  
  if (plan.hasIncomeTiers && plan.incomeTieredPremiums) {
    const tier = incomeOver200k ? plan.incomeTieredPremiums.over200k : plan.incomeTieredPremiums.under200k;
    return tier[enrollmentType];
  }
  
  return plan.premiums[enrollmentType];
}

function getHraForEnrollment(plan: HealthPlan, enrollmentType: EnrollmentType): number {
  if (!plan.hraAmount) return 0;
  if (enrollmentType === 'single') {
    return plan.hraAmount.single;
  }
  return plan.hraAmount.family;
}

function getCopayAmount(copay: number | 'deductible'): number {
  return copay === 'deductible' ? 0 : copay;
}

function isDeductibleCopay(copay: number | 'deductible'): boolean {
  return copay === 'deductible';
}

export function calculateCosts(plan: HealthPlan, scenario: UserScenario): CostBreakdown {
  const deductible = getDeductibleForEnrollment(plan, scenario.enrollmentType);
  const oopMax = getOopMaxForEnrollment(plan, scenario.enrollmentType);
  const weeklyPremium = getPremiumForEnrollment(plan, scenario);
  const annualPremium = weeklyPremium * 52;
  const hraCredit = getHraForEnrollment(plan, scenario.enrollmentType);

  let runningDeductible = 0;
  let runningOop = 0;

  const applyCost = (
    serviceCost: number,
    copay: number | 'deductible',
    copaysBeforeDeductible: boolean = plan.copaysBeforeDeductible
  ): number => {
    let patientCost = 0;
    const copayAmount = getCopayAmount(copay);
    const usesDeductible = isDeductibleCopay(copay);

    if (copaysBeforeDeductible && !usesDeductible) {
      patientCost = copayAmount;
    } else {
      if (runningDeductible < deductible) {
        const remainingDeductible = deductible - runningDeductible;
        const deductiblePortion = Math.min(serviceCost, remainingDeductible);
        patientCost = deductiblePortion;
        runningDeductible += deductiblePortion;

        if (serviceCost > deductiblePortion) {
          const afterDeductible = serviceCost - deductiblePortion;
          patientCost += afterDeductible * (plan.coinsurance / 100);
        }
      } else {
        patientCost = serviceCost * (plan.coinsurance / 100);
      }
    }

    if (runningOop + patientCost > oopMax) {
      patientCost = Math.max(0, oopMax - runningOop);
    }
    runningOop += patientCost;

    return patientCost;
  };

  const medicalCosts = {
    pcpCosts: 0,
    specialistCosts: 0,
    labCosts: 0,
    imagingCosts: 0,
    erCosts: 0,
    urgentCareCosts: 0,
    coinsuranceCosts: 0,
  };

  for (let i = 0; i < scenario.pcpVisits; i++) {
    medicalCosts.pcpCosts += applyCost(SERVICE_COSTS.pcpVisit, plan.copays.pcp);
  }

  for (let i = 0; i < scenario.specialistVisits; i++) {
    medicalCosts.specialistCosts += applyCost(SERVICE_COSTS.specialistVisit, plan.copays.specialist);
  }

  for (let i = 0; i < scenario.labTests; i++) {
    medicalCosts.labCosts += applyCost(SERVICE_COSTS.labTest, plan.copays.labs);
  }

  for (let i = 0; i < scenario.imagingTests; i++) {
    medicalCosts.imagingCosts += applyCost(SERVICE_COSTS.imagingTest, plan.copays.imaging);
  }

  for (let i = 0; i < scenario.erVisits; i++) {
    medicalCosts.erCosts += applyCost(SERVICE_COSTS.erVisit, plan.copays.er);
  }

  for (let i = 0; i < scenario.urgentCareVisits; i++) {
    medicalCosts.urgentCareCosts += applyCost(SERVICE_COSTS.urgentCareVisit, plan.copays.urgentCare);
  }

  const rxCosts = {
    tier1Costs: 0,
    tier2Costs: 0,
    tier3Costs: 0,
    totalRxCosts: 0,
  };

  const rxDeductibleApplies = plan.rxTiers.deductible === 'medical';

  const tier1Fills = scenario.tier1RxCount * 12;
  for (let i = 0; i < tier1Fills; i++) {
    if (rxDeductibleApplies) {
      rxCosts.tier1Costs += applyCost(RX_COSTS.tier1, 'deductible');
    } else {
      rxCosts.tier1Costs += plan.rxTiers.tier1;
      runningOop += plan.rxTiers.tier1;
      if (runningOop > oopMax) {
        rxCosts.tier1Costs -= (runningOop - oopMax);
        runningOop = oopMax;
      }
    }
  }

  const tier2Fills = scenario.tier2RxCount * 12;
  for (let i = 0; i < tier2Fills; i++) {
    if (rxDeductibleApplies) {
      rxCosts.tier2Costs += applyCost(RX_COSTS.tier2, 'deductible');
    } else {
      rxCosts.tier2Costs += plan.rxTiers.tier2;
      runningOop += plan.rxTiers.tier2;
      if (runningOop > oopMax) {
        rxCosts.tier2Costs -= (runningOop - oopMax);
        runningOop = oopMax;
      }
    }
  }

  const tier3Fills = scenario.tier3RxCount * 12;
  for (let i = 0; i < tier3Fills; i++) {
    if (rxDeductibleApplies) {
      rxCosts.tier3Costs += applyCost(RX_COSTS.tier3, 'deductible');
    } else {
      rxCosts.tier3Costs += plan.rxTiers.tier3;
      runningOop += plan.rxTiers.tier3;
      if (runningOop > oopMax) {
        rxCosts.tier3Costs -= (runningOop - oopMax);
        runningOop = oopMax;
      }
    }
  }

  rxCosts.totalRxCosts = rxCosts.tier1Costs + rxCosts.tier2Costs + rxCosts.tier3Costs;

  const totalMedicalCosts =
    medicalCosts.pcpCosts +
    medicalCosts.specialistCosts +
    medicalCosts.labCosts +
    medicalCosts.imagingCosts +
    medicalCosts.erCosts +
    medicalCosts.urgentCareCosts;

  const totalOutOfPocket = totalMedicalCosts + rxCosts.totalRxCosts;

  const hsaTaxSavings = plan.hsaEligible
    ? scenario.hsaContribution * (scenario.marginalTaxRate / 100)
    : 0;

  const totalTaxSavings = hsaTaxSavings;

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
  incomeOver200k: false,
  pcpVisits: 4,
  specialistVisits: 2,
  labTests: 4,
  imagingTests: 1,
  erVisits: 0,
  urgentCareVisits: 1,
  tier1RxCount: 1,
  tier2RxCount: 0,
  tier3RxCount: 0,
  hsaContribution: 0,
  marginalTaxRate: 22,
};
