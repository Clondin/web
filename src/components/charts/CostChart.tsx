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
    name: b.planName.replace(/^\d{4}\s+/, '').replace(' Plan', ''),
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
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200">
          <p className="font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{label}</p>
          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center space-x-6 py-1 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600">{entry.name}</span>
              </span>
              <span className="font-semibold text-slate-900">
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm font-medium text-slate-600">{value}</span>}
          />
          <Bar dataKey="premium" stackId="a" fill="#3b82f6" name="Premium" radius={[0, 0, 0, 0]} />
          <Bar dataKey="medical" stackId="a" fill="#8b5cf6" name="Medical" />
          <Bar dataKey="rx" stackId="a" fill="#f59e0b" name="Prescriptions" />
          <Bar dataKey="taxSavings" stackId="a" fill="#10b981" name="Tax Savings" />
          <Bar dataKey="hraCredit" stackId="a" fill="#06b6d4" name="HRA Credit" radius={[4, 4, 0, 0]} />
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
      name: b.planName.replace(/^\d{4}\s+/, '').replace(' Plan', ''),
      cost: b.netAnnualCost,
      planId: b.planId,
      year: b.year,
    }))
    .sort((a, b) => a.cost - b.cost);

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: { name: string; cost: number; planId: string; year: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const isLowest = item.planId === lowestCostId;
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200">
          <p className="font-bold text-slate-900">{item.name}</p>
          <p className="text-sm text-slate-500 mb-2">{item.year} Plan</p>
          <p className={`text-lg font-bold ${isLowest ? 'text-emerald-600' : 'text-slate-900'}`}>
            {formatCurrency(item.cost)}
            <span className="text-sm font-normal text-slate-500">/year</span>
          </p>
          {isLowest && (
            <span className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
              Lowest Cost
            </span>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 13, fill: '#334155', fontWeight: 500 }}
            width={110}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="cost" radius={[0, 8, 8, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.planId === lowestCostId ? 'url(#greenGradient)' : 'url(#blueGradient)'}
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
