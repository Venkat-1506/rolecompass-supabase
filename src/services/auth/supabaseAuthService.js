import { isSupabaseConfigured, supabase } from '../../lib/supabase.js';
import { sanitizeAccount } from './demoAuthService.js';

export function isSupabaseAuthEnabled() {
  return Boolean(isSupabaseConfigured && supabase);
}

function normalizedEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function defaultProfile(fullName, email, candidateTrack) {
  return {
    personal: {
      fullName: fullName || email.split('@')[0] || 'Candidate',
      email,
      phone: '',
      location: '',
      headline: `${String(candidateTrack || 'fresher')
        .charAt(0)
        .toUpperCase()}${String(candidateTrack || 'fresher').slice(1)} Candidate`,
    },
    education: [],
    skills: [],
    experience: [],
    projects: [],
    preferences: {
      desiredRoles: [],
      preferredLocations: [],
      workModes: [],
    },
    links: {},
  };
}

function accountFromAuthUser(authUser, overrides = {}) {
  if (!authUser) return null;
  const email = normalizedEmail(authUser.email);
  const metadata = authUser.user_metadata || {};
  const fullName =
    overrides.fullName || metadata.full_name || metadata.fullName || email.split('@')[0];
  const candidateTrack = overrides.candidateTrack || metadata.candidateTrack || 'fresher';

  return sanitizeAccount({
    id: authUser.id,
    fullName,
    email,
    accountType: 'candidate',
    candidateTrack,
    createdAt: authUser.created_at || new Date().toISOString(),
    profileMethod: 'resume',
    profileCompleted: false,
    onboardingStep: 'created',
    profile: defaultProfile(fullName, email, candidateTrack),
    resume: { fileName: '', fileType: '', fileSize: '', uploadedAt: '', status: 'none' },
  });
}

function hasProfileData(value) {
  return value && typeof value === 'object' && Object.keys(value).length > 0;
}

export async function getSupabaseSession() {
  if (!isSupabaseAuthEnabled()) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data?.session || null;
}

export async function loadSupabaseAccount(authUser, overrides = {}) {
  if (!isSupabaseAuthEnabled() || !authUser) return null;

  const [{ data: profile, error: profileError }, { data: preferences, error: preferencesError }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle(),
      supabase.from('user_preferences').select('*').eq('user_id', authUser.id).maybeSingle(),
    ]);

  if (profileError) throw new Error(profileError.message);
  if (preferencesError) throw new Error(preferencesError.message);

  const fallback = accountFromAuthUser(authUser, overrides);
  const email = normalizedEmail(authUser.email);
  const fullName = profile?.full_name || fallback?.fullName || email.split('@')[0];
  const candidateTrack = profile?.candidate_track || fallback?.candidateTrack || 'fresher';
  const profileData = hasProfileData(profile?.profile_data)
    ? profile.profile_data
    : defaultProfile(fullName, email, candidateTrack);

  const account = sanitizeAccount({
    ...fallback,
    fullName,
    candidateTrack,
    createdAt: profile?.created_at || fallback?.createdAt,
    profileMethod: profile?.profile_method || 'resume',
    profileCompleted: Boolean(profile?.profile_completed),
    onboardingStep: profile?.onboarding_step || 'created',
    profile: profileData,
    resume: hasProfileData(profile?.resume_data) ? profile.resume_data : fallback.resume,
  });

  return { account, preferences: preferences || null };
}

export async function signInWithSupabase({ email, password }) {
  if (!isSupabaseAuthEnabled()) {
    throw new Error('Supabase is not configured for this workspace.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail(email),
    password: String(password || ''),
  });

  if (error) throw new Error(error.message);

  const loaded = await loadSupabaseAccount(data.user);
  return {
    session: data.session,
    authUser: data.user,
    account: loaded?.account || accountFromAuthUser(data.user),
    preferences: loaded?.preferences || null,
  };
}

export async function signUpWithSupabase({ email, password, fullName, candidateTrack }) {
  if (!isSupabaseAuthEnabled()) {
    throw new Error('Supabase is not configured for this workspace.');
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail(email),
    password: String(password || ''),
    options: {
      data: {
        full_name: String(fullName || '').trim(),
        candidateTrack,
      },
    },
  });

  if (error) throw new Error(error.message);

  const requiresConfirmation = !data.session;
  const loaded = requiresConfirmation ? null : await loadSupabaseAccount(data.user);

  return {
    session: data.session,
    authUser: data.user,
    account: loaded?.account || accountFromAuthUser(data.user, { fullName, candidateTrack }),
    preferences: loaded?.preferences || null,
    requiresConfirmation,
  };
}

export async function signInWithSupabaseOAuth(provider) {
  if (!isSupabaseAuthEnabled()) {
    throw new Error('Supabase is not configured for this workspace.');
  }

  const redirectTo =
    typeof window === 'undefined'
      ? undefined
      : `${window.location.origin}${window.location.pathname}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });

  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function signOutSupabase() {
  if (!isSupabaseAuthEnabled()) return { ok: true };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateSupabaseAccount(account, preferences = {}) {
  if (!isSupabaseAuthEnabled() || !account?.id) {
    return { ok: false, error: 'Supabase is not configured for this workspace.' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      full_name: account.fullName || '',
      candidate_track: account.candidateTrack || 'fresher',
      profile_method: account.profileMethod || 'resume',
      profile_completed: Boolean(account.profileCompleted),
      onboarding_step: account.onboardingStep || 'created',
      profile_data: account.profile || {},
      resume_data: account.resume || {},
    })
    .eq('id', account.id);

  if (profileError) return { ok: false, error: profileError.message };

  const preferencePayload = {
    data: hasProfileData(preferences.data) ? preferences.data : {},
  };
  if (Object.prototype.hasOwnProperty.call(preferences, 'targetRole')) {
    preferencePayload.target_role = preferences.targetRole || null;
  }
  if (Object.prototype.hasOwnProperty.call(preferences, 'targetedRoles')) {
    preferencePayload.targeted_roles = Array.isArray(preferences.targetedRoles)
      ? preferences.targetedRoles
      : [];
  }

  const { error: preferencesError } = await supabase
    .from('user_preferences')
    .update(preferencePayload)
    .eq('user_id', account.id);

  if (preferencesError) return { ok: false, error: preferencesError.message };
  return { ok: true };
}

export function subscribeToSupabaseAuth(callback) {
  if (!isSupabaseAuthEnabled()) return { unsubscribe: () => {} };
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data?.subscription || { unsubscribe: () => {} };
}
