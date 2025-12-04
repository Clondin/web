'use client';

import { CostBreakdown, HealthPlan } from '@/types';
import { formatCurrency } from '@/lib/utils';
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
  const oopProgress = Math.min(
    (breakdown.oopMaxSpend / (plan.oopMax.single || plan.oopMax.family)) * 100,
    100
  );

  const deductibleProgress = Math.min(
    (breakdown.deductibleSpend / (plan.deductible.single || plan.deductible.family)) * 100,
    100
  );

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 ${
        isLowestCost ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              {rank && (
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    rank === 1
                      ? 'bg-green-100 text-green-700'
                      : rank === 2
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  #{rank}
                </span>
              )}
              <h3 className="font-semibold text-gray-900">{breakdown.planName}</h3>
            </div>
            <p className="text-sm text-gray-500 mt-1">{plan.carrier}</p>
          </div>
          {isLowestCost && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Best Value
            </span>
          )}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="p-4 bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-600">Estimated Annual Cost</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {formatCurrency(breakdown.netAnnualCost)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            After tax savings & HRA credit
          </p>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="p-4 space-y-4">
        {/* Premium */}
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Annual Premiums</span>
            <span className="font-medium">{formatCurrency(breakdown.annualPremium)}</span>
          </div>
        </div>

        {/* Medical Costs */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Medical Expenses</span>
            <span className="font-medium">{formatCurrency(breakdown.totalMedicalCosts)}</span>
          </div>
          <div className="pl-4 space-y-1 text-xs text-gray-500">
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

        {/* Rx Costs */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Prescription Costs</span>
            <span className="font-medium">{formatCurrency(breakdown.rxCosts.totalRxCosts)}</span>
          </div>
          <div className="pl-4 space-y-1 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Generic</span>
              <span>{formatCurrency(breakdown.rxCosts.genericCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Brand</span>
              <span>{formatCurrency(breakdown.rxCosts.brandCosts)}</span>
            </div>
            <div className="flex justify-between">
              <span>Specialty</span>
              <span>{formatCurrency(breakdown.rxCosts.specialtyCosts)}</span>
            </div>
          </div>
        </div>

        {/* Subtotal */}
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Total Before Adjustments</span>
            <span>{formatCurrency(breakdown.totalAnnualCost)}</span>
          </div>
        </div>

        {/* Savings */}
        {(breakdown.totalTaxSavings > 0 || breakdown.hraCredit > 0) && (
          <div className="space-y-2">
            {breakdown.hraCredit > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>HRA Credit</span>
                <span>-{formatCurrency(breakdown.hraCredit)}</span>
              </div>
            )}
            {breakdown.hsaTaxSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>HSA Tax Savings</span>
                <span>-{formatCurrency(breakdown.hsaTaxSavings)}</span>
              </div>
            )}
            {breakdown.fsaMedicalTaxSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>FSA Tax Savings</span>
                <span>-{formatCurrency(breakdown.fsaMedicalTaxSavings)}</span>
              </div>
            )}
            {breakdown.fsaDependentCareTaxSavings > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Dependent Care FSA Savings</span>
                <span>-{formatCurrency(breakdown.fsaDependentCareTaxSavings)}</span>
              </div>
            )}
          </div>
        )}

        {/* Deductible Progress */}
        <div className="pt-3 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Deductible</span>
              <span className="text-gray-900">
                {formatCurrency(breakdown.deductibleSpend)} of{' '}
                {formatCurrency(plan.deductible.single)}
                {breakdown.deductibleMet && (
                  <CheckCircleIcon className="inline h-3 w-3 text-green-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  breakdown.deductibleMet ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${deductibleProgress}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Out-of-Pocket Max</span>
              <span className="text-gray-900">
                {formatCurrency(breakdown.oopMaxSpend)} of{' '}
                {formatCurrency(plan.oopMax.single)}
                {breakdown.oopMaxMet && (
                  <ExclamationCircleIcon className="inline h-3 w-3 text-orange-500 ml-1" />
                )}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  breakdown.oopMaxMet ? 'bg-orange-500' : 'bg-blue-500'
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
