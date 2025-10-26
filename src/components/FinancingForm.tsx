import React from 'react';
import { FinancingDetails } from '../types';

interface FinancingFormProps {
  financing: FinancingDetails;
  onChange: (financing: FinancingDetails) => void;
}

export const FinancingForm: React.FC<FinancingFormProps> = ({ financing, onChange }) => {
  const handleChange = (field: keyof FinancingDetails, value: string | number) => {
    onChange({ ...financing, [field]: value });
  };

  return (
    <div className="form-section">
      <h2>Financing Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="loanType">Loan Type</label>
          <select
            id="loanType"
            value={financing.loanType}
            onChange={(e) => handleChange('loanType', e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Conventional">Conventional</option>
            <option value="FHA">FHA</option>
            <option value="VA">VA</option>
            <option value="Commercial">Commercial</option>
            <option value="Hard Money">Hard Money</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="downPaymentPercent">Down Payment (%)</label>
          <input
            id="downPaymentPercent"
            type="number"
            value={financing.downPaymentPercent || ''}
            onChange={(e) => handleChange('downPaymentPercent', parseFloat(e.target.value) || 0)}
            placeholder="20"
            step="0.1"
            min="0"
            max="100"
          />
        </div>

        <div className="form-group">
          <label htmlFor="interestRate">Interest Rate (%)</label>
          <input
            id="interestRate"
            type="number"
            value={financing.interestRate || ''}
            onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
            placeholder="6.5"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="loanTermYears">Loan Term (Years)</label>
          <input
            id="loanTermYears"
            type="number"
            value={financing.loanTermYears || ''}
            onChange={(e) => handleChange('loanTermYears', parseFloat(e.target.value) || 0)}
            placeholder="30"
            min="1"
          />
        </div>
      </div>
    </div>
  );
};
