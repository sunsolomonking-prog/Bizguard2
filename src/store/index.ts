import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business, User, DashboardMetrics, Alert, ActionCard, AIAssistantMessage } from '../types';

interface AppState {
  // Business
  currentBusiness: Business | null;
  businesses: Business[];
  setCurrentBusiness: (business: Business) => void;
  setBusinesses: (businesses: Business[]) => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // Dashboard
  dashboardMetrics: DashboardMetrics | null;
  setDashboardMetrics: (metrics: DashboardMetrics) => void;

  // Alerts
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (alertId: string) => void;
  clearAlerts: () => void;

  // Action Cards
  actionCards: ActionCard[];
  addActionCard: (card: ActionCard) => void;
  completeActionCard: (cardId: string) => void;
  removeActionCard: (cardId: string) => void;

  // AI Assistant
  aiMessages: AIAssistantMessage[];
  addAiMessage: (message: AIAssistantMessage) => void;
  clearAiMessages: () => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;

  // Loading States
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Business
      currentBusiness: null,
      businesses: [],
      setCurrentBusiness: (business) => set({ currentBusiness: business }),
      setBusinesses: (businesses) => set({ businesses }),

      // User
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,

      // Dashboard
      dashboardMetrics: null,
      setDashboardMetrics: (metrics) => set({ dashboardMetrics: metrics }),

      // Alerts
      alerts: [],
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      markAlertAsRead: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
        })),
      clearAlerts: () => set({ alerts: [] }),

      // Action Cards
      actionCards: [],
      addActionCard: (card) => set((state) => ({ actionCards: [card, ...state.actionCards] })),
      completeActionCard: (cardId) =>
        set((state) => ({
          actionCards: state.actionCards.map((c) => (c.id === cardId ? { ...c, completed: true } : c)),
        })),
      removeActionCard: (cardId) =>
        set((state) => ({ actionCards: state.actionCards.filter((c) => c.id !== cardId) })),

      // AI Assistant
      aiMessages: [],
      addAiMessage: (message) => set((state) => ({ aiMessages: [...state.aiMessages, message] })),
      clearAiMessages: () => set({ aiMessages: [] }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Theme
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),

      // Loading States
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'bizguard-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        currentBusiness: state.currentBusiness,
      }),
    }
  )
);
