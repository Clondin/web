import { HealthPlan, YearOverYearChange, PlanYearComparison } from '@/types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function determineChangeType(
  oldValue: number | string | undefined,
  newValue: number | string | undefined
): 'increase' | 'decrease' | 'same' | 'new' | 'removed' {
  if (oldValue === undefined) return 'new';
  if (newValue === undefined) return 'removed';
  if (oldValue === newValue) return 'same';
  if (typeof oldValue === 'number' && typeof newValue === 'number') {
    return newValue > oldValue ? 'increase' : 'decrease';
  }
  return 'same';
}

function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
}

function determineImpact(
  category: YearOverYearChange['category'],
  changeType: 'increase' | 'decrease' | 'same' | 'new' | 'removed'
): 'positive' | 'negative' | 'neutral' {
  if (changeType === 'same') return 'neutral';

  // For costs (premium, deductible, copay, rx), increase is bad, decrease is good
  if (['premium', 'deductible', 'copay', 'rx'].includes(category)) {
    return changeType === 'decrease' ? 'positive' : 'negative';
  }

  // For benefits, increase is good, decrease is bad
  if (category === 'benefits') {
    return changeType === 'increase' ? 'positive' : 'negative';
  }

  return 'neutral';
}

export function compareYearOverYear(plan2025?: HealthPlan, plan2026?: HealthPlan): PlanYearComparison {
  const changes: YearOverYearChange[] = [];

  if (!plan2025 && !plan2026) {
    return { changes: [], summary: 'No plans to compare.' };
  }

  if (!plan2025) {
    return {
      plan2026,
      changes: [
        {
          field: 'plan',
          displayName: 'Plan Status',
          category: 'benefits',
          oldValue: 'N/A',
          newValue: 'New Plan',
          changeType: 'new',
          impact: 'neutral',
        },
      ],
      summary: `${plan2026!.name} is a new plan for 2026.`,
    };
  }

  if (!plan2026) {
    return {
      plan2025,
      changes: [
        {
          field: 'plan',
          displayName: 'Plan Status',
          category: 'benefits',
          oldValue: plan2025.name,
          newValue: 'Discontinued',
          changeType: 'removed',
          impact: 'neutral',
        },
      ],
      summary: `${plan2025.name} has been discontinued for 2026.`,
    };
  }

  // Compare carrier/network
  if (plan2025.carrier !== plan2026.carrier) {
    changes.push({
      field: 'carrier',
      displayName: 'Insurance Carrier',
      category: 'network',
      oldValue: plan2025.carrier,
      newValue: plan2026.carrier,
      changeType: 'same',
      impact: 'neutral',
    });
  }

  if (plan2025.network !== plan2026.network) {
    changes.push({
      field: 'network',
      displayName: 'Network',
      category: 'network',
      oldValue: plan2025.network,
      newValue: plan2026.network,
      changeType: 'same',
      impact: 'neutral',
    });
  }

  // Compare premiums
  const premiumFields: { key: keyof HealthPlan['premiums']; label: string }[] = [
    { key: 'single', label: 'Single' },
    { key: 'couple', label: 'Employee + Spouse' },
    { key: 'employeeChild', label: 'Employee + Child' },
    { key: 'family', label: 'Family' },
  ];

  for (const { key, label } of premiumFields) {
    const oldVal = plan2025.premiums[key];
    const newVal = plan2026.premiums[key];
    if (oldVal !== newVal) {
      const changeType = determineChangeType(oldVal, newVal);
      changes.push({
        field: `premium_${key}`,
        displayName: `Weekly Premium (${label})`,
        category: 'premium',
        oldValue: formatCurrency(oldVal),
        newValue: formatCurrency(newVal),
        changeType,
        percentChange: calculatePercentChange(oldVal, newVal),
        impact: determineImpact('premium', changeType),
      });
    }
  }

  // Compare deductibles
  if (plan2025.deductible.single !== plan2026.deductible.single) {
    const changeType = determineChangeType(plan2025.deductible.single, plan2026.deductible.single);
    changes.push({
      field: 'deductible_single',
      displayName: 'Deductible (Single)',
      category: 'deductible',
      oldValue: formatCurrency(plan2025.deductible.single),
      newValue: formatCurrency(plan2026.deductible.single),
      changeType,
      percentChange: calculatePercentChange(plan2025.deductible.single, plan2026.deductible.single),
      impact: determineImpact('deductible', changeType),
    });
  }

  if (plan2025.deductible.family !== plan2026.deductible.family) {
    const changeType = determineChangeType(plan2025.deductible.family, plan2026.deductible.family);
    changes.push({
      field: 'deductible_family',
      displayName: 'Deductible (Family)',
      category: 'deductible',
      oldValue: formatCurrency(plan2025.deductible.family),
      newValue: formatCurrency(plan2026.deductible.family),
      changeType,
      percentChange: calculatePercentChange(plan2025.deductible.family, plan2026.deductible.family),
      impact: determineImpact('deductible', changeType),
    });
  }

  // Compare OOP Max
  if (plan2025.oopMax.single !== plan2026.oopMax.single) {
    const changeType = determineChangeType(plan2025.oopMax.single, plan2026.oopMax.single);
    changes.push({
      field: 'oop_single',
      displayName: 'OOP Max (Single)',
      category: 'deductible',
      oldValue: formatCurrency(plan2025.oopMax.single),
      newValue: formatCurrency(plan2026.oopMax.single),
      changeType,
      percentChange: calculatePercentChange(plan2025.oopMax.single, plan2026.oopMax.single),
      impact: determineImpact('deductible', changeType),
    });
  }

  if (plan2025.oopMax.family !== plan2026.oopMax.family) {
    const changeType = determineChangeType(plan2025.oopMax.family, plan2026.oopMax.family);
    changes.push({
      field: 'oop_family',
      displayName: 'OOP Max (Family)',
      category: 'deductible',
      oldValue: formatCurrency(plan2025.oopMax.family),
      newValue: formatCurrency(plan2026.oopMax.family),
      changeType,
      percentChange: calculatePercentChange(plan2025.oopMax.family, plan2026.oopMax.family),
      impact: determineImpact('deductible', changeType),
    });
  }

  // Compare coinsurance
  if (plan2025.coinsurance !== plan2026.coinsurance) {
    const changeType = determineChangeType(plan2025.coinsurance, plan2026.coinsurance);
    changes.push({
      field: 'coinsurance',
      displayName: 'Coinsurance',
      category: 'copay',
      oldValue: `${plan2025.coinsurance}/${100 - plan2025.coinsurance}`,
      newValue: `${plan2026.coinsurance}/${100 - plan2026.coinsurance}`,
      changeType,
      impact: determineImpact('copay', changeType),
    });
  }

  // Compare HSA eligibility
  if (plan2025.hsaEligible !== plan2026.hsaEligible) {
    changes.push({
      field: 'hsa',
      displayName: 'HSA Eligible',
      category: 'benefits',
      oldValue: plan2025.hsaEligible ? 'Yes' : 'No',
      newValue: plan2026.hsaEligible ? 'Yes' : 'No',
      changeType: plan2026.hsaEligible ? 'increase' : 'decrease',
      impact: plan2026.hsaEligible ? 'positive' : 'negative',
    });
  }

  // Compare HRA
  const hraChanged =
    (plan2025.hraAmount?.single || 0) !== (plan2026.hraAmount?.single || 0) ||
    (plan2025.hraAmount?.family || 0) !== (plan2026.hraAmount?.family || 0);

  if (hraChanged) {
    const oldHra = plan2025.hraAmount
      ? `${formatCurrency(plan2025.hraAmount.single)} / ${formatCurrency(plan2025.hraAmount.family)}`
      : 'N/A';
    const newHra = plan2026.hraAmount
      ? `${formatCurrency(plan2026.hraAmount.single)} / ${formatCurrency(plan2026.hraAmount.family)}`
      : 'N/A';
    const changeType = determineChangeType(
      plan2025.hraAmount?.single || 0,
      plan2026.hraAmount?.single || 0
    );
    changes.push({
      field: 'hra',
      displayName: 'Employer HRA',
      category: 'benefits',
      oldValue: oldHra,
      newValue: newHra,
      changeType,
      impact: changeType === 'increase' ? 'positive' : changeType === 'decrease' ? 'negative' : 'neutral',
    });
  }

  // Generate summary
  const increaseCount = changes.filter((c) => c.changeType === 'increase').length;
  const decreaseCount = changes.filter((c) => c.changeType === 'decrease').length;

  let summary = '';
  if (changes.length === 0) {
    summary = 'No significant changes between plan years.';
  } else {
    const parts = [];
    if (increaseCount > 0) {
      parts.push(`${increaseCount} increase${increaseCount > 1 ? 's' : ''}`);
    }
    if (decreaseCount > 0) {
      parts.push(`${decreaseCount} decrease${decreaseCount > 1 ? 's' : ''}`);
    }
    summary = `${changes.length} changes: ${parts.join(', ')}.`;
  }

  return {
    plan2025,
    plan2026,
    changes,
    summary,
  };
}
