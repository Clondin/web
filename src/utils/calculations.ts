import { UnderwritingData, FinancialMetrics } from '../types';

export function calculateFinancialMetrics(data: UnderwritingData): FinancialMetrics {
  const { property, financing, income, expenses } = data;

  // Total investment
  const totalInvestment =
    property.purchasePrice +
    property.closingCosts +
    property.rehabBudget;

  // Loan calculations
  const downPayment = totalInvestment * (financing.downPaymentPercent / 100);
  const loanAmount = totalInvestment - downPayment;

  // Monthly mortgage payment (P&I)
  const monthlyInterestRate = financing.interestRate / 100 / 12;
  const numberOfPayments = financing.loanTermYears * 12;

  let monthlyMortgagePayment = 0;
  if (monthlyInterestRate > 0 && numberOfPayments > 0) {
    monthlyMortgagePayment =
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
  }

  // Income calculations
  const grossMonthlyIncome = income.reduce((sum, item) => sum + item.monthlyAmount, 0);
  const totalMonthlyExpenses = expenses.reduce((sum, item) => sum + item.monthlyAmount, 0);

  // NOI (Net Operating Income) - doesn't include debt service
  const annualGrossIncome = grossMonthlyIncome * 12;
  const annualOperatingExpenses = totalMonthlyExpenses * 12;
  const netOperatingIncome = annualGrossIncome - annualOperatingExpenses;

  // Cash flow (after debt service)
  const monthlyCashFlow = grossMonthlyIncome - totalMonthlyExpenses - monthlyMortgagePayment;
  const annualCashFlow = monthlyCashFlow * 12;

  // Cap Rate (NOI / Property Value)
  const capRate = property.purchasePrice > 0
    ? (netOperatingIncome / property.purchasePrice) * 100
    : 0;

  // Cash on Cash Return (Annual Cash Flow / Total Cash Invested)
  const cashOnCashReturn = downPayment > 0
    ? (annualCashFlow / downPayment) * 100
    : 0;

  // Debt Service Coverage Ratio (NOI / Annual Debt Service)
  const annualDebtService = monthlyMortgagePayment * 12;
  const debtServiceCoverageRatio = annualDebtService > 0
    ? netOperatingIncome / annualDebtService
    : 0;

  // Gross Rent Multiplier (Property Price / Gross Annual Income)
  const grossRentMultiplier = annualGrossIncome > 0
    ? property.purchasePrice / annualGrossIncome
    : 0;

  // Return on Investment (5-year projection)
  const fiveYearCashFlow = annualCashFlow * 5;
  const estimatedAppreciation = property.purchasePrice * 0.03 * 5; // 3% annual appreciation
  const totalReturn = fiveYearCashFlow + estimatedAppreciation;
  const returnOnInvestment = downPayment > 0
    ? (totalReturn / downPayment) * 100
    : 0;

  return {
    totalInvestment,
    loanAmount,
    downPayment,
    monthlyMortgagePayment,
    grossMonthlyIncome,
    totalMonthlyExpenses,
    netOperatingIncome,
    monthlyCashFlow,
    annualCashFlow,
    capRate,
    cashOnCashReturn,
    debtServiceCoverageRatio,
    grossRentMultiplier,
    returnOnInvestment,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}
