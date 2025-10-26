import React from 'react';
import { FinancialMetrics } from '../types';
import { formatCurrency, formatPercent, formatNumber } from '../utils/calculations';

interface MetricsSummaryProps {
  metrics: FinancialMetrics;
}

export const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics }) => {
  const getMetricClass = (value: number, type: 'cashFlow' | 'capRate' | 'coc' | 'dscr'): string => {
    switch (type) {
      case 'cashFlow':
        return value > 0 ? 'metric-good' : value < 0 ? 'metric-bad' : 'metric-neutral';
      case 'capRate':
        return value >= 8 ? 'metric-good' : value >= 5 ? 'metric-neutral' : 'metric-bad';
      case 'coc':
        return value >= 10 ? 'metric-good' : value >= 6 ? 'metric-neutral' : 'metric-bad';
      case 'dscr':
        return value >= 1.25 ? 'metric-good' : value >= 1.0 ? 'metric-neutral' : 'metric-bad';
      default:
        return 'metric-neutral';
    }
  };

  return (
    <div className="metrics-summary">
      <h2>Financial Analysis</h2>

      <div className="metrics-grid">
        <div className="metric-section">
          <h3>Investment Overview</h3>
          <div className="metric-card">
            <label>Total Investment</label>
            <div className="metric-value">{formatCurrency(metrics.totalInvestment)}</div>
          </div>
          <div className="metric-card">
            <label>Down Payment</label>
            <div className="metric-value">{formatCurrency(metrics.downPayment)}</div>
          </div>
          <div className="metric-card">
            <label>Loan Amount</label>
            <div className="metric-value">{formatCurrency(metrics.loanAmount)}</div>
          </div>
          <div className="metric-card">
            <label>Monthly Mortgage Payment</label>
            <div className="metric-value">{formatCurrency(metrics.monthlyMortgagePayment)}</div>
          </div>
        </div>

        <div className="metric-section">
          <h3>Income & Expenses</h3>
          <div className="metric-card">
            <label>Gross Monthly Income</label>
            <div className="metric-value metric-income">{formatCurrency(metrics.grossMonthlyIncome)}</div>
          </div>
          <div className="metric-card">
            <label>Total Monthly Expenses</label>
            <div className="metric-value metric-expense">{formatCurrency(metrics.totalMonthlyExpenses)}</div>
          </div>
          <div className="metric-card">
            <label>Net Operating Income (Annual)</label>
            <div className="metric-value">{formatCurrency(metrics.netOperatingIncome)}</div>
          </div>
        </div>

        <div className="metric-section">
          <h3>Cash Flow Analysis</h3>
          <div className="metric-card">
            <label>Monthly Cash Flow</label>
            <div className={`metric-value ${getMetricClass(metrics.monthlyCashFlow, 'cashFlow')}`}>
              {formatCurrency(metrics.monthlyCashFlow)}
            </div>
          </div>
          <div className="metric-card">
            <label>Annual Cash Flow</label>
            <div className={`metric-value ${getMetricClass(metrics.annualCashFlow, 'cashFlow')}`}>
              {formatCurrency(metrics.annualCashFlow)}
            </div>
          </div>
        </div>

        <div className="metric-section">
          <h3>Key Performance Metrics</h3>
          <div className="metric-card">
            <label>Cap Rate</label>
            <div className={`metric-value ${getMetricClass(metrics.capRate, 'capRate')}`}>
              {formatPercent(metrics.capRate)}
            </div>
            <small>Target: 8%+ (Excellent), 5-8% (Good)</small>
          </div>
          <div className="metric-card">
            <label>Cash on Cash Return</label>
            <div className={`metric-value ${getMetricClass(metrics.cashOnCashReturn, 'coc')}`}>
              {formatPercent(metrics.cashOnCashReturn)}
            </div>
            <small>Target: 10%+ (Excellent), 6-10% (Good)</small>
          </div>
          <div className="metric-card">
            <label>Debt Service Coverage Ratio</label>
            <div className={`metric-value ${getMetricClass(metrics.debtServiceCoverageRatio, 'dscr')}`}>
              {formatNumber(metrics.debtServiceCoverageRatio)}
            </div>
            <small>Target: 1.25+ (Excellent), 1.0-1.25 (Acceptable)</small>
          </div>
          <div className="metric-card">
            <label>Gross Rent Multiplier</label>
            <div className="metric-value">{formatNumber(metrics.grossRentMultiplier)}</div>
            <small>Lower is better (typically 4-7)</small>
          </div>
          <div className="metric-card">
            <label>5-Year ROI</label>
            <div className="metric-value">{formatPercent(metrics.returnOnInvestment)}</div>
            <small>Includes cash flow + 3% appreciation</small>
          </div>
        </div>
      </div>

      <div className="analysis-notes">
        <h3>Deal Assessment</h3>
        <div className="assessment">
          {metrics.monthlyCashFlow > 0 && metrics.capRate >= 8 && metrics.cashOnCashReturn >= 10 && (
            <div className="assessment-item assessment-excellent">
              <strong>Excellent Deal:</strong> This property shows strong positive cash flow with excellent cap rate and cash-on-cash returns.
            </div>
          )}
          {metrics.monthlyCashFlow > 0 && (metrics.capRate >= 5 || metrics.cashOnCashReturn >= 6) && !(metrics.capRate >= 8 && metrics.cashOnCashReturn >= 10) && (
            <div className="assessment-item assessment-good">
              <strong>Good Deal:</strong> This property shows positive cash flow with acceptable returns.
            </div>
          )}
          {metrics.monthlyCashFlow <= 0 && (
            <div className="assessment-item assessment-warning">
              <strong>Warning:</strong> This property shows negative cash flow. Consider renegotiating price, increasing rents, or reducing expenses.
            </div>
          )}
          {metrics.debtServiceCoverageRatio < 1.0 && (
            <div className="assessment-item assessment-warning">
              <strong>DSCR Warning:</strong> Debt service coverage ratio is below 1.0. The property may not generate enough income to cover debt payments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
