import { HealthPlan } from '@/types';

export const healthPlans: HealthPlan[] = [
  // ==================== 2025 PLANS (Cigna) ====================

  {
    id: '2025-buy-up',
    year: 2025,
    name: 'Buy-Up Plan',
    shortName: 'Buy-Up',
    carrier: 'Cigna',
    network: 'Cigna Open Access Plus',
    networkType: 'Open Access Plus',

    premiums: {
      single: 171,
      couple: 360,
      employeeChild: 300,
      family: 525,
    },

    deductible: {
      single: 1000,
      family: 2000,
    },
    oopMax: {
      single: 5000,
      family: 10000,
    },
    coinsurance: 80, // 80/20

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 40,
      er: 100,
      imaging: 'Deductible + 20%',
      labs: 'Deductible + 20%',
    },
    copaysBeforeDeductible: true,
    copayNotes: 'PCP, Specialist, Urgent Care, and ER copays apply before deductible',

    rxTiers: {
      tier1: 15,
      tier2: 35,
      tier3: 75,
      deductible: 0,
    },
    rxNotes: 'No Rx deductible - copays apply from day one',

    hsaEligible: false,

    description: 'Our richest plan with the lowest deductible and copays before deductible. Best for those who expect frequent healthcare visits or want more predictable costs.',
    highlights: [
      'Lowest deductible: $1,000 / $2,000',
      'Copays before deductible for office visits',
      '$0 Rx deductible',
      'Widest Cigna network access',
    ],
    considerations: [
      'Highest weekly premiums',
      'Not HSA eligible',
    ],
    isActive: true,
  },

  {
    id: '2025-value',
    year: 2025,
    name: 'Value Plan',
    shortName: 'Value',
    carrier: 'Cigna',
    network: 'Cigna Open Access',
    networkType: 'Open Access',

    premiums: {
      single: 87,
      couple: 184,
      employeeChild: 153,
      family: 267,
    },
    premiumsHighIncome: {
      single: 102,
      couple: 214,
      employeeChild: 178,
      family: 311,
    },

    deductible: {
      single: 1500,
      family: 3000,
    },
    oopMax: {
      single: 6350,
      family: 12700,
    },
    coinsurance: 70, // 70/30

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 40,
      er: 100,
      imaging: 'Deductible + 30%',
      labs: 'Deductible + 30%',
    },
    copaysBeforeDeductible: true,
    copayNotes: 'PCP, Specialist, Urgent Care, and ER copays apply before deductible',

    rxTiers: {
      tier1: 15,
      tier2: 35,
      tier3: 75,
      deductible: 100,
    },
    rxNotes: '$100 Rx deductible applies before copays',

    hsaEligible: false,

    description: 'A balanced plan with moderate premiums and copays before deductible. Good for those who want predictability without the highest premiums.',
    highlights: [
      'Income-based premiums (lower if <$200k)',
      'Copays before deductible for office visits',
      'Moderate deductible: $1,500 / $3,000',
      '$100 Rx deductible',
    ],
    considerations: [
      'Higher premiums for income >$200k',
      'Not HSA eligible',
      'Higher OOP max than Buy-Up',
    ],
    isActive: true,
  },

  {
    id: '2025-basic',
    year: 2025,
    name: 'Basic Plan (HRA)',
    shortName: 'Basic',
    carrier: 'Cigna',
    network: 'Cigna Open Access',
    networkType: 'Open Access',

    premiums: {
      single: 40,
      couple: 119,
      employeeChild: 99,
      family: 173,
    },

    deductible: {
      single: 2500,
      family: 5000,
    },
    oopMax: {
      single: 6450,
      family: 12900,
    },
    coinsurance: 70, // 70/30

    copays: {
      pcp: 'Deductible + 30%',
      specialist: 'Deductible + 30%',
      urgentCare: 'Deductible + 30%',
      er: 'Deductible + 30%',
      imaging: 'Deductible + 30%',
      labs: 'Deductible + 30%',
    },
    copaysBeforeDeductible: false,
    copayNotes: 'All services subject to deductible first, then 30% coinsurance',

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },
    rxNotes: 'Medical deductible applies to prescriptions',

    hsaEligible: true,
    hraAmount: {
      single: 1000,
      family: 2000,
    },

    description: 'High-deductible health plan with HSA eligibility and employer HRA contribution. Best for healthy individuals who want the lowest premiums and tax advantages.',
    highlights: [
      'Lowest weekly premiums',
      'HSA eligible - triple tax advantage',
      'Employer HRA: $1,000 / $2,000',
      'HRA can offset deductible costs',
    ],
    considerations: [
      'Highest deductible: $2,500 / $5,000',
      'Must meet deductible before most coverage',
      'Medical deductible applies to Rx',
    ],
    isActive: true,
  },

  // ==================== 2026 PLANS (Oxford/UHC) ====================

  {
    id: '2026-buy-up',
    year: 2026,
    name: 'Buy-Up Plan',
    shortName: 'Buy-Up',
    carrier: 'Oxford/UHC',
    network: 'Oxford Freedom',
    networkType: 'Freedom',

    premiums: {
      single: 171,
      couple: 360,
      employeeChild: 300,
      family: 525,
    },

    deductible: {
      single: 1000,
      family: 2000,
    },
    oopMax: {
      single: 4000,
      family: 8000,
    },
    coinsurance: 90, // 90/10

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 40,
      er: 100,
      imaging: 'Deductible + 10%',
      labs: 'Deductible + 10%',
    },
    copaysBeforeDeductible: true,
    copayNotes: 'PCP, Specialist, Urgent Care, and ER copays apply before deductible',

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 100,
    },
    rxNotes: '$100 Rx deductible applies before copays',

    hsaEligible: false,
    networkNotes: 'Freedom network - widest Oxford network access',

    description: 'Our richest plan with the lowest deductible, lowest OOP max, and best coinsurance. Ideal for those expecting significant healthcare needs.',
    highlights: [
      'Lowest deductible: $1,000 / $2,000',
      'Lowest OOP max: $4,000 / $8,000',
      'Best coinsurance: 90/10',
      'Oxford Freedom - widest network',
    ],
    considerations: [
      'Highest weekly premiums',
      'Not HSA eligible',
      'New $100 Rx deductible (was $0)',
    ],
    isActive: true,
  },

  {
    id: '2026-value',
    year: 2026,
    name: 'Value Plan',
    shortName: 'Value',
    carrier: 'Oxford/UHC',
    network: 'Oxford Liberty',
    networkType: 'Liberty',

    premiums: {
      single: 87,
      couple: 184,
      employeeChild: 153,
      family: 267,
    },
    premiumsHighIncome: {
      single: 102,
      couple: 214,
      employeeChild: 178,
      family: 311,
    },

    deductible: {
      single: 1500,
      family: 3000,
    },
    oopMax: {
      single: 6350,
      family: 12700,
    },
    coinsurance: 70, // 70/30

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 40,
      er: 100,
      imaging: 'Deductible + 30%',
      labs: 'Deductible + 30%',
    },
    copaysBeforeDeductible: true,
    copayNotes: 'PCP, Specialist, Urgent Care, and ER copays apply before deductible',

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 100,
    },
    rxNotes: '$100 Rx deductible applies before copays',

    hsaEligible: false,
    networkNotes: 'Liberty network - broad Oxford network access',

    description: 'A balanced plan with moderate premiums and copays before deductible. Good middle ground between cost and coverage.',
    highlights: [
      'Income-based premiums (lower if <$200k)',
      'Copays before deductible for office visits',
      'Moderate deductible: $1,500 / $3,000',
      'Oxford Liberty network',
    ],
    considerations: [
      'Higher premiums for income >$200k',
      'Not HSA eligible',
      'Rx copays increased from 2025',
    ],
    isActive: true,
  },

  {
    id: '2026-basic-a',
    year: 2026,
    name: 'Basic A - Liberty HSA',
    shortName: 'Basic A',
    carrier: 'Oxford/UHC',
    network: 'Oxford Liberty',
    networkType: 'Liberty',

    premiums: {
      single: 69,
      couple: 144,
      employeeChild: 120,
      family: 209,
    },

    deductible: {
      single: 2000,
      family: 4000,
    },
    oopMax: {
      single: 5000,
      family: 10000,
    },
    coinsurance: 70, // 70/30

    copays: {
      pcp: 'Deductible + 30%',
      specialist: 'Deductible + 30%',
      urgentCare: 'Deductible + 30%',
      er: 'Deductible + 30%',
      imaging: 'Deductible + 30%',
      labs: 'Deductible + 30%',
    },
    copaysBeforeDeductible: false,
    copayNotes: 'All services subject to deductible first, then 30% coinsurance',

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },
    rxNotes: 'Medical deductible applies to prescriptions',

    hsaEligible: true,
    networkNotes: 'Liberty network - broad Oxford network access',

    description: 'HSA-eligible high-deductible plan with lower premiums than Basic B but no HRA. Best for those who want to maximize HSA contributions.',
    highlights: [
      'HSA eligible - triple tax advantage',
      'Lower premiums than Basic B',
      'Lower OOP max: $5,000 / $10,000',
      'Oxford Liberty network',
    ],
    considerations: [
      'No employer HRA contribution',
      'Must meet deductible before coverage',
      'Medical deductible applies to Rx',
    ],
    isActive: true,
  },

  {
    id: '2026-basic-b',
    year: 2026,
    name: 'Basic B - Metro HSA + HRA',
    shortName: 'Basic B',
    carrier: 'Oxford/UHC',
    network: 'Oxford Metro',
    networkType: 'Metro',

    premiums: {
      single: 40,
      couple: 119,
      employeeChild: 99,
      family: 173,
    },

    deductible: {
      single: 2500,
      family: 5000,
    },
    oopMax: {
      single: 6450,
      family: 12900,
    },
    coinsurance: 50, // 50/50

    copays: {
      pcp: 40,
      specialist: 60,
      urgentCare: 'Deductible + 50%',
      er: '100 + Deductible + 50%',
      imaging: 'Deductible + 50%',
      labs: 'Deductible + 50%',
    },
    copaysBeforeDeductible: false,
    copayNotes: 'PCP $40 and Specialist $60 after deductible. ER has $100 copay plus deductible and coinsurance.',

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },
    rxNotes: 'Medical deductible applies. Metro network excludes CVS pharmacies.',

    hsaEligible: true,
    hraAmount: {
      single: 1000,
      family: 2000,
    },
    networkNotes: 'Metro network - smaller network, excludes CVS pharmacies',

    description: 'Lowest premium HSA plan with employer HRA contribution. Best for healthy individuals who want minimal premiums and can use the Metro network.',
    highlights: [
      'Lowest weekly premiums',
      'HSA eligible - triple tax advantage',
      'Employer HRA: $1,000 / $2,000',
      'HRA can offset deductible costs',
    ],
    considerations: [
      'Smallest network (Metro)',
      'CVS pharmacies excluded',
      'Highest coinsurance: 50/50',
      'Highest deductible: $2,500 / $5,000',
    ],
    isActive: true,
  },
];

// Helper functions
export const getPlans = (): HealthPlan[] => healthPlans;

export const getPlanById = (id: string): HealthPlan | undefined =>
  healthPlans.find(plan => plan.id === id);

export const getPlansByYear = (year: number): HealthPlan[] =>
  healthPlans.filter(plan => plan.year === year);

export const get2025Plans = (): HealthPlan[] => getPlansByYear(2025);

export const get2026Plans = (): HealthPlan[] => getPlansByYear(2026);

export const getActivePlans = (): HealthPlan[] =>
  healthPlans.filter(plan => plan.isActive);

export const getHsaPlans = (): HealthPlan[] =>
  healthPlans.filter(plan => plan.hsaEligible);

export const getPlansByNetwork = (networkType: HealthPlan['networkType']): HealthPlan[] =>
  healthPlans.filter(plan => plan.networkType === networkType);
