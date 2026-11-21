import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CandidateProfilePage } from './CandidateProfilePage.jsx';

const mocks = vi.hoisted(() => ({
  getCandidateProfileDetails: vi.fn(),
  saveCandidateProfileDetails: vi.fn(),
  updateCandidateProfile: vi.fn(),
  saveCandidateProfile: vi.fn(),
  calculateProfileCompletion: vi.fn(() => 40),
}));

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    candidateUser: {
      personal: {},
      education: [],
      experience: [],
      projects: [],
      skills: [],
      certifications: [],
      languages: [],
      resume: {},
    },
    currentUser: { id: 'auth-user-1', email: 'candidate@example.com', fullName: '' },
    updateProfile: mocks.updateCandidateProfile,
    updateCandidateProfile: mocks.updateCandidateProfile,
    saveCandidateProfile: mocks.saveCandidateProfile,
    isSupabaseConfigured: true,
    jobs: [],
    calculateProfileCompletion: mocks.calculateProfileCompletion,
  }),
}));

vi.mock('../../services/auth/supabaseAuthService.js', () => ({
  getCandidateProfileDetails: mocks.getCandidateProfileDetails,
  saveCandidateProfileDetails: mocks.saveCandidateProfileDetails,
}));

vi.mock('../../components/cards/AtsTesterCard.jsx', () => ({ AtsTesterCard: () => null }));
vi.mock('../../components/forms/ApplicationModal.jsx', () => ({ ApplicationModal: () => null }));

const emptyDetails = {
  fullName: 'Test Candidate',
  email: 'candidate@example.com',
  phone: '',
  location: '',
  githubUrl: '',
  linkedinUrl: '',
  hasContactColumns: true,
};

function renderPage() {
  return render(
    <MemoryRouter>
      <CandidateProfilePage />
    </MemoryRouter>,
  );
}

describe('CandidateProfilePage contact details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getCandidateProfileDetails.mockResolvedValue(emptyDetails);
    mocks.saveCandidateProfileDetails.mockResolvedValue(emptyDetails);
    mocks.saveCandidateProfile.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows placeholders for empty optional Supabase fields', async () => {
    renderPage();

    expect(await screen.findByDisplayValue('Test Candidate')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your phone number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your location')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your GitHub profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add your LinkedIn profile')).toBeInTheDocument();
    expect(screen.queryByText('Local Demo Profile')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('candidate@example.com')).toBeDisabled();
  });

  it('saves edited fields through Supabase and refreshes displayed values', async () => {
    const user = userEvent.setup();
    const saved = {
      fullName: 'Test Candidate',
      email: 'candidate@example.com',
      phone: '+44 20 7946 0958',
      location: 'London',
      githubUrl: 'https://github.com/test-candidate',
      linkedinUrl: 'https://www.linkedin.com/in/test-candidate',
      hasContactColumns: true,
    };
    mocks.saveCandidateProfileDetails.mockResolvedValue(saved);
    renderPage();

    await screen.findByDisplayValue('Test Candidate');
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));

    fireEvent.change(screen.getByLabelText(/^Phone Number/), { target: { value: saved.phone } });
    fireEvent.change(screen.getByLabelText(/^Location/), { target: { value: saved.location } });
    fireEvent.change(screen.getByLabelText(/^GitHub Profile URL/), {
      target: { value: saved.githubUrl },
    });
    fireEvent.change(screen.getByLabelText(/^LinkedIn Profile URL/), {
      target: { value: saved.linkedinUrl },
    });
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(() =>
      expect(mocks.saveCandidateProfileDetails).toHaveBeenCalledWith({
        fullName: 'Test Candidate',
        phone: saved.phone,
        location: saved.location,
        githubUrl: saved.githubUrl,
        linkedinUrl: saved.linkedinUrl,
      }),
    );
    expect(await screen.findByText('Profile details saved.')).toBeInTheDocument();
    expect(await screen.findByDisplayValue(saved.githubUrl)).toBeDisabled();
    expect(screen.getByDisplayValue(saved.linkedinUrl)).toBeDisabled();
  });

  it('shows field-level errors without saving invalid profile URLs', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByDisplayValue('Test Candidate');
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.type(screen.getByLabelText(/^GitHub Profile URL/), 'https://example.com/test');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByText(/Enter a valid GitHub profile URL/)).toBeInTheDocument();
    expect(mocks.saveCandidateProfileDetails).not.toHaveBeenCalled();
  });

  it('discards unsaved input when editing is cancelled', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByDisplayValue('Test Candidate');
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.type(screen.getByLabelText(/^Phone Number/), '+44 20 7946 0958');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByPlaceholderText('Add your phone number')).toHaveValue('');
    expect(mocks.saveCandidateProfileDetails).not.toHaveBeenCalled();
  });

  it('keeps unsaved input and shows an error when Supabase rejects the save', async () => {
    const user = userEvent.setup();
    mocks.saveCandidateProfileDetails.mockRejectedValue(new Error('Database update failed'));
    renderPage();

    await screen.findByDisplayValue('Test Candidate');
    await user.click(screen.getByRole('button', { name: 'Edit Profile' }));
    await user.type(screen.getByLabelText(/^Phone Number/), '+44 20 7946 0958');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(await screen.findByText('Database update failed')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Phone Number/)).toHaveValue('+44 20 7946 0958');
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
  });
});
