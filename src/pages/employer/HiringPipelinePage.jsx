import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { 
  GitMerge, Users, CheckCircle2, ArrowRight, ArrowLeft, 
  Sparkles, Calendar, ChevronRight, FileText, UserCheck, 
  Clock, AlertCircle, Award, Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/glass.css';
import '../../styles/motion.css';

export function HiringPipelinePage() {
  const navigate = useNavigate();
  const { applications, jobs, candidateUser, updateApplicationStatus } = useApp();

  const pipelineStages = [
    { id: 'Applied', name: 'Applied', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: <FileText size={16} color="#0284c7" /> },
    { id: 'Under Review', name: 'Under Review', color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: <Clock size={16} color="#d97706" /> },
    { id: 'Shortlisted', name: 'Shortlisted', color: '#7b2cbf', bg: '#faf5ff', border: '#e9d5ff', icon: <Sparkles size={16} color="#7b2cbf" /> },
    { id: 'Interview', name: 'Interview', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', icon: <Users size={16} color="#4f46e5" /> },
    { id: 'Offer', name: 'Offer', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', icon: <Award size={16} color="#059669" /> },
    { id: 'Rejected', name: 'Rejected', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: <AlertCircle size={16} color="#dc2626" /> }
  ];

  const handleAdvanceStage = (appId, currentStatus) => {
    const currentIndex = pipelineStages.findIndex(s => s.id === currentStatus);
    if (currentIndex < pipelineStages.length - 2) { // Skip advance if offer/rejected
      const nextStage = pipelineStages[currentIndex + 1].id;
      updateApplicationStatus(appId, nextStage);
    }
  };

  const handleRegressStage = (appId, currentStatus) => {
    const currentIndex = pipelineStages.findIndex(s => s.id === currentStatus);
    if (currentIndex > 0) {
      const prevStage = pipelineStages[currentIndex - 1].id;
      updateApplicationStatus(appId, prevStage);
    }
  };

  return (
    <Section py="8">
      <PageContainer size="full">
        <Stack gap="6">
          
          {/* HEADER & METRIC COUNTERS */}
          <ScrollReveal variant="slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#059669',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  EMPLOYER WORKSPACE • HIRING PIPELINE
                </span>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Interactive Recruitment Pipeline
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
                  Manage candidate stages. Moving a candidate instantly syncs their real-time application tracker.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link to="/employer/candidates" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
                  }}>
                    <Users size={16} /> Candidate Pool List
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* PIPELINE METRIC SUMMARY CARDS */}
          <ScrollReveal variant="scale-up" delay={100}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {pipelineStages.slice(0, 5).map((stg) => {
                const count = applications.filter(a => a.status === stg.id).length;
                return (
                  <div key={stg.id} style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: stg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {stg.name}
                      </span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', marginTop: '2px' }}>
                        {count}
                      </div>
                    </div>
                    <div style={{ background: stg.bg, padding: '10px', borderRadius: '12px', border: `1px solid ${stg.border}` }}>
                      {stg.icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* KANBAN BOARD COLUMNS (SCROLLABLE HORIZONTAL PIPELINE) */}
          <ScrollReveal variant="fade-in" delay={150}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(280px, 1fr))',
              gap: '20px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '16px'
            }}>
              {pipelineStages.map((stage) => {
                const stageApps = applications.filter(a => a.status === stage.id);

                return (
                  <div
                    key={stage.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.65)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      borderRadius: '22px',
                      border: `1px solid ${stage.border}`,
                      padding: '18px',
                      minHeight: '520px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
                    }}
                  >
                    {/* COLUMN HEADER */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '12px',
                      borderBottom: `2px solid ${stage.border}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: stage.bg, padding: '6px', borderRadius: '8px', border: `1px solid ${stage.border}` }}>
                          {stage.icon}
                        </div>
                        <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {stage.name}
                        </h3>
                      </div>

                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: stage.color, background: stage.bg, padding: '3px 10px', borderRadius: '8px', border: `1px solid ${stage.border}` }}>
                        {stageApps.length}
                      </span>
                    </div>

                    {/* CANDIDATE KANBAN CARDS CONTAINER */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                      {stageApps.length === 0 ? (
                        <div style={{ padding: '32px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.84rem', border: '2px dashed rgba(203, 213, 225, 0.6)', borderRadius: '14px' }}>
                          No candidates in {stage.name}
                        </div>
                      ) : (
                        stageApps.map((app) => {
                          const job = jobs.find(j => j.id === app.jobId) || { title: 'Software Developer' };
                          const fitScore = app.roleCompassFitScore || 85;

                          return (
                            <div
                              key={app.id}
                              className="rc-glass-hoverable"
                              style={{
                                background: 'rgba(255, 255, 255, 0.55)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                borderRadius: '16px',
                                padding: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.8)',
                                boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                              }}
                            >
                              {/* CANDIDATE AVATAR & NAME */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Avatar name={candidateUser.personal?.fullName || 'Arjun Verma'} size="sm" />
                                <div style={{ overflow: 'hidden' }}>
                                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {candidateUser.personal?.fullName || 'Arjun Verma'}
                                  </h4>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {job.title}
                                  </span>
                                </div>
                              </div>

                              {/* FIT SCORE & DATE */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={12} color="#64748b" /> {app.appliedDate}
                                </span>
                                <span style={{ fontWeight: '800', color: '#059669' }}>
                                  <Sparkles size={11} style={{ display: 'inline', marginRight: '2px' }} /> {fitScore}% Match
                                </span>
                              </div>

                              {/* QUICK STAGE TRANSITION CONTROL & DROPDOWN */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                                <select
                                  value={app.status}
                                  onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                                  style={{
                                    flex: 1,
                                    padding: '6px 8px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                    background: '#ffffff',
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: '#0f172a',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {pipelineStages.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleRegressStage(app.id, app.status)}
                                  title="Move to Previous Stage"
                                  style={{
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#334155'
                                  }}
                                >
                                  <ArrowLeft size={13} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAdvanceStage(app.id, app.status)}
                                  title="Advance to Next Stage"
                                  style={{
                                    background: '#ecfdf5',
                                    border: '1px solid #a7f3d0',
                                    borderRadius: '8px',
                                    width: '28px',
                                    height: '28px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#059669'
                                  }}
                                >
                                  <ArrowRight size={13} />
                                </button>
                              </div>

                              {/* INSPECT PROFILE ACTION LINK */}
                              <button
                                onClick={() => navigate(`/employer/candidates/${app.candidateId}`)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#0284c7',
                                  fontWeight: '700',
                                  fontSize: '0.76rem',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                Inspect Full Candidate Profile <ChevronRight size={13} />
                              </button>

                            </div>
                          );
                        })
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </ScrollReveal>

        </Stack>
      </PageContainer>
    </Section>
  );
}
