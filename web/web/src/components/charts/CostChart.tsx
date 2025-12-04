'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CostBreakdown } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CostChartProps {
  breakdowns: CostBreakdown[];
  lowestCostId?: string;
}

export default function CostChart({ breakdowns, lowestCostId }: CostChartProps) {
  const data = breakdowns.map((b) => ({
    name: b.planName.replace(/^\d{4}\s+/, ''),
    premium: b.annualPremium,
    medical: b.totalMedicalCosts,
    rx: b.totalRxCosts,
    taxSavings: -b.totalTaxSavings,
    hraCredit: -b.hraCredit,
    total: b.netAnnualCost,
    planId: b.planId,
  }));

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center space-x-4 text-sm"
            >
              <span style={{ color: entry.color }}>{entry.name}</span>
              <span className="font-medium">
                {entry.value < 0 ? '-' : ''}
                {formatCurrency(Math.abs(entry.value))}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
          />
          <Bar dataKey="premium" stackId="a" fill="#3b82f6" name="Premium" />
          <Bar dataKey="medical" stackId="a" fill="#8b5cf6" name="Medical" />
          <Bar dataKey="rx" stackId="a" fill="#f59e0b" name="Prescriptions" />
          <Bar dataKey="taxSavings" stackId="a" fill="#10b981" name="Tax Savings" />
          <Bar dataKey="hraCredit" stackId="a" fill="#06b6d4" name="HRA Credit" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TotalCostComparisonChartProps {
  breakdowns: CostBreakdown[];
  lowestCostId?: string;
}

export function TotalCostComparisonChart({
  breakdowns,
  lowestCostId,
}: TotalCostComparisonChartProps) {
  const data = breakdowns
    .map((b) => ({
      name: b.planName.replace(/^\d{4}\s+/, ''),
      cost: b.netAnnualCost,
      planId: b.planId,
    }))
    .sort((a, b) => a.cost - b.cost);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(value) => formatCurrency(value)}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={90}
          />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value), 'Annual Cost']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.planId === lowestCostId ? '#10b981' : '#3b82f6'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
