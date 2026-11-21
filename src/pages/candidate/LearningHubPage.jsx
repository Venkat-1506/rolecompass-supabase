import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { LearningTimeline } from '../../components/learning/LearningTimeline.jsx';
import {
  getLearningRecordKey,
  getResourceCheckpointDefinitions,
} from '../../services/learningService.js';
import {
  getAllLearningResources,
  getResourcesForSkill,
  getRoleRoadmapSteps,
  LEARNING_CATEGORIES,
} from '../../data/learning.js';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Layers3,
  ListOrdered,
  Lock,
  PlayCircle,
  RotateCcw,
  Search,
  Target,
} from 'lucide-react';
import '../../styles/candidate-experience.css';

const NAV_ITEMS = [
  { id: 'path', label: 'My learning path', icon: Layers3 },
  { id: 'workspace', label: 'Learning workspace', icon: PlayCircle },
  { id: 'notes', label: 'Notes & checkpoints', icon: FileText },
  { id: 'syllabus', label: 'Target-role syllabus', icon: Target },
  { id: 'workspaces', label: 'Active workspaces', icon: BookOpen },
  { id: 'timeline', label: 'Learning timeline', icon: ListOrdered },
  { id: 'directory', label: 'Course directory', icon: Search },
  { id: 'saved', label: 'Saved resources', icon: Bookmark },
];

