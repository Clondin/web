// Health Plan Types

export interface CoverageLevel {
  single: number;
  family: number;
}

export interface Copays {
  pcp: number | 'deductible';
  specialist: number | 'deductible';
  urgentCare: number | 'deductible';
  er: number | 'deductible';
  imaging: number | 'deductible';
  labs: number | 'deductible';
}

export interface RxTiers {
  tier1: number;
  tier2: number;
  tier3: number;
  deductible: number | 'medical';
}

export interface PremiumTier {
  single: number;
  couple: number;
  employeeChild: number;
  family: number;
}

export interface IncomeTieredPremiums {
  under200k: PremiumTier;
  over200k: PremiumTier;
}

export interface HealthPlan {
  id: string;
  year: number;
  name: string;
  carrier: string;
  network: string;
  networkType: string;

  premiums: PremiumTier;
  hasIncomeTiers?: boolean;
  incomeTieredPremiums?: IncomeTieredPremiums;

  deductible: CoverageLevel;
  oopMax: CoverageLevel;
  coinsurance: number;

  copays: Copays;
  copaysBeforeDeductible: boolean;

  rxTiers: RxTiers;

  hsaEligible: boolean;
  hraAmount?: CoverageLevel;

  description?: string;
  highlights?: string[];
  isActive: boolean;
}

export type EnrollmentType = 'single' | 'couple' | 'employeeChild' | 'family';

export interface UserScenario {
  enrollmentType: EnrollmentType;
  incomeOver200k: boolean;

  pcpVisits: number;
  specialistVisits: number;
  labTests: number;
  imagingTests: number;
  erVisits: number;
  urgentCareVisits: number;

  tier1RxCount: number;
  tier2RxCount: number;
  tier3RxCount: number;

  hsaContribution: number;
  marginalTaxRate: number;
}

export interface CostBreakdown {
  planId: string;
  planName: string;
  year: number;

  annualPremium: number;
  medicalCosts: {
    pcpCosts: number;
    specialistCosts: number;
    labCosts: number;
    imagingCosts: number;
    erCosts: number;
    urgentCareCosts: number;
    coinsuranceCosts: number;
  };
  rxCosts: {
    tier1Costs: number;
    tier2Costs: number;
    tier3Costs: number;
    totalRxCosts: number;
  };

  totalMedicalCosts: number;
  totalRxCosts: number;
  totalOutOfPocket: number;

  deductibleMet: boolean;
  deductibleSpend: number;
  oopMaxMet: boolean;
  oopMaxSpend: number;

  hsaTaxSavings: number;
  totalTaxSavings: number;

  hraCredit: number;

  totalAnnualCost: number;
  netAnnualCost: number;
}

export interface PlanComparison {
  scenario: UserScenario;
  plans: CostBreakdown[];
  lowestCostPlanId: string;
  savings: number;
}

export interface YearOverYearChange {
  field: string;
  displayName: string;
  oldValue: string | number;
  newValue: string | number;
  changeType: 'increase' | 'decrease' | 'same' | 'new' | 'removed';
  percentChange?: number;
}

export interface PlanYearComparison {
  plan2025?: HealthPlan;
  plan2026?: HealthPlan;
  changes: YearOverYearChange[];
  summary: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface PlanFormData extends Omit<HealthPlan, 'id'> {
  id?: string;
}
