import { HealthPlan, YearOverYearChange, PlanYearComparison } from '@/types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value}%`;
}

function formatCopay(copay: number | 'deductible'): string {
  return copay === 'deductible' ? 'After Deductible' : formatCurrency(copay);
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
          oldValue: 'N/A',
          newValue: 'New Plan',
          changeType: 'new',
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
          oldValue: plan2025.name,
          newValue: 'Discontinued',
          changeType: 'removed',
        },
      ],
      summary: `${plan2025.name} has been discontinued for 2026.`,
    };
  }

  if (plan2025.carrier !== plan2026.carrier) {
    changes.push({
      field: 'carrier',
      displayName: 'Insurance Carrier',
      oldValue: plan2025.carrier,
      newValue: plan2026.carrier,
      changeType: 'same',
    });
  }

  if (plan2025.network !== plan2026.network) {
    changes.push({
      field: 'network',
      displayName: 'Network',
      oldValue: plan2025.network,
      newValue: plan2026.network,
      changeType: 'same',
    });
  }

  const premiumFields: (keyof HealthPlan['premiums'])[] = ['single', 'couple', 'employeeChild', 'family'];
  const premiumLabels: Record<string, string> = {
    single: 'Single',
    couple: 'Employee + Spouse',
    employeeChild: 'Employee + Child(ren)',
    family: 'Family',
  };

  for (const field of premiumFields) {
    const oldVal = plan2025.premiums[field];
    const newVal = plan2026.premiums[field];
    if (oldVal !== newVal) {
      changes.push({
        field: `premium_${field}`,
        displayName: `Weekly Premium (${premiumLabels[field]})`,
        oldValue: formatCurrency(oldVal),
        newValue: formatCurrency(newVal),
        changeType: determineChangeType(oldVal, newVal),
        percentChange: calculatePercentChange(oldVal, newVal),
      });
    }
  }

  if (plan2025.deductible.single !== plan2026.deductible.single) {
    changes.push({
      field: 'deductible_single',
      displayName: 'Deductible (Single)',
      oldValue: formatCurrency(plan2025.deductible.single),
      newValue: formatCurrency(plan2026.deductible.single),
      changeType: determineChangeType(plan2025.deductible.single, plan2026.deductible.single),
      percentChange: calculatePercentChange(plan2025.deductible.single, plan2026.deductible.single),
    });
  }

  if (plan2025.deductible.family !== plan2026.deductible.family) {
    changes.push({
      field: 'deductible_family',
      displayName: 'Deductible (Family)',
      oldValue: formatCurrency(plan2025.deductible.family),
      newValue: formatCurrency(plan2026.deductible.family),
      changeType: determineChangeType(plan2025.deductible.family, plan2026.deductible.family),
      percentChange: calculatePercentChange(plan2025.deductible.family, plan2026.deductible.family),
    });
  }

  if (plan2025.oopMax.single !== plan2026.oopMax.single) {
    changes.push({
      field: 'oopMax_single',
      displayName: 'Out-of-Pocket Max (Single)',
      oldValue: formatCurrency(plan2025.oopMax.single),
      newValue: formatCurrency(plan2026.oopMax.single),
      changeType: determineChangeType(plan2025.oopMax.single, plan2026.oopMax.single),
      percentChange: calculatePercentChange(plan2025.oopMax.single, plan2026.oopMax.single),
    });
  }

  if (plan2025.oopMax.family !== plan2026.oopMax.family) {
    changes.push({
      field: 'oopMax_family',
      displayName: 'Out-of-Pocket Max (Family)',
      oldValue: formatCurrency(plan2025.oopMax.family),
      newValue: formatCurrency(plan2026.oopMax.family),
      changeType: determineChangeType(plan2025.oopMax.family, plan2026.oopMax.family),
      percentChange: calculatePercentChange(plan2025.oopMax.family, plan2026.oopMax.family),
    });
  }

  if (plan2025.coinsurance !== plan2026.coinsurance) {
    changes.push({
      field: 'coinsurance',
      displayName: 'Coinsurance',
      oldValue: formatPercentage(plan2025.coinsurance),
      newValue: formatPercentage(plan2026.coinsurance),
      changeType: determineChangeType(plan2025.coinsurance, plan2026.coinsurance),
    });
  }

  const copayFields: (keyof HealthPlan['copays'])[] = ['pcp', 'specialist', 'urgentCare', 'er'];
  const copayLabels: Record<string, string> = {
    pcp: 'PCP Visit',
    specialist: 'Specialist Visit',
    urgentCare: 'Urgent Care',
    er: 'Emergency Room',
  };

  for (const field of copayFields) {
    const oldVal = plan2025.copays[field];
    const newVal = plan2026.copays[field];
    if (oldVal !== newVal) {
      changes.push({
        field: `copay_${field}`,
        displayName: `${copayLabels[field]} Copay`,
        oldValue: formatCopay(oldVal),
        newValue: formatCopay(newVal),
        changeType: 'same',
      });
    }
  }

  const rxFields: (keyof HealthPlan['rxTiers'])[] = ['tier1', 'tier2', 'tier3'];
  const rxLabels: Record<string, string> = {
    tier1: 'Tier 1 (Generic) Rx',
    tier2: 'Tier 2 (Preferred) Rx',
    tier3: 'Tier 3 (Non-Preferred) Rx',
  };

  for (const field of rxFields) {
    const oldVal = plan2025.rxTiers[field];
    const newVal = plan2026.rxTiers[field];
    if (typeof oldVal === 'number' && typeof newVal === 'number' && oldVal !== newVal) {
      changes.push({
        field: `rx_${field}`,
        displayName: `${rxLabels[field]} Copay`,
        oldValue: formatCurrency(oldVal),
        newValue: formatCurrency(newVal),
        changeType: determineChangeType(oldVal, newVal),
        percentChange: calculatePercentChange(oldVal, newVal),
      });
    }
  }

  if (plan2025.hsaEligible !== plan2026.hsaEligible) {
    changes.push({
      field: 'hsaEligible',
      displayName: 'HSA Eligible',
      oldValue: plan2025.hsaEligible ? 'Yes' : 'No',
      newValue: plan2026.hsaEligible ? 'Yes' : 'No',
      changeType: plan2026.hsaEligible ? 'new' : 'removed',
    });
  }

  const hadHra = plan2025.hraAmount !== undefined;
  const hasHra = plan2026.hraAmount !== undefined;

  if (hadHra !== hasHra) {
    changes.push({
      field: 'hraEligible',
      displayName: 'HRA Benefit',
      oldValue: hadHra ? `${formatCurrency(plan2025.hraAmount!.single)}/${formatCurrency(plan2025.hraAmount!.family)}` : 'None',
      newValue: hasHra ? `${formatCurrency(plan2026.hraAmount!.single)}/${formatCurrency(plan2026.hraAmount!.family)}` : 'None',
      changeType: hasHra ? 'new' : 'removed',
    });
  } else if (hadHra && hasHra) {
    if (plan2025.hraAmount!.single !== plan2026.hraAmount!.single) {
      changes.push({
        field: 'hra_single',
        displayName: 'HRA Amount (Single)',
        oldValue: formatCurrency(plan2025.hraAmount!.single),
        newValue: formatCurrency(plan2026.hraAmount!.single),
        changeType: determineChangeType(plan2025.hraAmount!.single, plan2026.hraAmount!.single),
      });
    }
  }

  let summary = `Comparing ${plan2025.name} (2025) to ${plan2026.name} (2026):\n\n`;

  const improvements = changes.filter(c => c.changeType === 'decrease' || c.changeType === 'new');
  const worsenings = changes.filter(c => c.changeType === 'increase' || c.changeType === 'removed');
  const neutral = changes.filter(c => c.changeType === 'same');

  if (improvements.length > 0) {
    summary += `Improvements: ${improvements.map(c => c.displayName).join(', ')}\n`;
  }

  if (worsenings.length > 0) {
    summary += `Changes to review: ${worsenings.map(c => c.displayName).join(', ')}\n`;
  }

  if (neutral.length > 0) {
    summary += `Other changes: ${neutral.length}\n`;
  }

  if (changes.length === 0) {
    summary = 'No significant changes between 2025 and 2026 plans.';
  }

  return {
    plan2025,
    plan2026,
    changes,
    summary,
  };
}

