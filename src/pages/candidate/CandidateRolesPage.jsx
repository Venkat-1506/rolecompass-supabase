import React, { useState } from 'react';
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
import { Progress } from '../../components/ui/Progress.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { calculateCandidateRoleFit, skillsMatch } from '../../data/matching.js';
import { fuzzyMatch } from '../../utils/helpers.js';
import {
  Target,
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers
} from 'lucide-react';
import '../../styles/glass.css';

export function CandidateRolesPage() {
  const {
    roles,
    candidateUser,
    jobs,
    setTargetRole,
    targetRoleTitle,
    activeTargetRole,
    targetedRoles = [],
    targetedRoleTitles = [],
    hasTargetRole
  } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  // Active target role (Single source of truth from context & storage)
  const currentTargetRole = activeTargetRole || (roles.find(r => 
    targetRoleTitle && (
      r.title.toLowerCase() === targetRoleTitle.toLowerCase() ||
      r.id.toLowerCase() === targetRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      r.title.toLowerCase().includes(targetRoleTitle.toLowerCase())
    )
  ) || null);

  // Live computed role fit for the active target role
  const targetRoleFit = currentTargetRole
    ? calculateCandidateRoleFit(candidateUser, currentTargetRole)
    : { readinessScore: 0, matchedCoreSkills: [], missingCoreSkills: [], topGapSkill: 'None', matchedCoreCount: 0, totalCoreCount: 0 };

  // Filtered jobs matching active target role
  const matchedJobs = jobs.filter(j => {
    if (!j || !currentTargetRole) return false;
    const jc = (j.category || '').toLowerCase();
    const rc = (currentTargetRole?.category || '').toLowerCase();
    const jt = (j.title || '').toLowerCase();
    const rt = (currentTargetRole?.title || '').toLowerCase();

    const titleMatch = jt.includes(rt.split(' ')[0]) || rt.includes(jt.split(' ')[0]);
    const catMatch = jc === rc || (jc.includes('tech') && rc.includes('engineer')) || (jc.includes('engineer') && rc.includes('tech'));
    const skillMatch = (j.skills || []).some(s => 
      (currentTargetRole?.coreSkills || []).some(cs => skillsMatch(s, cs))
    );

    return titleMatch || catMatch || skillMatch;
  });

  // Handle setting any role as the candidate's target role
  const handleSetTarget = (roleToSet) => {
    const result = setTargetRole(roleToSet);
    if (result) {
      setToastMessage(`"${roleToSet.title}" set as your target career role! Learning Hub updated.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Distinct categories from role catalog
  const categories = ['ALL', ...Array.from(new Set(roles.map(r => r.category || 'General')))];

  // Search & category filtered roles
  const filteredRoles = roles.filter(r => {
    const q = searchQuery.trim();
    const matchesSearch = !q ||
      fuzzyMatch(r.title, q) ||
      fuzzyMatch(r.category, q) ||
      fuzzyMatch(r.overview, q) ||
      (r.coreSkills || []).some(sk => fuzzyMatch(sk, q));

    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          {/* TOAST FEEDBACK */}
          {toastMessage && (
            <Toast
              type="success"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          )}

          {/* Unified Candidate Header Banner */}
          <div className="rc-candidate-header-banner">
            <div>
              <span className="rc-candidate-eyebrow">
                CAREER VECTOR & FIT INTELLIGENCE
              </span>
              <h1 className="rc-candidate-h1">Roles & Fit Analysis</h1>
              <p className="rc-candidate-subtitle">
                Select your target career role, analyze real-time skill gaps, and view transparent readiness metrics computed from your candidate profile.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/candidate/learning">
                <Button variant="secondary" size="md" leftIcon={<BookOpen size={16} />}>
                  Open Learning Hub
                </Button>
              </Link>
            </div>
          </div>

          {/* ========================================================
              LEVEL 1: ACTIVE TARGET ROLE SPOTLIGHT (Primary Glass Card)
             ======================================================== */}
          {currentTargetRole ? (
            <div className="rc-candidate-card" style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(236, 253, 245, 0.5) 100%)',
              border: '1px solid rgba(167, 243, 208, 0.85)',
              boxShadow: '0 12px 36px 0 rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
            }}>
            <Stack gap="6">
              {/* HEADER ROW */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: '#059669',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px rgba(5, 150, 105, 0.28)'
                  }}>
                    <Target size={28} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#059669' }}>
                        ACTIVE TARGET CAREER ROLE
                      </span>
                      <Badge variant="success" icon={<ShieldCheck size={12} />}>Primary Focus</Badge>
                    </div>
                    <h2 className="rc-h2" style={{ margin: '4px 0 0', fontSize: '1.6rem', color: '#0f172a' }}>
                      {currentTargetRole.title}
                    </h2>
                    <span className="rc-small" style={{ color: '#64748b', fontWeight: 600 }}>
                      Category: {currentTargetRole.category}
                    </span>
                  </div>
                </div>

                {/* READINESS BADGE */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(167, 243, 208, 0.9)',
                  borderRadius: '16px',
                  padding: '12px 20px',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Calculated Readiness
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', lineHeight: '1.1' }}>
                    {targetRoleFit.readinessScore}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                    {targetRoleFit.matchedCoreCount} of {targetRoleFit.totalCoreCount} core requirements
                  </div>
                </div>
              </div>

              {/* OVERVIEW SNIPPET */}
              <p style={{ color: '#334155', fontSize: '0.94rem', lineHeight: '1.6', margin: 0, maxWidth: '820px' }}>
                {currentTargetRole.overview || currentTargetRole.description}
              </p>

              {/* READINESS PROGRESS BAR */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                  <span>Core Skill Alignment</span>
                  <span style={{ color: '#059669' }}>{targetRoleFit.readinessScore}% Competency Match</span>
                </div>
                <Progress value={targetRoleFit.readinessScore} />
              </div>

              {/* 4-METRIC DETAIL MATRIX */}
              <Grid cols="responsive-4" gap="4">
                {/* 1. Strongest Skill */}
                <div style={{ background: 'rgba(255, 255, 255, 0.75)', border: '1px solid rgba(226, 232, 240, 0.9)', borderRadius: '14px', padding: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', display: 'block' }}>
                    Verified Match
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: '#059669', fontWeight: 800, fontSize: '0.95rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{targetRoleFit.strongestSkill}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '2px' }}>Present on profile</span>
                </div>

                {/* 2. Top Gap Skill */}
                <div style={{ background: 'rgba(255, 251, 235, 0.85)', border: '1px solid rgba(254, 243, 199, 0.9)', borderRadius: '14px', padding: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b45309', display: 'block' }}>
                    Primary Skill Gap
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: '#d97706', fontWeight: 800, fontSize: '0.95rem' }}>
                    <AlertCircle size={16} />
                    <span>{targetRoleFit.topGapSkill}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#92400e', display: 'block', marginTop: '2px' }}>Target for promotion</span>
                </div>

                {/* 3. Missing Skills Count */}
                <div style={{ background: 'rgba(240, 249, 255, 0.85)', border: '1px solid rgba(224, 242, 254, 0.9)', borderRadius: '14px', padding: '16px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0369a1', display: 'block' }}>
                    Identified Gaps
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', color: '#0284c7', fontWeight: 800, fontSize: '0.95rem' }}>
                    <Layers size={16} />
                    <span>{targetRoleFit.missingCoreSkills.length} Core Gaps</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', marginTop: '2px' }}>Modules available in Hub</span>
                </div>

                {/* 4. Action */}
                <div style={{ background: 'rgba(236, 253, 245, 0.85)', border: '1px solid rgba(167, 243, 208, 0.9)', borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#059669', display: 'block' }}>
                    Action Plan
                  </span>
                  <Link to="/candidate/learning" style={{ color: '#059669', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', marginTop: '6px' }}>
                    <span>Launch Skill Hub</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </Grid>

              {/* CORE SKILL TAGS WITH VERIFICATION BADGES */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.8)' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'block' }}>
                  Target Role Skill Breakdown:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {(currentTargetRole.coreSkills || []).map(skill => {
                    const isMatched = (targetRoleFit.matchedCoreSkills || []).includes(skill);
                    return (
                      <div
                        key={skill}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '10px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          background: isMatched ? 'rgba(236, 253, 245, 0.95)' : 'rgba(255, 251, 235, 0.95)',
                          border: isMatched ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid rgba(254, 243, 199, 0.9)',
                          color: isMatched ? '#059669' : '#b45309'
                        }}
                      >
                        {isMatched ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        <span>{skill}</span>
                        <span style={{ fontSize: '0.7rem', color: isMatched ? '#047857' : '#92400e', fontWeight: 600 }}>
                          ({isMatched ? 'Verified' : 'Skill Gap'})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Stack>
          </div>
          ) : (
            <div className="rc-candidate-card" style={{
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 249, 255, 0.6) 100%)',
              border: '1px solid rgba(186, 230, 253, 0.9)',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#0284c7',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
                  flexShrink: 0
                }}>
                  <Target size={28} />
                </div>
                <div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0284c7' }}>
                    NO TARGET ROLE CURRENTLY SELECTED
                  </span>
                  <h2 className="rc-h2" style={{ margin: '4px 0 0', fontSize: '1.45rem', color: '#0f172a' }}>
                    Choose Your Target Career Role Below
                  </h2>
                  <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0', maxWidth: '680px' }}>
                    Browse our comprehensive catalogue of 18 career tracks. Click <strong>"Set as Target Role"</strong> on any role card to calculate real-time skill gaps and unlock your custom roadmap in the Learning Hub.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 2: ALL SUPPORTED CAREER ROLES CATALOG
             ======================================================== */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.4rem' }}>
                  Explore & Set Target Roles ({filteredRoles.length})
                </h2>
                <p className="rc-small" style={{ color: '#64748b', marginTop: '4px' }}>
                  Select any career role to instantly recalibrate your RoleCompass readiness and update learning roadmap recommendations.
                </p>
              </div>

              {/* SEARCH BOX */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.72)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '8px 16px',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                minWidth: '280px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)'
              }}>
                <Search size={16} color="#059669" />
                <input
                  type="text"
                  placeholder="Search by role title or skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    width: '100%',
                    fontFamily: 'Plus Jakarta Sans, sans-serif'
                  }}
                />
              </div>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {categories.map(cat => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid rgba(167, 243, 208, 0.9)' : '1px solid rgba(226, 232, 240, 0.9)',
                      background: isSelected ? '#059669' : 'rgba(255, 255, 255, 0.7)',
                      color: isSelected ? '#ffffff' : '#475569',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none'
                    }}
                  >
                    {cat === 'ALL' ? 'All Career Fields' : cat}
                  </button>
                );
              })}
            </div>

            {/* ROLES GRID */}
            {filteredRoles.length > 0 ? (
          <Grid cols="responsive-3" gap="6" className="rc-stagger-grid">
            {filteredRoles.map(roleItem => {
                  const isCurrent = roleItem.id === currentTargetRole?.id || roleItem.title === currentTargetRole?.title;
                  const itemFit = calculateCandidateRoleFit(candidateUser, roleItem);

                  return (
                    <div
                      key={roleItem.id}
                      className="rc-candidate-card rc-candidate-card-hover"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        padding: '24px',
                        borderColor: isCurrent ? '#059669' : 'rgba(255, 255, 255, 0.75)',
                        background: isCurrent ? 'rgba(236, 253, 245, 0.55)' : 'rgba(255, 255, 255, 0.48)'
                      }}
                    >
                      <Stack gap="4">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <Badge variant={isCurrent ? "success" : "info"}>
                            {isCurrent ? "Active Target" : roleItem.category}
                          </Badge>
                          <span
                            className={`rc-fit-pill ${itemFit.readinessScore >= 80 ? 'rc-fit-pill-high' : 'rc-fit-pill-mid'}`}
                            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                          >
                            {itemFit.readinessScore}% Fit
                          </span>
                        </div>

                        <div>
                          <h3 className="rc-h3" style={{ fontSize: '1.18rem', margin: 0 }}>
                            <Link to={`/roles/${roleItem.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                              {roleItem.title}
                            </Link>
                          </h3>
                          <p className="rc-small" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginTop: '6px',
                            color: '#64748b',
                            lineHeight: '1.45'
                          }}>
                            {roleItem.description}
                          </p>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px', display: 'block' }}>
                            Core Skills Required:
                          </span>
                          <Cluster gap="2">
                            {(roleItem.coreSkills || []).slice(0, 4).map(sk => {
                              const hasSkill = (itemFit.matchedCoreSkills || []).includes(sk);
                              return (
                                <Tag key={sk} style={{
                                  background: hasSkill ? 'rgba(236, 253, 245, 0.9)' : undefined,
                                  borderColor: hasSkill ? 'rgba(167, 243, 208, 0.9)' : undefined,
                                  color: hasSkill ? '#059669' : undefined
                                }}>
                                  {sk}
                                </Tag>
                              );
                            })}
                          </Cluster>
                        </div>
                      </Stack>

                      {/* CARD ACTIONS */}
                      <div style={{ paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {isCurrent ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{
                              background: '#059669',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              padding: '10px',
                              borderRadius: '10px',
                              textAlign: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}>
                              <CheckCircle2 size={16} /> Selected Target Role
                            </div>
                            <Link to="/candidate/learning" style={{ textDecoration: 'none' }}>
                              <Button variant="secondary" size="sm" style={{ width: '100%', fontWeight: 700 }} leftIcon={<BookOpen size={13} />}>
                                Open in Learning Hub →
                              </Button>
                            </Link>
                          </div>
                        ) : targetedRoleTitles.some(t => t.toLowerCase() === roleItem.title.toLowerCase()) ? (
                          <button
                            type="button"
                            onClick={() => handleSetTarget(roleItem)}
                            style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '10px',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Target size={15} /> Switch to this Target Role
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetTarget(roleItem)}
                            style={{
                              background: '#059669',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '10px',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Target size={15} /> Set as Target Role
                          </button>
                        )}

                        <Link to={`/roles/${roleItem.id}`} style={{ textDecoration: 'none' }}>
                          <Button variant="ghost" size="sm" style={{ width: '100%' }} rightIcon={<ArrowRight size={14} />}>
                            View Role Guide & Skills
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </Grid>
            ) : (
              <div className="rc-candidate-empty-full">
                <Compass size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                <h3 className="rc-h3" style={{ margin: 0 }}>No Career Roles Matched</h3>
                <p className="rc-small" style={{ color: '#64748b', marginTop: '4px', maxWidth: '420px' }}>
                  No roles matched your search "{searchQuery}". Try searching for another role or reset your category filter.
                </p>
                <Button variant="secondary" size="sm" style={{ marginTop: '16px' }} onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}>
                  Reset Role Filters
                </Button>
              </div>
            )}
          </div>

          {/* ========================================================
              LEVEL 3: MATCHING OPEN POSITIONS FOR TARGET ROLE
             ======================================================== */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 className="rc-h2" style={{ margin: 0, fontSize: '1.35rem' }}>
                  Verified Openings for {currentTargetRole?.title || 'Your Target Role'} ({matchedJobs.length})
                </h2>
                <p className="rc-small" style={{ color: '#64748b', marginTop: '4px' }}>
                  Direct hiring positions from employers aligned with your selected career focus.
                </p>
              </div>

              <Link to="/explore" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669', textDecoration: 'none' }}>
                Explore All Opportunities →
              </Link>
            </div>

            {matchedJobs.length > 0 ? (
              <Grid cols="responsive-3" gap="6">
                {matchedJobs.slice(0, 6).map(j => (
                  <JobCard key={j.id} job={j} onApply={(jobToApply) => setSelectedJobToApply(jobToApply)} />
                ))}
              </Grid>
            ) : (
              <div className="rc-candidate-empty-full">
                <Target size={36} color="#64748b" style={{ marginBottom: '12px' }} />
                <h3 className="rc-h3" style={{ margin: 0 }}>No Active Positions Found</h3>
                <p className="rc-small" style={{ color: '#64748b', marginTop: '4px', maxWidth: '420px' }}>
                  There are currently no active job listings matching this role category. Check back soon or explore all jobs.
                </p>
                <Link to="/explore" style={{ marginTop: '16px' }}>
                  <Button variant="primary" size="sm">Explore All Jobs</Button>
                </Link>
              </div>
            )}
          </div>
        </Stack>
      </PageContainer>

      {/* Application Modal */}
      {selectedJobToApply && (
        <ApplicationModal
          job={selectedJobToApply}
          isOpen={!!selectedJobToApply}
          onClose={() => setSelectedJobToApply(null)}
        />
      )}
    </Section>
  );
}
