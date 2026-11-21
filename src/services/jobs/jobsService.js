import { storageService } from '../storage/storageService.js';
import { mockJobs } from '../../data/jobs.js';

export function getJobsState() {
  const stored = storageService.get('jobs', null);
  if (!Array.isArray(stored) || stored.length === 0) {
    storageService.set('jobs', mockJobs);
    return mockJobs;
  }
  // Merge canonical seed jobs with any locally added entries (future-safe).
  const freshIds = new Set(mockJobs.map((j) => j.id));
  const userAdded = stored.filter((j) => j && !freshIds.has(j.id));
  const merged = [...mockJobs, ...userAdded];
  if (merged.length !== stored.length) {
    storageService.set('jobs', merged);
  }
  return merged;
}
