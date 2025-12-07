'use client';

import { useState } from 'react';
import { usePlansStore } from '@/lib/store';
import PlanCard from '@/components/plans/PlanCard';
import Link from 'next/link';
import {
  ArrowsRightLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

type FilterYear = 'all' | '2025' | '2026';
type FilterHsa = 'all' | 'yes' | 'no';

export default function PlansPage() {
  const { plans, costBreakdowns, selectedPlanIds } = usePlansStore();
  const [filterYear, setFilterYear] = useState<FilterYear>('all');
  const [filterHsa, setFilterHsa] = useState<FilterHsa>('all');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'premium'>('cost');

  // Filter plans
  let filteredPlans = plans.filter((plan) => {
    if (filterYear !== 'all' && plan.year !== parseInt(filterYear)) {
      return false;
    }
    if (filterHsa === 'yes' && !plan.hsaEligible) {
      return false;
    }
    if (filterHsa === 'no' && plan.hsaEligible) {
      return false;
    }
    return true;
  });

  // Sort plans
  filteredPlans = [...filteredPlans].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'premium') {
      return a.premiums.single - b.premiums.single;
    }
    // Sort by cost
    const costA = costBreakdowns.get(a.id)?.netAnnualCost || 0;
    const costB = costBreakdowns.get(b.id)?.netAnnualCost || 0;
    return costA - costB;
  });

  // Find lowest cost plan
  const breakdowns = Array.from(costBreakdowns.values());
  const lowestCostPlanId = breakdowns.length > 0
    ? breakdowns.reduce((min, b) =>
        b.netAnnualCost < min.netAnnualCost ? b : min
      ).planId
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Browse Plans</h1>
            <p className="text-slate-500 mt-2 text-lg">
              Explore all 2025 and 2026 health plan options
            </p>
          </div>

          {selectedPlanIds.length > 0 && (
            <Link
              href="/compare"
              className="mt-4 md:mt-0 inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
            >
              <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
              Compare {selectedPlanIds.length} Plans
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-700">Filters & Sort</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Year Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Plan Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value as FilterYear)}
                className="block w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-4 text-sm font-medium focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                <option value="2025">2025 Only</option>
                <option value="2026">2026 Only</option>
              </select>
            </div>

            {/* HSA Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                HSA Eligible
              </label>
              <select
                value={filterHsa}
                onChange={(e) => setFilterHsa(e.target.value as FilterHsa)}
                className="block w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-4 text-sm font-medium focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Plans</option>
                <option value="yes">HSA Eligible</option>
                <option value="no">Not HSA Eligible</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="block w-full rounded-xl border-slate-300 bg-slate-50 py-2.5 px-4 text-sm font-medium focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="cost">Estimated Cost</option>
                <option value="premium">Weekly Premium</option>
                <option value="name">Plan Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-slate-600">
            Showing <span className="text-slate-900 font-bold">{filteredPlans.length}</span> plan{filteredPlans.length !== 1 ? 's' : ''}
          </p>
          {selectedPlanIds.length > 0 && (
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {selectedPlanIds.length} selected for comparison
            </span>
          )}
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              breakdown={costBreakdowns.get(plan.id)}
              isLowestCost={plan.id === lowestCostPlanId}
            />
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-600">No plans match your filters</p>
            <button
              onClick={() => {
                setFilterYear('all');
                setFilterHsa('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
