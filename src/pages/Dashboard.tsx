import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useAppStore } from '../store';
import { formatCurrency, formatNumber, getActionCardColor } from '../utils/helpers';
import { cn } from '../utils/cn';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC = () => {
  const { dashboardMetrics, actionCards, completeActionCard, alerts } = useAppStore();

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 45000, revenue: 42000 },
    { name: 'Tue', sales: 52000, revenue: 48000 },
    { name: 'Wed', sales: 38000, revenue: 35000 },
    { name: 'Thu', sales: 61000, revenue: 57000 },
    { name: 'Fri', sales: 73000, revenue: 68000 },
    { name: 'Sat', sales: 89000, revenue: 83000 },
    { name: 'Sun', sales: 67000, revenue: 62000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 25 },
    { name: 'Food', value: 20 },
    { name: 'Home', value: 12 },
    { name: 'Other', value: 8 },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardMetrics?.totalRevenue || 0),
      change: 23.5,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Total Sales',
      value: formatNumber(dashboardMetrics?.totalSales || 0),
      change: 18.2,
      icon: ShoppingCart,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Total Customers',
      value: formatNumber(dashboardMetrics?.totalCustomers || 0),
      change: 12.8,
      icon: Users,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Total Products',
      value: formatNumber(dashboardMetrics?.totalProducts || 0),
      change: -2.4,
      icon: Package,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const urgentAlerts = alerts.filter((a) => !a.isRead).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Clock className="w-4 h-4" />
            Last 7 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25">
            <Plus className="w-4 h-4" />
            New Sale
          </button>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      metric.change >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-sm text-slate-400">vs last week</span>
                </div>
              </div>
              <div
                className={cn(
                  'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center',
                  metric.color
                )}
              >
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Sales Trend</h2>
              <p className="text-sm text-slate-500">Daily sales and revenue</p>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `₦${value / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [`₦${value?.toLocaleString()}`, '']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by category */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">By Category</h2>
              <p className="text-sm text-slate-500">Sales distribution</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action cards */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Action Cards</h2>
              <p className="text-sm text-slate-500">Tasks that need your attention</p>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {actionCards.slice(0, 4).map((card) => (
              <div
                key={card.id}
                className={cn(
                  'p-4 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-md',
                  getActionCardColor(card.type),
                  card.completed && 'opacity-60'
                )}
                onClick={() => completeActionCard(card.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{card.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{card.description}</p>
                  </div>
                  <button
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center',
                      card.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300 hover:border-emerald-500'
                    )}
                  >
                    {card.completed && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent alerts */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Recent Alerts</h2>
              <p className="text-sm text-slate-500">Important notifications</p>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {urgentAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No active alerts</p>
              </div>
            ) : (
              urgentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border flex items-start gap-3',
                    alert.severity === 'error' && 'bg-red-50 border-red-200',
                    alert.severity === 'warning' && 'bg-yellow-50 border-yellow-200',
                    alert.severity === 'info' && 'bg-blue-50 border-blue-200'
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      'w-5 h-5 flex-shrink-0 mt-0.5',
                      alert.severity === 'error' && 'text-red-500',
                      alert.severity === 'warning' && 'text-yellow-500',
                      alert.severity === 'info' && 'text-blue-500'
                    )}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800">{alert.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
