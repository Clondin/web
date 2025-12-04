// Health Plan Types

export interface CoverageLevel {
  single: number;
  family: number;
}

export interface Copays {
  pcp: number;
  specialist: number;
  urgentCare: number;
  er: number;
  imaging: number;
  labs: number;
}

export interface RxTiers {
  generic: number;
  preferred: number;
  nonPreferred: number;
  specialty: number;
  specialtyCoinsurance?: number;
}

export interface HealthPlan {
  id: string;
  year: number;
  name: string;
  carrier: string;
  network: string;

  // Premiums (weekly)
  premiums: {
    single: number;
    employeeSpouse: number;
    employeeChildren: number;
    family: number;
  };

  // Core plan details
  deductible: CoverageLevel;
  oopMax: CoverageLevel;
  coinsurance: number; // percentage after deductible (e.g., 30 for 30%)

  // Copays
  copays: Copays;
  copaysBeforeDeductible: boolean;

  // RX
  rxDeductibleApplies: boolean;
  rxTiers: RxTiers;
  rxCoinsurance?: number;

  // Tax-advantaged accounts
  hsaEligible: boolean;
  hraAmount?: CoverageLevel;

  // Specialty drug rules
  specialtyAccumulatorProgram: boolean; // Does manufacturer assistance count?

  // Metadata
  description?: string;
  highlights?: string[];
  isActive: boolean;
}

export type EnrollmentType = 'single' | 'employeeSpouse' | 'employeeChildren' | 'family';

export interface UserScenario {
  enrollmentType: EnrollmentType;

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
  savings: number; // Difference between highest and lowest
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
