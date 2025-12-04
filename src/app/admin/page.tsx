'use client';

import { useState } from 'react';
import { useAuthStore, usePlansStore } from '@/lib/store';
import { HealthPlan, EnrollmentType } from '@/types';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const defaultNewPlan: Omit<HealthPlan, 'id'> = {
  year: 2026,
  name: '',
  carrier: '',
  network: '',
  premiums: {
    single: 0,
    employeeSpouse: 0,
    employeeChildren: 0,
    family: 0,
  },
  deductible: { single: 0, family: 0 },
  oopMax: { single: 0, family: 0 },
  coinsurance: 20,
  copays: {
    pcp: 0,
    specialist: 0,
    urgentCare: 0,
    er: 0,
    imaging: 0,
    labs: 0,
  },
  copaysBeforeDeductible: false,
  rxDeductibleApplies: false,
  rxTiers: {
    generic: 0,
    preferred: 0,
    nonPreferred: 0,
    specialty: 0,
  },
  hsaEligible: false,
  specialtyAccumulatorProgram: false,
  isActive: true,
};

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { plans, addPlan, updatePlan, deletePlan } = usePlansStore();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<HealthPlan | null>(null);
  const [newPlanForm, setNewPlanForm] = useState<Omit<HealthPlan, 'id'>>(defaultNewPlan);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LockClosedIcon className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Access Required
          </h1>
          <p className="text-gray-500 mb-6">
            Please sign in with an admin account to access this page.
          </p>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Demo admin: admin@company.com / admin123
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = (plan: HealthPlan) => {
    setIsEditing(plan.id);
    setEditForm({ ...plan });
  };

  const handleSaveEdit = () => {
    if (editForm && isEditing) {
      updatePlan(isEditing, editForm);
      setIsEditing(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditForm(null);
  };

  const handleDelete = (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      deletePlan(planId);
    }
  };

  const handleCreatePlan = () => {
    const newPlan: HealthPlan = {
      ...newPlanForm,
      id: generateId(),
    };
    addPlan(newPlan);
    setIsCreating(false);
    setNewPlanForm(defaultNewPlan);
  };

  const renderPlanForm = (
    form: HealthPlan | Omit<HealthPlan, 'id'>,
    setForm: (form: HealthPlan | Omit<HealthPlan, 'id'>) => void,
    isNew: boolean = false
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Basic Info */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Basic Info</h4>
        <input
          type="text"
          placeholder="Plan Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        <select
          value={form.year}
          onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
        <input
          type="text"
          placeholder="Carrier"
          value={form.carrier}
          onChange={(e) => setForm({ ...form, carrier: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        <input
          type="text"
          placeholder="Network"
          value={form.network}
          onChange={(e) => setForm({ ...form, network: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
      </div>

      {/* Premiums */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Weekly Premiums</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Single:</span>
          <input
            type="number"
            value={form.premiums.single}
            onChange={(e) =>
              setForm({
                ...form,
                premiums: { ...form.premiums, single: Number(e.target.value) },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Emp+Spouse:</span>
          <input
            type="number"
            value={form.premiums.employeeSpouse}
            onChange={(e) =>
              setForm({
                ...form,
                premiums: {
                  ...form.premiums,
                  employeeSpouse: Number(e.target.value),
                },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Family:</span>
          <input
            type="number"
            value={form.premiums.family}
            onChange={(e) =>
              setForm({
                ...form,
                premiums: { ...form.premiums, family: Number(e.target.value) },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Deductibles & OOP */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Deductibles & OOP Max</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Ded (Single):</span>
          <input
            type="number"
            value={form.deductible.single}
            onChange={(e) =>
              setForm({
                ...form,
                deductible: {
                  ...form.deductible,
                  single: Number(e.target.value),
                },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Ded (Family):</span>
          <input
            type="number"
            value={form.deductible.family}
            onChange={(e) =>
              setForm({
                ...form,
                deductible: {
                  ...form.deductible,
                  family: Number(e.target.value),
                },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">OOP (Single):</span>
          <input
            type="number"
            value={form.oopMax.single}
            onChange={(e) =>
              setForm({
                ...form,
                oopMax: { ...form.oopMax, single: Number(e.target.value) },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">OOP (Family):</span>
          <input
            type="number"
            value={form.oopMax.family}
            onChange={(e) =>
              setForm({
                ...form,
                oopMax: { ...form.oopMax, family: Number(e.target.value) },
              })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 w-24">Coinsurance:</span>
          <input
            type="number"
            value={form.coinsurance}
            onChange={(e) =>
              setForm({ ...form, coinsurance: Number(e.target.value) })
            }
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
          />
          <span className="text-xs text-gray-500">%</span>
        </div>
      </div>

      {/* Copays */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Copays</h4>
        {Object.entries(form.copays).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-24 capitalize">{key}:</span>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                setForm({
                  ...form,
                  copays: { ...form.copays, [key]: Number(e.target.value) },
                })
              }
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        ))}
      </div>

      {/* RX Tiers */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Rx Copays</h4>
        {Object.entries(form.rxTiers).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-24 capitalize">{key}:</span>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                setForm({
                  ...form,
                  rxTiers: { ...form.rxTiers, [key]: Number(e.target.value) },
                })
              }
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        ))}
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Options</h4>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.hsaEligible}
            onChange={(e) => setForm({ ...form, hsaEligible: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">HSA Eligible</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.copaysBeforeDeductible}
            onChange={(e) =>
              setForm({ ...form, copaysBeforeDeductible: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">Copays Before Deductible</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.rxDeductibleApplies}
            onChange={(e) =>
              setForm({ ...form, rxDeductibleApplies: e.target.checked })
            }
            className="rounded"
          />
          <span className="text-sm">Rx Deductible Applies</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-1">
            Manage health plans and configuration
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Plan
        </button>
      </div>

      {/* Create Plan Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create New Plan</h2>
              <button onClick={() => setIsCreating(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              {renderPlanForm(newPlanForm, setNewPlanForm as (form: HealthPlan | Omit<HealthPlan, 'id'>) => void, true)}
            </div>
            <div className="p-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans List */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {isEditing === plan.id && editForm ? (
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Editing: {plan.name}
                </h3>
                {renderPlanForm(editForm, setEditForm as (form: HealthPlan | Omit<HealthPlan, 'id'>) => void)}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          plan.year === 2026
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plan.year}
                      </span>
                      {plan.hsaEligible && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          HSA
                        </span>
                      )}
                      {!plan.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-1">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {plan.carrier} • {plan.network}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Deductible</p>
                    <p className="font-medium">
                      {formatCurrency(plan.deductible.single)} /{' '}
                      {formatCurrency(plan.deductible.family)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Premium (wk)</p>
                    <p className="font-medium">
                      {formatCurrency(plan.premiums.single)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
