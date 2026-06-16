import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL. Add it to .env.local and your deployment environment.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY. Add it to .env.local and your deployment environment.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const normalizeUuid = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return UUID_REGEX.test(trimmed) ? trimmed : null;
};

export const normalizeNullableText = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

export const ensureUserProfile = async (options?: {
  businessId?: string | null;
  name?: string | null;
  businessName?: string | null;
  industry?: string | null;
}) => {
  const { data, error } = await supabase.rpc('ensure_user_profile', {
    p_business_id: normalizeUuid(options?.businessId),
    p_name: normalizeNullableText(options?.name),
    p_business_name: normalizeNullableText(options?.businessName),
    p_industry: normalizeNullableText(options?.industry),
  });

  return { profile: data, error };
};

export const signUp = async (email: string, password: string, businessName: string, name?: string, businessId?: string | null) => {
  const normalizedBusinessId = normalizeUuid(businessId);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        business_id: normalizedBusinessId,
        business_name: normalizeNullableText(businessName),
        name: normalizeNullableText(name) || email.split('@')[0],
      },
    },
  });

  if (error) return { data, error };

  // If email confirmation is disabled Supabase returns a session immediately.
  // Ensure the profile exists. If confirmation is enabled, this will run after login.
  if (data.session) {
    const { error: profileError } = await ensureUserProfile({
      businessId: normalizedBusinessId,
      name,
      businessName,
    });
    if (profileError) return { data, error: profileError };
  }

  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getCurrentProfile = async () => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { user: null, profile: null, error: userError };

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return { user, profile: null, error };
  if (profile) return { user, profile, error: null };

  const { profile: createdProfile, error: profileError } = await ensureUserProfile({
    businessId: normalizeUuid(user.user_metadata?.business_id),
    name: user.user_metadata?.name,
    businessName: user.user_metadata?.business_name,
    industry: user.user_metadata?.industry,
  });

  return { user, profile: createdProfile, error: profileError };
};

export default supabase;
