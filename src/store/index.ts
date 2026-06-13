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

// Mock data for demonstration
const mockBusiness: Business = {
  id: '1',
  name: 'Demo Store',
  type: 'retail',
  industry: 'Retail',
  location: 'Lagos, Nigeria',
  currency: 'NGN',
  timezone: 'Africa/Lagos',
  createdAt: new Date().toISOString(),
  settings: {
    fiscalYearStart: '01-01',
    taxRate: 7.5,
    lowStockThreshold: 10,
    enableDebtors: true,
    enableAI: true,
  },
};

const mockUser: User = {
  id: '1',
  email: 'owner@bizguard.africa',
  name: 'Business Owner',
  businessId: '1',
  role: 'owner',
  createdAt: new Date().toISOString(),
};

const mockMetrics: DashboardMetrics = {
  totalSales: 1250000,
  totalRevenue: 1187500,
  totalCustomers: 342,
  totalProducts: 156,
  lowStockProducts: 12,
  overdueInvoices: 8,
  salesGrowth: 23.5,
  topProducts: [],
  recentSales: [],
  salesByCategory: [],
  dailySales: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Business
      currentBusiness: mockBusiness,
      businesses: [mockBusiness],
      setCurrentBusiness: (business) => set({ currentBusiness: business }),
      setBusinesses: (businesses) => set({ businesses }),

      // User
      user: mockUser,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: true,

      // Dashboard
      dashboardMetrics: mockMetrics,
      setDashboardMetrics: (metrics) => set({ dashboardMetrics: metrics }),

      // Alerts
      alerts: [
        {
          id: '1',
          businessId: '1',
          type: 'low_stock',
          severity: 'warning',
          title: 'Low Stock Alert',
          message: '5 products are below reorder level',
          isRead: false,
          actionUrl: '/inventory',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          businessId: '1',
          type: 'overdue_payment',
          severity: 'error',
          title: 'Overdue Payments',
          message: '8 invoices are overdue for payment',
          isRead: false,
          actionUrl: '/debtors',
          createdAt: new Date().toISOString(),
        },
      ],
      addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts] })),
      markAlertAsRead: (alertId) =>
        set((state) => ({
          alerts: state.alerts.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)),
        })),
      clearAlerts: () => set({ alerts: [] }),

      // Action Cards
      actionCards: [
        {
          id: '1',
          type: 'urgent',
          title: 'Follow up on overdue payments',
          description: '8 customers have overdue invoices totaling ₦450,000',
          priority: 1,
          completed: false,
          dueDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'important',
          title: 'Restock popular items',
          description: '12 products are below reorder level',
          priority: 2,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ],
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
