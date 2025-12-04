'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { usePlansStore } from '@/lib/store';
import { formatCurrency, formatCopay } from '@/lib/utils';
import { compareYearOverYear } from '@/lib/yearOverYear';
import { exportPlanDetailToPDF } from '@/lib/pdfExport';
import YearOverYearChanges from '@/components/comparison/YearOverYearChanges';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ScaleIcon,
  ShieldCheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface PlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = use(params);
  const { plans, costBreakdowns, selectPlan, selectedPlanIds } = usePlansStore();

  const plan = plans.find((p) => p.id === id);

  if (!plan) {
    notFound();
  }

  const breakdown = costBreakdowns.get(plan.id);
  const isSelected = selectedPlanIds.includes(plan.id);

  const otherYearPlans = plans.filter((p) => p.year !== plan.year);
  const comparablePlan = otherYearPlans.find((p) => {
    const planType = plan.name.toLowerCase().includes('basic')
      ? 'basic'
      : plan.name.toLowerCase().includes('buy-up')
      ? 'buy-up'
      : plan.name.toLowerCase().includes('value')
      ? 'value'
      : null;
    if (!planType) return false;
    return p.name.toLowerCase().includes(planType);
  });

  const yoyComparison =
    plan.year === 2026 && comparablePlan
      ? compareYearOverYear(comparablePlan, plan)
      : plan.year === 2025 && comparablePlan
      ? compareYearOverYear(plan, comparablePlan)
      : null;

  const handleExportPDF = () => {
    exportPlanDetailToPDF(plan, breakdown);
  };

  const handleAddToCompare = () => {
    if (!isSelected) {
      selectPlan(plan.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/plans"
        className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 text-sm font-medium"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Plans
      </Link>

      <div className="card-professional p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
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
                  HSA Eligible
                </span>
              )}
              {plan.hraAmount && (
                <span className="badge badge-amber">
                  <BanknotesIcon className="h-3 w-3 mr-1" />
                  HRA
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{plan.name}</h1>
            <p className="text-slate-500">
              {plan.carrier} • {plan.network}
            </p>
            {plan.description && (
              <p className="text-slate-600 mt-3 max-w-2xl">{plan.description}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCompare}
              disabled={isSelected}
              className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors ${
                isSelected
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : 'btn-primary'
              }`}
            >
              <ScaleIcon className="h-5 w-5 mr-2" />
              {isSelected ? 'Added to Compare' : 'Add to Compare'}
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-secondary inline-flex items-center justify-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {breakdown && (
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Estimated Annual Cost (Your Scenario)
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {formatCurrency(breakdown.netAnnualCost)}
                </p>
              </div>
              <Link
                href="/model"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Adjust your scenario →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Weekly Premiums
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Single</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(plan.premiums.single)}/wk
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(plan.premiums.single * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Employee + Spouse</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(plan.premiums.couple)}/wk
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(plan.premiums.couple * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Employee + Child(ren)</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(plan.premiums.employeeChild)}/wk
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(plan.premiums.employeeChild * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Family</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(plan.premiums.family)}/wk
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(plan.premiums.family * 52)}/year
                </p>
              </div>
            </div>
            {plan.hasIncomeTiers && (
              <p className="text-sm text-amber-600 mt-4 bg-amber-50 p-3 rounded-lg">
                Note: Premium varies by income level. Employees earning over $200k pay higher premiums.
              </p>
            )}
          </div>

          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Deductibles & Out-of-Pocket Maximum
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Deductible
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Single</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.deductible.single)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Family</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.deductible.family)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-3">
                  Out-of-Pocket Max
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Single</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.oopMax.single)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Family</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.oopMax.family)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Coinsurance</span>
                <span className="font-semibold">{100 - plan.coinsurance}% plan / {plan.coinsurance}% you</span>
              </div>
            </div>
          </div>

          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Copays</h2>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {plan.copaysBeforeDeductible ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-slate-300" />
                )}
                <span
                  className={
                    plan.copaysBeforeDeductible
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-500'
                  }
                >
                  Copays {plan.copaysBeforeDeductible ? 'apply' : 'do not apply'}{' '}
                  before deductible
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">PCP Visit</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.pcp)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Specialist</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.specialist)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Urgent Care</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.urgentCare)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Emergency Room</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.er)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Imaging</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.imaging)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Labs</p>
                <p className="text-lg font-semibold">
                  {formatCopay(plan.copays.labs)}
                </p>
              </div>
            </div>
          </div>

          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Prescription Coverage
            </h2>
            <div className="mb-4">
              <span className={`text-sm ${
                plan.rxTiers.deductible === 'medical'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}>
                {plan.rxTiers.deductible === 'medical'
                  ? 'Medical deductible applies to prescriptions'
                  : plan.rxTiers.deductible === 0
                  ? 'No Rx deductible - copays from day one'
                  : `$${plan.rxTiers.deductible} Rx deductible`}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Tier 1 (Generic)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.tier1)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Tier 2 (Preferred)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.tier2)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Tier 3 (Non-Preferred)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.tier3)}
                </p>
              </div>
            </div>
          </div>

          {yoyComparison && yoyComparison.changes.length > 0 && (
            <div className="card-professional p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Changes from {plan.year === 2026 ? '2025' : '2026'}
              </h2>
              <YearOverYearChanges comparison={yoyComparison} />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Tax-Advantaged Benefits
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {plan.hsaEligible ? (
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-slate-300 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-slate-900">HSA Eligible</p>
                  <p className="text-sm text-slate-500">
                    {plan.hsaEligible
                      ? 'Triple tax advantage for medical expenses'
                      : 'This plan is not HSA eligible'}
                  </p>
                </div>
              </div>

              {plan.hraAmount && (
                <div className="flex items-start gap-3">
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-slate-900">Employer HRA</p>
                    <p className="text-sm text-slate-500">
                      {formatCurrency(plan.hraAmount.single)} (single) /{' '}
                      {formatCurrency(plan.hraAmount.family)} (family)
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">FSA Compatible</p>
                  <p className="text-sm text-slate-500">
                    {plan.hsaEligible
                      ? 'Limited-purpose FSA only'
                      : 'Full medical FSA eligible'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {plan.highlights && plan.highlights.length > 0 && (
            <div className="card-professional p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Plan Highlights
              </h2>
              <ul className="space-y-2">
                {plan.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-600 text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-professional p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Network Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-500">Carrier</p>
                <p className="font-medium text-slate-900">{plan.carrier}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Network</p>
                <p className="font-medium text-slate-900">{plan.network}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Network Type</p>
                <p className="font-medium text-slate-900">{plan.networkType}</p>
              </div>
            </div>
          </div>

          {breakdown && (
            <div className="card-professional p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Your Cost Estimate
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Annual Premium</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.annualPremium)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Medical Costs</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.totalMedicalCosts)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Rx Costs</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.totalRxCosts)}
                  </span>
                </div>
                {breakdown.totalTaxSavings > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Tax Savings</span>
                    <span className="font-medium">
                      -{formatCurrency(breakdown.totalTaxSavings)}
                    </span>
                  </div>
                )}
                {breakdown.hraCredit > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>HRA Credit</span>
                    <span className="font-medium">
                      -{formatCurrency(breakdown.hraCredit)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-900">
                      Net Annual Cost
                    </span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatCurrency(breakdown.netAnnualCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
