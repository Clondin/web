'use client';

import { HealthPlan, CostBreakdown } from '@/types';
import { formatCurrency, formatCopay } from '@/lib/utils';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ComparisonTableProps {
  plans: HealthPlan[];
  breakdowns: CostBreakdown[];
  lowestCostId?: string;
}

export default function ComparisonTable({
  plans,
  breakdowns,
  lowestCostId,
}: ComparisonTableProps) {
  const getBreakdown = (planId: string) =>
    breakdowns.find((b) => b.planId === planId);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 bg-gray-50 border-b-2 border-gray-200 min-w-[200px]">
              Feature
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                className={`text-center p-3 border-b-2 min-w-[180px] ${
                  plan.id === lowestCostId
                    ? 'bg-green-50 border-green-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="space-y-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      plan.year === 2026
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {plan.year}
                  </span>
                  <div className="font-semibold text-gray-900">{plan.name}</div>
                  <div className="text-xs text-gray-500">{plan.carrier}</div>
                  {plan.id === lowestCostId && (
                    <span className="inline-block text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Best Value
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Premiums Section */}
          <tr className="bg-blue-50">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-blue-800">
              Premiums
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Weekly (Single)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.premiums.single)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Weekly (Family)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.premiums.family)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Annual (Single)</td>
            {plans.map((plan) => {
              const breakdown = getBreakdown(plan.id);
              return (
                <td
                  key={plan.id}
                  className={`p-3 border-b text-center font-medium ${
                    plan.id === lowestCostId ? 'bg-green-50' : ''
                  }`}
                >
                  {breakdown ? formatCurrency(breakdown.annualPremium) : '-'}
                </td>
              );
            })}
          </tr>

          {/* Deductibles Section */}
          <tr className="bg-purple-50">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-purple-800">
              Deductibles & Out-of-Pocket
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Deductible (Single/Family)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.deductible.single)} / {formatCurrency(plan.deductible.family)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">OOP Max (Single/Family)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.oopMax.single)} / {formatCurrency(plan.oopMax.family)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Coinsurance</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {plan.coinsurance}%
              </td>
            ))}
          </tr>

          {/* Copays Section */}
          <tr className="bg-teal-50">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-teal-800">
              Copays
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Copays Before Deductible</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {plan.copaysBeforeDeductible ? (
                  <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <XMarkIcon className="h-5 w-5 text-gray-300 mx-auto" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">PCP Visit</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.pcp)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Specialist</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.specialist)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Urgent Care</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.urgentCare)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Emergency Room</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.er)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Imaging</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.imaging)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Labs</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCopay(plan.copays.labs)}
              </td>
            ))}
          </tr>

          {/* RX Section */}
          <tr className="bg-orange-50">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-orange-800">
              Prescription Coverage
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Rx Deductible</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {plan.rxTiers.deductible === 'medical' ? (
                  <span className="text-orange-600">Medical</span>
                ) : typeof plan.rxTiers.deductible === 'number' && plan.rxTiers.deductible > 0 ? (
                  formatCurrency(plan.rxTiers.deductible)
                ) : (
                  <span className="text-green-600">None</span>
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Tier 1 (Generic)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.rxTiers.tier1)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Tier 2 (Preferred)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.rxTiers.tier2)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Tier 3 (Specialty)</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {formatCurrency(plan.rxTiers.tier3)}
              </td>
            ))}
          </tr>

          {/* Features Section */}
          <tr className="bg-green-50">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-green-800">
              Tax-Advantaged Accounts
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">HSA Eligible</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {plan.hsaEligible ? (
                  <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <XMarkIcon className="h-5 w-5 text-gray-300 mx-auto" />
                )}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">HRA Amount</td>
            {plans.map((plan) => (
              <td
                key={plan.id}
                className={`p-3 border-b text-center font-medium ${
                  plan.id === lowestCostId ? 'bg-green-50' : ''
                }`}
              >
                {plan.hraAmount ? (
                  <span className="text-green-600">
                    {formatCurrency(plan.hraAmount.single)} / {formatCurrency(plan.hraAmount.family)}
                  </span>
                ) : (
                  '-'
                )}
              </td>
            ))}
          </tr>

          {/* Estimated Costs Section */}
          <tr className="bg-gray-800">
            <td colSpan={plans.length + 1} className="p-2 font-semibold text-white">
              Estimated Annual Costs (Your Scenario)
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Total Medical Costs</td>
            {plans.map((plan) => {
              const breakdown = getBreakdown(plan.id);
              return (
                <td
                  key={plan.id}
                  className={`p-3 border-b text-center font-medium ${
                    plan.id === lowestCostId ? 'bg-green-50' : ''
                  }`}
                >
                  {breakdown ? formatCurrency(breakdown.totalMedicalCosts) : '-'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Total Rx Costs</td>
            {plans.map((plan) => {
              const breakdown = getBreakdown(plan.id);
              return (
                <td
                  key={plan.id}
                  className={`p-3 border-b text-center font-medium ${
                    plan.id === lowestCostId ? 'bg-green-50' : ''
                  }`}
                >
                  {breakdown ? formatCurrency(breakdown.totalRxCosts) : '-'}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="p-3 border-b text-gray-600">Tax Savings</td>
            {plans.map((plan) => {
              const breakdown = getBreakdown(plan.id);
              return (
                <td
                  key={plan.id}
                  className={`p-3 border-b text-center font-medium text-green-600 ${
                    plan.id === lowestCostId ? 'bg-green-50' : ''
                  }`}
                >
                  {breakdown && breakdown.totalTaxSavings > 0
                    ? `-${formatCurrency(breakdown.totalTaxSavings)}`
                    : '-'}
                </td>
              );
            })}
          </tr>
          <tr className="bg-gray-100">
            <td className="p-3 border-b font-semibold text-gray-900">
              Net Annual Cost
            </td>
            {plans.map((plan) => {
              const breakdown = getBreakdown(plan.id);
              return (
                <td
                  key={plan.id}
                  className={`p-3 border-b text-center text-lg font-bold ${
                    plan.id === lowestCostId
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-900'
                  }`}
                >
                  {breakdown ? formatCurrency(breakdown.netAnnualCost) : '-'}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
