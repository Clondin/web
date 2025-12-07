import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getEnrollmentLabel(type: string): string {
  const labels: Record<string, string> = {
    single: 'Single',
    couple: 'Employee + Spouse',
    employeeChild: 'Employee + Child(ren)',
    family: 'Family',
  };
  return labels[type] || type;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatCopay(copay: number | 'deductible'): string {
  if (copay === 'deductible') {
    return 'After Deductible';
  }
  return formatCurrency(copay);
}

export function formatCopayShort(copay: number | 'deductible'): string {
  if (copay === 'deductible') {
    return 'After Ded.';
  }
  return formatCurrency(copay);
}

export function safePercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min((value / total) * 100, 100);
}
