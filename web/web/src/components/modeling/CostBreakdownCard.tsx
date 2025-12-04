'use client';

import { CostBreakdown, HealthPlan } from '@/types';
import { formatCurrency, safePercentage } from '@/lib/utils';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/solid';

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
  const deductibleAmount = plan.deductible.single > 0 ? plan.deductible.single : plan.deductible.family;
  const oopMaxAmount = plan.oopMax.single > 0 ? plan.oopMax.single : plan.oopMax.family;

  const oopProgress = safePercentage(breakdown.oopMaxSpend, oopMaxAmount);
  const deductibleProgress = safePercentage(breakdown.deductibleSpend, deductibleAmount);

  return (
    <div
      className={`card-professional ${
        isLowestCost ? 'ring-2 ring-emerald-500 border-emerald-500' : ''
      }`}
    >
      <div className="p-4 border-b border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              {rank && (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank === 1
                      ? 'bg-emerald-100 text-emerald-700'
                      : rank === 2
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  #{rank}
                </span>
              )}
              <h3 className="font-semibold text-slate-900">{breakdown.planName}</h3>
            </div>
            <p className="text-sm text-slate-500 mt-1">{plan.carrier} • {plan.networkType}</p>
          </div>
          {isLowestCost && (
            <span className="badge badge-green">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Best Value
            </span>
          )}
        </div>
      </div>

      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Estimated Annual Cost</p>
          <p className={`text-3xl font-bold mt-1 ${isLowestCost ? 'text-emerald-600' : 'text-slate-900'}`}>
            {formatCurrency(breakdown.netAnnualCost)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            After tax savings & HRA credit
          </p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Annual Premiums</span>
            <span className="font-medium">{formatCurrency(breakdown.annualPremium)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Medical Expenses</span>
            <span className="font-medium">{formatCurrency(breakdown.totalMedicalCosts)}</span>
          </div>
          <div className="pl-4 space-y-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>PCP Visits</span>
              <span>{formatCurrency(breakdown.medicalCosts.pcpCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Specialist Visits</span>
              <span>{formatCurrency(breakdown.medicalCosts.specialistCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Labs & Imaging</span>
              <span>
                {formatCurrency(
                  breakdown.medicalCosts.labCosts + breakdown.medicalCosts.imagingCosts
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ER & Urgent Care</span>
              <span>
                {formatCurrency(
                  breakdown.medicalCosts.erCosts + breakdown.medicalCosts.urgentCareCosts
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Prescription Costs</span>
            <span className="font-medium">{formatCurrency(breakdown.rxCosts.totalRxCosts)}</span>
          </div>
          <div className="pl-4 space-y-1 text-xs text-slate-500">
            <div className="flex justify-between">
              <span>Tier 1 (Generic)</span>
              <span>{formatCurrency(breakdown.rxCosts.tier1Costs)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tier 2 (Preferred)</span>
              <span>{formatCurrency(breakdown.rxCosts.tier2Costs)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tier 3</span>
              <span>{formatCurrency(breakdown.rxCosts.tier3Costs)}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-slate-700">Total Before Adjustments</span>
            <span>{formatCurrency(breakdown.totalAnnualCost)}</span>
          </div>
        </div>

        {(breakdown.totalTaxSavings > 0 || breakdown.hraCredit > 0) && (
          <div className="space-y-2">
            {breakdown.hraCredit > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>HRA Credit</span>
                <span>-{formatCurrency(breakdown.hraCredit)}</span>
              </div>
            )}
            {breakdown.hsaTaxSavings > 0 && (
              <div className="flex justify-between text-sm text-emerald-600">
                <span>HSA Tax Savings</span>
                <span>-{formatCurrency(breakdown.hsaTaxSavings)}</span>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Deductible</span>
              <span className="text-slate-900">
                {formatCurrency(breakdown.deductibleSpend)} of{' '}
                {formatCurrency(deductibleAmount)}
                {breakdown.deductibleMet && (
                  <CheckCircleIcon className="inline h-3 w-3 text-emerald-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  breakdown.deductibleMet ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                style={{ width: `${deductibleProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-600">Out-of-Pocket Max</span>
              <span className="text-slate-900">
                {formatCurrency(breakdown.oopMaxSpend)} of{' '}
                {formatCurrency(oopMaxAmount)}
                {breakdown.oopMaxMet && (
                  <ExclamationCircleIcon className="inline h-3 w-3 text-amber-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  breakdown.oopMaxMet ? 'bg-amber-500' : 'bg-blue-500'
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
