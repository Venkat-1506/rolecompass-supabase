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
import { Tabs } from '../../components/ui/Tabs.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { 
  Send, Clock, CheckCircle2, FileText, ArrowRight, Eye, Sparkles, 
  MapPin, Briefcase, Calendar, ExternalLink, ShieldCheck, ChevronRight 
} from 'lucide-react';

export function ApplicationsTrackerPage() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { 
    applications = [], 
    jobs = [], 
    companies = [], 
    candidateUser = {}, 
    currentUser = null 
  } = useApp() || {};

  const [activeTab, setActiveTab] = useState('ALL');

  const currentCandidateId = candidateUser?.id || currentUser?.id || 'user-cand-01';

  const myApplications = (applications || []).filter(a =>
    a && (
      a.candidateId === currentCandidateId ||
      a.candidateId === candidateUser?.id ||
      a.candidateId === currentUser?.id ||
      (!currentUser?.id && a.candidateId === 'user-cand-01') ||
      (candidateUser?.personal?.fullName === 'Arjun Verma' && a.candidateId === 'user-cand-01')
    )
  );

  const filteredApps = myApplications.filter(a => {
    if (activeTab === 'ALL') return true;
    return a.status && a.status.toUpperCase() === activeTab.toUpperCase();
  });

  const selectedApp = applicationId 
    ? myApplications.find(a => a.id === applicationId) 
    : (filteredApps[0] || null);

  const selectedJob = selectedApp 
    ? ((jobs || []).find(j => j && j.id === selectedApp.jobId) || {
        id: selectedApp.jobId || 'job-001',
        title: selectedApp.jobTitle || 'Associate Software Engineer',
        companyId: selectedApp.companyId || 'google',
        location: selectedApp.location || 'Bengaluru, KA',
        workMode: selectedApp.workMode || 'Hybrid'
      })
    : null;

  const selectedCompany = selectedJob 
    ? ((companies || []).find(c => c && c.id === selectedJob.companyId) || {
        name: selectedApp?.companyName || 'Google',
        logo: null
      })
    : null;

  // Pipeline Stepper Steps
  const pipelineSteps = [
    { key: 'Applied', label: 'Application Received' },
    { key: 'Under Review', label: 'Profile & Resume Screening' },
    { key: 'Shortlisted', label: 'Shortlisted by Recruiter' },
    { key: 'Interview', label: 'Interview & Assessment' },
    { key: 'Offer', label: 'Hiring Decision & Offer' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Under Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview': return 3;
      case 'Offer': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = selectedApp ? getStepIndex(selectedApp.status) : 0;

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          {/* Unified Candidate Header Banner */}
          <div className="rc-candidate-header-banner">
            <div>
              <span className="rc-candidate-eyebrow">
                CANDIDATE APPLICATION TRACKER
              </span>
              <h1 className="rc-candidate-h1">Real-Time Application Tracing</h1>
              <p className="rc-candidate-subtitle">
                Track status updates, interview schedules, and recruitment pipeline progress for your active submissions.
              </p>
            </div>
            <Link to="/explore">
              <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
                Explore More Openings
              </Button>
            </Link>
          </div>

          {/* Filter Tabs */}
          <Tabs
            activeTabId={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              { id: 'ALL', label: 'All Applications', badge: myApplications.length },
              { id: 'APPLIED', label: 'Applied', badge: myApplications.filter(a => a.status === 'Applied').length },
              { id: 'UNDER REVIEW', label: 'Under Review', badge: myApplications.filter(a => a.status === 'Under Review').length },
              { id: 'SHORTLISTED', label: 'Shortlisted', badge: myApplications.filter(a => a.status === 'Shortlisted').length },
              { id: 'INTERVIEW', label: 'Interview', badge: myApplications.filter(a => a.status === 'Interview').length },
              { id: 'OFFER', label: 'Offer', badge: myApplications.filter(a => a.status === 'Offer').length }
            ]}
          />

          {filteredApps.length === 0 ? (
            <div className="rc-candidate-empty-full">
              <Send size={38} color="#64748b" style={{ marginBottom: '14px' }} />
              <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.25rem' }}>No Applications in this Category</h3>
              <p className="rc-small" style={{ color: '#64748b', marginTop: '6px', maxWidth: '440px', lineHeight: '1.5' }}>
                {activeTab === 'ALL'
                  ? "You haven't submitted any job applications yet. Discover roles matched to your skillset and apply with one click."
                  : `You currently have no job applications matching the "${activeTab}" status filter.`}
              </p>
              <Link to="/explore" style={{ marginTop: '18px' }}>
                <Button variant="primary" size="md" rightIcon={<ArrowRight size={14} />}>
                  Discover Opportunities
                </Button>
              </Link>
            </div>
          ) : (
            <Grid cols="responsive-3" gap="6" className={applicationId ? 'rc-apps-grid rc-apps-detail-open' : 'rc-apps-grid'}>
              {/* Left Column: Application List */}
              <div className="rc-col-span-1-desktop rc-apps-list-col">
                <Stack gap="3">
                  {filteredApps.map((app) => {
                    const job = (jobs || []).find(j => j && j.id === app.jobId) || { id: app.jobId, title: 'Software Engineer', companyId: 'google' };
                    const company = (companies || []).find(c => c && c.id === job.companyId) || { name: 'Company', logo: null };
                    const isSelected = selectedApp?.id === app.id;

                    let statusVariant = 'info';
                    if (app.status === 'Shortlisted' || app.status === 'Offer') statusVariant = 'success';
                    if (app.status === 'Under Review') statusVariant = 'warning';

                    return (
                      <div
                        key={app.id}
                        onClick={() => navigate(`/candidate/applications/${app.id}`)}
                        className={`rc-candidate-card rc-candidate-card-hover ${isSelected ? 'rc-selected-app-card' : ''}`}
                        style={{
                          background: isSelected ? 'rgba(236, 253, 245, 0.75)' : 'rgba(255, 255, 255, 0.48)',
                          backdropFilter: 'blur(22px)',
                          WebkitBackdropFilter: 'blur(22px)',
                          border: isSelected ? '2px solid #059669' : '1px solid rgba(255, 255, 255, 0.75)',
                          boxShadow: isSelected ? '0 10px 24px rgba(5, 150, 105, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)' : '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                          padding: 'clamp(14px, 2.5vw, 18px)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 200px' }}>
                            <CompanyLogoWithFallback companyId={job.companyId} name={company.name} logo={company.logo} size="md" variant="square" />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0, wordBreak: 'break-word', lineHeight: '1.3' }}>
                                {job.title}
                              </h3>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginTop: '2px' }}>{company.name}</span>
                            </div>
                          </div>
                          <Badge variant={statusVariant}>{app.status}</Badge>
                        </div>

                        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', flexWrap: 'wrap', gap: '6px' }}>
                          <span>Applied: {app.appliedDate}</span>
                          <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            View Timeline <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </Stack>
              </div>

            {/* Right 2 Columns: Detailed Recruitment Pipeline & Tracing */}
            {selectedApp && selectedJob && (
              <div className="rc-col-span-2-desktop" style={{ minWidth: 0, maxWidth: '100%' }}>
                <Stack gap="6">
                  {/* Mobile-only back link (list column is hidden while a specific application is open) */}
                  {applicationId && (
                    <Link
                      to="/candidate/applications"
                      className="rc-show-mobile"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'none',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: '#059669',
                        padding: '6px 0'
                      }}
                    >
                      <ChevronRight size={15} style={{ transform: 'rotate(180deg)' }} /> Back to all applications
                    </Link>
                  )}

                  {/* Pipeline Stepper Summary Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    borderRadius: '20px',
                    padding: 'clamp(16px, 3vw, 24px)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                  }}>
                    <Stack gap="5">
                      {/* Header info */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: '1 1 240px' }}>
                          <CompanyLogoWithFallback companyId={selectedJob.companyId} name={selectedCompany?.name} logo={selectedCompany?.logo} size="lg" />
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              APPLICATION REF: {selectedApp.id.toUpperCase()}
                            </span>
                            <h2 className="rc-h2" style={{ fontSize: 'clamp(1.2rem, 3.2vw, 1.45rem)', marginTop: '2px', wordBreak: 'break-word', lineHeight: '1.25' }}>{selectedJob.title}</h2>
                            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '2px 0 0', wordBreak: 'break-word' }}>
                              {selectedCompany?.name} • {selectedJob.location} ({selectedJob.workMode})
                            </p>
                          </div>
                        </div>

                        <Badge variant="success" style={{ padding: '6px 14px', fontSize: '0.82rem', alignSelf: 'flex-start' }}>
                          {selectedApp.status}
                        </Badge>
                      </div>

                      {/* Recruitment Pipeline Timeline Stepper */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.8)', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.85)' }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
                          Recruitment Pipeline Tracing
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {pipelineSteps.map((s, idx) => {
                            const isDone = currentStepIdx > idx;
                            const isCurrent = currentStepIdx === idx;
                            return (
                              <div key={s.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: isDone ? '#059669' : isCurrent ? '#059669' : '#e2e8f0',
                                  color: (isDone || isCurrent) ? '#ffffff' : '#64748b',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  boxShadow: isCurrent ? '0 0 0 4px rgba(5, 150, 105, 0.2)' : 'none'
                                }}>
                                  {isDone ? <CheckCircle2 size={18} /> : (idx + 1)}
                                </div>
                                <div style={{ flex: 1, paddingTop: '4px' }}>
                                  <div style={{ fontSize: '0.92rem', fontWeight: isCurrent ? 800 : 600, color: isCurrent ? '#059669' : isDone ? '#0f172a' : '#64748b' }}>
                                    {s.label}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                    {isCurrent ? `Currently in progress (${selectedApp.lastUpdated})` : isDone ? `Completed on ${selectedApp.appliedDate}` : 'Pending recruiter evaluation'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Recruiter Note if any */}
                      {selectedApp.notes && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '14px 18px', borderRadius: '12px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>RECRUITER FEEDBACK NOTE</span>
                          <p style={{ fontSize: '0.9rem', color: '#065f46', marginTop: '4px', fontStyle: 'italic' }}>
                            "{selectedApp.notes}"
                          </p>
                        </div>
                      )}

                      {/* Submitted Screening Details Summary */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(255, 255, 255, 0.85)', borderRadius: '14px', padding: '18px' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Submitted Application Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '0.85rem' }}>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Notice Period</span>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedApp.screeningAnswers?.noticePeriod || 'Immediate / 15 Days'}</span>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Work Preference</span>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedApp.screeningAnswers?.workPreference || 'Hybrid / Flexible'}</span>
                          </div>
                          <div>
                            <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Attached Resume</span>
                            <span style={{ fontWeight: 700, color: '#059669' }}>{selectedApp.screeningAnswers?.resumeName || 'Arjun_Verma_Resume_2026.pdf'}</span>
                          </div>
                          {selectedApp.screeningAnswers?.portfolioUrl && (
                            <div>
                              <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Portfolio Link</span>
                              <a href={selectedApp.screeningAnswers.portfolioUrl} target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#0284c7', textDecoration: 'none', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                                {selectedApp.screeningAnswers.portfolioUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Links */}
                      <div style={{ display: 'flex', alignItems: 'stretch', gap: '12px', flexWrap: 'wrap' }}>
                        <Link to={`/jobs/${selectedJob.id}`} style={{ textDecoration: 'none', flex: '1 1 170px', minWidth: 0 }}>
                          <Button variant="secondary" style={{ width: '100%' }}>View Full Job Post</Button>
                        </Link>
                        <Link to="/explore" style={{ textDecoration: 'none', flex: '1 1 170px', minWidth: 0 }}>
                          <Button variant="primary" style={{ width: '100%' }}>Explore Similar Openings</Button>
                        </Link>
                      </div>
                    </Stack>
                  </div>
                </Stack>
              </div>
            )}
          </Grid>
          )}
        </Stack>
      </PageContainer>
    </Section>
  );
}

