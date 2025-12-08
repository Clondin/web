'use client';

import { usePlansStore } from '@/lib/store';
import ScenarioForm from '@/components/modeling/ScenarioForm';
import CostBreakdownCard from '@/components/modeling/CostBreakdownCard';
import CostChart, { TotalCostComparisonChart } from '@/components/charts/CostChart';
import Link from 'next/link';
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  SparklesIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// Help tip component
function HelpTip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
      <div className="flex items-start gap-3">
        <LightBulbIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">{title}</p>
          <p className="text-amber-700 text-sm leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default function ModelPage() {
  const { plans, costBreakdowns, selectedPlanIds, selectPlan, scenario } = usePlansStore();

  // Get breakdowns and sort by cost
  const breakdowns = Array.from(costBreakdowns.values());
  const sortedBreakdowns = [...breakdowns].sort(
    (a, b) => a.netAnnualCost - b.netAnnualCost
  );
  const lowestCostId = sortedBreakdowns[0]?.planId;
  const lowestCostBreakdown = sortedBreakdowns[0];

  const plans2025 = plans.filter((p) => p.year === 2025);
  const plans2026 = plans.filter((p) => p.year === 2026);

  const handleSelectForCompare = (planId: string) => {
    if (!selectedPlanIds.includes(planId)) {
      selectPlan(planId);
    }
  };

  // Check if user has modified the defaults
  const hasCustomInputs = scenario.pcpVisits > 0 || scenario.specialistVisits > 0 || scenario.genericRxCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-400/5 to-orange-500/5 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium mb-4">
                <AcademicCapIcon className="h-4 w-4" />
                Step 1 & 2: Tell us about yourself
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Cost Modeling Tool
              </h1>
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                Answer simple questions about your healthcare needs, and we'll calculate
                your estimated annual cost for each plan. The more accurate your inputs,
                the better our recommendations.
              </p>
            </div>

            {selectedPlanIds.length > 0 && (
              <Link
                href="/compare"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 group flex-shrink-0"
              >
                <ArrowsRightLeftIcon className="h-5 w-5 mr-2" />
                Compare {selectedPlanIds.length} Plans
                <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L48 52.5C96 45 192 30 288 25C384 20 480 25 576 30C672 35 768 40 864 40C960 40 1056 35 1152 32.5C1248 30 1344 30 1392 30L1440 30V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="rgb(249 250 251)"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions Banner */}
        {!hasCustomInputs && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <LightBulbIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Getting Started</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Use the form on the left to enter your expected healthcare usage for the year.
                  Don't worry about being exact — rough estimates work fine! As you adjust the inputs,
                  the cost estimates on the right will update automatically.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Select your coverage type (just you, family, etc.)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Estimate doctor visits and prescriptions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Enter any HSA or FSA contributions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Scenario Form - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <ScenarioForm />

              {/* Contextual Help */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-amber-500" />
                  <h4 className="font-semibold text-slate-900">Quick Tips</h4>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <strong className="text-slate-700">Not sure how many visits?</strong> Most healthy adults see a doctor 2-4 times per year.
                  </p>
                  <p>
                    <strong className="text-slate-700">Taking medications?</strong> Count each different medication you take regularly.
                  </p>
                  <p>
                    <strong className="text-slate-700">HSA contributions</strong> are tax-free and can significantly reduce your net cost on high-deductible plans.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Header */}
            {lowestCostBreakdown && (
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StarIcon className="h-5 w-5 text-emerald-200" />
                      <span className="text-emerald-100 font-medium text-sm">Best Value for Your Scenario</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{lowestCostBreakdown.planName}</h2>
                    <p className="text-emerald-100">
                      Estimated annual cost: <span className="font-bold text-white text-xl">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lowestCostBreakdown.netAnnualCost)}</span>
                    </p>
                  </div>
                  <Link
                    href={`/plans/${lowestCostBreakdown.planId}`}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-semibold text-sm transition-colors backdrop-blur-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                      <ChartBarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Annual Cost Comparison
                      </h2>
                      <p className="text-sm text-slate-500">All plans ranked by your estimated total cost</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <HelpTip title="How to read this chart">
                    The bars show your estimated total annual cost for each plan. This includes your premium payments,
                    expected out-of-pocket costs based on your healthcare usage, minus any tax savings from HSA/FSA contributions
                    and employer HRA credits. Lower is better!
                  </HelpTip>
                  <div className="mt-6">
                    <TotalCostComparisonChart
                      breakdowns={sortedBreakdowns}
                      lowestCostId={lowestCostId}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Cost Breakdown by Category
                      </h2>
                      <p className="text-sm text-slate-500">Understand where your money goes</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <HelpTip title="Understanding the breakdown">
                    This shows how your costs are split between premiums (what you pay regardless of usage),
                    medical costs (doctor visits, tests, etc.), and prescription costs. Plans with higher premiums
                    often have lower out-of-pocket costs, and vice versa.
                  </HelpTip>
                  <div className="mt-6">
                    <CostChart breakdowns={sortedBreakdowns} lowestCostId={lowestCostId} />
                  </div>
                </div>
              </div>
            </div>

            {/* 2026 Plans */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      2026 Plans
                    </h2>
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/30">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Oxford Network • These are your options for next year</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    <strong>Heads up:</strong> The 2026 plans use a different insurance network (Oxford instead of Cigna).
                    You may need to verify that your doctors are in-network. The benefits team can help with this.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {plans2026.map((plan) => {
                  const breakdown = costBreakdowns.get(plan.id);
                  const rank =
                    sortedBreakdowns.findIndex((b) => b.planId === plan.id) + 1;
                  return (
                    breakdown && (
                      <div key={plan.id} className="relative">
                        <CostBreakdownCard
                          breakdown={breakdown}
                          plan={plan}
                          isLowestCost={plan.id === lowestCostId}
                          rank={rank}
                        />
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/plans/${plan.id}`}
                            className="flex-1 text-center px-4 py-3 text-sm font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            View Full Details
                          </Link>
                          <button
                            onClick={() => handleSelectForCompare(plan.id)}
                            disabled={selectedPlanIds.includes(plan.id)}
                            className={`flex-1 text-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                              selectedPlanIds.includes(plan.id)
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {selectedPlanIds.includes(plan.id)
                              ? '✓ Selected'
                              : 'Add to Compare'}
                          </button>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>

            {/* 2025 Plans */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    2025 Plans
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Cigna Network • Your current plan options (for reference)</p>
                </div>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    These are your current 2025 plan options. Comparing them to the 2026 plans can help you understand
                    how costs are changing. Use the "What's New" page to see detailed year-over-year changes.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans2025.map((plan) => {
                  const breakdown = costBreakdowns.get(plan.id);
                  const rank =
                    sortedBreakdowns.findIndex((b) => b.planId === plan.id) + 1;
                  return (
                    breakdown && (
                      <div key={plan.id} className="relative">
                        <CostBreakdownCard
                          breakdown={breakdown}
                          plan={plan}
                          isLowestCost={plan.id === lowestCostId}
                          rank={rank}
                        />
                        <div className="mt-4 flex space-x-3">
                          <Link
                            href={`/plans/${plan.id}`}
                            className="flex-1 text-center px-4 py-3 text-sm font-semibold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => handleSelectForCompare(plan.id)}
                            disabled={selectedPlanIds.includes(plan.id)}
                            className={`flex-1 text-center px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${
                              selectedPlanIds.includes(plan.id)
                                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {selectedPlanIds.includes(plan.id)
                              ? '✓ Selected'
                              : 'Compare'}
                          </button>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Ready for the next step?</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Once you've reviewed the cost estimates, you can compare your top choices side-by-side
                to see the detailed benefits differences, or go directly to a plan's detail page to
                see everything it offers.
              </p>
              <div className="flex flex-wrap gap-4">
                {selectedPlanIds.length > 0 ? (
                  <Link
                    href="/compare"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg group"
                  >
                    Compare {selectedPlanIds.length} Selected Plans
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <p className="text-amber-300 text-sm">
                    Select at least 2 plans above to compare them side-by-side
                  </p>
                )}
                <Link
                  href="/plans"
                  className="inline-flex items-center px-6 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Browse All Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
