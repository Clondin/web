'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePlansStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import {
  DocumentTextIcon,
  CalculatorIcon,
  ScaleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  HeartIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { HealthPlan, CostBreakdown } from '@/types';

export default function Home() {
  const { plans, costBreakdowns } = usePlansStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const plans2025 = plans.filter((p: HealthPlan) => p.year === 2025);
  const plans2026 = plans.filter((p: HealthPlan) => p.year === 2026);

  const breakdowns = mounted ? Array.from(costBreakdowns.values()) as CostBreakdown[] : [];
  const sortedBreakdowns = breakdowns.length > 0
    ? [...breakdowns].sort(
        (a: CostBreakdown, b: CostBreakdown) => a.netAnnualCost - b.netAnnualCost
      )
    : [];
  const lowestCostBreakdown = sortedBreakdowns.length > 0 ? sortedBreakdowns[0] : null;

  const features = [
    {
      title: 'View All Plans',
      description: 'Compare 2025 and 2026 health plan options side by side',
      icon: DocumentTextIcon,
      href: '/plans',
    },
    {
      title: 'Cost Modeler',
      description: 'Input your expected usage to estimate annual costs',
      icon: CalculatorIcon,
      href: '/model',
    },
    {
      title: 'Compare Plans',
      description: 'Detailed comparison of selected plans',
      icon: ScaleIcon,
      href: '/compare',
    },
    {
      title: "What's New in 2026",
      description: 'Key changes and improvements for next year',
      icon: SparklesIcon,
      href: '/whats-new',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full text-blue-200 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-subtle"></span>
              Open Enrollment 2025-2026
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Make Smarter Health Plan Decisions
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Compare benefits, model your expected costs, and find the right health plan for your needs. 
              Our tool helps you understand the true cost of each option.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/model"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                Start Cost Analysis
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Browse All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{plans2025.length}</p>
            <p className="text-sm text-slate-500">2025 Plans</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{plans2026.length}</p>
            <p className="text-sm text-slate-500">2026 Plans</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-5 w-5 text-violet-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {plans.filter((p: HealthPlan) => p.hsaEligible).length}
            </p>
            <p className="text-sm text-slate-500">HSA Eligible</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BanknotesIcon className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {lowestCostBreakdown ? formatCurrency(lowestCostBreakdown.netAnnualCost) : '--'}
            </p>
            <p className="text-sm text-slate-500">Lowest Est. Cost</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card-professional p-6 group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <feature.icon className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {lowestCostBreakdown && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 mb-1">
                    Recommended Based on Your Profile
                  </h3>
                  <p className="text-emerald-700">
                    <strong>{lowestCostBreakdown.planName}</strong> offers the lowest estimated annual cost at{' '}
                    <strong>{formatCurrency(lowestCostBreakdown.netAnnualCost)}</strong>
                  </p>
                </div>
              </div>
              <Link
                href={`/plans/${lowestCostBreakdown.planId}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors whitespace-nowrap"
              >
                View Details
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card-professional overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                    <BuildingOffice2Icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">2025 Plans</h3>
                    <p className="text-xs text-slate-500">Cigna Network</p>
                  </div>
                </div>
                <span className="badge badge-gray">Current</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {plans2025.map((plan: HealthPlan) => {
                const breakdown = costBreakdowns.get(plan.id) as CostBreakdown | undefined;
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{plan.name}</p>
                        {plan.hsaEligible && (
                          <span className="badge badge-green text-xs">HSA</span>
                        )}
                        {plan.hraAmount && (
                          <span className="badge badge-amber text-xs">HRA</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)} deductible
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(plan.premiums.single)}/wk
                      </p>
                      {breakdown && (
                        <p className="text-sm text-slate-500">
                          Est. {formatCurrency(breakdown.netAnnualCost)}/yr
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card-professional overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">2026 Plans</h3>
                    <p className="text-xs text-slate-500">Oxford/UHC Network</p>
                  </div>
                </div>
                <span className="badge badge-blue">New</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {plans2026.map((plan: HealthPlan) => {
                const breakdown = costBreakdowns.get(plan.id) as CostBreakdown | undefined;
                const isLowest = lowestCostBreakdown?.planId === plan.id;
                return (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className={`flex items-center justify-between px-6 py-4 transition-colors ${
                      isLowest ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">{plan.name}</p>
                        {isLowest && (
                          <span className="badge badge-green text-xs">Best Value</span>
                        )}
                        {plan.hsaEligible && (
                          <span className="badge badge-green text-xs">HSA</span>
                        )}
                        {plan.hraAmount && (
                          <span className="badge badge-amber text-xs">HRA</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)} deductible
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isLowest ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {formatCurrency(plan.premiums.single)}/wk
                      </p>
                      {breakdown && (
                        <p className="text-sm text-slate-500">
                          Est. {formatCurrency(breakdown.netAnnualCost)}/yr
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-sm">BenefitsCompare</span>
            </div>
            <p className="text-sm">
              This tool provides estimates only. Consult your benefits administrator for official plan details.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