function ResourceCard({
  resource,
  record,
  onStart,
  onResume,
  onComplete,
  onSave,
  compact = false,
}) {
  const isCompleted = record?.status === 'completed';
  const isSaved = record?.saved === true;
  const isStarted = Boolean(record && record.status !== 'not_started');

  return (
    <article className="cx-resource">
      <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
        <span className="cx-pill cx-pill-neutral">{resource.provider}</span>
        <span className="cx-muted">
          {resource.type} · {resource.duration}
        </span>
      </div>
      <h4>{resource.title}</h4>
      {!compact && <p className="cx-muted">{resource.description}</p>}
      <div className="cx-chip-row" style={{ margin: '4px 0 10px' }}>
        {(resource.skills || []).slice(0, 3).map((skill) => (
          <span className="cx-pill cx-pill-neutral" key={skill}>
            {skill}
          </span>
        ))}
      </div>
      <div className="cx-mini-actions">
        {isCompleted ? (
          <button
            className="cx-button cx-button-soft"
            type="button"
            onClick={() => onResume(resource)}
          >
            <RotateCcw size={13} /> Review
          </button>
        ) : isStarted ? (
          <button
            className="cx-button cx-button-soft"
            type="button"
            onClick={() => onResume(resource)}
          >
            <PlayCircle size={13} /> Resume
          </button>
        ) : (
          <button
            className="cx-button cx-button-primary"
            type="button"
            onClick={() => onStart(resource)}
          >
            <PlayCircle size={13} /> Start
          </button>
        )}
        <button
          className="cx-button"
          type="button"
          onClick={() => onComplete(resource, !isCompleted)}
        >
          {isCompleted ? 'Reopen' : 'Mark done'}
        </button>
        <button
          className="cx-button"
          type="button"
          title={isSaved ? 'Remove bookmark' : 'Save for later'}
          onClick={() => onSave(resource, !isSaved)}
        >
          {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
        </button>
        <a className="cx-button" href={resource.url} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={13} /> Open
        </a>
      </div>
    </article>
  );
}

function WorkspacePanel({ resource, role, record, initialTab = 'workspace', actions }) {
  const [tab, setTab] = useState(initialTab);
  const [notes, setNotes] = useState(record?.notes || '');
  const [dirty, setDirty] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    setTab(initialTab);
    setNotes(record?.notes || '');
    setDirty(false);
    setIframeError(false);
  }, [resource?.id, initialTab, record?.notes]);

  if (!resource) {
    return (
      <div className="cx-empty">
        Choose a resource from your roadmap or directory to open it here.
      </div>
    );
  }

  const definitions = getResourceCheckpointDefinitions(resource);
  const states = record?.checkpoints || {};
  const completedCount = definitions.filter((item) => states[item.id]).length;

  const openExternal = () => {
    actions.showToast('info', `Opening external resource on ${resource.provider}...`);
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="cx-card">
      <div className="cx-section-head">
        <div>
          <p className="cx-kicker">Dedicated workspace</p>
          <h2>{resource.title}</h2>
          <p className="cx-muted">
            {role?.title || 'Target role'} · {resource.provider} · {resource.type} ·{' '}
            {resource.duration}
          </p>
        </div>
        <div className="cx-actions">
          <button className="cx-button cx-button-primary" type="button" onClick={openExternal}>
            <ExternalLink size={14} /> Open official page
          </button>
          <button
            className="cx-button"
            type="button"
            onClick={() =>
              record?.status === 'completed'
                ? actions.onResume(resource)
                : actions.onStart(resource)
            }
          >
            <PlayCircle size={14} /> {record ? 'Open viewer' : 'Start viewer'}
          </button>
        </div>
      </div>

      <div className="cx-tabs" role="tablist" aria-label="Learning workspace sections">
        {[
          ['workspace', 'Workspace preview'],
          ['notes', 'Study notes'],
          ['checkpoints', 'Checkpoints'],
          ['syllabus', 'Role syllabus'],
        ].map(([id, label]) => (
          <button
            className={`cx-tab ${tab === id ? 'cx-tab-active' : ''}`}
            key={id}
            type="button"
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'workspace' && (
        <div>
          <p className="cx-muted">{resource.description}</p>
          <div className="cx-callout" style={{ marginTop: 12 }}>
            <Clock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              {iframeError
                ? 'This provider blocks embedding. Use the official page link to study, then return here to record progress.'
                : 'Preview only. Use the official page for the full learning experience; RoleCompass tracks your local progress here.'}
            </span>
          </div>
          <iframe
            title={resource.title}
            src={resource.url}
            style={{
              width: '100%',
              minHeight: 340,
              marginTop: 14,
              border: '1px solid #e2e8f0',
              borderRadius: 14,
              background: '#fff',
            }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            onError={() => setIframeError(true)}
          />
        </div>
      )}

      {tab === 'notes' && (
        <div>
          <p className="cx-muted">
            Notes are stored in this browser with the resource, target role, and candidate record.
          </p>
          <textarea
            className="cx-input"
            style={{ minHeight: 220, marginTop: 12, lineHeight: 1.6, resize: 'vertical' }}
            value={notes}
            placeholder="Capture key takeaways, commands, or application ideas as you study..."
            onChange={(event) => {
              setNotes(event.target.value);
              setDirty(true);
            }}
          />
          <div className="cx-actions" style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <span className="cx-muted">
              {dirty ? 'Unsaved note edits' : 'All notes saved locally'}
            </span>
            <button
              className="cx-button cx-button-primary"
              type="button"
              disabled={!dirty}
              onClick={() => {
                const updated = actions.onSaveNotes(resource.id, notes);
                if (updated) setDirty(false);
              }}
            >
              Save study notes
            </button>
          </div>
        </div>
      )}

      {tab === 'checkpoints' && (
        <div>
          <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '0.98rem' }}>Learning checkpoints</h3>
            <span className="cx-pill">
              {completedCount}/{definitions.length} complete
            </span>
          </div>
          <p className="cx-muted">
            Checkpoints are concrete actions recorded locally. Completing all of them marks this
            resource complete for the active role.
          </p>
          <div style={{ marginTop: 12 }}>
            {definitions.map((checkpoint) => (
              <label className="cx-checkpoint" key={checkpoint.id}>
                <input
                  type="checkbox"
                  checked={Boolean(states[checkpoint.id])}
                  onChange={(event) =>
                    actions.onToggleCheckpoint(resource, checkpoint.id, event.target.checked)
                  }
                />
                {checkpoint.label}
              </label>
            ))}
          </div>
          <div className="cx-progress">
            <div
              className="cx-progress-fill"
              style={{ width: `${record?.checkpointCompletionPercent || 0}%` }}
            />
          </div>
        </div>
      )}

      {tab === 'syllabus' && (
        <div className="cx-grid cx-two-even">
          <div className="cx-card cx-card-soft">
            <p className="cx-kicker">Core requirements</p>
            <div className="cx-chip-row" style={{ marginTop: 10 }}>
              {(role?.coreSkills || []).map((skill) => (
                <span className="cx-pill" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="cx-card cx-card-soft">
            <p className="cx-kicker">Related skills</p>
            <div className="cx-chip-row" style={{ marginTop: 10 }}>
              {(role?.relatedSkills || []).map((skill) => (
                <span className="cx-pill cx-pill-neutral" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LearningHubPage() {
  const {
    roles = [],
    skills = [],
    candidateUser,
    activeTargetRole,
    hasTargetRole,
    setTargetRole,
    learningRecords = {},
    timelineEvents = [],
    verifiedLearningResources = [],
    learningService,
    openLearningViewer,
    startLearningResource,
    resumeLearningResource,
    completeLearningResource,
    saveLearningResource,
    saveLearningNotes,
    setLearningCheckpoint,
    getLearningSummary,
    getPathProgress,
    showToast,
  } = useApp();

  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get('skill');
  const roleParam = searchParams.get('role');
  const [activePane, setActivePane] = useState(skillParam ? 'workspace' : 'path');
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState('workspace');
  const [roadmapViewMode, setRoadmapViewModeState] = useState(() => {
    try {
      const saved = window.localStorage.getItem('rolecompass_learning_view_mode');
      if (saved === 'expanded' || saved === 'focused') return saved;
    } catch {
      return 'focused';
    }
    return 'focused';
  });
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [sortBy, setSortBy] = useState('recommended');

  const allResources = useMemo(() => getAllLearningResources(), []);

  const effectiveTargetRole = activeTargetRole || roles[0] || null;
  const currentRoleId = effectiveTargetRole?.id || 'frontend-engineer';

  useEffect(() => {
    if (!roleParam) return;
    const role = roles.find((item) => item.id === roleParam);
    if (role && activeTargetRole?.id !== role.id) setTargetRole(role);
  }, [roleParam, roles, activeTargetRole?.id, setTargetRole]);

  useEffect(() => {
    setActiveStepIndex(0);
  }, [currentRoleId]);

  useEffect(() => {
    if (!skillParam) return;
    if (skillParam === 'notes') setWorkspaceInitialTab('notes');
    else if (skillParam === 'checkpoints') setWorkspaceInitialTab('checkpoints');
    else if (skillParam === 'syllabus') setWorkspaceInitialTab('syllabus');
    else setWorkspaceInitialTab('workspace');
    setActivePane(
      ['notes', 'checkpoints', 'syllabus'].includes(skillParam) ? skillParam : 'workspace',
    );
  }, [skillParam]);

  const setRoadmapViewMode = (mode) => {
    setRoadmapViewModeState(mode);
    try {
      window.localStorage.setItem('rolecompass_learning_view_mode', mode);
    } catch {
      return;
    }
  };

  const recordFor = useCallback(
    (resourceId, role = effectiveTargetRole) =>
      learningRecords[
        getLearningRecordKey(candidateUser?.id, role?.id || currentRoleId, resourceId)
      ] || null,
    [learningRecords, candidateUser?.id, currentRoleId, effectiveTargetRole],
  );

  const roadmapSteps = useMemo(
    () => getRoleRoadmapSteps(effectiveTargetRole),
    [effectiveTargetRole],
  );
  const pathProgress = getPathProgress(effectiveTargetRole, roadmapSteps);
  const learningSummary = getLearningSummary(effectiveTargetRole);

  const stepStates = useMemo(() => {
    let previousComplete = true;
    return roadmapSteps.map((step) => {
      const resources = step.resources || [];
      const complete = resources.every(
        (resource) => recordFor(resource.id)?.status === 'completed',
      );
      const state = {
        ...step,
        complete,
        unlocked: previousComplete || roadmapViewMode === 'expanded',
      };
      previousComplete = previousComplete && complete;
      return state;
    });
  }, [roadmapSteps, recordFor, roadmapViewMode]);

  const safeStepIndex = Math.min(activeStepIndex, Math.max(stepStates.length - 1, 0));
  const visibleSteps =
    roadmapViewMode === 'focused' ? stepStates.slice(safeStepIndex, safeStepIndex + 1) : stepStates;

  const inProgressResources = useMemo(() => {
    return Object.values(learningRecords)
      .filter(
        (record) =>
          record.candidateId === candidateUser?.id &&
          record.roleId === currentRoleId &&
          record.status === 'in_progress',
      )
      .sort(
        (a, b) =>
          new Date(b.lastAccessedAt || b.startedAt) - new Date(a.lastAccessedAt || a.startedAt),
      )
      .map((record) => allResources.find((resource) => resource.id === record.resourceId))
      .filter(Boolean);
  }, [learningRecords, candidateUser?.id, currentRoleId, allResources]);

  const savedResources = useMemo(() => {
    return Object.values(learningRecords)
      .filter(
        (record) =>
          record.candidateId === candidateUser?.id &&
          record.roleId === currentRoleId &&
          record.saved,
      )
      .map((record) => allResources.find((resource) => resource.id === record.resourceId))
      .filter(Boolean);
  }, [learningRecords, candidateUser?.id, currentRoleId, allResources]);

  const categoryOptions = useMemo(() => {
    const present = Array.from(
      new Set(allResources.map((resource) => resource.category).filter(Boolean)),
    );
    return ['ALL', ...LEARNING_CATEGORIES.filter((category) => present.includes(category))];
  }, [allResources]);

  const typeOptions = useMemo(
    () => [
      'ALL',
      ...Array.from(new Set(allResources.map((resource) => resource.type).filter(Boolean))).sort(),
    ],
    [allResources],
  );

  const skillParamName = useMemo(() => {
    if (!skillParam || ['notes', 'checkpoints', 'syllabus'].includes(skillParam)) return '';
    const normalized = skillParam.replace(/[^a-z0-9]/gi, '').toLowerCase();
    return (
      skills.find((skill) =>
        skill.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '')
          .includes(normalized),
      )?.name || skillParam.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    );
  }, [skillParam, skills]);

  const selectedSkillResources = useMemo(
    () => (skillParamName ? getResourcesForSkill(skillParamName) : []),
    [skillParamName],
  );

  const workspaceResource = useMemo(() => {
    const idResource = verifiedLearningResources.find((resource) => resource.id === skillParam);
    return (
      idResource ||
      selectedSkillResources[0] ||
      inProgressResources[0] ||
      roadmapSteps.flatMap((step) => step.resources || [])[0] ||
      allResources[0] ||
      null
    );
  }, [
    skillParam,
    selectedSkillResources,
    inProgressResources,
    roadmapSteps,
    verifiedLearningResources,
    allResources,
  ]);

  const filteredDirectoryResources = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = allResources.filter((resource) => {
      const matchesSearch =
        !query ||
        [resource.title, resource.provider, resource.description, ...(resource.skills || [])]
          .join(' ')
          .toLowerCase()
          .includes(query);
      const matchesRole =
        selectedRoleFilter === 'ALL' ||
        (resource.roles || []).some((roleTitle) =>
          roleTitle.toLowerCase().includes(selectedRoleFilter.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === 'ALL' ||
        (resource.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesType =
        selectedType === 'ALL' ||
        (resource.type || '').toLowerCase() === selectedType.toLowerCase();
      const matchesDifficulty =
        selectedDifficulty === 'ALL' ||
        (resource.difficulty || '').toLowerCase() === selectedDifficulty.toLowerCase();
      return matchesSearch && matchesRole && matchesCategory && matchesType && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'duration-asc') {
        const minutes = (value = '') =>
          value.toLowerCase().includes('hour')
            ? parseInt(value, 10) * 60
            : parseInt(value, 10) || 0;
        return minutes(a.duration) - minutes(b.duration);
      }
      if (sortBy === 'difficulty') {
        const rank = { Beginner: 1, Intermediate: 2, Advanced: 3 };
        return (rank[a.difficulty] || 2) - (rank[b.difficulty] || 2);
      }
      const roleBoost = (resource) =>
        (resource.roles || []).includes(effectiveTargetRole?.title) ? 0 : 1;
      return roleBoost(a) - roleBoost(b);
    });
  }, [
    allResources,
    searchTerm,
    selectedRoleFilter,
    selectedCategory,
    selectedType,
    selectedDifficulty,
    sortBy,
    effectiveTargetRole?.title,
  ]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedRoleFilter !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedType !== 'ALL' ||
    selectedDifficulty !== 'ALL' ||
    sortBy !== 'recommended';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRoleFilter('ALL');
    setSelectedCategory('ALL');
    setSelectedType('ALL');
    setSelectedDifficulty('ALL');
    setSortBy('recommended');
  };

  const handleStart = (resource) => {
    if (!hasTargetRole) {
      showToast('info', 'Select a target role in Job Match before starting a learning source.');
      return;
    }
    const updated = startLearningResource(resource.id, effectiveTargetRole);
    if (updated) showToast('info', `Opened "${resource.title}" in the learning viewer.`);
  };

  const handleResume = (resource) => {
    if (!hasTargetRole) {
      showToast('info', 'Select a target role in Job Match before resuming a learning source.');
      return;
    }
    const updated = resumeLearningResource(resource.id, effectiveTargetRole);
    if (updated) showToast('info', `Resumed "${resource.title}" in the learning viewer.`);
  };

  const handleComplete = (resource, markCompleted) => {
    if (!hasTargetRole) {
      showToast('info', 'Select a target role in Job Match before updating progress.');
      return;
    }
    const updated = completeLearningResource(resource.id, markCompleted, effectiveTargetRole);
    if (!updated) return;
    showToast(
      markCompleted ? 'success' : 'info',
      markCompleted
        ? `Completed "${resource.title}" for ${effectiveTargetRole.title}. Logged to your local timeline.`
        : `Reopened "${resource.title}" in progress for ${effectiveTargetRole.title}.`,
    );
  };

  const handleSave = (resource, isSaved) => {
    const updated = saveLearningResource(resource.id, isSaved, effectiveTargetRole);
    if (!updated) return;
    showToast(
      'info',
      isSaved
        ? `Saved "${resource.title}" to your study list.`
        : `Removed "${resource.title}" from your saved list.`,
    );
  };

  const handleRoleChange = (event) => {
    const role = roles.find((item) => item.id === event.target.value);
    if (!role) return;
    const result = setTargetRole(role);
    if (result) {
      showToast(
        'success',
        `Learning target switched to "${role.title}". Roadmap and source links recalculated.`,
      );
    }
  };

  const handleReopenTimelineEvent = (event) => {
    const role =
      roles.find((item) => item.id === event.roleId || item.title === event.roleTitle) ||
      effectiveTargetRole;
    const resource = allResources.find((item) => item.id === event.resourceId);
    if (!role || !resource) return;
    openLearningViewer(
      resource,
      role,
      learningService.getRecord(candidateUser?.id, role, resource.id),
    );
  };

  const actions = {
    onStart: handleStart,
    onResume: handleResume,
    onComplete: handleComplete,
    onSave: handleSave,
    onSaveNotes: (resourceId, notes) => saveLearningNotes(resourceId, notes, effectiveTargetRole),
    onToggleCheckpoint: (resource, checkpointId, completed) =>
      setLearningCheckpoint(resource.id, checkpointId, completed, effectiveTargetRole),
    showToast,
  };

  return (
    <main className="cx-page">
      <section className="cx-hero">
        <div className="cx-hero-row">
          <div>
            <div className="cx-actions" style={{ marginBottom: 4 }}>
              <span className="cx-eyebrow">
                <BookOpen size={13} /> Structured learning
              </span>
              <span className="cx-muted">Learning Hub</span>
            </div>
            <h1 className="cx-title">Learn what the role actually needs.</h1>
            <p className="cx-subtitle">
              Your roadmap, workspace, notes, checkpoints, timeline, and saved resources are all
              scoped to the active target role and candidate in this browser.
            </p>
          </div>
          <div className="cx-actions">
            <label>
              <span className="cx-stat-label">Learning target</span>
              <select
                className="cx-select"
                style={{ marginTop: 6, minWidth: 220 }}
                value={effectiveTargetRole?.id || ''}
                onChange={handleRoleChange}
              >
                {roles.map((role) => (
                  <option value={role.id} key={role.id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </section>

      {!hasTargetRole && (
        <div className="cx-callout cx-callout-warn">
          <Target size={17} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            No Target Career Role Selected Yet. Choose a target role in Job Match, or use the
            selector above, to generate a tailored roadmap.{' '}
            <Link to="/candidate/roles" style={{ color: 'inherit', fontWeight: 800 }}>
              Open Job Match →
            </Link>
          </span>
        </div>
      )}

      <section className="cx-grid cx-stats-grid" style={{ marginTop: 20 }}>
        <div className="cx-card">
          <div className="cx-stat-label">Roadmap phases</div>
          <div className="cx-stat-value">
            {pathProgress.completedSteps}/{pathProgress.totalSteps}
          </div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Sources complete</div>
          <div className="cx-stat-value">{learningSummary.completedResources}</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Active workspaces</div>
          <div className="cx-stat-value">{learningSummary.inProgressResources}</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Checkpoints</div>
          <div className="cx-stat-value">{learningSummary.checkpointPercent}%</div>
        </div>
        <div className="cx-card">
          <div className="cx-stat-label">Tracked skills</div>
          <div className="cx-stat-value">{learningSummary.trackedSkills}</div>
        </div>
      </section>

      <div className="cx-layout" style={{ marginTop: 24 }}>
        <nav className="cx-sidebar" aria-label="Learning hub sections">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`cx-side-tab ${activePane === item.id ? 'cx-side-tab-active' : ''}`}
                key={item.id}
                type="button"
                onClick={() => {
                  setActivePane(item.id);
                  if (item.id === 'notes') setWorkspaceInitialTab('notes');
                  if (item.id === 'syllabus') setWorkspaceInitialTab('syllabus');
                  if (item.id === 'workspace') setWorkspaceInitialTab('workspace');
                }}
              >
                <Icon size={15} /> {item.label}
              </button>
            );
          })}
        </nav>

        <div>
          {activePane === 'path' && (
            <section className="cx-card">
              <div className="cx-section-head">
                <div>
                  <p className="cx-kicker">My learning path</p>
                  <h2>{effectiveTargetRole?.title || 'Target role'} roadmap</h2>
                </div>
                <div className="cx-actions">
                  <button
                    className={`cx-chip ${roadmapViewMode === 'focused' ? 'cx-chip-active' : ''}`}
                    type="button"
                    onClick={() => setRoadmapViewMode('focused')}
                  >
                    Forced step mode
                  </button>
                  <button
                    className={`cx-chip ${roadmapViewMode === 'expanded' ? 'cx-chip-active' : ''}`}
                    type="button"
                    onClick={() => setRoadmapViewMode('expanded')}
                  >
                    All steps
                  </button>
                </div>
              </div>

              <div className="cx-chip-row">
                {stepStates.map((step, index) => (
                  <button
                    className={`cx-chip ${index === safeStepIndex && roadmapViewMode === 'focused' ? 'cx-chip-active' : ''}`}
                    key={step.stepKey}
                    type="button"
                    onClick={() => {
                      if (!step.unlocked) {
                        showToast(
                          'info',
                          `Step 0${index + 1} is locked. Complete earlier phases, or switch to all steps to browse freely.`,
                        );
                        return;
                      }
                      setActiveStepIndex(index);
                    }}
                  >
                    {!step.unlocked && <Lock size={12} />}{' '}
                    {step.complete && <CheckCircle2 size={12} />} 0{index + 1}
                  </button>
                ))}
              </div>

              <div className="cx-grid" style={{ gap: 18 }}>
                {visibleSteps.map((step) => (
                  <div className="cx-card cx-card-soft" key={step.stepKey}>
                    <div className="cx-actions" style={{ justifyContent: 'space-between' }}>
                      <span className="cx-pill cx-pill-neutral">{step.phaseLabel}</span>
                      <span className="cx-pill">
                        {step.complete ? 'Step complete' : step.unlocked ? 'Available' : 'Locked'}
                      </span>
                    </div>
                    <h3 style={{ margin: '12px 0 6px', fontSize: '1rem' }}>{step.title}</h3>
                    <p className="cx-muted">{step.description}</p>
                    <div className="cx-chip-row">
                      {(step.skills || []).map((skill) => (
                        <span className="cx-pill" key={skill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    {(step.resources || []).length === 0 ? (
                      <div className="cx-empty">
                        No curated sources are mapped to this step yet. Browse the course directory
                        for the listed skills.
                      </div>
                    ) : (
                      <div className="cx-resource-grid">
                        {step.resources.map((resource) => (
                          <ResourceCard
                            compact
                            key={resource.id}
                            resource={resource}
                            record={recordFor(resource.id)}
                            onStart={handleStart}
                            onResume={handleResume}
                            onComplete={handleComplete}
                            onSave={handleSave}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {roadmapViewMode === 'focused' && stepStates.length > 0 && (
                <div
                  className="cx-actions"
                  style={{ justifyContent: 'space-between', marginTop: 18 }}
                >
                  <button
                    className="cx-button"
                    type="button"
                    disabled={safeStepIndex === 0}
                    onClick={() => setActiveStepIndex((index) => Math.max(0, index - 1))}
                  >
                    Previous
                  </button>
                  <span className="cx-muted">
                    Step {safeStepIndex + 1} of {stepStates.length}
                  </span>
                  <button
                    className="cx-button cx-button-primary"
                    type="button"
                    disabled={
                      safeStepIndex >= stepStates.length - 1 || !stepStates[safeStepIndex]?.complete
                    }
                    onClick={() =>
                      setActiveStepIndex((index) => Math.min(stepStates.length - 1, index + 1))
                    }
                  >
                    Next <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </section>
          )}

          {['workspace', 'notes', 'checkpoints', 'syllabus'].includes(activePane) && (
            <WorkspacePanel
              resource={workspaceResource}
              role={effectiveTargetRole}
              record={recordFor(workspaceResource?.id)}
              initialTab={workspaceInitialTab}
              actions={actions}
            />
          )}

          {activePane === 'workspaces' && (
            <section className="cx-card">
              <div className="cx-section-head">
                <div>
                  <p className="cx-kicker">Multi-learning mode</p>
                  <h2>Active learning workspaces ({inProgressResources.length})</h2>
                </div>
              </div>
              {inProgressResources.length === 0 ? (
                <div className="cx-empty">
                  No active workspaces.{' '}
                  <button className="cx-button" type="button" onClick={() => setActivePane('path')}>
                    Go to career roadmap
                  </button>
                </div>
              ) : (
                <div className="cx-resource-grid">
                  {inProgressResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      record={recordFor(resource.id)}
                      onStart={handleStart}
                      onResume={handleResume}
                      onComplete={handleComplete}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {activePane === 'timeline' && (
            <section className="cx-card">
              <div className="cx-section-head">
                <div>
                  <p className="cx-kicker">Learning timeline</p>
                  <h2>Local activity log</h2>
                </div>
              </div>
              <LearningTimeline
                events={timelineEvents}
                roles={roles}
                activeTargetRoleTitle={effectiveTargetRole?.title}
                onReopenResource={handleReopenTimelineEvent}
              />
            </section>
          )}

          {activePane === 'directory' && (
            <section className="cx-card">
              <div className="cx-section-head">
                <div>
                  <p className="cx-kicker">Course directory</p>
                  <h2>
                    {filteredDirectoryResources.length} of {allResources.length} resources available
                  </h2>
                </div>
                {hasActiveFilters && (
                  <button className="cx-button" type="button" onClick={resetFilters}>
                    <RotateCcw size={13} /> Reset filters
                  </button>
                )}
              </div>

              <div className="cx-filter-bar">
                <label>
                  <span className="cx-stat-label">Search catalogue</span>
                  <input
                    className="cx-input"
                    style={{ marginTop: 6 }}
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search title, provider, or skill..."
                  />
                </label>
                <label>
                  <span className="cx-stat-label">Sort</span>
                  <select
                    className="cx-select"
                    style={{ marginTop: 6 }}
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="title">Title</option>
                    <option value="duration-asc">Shortest first</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </label>
                <label>
                  <span className="cx-stat-label">Role</span>
                  <select
                    className="cx-select"
                    style={{ marginTop: 6 }}
                    value={selectedRoleFilter}
                    onChange={(event) => setSelectedRoleFilter(event.target.value)}
                  >
                    <option value="ALL">All roles</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.title}>
                        {role.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="cx-stat-label">Type</span>
                  <select
                    className="cx-select"
                    style={{ marginTop: 6 }}
                    value={selectedType}
                    onChange={(event) => setSelectedType(event.target.value)}
                  >
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="cx-stat-label">Difficulty</span>
                  <select
                    className="cx-select"
                    style={{ marginTop: 6 }}
                    value={selectedDifficulty}
                    onChange={(event) => setSelectedDifficulty(event.target.value)}
                  >
                    <option value="ALL">All levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </label>
              </div>

              <div className="cx-chip-row">
                {categoryOptions.map((category) => (
                  <button
                    className={`cx-chip ${selectedCategory === category ? 'cx-chip-active' : ''}`}
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'ALL' ? 'All categories' : category}
                  </button>
                ))}
              </div>

              {filteredDirectoryResources.length === 0 ? (
                <div className="cx-empty">
                  <strong>No Learning Resources Found</strong>
                  <div style={{ marginTop: 8 }}>
                    <button className="cx-button" type="button" onClick={resetFilters}>
                      Reset all filters
                    </button>
                  </div>
                </div>
              ) : (
                <div className="cx-resource-grid">
                  {filteredDirectoryResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      record={recordFor(resource.id)}
                      onStart={handleStart}
                      onResume={handleResume}
                      onComplete={handleComplete}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {activePane === 'saved' && (
            <section className="cx-card">
              <div className="cx-section-head">
                <div>
                  <p className="cx-kicker">Saved for later</p>
                  <h2>{savedResources.length} bookmarked resources</h2>
                </div>
              </div>
              {savedResources.length === 0 ? (
                <div className="cx-empty">
                  No saved resources for this role yet. Use the bookmark control on any resource to
                  add it here.
                </div>
              ) : (
                <div className="cx-resource-grid">
                  {savedResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      record={recordFor(resource.id)}
                      onStart={handleStart}
                      onResume={handleResume}
                      onComplete={handleComplete}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {skillParamName && (
        <div className="cx-callout" style={{ marginTop: 20 }}>
          <Target size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Opened from Job Match for <strong>{skillParamName}</strong>. The workspace above is
            scoped to {effectiveTargetRole?.title || 'your current target role'}; completion and
            notes are recorded locally for that role.
          </span>
        </div>
      )}
    </main>
  );
}
