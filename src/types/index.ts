// Health Plan Types

export interface CoverageLevel {
  single: number;
  family: number;
}

export interface Copays {
  pcp: number | string; // Can be a number or "Deductible + coinsurance"
  specialist: number | string;
  urgentCare: number | string;
  er: number | string;
  imaging: number | string;
  labs: number | string;
}

export interface RxTiers {
  tier1: number; // Generic
  tier2: number; // Preferred Brand
  tier3: number; // Non-Preferred / Specialty
  deductible: number | 'medical'; // Rx deductible amount or 'medical' if medical deductible applies
}

export interface PremiumTier {
  single: number;
  couple: number;
  employeeChild: number;
  family: number;
}

export interface HealthPlan {
  id: string;
  year: number;
  name: string;
  shortName: string;
  carrier: string;
  network: string;
  networkType: 'Freedom' | 'Liberty' | 'Metro' | 'Open Access' | 'Open Access Plus';

  // Premiums (weekly) - can have income tiers for Value plans
  premiums: PremiumTier;
  premiumsHighIncome?: PremiumTier; // For >$200k income tier

  // Core plan details
  deductible: CoverageLevel;
  oopMax: CoverageLevel;
  coinsurance: number; // percentage plan pays (e.g., 80 means 80/20)

  // Copays
  copays: Copays;
  copaysBeforeDeductible: boolean;
  copayNotes?: string;

  // RX
  rxTiers: RxTiers;
  rxNotes?: string;

  // Tax-advantaged accounts
  hsaEligible: boolean;
  hraAmount?: CoverageLevel;

  // Network restrictions
  networkNotes?: string;

  // Metadata
  description: string;
  highlights: string[];
  considerations?: string[];
  isActive: boolean;
}

export type EnrollmentType = 'single' | 'couple' | 'employeeChild' | 'family';

export type IncomeTier = 'standard' | 'high';

export interface UserScenario {
  enrollmentType: EnrollmentType;
  incomeTier: IncomeTier;

  // Medical usage expectations
  pcpVisits: number;
  specialistVisits: number;
  labTests: number;
  imagingTests: number;
  erVisits: number;
  urgentCareVisits: number;

  // Prescription usage
  genericRxCount: number;
  brandRxCount: number;
  specialtyRxCount: number;

  // Specialty drug details
  hasSpecialtyDrug: boolean;
  specialtyDrugMonthlyCost: number;
  usesManufacturerCopayCard: boolean;
  manufacturerCardCountsToDeductible: boolean;
  manufacturerCardCountsToOopMax: boolean;

  // Tax account contributions
  hsaContribution: number;
  fsaMedicalContribution: number;
  fsaDependentCareContribution: number;

  // Tax info for savings calculation
  marginalTaxRate: number;
}

export interface CostBreakdown {
  planId: string;
  planName: string;
  year: number;

  // Costs
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
    genericCosts: number;
    brandCosts: number;
    specialtyCosts: number;
    totalRxCosts: number;
  };

  // Totals before adjustments
  totalMedicalCosts: number;
  totalRxCosts: number;
  totalOutOfPocket: number;

  // Deductible and OOP tracking
  deductibleMet: boolean;
  deductibleSpend: number;
  oopMaxMet: boolean;
  oopMaxSpend: number;

  // Tax savings
  hsaTaxSavings: number;
  fsaMedicalTaxSavings: number;
  fsaDependentCareTaxSavings: number;
  totalTaxSavings: number;

  // HRA credit
  hraCredit: number;

  // Final costs
  totalAnnualCost: number; // Premium + OOP - Tax Savings - HRA
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
  category: 'premium' | 'deductible' | 'copay' | 'rx' | 'network' | 'benefits';
  oldValue: string | number;
  newValue: string | number;
  changeType: 'increase' | 'decrease' | 'same' | 'new' | 'removed' | 'changed';
  percentChange?: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PlanYearComparison {
  plan2025?: HealthPlan;
  plan2026?: HealthPlan;
  changes: YearOverYearChange[];
  summary: string;
}

// User and Auth types
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

// Admin types
export interface PlanFormData extends Omit<HealthPlan, 'id'> {
  id?: string;
}
