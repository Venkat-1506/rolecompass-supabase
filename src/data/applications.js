export const mockApplications = [
  {
    id: 'app-101',
    jobId: 'job-001',
    candidateId: 'user-cand-01',
    status: 'Shortlisted', // Applied | Under Review | Shortlisted | Interview | Offer | Rejected
    appliedDate: '2026-09-21',
    lastUpdated: '2026-09-24',
    screeningAnswers: {
      noticePeriod: 'Immediate / 15 Days',
      willingToRelocate: 'Yes',
      portfolioUrl: 'https://github.com/arjunverma',
    },
    notes: 'Candidate performed strongly in initial frontend design code assessment.',
  },
  {
    id: 'app-102',
    jobId: 'job-002',
    candidateId: 'user-cand-01',
    status: 'Under Review',
    appliedDate: '2026-09-23',
    lastUpdated: '2026-09-23',
    screeningAnswers: {
      noticePeriod: 'Immediate',
      willingToRelocate: 'Yes',
      portfolioUrl: 'https://github.com/arjunverma',
    },
    notes: 'Awaiting hiring manager review.',
  },
];

export function getApplicationsForCandidate(candidateId) {
  return mockApplications.filter((a) => a.candidateId === candidateId);
}
