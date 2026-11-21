import { describe, expect, it } from 'vitest';
import {
  calculateProfileCompletion,
  normalizeCandidateProfileContact,
  validateCandidateProfileContact,
} from './profileService.js';

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

describe('candidate profile contact validation', () => {
  it('trims optional profile fields', () => {
    expect(
      normalizeCandidateProfileContact({
        fullName: '  Test Candidate  ',
        phone: '  +44 20 7946 0958 ',
        location: '  London  ',
        githubUrl: '  github.com/test ',
        linkedinUrl: '  https://www.linkedin.com/in/test  ',
      }),
    ).toEqual({
      fullName: 'Test Candidate',
      phone: '+44 20 7946 0958',
      location: 'London',
      githubUrl: 'github.com/test',
      linkedinUrl: 'https://www.linkedin.com/in/test',
    });
  });

  it('accepts international phone numbers and legitimate profile URLs', () => {
    expect(
      validateCandidateProfileContact({
        fullName: 'Test Candidate',
        phone: '+44 20 7946 0958',
        location: 'London',
        githubUrl: 'https://github.com/test-user',
        linkedinUrl: 'https://www.linkedin.com/in/test-user',
      }),
    ).toEqual({});
  });

  it('allows optional contact fields to be empty', () => {
    expect(validateCandidateProfileContact({ fullName: 'Test Candidate' })).toEqual({});
  });

  it('reports field-level errors for invalid values', () => {
    const errors = validateCandidateProfileContact({
      fullName: '   ',
      phone: 'abc',
      githubUrl: 'https://github.com',
      linkedinUrl: 'https://www.linkedin.com/company/example',
    });

    expect(errors).toEqual({
      fullName: 'Full name is required.',
      phone: 'Enter a valid phone number in international format.',
      githubUrl: expect.stringContaining('GitHub profile URL'),
      linkedinUrl: expect.stringContaining('LinkedIn profile URL'),
    });
  });
});