export function generateWhatsNewSummary(plans2025: HealthPlan[], plans2026: HealthPlan[]): string {
  let summary = '# What\'s New in 2026 Benefits\n\n';

  const oldCarrier = plans2025[0]?.carrier;
  const newCarrier = plans2026[0]?.carrier;
  if (oldCarrier !== newCarrier) {
    summary += `## Network Change\n`;
    summary += `We're transitioning from **${oldCarrier}** to **${newCarrier}** for 2026. `;
    summary += `This brings new network options and plan designs.\n\n`;
  }

  summary += `## 2026 Plan Options\n\n`;
  for (const plan of plans2026) {
    summary += `### ${plan.name}\n`;
    summary += `- **Network:** ${plan.network}\n`;
    summary += `- **Deductible:** ${formatCurrency(plan.deductible.single)} / ${formatCurrency(plan.deductible.family)}\n`;
    summary += `- **OOP Max:** ${formatCurrency(plan.oopMax.single)} / ${formatCurrency(plan.oopMax.family)}\n`;
    summary += `- **HSA Eligible:** ${plan.hsaEligible ? 'Yes' : 'No'}\n`;
    if (plan.highlights) {
      summary += `- **Key Features:**\n`;
      plan.highlights.forEach(h => {
        summary += `  - ${h}\n`;
      });
    }
    summary += '\n';
  }

  summary += `## Key Changes from 2025\n\n`;
  summary += `- **New carrier:** Oxford replaces Cigna\n`;
  summary += `- **Two HSA options:** Basic A and Basic B both support HSA\n`;
  summary += `- **Network options:** Freedom (widest), Liberty, Metro (narrowest)\n`;

  return summary;
}
