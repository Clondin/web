'use client';

import Link from 'next/link';
import { usePlansStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  DocumentTextIcon,
  CalculatorIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const { plans, costBreakdowns } = usePlansStore();

  const plans2025 = plans.filter((p) => p.year === 2025);
  const plans2026 = plans.filter((p) => p.year === 2026);

  // Find lowest cost plan
  const breakdowns = Array.from(costBreakdowns.values());
  const sortedBreakdowns = [...breakdowns].sort(
    (a, b) => a.netAnnualCost - b.netAnnualCost
  );
  const lowestCostBreakdown = sortedBreakdowns[0];

  const features = [
    {
      title: 'Browse Plans',
      description: 'Explore all 2025 and 2026 health plan options',
      icon: DocumentTextIcon,
      href: '/plans',
      color: 'bg-blue-500',
    },
    {
      title: 'Model My Costs',
      description: 'Adjust your personal variables and see estimated costs',
      icon: CalculatorIcon,
      href: '/model',
      color: 'bg-purple-500',
    },
    {
      title: 'Compare Plans',
      description: 'Side-by-side comparison of selected plans',
      icon: ArrowsRightLeftIcon,
      href: '/compare',
      color: 'bg-teal-500',
    },
    {
      title: "What's New in 2026",
      description: 'See year-over-year changes and new plan options',
      icon: SparklesIcon,
      href: '/whats-new',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          2025-2026 Health Plan Comparison Tool
        </h1>
        <p className="text-lg text-blue-100 mb-6 max-w-2xl">
          Explore, model, and compare all company health plans. Make an informed
          decision with real-time cost calculations based on your expected usage.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/model"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Modeling
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
          <Link
            href="/plans"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-400 transition-colors"
          >
            Browse All Plans
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">2025 Plans</p>
          <p className="text-2xl font-bold text-gray-900">{plans2025.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">2026 Plans</p>
          <p className="text-2xl font-bold text-gray-900">{plans2026.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">HSA Eligible</p>
          <p className="text-2xl font-bold text-gray-900">
            {plans.filter((p) => p.hsaEligible).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Best Value</p>
          <p className="text-2xl font-bold text-green-600">
            {lowestCostBreakdown
              ? formatCurrency(lowestCostBreakdown.netAnnualCost)
              : '-'}
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <div
              className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}
            >
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-500">{feature.description}</p>
          </Link>
        ))}
      </div>

      {/* Recommended Plan */}
      {lowestCostBreakdown && (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Recommended for Your Scenario
              </h3>
              <p className="text-green-800">
                Based on your current settings,{' '}
                <strong>{lowestCostBreakdown.planName}</strong> offers the lowest
                estimated annual cost at{' '}
                <strong>
                  {formatCurrency(lowestCostBreakdown.netAnnualCost)}
                </strong>
                .
              </p>
              <Link
                href={`/plans/${lowestCostBreakdown.planId}`}
                className="inline-flex items-center text-green-700 font-medium mt-2 hover:text-green-800"
              >
                View plan details
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Year Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 2025 Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">2025 Plans (Current)</h3>
            <p className="text-sm text-gray-500">Cigna Network</p>
          </div>
          <div className="p-4 space-y-3">
            {plans2025.map((plan) => {
              const breakdown = costBreakdowns.get(plan.id);
              return (
                <Link
                  key={plan.id}
                  href={`/plans/${plan.id}`}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{plan.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(plan.deductible.single)} deductible
                      {plan.hsaEligible && (
                        <span className="ml-2 text-green-600">HSA</span>
                      )}
                    </p>
                  </div>
                  {breakdown && (
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(breakdown.netAnnualCost)}/yr
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 2026 Plans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">2026 Plans (New)</h3>
                <p className="text-sm text-gray-500">Oxford Network</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                New Options
              </span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {plans2026.map((plan) => {
              const breakdown = costBreakdowns.get(plan.id);
              const isLowest =
                lowestCostBreakdown?.planId === plan.id;
              return (
                <Link
                  key={plan.id}
                  href={`/plans/${plan.id}`}
                  className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                    isLowest
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{plan.name}</p>
                      {isLowest && (
                        <span className="px-1.5 py-0.5 bg-green-500 text-white text-xs rounded">
                          Best
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(plan.deductible.single)} deductible
                      {plan.hsaEligible && (
                        <span className="ml-2 text-green-600">HSA</span>
                      )}
                    </p>
                  </div>
                  {breakdown && (
                    <span
                      className={`text-sm font-medium ${
                        isLowest ? 'text-green-700' : 'text-gray-900'
                      }`}
                    >
                      {formatCurrency(breakdown.netAnnualCost)}/yr
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
