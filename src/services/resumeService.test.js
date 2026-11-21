import { describe, expect, it } from 'vitest';
import { resumeService } from './resumeService.js';

describe('resumeService', () => {
  it('returns a clearly labelled demo extraction without a fake confidence score', async () => {
    const result = await resumeService.processResume(
      { name: 'resume.pdf', size: 2048 },
      { fullName: 'Test Candidate', email: 'test@example.com' },
    );

    expect(result.isDemoExtraction).toBe(true);
    expect(result.extractionMode).toBe('demo');
    expect(result.resume.extractionMode).toBe('demo');
    expect(result).not.toHaveProperty('confidenceScore');
    expect(result.resume.fileName).toBe('resume.pdf');
    expect(result.resume.fileSize).toBe('2 KB');
    expect(result.personal.fullName).toBe('Test Candidate');
  });

  it('preserves existing profile data in the demo extraction', async () => {
    const currentUser = {
      fullName: 'Another Candidate',
      email: 'another@example.com',
      profile: { skills: ['React', 'Testing', 'Accessibility'] },
    };

    const result = await resumeService.parseResume({ name: 'resume.docx' }, currentUser);

    expect(result.skills).toEqual(['React', 'Testing', 'Accessibility']);
    expect(result.resume.fileType).toBe('DOCX');
  });
});
