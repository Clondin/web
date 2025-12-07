'use client';

import { CostBreakdown, HealthPlan } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/solid';
import { StarIcon } from '@heroicons/react/24/solid';

interface CostBreakdownCardProps {
  breakdown: CostBreakdown;
  plan: HealthPlan;
  isLowestCost?: boolean;
  rank?: number;
}

export default function CostBreakdownCard({
  breakdown,
  plan,
  isLowestCost = false,
  rank,
}: CostBreakdownCardProps) {
  const oopProgress = Math.min(
    (breakdown.oopMaxSpend / (plan.oopMax.single || plan.oopMax.family)) * 100,
    100
  );

  const deductibleProgress = Math.min(
    (breakdown.deductibleSpend / (plan.deductible.single || plan.deductible.family)) * 100,
    100
  );

  const getRankStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30';
      case 2:
        return 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30';
      case 3:
        return 'bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
        isLowestCost ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-slate-200'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-3">
            {rank && (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${getRankStyles(rank)}`}
              >
                #{rank}
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-slate-900">{breakdown.planName}</h3>
              <p className="text-sm text-slate-500">{plan.carrier} &bull; {plan.networkType}</p>
            </div>
          </div>
          {isLowestCost && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/30">
              <StarIcon className="h-3 w-3" />
              Best Value
            </span>
          )}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Estimated Annual Cost</p>
          <p className="text-4xl font-bold text-slate-900 mt-2">
            {formatCurrency(breakdown.netAnnualCost)}
          </p>
          <p className="text-xs text-slate-500 mt-1.5">
            After tax savings & HRA credit
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="p-5 space-y-4">
        {/* Premium */}
        <div className="flex justify-between items-center py-2 border-b border-slate-100">
          <span className="text-sm font-medium text-slate-600">Annual Premiums</span>
          <span className="font-semibold text-slate-900">{formatCurrency(breakdown.annualPremium)}</span>
        </div>

        {/* Medical Costs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Medical Expenses</span>
            <span className="font-semibold text-slate-900">{formatCurrency(breakdown.totalMedicalCosts)}</span>
          </div>
          <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">PCP</span>
              <span className="text-slate-700 font-medium">{formatCurrency(breakdown.medicalCosts.pcpCosts)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Specialist</span>
              <span className="text-slate-700 font-medium">{formatCurrency(breakdown.medicalCosts.specialistCosts)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Labs/Imaging</span>
              <span className="text-slate-700 font-medium">
                {formatCurrency(breakdown.medicalCosts.labCosts + breakdown.medicalCosts.imagingCosts)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">ER/Urgent</span>
              <span className="text-slate-700 font-medium">
                {formatCurrency(breakdown.medicalCosts.erCosts + breakdown.medicalCosts.urgentCareCosts)}
              </span>
            </div>
          </div>
        </div>

        {/* Rx Costs */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Prescription Costs</span>
            <span className="font-semibold text-slate-900">{formatCurrency(breakdown.rxCosts.totalRxCosts)}</span>
          </div>
          <div className="pl-4 grid grid-cols-3 gap-x-4 gap-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Generic</span>
              <span className="text-slate-700 font-medium">{formatCurrency(breakdown.rxCosts.genericCosts)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Brand</span>
              <span className="text-slate-700 font-medium">{formatCurrency(breakdown.rxCosts.brandCosts)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Specialty</span>
              <span className="text-slate-700 font-medium">{formatCurrency(breakdown.rxCosts.specialtyCosts)}</span>
            </div>
          </div>
        </div>

        {/* Subtotal */}
        <div className="pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Total Before Adjustments</span>
            <span className="font-bold text-slate-900">{formatCurrency(breakdown.totalAnnualCost)}</span>
          </div>
        </div>

        {/* Savings */}
        {(breakdown.totalTaxSavings > 0 || breakdown.hraCredit > 0) && (
          <div className="bg-emerald-50 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
              <ArrowTrendingDownIcon className="h-4 w-4" />
              Savings & Credits
            </div>
            {breakdown.hraCredit > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">HRA Credit</span>
                <span className="font-semibold text-emerald-700">-{formatCurrency(breakdown.hraCredit)}</span>
              </div>
            )}
            {breakdown.hsaTaxSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">HSA Tax Savings</span>
                <span className="font-semibold text-emerald-700">-{formatCurrency(breakdown.hsaTaxSavings)}</span>
              </div>
            )}
            {breakdown.fsaMedicalTaxSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">FSA Tax Savings</span>
                <span className="font-semibold text-emerald-700">-{formatCurrency(breakdown.fsaMedicalTaxSavings)}</span>
              </div>
            )}
            {breakdown.fsaDependentCareTaxSavings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600">Dependent Care FSA</span>
                <span className="font-semibold text-emerald-700">-{formatCurrency(breakdown.fsaDependentCareTaxSavings)}</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bars */}
        <div className="pt-3 space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-600">Deductible</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(breakdown.deductibleSpend)} of {formatCurrency(plan.deductible.single)}
                {breakdown.deductibleMet && (
                  <CheckCircleIcon className="inline h-4 w-4 text-emerald-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.deductibleMet
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${deductibleProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-slate-600">Out-of-Pocket Max</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(breakdown.oopMaxSpend)} of {formatCurrency(plan.oopMax.single)}
                {breakdown.oopMaxMet && (
                  <ExclamationTriangleIcon className="inline h-4 w-4 text-amber-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  breakdown.oopMaxMet
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
                style={{ width: `${oopProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
