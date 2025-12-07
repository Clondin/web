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
  ArrowsRightLeftIcon,
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

  // Find comparable plan from other year for YoY comparison
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/plans"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Plans
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    plan.year === 2026
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {plan.year}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-600">
                  {plan.networkType}
                </span>
                {plan.hsaEligible && (
                  <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <ShieldCheckIcon className="h-4 w-4" />
                    HSA Eligible
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{plan.name}</h1>
              <p className="text-slate-500 text-lg">
                {plan.carrier} &bull; {plan.network}
              </p>
              {plan.description && (
                <p className="text-slate-600 mt-3 max-w-2xl">{plan.description}</p>
              )}
            </div>

            <div className="mt-6 md:mt-0 flex flex-col space-y-3">
              <button
                onClick={handleAddToCompare}
                disabled={isSelected}
                className={`inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold transition-all ${
                  isSelected
                    ? 'bg-emerald-100 text-emerald-700 cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                }`}
              >
                <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
                {isSelected ? 'Added to Compare' : 'Add to Compare'}
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center justify-center px-5 py-3 border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* HRA Badge */}
          {plan.hraAmount && (
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-3">
                <BanknotesIcon className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Employer HRA Contribution</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {formatCurrency(plan.hraAmount.single)} (single) / {formatCurrency(plan.hraAmount.family)} (family)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Cost Banner */}
          {breakdown && (
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100 font-medium">
                    Estimated Annual Cost (Your Scenario)
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {formatCurrency(breakdown.netAnnualCost)}
                  </p>
                </div>
                <Link
                  href="/model"
                  className="text-sm text-white/80 hover:text-white font-medium"
                >
                  Adjust your scenario →
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Premiums */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Weekly Premiums
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium">Single</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.premiums.single)}<span className="text-sm font-normal text-slate-500">/wk</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(plan.premiums.single * 52)}/year
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium">Employee + Spouse</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.premiums.couple)}<span className="text-sm font-normal text-slate-500">/wk</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(plan.premiums.couple * 52)}/year
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium">Employee + Child(ren)</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.premiums.employeeChild)}<span className="text-sm font-normal text-slate-500">/wk</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(plan.premiums.employeeChild * 52)}/year
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 font-medium">Family</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.premiums.family)}<span className="text-sm font-normal text-slate-500">/wk</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatCurrency(plan.premiums.family * 52)}/year
                  </p>
                </div>
              </div>
            </div>

            {/* Deductible & OOP */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-5">
                Deductibles & Out-of-Pocket Maximum
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Deductible
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Single</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(plan.deductible.single)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Family</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(plan.deductible.family)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Out-of-Pocket Max
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Single</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(plan.oopMax.single)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Family</span>
                      <span className="font-bold text-slate-900">
                        {formatCurrency(plan.oopMax.family)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Coinsurance</span>
                  <span className="font-bold text-slate-900">{plan.coinsurance}/{100 - plan.coinsurance}</span>
                </div>
              </div>
            </div>

            {/* Copays */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Copays</h2>
              <div className="mb-5">
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
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">PCP Visit</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.pcp)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Specialist</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.specialist)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Urgent Care</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.urgentCare)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Emergency Room</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.er)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Imaging</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.imaging)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Labs</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCopay(plan.copays.labs)}
                  </p>
                </div>
              </div>
            </div>

            {/* Prescription Coverage */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Prescription Coverage
              </h2>
              <div className="mb-5 p-3 bg-slate-50 rounded-xl">
                {plan.rxTiers.deductible === 'medical' ? (
                  <p className="text-amber-700 text-sm font-medium">
                    Medical deductible applies to prescriptions
                  </p>
                ) : typeof plan.rxTiers.deductible === 'number' && plan.rxTiers.deductible > 0 ? (
                  <p className="text-slate-600 text-sm font-medium">
                    Separate Rx deductible: {formatCurrency(plan.rxTiers.deductible)}
                  </p>
                ) : (
                  <p className="text-emerald-600 text-sm font-medium">
                    Copays apply from day one (no Rx deductible)
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Tier 1 (Generic)</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.rxTiers.tier1)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Tier 2 (Preferred)</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.rxTiers.tier2)}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Tier 3 (Specialty)</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">
                    {formatCurrency(plan.rxTiers.tier3)}
                  </p>
                </div>
              </div>
            </div>

            {/* Network Notes */}
            {plan.networkNotes && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                <p className="text-sm text-amber-800 font-medium">
                  <strong>Network Note:</strong> {plan.networkNotes}
                </p>
              </div>
            )}

            {/* Year-over-Year Changes */}
            {yoyComparison && yoyComparison.changes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  What Changed from {plan.year === 2026 ? '2025' : '2026'}?
                </h2>
                <YearOverYearChanges comparison={yoyComparison} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Highlights */}
            {plan.highlights && plan.highlights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Plan Highlights
                </h2>
                <ul className="space-y-3">
                  {plan.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Considerations */}
            {plan.considerations && plan.considerations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Things to Consider
                </h2>
                <ul className="space-y-3">
                  {plan.considerations.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircleIcon className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cost Breakdown */}
            {breakdown && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Your Cost Estimate
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Premium</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(breakdown.annualPremium)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Medical Costs</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(breakdown.totalMedicalCosts)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rx Costs</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrency(breakdown.totalRxCosts)}
                    </span>
                  </div>
                  {breakdown.totalTaxSavings > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Tax Savings</span>
                      <span className="font-semibold">
                        -{formatCurrency(breakdown.totalTaxSavings)}
                      </span>
                    </div>
                  )}
                  {breakdown.hraCredit > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>HRA Credit</span>
                      <span className="font-semibold">
                        -{formatCurrency(breakdown.hraCredit)}
                      </span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">
                        Net Annual Cost
                      </span>
                      <span className="font-bold text-xl text-blue-600">
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
    </div>
  );
}
