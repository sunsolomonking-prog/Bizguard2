import React from 'react';
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';

export const Reports: React.FC = () => {
  const reports = [
    { name: 'Sales Report', description: 'Daily, weekly, and monthly sales analysis', icon: TrendingUp },
    { name: 'Inventory Report', description: 'Stock levels, movements, and valuations', icon: FileText },
    { name: 'Customer Report', description: 'Customer analytics and purchase history', icon: FileText },
    { name: 'Financial Report', description: 'Revenue, expenses, and profit analysis', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="text-slate-500 mt-1">Generate and export business reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.name} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center mb-4">
              <report.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">{report.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{report.description}</p>
            <button className="mt-4 flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              <Download className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Phase 3 Feature</h3>
            <p className="opacity-90">Automated weekly reports and AI-powered insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
