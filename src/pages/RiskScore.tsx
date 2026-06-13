import React from 'react';
import { AlertTriangle, Shield, TrendingUp, Info } from 'lucide-react';
import { cn } from '../utils/cn';

export const RiskScore: React.FC = () => {
  const riskCategories = [
    { name: 'Financial Health', score: 75, status: 'good', icon: TrendingUp },
    { name: 'Inventory Risk', score: 45, status: 'warning', icon: AlertTriangle },
    { name: 'Sales Performance', score: 82, status: 'excellent', icon: TrendingUp },
    { name: 'Customer Credit', score: 58, status: 'moderate', icon: Shield },
  ];

  const riskFactors = [
    { id: '1', severity: 'high', title: 'High Overdue Receivables', description: '₦165,000 in overdue payments from 3 customers', recommendation: 'Implement stricter credit terms and follow up immediately' },
    { id: '2', severity: 'medium', title: 'Low Stock Levels', description: '5 products below reorder point', recommendation: 'Restock urgent items within 48 hours' },
    { id: '3', severity: 'low', title: 'Cash Flow Variance', description: '15% fluctuation in weekly cash flow', recommendation: 'Build cash reserve for 3 months operating expenses' },
  ];

  const overallScore = 65;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Risk Score</h1>
        <p className="text-slate-500 mt-1">Monitor your business health and identify potential risks</p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="16"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="16"
                strokeDasharray={`${(overallScore / 100) * 553} 553`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-5xl font-bold', getScoreColor(overallScore))}>
                {overallScore}
              </span>
              <span className="text-slate-500 mt-1">out of 100</span>
              <span className={cn('px-3 py-1 rounded-full text-sm font-medium mt-2', getScoreBg(overallScore), 'text-white')}>
                {overallScore >= 80 ? 'Low Risk' : overallScore >= 60 ? 'Medium Risk' : 'High Risk'}
              </span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Risk Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {riskCategories.map((category) => (
                <div key={category.name} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <category.icon className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-slate-700">{category.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getScoreBg(category.score))}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                    <span className={cn('ml-3 font-semibold', getScoreColor(category.score))}>
                      {category.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Risk Factors</h2>
        <div className="space-y-4">
          {riskFactors.map((factor) => (
            <div
              key={factor.id}
              className={cn(
                'p-4 rounded-lg border-l-4',
                factor.severity === 'high' && 'border-l-red-500 bg-red-50',
                factor.severity === 'medium' && 'border-l-yellow-500 bg-yellow-50',
                factor.severity === 'low' && 'border-l-blue-500 bg-blue-50'
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{factor.title}</h3>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      factor.severity === 'high' && 'bg-red-100 text-red-700',
                      factor.severity === 'medium' && 'bg-yellow-100 text-yellow-700',
                      factor.severity === 'low' && 'bg-blue-100 text-blue-700'
                    )}>
                      {factor.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{factor.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm">
                    <Info className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">{factor.recommendation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase 2 Badge */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Phase 2 Feature</h3>
            <p className="opacity-90">Advanced risk scoring with AI-powered insights coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
