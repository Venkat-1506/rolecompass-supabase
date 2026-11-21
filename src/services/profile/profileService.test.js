import { describe, expect, it } from 'vitest';
import { calculateProfileCompletion } from './profileService.js';

describe('calculateProfileCompletion', () => {
  it('returns zero without a candidate', () => {
    expect(calculateProfileCompletion(null)).toBe(0);
  });

  it('scores a complete candidate profile at 100', () => {
    const candidate = {
      personal: {
        fullName: 'Test Candidate',
        email: 'test@example.com',
        phone: '1234567890',
        location: 'Bengaluru',
        githubUrl: 'https://github.com/test',
      },
      education: [{ degree: 'B.Tech' }],
      experience: [{ role: 'Intern' }],
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Node.js'],
    };

    expect(calculateProfileCompletion(candidate)).toBe(100);
  });

  it('credits projects for freshers without work experience', () => {
    const candidate = {
      accountType: 'fresher',
      personal: {},
      education: [],
      skills: ['React'],
      projects: [{ title: 'Demo App' }],
    };

    expect(calculateProfileCompletion(candidate)).toBe(35);
  });
});
