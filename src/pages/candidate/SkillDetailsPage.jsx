import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Select } from '../../components/ui/Select.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { getResourcesForSkill } from '../../data/learning.js';
import { getLearningRecordKey } from '../../services/learningService.js';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  CheckSquare,
  Square,
  AlertCircle
} from 'lucide-react';

export function SkillDetailsPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const {
    skills = [],
    learningModules = [],
    updateSkillProgress,
    activeTargetRole,
    candidateUser,
    resourceStates = {},
    learningRecords = {},
    startLearningResource,
    completeLearningResource,
    showToast
  } = useApp();

  const [toastMsg, setToastMsg] = useState(null);

  // Match skill from global catalogue or generate fallback
  const rawSkill = skills.find(s => 
    s.id === skillId || 
    s.id === skillId?.replace('-', '') || 
    s.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes((skillId || '').replace(/[^a-z0-9]/g, ''))
  );

  const skillName = rawSkill?.name || (skillId ? skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Skill');

  const skill = rawSkill || {
    id: skillId,
    name: skillName,
    category: 'Technical Skill',
    description: `Targeted learning resources, official documentation, and practical exercises to master ${skillName}.`,
    learningResourcesCount: 6,
    relatedRoles: [activeTargetRole?.title || 'Software Engineer']
  };

  // Check role requirement level
  const isRequiredForTarget = (activeTargetRole?.coreSkills || []).some(
    s => s.toLowerCase() === skillName.toLowerCase() || skillName.toLowerCase().includes(s.toLowerCase())
  );
  const isPreferredForTarget = (activeTargetRole?.relatedSkills || []).some(
    s => s.toLowerCase() === skillName.toLowerCase() || skillName.toLowerCase().includes(s.toLowerCase())
  );

  // Check candidate status in profile
  const isCandidateVerified = (candidateUser?.skills || []).some(
    s => s.toLowerCase() === skillName.toLowerCase() || skillName.toLowerCase().includes(s.toLowerCase())
  );

  // Verified resources from catalogue
  const verifiedResources = getResourcesForSkill(skillName);

  // Role-scoped learning record resolver (falls back to legacy flat state map)
  const getResourceRecord = (res) => {
    const key = getLearningRecordKey(candidateUser?.id, activeTargetRole?.id, res.id);
    return learningRecords[key] || resourceStates[res.id] || {};
  };

  // Module state from app
  const module = learningModules.find(m => m.skillId === skillId || m.skillId === skill.id) || {
    id: `mod-${skillId}`,
    title: `${skillName} Mastery`,
    progressState: isCandidateVerified ? 'Demonstrated' : 'Learning',
    completionPercentage: isCandidateVerified ? 100 : 40,
    estimatedHours: 4
  };

  const handleStateChange = (newState) => {
    updateSkillProgress(skill.id, newState);
    showToast('success', `Skill status updated to "${newState}"!`);
  };

  const handleLaunchResource = (res) => {
    startLearningResource(res.id, activeTargetRole);
    if (module.progressState === 'Not Started') {
      updateSkillProgress(skill.id, 'Learning');
    }
  };

  const handleToggleComplete = (res, e) => {
    e.stopPropagation();
    const isCompleted = getResourceRecord(res).status === 'completed';
    completeLearningResource(res.id, !isCompleted, activeTargetRole);
    if (!isCompleted) {
      showToast('success', `Marked "${res.title}" as completed for ${activeTargetRole?.title}!`);
    } else {
      showToast('info', `Marked "${res.title}" as in progress.`);
    }
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          <Cluster align="center" gap="2" className="rc-small" style={{ color: '#64748b', fontWeight: 600 }}>
            <Link to="/candidate/learning" className="rc-link" style={{ color: '#059669', textDecoration: 'none' }}>Learning Hub</Link>
            <span>/</span>
            <span style={{ color: '#0f172a' }}>{skill.name}</span>
          </Cluster>

          {toastMsg && <Toast type="success" message={toastMsg} onClose={() => setToastMsg(null)} />}

          {/* Unified Candidate Header Banner */}
          <div className="rc-candidate-header-banner">
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="rc-candidate-eyebrow">
                  SKILL MASTERY MODULE
                </span>
                {isRequiredForTarget && (
                  <Badge variant="warning" icon={<Target size={12} />}>
                    Required for {activeTargetRole?.title}
                  </Badge>
                )}
                {isPreferredForTarget && (
                  <Badge variant="info">
                    Preferred Skill
                  </Badge>
                )}
                {isCandidateVerified && (
                  <Badge variant="success" icon={<CheckCircle2 size={12} />}>
                    Verified in Profile
                  </Badge>
                )}
              </div>

              <h1 className="rc-candidate-h1">{skill.name}</h1>
              <p className="rc-candidate-subtitle">{skill.description}</p>
            </div>

            <div style={{ minWidth: '220px' }}>
              <Select
                label="My Skill Progress Status"
                value={module.progressState}
                onChange={(e) => handleStateChange(e.target.value)}
                options={[
                  { value: 'Not Started', label: 'Not Started' },
                  { value: 'Learning', label: 'In Progress (Learning)' },
                  { value: 'Practiced', label: 'Practiced (Exercises Done)' },
                  { value: 'Demonstrated', label: 'Demonstrated (Mastered)' }
                ]}
              />
            </div>
          </div>

          {/* Progress Overview Card */}
          <div className="rc-candidate-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
                Module Mastery: <strong>{module.completionPercentage}%</strong>
              </span>
              <Badge variant={module.progressState === 'Demonstrated' ? 'success' : module.progressState === 'Learning' ? 'warning' : 'default'}>
                {module.progressState}
              </Badge>
            </div>
            <Progress value={module.completionPercentage} />
          </div>

          <Grid cols="responsive-3" gap="6">
            <div className="rc-col-span-2-desktop">
              <div className="rc-candidate-card" style={{ padding: '28px' }}>
                <Stack gap="5">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.25rem' }}>Verified Learning Resources</h3>
                      <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                        Curated from reputable platforms with verified canonical URLs.
                      </p>
                    </div>
                    <Badge variant="info">{verifiedResources.length} Resources</Badge>
                  </div>

                  <Stack gap="3">
                    {verifiedResources.map((res) => {
                      const rec = getResourceRecord(res);
                      const isDone = rec.status === 'completed';
                      const isInProg = rec.status === 'in_progress';

                      return (
                        <div
                          key={res.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.75)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: isDone ? '1px solid #10b981' : isInProg ? '1px solid #0284c7' : '1px solid rgba(226, 232, 240, 0.9)',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                            borderRadius: '14px',
                            padding: '18px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '16px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div className="rc-flex rc-items-center rc-gap-3" style={{ maxWidth: '65%' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <BookOpen size={20} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                                <span className="rc-provider-badge">
                                  {res.provider}
                                </span>
                                <span className="rc-small" style={{ color: '#64748b', fontSize: '0.74rem' }}>
                                  {res.type} • {res.duration} • {res.difficulty}
                                </span>
                              </div>
                              <h4 className="rc-label" style={{ fontSize: '0.96rem', margin: 0, color: '#0f172a' }}>
                                <a
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => handleLaunchResource(res)}
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = '#059669'; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                                >
                                  {res.title}
                                </a>
                              </h4>
                              <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '0.82rem' }}>
                                {res.description}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={(e) => handleToggleComplete(res, e)}
                              title="Toggle completion"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: isDone ? '#059669' : '#64748b'
                              }}
                            >
                              {isDone ? <CheckSquare size={17} color="#059669" /> : <Square size={17} />}
                              {isDone ? 'Completed' : 'Mark done'}
                            </button>

                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => handleLaunchResource(res)}
                              rightIcon={<ExternalLink size={14} />}
                            >
                              Open Resource
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </Stack>
                </Stack>
              </div>
            </div>

            {/* Sidebar Details */}
            <Stack gap="6">
              <div className="rc-candidate-card" style={{ padding: '24px' }}>
                <Stack gap="4">
                  <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.1rem' }}>Target Role Relevance</h3>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <span className="rc-label" style={{ fontSize: '0.75rem', color: '#64748b' }}>ACTIVE TARGET ROLE</span>
                    <h4 className="rc-h4" style={{ margin: '4px 0 0 0', color: '#0f172a' }}>{activeTargetRole?.title}</h4>
                    <span className="rc-small" style={{ color: '#059669', fontWeight: 600 }}>{activeTargetRole?.category}</span>
                  </div>

                  <p className="rc-small" style={{ color: '#475569', lineHeight: '1.5', margin: 0 }}>
                    {isRequiredForTarget
                      ? `This is a required core competency for ${activeTargetRole?.title}. Mastering it directly closes an essential requirement.`
                      : isPreferredForTarget
                      ? `This is a preferred supporting skill for ${activeTargetRole?.title}. Having it gives you a distinct advantage during technical evaluation.`
                      : `Mastering ${skill.name} expands your versatility across cross-functional engineering workflows.`}
                  </p>

                  <Link to={`/roles/${activeTargetRole?.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm" style={{ width: '100%' }} rightIcon={<ArrowRight size={13} />}>
                      View Role Requirements
                    </Button>
                  </Link>
                </Stack>
              </div>

              <div className="rc-candidate-card" style={{ padding: '24px' }}>
                <Stack gap="4">
                  <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.1rem' }}>Roles Strengthened</h3>
                  <p className="rc-small" style={{ color: '#64748b', margin: 0 }}>
                    Mastering {skill.name} directly improves your fit rating across these career pathways:
                  </p>
                  <Cluster gap="2">
                    {(skill.relatedRoles || [activeTargetRole?.title]).map(r => (
                      <Tag key={r}>{r}</Tag>
                    ))}
                  </Cluster>
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Stack>
      </PageContainer>
    </Section>
  );
}
