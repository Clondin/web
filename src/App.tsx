import { useState, useEffect } from 'react';
import { PropertyForm } from './components/PropertyForm';
import { FinancingForm } from './components/FinancingForm';
import { IncomeExpenseForm } from './components/IncomeExpenseForm';
import { MetricsSummary } from './components/MetricsSummary';
import { UnderwritingData, PropertyDetails, FinancingDetails, IncomeItem, ExpenseItem } from './types';
import { calculateFinancialMetrics } from './utils/calculations';
import './App.css';

const STORAGE_KEY = 'underwriting_data';

function App() {
  const [data, setData] = useState<UnderwritingData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved data:', e);
      }
    }
    return {
      property: {
        address: '',
        propertyType: '',
        purchasePrice: 0,
        afterRepairValue: 0,
        closingCosts: 0,
        rehabBudget: 0,
      },
      financing: {
        downPaymentPercent: 20,
        interestRate: 6.5,
        loanTermYears: 30,
        loanType: '',
      },
      income: [],
      expenses: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const metrics = calculateFinancialMetrics(data);

  const handlePropertyChange = (property: PropertyDetails) => {
    setData({ ...data, property });
  };

  const handleFinancingChange = (financing: FinancingDetails) => {
    setData({ ...data, financing });
  };

  const handleIncomeChange = (income: IncomeItem[]) => {
    setData({ ...data, income });
  };

  const handleExpenseChange = (expenses: ExpenseItem[]) => {
    setData({ ...data, expenses });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data?')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `underwriting_${Date.now()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setData(imported);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Real Estate Underwriting Platform</h1>
        <p>Analyze investment properties with comprehensive financial metrics</p>
        <div className="header-actions">
          <button onClick={handleExport} className="btn-secondary">Export Data</button>
          <label className="btn-secondary file-input-label">
            Import Data
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button onClick={handleReset} className="btn-danger">Reset All</button>
        </div>
      </header>

      <main className="app-main">
        <div className="forms-container">
          <PropertyForm property={data.property} onChange={handlePropertyChange} />
          <FinancingForm financing={data.financing} onChange={handleFinancingChange} />
          <IncomeExpenseForm
            income={data.income}
            expenses={data.expenses}
            onIncomeChange={handleIncomeChange}
            onExpenseChange={handleExpenseChange}
          />
        </div>

        <MetricsSummary metrics={metrics} />
      </main>

      <footer className="app-footer">
        <p>Real Estate Underwriting Platform - Professional property analysis tool</p>
        <p className="disclaimer">
          Disclaimer: This tool provides estimates only. Consult with financial and real estate professionals before making investment decisions.
        </p>
      </footer>
    </div>
  );
}

export default App;
