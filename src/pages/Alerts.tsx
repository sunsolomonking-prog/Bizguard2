import React from 'react';
import { Bell, Check, Trash2, Filter, BellOff } from 'lucide-react';
import { useAppStore } from '../store';
import { cn } from '../utils/cn';
import { formatDate } from '../utils/helpers';

export const Alerts: React.FC = () => {
  const { alerts, markAlertAsRead } = useAppStore();
  const [filter, setFilter] = React.useState('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'unread') return !alert.isRead;
    if (filter === 'read') return alert.isRead;
    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Smart Alerts</h1>
          <p className="text-slate-500 mt-1">Stay informed about important business events</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <BellOff className="w-4 h-4" />
          Mute All
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Alerts</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-start gap-4',
              !alert.isRead && 'border-l-4 border-l-emerald-500'
            )}
          >
            <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={cn('font-semibold', !alert.isRead && 'text-slate-800', alert.isRead && 'text-slate-600')}>
                  {alert.title}
                </h3>
                <span className="text-xs text-slate-400">{formatDate(alert.createdAt, 'MMM dd, HH:mm')}</span>
              </div>
              <p className="text-slate-600 mt-1">{alert.message}</p>
              <div className="flex items-center gap-2 mt-3">
                {!alert.isRead && (
                  <button
                    onClick={() => markAlertAsRead(alert.id)}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    <Check className="w-3 h-3" />
                    Mark as read
                  </button>
                )}
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600">
                  <Trash2 className="w-3 h-3" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Phase 2 Feature</h3>
            <p className="opacity-90">Smart alerts with AI-powered prioritization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
