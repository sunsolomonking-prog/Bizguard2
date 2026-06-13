import React from 'react';
import { Settings as SettingsIcon, Building2, Bell, Shield } from 'lucide-react';
import { useAppStore } from '../store';

export const Settings: React.FC = () => {
  const { currentBusiness, theme, toggleTheme } = useAppStore();

  const settingsSections = [
    {
      title: 'Business Settings',
      icon: Building2,
      items: [
        { label: 'Business Name', value: currentBusiness?.name || 'Demo Store' },
        { label: 'Industry', value: currentBusiness?.industry || 'Retail' },
        { label: 'Location', value: currentBusiness?.location || 'Lagos, Nigeria' },
        { label: 'Currency', value: currentBusiness?.currency || 'NGN' },
      ],
    },
    {
      title: 'Preferences',
      icon: SettingsIcon,
      items: [
        { label: 'Theme', value: theme === 'light' ? 'Light' : 'Dark', action: toggleTheme },
        { label: 'Language', value: 'English' },
        { label: 'Timezone', value: 'Africa/Lagos' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: 'Enabled' },
        { label: 'SMS Alerts', value: 'Disabled' },
        { label: 'Push Notifications', value: 'Enabled' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your business and account settings</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
              <section.icon className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-800">{section.title}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-6 py-4">
                  <span className="text-slate-600">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800 font-medium">{item.value}</span>
                    {item.action && (
                      <button
                        onClick={item.action}
                        className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Info */}
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h3 className="font-bold text-lg">Professional Plan</h3>
              <p className="opacity-90">Your subscription is active</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
