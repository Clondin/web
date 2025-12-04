'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { usePlansStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { compareYearOverYear } from '@/lib/yearOverYear';
import { exportPlanDetailToPDF } from '@/lib/pdfExport';
import YearOverYearChanges from '@/components/comparison/YearOverYearChanges';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentArrowDownIcon,
  ArrowsRightLeftIcon,
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
    // Try to match by similar name pattern
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
      {/* Back Button */}
      <Link
        href="/plans"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Plans
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  plan.year === 2026
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {plan.year}
              </span>
              {plan.hsaEligible && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  HSA Eligible
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h1>
            <p className="text-gray-500">
              {plan.carrier} • {plan.network}
            </p>
            {plan.description && (
              <p className="text-gray-600 mt-3 max-w-2xl">{plan.description}</p>
            )}
          </div>

          <div className="mt-4 md:mt-0 flex flex-col space-y-2">
            <button
              onClick={handleAddToCompare}
              disabled={isSelected}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isSelected
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
              {isSelected ? 'Added to Compare' : 'Add to Compare'}
            </button>
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Estimated Cost Banner */}
        {breakdown && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Estimated Annual Cost (Your Scenario)
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {formatCurrency(breakdown.netAnnualCost)}
                </p>
              </div>
              <Link
                href="/model"
                className="text-sm text-blue-600 hover:text-blue-700"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Weekly Premiums
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Single</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(plan.premiums.single)}/wk
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(plan.premiums.single * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employee + Spouse</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(plan.premiums.employeeSpouse)}/wk
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(plan.premiums.employeeSpouse * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Employee + Children</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(plan.premiums.employeeChildren)}/wk
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(plan.premiums.employeeChildren * 52)}/year
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Family</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(plan.premiums.family)}/wk
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(plan.premiums.family * 52)}/year
                </p>
              </div>
            </div>
          </div>

          {/* Deductible & OOP */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deductibles & Out-of-Pocket Maximum
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Deductible
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Single</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.deductible.single)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.deductible.family)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">
                  Out-of-Pocket Max
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Single</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.oopMax.single)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family</span>
                    <span className="font-semibold">
                      {formatCurrency(plan.oopMax.family)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-gray-600">Coinsurance</span>
                <span className="font-semibold">{plan.coinsurance}%</span>
              </div>
            </div>
          </div>

          {/* Copays */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Copays</h2>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {plan.copaysBeforeDeductible ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-300" />
                )}
                <span
                  className={
                    plan.copaysBeforeDeductible
                      ? 'text-green-700'
                      : 'text-gray-500'
                  }
                >
                  Copays {plan.copaysBeforeDeductible ? 'apply' : 'do not apply'}{' '}
                  before deductible
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">PCP Visit</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.pcp)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Specialist</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.specialist)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Urgent Care</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.urgentCare)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Emergency Room</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.er)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Imaging</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.imaging)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Labs</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.copays.labs)}
                </p>
              </div>
            </div>
          </div>

          {/* Prescription Coverage */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Prescription Coverage
            </h2>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                {plan.rxDeductibleApplies ? (
                  <span className="text-orange-600 text-sm">
                    Deductible applies to prescriptions
                  </span>
                ) : (
                  <span className="text-green-600 text-sm">
                    Copays apply from day one (no deductible)
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Generic (Tier 1)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.generic)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Preferred (Tier 2)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.preferred)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Non-Preferred (Tier 3)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.nonPreferred)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Specialty (Tier 4)</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.rxTiers.specialty)}
                </p>
                {plan.rxTiers.specialtyCoinsurance && (
                  <p className="text-xs text-gray-500">
                    or {plan.rxTiers.specialtyCoinsurance}% coinsurance
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Year-over-Year Changes */}
          {yoyComparison && yoyComparison.changes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                What Changed from {plan.year === 2026 ? '2025' : '2026'}?
              </h2>
              <YearOverYearChanges comparison={yoyComparison} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tax Advantages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tax-Advantaged Benefits
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                {plan.hsaEligible ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-300 mt-0.5" />
                )}
                <div>
                  <p className="font-medium text-gray-900">HSA Eligible</p>
                  <p className="text-sm text-gray-500">
                    {plan.hsaEligible
                      ? 'Triple tax advantage for medical expenses'
                      : 'This plan is not HSA eligible'}
                  </p>
                </div>
              </div>

              {plan.hraAmount && (
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Employer HRA</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(plan.hraAmount.single)} (single) /{' '}
                      {formatCurrency(plan.hraAmount.family)} (family)
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">FSA Compatible</p>
                  <p className="text-sm text-gray-500">
                    {plan.hsaEligible
                      ? 'Limited-purpose FSA only'
                      : 'Full medical FSA eligible'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {plan.highlights && plan.highlights.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Highlights
              </h2>
              <ul className="space-y-2">
                {plan.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Network Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Network Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Carrier</p>
                <p className="font-medium text-gray-900">{plan.carrier}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Network</p>
                <p className="font-medium text-gray-900">{plan.network}</p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          {breakdown && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Cost Estimate
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual Premium</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.annualPremium)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Costs</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.totalMedicalCosts)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rx Costs</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.totalRxCosts)}
                  </span>
                </div>
                {breakdown.totalTaxSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Tax Savings</span>
                    <span className="font-medium">
                      -{formatCurrency(breakdown.totalTaxSavings)}
                    </span>
                  </div>
                )}
                {breakdown.hraCredit > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>HRA Credit</span>
                    <span className="font-medium">
                      -{formatCurrency(breakdown.hraCredit)}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">
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
