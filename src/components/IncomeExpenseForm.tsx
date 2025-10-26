import React from 'react';
import { IncomeItem, ExpenseItem } from '../types';

interface IncomeExpenseFormProps {
  income: IncomeItem[];
  expenses: ExpenseItem[];
  onIncomeChange: (income: IncomeItem[]) => void;
  onExpenseChange: (expenses: ExpenseItem[]) => void;
}

export const IncomeExpenseForm: React.FC<IncomeExpenseFormProps> = ({
  income,
  expenses,
  onIncomeChange,
  onExpenseChange,
}) => {
  const addIncome = () => {
    const newIncome: IncomeItem = {
      id: Date.now().toString(),
      description: '',
      monthlyAmount: 0,
    };
    onIncomeChange([...income, newIncome]);
  };

  const updateIncome = (id: string, field: keyof IncomeItem, value: string | number) => {
    const updated = income.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onIncomeChange(updated);
  };

  const removeIncome = (id: string) => {
    onIncomeChange(income.filter((item) => item.id !== id));
  };

  const addExpense = () => {
    const newExpense: ExpenseItem = {
      id: Date.now().toString(),
      description: '',
      monthlyAmount: 0,
    };
    onExpenseChange([...expenses, newExpense]);
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: string | number) => {
    const updated = expenses.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onExpenseChange(updated);
  };

  const removeExpense = (id: string) => {
    onExpenseChange(expenses.filter((item) => item.id !== id));
  };

  return (
    <div className="income-expense-container">
      <div className="form-section">
        <div className="section-header">
          <h2>Monthly Income</h2>
          <button onClick={addIncome} className="btn-add">+ Add Income</button>
        </div>
        <div className="items-list">
          {income.length === 0 ? (
            <p className="empty-state">No income items. Click "Add Income" to get started.</p>
          ) : (
            income.map((item) => (
              <div key={item.id} className="item-row">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateIncome(item.id, 'description', e.target.value)}
                  placeholder="Description (e.g., Rental Income)"
                  className="item-description"
                />
                <input
                  type="number"
                  value={item.monthlyAmount || ''}
                  onChange={(e) => updateIncome(item.id, 'monthlyAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Monthly Amount"
                  className="item-amount"
                />
                <button onClick={() => removeIncome(item.id)} className="btn-remove">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Monthly Expenses</h2>
          <button onClick={addExpense} className="btn-add">+ Add Expense</button>
        </div>
        <div className="items-list">
          {expenses.length === 0 ? (
            <p className="empty-state">No expense items. Click "Add Expense" to get started.</p>
          ) : (
            expenses.map((item) => (
              <div key={item.id} className="item-row">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateExpense(item.id, 'description', e.target.value)}
                  placeholder="Description (e.g., Property Tax, Insurance, Maintenance)"
                  className="item-description"
                />
                <input
                  type="number"
                  value={item.monthlyAmount || ''}
                  onChange={(e) => updateExpense(item.id, 'monthlyAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Monthly Amount"
                  className="item-amount"
                />
                <button onClick={() => removeExpense(item.id)} className="btn-remove">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
