'use client';

import { usePlansStore } from '@/lib/store';
import ScenarioForm from '@/components/modeling/ScenarioForm';
import CostBreakdownCard from '@/components/modeling/CostBreakdownCard';
import CostChart, { TotalCostComparisonChart } from '@/components/charts/CostChart';
import Link from 'next/link';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

export default function ModelPage() {
  const { plans, costBreakdowns, selectedPlanIds, selectPlan } = usePlansStore();

  // Get breakdowns and sort by cost
  const breakdowns = Array.from(costBreakdowns.values());
  const sortedBreakdowns = [...breakdowns].sort(
    (a, b) => a.netAnnualCost - b.netAnnualCost
  );
  const lowestCostId = sortedBreakdowns[0]?.planId;

  const plans2025 = plans.filter((p) => p.year === 2025);
  const plans2026 = plans.filter((p) => p.year === 2026);

  const handleSelectForCompare = (planId: string) => {
    if (!selectedPlanIds.includes(planId)) {
      selectPlan(planId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model My Costs</h1>
          <p className="text-gray-500 mt-1">
            Adjust your personal variables to see estimated costs for each plan
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

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Scenario Form - Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ScenarioForm />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-8">
          {/* Charts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Annual Cost Comparison
            </h2>
            <TotalCostComparisonChart
              breakdowns={sortedBreakdowns}
              lowestCostId={lowestCostId}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Cost Breakdown by Category
            </h2>
            <CostChart breakdowns={sortedBreakdowns} lowestCostId={lowestCostId} />
          </div>

          {/* 2026 Plans */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                2026 Plans (New)
              </h2>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Oxford Network
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {plans2026.map((plan, index) => {
                const breakdown = costBreakdowns.get(plan.id);
                const rank =
                  sortedBreakdowns.findIndex((b) => b.planId === plan.id) + 1;
                return (
                  breakdown && (
                    <div key={plan.id} className="relative">
                      <CostBreakdownCard
                        breakdown={breakdown}
                        plan={plan}
                        isLowestCost={plan.id === lowestCostId}
                        rank={rank}
                      />
                      <div className="mt-2 flex space-x-2">
                        <Link
                          href={`/plans/${plan.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleSelectForCompare(plan.id)}
                          disabled={selectedPlanIds.includes(plan.id)}
                          className={`flex-1 text-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedPlanIds.includes(plan.id)
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {selectedPlanIds.includes(plan.id)
                            ? 'Selected'
                            : 'Add to Compare'}
                        </button>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>

          {/* 2025 Plans */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                2025 Plans (Current)
              </h2>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                Cigna Network
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans2025.map((plan) => {
                const breakdown = costBreakdowns.get(plan.id);
                const rank =
                  sortedBreakdowns.findIndex((b) => b.planId === plan.id) + 1;
                return (
                  breakdown && (
                    <div key={plan.id} className="relative">
                      <CostBreakdownCard
                        breakdown={breakdown}
                        plan={plan}
                        isLowestCost={plan.id === lowestCostId}
                        rank={rank}
                      />
                      <div className="mt-2 flex space-x-2">
                        <Link
                          href={`/plans/${plan.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleSelectForCompare(plan.id)}
                          disabled={selectedPlanIds.includes(plan.id)}
                          className={`flex-1 text-center px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedPlanIds.includes(plan.id)
                              ? 'bg-green-100 text-green-700 cursor-default'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {selectedPlanIds.includes(plan.id)
                            ? 'Selected'
                            : 'Add to Compare'}
                        </button>
                      </div>
                    </div>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
