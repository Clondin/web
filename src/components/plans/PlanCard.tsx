'use client';

import Link from 'next/link';
import { HealthPlan, CostBreakdown } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { usePlansStore } from '@/lib/store';
import {
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid';

interface PlanCardProps {
  plan: HealthPlan;
  breakdown?: CostBreakdown;
  showCompareCheckbox?: boolean;
  isLowestCost?: boolean;
}

export default function PlanCard({
  plan,
  breakdown,
  showCompareCheckbox = true,
  isLowestCost = false,
}: PlanCardProps) {
  const { selectedPlanIds, selectPlan, deselectPlan } = usePlansStore();
  const isSelected = selectedPlanIds.includes(plan.id);

  const handleToggleSelect = () => {
    if (isSelected) {
      deselectPlan(plan.id);
    } else {
      selectPlan(plan.id);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      } ${isLowestCost ? 'ring-2 ring-green-200 border-green-500' : ''}`}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
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
                  HSA Eligible
                </span>
              )}
              {isLowestCost && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                  Lowest Cost
                </span>
              )}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">
              {plan.name}
            </h3>
            <p className="text-sm text-gray-500">
              {plan.carrier} • {plan.network}
            </p>
          </div>

          {showCompareCheckbox && (
            <button
              onClick={handleToggleSelect}
              className={`p-1.5 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              {isSelected ? (
                <CheckIconSolid className="h-5 w-5" />
              ) : (
                <CheckIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Key Details */}
      <div className="p-5 space-y-4">
        {/* Premium */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Weekly Premium</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(plan.premiums.single)}/wk
          </span>
        </div>

        {/* Deductible */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Deductible</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)}
          </span>
        </div>

        {/* OOP Max */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">OOP Max</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(plan.oopMax.single)} / {formatCurrency(plan.oopMax.family)}
          </span>
        </div>

        {/* Coinsurance */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Coinsurance</span>
          <span className="font-medium text-gray-900">{plan.coinsurance}%</span>
        </div>

        {/* HRA if applicable */}
        {plan.hraAmount && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Employer HRA</span>
            <span className="font-medium text-green-600">
              +{formatCurrency(plan.hraAmount.single)} / {formatCurrency(plan.hraAmount.family)}
            </span>
          </div>
        )}

        {/* Estimated Annual Cost if breakdown provided */}
        {breakdown && (
          <div className="pt-3 mt-3 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Est. Annual Cost
              </span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(breakdown.netAnnualCost)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on your scenario
            </p>
          </div>
        )}

        {/* Features */}
        <div className="pt-3 space-y-2">
          <div className="flex items-center text-sm">
            {plan.copaysBeforeDeductible ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-gray-300 mr-2" />
            )}
            <span className={plan.copaysBeforeDeductible ? 'text-gray-700' : 'text-gray-400'}>
              Copays before deductible
            </span>
          </div>
          <div className="flex items-center text-sm">
            {plan.hsaEligible ? (
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-gray-300 mr-2" />
            )}
            <span className={plan.hsaEligible ? 'text-gray-700' : 'text-gray-400'}>
              HSA eligible
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 bg-gray-50 rounded-b-xl">
        <Link
          href={`/plans/${plan.id}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
