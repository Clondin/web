export interface PropertyDetails {
  address: string;
  propertyType: string;
  purchasePrice: number;
  afterRepairValue: number;
  closingCosts: number;
  rehabBudget: number;
}

export interface FinancingDetails {
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  loanType: string;
}

export interface IncomeItem {
  id: string;
  description: string;
  monthlyAmount: number;
}

export interface ExpenseItem {
  id: string;
  description: string;
  monthlyAmount: number;
}

export interface UnderwritingData {
  property: PropertyDetails;
  financing: FinancingDetails;
  income: IncomeItem[];
  expenses: ExpenseItem[];
}

export interface FinancialMetrics {
  totalInvestment: number;
  loanAmount: number;
  downPayment: number;
  monthlyMortgagePayment: number;
  grossMonthlyIncome: number;
  totalMonthlyExpenses: number;
  netOperatingIncome: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  debtServiceCoverageRatio: number;
  grossRentMultiplier: number;
  returnOnInvestment: number;
}
