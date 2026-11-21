import { isSupabaseConfigured, supabase } from '../../lib/supabase.js';
import { sanitizeAccount } from './demoAuthService.js';
import { normalizeCandidateProfileContact } from '../profile/profileService.js';

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
      githubUrl: '',
      linkedinUrl: '',
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
  const metadata = authUser.user_metadata || {};
  const email = normalizedEmail(authUser.email || metadata.email || '');
  const fullName =
    overrides.fullName ||
    metadata.full_name ||
    metadata.fullName ||
    metadata.name ||
    metadata.user_name ||
    email.split('@')[0] ||
    'Candidate';
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

function profileHasContactColumns(profile) {
  return (
    Boolean(profile) &&
    ['phone', 'location', 'github_url', 'linkedin_url'].every((column) =>
      Object.prototype.hasOwnProperty.call(profile, column),
    )
  );
}

function profileContactFromRow(profile, authUser, fallback = {}) {
  const profileData = hasProfileData(profile?.profile_data) ? profile.profile_data : {};
  const personal = profileData.personal || {};
  const links = profileData.links || {};
  const metadata = authUser?.user_metadata || {};
  const hasColumn = (column) =>
    Boolean(profile) && Object.prototype.hasOwnProperty.call(profile, column);

  const contact = normalizeCandidateProfileContact({
    fullName:
      profile?.full_name ??
      personal.fullName ??
      metadata.full_name ??
      metadata.fullName ??
      fallback.fullName ??
      '',
    phone: hasColumn('phone') ? profile.phone : (personal.phone ?? ''),
    location: hasColumn('location') ? profile.location : (personal.location ?? ''),
    githubUrl: hasColumn('github_url')
      ? profile.github_url
      : (personal.githubUrl ?? links.github ?? ''),
    linkedinUrl: hasColumn('linkedin_url')
      ? profile.linkedin_url
      : (personal.linkedinUrl ?? links.linkedin ?? ''),
  });

  return {
    ...contact,
    email: normalizedEmail(authUser?.email ?? personal.email ?? fallback.email ?? ''),
  };
}

function buildProfileDataWithContact(profile, contact, email) {
  const profileData = hasProfileData(profile?.profile_data) ? profile.profile_data : {};
  const personal = { ...(profileData.personal || {}) };
  const links = { ...(profileData.links || {}) };

  personal.fullName = contact.fullName;
  personal.email = email;
  personal.phone = contact.phone;
  personal.location = contact.location;
  personal.githubUrl = contact.githubUrl;
  personal.linkedinUrl = contact.linkedinUrl;
  personal.portfolioUrl = contact.githubUrl;

  links.github = contact.githubUrl;
  links.linkedin = contact.linkedinUrl;
  links.portfolio = contact.githubUrl;

  return { ...profileData, personal, links };
}

async function requireSupabaseUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!user) throw new Error('You must be signed in to manage your profile.');
  return user;
}

export async function getCandidateProfileDetails() {
  if (!isSupabaseAuthEnabled()) return null;

  const authUser = await requireSupabaseUser();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    ...profileContactFromRow(profile, authUser),
    hasContactColumns: profileHasContactColumns(profile),
  };
}

export async function saveCandidateProfileDetails(contact) {
  if (!isSupabaseAuthEnabled()) {
    throw new Error('Supabase is not configured for this workspace.');
  }

  const authUser = await requireSupabaseUser();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (profileError) throw new Error(profileError.message);

  const normalized = normalizeCandidateProfileContact(contact);
  const email = normalizedEmail(authUser.email);
  const payload = {
    full_name: normalized.fullName,
    profile_data: buildProfileDataWithContact(profile, normalized, email),
  };

  if (profileHasContactColumns(profile)) {
    payload.phone = normalized.phone;
    payload.location = normalized.location;
    payload.github_url = normalized.githubUrl;
    payload.linkedin_url = normalized.linkedinUrl;
  }

  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', authUser.id)
    .select('*')
    .maybeSingle();

  if (updateError) throw new Error(updateError.message);

  const savedProfile = updated || { ...profile, ...payload };
  return {
    ...profileContactFromRow(savedProfile, authUser),
    hasContactColumns: profileHasContactColumns(savedProfile),
  };
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
  const candidateTrack = profile?.candidate_track || fallback?.candidateTrack || 'fresher';
  const baseProfileData = hasProfileData(profile?.profile_data)
    ? profile.profile_data
    : defaultProfile(fallback?.fullName, email, candidateTrack);
  const contact = profileContactFromRow(profile, authUser, {
    fullName: fallback?.fullName,
    email,
  });
  const profileData = {
    ...baseProfileData,
    personal: {
      ...(baseProfileData.personal || {}),
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      githubUrl: contact.githubUrl,
      linkedinUrl: contact.linkedinUrl,
      portfolioUrl: contact.githubUrl,
    },
    links: {
      ...(baseProfileData.links || {}),
      github: contact.githubUrl,
      linkedin: contact.linkedinUrl,
      portfolio: contact.githubUrl,
    },
  };

  const account = sanitizeAccount({
    ...fallback,
    fullName: contact.fullName || fallback?.fullName || email.split('@')[0],
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

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', account.id)
    .maybeSingle();

  const accountProfile = hasProfileData(account.profile) ? account.profile : {};
  const email = normalizedEmail(account.email);
  const contact = profileContactFromRow(
    { profile_data: accountProfile },
    { email },
    { fullName: account.fullName },
  );
  const payload = {
    full_name: contact.fullName || account.fullName || '',
    candidate_track: account.candidateTrack || 'fresher',
    profile_method: account.profileMethod || 'resume',
    profile_completed: Boolean(account.profileCompleted),
    onboarding_step: account.onboardingStep || 'created',
    profile_data: buildProfileDataWithContact({ profile_data: accountProfile }, contact, email),
    resume_data: account.resume || {},
  };

  if (profileHasContactColumns(existingProfile)) {
    payload.phone = contact.phone;
    payload.location = contact.location;
    payload.github_url = contact.githubUrl;
    payload.linkedin_url = contact.linkedinUrl;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update(payload)
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
