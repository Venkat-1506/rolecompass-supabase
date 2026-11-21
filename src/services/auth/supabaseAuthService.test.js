import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  from: vi.fn(),
}));

vi.mock('../../lib/supabase.js', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: { getUser: mocks.getUser },
    from: mocks.from,
  },
}));

import { getCandidateProfileDetails, saveCandidateProfileDetails } from './supabaseAuthService.js';

function queryFor(result) {
  const query = {
    select: vi.fn(() => query),
    update: vi.fn(() => query),
    eq: vi.fn(() => query),
    maybeSingle: vi.fn(() => Promise.resolve(result)),
  };
  return query;
}

const authUser = {
  id: 'auth-user-1',
  email: 'candidate@example.com',
  user_metadata: {},
};

describe('supabaseAuthService candidate profile details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({ data: { user: authUser }, error: null });
  });

  it('loads top-level contact columns when they exist', async () => {
    const profile = {
      id: authUser.id,
      full_name: 'Top Level Candidate',
      phone: '+44 20 7946 0958',
      location: 'London',
      github_url: 'https://github.com/top-level',
      linkedin_url: 'https://www.linkedin.com/in/top-level',
      profile_data: {},
    };
    mocks.from.mockReturnValueOnce(queryFor({ data: profile, error: null }));

    const details = await getCandidateProfileDetails();

    expect(details).toMatchObject({
      fullName: 'Top Level Candidate',
      email: authUser.email,
      phone: '+44 20 7946 0958',
      location: 'London',
      githubUrl: 'https://github.com/top-level',
      linkedinUrl: 'https://www.linkedin.com/in/top-level',
      hasContactColumns: true,
    });
  });

  it('falls back to profile_data without inventing values when columns are missing', async () => {
    const profile = {
      id: authUser.id,
      full_name: 'Nested Candidate',
      profile_data: {
        personal: {
          fullName: 'Nested Candidate',
          phone: '',
          location: 'London',
          githubUrl: 'https://github.com/nested',
          linkedinUrl: '',
        },
      },
    };
    mocks.from.mockReturnValueOnce(queryFor({ data: profile, error: null }));

    const details = await getCandidateProfileDetails();

    expect(details).toMatchObject({
      fullName: 'Nested Candidate',
      email: authUser.email,
      phone: '',
      location: 'London',
      githubUrl: 'https://github.com/nested',
      linkedinUrl: '',
      hasContactColumns: false,
    });
  });

  it('writes top-level columns and profile_data when the schema supports them', async () => {
    const profile = {
      id: authUser.id,
      full_name: 'Existing Candidate',
      phone: '',
      location: '',
      github_url: '',
      linkedin_url: '',
      profile_data: { personal: { fullName: 'Existing Candidate' } },
    };
    const selectQuery = queryFor({ data: profile, error: null });
    const updateQuery = queryFor({ data: profile, error: null });
    mocks.from.mockReturnValueOnce(selectQuery).mockReturnValueOnce(updateQuery);

    await saveCandidateProfileDetails({
      fullName: 'Updated Candidate',
      phone: '+44 20 7946 0958',
      location: 'London',
      githubUrl: 'https://github.com/updated',
      linkedinUrl: 'https://www.linkedin.com/in/updated',
    });

    const payload = updateQuery.update.mock.calls[0][0];
    expect(payload).toMatchObject({
      full_name: 'Updated Candidate',
      phone: '+44 20 7946 0958',
      location: 'London',
      github_url: 'https://github.com/updated',
      linkedin_url: 'https://www.linkedin.com/in/updated',
    });
    expect(payload.profile_data.personal).toMatchObject({
      fullName: 'Updated Candidate',
      phone: '+44 20 7946 0958',
      location: 'London',
      githubUrl: 'https://github.com/updated',
      linkedinUrl: 'https://www.linkedin.com/in/updated',
    });
  });

  it('does not write top-level columns that are not present in the schema', async () => {
    const profile = {
      id: authUser.id,
      full_name: 'Existing Candidate',
      profile_data: {},
    };
    const selectQuery = queryFor({ data: profile, error: null });
    const updateQuery = queryFor({ data: profile, error: null });
    mocks.from.mockReturnValueOnce(selectQuery).mockReturnValueOnce(updateQuery);

    await saveCandidateProfileDetails({
      fullName: 'Updated Candidate',
      phone: '+44 20 7946 0958',
      location: '',
      githubUrl: '',
      linkedinUrl: '',
    });

    const payload = updateQuery.update.mock.calls[0][0];
    expect(payload).not.toHaveProperty('phone');
    expect(payload).not.toHaveProperty('github_url');
    expect(payload.profile_data.personal.phone).toBe('+44 20 7946 0958');
  });
});
