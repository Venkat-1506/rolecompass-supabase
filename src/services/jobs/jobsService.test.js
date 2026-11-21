import { beforeEach, describe, expect, it } from 'vitest';
import { getJobsState } from './jobsService.js';
import { storageService } from '../storage/storageService.js';

describe('getJobsState', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('seeds sample jobs when storage is empty', () => {
    const jobs = getJobsState();

    expect(jobs.length).toBeGreaterThan(0);
    expect(storageService.get('jobs')).toEqual(jobs);
  });

  it('preserves locally added jobs while restoring canonical sample jobs', () => {
    const localJob = { id: 'local-job', title: 'Local Demo Role' };
    storageService.set('jobs', [localJob]);

    const jobs = getJobsState();

    expect(jobs).toContainEqual(localJob);
    expect(jobs.some((job) => job.id !== 'local-job')).toBe(true);
    expect(storageService.get('jobs')).toEqual(jobs);
  });
});
