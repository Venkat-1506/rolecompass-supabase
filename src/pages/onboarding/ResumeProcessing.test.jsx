import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResumeProcessing } from './ResumeProcessing.jsx';

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
  updateOnboardingStep: vi.fn(),
  processResume: vi.fn(),
}));

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    currentUser: { fullName: 'Test Candidate', resume: { fileName: 'resume.pdf' } },
    updateProfile: mocks.updateProfile,
    updateOnboardingStep: mocks.updateOnboardingStep,
  }),
}));

vi.mock('../../services/resumeService.js', () => ({
  resumeService: { processResume: mocks.processResume },
}));

const extracted = {
  personal: { fullName: 'Test Candidate' },
  experience: [],
  education: [],
  skills: ['React'],
  projects: [],
  preferences: {},
};

describe('ResumeProcessing', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.processResume.mockResolvedValue(extracted);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('completes under StrictMode and advances to the review screen', async () => {
    render(
      <React.StrictMode>
        <MemoryRouter initialEntries={['/onboarding/resume-processing']}>
          <Routes>
            <Route path="/onboarding/resume-processing" element={<ResumeProcessing />} />
            <Route path="/onboarding/review-profile" element={<div>Review screen</div>} />
          </Routes>
        </MemoryRouter>
      </React.StrictMode>,
    );

    expect(screen.getByText('Processing Your Resume')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByText('Review screen')).toBeInTheDocument();
    expect(mocks.processResume).toHaveBeenCalledTimes(1);
    expect(mocks.updateOnboardingStep).toHaveBeenCalledWith('review');
    expect(mocks.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ skills: extracted.skills }),
    );
  });
});
