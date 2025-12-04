'use client';

import Link from 'next/link';
import { HealthPlan, CostBreakdown } from '@/types';
import { formatCurrency, formatCopayShort } from '@/lib/utils';
import { usePlansStore } from '@/lib/store';
import {
  CheckCircleIcon,
  XCircleIcon,
  CheckIcon,
  ShieldCheckIcon,
  BanknotesIcon,
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
      className={`bg-white rounded-xl border-2 transition-all hover:shadow-lg ${
        isSelected
          ? 'border-blue-500 shadow-md shadow-blue-100'
          : isLowestCost
          ? 'border-emerald-500 shadow-md shadow-emerald-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`badge ${
                  plan.year === 2026 ? 'badge-blue' : 'badge-gray'
                }`}
              >
                {plan.year}
              </span>
              {plan.hsaEligible && (
                <span className="badge badge-green">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  HSA
                </span>
              )}
              {plan.hraAmount && (
                <span className="badge badge-amber">
                  <BanknotesIcon className="h-3 w-3 mr-1" />
                  HRA
                </span>
              )}
              {isLowestCost && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                  Lowest Cost
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {plan.carrier} • {plan.networkType}
            </p>
          </div>

          {showCompareCheckbox && (
            <button
              onClick={handleToggleSelect}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title={isSelected ? 'Remove from comparison' : 'Add to comparison'}
            >
              {isSelected ? (
                <CheckIconSolid className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Weekly Premium</p>
            {plan.hasIncomeTiers && plan.incomeTieredPremiums ? (
              <>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(plan.incomeTieredPremiums.under200k.single)}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {formatCurrency(plan.incomeTieredPremiums.over200k.single)} if &gt;$200k
                </p>
              </>
            ) : (
              <p className="text-lg font-bold text-slate-900">{formatCurrency(plan.premiums.single)}</p>
            )}
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Deductible</p>
            <p className="text-lg font-bold text-slate-900">{formatCurrency(plan.deductible.single)}</p>
            <p className="text-xs text-slate-500 mt-1">/ {formatCurrency(plan.deductible.family)} fam</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">OOP Maximum</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(plan.oopMax.single)} / {formatCurrency(plan.oopMax.family)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Coinsurance</span>
            <span className="font-medium text-slate-900">
              {100 - plan.coinsurance}% / {plan.coinsurance}%
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">PCP / Specialist</span>
            <span className="font-medium text-slate-900">
              {formatCopayShort(plan.copays.pcp)} / {formatCopayShort(plan.copays.specialist)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">ER Visit</span>
            <span className="font-medium text-slate-900">
              {formatCopayShort(plan.copays.er)}
            </span>
          </div>
          {plan.hraAmount && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Employer HRA</span>
              <span className="font-medium text-emerald-600">
                +{formatCurrency(plan.hraAmount.single)} / +{formatCurrency(plan.hraAmount.family)}
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex items-center text-sm">
            {plan.copaysBeforeDeductible ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-slate-300 mr-2 flex-shrink-0" />
            )}
            <span className={plan.copaysBeforeDeductible ? 'text-slate-700' : 'text-slate-400'}>
              Copays before deductible
            </span>
          </div>
          <div className="flex items-center text-sm">
            {plan.hsaEligible ? (
              <CheckCircleIcon className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
            ) : (
              <XCircleIcon className="h-4 w-4 text-slate-300 mr-2 flex-shrink-0" />
            )}
            <span className={plan.hsaEligible ? 'text-slate-700' : 'text-slate-400'}>
              HSA eligible
            </span>
          </div>
        </div>

        {breakdown && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Est. Annual Cost</p>
                  <p className="text-sm text-slate-600 mt-0.5">Based on your scenario</p>
                </div>
                <p className={`text-2xl font-bold ${isLowestCost ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {formatCurrency(breakdown.netAnnualCost)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
        <Link
          href={`/plans/${plan.id}`}
          className="block w-full text-center px-4 py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
}
