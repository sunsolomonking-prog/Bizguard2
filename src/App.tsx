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

const PremiumLandingHero = React.lazy(() => import('./components/landing/PremiumLandingHero'));

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
    <div className="min-h-screen bg-slate-950 lg:grid lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_520px]">
      <div className="min-h-[620px] lg:min-h-screen">
        <React.Suspense
          fallback={
            <div className="min-h-[620px] bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-950 lg:min-h-screen" />
          }
        >
          <PremiumLandingHero />
        </React.Suspense>
      </div>

      <aside id="auth-panel" className="relative z-40 flex min-h-screen items-center justify-center border-l border-white/10 bg-slate-950/95 p-5 shadow-2xl shadow-black/40 lg:backdrop-blur-xl">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl shadow-cyan-500/30">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white">BizGuard</h2>
            <p className="mt-2 text-sm font-medium text-cyan-100/70">Secure access to your business intelligence hub</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/[0.08] p-7 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
            <h1 className="mb-6 text-xl font-bold text-white">{title}</h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Your name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Business Owner" required />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">Business name</label>
                    <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="My Store" required />
                  </div>
                </>
              )}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@example.com" required />
              </div>
              {mode !== 'reset' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" minLength={8} required />
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/25 transition-all hover:from-emerald-300 hover:to-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? 'Please wait...' : submitLabel}
              </button>
            </form>

            <div className="mt-6 space-y-2 text-center">
              {mode !== 'signin' && <button onClick={() => setMode('signin')} className="text-sm font-medium text-emerald-300 hover:text-emerald-200">Back to sign in</button>}
              {mode === 'signin' && (
                <>
                  <p className="text-sm text-slate-400">Don't have an account? <button onClick={() => setMode('signup')} className="font-bold text-emerald-300 hover:text-emerald-200">Start Free Trial</button></p>
                  <button onClick={() => setMode('reset')} className="text-sm text-slate-400 hover:text-slate-300">Forgot password?</button>
                </>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Protected by Supabase Auth, tenant-aware RLS, and BizGuard secure onboarding.
          </p>
        </div>
      </aside>
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
