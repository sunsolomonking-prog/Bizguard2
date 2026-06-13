import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  FileText,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, phase: 1 },
  { name: 'Sales', href: '/sales', icon: ShoppingCart, phase: 1 },
  { name: 'Inventory', href: '/inventory', icon: Package, phase: 1 },
  { name: 'Debtors', href: '/debtors', icon: Users, phase: 1 },
  { name: 'AI Assistant', href: '/ai-assistant', icon: MessageSquare, phase: 1 },
  { name: 'Risk Score', href: '/risk-score', icon: AlertTriangle, phase: 2 },
  { name: 'Smart Alerts', href: '/alerts', icon: Bell, phase: 2 },
  { name: 'Reports', href: '/reports', icon: FileText, phase: 3 },
  { name: 'Predictions', href: '/predictions', icon: TrendingUp, phase: 3 },
  { name: 'Opportunities', href: '/opportunities', icon: Building2, phase: 4 },
  { name: 'Settings', href: '/settings', icon: Settings, phase: 1 },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
  const { sidebarOpen, toggleSidebar, alerts } = useAppStore();
  
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  BizGuard
                </h1>
                <p className="text-xs text-slate-400">Business OS</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle || toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-700 lg:block hidden"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-slate-700 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white',
                      collapsed && 'lg:justify-center lg:px-2'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.name === 'Smart Alerts' && unreadAlerts > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                          {unreadAlerts}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-700">
          <div className={cn('flex items-center gap-3', collapsed && 'lg:justify-center')}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">BO</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Business Owner</p>
                <p className="text-xs text-slate-400 truncate">owner@bizguard.africa</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
