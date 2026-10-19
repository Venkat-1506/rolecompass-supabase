import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  getAllLearningResources,
  getResourcesForRole,
  getRecommendedResourcesForGaps,
  getRoleRoadmapSteps,
  LEARNING_CATEGORIES
} from '../../data/learning.js';
import { getLearningRecordKey } from '../../services/learningService.js';
import { LearningTimeline } from '../../components/learning/LearningTimeline.jsx';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  Search,
  ExternalLink,
  RotateCcw,
  Compass,
  CheckSquare,
  Square,
  Bookmark,
  BookmarkCheck,
  PlayCircle,
  GraduationCap,
  ShieldCheck,
  ChevronRight,
  Layers,
  Calendar,
  Award,
  Milestone,
  Flag,
  ListOrdered,
  LayoutGrid,
  Filter,
  Check,
  Zap,
  Lock
} from 'lucide-react';

export function LearningHubPage() {
  const navigate = useNavigate();
  const {
    roles = [],
    candidateUser,
    targetRoleTitle,
    activeTargetRole,
    targetedRoles = [],
    targetedRoleTitles = [],
    hasTargetRole,
    activeRoleFit,
    setTargetRole,
    learningRecords = {},
    timelineEvents = [],
    openLearningViewer,
    startLearningResource,
    resumeLearningResource,
    completeLearningResource,
    saveLearningResource,
    showToast
  } = useApp();

  // Main Workspace Tab: 'roadmap' | 'workspaces' | 'timeline' | 'directory' | 'saved'
  const [activeTab, setActiveTab] = useState('roadmap');

  // Roadmap Step View Mode: Forced Step Mode ('focused') is default unless user explicitly saved a preference
  const [roadmapViewMode, setRoadmapViewModeState] = useState(() => {
    try {
      const saved = localStorage.getItem('rolecompass_learning_view_mode');
      if (saved === 'expanded' || saved === 'focused') return saved;
    } catch (e) {}
    return 'focused'; // Forced Step Mode default
  });

  const setRoadmapViewMode = (mode) => {
    setRoadmapViewModeState(mode);
    try {
      localStorage.setItem('rolecompass_learning_view_mode', mode);
    } catch (e) {}
  };

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Filters & Search State for Directory
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [sortBy, setSortBy] = useState('recommended');

  const allResources = useMemo(() => getAllLearningResources(), []);

  // A3: Filter options are derived from the real catalogue so every option returns results
  const categoryOptions = useMemo(() => {
    const present = Array.from(new Set(allResources.map(r => r.category).filter(Boolean)));
    const ordered = LEARNING_CATEGORIES.filter(c => present.includes(c));
    const extras = present.filter(c => !LEARNING_CATEGORIES.includes(c)).sort();
    return ['ALL', ...ordered, ...extras];
  }, [allResources]);

  const typeOptions = useMemo(() => {
    return ['ALL', ...Array.from(new Set(allResources.map(r => r.type).filter(Boolean))).sort()];
  }, [allResources]);

  // Derive effective target role: user selected role, or fallback to candidate's desired role / first available role
  const effectiveTargetRole = useMemo(() => {
    if (activeTargetRole && hasTargetRole) return activeTargetRole;
    if (activeTargetRole) return activeTargetRole;
    if (roles && roles.length > 0) {
      const preferred = candidateUser?.careerPreferences?.desiredRoles?.[0] || 'Frontend Developer';
      return roles.find(r => r.title.toLowerCase().includes(preferred.toLowerCase())) || roles[0];
    }
    return null;
  }, [activeTargetRole, hasTargetRole, roles, candidateUser]);

  // Current Target Role ID
  const currentRoleId = useMemo(() => {
    return effectiveTargetRole?.id || effectiveTargetRole?.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'frontend-engineer';
  }, [effectiveTargetRole]);

  // Step-by-Step Career Roadmap for the Active Target Role
  const roadmapSteps = useMemo(() => {
    return getRoleRoadmapSteps(effectiveTargetRole);
  }, [effectiveTargetRole]);

  // A1: Forced Step Mode is genuinely sequential — a step unlocks only once every prior step is completed.
  // Steps without matched sources never block progression.
  const isStepFullyCompleted = (step) => {
    if (!step || !step.resources || step.resources.length === 0) return true;
    const candidateId = candidateUser?.id || 'candidate-1';
    return step.resources.every(r => learningRecords[getLearningRecordKey(candidateId, currentRoleId, r.id)]?.status === 'completed');
  };

  const stepUnlocked = useMemo(() => {
    return roadmapSteps.map((_, idx) => roadmapSteps.slice(0, idx).every(isStepFullyCompleted));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapSteps, learningRecords, candidateUser, currentRoleId]);

  // Keep the focused step index in range if the active role (and therefore the roadmap) changes
  useEffect(() => {
    setActiveStepIndex(0);
  }, [currentRoleId]);

  const safeStepIndex = Math.min(Math.max(0, activeStepIndex), Math.max(0, roadmapSteps.length - 1));
  const currentStepCompleted = isStepFullyCompleted(roadmapSteps[safeStepIndex]);

  // Role-Specific In-Progress Resources (Supports MULTIPLE concurrent learnings!)
  const inProgressResources = useMemo(() => {
    const candidateId = candidateUser?.id || 'candidate-1';
    const list = [];

    allResources.forEach(res => {
      const key = getLearningRecordKey(candidateId, currentRoleId, res.id);
      const rec = learningRecords[key];
      if (rec && rec.status === 'in_progress') {
        list.push({ ...res, record: rec });
      }
    });

    return list.sort((a, b) => new Date(b.record.lastAccessedAt || b.record.startedAt) - new Date(a.record.lastAccessedAt || a.record.startedAt));
  }, [allResources, learningRecords, candidateUser, currentRoleId]);

  // Role-Specific Completed Resources
  const completedResources = useMemo(() => {
    const candidateId = candidateUser?.id || 'candidate-1';
    const list = [];

    allResources.forEach(res => {
      const key = getLearningRecordKey(candidateId, currentRoleId, res.id);
      const rec = learningRecords[key];
      if (rec && rec.status === 'completed') {
        list.push({ ...res, record: rec });
      }
    });

    return list.sort((a, b) => new Date(b.record.completedAt || 0) - new Date(a.record.completedAt || 0));
  }, [allResources, learningRecords, candidateUser, currentRoleId]);

  // Role-Specific Saved Resources
  const savedResources = useMemo(() => {
    const candidateId = candidateUser?.id || 'candidate-1';
    const list = [];

    allResources.forEach(res => {
      const key = getLearningRecordKey(candidateId, currentRoleId, res.id);
      const rec = learningRecords[key];
      if (rec && rec.saved === true) {
        list.push({ ...res, record: rec });
      }
    });

    return list;
  }, [allResources, learningRecords, candidateUser, currentRoleId]);

  // Calculate Roadmap Step Completion Stats
  const roadmapStats = useMemo(() => {
    const candidateId = candidateUser?.id || 'candidate-1';
    let totalStepResources = 0;
    let completedStepResources = 0;

    roadmapSteps.forEach(step => {
      step.resources.forEach(r => {
        totalStepResources++;
        const key = getLearningRecordKey(candidateId, currentRoleId, r.id);
        if (learningRecords[key]?.status === 'completed') {
          completedStepResources++;
        }
      });
    });

    const percent = totalStepResources > 0 ? Math.round((completedStepResources / totalStepResources) * 100) : 0;
    return { totalStepResources, completedStepResources, percent };
  }, [roadmapSteps, learningRecords, candidateUser, currentRoleId]);

  // Handle Start Learning -> Opens In-App Viewer Modal and tracks role-specific in-progress!
  const handleStart = (res) => {
    if (!effectiveTargetRole) {
      showToast('info', 'Select a target role in Roles & Fit before starting a learning source.');
      return;
    }
    startLearningResource(res.id, effectiveTargetRole);
    showToast('info', `Opened in-app learning viewer for "${res.title}".`);
  };

  // Handle Resume Learning -> Opens In-App Viewer Modal with saved progress
  const handleResume = (res) => {
    if (!effectiveTargetRole) {
      showToast('info', 'Select a target role in Roles & Fit before resuming a learning source.');
      return;
    }
    resumeLearningResource(res.id, effectiveTargetRole);
    showToast('info', `Resumed "${res.title}" in learning viewer.`);
  };

  // Handle Toggle Completion for active target role
  const handleToggleComplete = (res, e) => {
    if (e) e.stopPropagation();
    if (!effectiveTargetRole) {
      showToast('info', 'Select a target role in Roles & Fit before tracking completion.');
      return;
    }
    const key = getLearningRecordKey(candidateUser?.id, currentRoleId, res.id);
    const isCompleted = learningRecords[key]?.status === 'completed';
    completeLearningResource(res.id, !isCompleted, effectiveTargetRole);
    if (!isCompleted) {
      showToast('success', `Completed "${res.title}" for ${effectiveTargetRole.title}! Logged to timeline.`);
    } else {
      showToast('info', `Reopened "${res.title}" in progress for ${effectiveTargetRole.title}.`);
    }
  };

  // Handle Toggle Bookmark / Save
  const handleToggleSave = (res, e) => {
    if (e) e.stopPropagation();
    if (!effectiveTargetRole) return;
    const key = getLearningRecordKey(candidateUser?.id, currentRoleId, res.id);
    const isSaved = learningRecords[key]?.saved === true;
    saveLearningResource(res.id, !isSaved, effectiveTargetRole);
    showToast('info', isSaved ? `Removed "${res.title}" from saved list.` : `Saved "${res.title}" to study list.`);
  };

  // Handle Target Role Dropdown Switcher (Switch among targeted roles)
  const handleRoleChange = (e) => {
    const selectedTitle = e.target.value;
    const targetObj = targetedRoles.find(r => r.title === selectedTitle) || roles.find(r => r.title === selectedTitle);
    if (targetObj) {
      setTargetRole(targetObj);
      showToast('success', `Learning target switched to "${targetObj.title}". Roadmap & source links recalculated.`);
    }
  };

  // Filter & Sort Catalogue Resources
  const filteredAndSortedResources = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const filtered = allResources.filter(res => {
      if (q) {
        const matchesTitle = (res.title || '').toLowerCase().includes(q);
        const matchesProvider = (res.provider || '').toLowerCase().includes(q);
        const matchesDesc = (res.description || '').toLowerCase().includes(q);
        const matchesSkills = (res.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesProvider && !matchesDesc && !matchesSkills) return false;
      }

      if (selectedRoleFilter !== 'ALL') {
        const matchesRole = (res.roles || []).some(r => r.toLowerCase().includes(selectedRoleFilter.toLowerCase()));
        if (!matchesRole) return false;
      }

      if (selectedCategory !== 'ALL') {
        if ((res.category || '').toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      if (selectedType !== 'ALL') {
        if ((res.type || '').toLowerCase() !== selectedType.toLowerCase()) return false;
      }

      if (selectedDifficulty !== 'ALL') {
        if ((res.difficulty || '').toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'duration-asc') {
        const getMins = (dur) => {
          const m = parseInt(dur) || 0;
          if ((dur || '').includes('hour')) return m * 60;
          return m;
        };
        return getMins(a.duration) - getMins(b.duration);
      }
      if (sortBy === 'difficulty') {
        const diffRank = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return (diffRank[a.difficulty] || 2) - (diffRank[b.difficulty] || 2);
      }
      const targetTitle = effectiveTargetRole?.title;
      const aMatchesTarget = targetTitle ? (a.roles || []).includes(targetTitle) : false;
      const bMatchesTarget = targetTitle ? (b.roles || []).includes(targetTitle) : false;
      if (aMatchesTarget && !bMatchesTarget) return -1;
      if (!aMatchesTarget && bMatchesTarget) return 1;
      return 0;
    });
  }, [allResources, searchTerm, selectedRoleFilter, selectedCategory, selectedType, selectedDifficulty, sortBy, effectiveTargetRole]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRoleFilter('ALL');
    setSelectedCategory('ALL');
    setSelectedType('ALL');
    setSelectedDifficulty('ALL');
    setSortBy('recommended');
  };

  const hasActiveFilters = searchTerm || selectedRoleFilter !== 'ALL' || selectedCategory !== 'ALL' || selectedType !== 'ALL' || selectedDifficulty !== 'ALL' || sortBy !== 'recommended';

  // Guard: If no role exists in database or fallback
  if (!effectiveTargetRole) {
    return (
      <Section py="8">
        <PageContainer size="lg">
          <Stack gap="6">
            {/* Header Banner */}
            <div className="rc-candidate-header-banner" style={{ borderLeft: '5px solid #059669', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="rc-candidate-eyebrow">
                    CAREER LEARNING ENGINE
                  </span>
                  <Badge variant="info">Target Role Required</Badge>
                </div>
                <h1 className="rc-candidate-h1">Learning Hub</h1>
                <p className="rc-candidate-subtitle">
                  Structured sequential roadmaps and genuine verified learning sources tailored specifically to your target career path.
                </p>
              </div>

              <Link to="/candidate/roles" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" leftIcon={<Target size={16} />}>
                  Go to Roles & Fit Page
                </Button>
              </Link>
            </div>

            {/* Empty State Card */}
            <div
              className="rc-candidate-card"
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: 'rgba(236, 253, 245, 0.9)',
                  border: '1px solid #a7f3d0',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                  boxShadow: '0 8px 24px rgba(5, 150, 105, 0.15)'
                }}
              >
                <Target size={34} />
              </div>

              <h2 className="rc-h2" style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: '#0f172a' }}>
                No Target Career Role Selected Yet
              </h2>

              <p className="rc-candidate-subtitle" style={{ maxWidth: '580px', margin: '0 auto 26px auto', fontSize: '0.96rem', lineHeight: '1.6' }}>
                To view your step-by-step sequential curriculum, progressive roadmap milestones, and genuine online learning sources, please select your target career role from the <strong>Roles & Fit</strong> page by clicking <strong>"Set as Target Role"</strong>.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/candidate/roles" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="lg" leftIcon={<Target size={18} />} style={{ fontWeight: 800 }}>
                    Choose Target Role in Roles & Fit Page →
                  </Button>
                </Link>
              </div>
            </div>
          </Stack>
        </PageContainer>
      </Section>
    );
  }

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          {/* 1. EDITORIAL HEADER BANNER */}
          <div className="rc-candidate-header-banner" style={{ borderLeft: '5px solid #059669', marginBottom: '20px' }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="rc-candidate-eyebrow">
                  CAREER LEARNING ENGINE
                </span>
                <Badge variant="success" icon={<Sparkles size={13} />}>
                  Sequential Roadmap
                </Badge>
              </div>

              <h1 className="rc-candidate-h1">
                Learning Journey: <span style={{ color: '#059669' }}>{effectiveTargetRole.title}</span>
              </h1>
              <p className="rc-candidate-subtitle">
                Master your target career path through an ordered roadmap. Every step provides genuine online learning sources that open directly in our in-app learning viewer popup.
              </p>
            </div>

            {/* Target Role Selector Card (Shows ONLY explicitly targeted roles) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(167, 243, 208, 0.9)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                minWidth: '260px',
                boxShadow: '0 4px 18px rgba(5, 150, 105, 0.06)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Active Target Role:
                </label>
                <Link to="/candidate/roles" style={{ textDecoration: 'none' }}>
                  <span className="rc-fit-pill rc-fit-pill-high" style={{ cursor: 'pointer', fontSize: '0.75rem', padding: '3px 8px' }}>
                    <Target size={12} /> {activeTargetRole ? `${activeRoleFit?.readinessScore ?? 0}% Fit` : 'No target set'}
                  </span>
                </Link>
              </div>

              {targetedRoles.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <select
                    value={effectiveTargetRole.title}
                    onChange={handleRoleChange}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #10b981',
                      background: '#ecfdf5',
                      color: '#065f46',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                  >
                    {targetedRoles.map(r => (
                      <option key={r.id} value={r.title}>
                        {r.title} ({r.category})
                      </option>
                    ))}
                  </select>
                  <span className="rc-small" style={{ color: '#64748b', fontSize: '0.74rem', margin: 0 }}>
                    Switching among {targetedRoles.length} targeted roles • <Link to="/candidate/roles" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>+ Add in Roles & Fit</Link>
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>
                      {effectiveTargetRole.title}
                    </h3>
                    <Badge variant="success" style={{ fontSize: '0.68rem', padding: '1px 7px' }}>Targeted</Badge>
                  </div>
                  <span className="rc-small" style={{ color: '#64748b', fontSize: '0.74rem', margin: 0 }}>
                    Category: <strong>{effectiveTargetRole.category}</strong> • <Link to="/candidate/roles" style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>Change in Roles & Fit</Link>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. REAL METRICS SUMMARY BAR */}
          <div className="rc-candidate-summary-bar" style={{ marginBottom: '20px' }}>
            <div className="rc-candidate-summary-col">
              <span className="rc-label" style={{ color: '#64748b', fontSize: '0.75rem' }}>ROADMAP PROGRESS</span>
              <div style={{ marginTop: '4px' }}>
                <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.18rem', color: '#059669' }}>
                  {roadmapStats.completedStepResources} of {roadmapStats.totalStepResources} Sources
                </h3>
                <span className="rc-small" style={{ color: '#64748b' }}>
                  {roadmapStats.percent}% of curriculum mastered
                </span>
              </div>
            </div>

            <div className="rc-candidate-summary-col">
              <span className="rc-label" style={{ color: '#64748b', fontSize: '0.75rem' }}>ACTIVE WORKSPACES</span>
              <div style={{ marginTop: '4px' }}>
                <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.18rem', color: '#0284c7' }}>
                  {inProgressResources.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>In Progress</span>
                </h3>
                <span className="rc-small" style={{ color: '#0284c7', fontWeight: 600 }}>
                  Multi-learning active
                </span>
              </div>
            </div>

            <div className="rc-candidate-summary-col">
              <span className="rc-label" style={{ color: '#64748b', fontSize: '0.75rem' }}>COMPLETED MILESTONES</span>
              <div style={{ marginTop: '4px' }}>
                <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.18rem', color: '#059669' }}>
                  {completedResources.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Verified</span>
                </h3>
                <span className="rc-small" style={{ color: '#64748b' }}>
                  For {effectiveTargetRole.title}
                </span>
              </div>
            </div>

            <div className="rc-candidate-summary-col">
              <span className="rc-label" style={{ color: '#64748b', fontSize: '0.75rem' }}>STUDY LIST & TIMELINE</span>
              <div style={{ marginTop: '4px' }}>
                <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.18rem', color: '#0f172a' }}>
                  {savedResources.length} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>Saved</span> • {timelineEvents.length} Logs
                </h3>
                <span className="rc-small" style={{ color: '#64748b' }}>
                  Chronological tracking
                </span>
              </div>
            </div>
          </div>

          {/* 3. SEGMENTED NAVIGATION TABS (USER-FRIENDLY CONTROLS) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '8px 12px',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 18px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            {/* Tab Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('roadmap')}
                className={`rc-candidate-nav-link ${activeTab === 'roadmap' ? 'rc-candidate-nav-link-active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <Milestone size={16} />
                <span>Career Roadmap</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('workspaces')}
                className={`rc-candidate-nav-link ${activeTab === 'workspaces' ? 'rc-candidate-nav-link-active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <PlayCircle size={16} />
                <span>Active Workspaces</span>
                {inProgressResources.length > 0 && (
                  <Badge variant="info" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {inProgressResources.length}
                  </Badge>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`rc-candidate-nav-link ${activeTab === 'timeline' ? 'rc-candidate-nav-link-active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <Calendar size={16} />
                <span>Learning Timeline</span>
                {timelineEvents.length > 0 && (
                  <Badge variant="default" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {timelineEvents.length}
                  </Badge>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className={`rc-candidate-nav-link ${activeTab === 'directory' ? 'rc-candidate-nav-link-active' : ''}`}
                style={{ cursor: 'pointer' }}
              >
                <BookOpen size={16} />
                <span>Course Directory</span>
                <span className="rc-small" style={{ color: '#64748b' }}>({allResources.length})</span>
              </button>

              {savedResources.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('saved')}
                  className={`rc-candidate-nav-link ${activeTab === 'saved' ? 'rc-candidate-nav-link-active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <BookmarkCheck size={16} />
                  <span>Saved</span>
                  <Badge variant="warning" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                    {savedResources.length}
                  </Badge>
                </button>
              )}
            </div>

            {/* Quick Helper Text */}
            <span className="rc-small" style={{ color: '#64748b', fontSize: '0.78rem' }}>
              {activeTab === 'roadmap' && 'Ordered curriculum • Click source to launch in-app popup'}
              {activeTab === 'workspaces' && `${inProgressResources.length} ongoing course workspaces`}
              {activeTab === 'timeline' && 'Verified audit history for target roles'}
              {activeTab === 'directory' && `Explore all ${allResources.length} verified courses & docs`}
              {activeTab === 'saved' && `${savedResources.length} bookmarked courses for later`}
            </span>
          </div>

          {/* ============================================================== */}
          {/* TAB 1: STEP-BY-STEP CAREER ROADMAP (HERO USER EXPERIENCE) */}
          {/* ============================================================== */}
          {activeTab === 'roadmap' && (
            <div
              className="rc-candidate-card"
              style={{
                padding: 'clamp(20px, 2.5vw, 30px)',
                border: '1px solid rgba(167, 243, 208, 0.95)',
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              <Stack gap="6">
                {/* Roadmap Header & View Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ListOrdered size={24} />
                    </div>
                    <div>
                      <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a' }}>
                        Step-by-Step Curriculum for {effectiveTargetRole.title}
                      </h2>
                      <span className="rc-small" style={{ color: '#065f46', fontWeight: 600 }}>
                        Each step provides genuine learning sources that open directly inside our in-app learning viewer popup.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setRoadmapViewMode('focused')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: roadmapViewMode === 'focused' ? '1px solid #10b981' : '1px solid #cbd5e1',
                        background: roadmapViewMode === 'focused' ? '#ecfdf5' : '#ffffff',
                        color: roadmapViewMode === 'focused' ? '#059669' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Forced Step Mode (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoadmapViewMode('expanded')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: roadmapViewMode === 'expanded' ? '1px solid #10b981' : '1px solid #cbd5e1',
                        background: roadmapViewMode === 'expanded' ? '#ecfdf5' : '#ffffff',
                        color: roadmapViewMode === 'expanded' ? '#059669' : '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      All Steps (Expanded)
                    </button>
                  </div>
                </div>

                {/* Step Selector Pills - fully responsive grid with minmax(0, 1fr) preventing horizontal overflow */}
                <div className="rc-curriculum-stepper">
                  {roadmapSteps.map((step, idx) => {
                    const candidateId = candidateUser?.id || 'candidate-1';
                    const isStepDone = step.resources.length > 0 && step.resources.every(r => {
                      const key = getLearningRecordKey(candidateId, currentRoleId, r.id);
                      return learningRecords[key]?.status === 'completed';
                    });
                    const hasInProgress = step.resources.some(r => {
                      const key = getLearningRecordKey(candidateId, currentRoleId, r.id);
                      return learningRecords[key]?.status === 'in_progress';
                    });

                    const isSelected = roadmapViewMode === 'focused' ? safeStepIndex === idx : false;
                    const isLocked = roadmapViewMode === 'focused' && !stepUnlocked[idx] && !isSelected;

                    return (
                      <button
                        key={step.stepKey}
                        type="button"
                        aria-disabled={isLocked}
                        title={isLocked ? `Step ${step.stepNumber}: locked — complete Step 0${step.stepNumber - 1} to unlock` : `Step ${step.stepNumber}: ${step.title}`}
                        onClick={() => {
                          if (isLocked) {
                            showToast('info', `Step 0${step.stepNumber} is locked. Complete Step 0${step.stepNumber - 1} to unlock the next phase, or switch to "All Steps (Expanded)" to browse freely.`);
                            return;
                          }
                          setActiveStepIndex(idx);
                          if (roadmapViewMode !== 'focused') setRoadmapViewMode('focused');
                        }}
                        className={`rc-stepper-btn ${isSelected ? 'active' : ''} ${isStepDone ? 'completed' : hasInProgress ? 'in-progress' : ''}`}
                        style={isLocked ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: isStepDone ? '#059669' : hasInProgress ? '#0284c7' : '#64748b' }}>
                            STEP 0{step.stepNumber}
                          </span>
                          {isLocked ? (
                            <Lock size={13} color="#94a3b8" />
                          ) : isStepDone ? (
                            <CheckCircle2 size={14} color="#059669" />
                          ) : hasInProgress ? (
                            <Zap size={14} color="#0284c7" />
                          ) : (
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#cbd5e1' }} />
                          )}
                        </div>
                        <div className="rc-stepper-btn-title">
                          {step.title.replace(/^Step\s*\d+:\s*/i, '')}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Steps Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', boxSizing: 'border-box' }}>
                  {(roadmapViewMode === 'focused' ? [roadmapSteps[safeStepIndex]] : roadmapSteps).filter(Boolean).map((step, idx) => {
                    const candidateId = candidateUser?.id || 'candidate-1';
                    const stepCompletedCount = step.resources.filter(r => {
                      const key = getLearningRecordKey(candidateId, currentRoleId, r.id);
                      return learningRecords[key]?.status === 'completed';
                    }).length;
                    const stepInProgressCount = step.resources.filter(r => {
                      const key = getLearningRecordKey(candidateId, currentRoleId, r.id);
                      return learningRecords[key]?.status === 'in_progress';
                    }).length;

                    const isStepDone = stepCompletedCount === step.resources.length && step.resources.length > 0;
                    const isStepInProgress = stepInProgressCount > 0 && !isStepDone;

                    return (
                      <div
                        key={step.stepKey}
                        className="rc-roadmap-step-card"
                        style={{
                          background: isStepDone ? 'rgba(236, 253, 245, 0.75)' : isStepInProgress ? 'rgba(240, 249, 255, 0.75)' : '#ffffff',
                          border: isStepDone ? '1px solid #a7f3d0' : isStepInProgress ? '1px solid #bae6fd' : '1px solid #e2e8f0'
                        }}
                      >
                        {/* Step Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', minWidth: 0, flex: '1 1 320px' }}>
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                background: isStepDone ? '#059669' : isStepInProgress ? '#0284c7' : '#f1f5f9',
                                color: isStepDone || isStepInProgress ? '#ffffff' : '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '1rem',
                                flexShrink: 0
                              }}
                            >
                              {isStepDone ? <CheckCircle2 size={22} /> : `0${step.stepNumber}`}
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: isStepDone ? '#059669' : '#0284c7', letterSpacing: '0.04em' }}>
                                  {step.phaseLabel}
                                </span>
                                <Badge variant={isStepDone ? 'success' : isStepInProgress ? 'info' : 'default'} style={{ fontSize: '0.68rem' }}>
                                  {isStepDone ? 'Step Completed' : isStepInProgress ? 'In Progress' : 'Pending Step'}
                                </Badge>
                              </div>

                              <h3 className="rc-h3" style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#0f172a' }}>
                                {step.title}
                              </h3>
                              <p className="rc-small" style={{ margin: 0, color: '#475569', maxWidth: '780px' }}>
                                {step.description}
                              </p>
                            </div>
                          </div>

                          {/* Skills in this Step */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {step.skills.map(sk => (
                              <span
                                key={sk}
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#334155',
                                  background: '#f8fafc',
                                  border: '1px solid #cbd5e1',
                                  padding: '2px 8px',
                                  borderRadius: '6px'
                                }}
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Learning Sources for this Step */}
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '12px' }}>
                            Learning Sources for Step 0{step.stepNumber}:
                          </span>

                          <div className="rc-step-resources-grid">
                            {step.resources.length === 0 && (
                              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '28px 16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px' }}>
                                <BookOpen size={28} color="#94a3b8" style={{ marginBottom: '6px' }} />
                                <h4 className="rc-h4" style={{ margin: 0, color: '#334155' }}>No verified sources mapped to this step yet</h4>
                                <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                                  This phase focuses on {step.skills.join(', ')}. Explore the Course Directory to browse every available source.
                                </p>
                              </div>
                            )}
                            {step.resources.map(res => {
                              const key = getLearningRecordKey(candidateId, currentRoleId, res.id);
                              const rec = learningRecords[key] || {};
                              const isDone = rec.status === 'completed';
                              const isInProg = rec.status === 'in_progress';
                              const isSaved = rec.saved === true;

                              return (
                                <div
                                  key={res.id}
                                  className="rc-step-resource-item"
                                  style={{
                                    border: isDone ? '1px solid #10b981' : isInProg ? '1px solid #0284c7' : '1px solid #e2e8f0',
                                    background: isDone ? 'rgba(240, 253, 244, 0.45)' : '#ffffff'
                                  }}
                                >
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                      <span className="rc-provider-badge">
                                        {res.provider}
                                      </span>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Badge variant={isDone ? 'success' : isInProg ? 'info' : 'default'} style={{ fontSize: '0.68rem', padding: '1px 7px' }}>
                                          {isDone ? 'Completed' : isInProg ? 'In Progress' : res.difficulty}
                                        </Badge>
                                        <span className="rc-small" style={{ fontSize: '0.72rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                          <Clock size={11} />
                                          {res.duration}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={(e) => handleToggleSave(res, e)}
                                          title={isSaved ? "Saved to bookmarks" : "Save for later"}
                                          style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: isSaved ? '#f59e0b' : '#94a3b8',
                                            padding: '2px',
                                            display: 'flex',
                                            alignItems: 'center'
                                          }}
                                        >
                                          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        </button>
                                      </div>
                                    </div>

                                    <h4 className="rc-label" style={{ fontSize: '0.94rem', margin: '0 0 6px 0', lineHeight: '1.35' }}>
                                      <button
                                        type="button"
                                        onClick={() => handleStart(res)}
                                        style={{
                                          background: 'none',
                                          border: 'none',
                                          padding: 0,
                                          font: 'inherit',
                                          color: '#0f172a',
                                          cursor: 'pointer',
                                          textAlign: 'left',
                                          fontWeight: 700,
                                          transition: 'color 0.15s ease'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.color = '#059669'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                                      >
                                        {res.title}
                                      </button>
                                    </h4>

                                    <p className="rc-small" style={{ color: '#475569', fontSize: '0.82rem', margin: '0 0 12px 0', lineHeight: '1.45' }}>
                                      {res.description}
                                    </p>
                                  </div>

                                  <div className="rc-step-resource-footer">
                                    <Button
                                      variant={isDone ? 'secondary' : isInProg ? 'primary' : 'primary'}
                                      size="sm"
                                      onClick={() => handleStart(res)}
                                      rightIcon={<PlayCircle size={13} />}
                                      style={{ fontWeight: 700 }}
                                    >
                                      {isDone ? 'Review in Popup' : isInProg ? 'Resume in Popup' : 'Open in Popup'}
                                    </Button>

                                    <button
                                      type="button"
                                      onClick={(e) => handleToggleComplete(res, e)}
                                      title="Toggle completion record in RoleCompass"
                                      style={{
                                        background: isDone ? '#ecfdf5' : '#f8fafc',
                                        border: isDone ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        color: isDone ? '#059669' : '#475569',
                                        transition: 'all 0.15s ease'
                                      }}
                                    >
                                      {isDone ? <CheckSquare size={15} color="#059669" /> : <Square size={15} color="#64748b" />}
                                      <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {roadmapViewMode === 'focused' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={safeStepIndex === 0}
                      onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                    >
                      ← Previous Step
                    </Button>

                    <span className="rc-small" style={{ fontWeight: 700, color: currentStepCompleted ? '#059669' : '#64748b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      Step {safeStepIndex + 1} of {roadmapSteps.length}
                      {!currentStepCompleted && safeStepIndex < roadmapSteps.length - 1 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontWeight: 600 }}>
                          <Lock size={12} /> complete this step to unlock the next
                        </span>
                      )}
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={safeStepIndex === roadmapSteps.length - 1 || !currentStepCompleted}
                      onClick={() => setActiveStepIndex(prev => Math.min(roadmapSteps.length - 1, prev + 1))}
                      rightIcon={<ArrowRight size={13} />}
                    >
                      Next Step →
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ACTIVE IN-PROGRESS WORKSPACES */}
          {/* ============================================================== */}
          {activeTab === 'workspaces' && (
            <div className="rc-candidate-card" style={{ padding: '28px' }}>
              <Stack gap="5">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle size={22} />
                    </div>
                    <div>
                      <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                        Active Learning Workspaces ({inProgressResources.length} Ongoing)
                      </h2>
                      <span className="rc-small" style={{ color: '#64748b' }}>
                        Resume your currently open modules across your target career roles
                      </span>
                    </div>
                  </div>
                  <Badge variant="info">Multi-Learning Mode</Badge>
                </div>

                {inProgressResources.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {inProgressResources.map(res => (
                      <div
                        key={res.id}
                        style={{
                          background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.7) 0%, #ffffff 100%)',
                          border: '1px solid #bae6fd',
                          borderRadius: '14px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.05)'
                        }}
                      >
                        <Stack gap="2">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="rc-provider-badge">{res.provider}</span>
                            <span className="rc-small" style={{ color: '#0284c7', fontWeight: 600, fontSize: '0.74rem' }}>
                              <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} /> {res.duration}
                            </span>
                          </div>

                          <h4 className="rc-label" style={{ fontSize: '0.98rem', margin: '4px 0 2px 0', color: '#0f172a' }}>
                            {res.title}
                          </h4>
                          <p className="rc-small" style={{ color: '#475569', fontSize: '0.82rem', margin: 0, lineHeight: '1.4' }}>
                            {res.description}
                          </p>
                        </Stack>

                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleResume(res)}
                            rightIcon={<PlayCircle size={13} />}
                          >
                            Resume in Popup
                          </Button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleComplete(res, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#059669'
                            }}
                          >
                            <Square size={16} /> Mark Complete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 16px', background: '#f8fafc', borderRadius: '14px' }}>
                    <PlayCircle size={36} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <h4 className="rc-h4" style={{ margin: 0, color: '#334155' }}>No Active Workspaces</h4>
                    <p className="rc-small" style={{ color: '#64748b', maxWidth: '380px', margin: '4px auto 16px auto' }}>
                      Start any module from your Career Roadmap to begin an active workspace.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('roadmap')}>
                      Go to Career Roadmap
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: ROLE LEARNING TIMELINE */}
          {/* ============================================================== */}
          {activeTab === 'timeline' && (
            <LearningTimeline
              events={timelineEvents}
              roles={roles}
              activeTargetRoleTitle={effectiveTargetRole.title}
              onReopenResource={(resId, roleId) => {
                const targetRole = roles.find(r => r.id === roleId || r.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === roleId) || effectiveTargetRole;
                openLearningViewer(resId, targetRole);
              }}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 4: FULL CURATED DIRECTORY */}
          {/* ============================================================== */}
          {activeTab === 'directory' && (
            <div className="rc-candidate-card" style={{ padding: '28px' }}>
              <Stack gap="5">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                      Full Curated Learning Directory
                    </h2>
                    <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                      Search and explore verified courses, official guides, and documentation.
                    </p>
                  </div>

                  <span className="rc-small" style={{ fontWeight: 700, color: '#059669' }}>
                    {filteredAndSortedResources.length} of {allResources.length} Resources Available
                  </span>
                </div>

                {/* Search Bar & Primary Filters */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px' }}>
                  <Input
                    placeholder="Search by topic, skill (e.g. SQL, React, Docker, Figma), or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={16} color="#64748b" />}
                  />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="title">Sort: Title (A-Z)</option>
                    <option value="duration-asc">Sort: Shortest Duration</option>
                    <option value="difficulty">Sort: Difficulty Level</option>
                  </select>
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
                    Category:
                  </span>
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: selectedCategory === cat ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid #e2e8f0',
                        background: selectedCategory === cat ? '#ecfdf5' : '#ffffff',
                        color: selectedCategory === cat ? '#059669' : '#475569',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat === 'ALL' ? 'All Categories' : cat}
                    </button>
                  ))}
                </div>

                {/* Detailed Filters: Role Filter, Type, Difficulty */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(241, 245, 249, 0.6)', padding: '12px 14px', borderRadius: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      FILTER BY ROLE:
                    </label>
                    <select
                      value={selectedRoleFilter}
                      onChange={(e) => setSelectedRoleFilter(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="ALL">All Roles ({allResources.length})</option>
                      {roles.map(r => (
                        <option key={r.id} value={r.title}>{r.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      RESOURCE TYPE:
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="ALL">All Resource Types</option>
                      {typeOptions.filter(t => t !== 'ALL').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                      DIFFICULTY:
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="ALL">All Difficulties</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        style={{
                          padding: '6px 12px',
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#e11d48',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <RotateCcw size={13} /> Reset Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Resource Grid */}
                {filteredAndSortedResources.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {filteredAndSortedResources.map(res => {
                      const candidateId = candidateUser?.id || 'candidate-1';
                      const key = getLearningRecordKey(candidateId, currentRoleId, res.id);
                      const rec = learningRecords[key] || {};
                      const isDone = rec.status === 'completed';
                      const isInProg = rec.status === 'in_progress';
                      const isSaved = rec.saved === true;

                      return (
                        <div key={res.id} className="rc-learning-resource-card">
                          <Stack gap="3">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="rc-provider-badge">
                                {res.provider}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Badge variant={res.difficulty === 'Beginner' ? 'info' : res.difficulty === 'Intermediate' ? 'default' : 'warning'} style={{ fontSize: '0.68rem' }}>
                                  {res.difficulty}
                                </Badge>
                                {isDone && <Badge variant="success" style={{ fontSize: '0.68rem' }}>Completed</Badge>}
                                {isInProg && !isDone && <Badge variant="warning" style={{ fontSize: '0.68rem' }}>In Progress</Badge>}
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleSave(res, e)}
                                  title={isSaved ? "Saved to bookmarks" : "Save for later"}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: isSaved ? '#f59e0b' : '#94a3b8',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                </button>
                              </div>
                            </div>

                            <div>
                              <h4 className="rc-h4" style={{ fontSize: '1.02rem', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                                <button
                                  type="button"
                                  onClick={() => handleStart(res)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    font: 'inherit',
                                    color: '#0f172a',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontWeight: 800
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#059669'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                                >
                                  {res.title}
                                </button>
                              </h4>
                              <p className="rc-small" style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: '1.45' }}>
                                {res.description}
                              </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                              <span>{res.type}</span>
                              <span><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />{res.duration}</span>
                            </div>

                            <div>
                              <Cluster gap="1">
                                {(res.skills || []).map(sk => (
                                  <span
                                    key={sk}
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 600,
                                      color: '#334155',
                                      background: '#f1f5f9',
                                      padding: '1px 7px',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    {sk}
                                  </span>
                                ))}
                              </Cluster>
                            </div>
                          </Stack>

                          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <Button
                              variant={isDone ? 'secondary' : isInProg ? 'primary' : 'primary'}
                              size="sm"
                              onClick={() => handleStart(res)}
                              rightIcon={<PlayCircle size={13} />}
                            >
                              {isDone ? 'Review in Popup' : isInProg ? 'Resume in Popup' : 'Open in Popup'}
                            </Button>

                            <button
                              type="button"
                              onClick={(e) => handleToggleComplete(res, e)}
                              title="Toggle completion record in RoleCompass"
                              style={{
                                background: isDone ? '#ecfdf5' : '#f8fafc',
                                border: isDone ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                                borderRadius: '8px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: isDone ? '#059669' : '#475569',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isDone ? <CheckSquare size={15} color="#059669" /> : <Square size={15} color="#64748b" />}
                              <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rc-candidate-empty-full">
                    <Search size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                    <h3 className="rc-h3" style={{ margin: 0 }}>No Learning Resources Found</h3>
                    <p className="rc-small" style={{ color: '#64748b', marginTop: '4px', maxWidth: '380px' }}>
                      No learning resources matched your search and filter criteria. Try resetting filters to explore the full catalogue.
                    </p>
                    <Button variant="secondary" size="sm" style={{ marginTop: '16px' }} onClick={handleResetFilters}>
                      Reset All Filters
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: SAVED RESOURCES */}
          {/* ============================================================== */}
          {activeTab === 'saved' && (
            <div className="rc-candidate-card" style={{ padding: '28px' }}>
              <Stack gap="5">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookmarkCheck size={22} color="#f59e0b" />
                  <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>
                    Saved for Later ({savedResources.length} Bookmarks)
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                  {savedResources.map(res => (
                    <div key={res.id} className="rc-learning-resource-card">
                      <Stack gap="2">
                        <span className="rc-provider-badge">{res.provider}</span>
                        <h4 className="rc-h4" style={{ margin: '4px 0 2px 0' }}>{res.title}</h4>
                        <p className="rc-small" style={{ color: '#64748b' }}>{res.description}</p>
                      </Stack>
                      <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button variant="primary" size="sm" onClick={() => handleStart(res)}>
                          Open in Popup
                        </Button>
                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(res, e)}
                          style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Stack>
            </div>
          )}
        </Stack>
      </PageContainer>
    </Section>
  );
}