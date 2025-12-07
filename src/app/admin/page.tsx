'use client';

import { useState } from 'react';
import { useAuthStore, usePlansStore } from '@/lib/store';
import { HealthPlan } from '@/types';
import { formatCurrency, generateId } from '@/lib/utils';
import Link from 'next/link';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const defaultNewPlan: Omit<HealthPlan, 'id'> = {
  year: 2026,
  name: '',
  shortName: '',
  carrier: 'Oxford/UHC',
  network: 'Oxford Liberty',
  networkType: 'Liberty',
  premiums: {
    single: 0,
    couple: 0,
    employeeChild: 0,
    family: 0,
  },
  deductible: { single: 0, family: 0 },
  oopMax: { single: 0, family: 0 },
  coinsurance: 70,
  copays: {
    pcp: 20,
    specialist: 40,
    urgentCare: 40,
    er: 100,
    imaging: 'Deductible + 30%',
    labs: 'Deductible + 30%',
  },
  copaysBeforeDeductible: true,
  rxTiers: {
    tier1: 25,
    tier2: 50,
    tier3: 75,
    deductible: 100,
  },
  hsaEligible: false,
  description: '',
  highlights: [],
  isActive: true,
};

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { plans, addPlan, deletePlan } = usePlansStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newPlanForm, setNewPlanForm] = useState<Omit<HealthPlan, 'id'>>(defaultNewPlan);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LockClosedIcon className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Admin Access Required
            </h1>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Please sign in with an admin account to access the plan management portal.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Sign In
            </Link>
            <p className="text-sm text-slate-400 mt-6">
              Demo admin: admin@company.com / admin123
            </p>
          </div>
        </div>
      </div>
    );
  }

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

  const plans2025 = plans.filter(p => p.year === 2025);
  const plans2026 = plans.filter(p => p.year === 2026);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 mt-2 text-lg">
              Manage health plans and configuration
            </p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Plan
          </button>
        </div>

        {/* Create Plan Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
                <h2 className="text-xl font-bold text-slate-900">Create New Plan</h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Plan Name"
                      value={newPlanForm.name}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, name: e.target.value })}
                      className="col-span-2 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Short Name"
                      value={newPlanForm.shortName}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, shortName: e.target.value })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <select
                      value={newPlanForm.year}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, year: parseInt(e.target.value) })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      <option value={2025}>2025</option>
                      <option value={2026}>2026</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Carrier"
                      value={newPlanForm.carrier}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, carrier: e.target.value })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Network"
                      value={newPlanForm.network}
                      onChange={(e) => setNewPlanForm({ ...newPlanForm, network: e.target.value })}
                      className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Premiums */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700">Weekly Premiums</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Single</label>
                      <input
                        type="number"
                        value={newPlanForm.premiums.single}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          premiums: { ...newPlanForm.premiums, single: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Couple</label>
                      <input
                        type="number"
                        value={newPlanForm.premiums.couple}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          premiums: { ...newPlanForm.premiums, couple: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Employee + Child</label>
                      <input
                        type="number"
                        value={newPlanForm.premiums.employeeChild}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          premiums: { ...newPlanForm.premiums, employeeChild: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Family</label>
                      <input
                        type="number"
                        value={newPlanForm.premiums.family}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          premiums: { ...newPlanForm.premiums, family: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Deductibles */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700">Deductibles & OOP Max</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Deductible (Single)</label>
                      <input
                        type="number"
                        value={newPlanForm.deductible.single}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          deductible: { ...newPlanForm.deductible, single: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Deductible (Family)</label>
                      <input
                        type="number"
                        value={newPlanForm.deductible.family}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          deductible: { ...newPlanForm.deductible, family: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">OOP Max (Single)</label>
                      <input
                        type="number"
                        value={newPlanForm.oopMax.single}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          oopMax: { ...newPlanForm.oopMax, single: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">OOP Max (Family)</label>
                      <input
                        type="number"
                        value={newPlanForm.oopMax.family}
                        onChange={(e) => setNewPlanForm({
                          ...newPlanForm,
                          oopMax: { ...newPlanForm.oopMax, family: Number(e.target.value) },
                        })}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-700">Options</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPlanForm.hsaEligible}
                        onChange={(e) => setNewPlanForm({ ...newPlanForm, hsaEligible: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">HSA Eligible</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPlanForm.copaysBeforeDeductible}
                        onChange={(e) => setNewPlanForm({ ...newPlanForm, copaysBeforeDeductible: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700">Copays Before Deductible</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlan}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2026 Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">2026 Plans</h2>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              {plans2026.length} plans
            </span>
          </div>
          <div className="space-y-3">
            {plans2026.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {plan.hsaEligible && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <ShieldCheckIcon className="h-3 w-3" />
                        HSA
                      </span>
                    )}
                    {!plan.isActive && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.carrier} &bull; {plan.network}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Deductible</p>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Premium</p>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(plan.premiums.single)}/wk
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2025 Plans */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">2025 Plans</h2>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
              {plans2025.length} plans
            </span>
          </div>
          <div className="space-y-3">
            {plans2025.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {plan.hsaEligible && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <ShieldCheckIcon className="h-3 w-3" />
                        HSA
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-sm text-slate-500">{plan.carrier} &bull; {plan.network}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Deductible</p>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Premium</p>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(plan.premiums.single)}/wk
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
