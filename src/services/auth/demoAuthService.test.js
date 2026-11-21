import { describe, expect, it } from 'vitest';
import {
  DEMO_CREDENTIALS,
  createCandidateAccount,
  sanitizeAccount,
  validateDemoCredentials,
} from './demoAuthService.js';

const seededAccounts = DEMO_CREDENTIALS.map((credential, index) => ({
  id: credential.accountId,
  email: credential.email,
  password: credential.password,
  fullName: `Demo Candidate ${index + 1}`,
  accountType: 'candidate',
}));

describe('demoAuthService', () => {
  it('removes passwords and rejects employer accounts', () => {
    expect(
      sanitizeAccount({
        id: 'user-1',
        email: 'a@example.com',
        password: 'secret',
        accountType: 'candidate',
      }),
    ).toEqual({ id: 'user-1', email: 'a@example.com', accountType: 'candidate' });
    expect(sanitizeAccount({ accountType: 'employer' })).toBeNull();
  });

  it('validates seeded demo credentials', () => {
    const result = validateDemoCredentials(
      'arjun.verma@rolecompass.demo',
      'password123',
      seededAccounts,
    );
    expect(result.ok).toBe(true);
    expect(result.account.password).toBeUndefined();
  });

  it('rejects an incorrect seeded demo password', () => {
    const result = validateDemoCredentials('arjun.verma@rolecompass.demo', 'wrong', seededAccounts);
    expect(result).toEqual({ ok: false, error: 'Incorrect demo password.' });
  });

  it('requires email and password', () => {
    expect(validateDemoCredentials('', 'password123', seededAccounts).ok).toBe(false);
    expect(validateDemoCredentials('arjun.verma@rolecompass.demo', '', seededAccounts).ok).toBe(
      false,
    );
  });

  it('rejects unknown accounts', () => {
    const result = validateDemoCredentials('unknown@example.com', 'password123', seededAccounts);
    expect(result.ok).toBe(false);
    expect(result.error).toContain('No demo account found');
  });

  it('accepts any non-empty password for locally created accounts', () => {
    const localAccount = createCandidateAccount({
      fullName: 'Local Candidate',
      email: 'LOCAL@example.com',
      accountType: 'student',
    });

    const result = validateDemoCredentials('local@example.com', 'anything', [localAccount]);
    expect(result.ok).toBe(true);
    expect(result.notice).toContain('Development demo sign-in');
  });

  it('creates sanitized candidate accounts without passwords', () => {
    const account = createCandidateAccount({
      fullName: '  Local Candidate  ',
      email: ' LOCAL@example.com ',
      accountType: 'fresher',
    });

    expect(account.fullName).toBe('Local Candidate');
    expect(account.email).toBe('local@example.com');
    expect(account.accountType).toBe('candidate');
    expect(account.candidateTrack).toBe('fresher');
    expect(account.password).toBeUndefined();
    expect(account.onboardingStep).toBe('created');
  });
});
