import { HealthPlan } from '@/types';

export const healthPlans: HealthPlan[] = [
  // 2025 Plans
  {
    id: '2025-basic-cigna',
    year: 2025,
    name: '2025 Basic (Cigna)',
    carrier: 'Cigna',
    network: 'Cigna Open Access',

    premiums: {
      single: 45,
      employeeSpouse: 95,
      employeeChildren: 85,
      family: 135,
    },

    deductible: {
      single: 2000,
      family: 4000,
    },
    oopMax: {
      single: 5500,
      family: 11000,
    },
    coinsurance: 30,

    copays: {
      pcp: 30,
      specialist: 50,
      urgentCare: 75,
      er: 250,
      imaging: 100,
      labs: 30,
    },
    copaysBeforeDeductible: false,

    rxDeductibleApplies: true,
    rxTiers: {
      generic: 15,
      preferred: 35,
      nonPreferred: 60,
      specialty: 100,
      specialtyCoinsurance: 30,
    },

    hsaEligible: true,
    hraAmount: {
      single: 1000,
      family: 2000,
    },

    specialtyAccumulatorProgram: false,

    description: 'High-deductible health plan with HSA eligibility and HRA contribution from employer.',
    highlights: [
      'HSA eligible - triple tax advantage',
      'Employer HRA contribution: $1,000/$2,000',
      'Lower premiums',
      'Cigna Open Access network',
    ],
    isActive: true,
  },
  {
    id: '2025-buy-up',
    year: 2025,
    name: '2025 Buy-Up',
    carrier: 'Cigna',
    network: 'Cigna Open Access Plus',

    premiums: {
      single: 75,
      employeeSpouse: 155,
      employeeChildren: 140,
      family: 220,
    },

    deductible: {
      single: 1000,
      family: 2000,
    },
    oopMax: {
      single: 4000,
      family: 8000,
    },
    coinsurance: 20,

    copays: {
      pcp: 25,
      specialist: 40,
      urgentCare: 50,
      er: 200,
      imaging: 75,
      labs: 20,
    },
    copaysBeforeDeductible: true,

    rxDeductibleApplies: false,
    rxTiers: {
      generic: 10,
      preferred: 30,
      nonPreferred: 50,
      specialty: 75,
    },

    hsaEligible: false,

    specialtyAccumulatorProgram: false,

    description: 'Lower deductible plan with copays before deductible. Good for predictable healthcare needs.',
    highlights: [
      'Lower deductible: $1,000/$2,000',
      'Copays before deductible',
      'Lower out-of-pocket maximum',
      'Richer prescription coverage',
    ],
    isActive: true,
  },
  {
    id: '2025-value',
    year: 2025,
    name: '2025 Value Plan',
    carrier: 'Cigna',
    network: 'Cigna LocalPlus',

    premiums: {
      single: 95,
      employeeSpouse: 195,
      employeeChildren: 175,
      family: 275,
    },

    deductible: {
      single: 750,
      family: 1500,
    },
    oopMax: {
      single: 6000,
      family: 12000,
    },
    coinsurance: 20,

    copays: {
      pcp: 20,
      specialist: 35,
      urgentCare: 40,
      er: 150,
      imaging: 50,
      labs: 15,
    },
    copaysBeforeDeductible: true,

    rxDeductibleApplies: false,
    rxTiers: {
      generic: 10,
      preferred: 25,
      nonPreferred: 45,
      specialty: 60,
    },

    hsaEligible: false,

    specialtyAccumulatorProgram: false,

    description: 'Lowest deductible with higher premiums. Best for frequent healthcare users.',
    highlights: [
      'Lowest deductible: $750/$1,500',
      'Copays before deductible',
      'Lower copays for routine care',
      'Best for high utilizers',
    ],
    isActive: true,
  },

  // 2026 Plans
  {
    id: '2026-basic-a-liberty',
    year: 2026,
    name: '2026 Basic A (Liberty HSA)',
    carrier: 'Oxford',
    network: 'Oxford Liberty',

    premiums: {
      single: 48,
      employeeSpouse: 100,
      employeeChildren: 90,
      family: 142,
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
      pcp: 30,
      specialist: 50,
      urgentCare: 75,
      er: 250,
      imaging: 100,
      labs: 30,
    },
    copaysBeforeDeductible: false,

    rxDeductibleApplies: true,
    rxTiers: {
      generic: 15,
      preferred: 40,
      nonPreferred: 65,
      specialty: 75,
      specialtyCoinsurance: 30,
    },

    hsaEligible: true,

    specialtyAccumulatorProgram: true,

    description: 'HSA-eligible high-deductible plan with Oxford Liberty network. Lower OOP max than 2025.',
    highlights: [
      'HSA eligible - triple tax advantage',
      'Lower OOP max: $5,000/$10,000',
      'New Oxford Liberty network',
      'Tier 3 specialty copay: $75',
    ],
    isActive: true,
  },
  {
    id: '2026-basic-b-liberty-plus',
    year: 2026,
    name: '2026 Basic B (Liberty HSA Plus)',
    carrier: 'Oxford',
    network: 'Oxford Liberty',

    premiums: {
      single: 58,
      employeeSpouse: 120,
      employeeChildren: 108,
      family: 170,
    },

    deductible: {
      single: 1500,
      family: 3000,
    },
    oopMax: {
      single: 4500,
      family: 9000,
    },
    coinsurance: 25,

    copays: {
      pcp: 25,
      specialist: 45,
      urgentCare: 65,
      er: 225,
      imaging: 85,
      labs: 25,
    },
    copaysBeforeDeductible: false,

    rxDeductibleApplies: true,
    rxTiers: {
      generic: 12,
      preferred: 35,
      nonPreferred: 55,
      specialty: 65,
      specialtyCoinsurance: 25,
    },

    hsaEligible: true,

    specialtyAccumulatorProgram: true,

    description: 'Enhanced HSA plan with lower deductible and better copays. Still HSA eligible.',
    highlights: [
      'HSA eligible with lower deductible',
      'Deductible: $1,500/$3,000',
      'Better copays than Basic A',
      '25% coinsurance (vs 30%)',
    ],
    isActive: true,
  },
  {
    id: '2026-buy-up-oxford',
    year: 2026,
    name: '2026 Buy-Up (Oxford)',
    carrier: 'Oxford',
    network: 'Oxford Freedom',

    premiums: {
      single: 82,
      employeeSpouse: 168,
      employeeChildren: 152,
      family: 238,
    },

    deductible: {
      single: 1000,
      family: 2000,
    },
    oopMax: {
      single: 4000,
      family: 8000,
    },
    coinsurance: 20,

    copays: {
      pcp: 25,
      specialist: 40,
      urgentCare: 50,
      er: 200,
      imaging: 75,
      labs: 20,
    },
    copaysBeforeDeductible: true,

    rxDeductibleApplies: false,
    rxTiers: {
      generic: 10,
      preferred: 30,
      nonPreferred: 50,
      specialty: 75,
    },

    hsaEligible: false,

    specialtyAccumulatorProgram: false,

    description: 'Rich benefits plan with copays before deductible. Oxford Freedom network for widest access.',
    highlights: [
      'Low deductible: $1,000/$2,000',
      'Copays before deductible',
      'Oxford Freedom (widest network)',
      'Best for predictable high usage',
    ],
    isActive: true,
  },
  {
    id: '2026-value-oxford',
    year: 2026,
    name: '2026 Value Plan',
    carrier: 'Oxford',
    network: 'Oxford Metro',

    premiums: {
      single: 98,
      employeeSpouse: 202,
      employeeChildren: 182,
      family: 285,
    },

    deductible: {
      single: 750,
      family: 1500,
    },
    oopMax: {
      single: 6000,
      family: 12000,
    },
    coinsurance: 20,

    copays: {
      pcp: 20,
      specialist: 35,
      urgentCare: 40,
      er: 150,
      imaging: 50,
      labs: 15,
    },
    copaysBeforeDeductible: true,

    rxDeductibleApplies: false,
    rxTiers: {
      generic: 10,
      preferred: 25,
      nonPreferred: 45,
      specialty: 60,
    },

    hsaEligible: false,

    specialtyAccumulatorProgram: false,

    description: 'Traditional copay-first plan with lowest deductible. Higher premiums, lower cost-sharing.',
    highlights: [
      'Lowest deductible: $750/$1,500',
      'Traditional copay structure',
      'Lower copays for all services',
      'Oxford Metro network',
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
