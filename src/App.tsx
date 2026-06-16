import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  Dashboard,
  Sales,
  Inventory,
  Debtors,
  AIAssistant,
  RiskScore,
  Alerts,
  Reports,
  Predictions,
  Opportunities,
  Settings,
} from './pages';
import { useAppStore } from './store';
import { Toaster, toast } from 'react-hot-toast';
import { getCurrentProfile, resetPassword, signIn, signUp, supabase } from './lib/supabase';
import type { User as AppUser, Business } from './types';
import type { Database } from './lib/database.types';

type Profile = Database['public']['Tables']['users']['Row'];

const toAppUser = (profile: Profile): AppUser => ({
  id: profile.id,
  email: profile.email,
  name: profile.name || profile.email.split('@')[0],
  businessId: profile.business_id ?? null,
  role: (profile.role === 'manager' || profile.role === 'staff' ? profile.role : 'owner'),
  createdAt: profile.created_at,
});

const toBusiness = (business: {
  id: string;
  name: string;
  type: string;
  industry: string;
  location: string | null;
  currency: string;
  timezone: string;
  settings: unknown;
  created_at: string;
}): Business => ({
  id: business.id,
  name: business.name,
  type: ['retail', 'wholesale', 'pharmacy', 'restaurant', 'school', 'church', 'service', 'other'].includes(business.type)
    ? business.type as Business['type']
    : 'retail',
  industry: business.industry,
  location: business.location || '',
  currency: business.currency,
  timezone: business.timezone,
  createdAt: business.created_at,
  settings: {
    fiscalYearStart: '01-01',
    taxRate: 7.5,
    lowStockThreshold: 10,
    enableDebtors: true,
    enableAI: true,
    ...(typeof business.settings === 'object' && business.settings !== null ? business.settings : {}),
  },
});

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 animate-pulse mx-auto mb-4" />
      <p className="text-slate-600">Loading BizGuard...</p>
    </div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

type AuthMode = 'signin' | 'signup' | 'reset';

const LoginPage: React.FC = () => {
  const { setUser, setCurrentBusiness } = useAppStore();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<AuthMode>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [businessName, setBusinessName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const loadSignedInProfile = async () => {
    const { profile, error } = await getCurrentProfile();
    const typedProfile = profile as Profile | null;
    if (error || !typedProfile) throw error || new Error('Profile was not created. Check Supabase auth trigger/migrations.');

    setUser(toAppUser(typedProfile));

    if (typedProfile.business_id) {
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', typedProfile.business_id)
        .single();
      if (business) setCurrentBusiness(toBusiness(business));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'reset') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast.success('Password reset link sent. Check your email.');
        setMode('signin');
        return;
      }

      if (mode === 'signup') {
        const { error } = await signUp(email, password, businessName, name);
        if (error) throw error;
        toast.success('Account created. Check your email to verify your address.');
        setMode('signin');
        return;
      }

      const { error } = await signIn(email, password);
      if (error) throw error;
      await loadSignedInProfile();
      toast.success('Signed in successfully');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = mode === 'signin' ? 'Sign in to BizGuard' : mode === 'signup' ? 'Create your BizGuard account' : 'Reset your password';
  const submitLabel = mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">BizGuard</h1>
          <p className="text-slate-400">Your Intelligent Business Management Platform</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Business Owner" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Business name</label>
                  <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="My Store" required />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@example.com" required />
            </div>
            {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" minLength={8} required />
              </div>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50">
              {isSubmitting ? 'Please wait...' : submitLabel}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode !== 'signin' && <button onClick={() => setMode('signin')} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">Back to sign in</button>}
            {mode === 'signin' && (
              <>
                <p className="text-slate-400 text-sm">Don't have an account? <button onClick={() => setMode('signup')} className="text-emerald-400 hover:text-emerald-300 font-medium">Start Free Trial</button></p>
                <button onClick={() => setMode('reset')} className="text-slate-400 hover:text-slate-300 text-sm">Forgot password?</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setUser, setCurrentBusiness, setIsLoading } = useAppStore();

  React.useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      setIsLoading(true);
      try {
        const { profile } = await getCurrentProfile();
        const typedProfile = profile as Profile | null;
        if (!mounted) return;
        if (typedProfile) {
          setUser(toAppUser(typedProfile));
          if (typedProfile.business_id) {
            const { data: business } = await supabase.from('businesses').select('*').eq('id', typedProfile.business_id).single();
            if (business) setCurrentBusiness(toBusiness(business));
          }
        } else {
          setUser(null);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    hydrate();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setUser(null);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') hydrate();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setCurrentBusiness, setIsLoading, setUser]);

  return <>{children}</>;
};

const App: React.FC = () => {
  const { theme } = useAppStore();

  return (
    <BrowserRouter>
      <AuthBootstrap>
        <div className={theme}>
          <Toaster position="top-right" toastOptions={{ style: { background: theme === 'dark' ? '#1e293b' : '#ffffff', color: theme === 'dark' ? '#ffffff' : '#1e293b', border: '1px solid', borderColor: theme === 'dark' ? '#334155' : '#e2e8f0' } }} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="sales" element={<Sales />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="debtors" element={<Debtors />} />
              <Route path="ai-assistant" element={<AIAssistant />} />
              <Route path="risk-score" element={<RiskScore />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="reports" element={<Reports />} />
              <Route path="predictions" element={<Predictions />} />
              <Route path="opportunities" element={<Opportunities />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthBootstrap>
    </BrowserRouter>
  );
};

export default App;
