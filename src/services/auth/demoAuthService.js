import { storageService } from '../storage/storageService.js';

export const DEMO_CREDENTIALS = [
  {
    email: 'arjun.verma@rolecompass.demo',
    password: 'password123',
    accountId: 'user-cand-01',
  },
  {
    email: 'arun@gmail.com',
    password: 'password123',
    accountId: 'user-cand-02',
  },
];

export function sanitizeAccount(account) {
  if (!account || account.accountType === 'employer') return null;
  const { password: _password, ...safe } = account;
  return {
    ...safe,
    accountType: 'candidate',
  };
}

export function validateDemoCredentials(email, password, accounts = []) {
  const normalizedEmail = String(email || '')
    .trim()
    .toLowerCase();
  const normalizedPassword = String(password || '').trim();

  if (!normalizedEmail) {
    return { ok: false, error: 'Email address is required.' };
  }
  if (!normalizedPassword) {
    return { ok: false, error: 'Password is required.' };
  }

  const account = (accounts || []).find(
    (a) => a && a.email && a.email.toLowerCase() === normalizedEmail,
  );

  if (!account) {
    return {
      ok: false,
      error:
        'No demo account found for this email. Use a seeded demo account or create a new candidate account.',
    };
  }

  const demo = DEMO_CREDENTIALS.find((c) => c.email === normalizedEmail);
  if (demo) {
    if (demo.password !== normalizedPassword) {
      return { ok: false, error: 'Incorrect demo password.' };
    }
    return { ok: true, account: sanitizeAccount(account) };
  }

  // Locally created candidate accounts use a development-only demo sign-in.
  // No password is persisted; any non-empty password is accepted for the local demo session.
  return {
    ok: true,
    account: sanitizeAccount(account),
    notice: 'Development demo sign-in: local accounts are not protected by stored passwords.',
  };
}

export function persistDemoSession(session) {
  return storageService.set('rc_active_session', sanitizeAccount(session));
}

export function getDemoSession() {
  return storageService.get('rc_active_session', null);
}

export function clearDemoSession() {
  return storageService.remove('rc_active_session');
}

export function createCandidateAccount({ fullName, email, accountType = 'candidate' }) {
  const trimmedEmail = String(email || '')
    .trim()
    .toLowerCase();
  const trimmedName = String(fullName || '').trim();
  return {
    id: `user-${Date.now()}`,
    fullName: trimmedName,
    email: trimmedEmail,
    accountType: 'candidate',
    candidateTrack: accountType,
    createdAt: new Date().toISOString(),
    profileMethod: 'resume',
    profileCompleted: false,
    onboardingStep: 'created',
    profile: {
      personal: {
        fullName: trimmedName,
        email: trimmedEmail,
        phone: '',
        location: '',
        headline: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Candidate`,
      },
      education: [],
      skills: [],
      experience: [],
      projects: [],
      preferences: {
        desiredRoles: [],
        targetSalaryRange: '',
        preferredLocations: [],
        workModes: [],
      },
    },
    resume: {
      fileName: '',
      fileType: '',
      fileSize: '',
      uploadedAt: '',
      status: 'none',
    },
  };
}
