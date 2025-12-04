import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HealthPlan, UserScenario, CostBreakdown, User } from '@/types';
import { healthPlans } from '@/data/plans';
import { calculateCosts, defaultScenario } from './costCalculator';

interface PlansState {
  plans: HealthPlan[];
  selectedPlanIds: string[];
  scenario: UserScenario;
  costBreakdowns: Map<string, CostBreakdown>;

  // Actions
  setPlans: (plans: HealthPlan[]) => void;
  addPlan: (plan: HealthPlan) => void;
  updatePlan: (id: string, plan: Partial<HealthPlan>) => void;
  deletePlan: (id: string) => void;

  selectPlan: (id: string) => void;
  deselectPlan: (id: string) => void;
  clearSelectedPlans: () => void;
  setSelectedPlans: (ids: string[]) => void;

  setScenario: (scenario: Partial<UserScenario>) => void;
  resetScenario: () => void;

  recalculateCosts: () => void;
}

export const usePlansStore = create<PlansState>()(
  persist(
    (set, get) => ({
      plans: healthPlans,
      selectedPlanIds: [],
      scenario: defaultScenario,
      costBreakdowns: new Map(),

      setPlans: (plans) => {
        set({ plans });
        get().recalculateCosts();
      },

      addPlan: (plan) => {
        set((state) => ({ plans: [...state.plans, plan] }));
        get().recalculateCosts();
      },

      updatePlan: (id, updates) => {
        set((state) => ({
          plans: state.plans.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
        get().recalculateCosts();
      },

      deletePlan: (id) => {
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== id),
          selectedPlanIds: state.selectedPlanIds.filter((pid) => pid !== id),
        }));
        get().recalculateCosts();
      },

      selectPlan: (id) => {
        set((state) => {
          if (state.selectedPlanIds.includes(id)) return state;
          return { selectedPlanIds: [...state.selectedPlanIds, id] };
        });
      },

      deselectPlan: (id) => {
        set((state) => ({
          selectedPlanIds: state.selectedPlanIds.filter((pid) => pid !== id),
        }));
      },

      clearSelectedPlans: () => {
        set({ selectedPlanIds: [] });
      },

      setSelectedPlans: (ids) => {
        set({ selectedPlanIds: ids });
      },

      setScenario: (updates) => {
        set((state) => ({
          scenario: { ...state.scenario, ...updates },
        }));
        get().recalculateCosts();
      },

      resetScenario: () => {
        set({ scenario: defaultScenario });
        get().recalculateCosts();
      },

      recalculateCosts: () => {
        const { plans, scenario } = get();
        const breakdowns = new Map<string, CostBreakdown>();

        for (const plan of plans) {
          const breakdown = calculateCosts(plan, scenario);
          breakdowns.set(plan.id, breakdown);
        }

        set({ costBreakdowns: breakdowns });
      },
    }),
    {
      name: 'health-plans-storage',
      partialize: (state) => ({
        scenario: state.scenario,
        selectedPlanIds: state.selectedPlanIds,
      }),
    }
  )
);

// Auth store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        // Simulate auth - in production, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Demo users
        if (email === 'admin@company.com' && password === 'admin123') {
          const user: User = {
            id: '1',
            email: 'admin@company.com',
            name: 'Admin User',
            role: 'admin',
            createdAt: new Date(),
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }

        if (email === 'user@company.com' && password === 'user123') {
          const user: User = {
            id: '2',
            email: 'user@company.com',
            name: 'Demo User',
            role: 'user',
            createdAt: new Date(),
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize costs on first load
if (typeof window !== 'undefined') {
  setTimeout(() => {
    usePlansStore.getState().recalculateCosts();
  }, 0);
}
