import { storageService } from '../storage/storageService.js';
import {
  clearDemoSession,
  getDemoSession,
  persistDemoSession,
  sanitizeAccount,
} from '../auth/demoAuthService.js';

export const LEGACY_PASSWORD_KEY = 'rc_passwords_v1';

export function stripSensitiveAccount(account) {
  if (!account) return null;
  const sanitized = sanitizeAccount(account);
  if (sanitized?.password) delete sanitized.password;
  return sanitized;
}

export function migrateLegacyAccounts(accounts = []) {
  if (!Array.isArray(accounts)) return { accounts: [], changed: true };

  let changed = false;
  const passwordMap = {};

  const migrated = accounts
    .filter(Boolean)
    .map((account) => {
      if (account.password) {
        passwordMap[account.id] = account.password;
        changed = true;
      }
      const cleaned = stripSensitiveAccount(account);
      if (cleaned.accountType === 'employer') {
        changed = true;
      }
      return cleaned.accountType === 'employer' ? null : cleaned;
    })
    .filter(Boolean);

  if (Object.keys(passwordMap).length > 0) {
    // Remove any previously persisted legacy password map.
    storageService.remove(LEGACY_PASSWORD_KEY);
  }

  return { accounts: migrated, changed };
}

export function migrateSession(session) {
  if (!session) return null;
  const cleaned = stripSensitiveAccount(session);
  if (!cleaned || cleaned.accountType === 'employer') {
    clearDemoSession();
    return null;
  }
  return cleaned;
}

export function hydrateCandidateState(seedAccounts = []) {
  const rawAccounts = storageService.get('rc_accounts', seedAccounts);
  const { accounts, changed } = migrateLegacyAccounts(rawAccounts);
  if (changed) {
    storageService.set('rc_accounts', accounts);
  }
  const session = migrateSession(storageService.get('rc_active_session', null));
  if (session) {
    persistDemoSession(session);
  } else {
    storageService.remove('rc_active_session');
  }
  return { accounts, session };
}

export function saveAccounts(accounts) {
  const cleaned = (accounts || []).map(stripSensitiveAccount).filter(Boolean);
  return storageService.set('rc_accounts', cleaned);
}

export function saveSession(session) {
  const cleaned = stripSensitiveAccount(session);
  if (!cleaned) return storageService.remove('rc_active_session');
  persistDemoSession(cleaned);
  return storageService.set('rc_active_session', cleaned);
}

export function loadSession() {
  return migrateSession(getDemoSession());
}
