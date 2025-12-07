'use client';

import { usePlansStore } from '@/lib/store';
import { compareYearOverYear } from '@/lib/yearOverYear';
import { formatCurrency } from '@/lib/utils';
import YearOverYearChanges from '@/components/comparison/YearOverYearChanges';
import Link from 'next/link';
import {
  ArrowRightIcon,
  SparklesIcon,
  BuildingOffice2Icon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export default function WhatsNewPage() {
  const { plans } = usePlansStore();

  const plans2025 = plans.filter((p) => p.year === 2025);
  const plans2026 = plans.filter((p) => p.year === 2026);

  // Find similar plan pairs for comparison
  const planPairs = [
    {
      label: 'Basic / HSA Plans',
      plan2025: plans2025.find((p) => p.name.toLowerCase().includes('basic')),
      plan2026: plans2026.find(
        (p) => p.name.toLowerCase().includes('basic a') || p.name.toLowerCase().includes('liberty hsa)')
      ),
    },
    {
      label: 'Buy-Up Plans',
      plan2025: plans2025.find((p) => p.name.toLowerCase().includes('buy-up')),
      plan2026: plans2026.find((p) => p.name.toLowerCase().includes('buy-up')),
    },
    {
      label: 'Value Plans',
      plan2025: plans2025.find((p) => p.name.toLowerCase().includes('value')),
      plan2026: plans2026.find((p) => p.name.toLowerCase().includes('value')),
    },
  ];

  const keyChanges = [
    {
      icon: BuildingOffice2Icon,
      title: 'New Insurance Carrier',
      description:
        'We are transitioning from Cigna to Oxford (UnitedHealthcare) for 2026. This brings new network options and providers.',
      color: 'bg-blue-500',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Two HSA-Eligible Options',
      description:
        'For 2026, both Basic A (Liberty HSA) and Basic B (Liberty HSA Plus) are HSA eligible, giving you more choice for tax-advantaged savings.',
      color: 'bg-green-500',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Lower Out-of-Pocket Maximums',
      description:
        'Most 2026 plans have reduced OOP maximums, limiting your maximum potential healthcare spending.',
      color: 'bg-purple-500',
    },
    {
      icon: HeartIcon,
      title: 'Specialty Drug Changes',
      description:
        'New accumulator program rules affect how manufacturer copay assistance applies to your deductible and OOP max.',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 md:p-12 text-white mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8" />
          <h1 className="text-3xl md:text-4xl font-bold">What&apos;s New in 2026</h1>
        </div>
        <p className="text-lg text-orange-100 max-w-2xl mb-6">
          Important changes to your health benefits for the upcoming year. Review
          the key updates and compare how your current plan options have evolved.
        </p>
        <Link
          href="/compare"
          className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
        >
          Compare All Plans
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </Link>
      </div>

      {/* Key Changes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Changes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {keyChanges.map((change, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 ${change.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <change.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {change.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{change.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2026 Plans Overview */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          2026 Plan Options at a Glance
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans2026.map((plan) => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  New
                </span>
                {plan.hsaEligible && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    HSA
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{plan.network}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Deductible</span>
                  <span className="font-medium">
                    {formatCurrency(plan.deductible.single)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">OOP Max</span>
                  <span className="font-medium">
                    {formatCurrency(plan.oopMax.single)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Premium</span>
                  <span className="font-medium">
                    {formatCurrency(plan.premiums.single)}/wk
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Plan Comparisons */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Year-Over-Year Plan Comparisons
        </h2>
        <div className="space-y-8">
          {planPairs.map((pair, index) => {
            if (!pair.plan2025 || !pair.plan2026) return null;
            const comparison = compareYearOverYear(pair.plan2025, pair.plan2026);

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">{pair.label}</h3>
                  <p className="text-sm text-gray-500">
                    {pair.plan2025.name} → {pair.plan2026.name}
                  </p>
                </div>
                <div className="p-6">
                  <YearOverYearChanges comparison={comparison} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Ready to Choose Your 2026 Plan?
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Use our cost modeling tool to see how much each plan would cost based
          on your expected healthcare usage.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/model"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Model My Costs
          </Link>
          <Link
            href="/compare"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Compare Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
