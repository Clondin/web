'use client';

import Link from 'next/link';
import { usePlansStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
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
  QuestionMarkCircleIcon,
  LightBulbIcon,
  HeartIcon,
  BanknotesIcon,
  InformationCircleIcon,
  XMarkIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ScaleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { StarIcon, CheckIcon } from '@heroicons/react/24/solid';

// Tooltip component for educational content
function Tooltip({ term, definition, children }: { term: string; definition: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="border-b border-dashed border-amber-400 cursor-help"
      >
        {children}
      </span>
      {isOpen && (
        <span className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-4 bg-slate-900 text-white text-sm rounded-2xl shadow-xl">
          <span className="font-bold text-amber-400 block mb-1">{term}</span>
          <span className="text-slate-300 leading-relaxed">{definition}</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-slate-900 rotate-45"></span>
        </span>
      )}
    </span>
  );
}

// Educational card component
function LearnCard({ icon: Icon, title, description, color }: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 ${color} group hover:scale-[1.02] transition-all duration-300`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <Icon className="h-8 w-8 text-white/90 mb-4" />
      <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
      <p className="text-white/80 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Step component for the guide
function StepCard({ number, title, description, action, href }: {
  number: number;
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className="relative">
      {/* Connector line */}
      {number < 4 && (
        <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-amber-300 to-transparent z-0"></div>
      )}
      <Link href={href} className="block relative z-10 group">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all duration-300 h-full">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/30">
            {number}
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>
          <span className="inline-flex items-center text-amber-600 font-semibold text-sm group-hover:text-amber-700">
            {action}
            <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const { plans, costBreakdowns } = usePlansStore();
  const [showTermsGuide, setShowTermsGuide] = useState(false);

  const plans2025 = plans.filter((p) => p.year === 2025);
  const plans2026 = plans.filter((p) => p.year === 2026);

  // Find lowest cost plan
  const breakdowns = Array.from(costBreakdowns.values());
  const sortedBreakdowns = [...breakdowns].sort(
    (a, b) => a.netAnnualCost - b.netAnnualCost
  );
  const lowestCostBreakdown = sortedBreakdowns[0];

  const healthTerms = [
    {
      term: 'Premium',
      icon: CurrencyDollarIcon,
      simple: 'Your regular payment',
      detailed: 'This is the amount automatically deducted from your paycheck every week to have health insurance. Think of it like a subscription fee. You pay this whether you use medical services or not.',
      example: 'If your premium is $50/week, you pay $2,600/year just to have the insurance.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      term: 'Deductible',
      icon: ShieldCheckIcon,
      simple: 'Pay this first',
      detailed: 'The amount you must pay out of your own pocket before your insurance starts helping with costs. Once you hit this amount, insurance kicks in.',
      example: 'With a $2,000 deductible, you pay the first $2,000 of medical bills yourself. After that, insurance starts sharing the cost.',
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
    {
      term: 'Coinsurance',
      icon: ScaleIcon,
      simple: 'Your share after deductible',
      detailed: 'After meeting your deductible, you and your insurance split costs. Coinsurance is shown as a ratio like 80/20, meaning insurance pays 80% and you pay 20%.',
      example: 'For a $1,000 bill after deductible with 80/20 coinsurance: Insurance pays $800, you pay $200.',
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      term: 'Out-of-Pocket Maximum',
      icon: BanknotesIcon,
      simple: 'Your yearly spending cap',
      detailed: 'The most you\'ll ever have to pay in a year. Once you reach this limit, insurance covers 100% of covered services for the rest of the year. This protects you from catastrophic costs.',
      example: 'With a $6,000 OOP max, even if you have $100,000 in medical bills, you\'ll never pay more than $6,000.',
      color: 'bg-gradient-to-br from-rose-500 to-pink-600',
    },
    {
      term: 'HSA (Health Savings Account)',
      icon: HeartIcon,
      simple: 'Tax-free medical savings',
      detailed: 'A special savings account where money goes in tax-free, grows tax-free, and comes out tax-free when used for medical expenses. Only available with high-deductible plans. The money is yours forever and rolls over each year.',
      example: 'If you\'re in the 30% tax bracket and contribute $3,000 to an HSA, you save $900 in taxes!',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      term: 'Copay',
      icon: ClipboardDocumentListIcon,
      simple: 'Fixed fee per visit',
      detailed: 'A set dollar amount you pay for certain services, regardless of the actual cost. Common for doctor visits and prescriptions. Some plans have copays even before meeting your deductible.',
      example: 'A $30 copay for a doctor visit means you pay $30 whether the visit actually costs $100 or $300.',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Flowing design */}
      <div className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/40 to-orange-300/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/50 to-yellow-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-orange-100/40 to-amber-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 relative">
          {/* Welcome banner */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-amber-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700">Open Enrollment is Live</span>
            </div>
            <span className="text-sm text-slate-500">Deadline: December 15, 2025</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Welcome text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-full mb-6">
                <AcademicCapIcon className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">New to health insurance? We'll guide you.</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Choose the{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    right health plan
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-200/50 -z-0"></span>
                </span>
                {' '}for your needs
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Don't worry if health insurance feels confusing — we'll walk you through everything step by step.
                Answer a few simple questions about your healthcare needs, and we'll show you which plan
                saves you the most money.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/model"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 group"
                >
                  Find My Best Plan
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowTermsGuide(true)}
                  className="inline-flex items-center px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2 text-amber-500" />
                  Learn the Basics
                </button>
              </div>
            </div>

            {/* Right: Quick preview card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-sm"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">K</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Kayco Benefits Portal</h3>
                    <p className="text-sm text-slate-500">2025-2026 Open Enrollment</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">Compare {plans.length} health plan options</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">See your personalized cost estimates</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">Includes employer HRA contributions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckIcon className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-700">Calculate tax savings with HSA/FSA</span>
                  </div>
                </div>

                {lowestCostBreakdown && (
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <StarIcon className="h-5 w-5 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-700">Your Best Match</span>
                    </div>
                    <p className="font-bold text-slate-900">{lowestCostBreakdown.planName}</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(lowestCostBreakdown.netAnnualCost)}<span className="text-sm font-normal text-slate-500">/year estimated</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              <LightBulbIcon className="h-4 w-4" />
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How to Choose Your Plan
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't feel overwhelmed. Follow these four simple steps and you'll have your perfect plan picked in under 10 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              number={1}
              title="Tell Us About You"
              description="Answer simple questions about who needs coverage — just you, you and a spouse, or your whole family? We'll filter the options accordingly."
              action="Start Here"
              href="/model"
            />
            <StepCard
              number={2}
              title="Estimate Your Usage"
              description="How often do you typically see a doctor? Take any regular medications? Don't worry about exact numbers — ballpark estimates work great."
              action="Add Details"
              href="/model"
            />
            <StepCard
              number={3}
              title="Compare Your Options"
              description="We'll calculate the estimated yearly cost for each plan based on your inputs. See exactly where your money goes — premiums, deductibles, and more."
              action="See Results"
              href="/compare"
            />
            <StepCard
              number={4}
              title="Pick Your Plan"
              description="Review the details of your top choices side-by-side. Once you've decided, you're ready to enroll through HR. That's it!"
              action="Browse Plans"
              href="/plans"
            />
          </div>
        </div>
      </div>

      {/* Educational Section - Health Insurance 101 */}
      <div className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">
              <AcademicCapIcon className="h-4 w-4" />
              Health Insurance 101
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Key Terms You Should Know
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Health insurance has its own language. Here's a plain-English guide to the terms you'll see when comparing plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthTerms.map((item) => (
              <div key={item.term} className="group">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 h-full">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.term}</h3>
                  <p className="text-amber-600 font-medium text-sm mb-3">{item.simple}</p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{item.detailed}</p>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Example</p>
                    <p className="text-sm text-slate-700">{item.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => setShowTermsGuide(true)}
              className="inline-flex items-center text-amber-600 font-semibold hover:text-amber-700 group"
            >
              <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
              Still confused? See our complete glossary
              <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Redesigned as flowing cards */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <DocumentTextIcon className="h-8 w-8 text-slate-400 mb-4" />
              <p className="text-4xl font-bold mb-1">{plans2025.length}</p>
              <p className="text-slate-400 text-sm">2025 Plans (Current)</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <SparklesIcon className="h-8 w-8 text-amber-200 mb-4" />
              <p className="text-4xl font-bold mb-1">{plans2026.length}</p>
              <p className="text-amber-100 text-sm">2026 Plans (New!)</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <ShieldCheckIcon className="h-8 w-8 text-emerald-200 mb-4" />
              <p className="text-4xl font-bold mb-1">{plans.filter((p) => p.hsaEligible).length}</p>
              <p className="text-emerald-100 text-sm">HSA-Eligible Plans</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white group hover:scale-[1.02] transition-transform">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <CurrencyDollarIcon className="h-8 w-8 text-violet-200 mb-4" />
              <p className="text-4xl font-bold mb-1">{lowestCostBreakdown ? formatCurrency(lowestCostBreakdown.netAnnualCost) : '-'}</p>
              <p className="text-violet-100 text-sm">Lowest Est. Annual Cost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Plan Section */}
      {lowestCostBreakdown && (
        <div className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-teal-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
                  <StarIcon className="h-4 w-4" />
                  Personalized Recommendation
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Based on your profile, we recommend...
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Our calculator analyzed all available plans against your expected healthcare usage.
                  This plan offers the lowest estimated total cost for your situation, including premiums,
                  expected out-of-pocket costs, and tax savings.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/plans/${lowestCostBreakdown.planId}`}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 group"
                  >
                    View Plan Details
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/model"
                    className="inline-flex items-center px-6 py-3 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 border border-slate-200 transition-colors"
                  >
                    Adjust My Inputs
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">BEST MATCH</span>
                    <StarIcon className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{lowestCostBreakdown.planName}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-emerald-600">{formatCurrency(lowestCostBreakdown.netAnnualCost)}</span>
                    <span className="text-slate-500">/year estimated</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Annual Premiums</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(lowestCostBreakdown.annualPremium)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Est. Out-of-Pocket</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(lowestCostBreakdown.totalOutOfPocket)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Tax Savings</span>
                      <span className="font-semibold text-emerald-600">-{formatCurrency(lowestCostBreakdown.totalTaxSavings)}</span>
                    </div>
                    {lowestCostBreakdown.hraCredit > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Employer HRA</span>
                        <span className="font-semibold text-emerald-600">-{formatCurrency(lowestCostBreakdown.hraCredit)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Year Overview */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Available Plans at a Glance
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Click any plan to see detailed benefits, or use the Cost Modeling tool to see how they compare for your specific situation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* 2025 Plans */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <div className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">2025 Plans</h3>
                    <p className="text-sm text-slate-500">Cigna Network • Current Coverage</p>
                  </div>
                  <span className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-full">
                    {plans2025.length} options
                  </span>
                </div>
              </div>
              <div className="bg-white divide-y divide-slate-100">
                {plans2025.map((plan) => {
                  const breakdown = costBreakdowns.get(plan.id);
                  return (
                    <Link
                      key={plan.id}
                      href={`/plans/${plan.id}`}
                      className="flex justify-between items-center p-5 hover:bg-slate-50 transition-colors group"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{plan.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-slate-500">
                            <Tooltip term="Deductible" definition="The amount you pay before insurance starts covering costs">
                              {formatCurrency(plan.deductible.single)} deductible
                            </Tooltip>
                          </span>
                          {plan.hsaEligible && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                              HSA
                            </span>
                          )}
                        </div>
                      </div>
                      {breakdown && (
                        <span className="text-sm font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-xl group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                          {formatCurrency(breakdown.netAnnualCost)}/yr
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 2026 Plans */}
            <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-amber-200">
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">2026 Plans</h3>
                    <p className="text-sm text-amber-600">Oxford Network • New for Open Enrollment!</p>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg shadow-amber-500/30">
                    {plans2026.length} options
                  </span>
                </div>
              </div>
              <div className="bg-white divide-y divide-slate-100">
                {plans2026.map((plan) => {
                  const breakdown = costBreakdowns.get(plan.id);
                  const isLowest = lowestCostBreakdown?.planId === plan.id;
                  return (
                    <Link
                      key={plan.id}
                      href={`/plans/${plan.id}`}
                      className={`flex justify-between items-center p-5 transition-colors group ${
                        isLowest ? 'bg-emerald-50/50 hover:bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">{plan.name}</p>
                          {isLowest && (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                              <StarIcon className="h-3 w-3" />
                              Best
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-slate-500">
                            <Tooltip term="Deductible" definition="The amount you pay before insurance starts covering costs">
                              {formatCurrency(plan.deductible.single)} deductible
                            </Tooltip>
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
                          className={`text-sm font-bold px-4 py-2 rounded-xl transition-colors ${
                            isLowest
                              ? 'text-emerald-700 bg-emerald-100 group-hover:bg-emerald-200'
                              : 'text-slate-900 bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-700'
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

          <div className="mt-10 text-center">
            <Link
              href="/plans"
              className="inline-flex items-center text-amber-600 font-semibold text-lg hover:text-amber-700 group"
            >
              View all plans with full details
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Common Questions</h2>
            <p className="text-lg text-slate-600">Quick answers to help you make your decision</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What's the difference between 2025 and 2026 plans?",
                a: "The 2026 plans use a new network (Oxford instead of Cigna), may have different deductibles and premiums, and include updated benefits. The Cost Modeling tool will show you exactly how costs compare for your situation."
              },
              {
                q: "Should I choose the plan with the lowest premium?",
                a: "Not necessarily! A lower premium often means higher deductibles and out-of-pocket costs. If you expect to use healthcare regularly, a higher premium plan with lower deductibles might save you money overall. Use our Cost Modeling tool to see your true total cost."
              },
              {
                q: "What is an HSA and why does it matter?",
                a: "An HSA (Health Savings Account) lets you save pre-tax money for medical expenses. The money is yours forever, grows tax-free, and can be used tax-free for qualified medical expenses. Only high-deductible plans qualify for HSAs. If you're in a high tax bracket, the tax savings can be substantial."
              },
              {
                q: "How accurate are the cost estimates?",
                a: "Our estimates are based on the healthcare usage you enter. They're most accurate when you provide realistic estimates of your expected doctor visits, medications, and procedures. The tool also factors in tax savings and employer contributions to give you a complete picture."
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2 flex items-start gap-3">
                  <QuestionMarkCircleIcon className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-slate-600 leading-relaxed pl-9">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500">
              Still have questions? <a href="mailto:hr@kayco.com" className="text-amber-600 font-semibold hover:text-amber-700">Contact HR</a>
            </p>
          </div>
        </div>
      </div>

      {/* Terms Guide Modal */}
      {showTermsGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTermsGuide(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white rounded-t-3xl border-b border-slate-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">Health Insurance Glossary</h2>
                <button
                  onClick={() => setShowTermsGuide(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {healthTerms.map((item) => (
                  <div key={item.term} className="border-b border-slate-100 pb-6 last:border-0">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{item.term}</h3>
                        <p className="text-amber-600 font-medium text-sm mb-2">{item.simple}</p>
                        <p className="text-slate-600 mb-3">{item.detailed}</p>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Real Example</p>
                          <p className="text-sm text-slate-700">{item.example}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
