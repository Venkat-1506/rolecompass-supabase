import { beforeEach, describe, expect, it } from 'vitest';
import { atsService } from './atsService.js';

const completeUser = {
  personal: {
    fullName: 'Test Candidate',
    email: 'test@example.com',
    phone: '1234567890',
    location: 'Bengaluru',
  },
  education: [{ degree: 'B.Tech' }],
  skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js'],
  experience: [{ role: 'Frontend Intern' }],
  accountType: 'fresher',
  profile: {
    links: { github: 'https://github.com/test' },
  },
};

describe('atsService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns an empty report when no candidate is available', () => {
    const result = atsService.evaluateReadiness(null);

    expect(result.score).toBe(0);
    expect(result.statusLabel).toBe('No Profile Detected');
    expect(result.checks).toEqual([]);
  });

  it('scores a complete local demo profile at 100', () => {
    const result = atsService.evaluateReadiness(completeUser);

    expect(result.score).toBe(100);
    expect(result.statusLabel).toBe('Strong Local Readiness');
    expect(result.checks.every((check) => check.status === 'pass')).toBe(true);
  });

  it('uses local-readiness language without claiming verification', () => {
    const result = atsService.evaluateReadiness(completeUser);

    expect(JSON.stringify(result)).not.toMatch(/verified/gi);
    expect(JSON.stringify(result)).not.toMatch(/real ATS/gi);
  });

  it('persists the latest readiness report locally', () => {
    atsService.evaluateReadiness(completeUser);

    expect(atsService.getSavedReadiness()).toMatchObject({
      score: 100,
      statusLabel: 'Strong Local Readiness',
    });
  });
});
