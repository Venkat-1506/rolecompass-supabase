import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CandidateHomePage } from './CandidateHomePage.jsx';
import { CandidateRolesPage } from './CandidateRolesPage.jsx';
import { LearningHubPage } from './LearningHubPage.jsx';

const mocks = vi.hoisted(() => ({
  setTargetRole: vi.fn(() => ({ success: true })),
  startLearningResource: vi.fn(() => ({ id: 'record-1', status: 'in_progress' })),
  setLearningCheckpoint: vi.fn(() => ({ ok: true })),
  saveLearningNotes: vi.fn(() => ({ id: 'record-1' })),
  showToast: vi.fn(),
  getJobFit: vi.fn(() => ({ fitScore: 82 })),
  appValue: null,
}));

const role = {
  id: 'frontend-engineer',
  title: 'Frontend Engineer',
  category: 'Engineering',
  description: 'Build client applications.',
  overview: 'Build accessible client applications with React and modern CSS.',
  coreSkills: ['React.js', 'State Management'],
  relatedSkills: ['TypeScript', 'Git'],
  preparationPath: ['Learn fundamentals', 'Learn React', 'Learn performance', 'Build a project'],
  relatedJobIds: ['job-001'],
};

const resource = {
  id: 'res-react-quickstart',
  title: 'React Official Docs — Quick Start & Thinking in React',
  provider: 'React.dev',
  url: 'https://react.dev/learn',
  description: 'Official React guide.',
  skills: ['React.js'],
  roles: ['Frontend Engineer'],
  type: 'Documentation',
  difficulty: 'Beginner',
  duration: '45 min',
};

const appValue = {
  currentUser: { id: 'user-new', fullName: 'New Candidate' },
  candidateUser: {
    id: 'user-new',
    personal: { fullName: 'New Candidate' },
    skills: [],
    roleProfile: {},
    careerPreferences: { desiredRoles: [] },
  },
  isAuthenticated: true,
  roles: [role],
  skills: [
    { id: 'react', name: 'React.js' },
    { id: 'state-management', name: 'State Management' },
  ],
  jobs: [
    { id: 'job-001', title: 'Frontend Engineer', companyId: 'company-1', skills: ['React.js'] },
  ],
  companies: [{ id: 'company-1', name: 'Example Co' }],
  savedJobs: [],
  applications: [],
  activeTargetRole: role,
  activeRoleFit: {
    readinessScore: 42,
    matchedCoreSkills: [],
    missingCoreSkills: ['React.js', 'State Management'],
    topGapSkill: 'State Management',
    strongestSkill: 'None',
    skillsCoveragePercent: 0,
    matchedCoreCount: 0,
    totalCoreCount: 2,
  },
  hasTargetRole: true,
  targetRoleTitle: 'Frontend Engineer',
  targetedRoleTitles: [],
  learningRecords: {
    'user-new_frontend-engineer_res-react-quickstart': {
      id: 'user-new_frontend-engineer_res-react-quickstart',
      candidateId: 'user-new',
      roleId: 'frontend-engineer',
      resourceId: resource.id,
      status: 'in_progress',
      notes: '',
      saved: false,
      checkpoints: {},
      completedCheckpoints: 0,
      totalCheckpoints: 3,
      checkpointCompletionPercent: 0,
    },
  },
  timelineEvents: [],
  verifiedLearningResources: [resource],
  learningService: { getRecord: vi.fn(() => null) },
  ...mocks,
  calculateProfileCompletion: vi.fn(() => 65),
  getLearningSummary: vi.fn(() => ({
    totalResources: 1,
    inProgressResources: 1,
    completedResources: 0,
    savedResources: 0,
    completedCheckpoints: 0,
    totalCheckpoints: 3,
    checkpointPercent: 0,
    trackedSkills: 0,
  })),
  getPathProgress: vi.fn(() => ({
    totalSteps: 4,
    completedSteps: 0,
    totalResources: 8,
    completedResources: 0,
    inProgressResources: 1,
    percent: 0,
  })),
  getSkillEvidence: vi.fn(() => ({
    totalResources: 3,
    completedResources: 0,
    inProgressResources: 1,
    completedCheckpoints: 0,
    totalCheckpoints: 9,
    checkpointPercent: 0,
    manualStatus: 'not_started',
    evidenceStatus: 'in_progress',
  })),
};

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => mocks.appValue,
}));

function renderAt(path, routes) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>{routes}</Routes>
    </MemoryRouter>,
  );
}

describe('candidate redesign', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.appValue = appValue;
  });

  it('renders the dashboard as a career command centre with progress and grouped actions', () => {
    renderAt('/candidate', <Route path="/candidate" element={<CandidateHomePage />} />);

    expect(screen.getByRole('heading', { name: /welcome back, new/i })).toBeInTheDocument();
    expect(screen.getByText('What to do next')).toBeInTheDocument();
    expect(screen.getByText('Your current position')).toBeInTheDocument();
    expect(screen.getByText('Everything else, grouped')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /role readiness/i })).toHaveAttribute(
      'href',
      '/candidate/roles',
    );
  });

  it('hands a missing skill from Job Match into the selected Learning Hub workspace', () => {
    renderAt(
      '/candidate/roles',
      <>
        <Route path="/candidate/roles" element={<CandidateRolesPage />} />
        <Route path="/candidate/learning" element={<LearningHubPage />} />
      </>,
    );

    const learnLink = screen.getAllByRole('link', { name: /learn this skill/i })[0];
    expect(learnLink).toHaveAttribute(
      'href',
      '/candidate/learning?skill=state-management&role=frontend-engineer',
    );

    fireEvent.click(learnLink);

    expect(
      screen.getByText(
        (_, element) =>
          element?.classList.contains('cx-callout') &&
          element.textContent.includes('Opened from Job Match for State Management'),
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Learning workspace' })).toHaveClass(
      'cx-side-tab-active',
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('records learning checkpoints from the inline workspace', () => {
    renderAt(
      '/candidate/learning?skill=react-js',
      <Route path="/candidate/learning" element={<LearningHubPage />} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Checkpoints' }));

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    expect(mocks.setLearningCheckpoint).toHaveBeenCalledWith(resource.id, 'reviewed', true, role);
  });
});
