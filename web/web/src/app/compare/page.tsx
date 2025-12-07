'use client';

import { usePlansStore } from '@/lib/store';
import { exportComparisonToPDF } from '@/lib/pdfExport';
import ComparisonTable from '@/components/comparison/ComparisonTable';
import CostChart, { TotalCostComparisonChart } from '@/components/charts/CostChart';
import Link from 'next/link';
import {
  DocumentArrowDownIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ComparePage() {
  const {
    plans,
    selectedPlanIds,
    costBreakdowns,
    scenario,
    deselectPlan,
    clearSelectedPlans,
  } = usePlansStore();

  const selectedPlans = plans.filter((p) => selectedPlanIds.includes(p.id));
  const selectedBreakdowns = selectedPlanIds
    .map((id) => costBreakdowns.get(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof costBreakdowns.get>>[];

  // Find lowest cost among selected
  const lowestCostId =
    selectedBreakdowns.length > 0
      ? selectedBreakdowns.reduce((min, b) =>
          b.netAnnualCost < min.netAnnualCost ? b : min
        ).planId
      : undefined;

  const handleExportPDF = () => {
    if (selectedPlans.length > 0 && selectedBreakdowns.length > 0) {
      exportComparisonToPDF(
        selectedPlans,
        selectedBreakdowns,
        scenario,
        lowestCostId
      );
    }
  };

  const handleRemovePlan = (planId: string) => {
    deselectPlan(planId);
  };

  if (selectedPlanIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            No Plans Selected
          </h1>
          <p className="text-gray-500 mb-6">
            Select plans from the Browse or Model pages to compare them side by
            side.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/plans"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Plans
            </Link>
            <Link
              href="/model"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Model Costs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compare Plans</h1>
          <p className="text-gray-500 mt-1">
            Side-by-side comparison of {selectedPlanIds.length} selected plans
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={clearSelectedPlans}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Selected Plans Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedPlans.map((plan) => (
          <div
            key={plan.id}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              plan.id === lowestCostId
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span>{plan.name}</span>
            <button
              onClick={() => handleRemovePlan(plan.id)}
              className="ml-2 hover:text-red-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Link
          href="/plans"
          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Plan
        </Link>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Total Annual Cost
          </h2>
          <TotalCostComparisonChart
            breakdowns={selectedBreakdowns}
            lowestCostId={lowestCostId}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Cost Breakdown
          </h2>
          <CostChart breakdowns={selectedBreakdowns} lowestCostId={lowestCostId} />
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Detailed Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <ComparisonTable
            plans={selectedPlans}
            breakdowns={selectedBreakdowns}
            lowestCostId={lowestCostId}
          />
        </div>
      </div>

      {/* Recommendation */}
      {lowestCostId && (
        <div className="mt-6 bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">Recommendation</h3>
          <p className="text-green-800">
            Based on your scenario,{' '}
            <strong>
              {selectedPlans.find((p) => p.id === lowestCostId)?.name}
            </strong>{' '}
            offers the lowest estimated annual cost among your selected plans.
          </p>
          <Link
            href={`/plans/${lowestCostId}`}
            className="inline-block mt-3 text-green-700 font-medium hover:text-green-800"
          >
            View plan details →
          </Link>
        </div>
      )}
    </div>
  );
}
