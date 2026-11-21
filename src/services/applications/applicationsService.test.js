import { beforeEach, describe, expect, it } from 'vitest';
import {
  createLocalApplication,
  getApplicationsForUser,
  isValidApplicationStatus,
  loadApplications,
  saveApplications,
} from './applicationsService.js';

describe('applicationsService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('creates honest local application records', () => {
    const application = createLocalApplication({
      job: { id: 'job-1', companyId: 'company-1' },
      candidateUser: {
        id: 'user-1',
        resume: { fileName: 'resume.pdf' },
      },
      screeningAnswers: { notice: '15 days' },
      fitScore: 82,
    });

    expect(application).toMatchObject({
      jobId: 'job-1',
      companyId: 'company-1',
      candidateId: 'user-1',
      status: 'Applied',
      submittedLocally: true,
      transmissionStatus: 'saved_locally_demo',
      resumeUsed: 'resume.pdf',
      roleCompassFitScore: 82,
    });
    expect(application.notes).toContain('No employer system was contacted');
  });

  it('filters applications by candidate', () => {
    const applications = [
      { id: 'a1', candidateId: 'user-1' },
      { id: 'a2', candidateId: 'user-2' },
    ];

    expect(getApplicationsForUser(applications, 'user-1')).toEqual([
      { id: 'a1', candidateId: 'user-1' },
    ]);
    expect(getApplicationsForUser(applications, null)).toEqual([]);
  });

  it('validates application statuses', () => {
    expect(isValidApplicationStatus('Applied')).toBe(true);
    expect(isValidApplicationStatus('Offer')).toBe(true);
    expect(isValidApplicationStatus('Hired')).toBe(false);
  });

  it('saves and loads application arrays', () => {
    const applications = [{ id: 'a1' }];
    expect(saveApplications(applications)).toEqual({ ok: true });
    expect(loadApplications()).toEqual(applications);
    expect(saveApplications(null)).toEqual({ ok: true });
    expect(loadApplications()).toEqual([]);
  });
});
