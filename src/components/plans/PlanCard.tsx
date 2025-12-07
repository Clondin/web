'use client';

import Link from 'next/link';
import { HealthPlan, CostBreakdown } from '@/types';
import { formatCurrency, formatCopay } from '@/lib/utils';
import { usePlansStore } from '@/lib/store';
import {
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  StarIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon as CheckIconSolid, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

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

  const getNetworkBadgeColor = (networkType: string) => {
    switch (networkType) {
      case 'Freedom':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Liberty':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Metro':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Open Access Plus':
        return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'Open Access':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg group ${
        isSelected
          ? 'border-blue-500 ring-4 ring-blue-100'
          : isLowestCost
          ? 'border-emerald-500 ring-4 ring-emerald-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                  plan.year === 2026
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {plan.year}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getNetworkBadgeColor(plan.networkType)}`}>
                {plan.networkType}
              </span>
              {plan.hsaEligible && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheckIcon className="h-3 w-3" />
                  HSA
                </span>
              )}
              {isLowestCost && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center gap-1">
                  <StarIconSolid className="h-3 w-3" />
                  Best Value
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {plan.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {plan.carrier} &bull; {plan.network}
            </p>
          </div>

          {showCompareCheckbox && (
            <button
              onClick={handleToggleSelect}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 hover:bg-blue-50 hover:text-blue-500'
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

      {/* Key Metrics */}
      <div className="px-5 pb-4 grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Premium</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {formatCurrency(plan.premiums.single)}<span className="text-sm font-normal text-slate-500">/wk</span>
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Deductible</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {formatCurrency(plan.deductible.single)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">OOP Max</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {formatCurrency(plan.oopMax.single)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Coinsurance</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">
            {plan.coinsurance}/{100 - plan.coinsurance}
          </p>
        </div>
      </div>

      {/* HRA if applicable */}
      {plan.hraAmount && (
        <div className="mx-5 mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="flex items-center gap-2">
            <BanknotesIcon className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Employer HRA</p>
              <p className="text-base font-bold text-emerald-700">
                +{formatCurrency(plan.hraAmount.single)} / {formatCurrency(plan.hraAmount.family)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Annual Cost */}
      {breakdown && (
        <div className="mx-5 mb-4 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-100 uppercase tracking-wide">Est. Annual Cost</p>
              <p className="text-2xl font-bold mt-0.5">{formatCurrency(breakdown.netAnnualCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-100">After tax savings</p>
              <p className="text-xs text-blue-100">& HRA credit</p>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="px-5 pb-4 space-y-2">
        <div className="flex items-center text-sm">
          {plan.copaysBeforeDeductible ? (
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-slate-300 mr-2" />
          )}
          <span className={plan.copaysBeforeDeductible ? 'text-slate-700' : 'text-slate-400'}>
            Copays before deductible
          </span>
        </div>
        <div className="flex items-center text-sm">
          {plan.hsaEligible ? (
            <CheckCircleIcon className="h-5 w-5 text-emerald-500 mr-2" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-slate-300 mr-2" />
          )}
          <span className={plan.hsaEligible ? 'text-slate-700' : 'text-slate-400'}>
            HSA eligible
          </span>
        </div>
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        <Link
          href={`/plans/${plan.id}`}
          className="block w-full text-center px-4 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}
