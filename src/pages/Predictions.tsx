import React from 'react';
import { TrendingUp, Package, Zap } from 'lucide-react';

export const Predictions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Predictions</h1>
        <p className="text-slate-500 mt-1">AI-powered demand forecasting and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">Demand Forecast</h3>
          </div>
          <p className="text-slate-600">Predict future product demand based on historical sales data, seasonality, and market trends.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-slate-800">Smart Restock</h3>
          </div>
          <p className="text-slate-600">Automated restock recommendations based on predicted demand and current inventory levels.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Phase 3 Feature</h3>
            <p className="opacity-90">AI-powered demand prediction and automated restocking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
