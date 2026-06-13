import React from 'react';
import { Building2, Lightbulb, Globe } from 'lucide-react';

export const Opportunities: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Opportunities</h1>
        <p className="text-slate-500 mt-1">Discover new business opportunities and growth areas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">Business Insights</h3>
          <p className="text-sm text-slate-500 mt-2">AI-powered recommendations for business growth and optimization.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">Multi-Business</h3>
          <p className="text-sm text-slate-500 mt-2">Manage multiple businesses from a single dashboard.</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-800">WhatsApp Integration</h3>
          <p className="text-sm text-slate-500 mt-2">Connect with customers via WhatsApp for orders and support.</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8" />
          <div>
            <h3 className="font-bold text-lg">Phase 4 Feature</h3>
            <p className="opacity-90">Business opportunity finder, multi-business mode, and WhatsApp integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;
