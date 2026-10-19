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
import { JobCard } from '../../components/cards/JobCard.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { ErrorState } from '../../components/ui/ErrorState.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { calculateCandidateRoleFit } from '../../data/matching.js';
import { getResourcesForRole } from '../../data/learning.js';
import { Compass, CheckCircle2, ArrowRight, Target, BookOpen, ShieldCheck, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export function RoleDetailsPage() {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { roles, jobs, setTargetRole, candidateUser, showToast, targetRoleTitle, startLearningResource } = useApp();

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  const role = roles.find(r => r.id === roleId);
  if (!role) {
    return (
      <Section py="10">
        <PageContainer size="md">
          <ErrorState
            title="Role Not Found"
            description={`No career role found matching ID "${roleId}".`}
            onRetry={() => navigate('/roles')}
          />
        </PageContainer>
      </Section>
    );
  }

  const relatedJobs = jobs.filter(j => (role.relatedJobIds || []).includes(j.id) || j.category === role.category);
  const isTargeted = (targetRoleTitle || candidateUser.roleProfile?.primaryTarget) === role.title;
  const fitAnalysis = calculateCandidateRoleFit(candidateUser, role);
  const roleResources = getResourcesForRole(role.title).slice(0, 4);

  const handleSetTargetRole = () => {
    setTargetRole(role);
    showToast('success', `"${role.title}" is now set as your active career target.`);
    navigate('/candidate/roles');
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          <Cluster align="center" gap="2" className="rc-small">
            <Link to="/roles" className="rc-link">Roles Directory</Link>
            <span>/</span>
            <span>{role.title}</span>
          </Cluster>

          {/* Header */}
          <Card variant="solid" padding="8">
            <Cluster justify="between" align="start">
              <div>
                <Badge variant="info">{role.category}</Badge>
                <h1 className="rc-h1" style={{ marginTop: '4px' }}>{role.title}</h1>
                <p className="rc-body" style={{ color: 'var(--rc-color-muted-gray-600)', marginTop: '8px', maxWidth: '700px' }}>
                  {role.overview}
                </p>
              </div>

              <div className="rc-flex rc-gap-3">
                {isTargeted ? (
                  <Badge variant="success" icon={<ShieldCheck size={14} />}>Current Target Role</Badge>
                ) : (
                  <Button variant="primary" onClick={handleSetTargetRole} leftIcon={<Target size={16} />}>
                    Set as Target Career Role
                  </Button>
                )}
              </div>
            </Cluster>
          </Card>

          {/* Role Details & Preparation */}
          <Grid cols="responsive-3" gap="6">
            <div className="rc-col-span-2-desktop">
              <Stack gap="6">
                <Card variant="solid" padding="8">
                  <Stack gap="6">
                    <div>
                      <h2 className="rc-h2" style={{ marginBottom: '12px' }}>Role Responsibilities</h2>
                      <Stack gap="2">
                        {(role.responsibilities || []).map((resp, idx) => (
                          <div key={idx} className="rc-flex rc-items-start rc-gap-3">
                            <CheckCircle2 size={18} color="var(--rc-color-green-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <p className="rc-body" style={{ fontSize: '0.9375rem' }}>{resp}</p>
                          </div>
                        ))}
                      </Stack>
                    </div>

                    <div>
                      <h3 className="rc-h3" style={{ marginBottom: '12px' }}>Core & Related Skills</h3>
                      <Stack gap="3">
                        <div>
                          <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block' }}>Core Skills:</span>
                          <Cluster gap="2">
                            {(role.coreSkills || []).map(sk => <Tag key={sk}>{sk}</Tag>)}
                          </Cluster>
                        </div>
                        <div>
                          <span className="rc-label" style={{ fontSize: '0.8125rem', marginBottom: '6px', display: 'block' }}>Supporting Skills:</span>
                          <Cluster gap="2">
                            {(role.relatedSkills || []).map(sk => <Badge key={sk} variant="default">{sk}</Badge>)}
                          </Cluster>
                        </div>
                      </Stack>
                    </div>

                    <div>
                      <h3 className="rc-h3" style={{ marginBottom: '12px' }}>Preparation Direction</h3>
                      <Stack gap="2">
                        {(role.preparationPath || []).map((stepText, idx) => (
                          <div key={idx} className="rc-flex rc-items-start rc-gap-3" style={{ background: 'var(--rc-color-soft-slate-50)', padding: '10px 14px', borderRadius: '8px' }}>
                            <span className="rc-label" style={{ color: 'var(--rc-color-green-accent)', fontWeight: 700 }}>0{idx + 1}.</span>
                            <p className="rc-small" style={{ color: 'var(--rc-color-deep-charcoal-900)' }}>{stepText}</p>
                          </div>
                        ))}
                      </Stack>
                    </div>
                  </Stack>
                </Card>

                {/* Related Jobs Section */}
                <div>
                  <h2 className="rc-h2" style={{ marginBottom: '16px' }}>Related Openings for {role.title}</h2>
                  <Grid cols="responsive-2" gap="6">
                    {relatedJobs.map(j => (
                      <JobCard key={j.id} job={j} onApply={(jobToApply) => setSelectedJobToApply(jobToApply)} />
                    ))}
                  </Grid>
                </div>
              </Stack>
            </div>

            {/* Right Column: Skill Gaps & Action */}
            <Stack gap="6">
              {/* Role Fit Summary Card */}
              <Card variant="solid" padding="6">
                <Stack gap="4">
                  <div className="rc-flex rc-items-center rc-justify-between">
                    <div className="rc-flex rc-items-center rc-gap-2">
                      <Target size={20} color="var(--rc-color-green-accent)" />
                      <h3 className="rc-h3" style={{ margin: 0 }}>Role Fit Analysis</h3>
                    </div>
                    <Badge variant={fitAnalysis.readinessScore >= 70 ? 'success' : fitAnalysis.readinessScore >= 50 ? 'info' : 'warning'}>
                      {fitAnalysis.readinessScore}% Fit
                    </Badge>
                  </div>

                  <p className="rc-small" style={{ color: 'var(--rc-color-muted-gray-600)' }}>
                    Calculated against your verified skills in RoleCompass.
                  </p>

                  <div style={{ background: 'var(--rc-color-soft-slate-50)', borderRadius: '10px', padding: '12px' }}>
                    <div className="rc-flex rc-justify-between rc-items-center" style={{ marginBottom: '6px' }}>
                      <span className="rc-small" style={{ fontWeight: 700 }}>Skills Coverage</span>
                      <span className="rc-small" style={{ fontWeight: 800, color: 'var(--rc-color-green-accent)' }}>
                        {fitAnalysis.matchedCoreSkills.length} of {role.coreSkills.length} core skills
                      </span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${fitAnalysis.skillsCoveragePercent}%`,
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>
                  </div>

                  {fitAnalysis.missingCoreSkills.length > 0 && (
                    <div>
                      <span className="rc-label" style={{ fontSize: '0.78rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <AlertCircle size={13} /> Identified Skill Gaps:
                      </span>
                      <Cluster gap="1">
                        {fitAnalysis.missingCoreSkills.map(sk => (
                          <span
                            key={sk}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              color: '#92400e',
                              background: '#fef3c7',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #fde68a'
                            }}
                          >
                            {sk}
                          </span>
                        ))}
                      </Cluster>
                    </div>
                  )}

                  {!isTargeted && (
                    <Button variant="primary" style={{ width: '100%' }} onClick={handleSetTargetRole} leftIcon={<Target size={16} />}>
                      Target This Role
                    </Button>
                  )}
                </Stack>
              </Card>

              {/* Verified Learning Resources */}
              <Card variant="solid" padding="6">
                <Stack gap="4">
                  <div className="rc-flex rc-items-center rc-justify-between">
                    <div className="rc-flex rc-items-center rc-gap-2">
                      <BookOpen size={20} color="var(--rc-color-green-accent)" />
                      <h3 className="rc-h3" style={{ margin: 0 }}>Verified Resources</h3>
                    </div>
                    <Badge variant="info">Genuine Links</Badge>
                  </div>
                  
                  <p className="rc-small" style={{ color: 'var(--rc-color-muted-gray-600)' }}>
                    Official documentation and courses to prepare for {role.title}:
                  </p>

                  {roleResources.length > 0 ? (
                  <Stack gap="3">
                    {roleResources.map(res => (
                      <div
                        key={res.id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '12px',
                          background: '#ffffff'
                        }}
                      >
                        <div className="rc-flex rc-justify-between rc-items-start" style={{ gap: '8px' }}>
                          <div>
                            <div className="rc-flex rc-items-center rc-gap-1" style={{ marginBottom: '4px' }}>
                              <Badge variant="info" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{res.provider}</Badge>
                              <span className="rc-small" style={{ fontSize: '0.72rem', color: '#64748b' }}>• {res.duration}</span>
                            </div>
                            <h4 className="rc-label" style={{ fontSize: '0.88rem', margin: 0 }}>
                              <button
                                type="button"
                                onClick={() => startLearningResource(res.id, role)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  font: 'inherit',
                                  color: '#0f172a',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  fontWeight: 700
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = '#059669'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = '#0f172a'; }}
                              >
                                {res.title}
                              </button>
                            </h4>
                          </div>
                          <button
                            type="button"
                            onClick={() => startLearningResource(res.id, role)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#059669',
                              flexShrink: 0,
                              padding: '4px',
                              cursor: 'pointer'
                            }}
                            title="Open in learning viewer modal"
                          >
                            <ExternalLink size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </Stack>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 14px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px' }}>
                      <BookOpen size={28} color="#94a3b8" style={{ marginBottom: '6px' }} />
                      <h4 className="rc-h4" style={{ margin: 0, color: '#334155' }}>No mapped sources for this role yet</h4>
                      <p className="rc-small" style={{ color: '#64748b', margin: '4px 0 0 0' }}>
                        Learning sources for {role.title} are still being curated. Open the full directory to explore every verified resource.
                      </p>
                    </div>
                  )}

                  <Link to="/candidate/learning" style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" style={{ width: '100%' }} rightIcon={<ArrowRight size={14} />}>
                      Open Full Learning Hub
                    </Button>
                  </Link>
                </Stack>
              </Card>
            </Stack>
          </Grid>
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
