import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { calculateCandidateRoleFit, skillsMatch } from '../../data/matching.js';
import { getResourcesForSkill } from '../../data/learning.js';
import { fuzzyMatch } from '../../utils/helpers.js';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  RotateCcw,
  Search,
  Target,
} from 'lucide-react';
import '../../styles/candidate-experience.css';

export function CandidateRolesPage() {
  const {
    roles = [],
    jobs = [],
    candidateUser,
    setTargetRole,
    activeTargetRole,
    targetRoleTitle,
    targetedRoleTitles = [],
    getSkillEvidence,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [assessmentVersion, setAssessmentVersion] = useState(0);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  const currentTargetRole =
    activeTargetRole ||
    roles.find(
      (role) =>
        targetRoleTitle &&
        (role.title.toLowerCase() === targetRoleTitle.toLowerCase() ||
          role.id.toLowerCase() === targetRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
          role.title.toLowerCase().includes(targetRoleTitle.toLowerCase())),
    ) ||
    null;

  const targetRoleFit = useMemo(() => {
    if (!currentTargetRole) return null;
    void assessmentVersion;
    return calculateCandidateRoleFit(candidateUser, currentTargetRole);
  }, [candidateUser, currentTargetRole, assessmentVersion]);

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(roles.map((role) => role.category || 'General')))],
    [roles],
  );

  const filteredRoles = useMemo(() => {
    const query = searchQuery.trim();
    return roles.filter((role) => {
      const matchesSearch =
        !query ||
        fuzzyMatch(role.title, query) ||
        fuzzyMatch(role.category, query) ||
        fuzzyMatch(role.overview, query) ||
        (role.coreSkills || []).some((skill) => fuzzyMatch(skill, query));
      return matchesSearch && (selectedCategory === 'ALL' || role.category === selectedCategory);
    });
  }, [roles, searchQuery, selectedCategory]);

  const matchedJobs = useMemo(() => {
    if (!currentTargetRole) return [];
    const roleTitle = (currentTargetRole.title || '').toLowerCase();
    const roleCategory = (currentTargetRole.category || '').toLowerCase();
    const coreSkills = currentTargetRole.coreSkills || [];
    return jobs.filter((job) => {
      const jobTitle = (job.title || '').toLowerCase();
      const jobCategory = (job.category || '').toLowerCase();
      const titleMatch =
        jobTitle.includes(roleTitle.split(' ')[0]) || roleTitle.includes(jobTitle.split(' ')[0]);
      const categoryMatch =
        jobCategory === roleCategory ||
        (jobCategory.includes('tech') && roleCategory.includes('engineer')) ||
        (jobCategory.includes('engineer') && roleCategory.includes('tech'));
      const skillMatch = (job.skills || []).some((jobSkill) =>
        coreSkills.some((coreSkill) => skillsMatch(jobSkill, coreSkill)),
      );
      return titleMatch || categoryMatch || skillMatch;
    });
  }, [jobs, currentTargetRole]);

  const skillSlug = (skill = '') =>
    skill
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const handleSetTarget = (roleToSet) => {
    const result = setTargetRole(roleToSet);
    if (result) {
      showToast(
        'success',
        `"${roleToSet.title}" set as your target career role! Learning Hub updated.`,
      );
    }
  };

  const skillRows = currentTargetRole
    ? (currentTargetRole.coreSkills || []).map((skill) => {
        const matched = (targetRoleFit?.matchedCoreSkills || []).includes(skill);
        const evidence = getSkillEvidence(skill, getResourcesForSkill(skill));
        return { skill, matched, evidence };
      })
    : [];

  return (
    <main className="cx-page">
      <section className="cx-hero">
        <div className="cx-hero-row">
          <div>
            <div className="cx-actions" style={{ marginBottom: 4 }}>
              <span className="cx-eyebrow">
                <Compass size={13} /> Skill diagnostic
              </span>
              <span className="cx-muted">Job Match</span>
            </div>
            <h1 className="cx-title">See the gap. Choose the next move.</h1>
            <p className="cx-subtitle">
              Compare your profile with a target role, inspect every core requirement, then send a
              missing skill straight into the Learning Hub. Scores are local estimates based on your
              profile data.
            </p>
          </div>
          <div className="cx-actions">
            <Link className="cx-button" to="/candidate/learning">
              <BookOpen size={15} /> Open Learning Hub
            </Link>
            <Link className="cx-button cx-button-primary" to="/jobs">
              Explore Jobs <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Active target</p>
            <h2>{currentTargetRole?.title || 'No target role selected'}</h2>
          </div>
          {currentTargetRole && (
            <button
              className="cx-button"
              type="button"
              onClick={() => {
                setAssessmentVersion((value) => value + 1);
                showToast(
                  'info',
                  'Local role fit recalculated from your current profile and learning activity.',
                );
              }}
            >
              <RotateCcw size={14} /> Reassess local fit
            </button>
          )}
        </div>

        {!currentTargetRole ? (
          <div className="cx-card cx-callout cx-callout-warn">
            <Target size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Choose a target role from the catalogue below. Your Job Match and Learning Hub views
              are recalculated from that selection.
            </span>
          </div>
        ) : (
          <div className="cx-grid cx-two-col">
            <div className="cx-card">
              <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                <span className="cx-pill cx-pill-neutral">{currentTargetRole.category}</span>
                <span className="cx-pill">{targetRoleFit?.readinessScore ?? 0}% readiness</span>
              </div>
              <p className="cx-muted" style={{ marginTop: 14 }}>
                {currentTargetRole.overview || currentTargetRole.description}
              </p>
              <div className="cx-progress">
                <div
                  className="cx-progress-fill"
                  style={{ width: `${targetRoleFit?.skillsCoveragePercent ?? 0}%` }}
                />
              </div>
              <div className="cx-inline-metrics">
                <div className="cx-inline-metric">
                  <strong>
                    {targetRoleFit?.matchedCoreCount ?? 0}/{targetRoleFit?.totalCoreCount ?? 0}
                  </strong>
                  <span className="cx-muted">Core requirements met</span>
                </div>
                <div className="cx-inline-metric">
                  <strong>{targetRoleFit?.strongestSkill || '—'}</strong>
                  <span className="cx-muted">Strongest matched skill</span>
                </div>
                <div className="cx-inline-metric">
                  <strong>{targetRoleFit?.topGapSkill || '—'}</strong>
                  <span className="cx-muted">Priority gap</span>
                </div>
              </div>
            </div>

            <div className="cx-card cx-card-soft">
              <p className="cx-kicker">Skill comparison</p>
              <h2 style={{ fontSize: '1rem', marginBottom: 8 }}>
                What you have vs. what this role needs
              </h2>
              {skillRows.length === 0 ? (
                <div className="cx-empty">No core skills are defined for this role.</div>
              ) : (
                skillRows.map((row) => (
                  <div className="cx-skill-row" key={row.skill}>
                    <span style={{ fontWeight: 700 }}>{row.skill}</span>
                    <div className={`cx-skill-bar ${row.matched ? '' : 'cx-skill-bar-gap'}`}>
                      <span
                        style={{
                          width: row.matched ? '100%' : `${row.evidence.checkpointPercent}%`,
                        }}
                      />
                    </div>
                    <span>
                      {row.matched ? (
                        <span className="cx-pill">Present</span>
                      ) : row.evidence.completedResources ? (
                        <span className="cx-pill cx-pill-warn">Learning evidence</span>
                      ) : (
                        <span className="cx-pill cx-pill-neutral">Gap</span>
                      )}
                    </span>
                    {row.matched ? (
                      <CheckCircle2 size={17} color="#059669" />
                    ) : (
                      <Link
                        className="cx-button cx-button-soft"
                        to={`/candidate/learning?skill=${skillSlug(row.skill)}&role=${currentTargetRole.id}`}
                      >
                        Learn <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                ))
              )}
              <p className="cx-muted" style={{ marginTop: 12 }}>
                Learning evidence means you have completed resources or checkpoints locally. It does
                not verify proficiency with an employer or external assessor.
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Gap prioritisation</p>
            <h2>Focus on the requirements with the least evidence</h2>
          </div>
        </div>
        <div className="cx-grid cx-three-col">
          {(targetRoleFit?.missingCoreSkills || []).length === 0 ? (
            <div className="cx-empty">
              Every defined core skill is already present on your profile for this target role.
            </div>
          ) : (
            targetRoleFit.missingCoreSkills.map((skill, index) => {
              const evidence = getSkillEvidence(skill, getResourcesForSkill(skill));
              return (
                <div className="cx-card" key={skill}>
                  <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                    <span className={`cx-pill ${index < 2 ? 'cx-pill-warn' : 'cx-pill-neutral'}`}>
                      {index < 2 ? 'High impact' : 'Next wave'}
                    </span>
                    <span className="cx-muted">{evidence.totalResources} resources</span>
                  </div>
                  <div className="cx-list-title" style={{ marginTop: 12 }}>
                    {skill}
                  </div>
                  <p className="cx-muted">
                    {evidence.completedResources} complete · {evidence.checkpointPercent}%
                    checkpoints
                  </p>
                  <Link
                    className="cx-button cx-button-primary"
                    to={`/candidate/learning?skill=${skillSlug(skill)}&role=${currentTargetRole.id}`}
                  >
                    Learn this skill <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Role catalogue</p>
            <h2>Explore and set a target role ({filteredRoles.length})</h2>
          </div>
        </div>
        <div className="cx-filter-bar">
          <label>
            <span className="cx-stat-label">Search roles or skills</span>
            <div style={{ position: 'relative', marginTop: 6 }}>
              <Search
                size={15}
                style={{ position: 'absolute', left: 11, top: 11, color: '#94a3b8' }}
              />
              <input
                className="cx-input"
                style={{ paddingLeft: 34 }}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by role title or skill..."
              />
            </div>
          </label>
        </div>
        <div className="cx-chip-row">
          {categories.map((category) => (
            <button
              className={`cx-chip ${selectedCategory === category ? 'cx-chip-active' : ''}`}
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'ALL' ? 'All career fields' : category}
            </button>
          ))}
        </div>
        {filteredRoles.length === 0 ? (
          <div className="cx-empty">
            <strong>No Career Roles Matched</strong>
            <div style={{ marginTop: 6 }}>
              No roles matched your search "{searchQuery}". Try another role or reset the category
              filter.
            </div>
            <button
              className="cx-button"
              type="button"
              style={{ marginTop: 14 }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
            >
              Reset role filters
            </button>
          </div>
        ) : (
          <div className="cx-grid cx-three-col">
            {filteredRoles.map((role) => {
              const fit = calculateCandidateRoleFit(candidateUser, role);
              const isActive = activeTargetRole?.id === role.id;
              const wasTargeted = targetedRoleTitles.some(
                (title) => title.toLowerCase() === role.title.toLowerCase(),
              );
              return (
                <article className="cx-card cx-role-card" key={role.id}>
                  <div className="cx-role-card-head">
                    <div>
                      <h3>
                        <Link to={`/roles/${role.id}`}>{role.title}</Link>
                      </h3>
                      <p className="cx-muted">{role.category}</p>
                    </div>
                    <span className={`cx-pill ${fit.readinessScore >= 80 ? '' : 'cx-pill-warn'}`}>
                      {fit.readinessScore}% fit
                    </span>
                  </div>
                  <p>{role.description}</p>
                  <div className="cx-chip-row" style={{ margin: 0 }}>
                    {(role.coreSkills || []).slice(0, 4).map((skill) => (
                      <span
                        className={`cx-pill ${fit.matchedCoreSkills.includes(skill) ? '' : 'cx-pill-neutral'}`}
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {isActive ? (
                    <div className="cx-actions">
                      <span className="cx-pill">Selected target role</span>
                      <Link className="cx-button" to="/candidate/learning">
                        Open in Learning Hub <ArrowRight size={13} />
                      </Link>
                    </div>
                  ) : (
                    <button
                      className={`cx-button ${wasTargeted ? '' : 'cx-button-primary'}`}
                      type="button"
                      onClick={() => handleSetTarget(role)}
                    >
                      {wasTargeted ? 'Switch to this target role' : 'Set as target role'}
                    </button>
                  )}
                  <Link className="cx-button" to={`/roles/${role.id}`}>
                    View role guide & skills
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="cx-section">
        <div className="cx-section-head">
          <div>
            <p className="cx-kicker">Sample openings</p>
            <h2>Opportunities for {currentTargetRole?.title || 'your target role'}</h2>
          </div>
          <Link className="cx-button" to="/explore">
            Explore all opportunities <ArrowRight size={14} />
          </Link>
        </div>
        {matchedJobs.length === 0 ? (
          <div className="cx-empty">
            <strong>No Active Positions Found</strong>
            <div style={{ marginTop: 6 }}>
              No sample listings match this role category yet. Explore all jobs or choose another
              target role.
            </div>
          </div>
        ) : (
          <div className="cx-grid cx-three-col">
            {matchedJobs.slice(0, 6).map((job) => (
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
