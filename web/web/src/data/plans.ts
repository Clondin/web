import { HealthPlan } from '@/types';

export const healthPlans: HealthPlan[] = [
  // ============ 2025 PLANS (Cigna Network) ============
  
  {
    id: '2025-buy-up',
    year: 2025,
    name: 'Buy-Up Plan',
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
    coinsurance: 20,

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 20,
      er: 100,
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: true,

    rxTiers: {
      tier1: 15,
      tier2: 35,
      tier3: 75,
      deductible: 0,
    },

    hsaEligible: false,

    description: 'Lower deductible plan with copays before deductible. Best for predictable healthcare needs with more comprehensive coverage.',
    highlights: [
      'Lowest deductible: $1,000 / $2,000',
      'Copays before deductible for PCP & Specialist',
      '80% / 20% coinsurance after deductible',
      '$0 Rx deductible',
      'OOP Max: $5,000 / $10,000',
    ],
    isActive: true,
  },

  {
    id: '2025-value',
    year: 2025,
    name: 'Value Plan',
    carrier: 'Cigna',
    network: 'Cigna Open Access',
    networkType: 'Open Access',

    premiums: {
      single: 87,
      couple: 184,
      employeeChild: 153,
      family: 267,
    },
    hasIncomeTiers: true,
    incomeTieredPremiums: {
      under200k: {
        single: 87,
        couple: 184,
        employeeChild: 153,
        family: 267,
      },
      over200k: {
        single: 102,
        couple: 214,
        employeeChild: 178,
        family: 311,
      },
    },

    deductible: {
      single: 1500,
      family: 3000,
    },
    oopMax: {
      single: 6350,
      family: 12700,
    },
    coinsurance: 30,

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 20,
      er: 100,
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: true,

    rxTiers: {
      tier1: 15,
      tier2: 35,
      tier3: 75,
      deductible: 100,
    },

    hsaEligible: false,

    description: 'Mid-tier plan with income-based premiums. Good balance between premium costs and coverage.',
    highlights: [
      'Income-based premiums (under/over $200k)',
      'Deductible: $1,500 / $3,000',
      'Copays before deductible for PCP & Specialist',
      '70% / 30% coinsurance',
      '$100 Rx deductible',
    ],
    isActive: true,
  },

  {
    id: '2025-basic',
    year: 2025,
    name: 'Basic Plan (HRA)',
    carrier: 'Cigna',
    network: 'HRA Open Access',
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
    coinsurance: 30,

    copays: {
      pcp: 'deductible',
      specialist: 'deductible',
      urgentCare: 'deductible',
      er: 'deductible',
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: false,

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },

    hsaEligible: false,
    hraAmount: {
      single: 1000,
      family: 2000,
    },

    description: 'Lowest premium option with employer HRA contribution. All services apply to deductible first.',
    highlights: [
      'Lowest weekly premiums',
      'HRA: $1,000 single / $2,000 dependents',
      'Deductible: $2,500 / $5,000',
      'All services subject to deductible',
      '70% / 30% coinsurance',
    ],
    isActive: true,
  },

  // ============ 2026 PLANS (Oxford/UHC Network) ============

  {
    id: '2026-buy-up',
    year: 2026,
    name: 'Buy-Up Plan',
    carrier: 'Oxford',
    network: 'Oxford Freedom',
    networkType: 'Freedom (Widest)',

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
    coinsurance: 10,

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 20,
      er: 100,
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: true,

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 100,
    },

    hsaEligible: false,

    description: 'Premium plan with Oxford Freedom network (widest access). Lower OOP max and better coinsurance than 2025.',
    highlights: [
      'Oxford Freedom network (widest access)',
      'Improved: 90% / 10% coinsurance',
      'Lower OOP Max: $4,000 / $8,000',
      'Deductible: $1,000 / $2,000',
      'Copays before deductible',
    ],
    isActive: true,
  },

  {
    id: '2026-value',
    year: 2026,
    name: 'Value Plan',
    carrier: 'Oxford',
    network: 'Oxford Liberty',
    networkType: 'Liberty',

    premiums: {
      single: 87,
      couple: 184,
      employeeChild: 153,
      family: 267,
    },
    hasIncomeTiers: true,
    incomeTieredPremiums: {
      under200k: {
        single: 87,
        couple: 184,
        employeeChild: 153,
        family: 267,
      },
      over200k: {
        single: 102,
        couple: 214,
        employeeChild: 178,
        family: 311,
      },
    },

    deductible: {
      single: 1500,
      family: 3000,
    },
    oopMax: {
      single: 6350,
      family: 12700,
    },
    coinsurance: 30,

    copays: {
      pcp: 20,
      specialist: 40,
      urgentCare: 20,
      er: 100,
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: true,

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 100,
    },

    hsaEligible: false,

    description: 'Mid-tier plan with Oxford Liberty network. Income-based premiums with good balance of cost and coverage.',
    highlights: [
      'Oxford Liberty network',
      'Income-based premiums (under/over $200k)',
      'Deductible: $1,500 / $3,000',
      'Copays before deductible',
      '70% / 30% coinsurance',
    ],
    isActive: true,
  },

  {
    id: '2026-basic-a',
    year: 2026,
    name: 'Basic A – Liberty HSA',
    carrier: 'Oxford',
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
    coinsurance: 30,

    copays: {
      pcp: 'deductible',
      specialist: 'deductible',
      urgentCare: 'deductible',
      er: 'deductible',
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: false,

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },

    hsaEligible: true,

    description: 'HSA-eligible high-deductible plan with Oxford Liberty network. Best for those who want tax-advantaged savings.',
    highlights: [
      'HSA Eligible – triple tax advantage',
      'Oxford Liberty network',
      'Deductible: $2,000 / $4,000',
      'Lower OOP Max: $5,000 / $10,000',
      '70% / 30% coinsurance',
    ],
    isActive: true,
  },

  {
    id: '2026-basic-b',
    year: 2026,
    name: 'Basic B – Metro HSA + HRA',
    carrier: 'Oxford',
    network: 'Oxford Metro',
    networkType: 'Metro (Narrowest)',

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
    coinsurance: 50,

    copays: {
      pcp: 40,
      specialist: 60,
      urgentCare: 40,
      er: 100,
      imaging: 'deductible',
      labs: 'deductible',
    },
    copaysBeforeDeductible: false,

    rxTiers: {
      tier1: 25,
      tier2: 50,
      tier3: 75,
      deductible: 'medical',
    },

    hsaEligible: true,
    hraAmount: {
      single: 1000,
      family: 2000,
    },

    description: 'Lowest premium option with HSA eligibility and employer HRA. Metro network (excludes CVS) is the most limited.',
    highlights: [
      'Lowest weekly premiums',
      'HSA Eligible + HRA: $1,000 / $2,000',
      'Oxford Metro network (excludes CVS)',
      'Deductible: $2,500 / $5,000',
      '50% / 50% coinsurance',
    ],
    isActive: true,
  },
];

export const getPlans = (): HealthPlan[] => healthPlans;

export const getPlanById = (id: string): HealthPlan | undefined =>
  healthPlans.find(plan => plan.id === id);

export const getPlansByYear = (year: number): HealthPlan[] =>
  healthPlans.filter(plan => plan.year === year);

export const get2025Plans = (): HealthPlan[] => getPlansByYear(2025);

export const get2026Plans = (): HealthPlan[] => getPlansByYear(2026);

export const getActivePlans = (): HealthPlan[] =>
  healthPlans.filter(plan => plan.isActive);
