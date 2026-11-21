import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResumeUpload } from './ResumeUpload.jsx';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  setResumeData: vi.fn(),
  updateOnboardingStep: vi.fn(),
  uploadResumeToSupabase: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    setResumeData: mocks.setResumeData,
    updateOnboardingStep: mocks.updateOnboardingStep,
    isSupabaseConfigured: true,
    currentUser: { id: 'auth-user-1', email: 'candidate@example.com' },
  }),
}));

vi.mock('../../services/resume/resumeStorageService.js', () => ({
  validateResumeFile: (file) => ({
    ok: file.name.endsWith('.pdf'),
    mimeType: 'application/pdf',
    error: 'Only PDF, DOC, and DOCX files are supported.',
  }),
  uploadResumeToSupabase: mocks.uploadResumeToSupabase,
}));

describe('ResumeUpload real Storage upload', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('uploads the selected file before continuing', async () => {
    mocks.uploadResumeToSupabase.mockResolvedValue({
      id: 'resume-id',
      bucket: 'resumes',
      storagePath: 'auth-user-1/resume-id/resume.pdf',
      fileName: 'resume.pdf',
      originalFileName: 'resume.pdf',
      fileSizeBytes: 11,
      mimeType: 'application/pdf',
      status: 'uploaded',
      uploadedAt: '2026-11-21T00:00:00.000Z',
      analysisType: 'supabase-storage',
      isDemoExtraction: false,
    });

    const { container } = render(
      <MemoryRouter>
        <ResumeUpload />
      </MemoryRouter>,
    );

    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mocks.uploadResumeToSupabase).toHaveBeenCalledWith({
        file,
        userId: 'auth-user-1',
      });
    });
    expect(mocks.setResumeData).toHaveBeenCalledWith(
      expect.objectContaining({ storagePath: 'auth-user-1/resume-id/resume.pdf' }),
    );
    expect(mocks.updateOnboardingStep).toHaveBeenCalledWith('processing');
    expect(mocks.navigate).toHaveBeenCalledWith('/onboarding/resume-processing');
  });

  it('keeps the user on the upload screen when upload fails', async () => {
    mocks.uploadResumeToSupabase.mockRejectedValue(new Error('Upload blocked'));

    const { container } = render(
      <MemoryRouter>
        <ResumeUpload />
      </MemoryRouter>,
    );

    const file = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    expect(await screen.findByText('Upload blocked')).toBeInTheDocument();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
