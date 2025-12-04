'use client';

import { YearOverYearChange, PlanYearComparison } from '@/types';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

interface YearOverYearChangesProps {
  comparison: PlanYearComparison;
}

export default function YearOverYearChanges({ comparison }: YearOverYearChangesProps) {
  const { changes, summary, plan2025, plan2026 } = comparison;

  const getChangeIcon = (change: YearOverYearChange) => {
    switch (change.changeType) {
      case 'increase':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'decrease':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'new':
        return <PlusIcon className="h-4 w-4 text-blue-500" />;
      case 'removed':
        return <XMarkIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeClass = (change: YearOverYearChange) => {
    switch (change.changeType) {
      case 'increase':
        return 'bg-red-50 border-red-200';
      case 'decrease':
        return 'bg-green-50 border-green-200';
      case 'new':
        return 'bg-blue-50 border-blue-200';
      case 'removed':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const improvements = changes.filter(
    (c) => c.changeType === 'decrease' || c.changeType === 'new'
  );
  const worsenings = changes.filter(
    (c) => c.changeType === 'increase' || c.changeType === 'removed'
  );
  const neutral = changes.filter((c) => c.changeType === 'same');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Year-Over-Year Comparison</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            {plan2025?.name || '2025 Plan'}
          </div>
          <span>→</span>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            {plan2026?.name || '2026 Plan'}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{improvements.length}</div>
          <div className="text-sm text-green-700">Improvements</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{worsenings.length}</div>
          <div className="text-sm text-red-700">Increases</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-600">{neutral.length}</div>
          <div className="text-sm text-gray-700">Other Changes</div>
        </div>
      </div>

      {/* Changes List */}
      {changes.length > 0 ? (
        <div className="space-y-3">
          {changes.map((change, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${getChangeClass(
                change
              )}`}
            >
              <div className="flex items-center space-x-3">
                {getChangeIcon(change)}
                <span className="font-medium text-gray-900">
                  {change.displayName}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 line-through text-sm">
                  {change.oldValue}
                </span>
                <span className="text-gray-400">→</span>
                <span className="font-semibold text-gray-900">
                  {change.newValue}
                </span>
                {change.percentChange !== undefined && change.percentChange !== 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      change.percentChange > 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {change.percentChange > 0 ? '+' : ''}
                    {change.percentChange}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No significant changes between these plans.
        </div>
      )}

      {/* Summary Text */}
      {summary && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
          <p className="text-sm text-blue-800 whitespace-pre-line">{summary}</p>
        </div>
      )}
    </div>
  );
}
