import { storageService } from '../storage/storageService.js';

export function loadApplications() {
  const apps = storageService.get('applications', []);
  return Array.isArray(apps) ? apps : [];
}

export function saveApplications(applications) {
  return storageService.set('applications', Array.isArray(applications) ? applications : []);
}

export function getApplicationsForUser(applications, userId) {
  if (!userId) return [];
  return (applications || []).filter((a) => a && a.candidateId === userId);
}

export function createLocalApplication({
  job,
  candidateUser,
  screeningAnswers = {},
  fitScore = null,
}) {
  const now = new Date().toISOString();
  return {
    id: `RC-LOCAL-${Date.now().toString(36).toUpperCase()}`,
    jobId: job?.id,
    companyId: job?.companyId || 'company',
    candidateId: candidateUser?.id,
    status: 'Applied',
    appliedDate: now.split('T')[0],
    lastUpdated: now.split('T')[0],
    submittedAt: now,
    submittedLocally: true,
    transmissionStatus: 'saved_locally_demo',
    resumeUsed: candidateUser?.resume?.fileName || 'Not attached',
    roleCompassFitScore: fitScore,
    screeningAnswers,
    notes: 'Saved locally in this demo workspace. No employer system was contacted.',
  };
}

const VALID_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export function isValidApplicationStatus(status) {
  return VALID_STATUSES.includes(status);
}
