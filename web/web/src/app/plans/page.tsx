'use client';

import { useState } from 'react';
import { usePlansStore } from '@/lib/store';
import PlanCard from '@/components/plans/PlanCard';
import Link from 'next/link';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Plans</h1>
          <p className="text-gray-500 mt-1">
            Explore all 2025 and 2026 health plan options
          </p>
        </div>

        {selectedPlanIds.length > 0 && (
          <Link
            href="/compare"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
            Compare {selectedPlanIds.length} Plans
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value as FilterYear)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Years</option>
              <option value="2025">2025 Only</option>
              <option value="2026">2026 Only</option>
            </select>
          </div>

          {/* HSA Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HSA Eligible
            </label>
            <select
              value={filterHsa}
              onChange={(e) => setFilterHsa(e.target.value as FilterHsa)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Plans</option>
              <option value="yes">HSA Eligible</option>
              <option value="no">Not HSA Eligible</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="cost">Estimated Cost</option>
              <option value="premium">Weekly Premium</option>
              <option value="name">Plan Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
        {selectedPlanIds.length > 0 && (
          <span className="ml-2 text-blue-600">
            ({selectedPlanIds.length} selected for comparison)
          </span>
        )}
      </p>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-12">
          <p className="text-gray-500">No plans match your filters.</p>
          <button
            onClick={() => {
              setFilterYear('all');
              setFilterHsa('all');
            }}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
