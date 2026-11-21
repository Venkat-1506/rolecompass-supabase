import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  remove: vi.fn(),
  from: vi.fn(),
  select: vi.fn(),
  insert: vi.fn(),
}));

vi.mock('../../lib/supabase.js', () => ({
  isSupabaseConfigured: true,
  supabase: {
    storage: {
      from: () => ({ upload: mocks.upload, remove: mocks.remove }),
    },
    from: mocks.from,
  },
}));

import { uploadResumeToSupabase, validateResumeFile } from './resumeStorageService.js';

describe('resumeStorageService', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'resume-id' });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.remove.mockResolvedValue({ error: null });
    mocks.insert.mockResolvedValue({ error: null });
    mocks.from.mockReturnValue({
      select: (column) => {
        mocks.select(column);
        return { limit: async () => ({ error: null }) };
      },
      insert: mocks.insert,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('validates an accepted resume file', () => {
    const result = validateResumeFile({
      name: 'My Resume.pdf',
      size: 2048,
      type: 'application/pdf',
    });

    expect(result).toEqual({ ok: true, mimeType: 'application/pdf' });
  });

  it('rejects a mismatched file type', () => {
    const result = validateResumeFile({
      name: 'resume.pdf',
      size: 2048,
      type: 'image/png',
    });

    expect(result.ok).toBe(false);
    expect(result.error).toContain('file type does not match');
  });

  it('uploads the file to a user-scoped path and inserts resume metadata', async () => {
    const result = await uploadResumeToSupabase({
      file: { name: 'My Resume.pdf', size: 2048, type: 'application/pdf' },
      userId: 'auth-user-1',
    });

    expect(mocks.upload).toHaveBeenCalledWith(
      'auth-user-1/resume-id/My_Resume.pdf',
      expect.any(Object),
      expect.objectContaining({ contentType: 'application/pdf', upsert: false }),
    );
    expect(mocks.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'resume-id',
        user_id: 'auth-user-1',
        storage_path: 'auth-user-1/resume-id/My_Resume.pdf',
        file_name: 'My_Resume.pdf',
        file_size_bytes: 2048,
        mime_type: 'application/pdf',
        status: 'uploaded',
        storage_bucket: 'resumes',
      }),
    );
    expect(result.storagePath).toBe('auth-user-1/resume-id/My_Resume.pdf');
  });

  it('removes the uploaded object when metadata persistence fails', async () => {
    mocks.insert.mockResolvedValue({ error: { message: 'insert failed' } });

    await expect(
      uploadResumeToSupabase({
        file: {
          name: 'resume.docx',
          size: 2048,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
        userId: 'auth-user-1',
      }),
    ).rejects.toThrow('insert failed');

    expect(mocks.remove).toHaveBeenCalledWith([expect.stringContaining('auth-user-1/resume-id/')]);
  });
});
