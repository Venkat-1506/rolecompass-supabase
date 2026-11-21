import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { getRoleRoadmapSteps } from '../../data/learning.js';
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  FileText,
  Layers3,
  Sparkles,
  Target,
} from 'lucide-react';
import '../../styles/candidate-experience.css';

export function CandidateHomePage() {
  const {
    candidateUser,
    currentUser,
    jobs = [],
    applications = [],
    savedJobs = [],
    activeTargetRole,
    activeRoleFit,
    hasTargetRole,
    getJobFit,
    calculateProfileCompletion,
    getLearningSummary,
    getPathProgress,
  } = useApp();

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  const userName = (
    currentUser?.fullName ||
    candidateUser?.personal?.fullName ||
    'Candidate'
  ).split(' ')[0];
  const targetRoleTitle = activeTargetRole?.title || 'No target selected';
  const readinessScore =
    activeRoleFit?.readinessScore ?? candidateUser?.roleProfile?.readinessScore ?? 0;
  const profileCompletion = calculateProfileCompletion(candidateUser);
  const userApplications = useMemo(
    () => applications.filter((item) => item.candidateId === candidateUser?.id),
    [applications, candidateUser?.id],
  );
  const pendingCount = userApplications.filter(
    (item) => item.status === 'Applied' || item.status === 'Under Review',
  ).length;
  const progressCount = userApplications.filter(
    (item) =>
      item.status === 'Shortlisted' || item.status === 'Interview' || item.status === 'Offer',
  ).length;
  const roadmapSteps = activeTargetRole ? getRoleRoadmapSteps(activeTargetRole) : [];
  const learningSummary = getLearningSummary(activeTargetRole);
  const pathProgress = getPathProgress(activeTargetRole, roadmapSteps);

  const recommendedJobs = useMemo(() => {
    return [...jobs]
      .map((job) => ({ job, fit: getJobFit(job.id)?.fitScore ?? job.matchScore ?? 0 }))
      .sort((a, b) => b.fit - a.fit)
      .slice(0, 4)
      .map((item) => item.job);
  }, [jobs, getJobFit]);

  const skillSlug = (skill = '') =>
    skill
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const nextSteps = [
    !hasTargetRole && {
      title: 'Choose a target career role',
      detail: 'See which core skills are already present and which ones need attention.',
      action: 'Open Job Match',
      to: '/candidate/roles',
      icon: Target,
    },
    profileCompletion < 80 && {
      title: 'Strengthen your profile',
      detail: 'More complete education, project, and skill data improves local fit calculations.',
      action: 'Edit profile',
      to: '/candidate/profile',
      icon: FileText,
    },
    activeRoleFit?.topGapSkill && {
      title: `Bridge ${activeRoleFit.topGapSkill}`,
      detail: 'Start from the learning workspace selected for your highest-impact skill gap.',
      action: 'Learn this skill',
      to: `/candidate/learning?skill=${skillSlug(activeRoleFit.topGapSkill)}&role=${activeTargetRole?.id || ''}`,
      icon: BookOpen,
    },
    learningSummary.inProgressResources === 0 && {
      title: 'Start your role roadmap',
      detail: `Your ${targetRoleTitle} roadmap has ${pathProgress.totalSteps} structured phases.`,
      action: 'Open Learning Hub',
      to: '/candidate/learning',
      icon: Layers3,
    },
    userApplications.length < 3 && {
      title: 'Save an application draft locally',
      detail: 'Review fit and screening prompts before deciding whether to apply in real life.',
      action: 'Browse jobs',
      to: '/jobs',
      icon: BriefcaseBusiness,
    },
  ].filter(Boolean);

  return (
    <main className="cx-page">
      <section className="cx-hero">
        <div className="cx-hero-row">
          <div>
            <div className="cx-actions" style={{ marginBottom: 4 }}>
              <span className="cx-eyebrow">
                <Compass size={13} /> Career command centre
              </span>
              <span className="cx-muted">
                {hasTargetRole
                  ? `Primary track: ${targetRoleTitle}`
                  : 'Set a target role to personalise this view'}
              </span>
            </div>
            <h1 className="cx-title">Welcome back, {userName}</h1>
            <p className="cx-subtitle">
              This dashboard turns your profile, target role, applications, and learning activity
              into one clear next move. All figures come from your local RoleCompass workspace.
            </p>
          </div>
          <div className="cx-actions">
            <Link className="cx-button cx-button-primary" to="/candidate/resume">
              <FileText size={15} /> Resume Hub
            </Link>
            <Link className="cx-button" to="/jobs">
              Explore Jobs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cx-grid cx-stats-grid" aria-label="Career overview">
        <Link className="cx-card" to="/candidate/applications">
          <div className="cx-stat-label">Applications</div>
          <div className="cx-stat-value">{userApplications.length}</div>
          <div className="cx-stat-note">{pendingCount} awaiting review</div>
        </Link>
        <Link className="cx-card" to="/candidate/applications">
          <div className="cx-stat-label">Interview pipeline</div>
          <div className="cx-stat-value">{progressCount}</div>
          <div className="cx-stat-note">Shortlist, interview, or offer</div>
        </Link>
        <Link className="cx-card" to="/candidate/saved-jobs">
          <div className="cx-stat-label">Saved jobs</div>
          <div className="cx-stat-value">{savedJobs.length}</div>
          <div className="cx-stat-note">Local bookmarks</div>
        </Link>
        <Link className="cx-card" to="/candidate/roles">
          <div className="cx-stat-label">Role readiness</div>
          <div className="cx-stat-value">{hasTargetRole ? `${readinessScore}%` : '—'}</div>
          <div className="cx-stat-note">Profile-derived fit</div>
          <div className="cx-progress">
            <div className="cx-progress-fill" style={{ width: `${readinessScore}%` }} />
          </div>
        </Link>
        <Link className="cx-card" to="/candidate/profile">
          <div className="cx-stat-label">Profile strength</div>
          <div className="cx-stat-value">{profileCompletion}%</div>
          <div className="cx-stat-note">Complete profile sections</div>
          <div className="cx-progress">
            <div className="cx-progress-fill" style={{ width: `${profileCompletion}%` }} />
          </div>
        </Link>
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Guided next steps</p>
            <h2>What to do next</h2>
          </div>
          <span className="cx-pill">Data-derived, not guessed</span>
        </div>
        <div className="cx-grid cx-two-even">
          {nextSteps.length === 0 ? (
            <div className="cx-empty">
              Your profile, target role, learning path, and application pipeline are all active.
              Keep progressing in the Learning Hub.
            </div>
          ) : (
            nextSteps.slice(0, 4).map((step, index) => {
              const Icon = step.icon;
              return (
                <Link className="cx-card cx-card-soft" key={step.title} to={step.to}>
                  <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                    <span className="cx-pill cx-pill-neutral">0{index + 1}</span>
                    <Icon size={18} color="#0f766e" />
                  </div>
                  <div className="cx-list-title" style={{ marginTop: 12 }}>
                    {step.title}
                  </div>
                  <p className="cx-muted" style={{ margin: '6px 0 12px' }}>
                    {step.detail}
                  </p>
                  <span className="cx-button cx-button-soft">
                    {step.action} <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })
          )}
        </div>
      </section>

      <section className="cx-section cx-grid cx-two-col">
        <div className="cx-card">
          <div className="cx-section-head">
            <div>
              <p className="cx-kicker">Insights</p>
              <h2>Your current position</h2>
            </div>
          </div>
          <div className="cx-inline-metrics">
            <div className="cx-inline-metric">
              <strong>{activeRoleFit?.skillsCoveragePercent ?? 0}%</strong>
              <span className="cx-muted">Core skill coverage</span>
            </div>
            <div className="cx-inline-metric">
              <strong>
                {activeRoleFit?.matchedCoreCount ?? 0}/{activeRoleFit?.totalCoreCount ?? 0}
              </strong>
              <span className="cx-muted">Core requirements met</span>
            </div>
            <div className="cx-inline-metric">
              <strong>{learningSummary.completedResources}</strong>
              <span className="cx-muted">Learning sources complete</span>
            </div>
            <div className="cx-inline-metric">
              <strong>{pathProgress.percent}%</strong>
              <span className="cx-muted">Roadmap phases complete</span>
            </div>
          </div>
          <div className="cx-list" style={{ marginTop: 18 }}>
            <div className="cx-list-row">
              <div>
                <div className="cx-list-title">Strongest matched skill</div>
                <div className="cx-list-meta">
                  {activeRoleFit?.strongestSkill || 'Select a target role to calculate this.'}
                </div>
              </div>
              <CheckCircle2 size={18} color="#059669" />
            </div>
            <div className="cx-list-row">
              <div>
                <div className="cx-list-title">Priority skill gap</div>
                <div className="cx-list-meta">
                  {activeRoleFit?.topGapSkill || 'No target role selected.'}
                </div>
              </div>
              {activeRoleFit?.topGapSkill && (
                <Link
                  className="cx-button cx-button-soft"
                  to={`/candidate/learning?skill=${skillSlug(activeRoleFit.topGapSkill)}&role=${activeTargetRole?.id || ''}`}
                >
                  Learn <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="cx-card cx-card-dark">
          <p className="cx-kicker">Learning pulse</p>
          <h2 style={{ color: '#fff' }}>Roadmap progress</h2>
          <div className="cx-stat-value" style={{ color: '#fff' }}>
            {pathProgress.completedSteps}/{pathProgress.totalSteps || 0}
          </div>
          <p className="cx-muted">structured phases completed for {targetRoleTitle}</p>
          <div className="cx-progress" style={{ background: 'rgba(255,255,255,0.18)' }}>
            <div className="cx-progress-fill" style={{ width: `${pathProgress.percent}%` }} />
          </div>
          <div className="cx-inline-metrics" style={{ marginTop: 18 }}>
            <div className="cx-inline-metric">
              <strong style={{ color: '#fff' }}>{learningSummary.inProgressResources}</strong>
              <span>Active workspaces</span>
            </div>
            <div className="cx-inline-metric">
              <strong style={{ color: '#fff' }}>{learningSummary.checkpointPercent}%</strong>
              <span>Checkpoints complete</span>
            </div>
          </div>
          <Link
            className="cx-button cx-button-primary"
            to="/candidate/learning"
            style={{ marginTop: 18 }}
          >
            <BookOpen size={15} /> Continue learning
          </Link>
        </div>
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Recommended opportunities</p>
            <h2>Sample roles ranked by local fit</h2>
          </div>
          <Link className="cx-button" to="/jobs">
            All jobs <ArrowRight size={14} />
          </Link>
        </div>
        {recommendedJobs.length === 0 ? (
          <div className="cx-empty">No sample opportunities are available in this workspace.</div>
        ) : (
          <div className="cx-grid cx-three-col">
            {recommendedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showFit
                onApply={(selectedJob) => setSelectedJobToApply(selectedJob)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="cx-section cx-grid cx-two-col">
        <div className="cx-card">
          <div className="cx-section-head">
            <div>
              <p className="cx-kicker">Application tracker</p>
              <h2>Recent local drafts</h2>
            </div>
            <Link className="cx-button" to="/candidate/applications">
              Tracker <ArrowRight size={14} />
            </Link>
          </div>
          {userApplications.length === 0 ? (
            <div className="cx-empty">
              No applications saved yet. Browse sample opportunities to create a local draft.
            </div>
          ) : (
            <div className="cx-list">
              {userApplications.slice(0, 3).map((application) => (
                <Link className="cx-list-row" key={application.id} to="/candidate/applications">
                  <div>
                    <div className="cx-list-title">
                      {application.jobTitle || 'Software Engineer'}
                    </div>
                    <div className="cx-list-meta">
                      {application.companyName || 'Technology Employer'} ·{' '}
                      {application.submittedAt || application.lastUpdated || 'Recently'}
                    </div>
                  </div>
                  <span className="cx-pill cx-pill-neutral">
                    {application.status || 'Under Review'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="cx-card">
          <div className="cx-section-head">
            <div>
              <p className="cx-kicker">Career milestones</p>
              <h2>Keep the momentum</h2>
            </div>
          </div>
          <div className="cx-list">
            <Link className="cx-list-row" to="/candidate/profile">
              <div>
                <div className="cx-list-title">Candidate profile review</div>
                <div className="cx-list-meta">Profile completion: {profileCompletion}%</div>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link className="cx-list-row" to="/candidate/resume">
              <div>
                <div className="cx-list-title">Local resume readiness</div>
                <div className="cx-list-meta">Heuristic format and keyword coverage check</div>
              </div>
              <ArrowRight size={16} />
            </Link>
            <Link className="cx-list-row" to="/candidate/learning">
              <div>
                <div className="cx-list-title">Bridge high-impact skill gaps</div>
                <div className="cx-list-meta">
                  {learningSummary.inProgressResources} in progress ·{' '}
                  {learningSummary.completedResources} completed learning sources
                </div>
              </div>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Quick actions</p>
            <h2>Everything else, grouped</h2>
          </div>
        </div>
        <div className="cx-grid cx-three-col">
          <div className="cx-card">
            <div className="cx-list-title">Profile & documents</div>
            <div className="cx-mini-actions">
              <Link className="cx-button" to="/candidate/profile">
                Edit profile
              </Link>
              <Link className="cx-button" to="/candidate/resume">
                Resume Hub
              </Link>
              <Link className="cx-button" to="/candidate/preferences">
                Preferences
              </Link>
            </div>
          </div>
          <div className="cx-card">
            <div className="cx-list-title">Opportunities</div>
            <div className="cx-mini-actions">
              <Link className="cx-button" to="/jobs">
                Find jobs
              </Link>
              <Link className="cx-button" to="/candidate/saved-jobs">
                Saved jobs
              </Link>
              <Link className="cx-button" to="/candidate/applications">
                Applications
              </Link>
            </div>
          </div>
          <div className="cx-card">
            <div className="cx-list-title">Direction</div>
            <div className="cx-mini-actions">
              <Link className="cx-button" to="/candidate/roles">
                Roles & fit
              </Link>
              <Link className="cx-button" to="/candidate/learning">
                Learning Hub
              </Link>
              <Link className="cx-button" to="/roles">
                Role guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cx-callout" style={{ marginTop: 24 }}>
        <Sparkles size={17} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          This is a local career-planning demo. Applications stay in this browser, no employer or
          ATS is contacted, and fit scores are calculated from the profile data you provide.
        </span>
      </div>

      {selectedJobToApply && (
        <ApplicationModal
          job={selectedJobToApply}
          isOpen={Boolean(selectedJobToApply)}
          onClose={() => setSelectedJobToApply(null)}
        />
      )}
    </main>
  );
}
