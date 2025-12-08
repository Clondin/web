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
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

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
      description: 'Explore all 2025 and 2026 health plan options with detailed benefits',
      icon: DocumentTextIcon,
      href: '/plans',
      gradient: 'from-slate-700 to-slate-900',
      iconBg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    },
    {
      title: 'Model My Costs',
      description: 'Customize your scenario and see real-time cost estimates',
      icon: CalculatorIcon,
      href: '/model',
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      title: 'Compare Plans',
      description: 'Side-by-side comparison of your selected plans',
      icon: ArrowsRightLeftIcon,
      href: '/compare',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      title: "What's New",
      description: 'See year-over-year changes and new 2026 options',
      icon: SparklesIcon,
      href: '/whats-new',
      gradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white mb-10">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/10 to-orange-500/10 rounded-full blur-2xl"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <span className="px-4 py-1.5 bg-amber-500/20 text-amber-200 rounded-full text-sm font-semibold border border-amber-400/30">
                Open Enrollment 2026
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Kayco<br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Benefits Portal
              </span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Your personalized benefits decision hub. Compare health plans, model costs
              with your real scenarios, and find the perfect plan for you and your family.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/model"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 group"
              >
                Start Cost Modeling
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center px-6 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm"
              >
                Browse All Plans
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">2025 Plans</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{plans2025.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">2026 Plans</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{plans2026.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">HSA Eligible</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {plans.filter((p) => p.hsaEligible).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Best Value</span>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              {lowestCostBreakdown
                ? formatCurrency(lowestCostBreakdown.netAnnualCost)
                : '-'}
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* Recommended Plan */}
        {lowestCostBreakdown && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-emerald-900 mb-1">
                  Recommended for Your Scenario
                </h3>
                <p className="text-emerald-700 leading-relaxed">
                  Based on your current settings,{' '}
                  <strong className="font-semibold">{lowestCostBreakdown.planName}</strong> offers the lowest
                  estimated annual cost at{' '}
                  <strong className="font-semibold text-emerald-600">
                    {formatCurrency(lowestCostBreakdown.netAnnualCost)}
                  </strong>
                  .
                </p>
                <Link
                  href={`/plans/${lowestCostBreakdown.planId}`}
                  className="inline-flex items-center text-emerald-700 font-semibold mt-3 hover:text-emerald-800 group"
                >
                  View plan details
                  <ArrowRightIcon className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Year Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 2025 Plans */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">2025 Plans</h3>
                  <p className="text-sm text-slate-500">Cigna Network • Current</p>
                </div>
                <span className="px-3 py-1 bg-slate-200 text-slate-600 text-xs font-semibold rounded-full">
                  {plans2025.length} plans
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {plans2025.map((plan) => {
                const breakdown = costBreakdowns.get(plan.id);
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{plan.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">
                          {formatCurrency(plan.deductible.single)} deductible
                        </span>
                        {plan.hsaEligible && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            HSA
                          </span>
                        )}
                      </div>
                    </div>
                    {breakdown && (
                      <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
                        {formatCurrency(breakdown.netAnnualCost)}/yr
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 2026 Plans */}
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">2026 Plans</h3>
                  <p className="text-sm text-amber-600">Oxford Network • New</p>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                  {plans2026.length} plans
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {plans2026.map((plan) => {
                const breakdown = costBreakdowns.get(plan.id);
                const isLowest = lowestCostBreakdown?.planId === plan.id;
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className={`flex justify-between items-center p-4 transition-colors ${
                      isLowest
                        ? 'bg-emerald-50 hover:bg-emerald-100'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{plan.name}</p>
                        {isLowest && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <StarIcon className="h-3 w-3" />
                            Best
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-slate-500">
                          {formatCurrency(plan.deductible.single)} deductible
                        </span>
                        {plan.hsaEligible && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            HSA
                          </span>
                        )}
                      </div>
                    </div>
                    {breakdown && (
                      <span
                        className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                          isLowest ? 'text-emerald-700 bg-emerald-100' : 'text-slate-900 bg-slate-100'
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
    </div>
  );
}
