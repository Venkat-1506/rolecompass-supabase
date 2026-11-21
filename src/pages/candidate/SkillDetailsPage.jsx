import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { getResourcesForSkill } from '../../data/learning.js';
import {
  getLearningRecordKey,
  getResourceCheckpointDefinitions,
  getSkillProgressKey,
} from '../../services/learningService.js';
import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, Target } from 'lucide-react';
import '../../styles/candidate-experience.css';

const STATUS_OPTIONS = [
  ['not_started', 'Not Started'],
  ['learning', 'Learning'],
  ['practiced', 'Practiced'],
  ['demonstrated', 'Demonstrated'],
];

const STATUS_LABELS = Object.fromEntries(STATUS_OPTIONS);

export function SkillDetailsPage() {
  const { skillId } = useParams();
  const {
    skills = [],
    candidateUser,
    activeTargetRole,
    skillProgress = {},
    learningRecords = {},
    learningService,
    updateSkillProgress,
    startLearningResource,
    completeLearningResource,
    saveLearningNotes,
    setLearningCheckpoint,
    getSkillEvidence,
    showToast,
  } = useApp();

  const normalizedParam = (skillId || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  const rawSkill = skills.find(
    (skill) =>
      skill.id === skillId ||
      skill.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .includes(normalizedParam),
  );

  const skillName =
    rawSkill?.name ||
    (skillId
      ? skillId.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
      : 'Skill');
  const skill = rawSkill || {
    id: skillId,
    name: skillName,
    category: 'Technical Skill',
    description: `Learning resources, official documentation, and practical exercises for ${skillName}.`,
    relatedRoles: [activeTargetRole?.title || 'Software Engineer'],
  };

  const curatedResources = useMemo(() => getResourcesForSkill(skillName), [skillName]);
  const evidence = getSkillEvidence(skillName, curatedResources);
  const progressKey = getSkillProgressKey(candidateUser?.id, activeTargetRole, skill.id);
  const currentStatus = skillProgress[progressKey]?.status || 'not_started';

  const isRequiredForTarget = (activeTargetRole?.coreSkills || []).some((item) =>
    skillName.toLowerCase().includes(item.toLowerCase()),
  );
  const isPreferredForTarget = (activeTargetRole?.relatedSkills || []).some((item) =>
    skillName.toLowerCase().includes(item.toLowerCase()),
  );
  const hasSkillInProfile = (candidateUser?.skills || []).some((item) =>
    skillName.toLowerCase().includes(item.toLowerCase()),
  );

  const recordFor = (resourceId) =>
    learningRecords[getLearningRecordKey(candidateUser?.id, activeTargetRole?.id, resourceId)] ||
    learningService.getRecord(candidateUser?.id, activeTargetRole, resourceId);

  const handleStatusChange = (event) => {
    const updated = updateSkillProgress(skill.id, event.target.value);
    if (updated) {
      showToast(
        'success',
        `Skill status updated to "${STATUS_LABELS[updated.status] || updated.status}".`,
      );
    }
  };

  const handleStart = (resource) => {
    const updated = startLearningResource(resource.id, activeTargetRole);
    if (updated && currentStatus === 'not_started') {
      updateSkillProgress(skill.id, 'learning');
    }
  };

  const handleComplete = (resource) => {
    const isCompleted = recordFor(resource.id)?.status === 'completed';
    const updated = completeLearningResource(resource.id, !isCompleted, activeTargetRole);
    if (!updated) return;
    showToast(
      isCompleted ? 'info' : 'success',
      isCompleted
        ? `Marked "${resource.title}" as in progress.`
        : `Marked "${resource.title}" as completed for ${activeTargetRole?.title || 'your target role'}.`,
    );
  };

  return (
    <main className="cx-page">
      <section className="cx-hero">
        <div className="cx-hero-row">
          <div>
            <div className="cx-actions" style={{ marginBottom: 4 }}>
              <span className="cx-eyebrow">
                <BookOpen size={13} /> Skill workspace
              </span>
              <Link className="cx-muted" to="/candidate/learning">
                Learning Hub
              </Link>
            </div>
            <h1 className="cx-title">{skill.name}</h1>
            <p className="cx-subtitle">{skill.description}</p>
            <div className="cx-chip-row" style={{ marginTop: 14, marginBottom: 0 }}>
              {isRequiredForTarget && <span className="cx-pill">Required for target role</span>}
              {isPreferredForTarget && (
                <span className="cx-pill cx-pill-warn">Preferred skill</span>
              )}
              {hasSkillInProfile && (
                <span className="cx-pill cx-pill-neutral">Listed on profile</span>
              )}
            </div>
          </div>
          <div className="cx-actions">
            <label>
              <span className="cx-stat-label">Local skill status</span>
              <select
                className="cx-select"
                style={{ marginTop: 6, minWidth: 190 }}
                value={currentStatus}
                onChange={handleStatusChange}
              >
                {STATUS_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <Link className="cx-button cx-button-primary" to="/candidate/roles">
              Back to Job Match <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cx-grid cx-stats-grid">
        <div className="cx-card">
          <div className="cx-stat-label">Curated resources</div>
          <div className="cx-stat-value">{evidence.totalResources}</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Resources completed</div>
          <div className="cx-stat-value">{evidence.completedResources}</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Checkpoints complete</div>
          <div className="cx-stat-value">{evidence.checkpointPercent}%</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Local status</div>
          <div className="cx-stat-value" style={{ fontSize: '1.15rem' }}>
            {STATUS_LABELS[currentStatus] || currentStatus}
          </div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Profile claim</div>
          <div className="cx-stat-value" style={{ fontSize: '1.15rem' }}>
            {hasSkillInProfile ? 'Listed' : 'Not listed'}
          </div>
        </div>
      </section>

      <div className="cx-callout" style={{ marginTop: 20 }}>
        <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Progress here reflects local resources and checkpoints only. It does not verify
          professional proficiency or send evidence to an employer, university, or certification
          body.
        </span>
      </div>

      <section className="cx-section cx-grid cx-two-col">
        <div className="cx-card">
          <div className="cx-section-head">
            <div>
              <p className="cx-kicker">Curated learning resources</p>
              <h2>Study from verified sources</h2>
            </div>
          </div>
          {curatedResources.length === 0 ? (
            <div className="cx-empty">
              No curated resources are mapped to this skill yet. Browse the Learning Hub directory
              to find related material.
            </div>
          ) : (
            <div className="cx-grid" style={{ gap: 14 }}>
              {curatedResources.map((resource) => {
                const record = recordFor(resource.id);
                const definitions = getResourceCheckpointDefinitions(resource);
                const states = record?.checkpoints || {};
                const completedCheckpoints = definitions.filter((item) => states[item.id]).length;
                return (
                  <article className="cx-resource" key={resource.id}>
                    <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                      <span className="cx-pill cx-pill-neutral">{resource.provider}</span>
                      <span className="cx-muted">
                        {resource.type} · {resource.difficulty} · {resource.duration}
                      </span>
                    </div>
                    <h4>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        {resource.title} <ExternalLink size={13} />
                      </a>
                    </h4>
                    <p className="cx-muted">{resource.description}</p>
                    <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                      <span className="cx-muted">
                        {completedCheckpoints}/{definitions.length} checkpoints
                      </span>
                      <span className="cx-pill">
                        {record?.status === 'completed' ? 'Completed' : 'Local progress'}
                      </span>
                    </div>
                    <div className="cx-progress">
                      <div
                        className="cx-progress-fill"
                        style={{ width: `${record?.checkpointCompletionPercent || 0}%` }}
                      />
                    </div>
                    <div style={{ marginTop: 10 }}>
                      {definitions.map((checkpoint) => (
                        <label className="cx-checkpoint" key={checkpoint.id}>
                          <input
                            type="checkbox"
                            checked={Boolean(states[checkpoint.id])}
                            onChange={(event) =>
                              setLearningCheckpoint(
                                resource.id,
                                checkpoint.id,
                                event.target.checked,
                                activeTargetRole,
                              )
                            }
                          />
                          {checkpoint.label}
                        </label>
                      ))}
                    </div>
                    <div className="cx-mini-actions">
                      <button
                        className="cx-button cx-button-primary"
                        type="button"
                        onClick={() => handleStart(resource)}
                      >
                        <BookOpen size={14} /> Open in workspace
                      </button>
                      <button
                        className="cx-button"
                        type="button"
                        onClick={() => handleComplete(resource)}
                      >
                        {record?.status === 'completed' ? 'Reopen' : 'Mark done'}
                      </button>
                      <button
                        className="cx-button"
                        type="button"
                        onClick={() => {
                          const updated = saveLearningNotes(
                            resource.id,
                            record?.notes || `Started studying ${skill.name}.`,
                            activeTargetRole,
                          );
                          if (updated) showToast('success', 'Starting note saved locally.');
                        }}
                      >
                        Save starter note
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="cx-card">
          <div className="cx-section-head">
            <div>
              <p className="cx-kicker">Target role relevance</p>
              <h2>{activeTargetRole?.title || 'No target role selected'}</h2>
            </div>
          </div>
          <p className="cx-muted">
            {isRequiredForTarget
              ? 'This skill appears in the core requirements for your active target role.'
              : isPreferredForTarget
                ? 'This skill appears in the related skills for your active target role.'
                : 'This skill is not currently mapped to your active target role requirements.'}
          </p>
          <div className="cx-chip-row" style={{ marginTop: 14 }}>
            {(activeTargetRole?.coreSkills || []).map((item) => (
              <span
                className={`cx-pill ${item === skill.name ? '' : 'cx-pill-neutral'}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <Link
            className="cx-button cx-button-primary"
            to={activeTargetRole ? `/roles/${activeTargetRole.id}` : '/candidate/roles'}
          >
            <Target size={14} /> View role requirements
          </Link>
          <div style={{ marginTop: 20 }}>
            <p className="cx-kicker">Roles strengthened</p>
            <div className="cx-chip-row">
              {(skill.relatedRoles || [activeTargetRole?.title || 'Software Engineer']).map(
                (role) => (
                  <span className="cx-pill cx-pill-neutral" key={role}>
                    {role}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="cx-callout" style={{ marginTop: 20 }}>
            <Target size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              To change the syllabus context, select a different target role in Job Match. Saved
              progress stays associated with the candidate and role it was recorded for.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
