'use client';

import { usePlansStore } from '@/lib/store';
import ScenarioForm from '@/components/modeling/ScenarioForm';
import CostBreakdownCard from '@/components/modeling/CostBreakdownCard';
import CostChart, { TotalCostComparisonChart } from '@/components/charts/CostChart';
import Link from 'next/link';
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cost Modeling</h1>
            <p className="text-slate-500 mt-2 text-lg">
              Customize your scenario to see personalized cost estimates
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Scenario Form - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ScenarioForm />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-8">
            {/* Charts */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Annual Cost Comparison
                  </h2>
                  <p className="text-sm text-slate-500">Ranked by lowest total cost</p>
                </div>
              </div>
              <TotalCostComparisonChart
                breakdowns={sortedBreakdowns}
                lowestCostId={lowestCostId}
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Cost Breakdown by Category
                  </h2>
                  <p className="text-sm text-slate-500">See where your money goes</p>
                </div>
              </div>
              <CostChart breakdowns={sortedBreakdowns} lowestCostId={lowestCostId} />
            </div>

            {/* 2026 Plans */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    2026 Plans
                  </h2>
                  <p className="text-sm text-slate-500">Oxford Network • New options</p>
                </div>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/25">
                  {plans2026.length} plans available
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {plans2026.map((plan) => {
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
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/plans/${plan.id}`}
                            className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleSelectForCompare(plan.id)}
                            disabled={selectedPlanIds.includes(plan.id)}
                            className={`flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                              selectedPlanIds.includes(plan.id)
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    2025 Plans
                  </h2>
                  <p className="text-sm text-slate-500">Cigna Network • Current plans</p>
                </div>
                <span className="px-3 py-1.5 bg-slate-200 text-slate-600 text-xs font-semibold rounded-full">
                  {plans2025.length} plans available
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/plans/${plan.id}`}
                            className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleSelectForCompare(plan.id)}
                            disabled={selectedPlanIds.includes(plan.id)}
                            className={`flex-1 text-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                              selectedPlanIds.includes(plan.id)
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
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
    </div>
  );
}
