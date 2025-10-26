import React from 'react';
import { PropertyDetails } from '../types';

interface PropertyFormProps {
  property: PropertyDetails;
  onChange: (property: PropertyDetails) => void;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ property, onChange }) => {
  const handleChange = (field: keyof PropertyDetails, value: string | number) => {
    onChange({ ...property, [field]: value });
  };

  return (
    <div className="form-section">
      <h2>Property Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="address">Property Address</label>
          <input
            id="address"
            type="text"
            value={property.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St, City, State ZIP"
          />
        </div>

        <div className="form-group">
          <label htmlFor="propertyType">Property Type</label>
          <select
            id="propertyType"
            value={property.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Single Family">Single Family</option>
            <option value="Multi-Family">Multi-Family</option>
            <option value="Condo">Condo</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="purchasePrice">Purchase Price</label>
          <input
            id="purchasePrice"
            type="number"
            value={property.purchasePrice || ''}
            onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || 0)}
            placeholder="300000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="afterRepairValue">After Repair Value (ARV)</label>
          <input
            id="afterRepairValue"
            type="number"
            value={property.afterRepairValue || ''}
            onChange={(e) => handleChange('afterRepairValue', parseFloat(e.target.value) || 0)}
            placeholder="350000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="closingCosts">Closing Costs</label>
          <input
            id="closingCosts"
            type="number"
            value={property.closingCosts || ''}
            onChange={(e) => handleChange('closingCosts', parseFloat(e.target.value) || 0)}
            placeholder="5000"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rehabBudget">Rehab Budget</label>
          <input
            id="rehabBudget"
            type="number"
            value={property.rehabBudget || ''}
            onChange={(e) => handleChange('rehabBudget', parseFloat(e.target.value) || 0)}
            placeholder="25000"
          />
        </div>
      </div>
    </div>
  );
};
