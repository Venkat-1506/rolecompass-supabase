import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { RoleCompassFit } from '../../components/cards/RoleCompassFit.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { 
  Users, FileText, CheckCircle2, ArrowRight, Search, Filter, 
  MapPin, Phone, Mail, Calendar, Sparkles, ExternalLink, Download, 
  Briefcase, Check, AlertCircle, ChevronDown, UserCheck
} from 'lucide-react';
import '../../styles/glass.css';
import '../../styles/motion.css';

export function EmployerCandidatesPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { applications, jobs, candidateUser, updateApplicationStatus, getJobFit } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterJobId, setFilterJobId] = useState('');

  // Filter applications by position & candidate name search query
  const companyApps = applications.filter(a => {
    const matchesJob = !filterJobId || a.jobId === filterJobId;
    const name = candidateUser.personal?.fullName || 'Arjun Verma';
    const matchesSearch = !searchQuery.trim() || 
      name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesSearch;
  });

  const selectedApp = candidateId 
    ? companyApps.find(a => a.candidateId === candidateId) || companyApps[0] 
    : companyApps[0];

  const selectedJob = selectedApp ? jobs.find(j => j.id === selectedApp.jobId) : null;
  const fit = selectedJob ? getJobFit(selectedJob.id) : null;

  const statusVariantMap = {
    'Applied': 'info',
    'Under Review': 'warning',
    'Shortlisted': 'info',
    'Interview': 'info',
    'Offer': 'success',
    'Rejected': 'danger'
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="6">
          
          {/* PAGE HEADER */}
          <ScrollReveal variant="slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#0284c7',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  display: 'inline-block',
                  marginBottom: '10px'
                }}>
                  EMPLOYER WORKSPACE • CANDIDATES
                </span>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Candidate Pool & Fit Intelligence
                </h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '4px' }}>
                  Review candidate applications, compare profile skill fit against job criteria, and manage hiring stages.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Link to="/employer/pipeline" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    color: '#0f172a',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(203, 213, 225, 0.9)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                  }}>
                    <UserCheck size={16} color="#0284c7" /> Open Hiring Pipeline
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* SEARCH & FILTER CONTROLS BAR */}
          <ScrollReveal variant="scale-up" delay={100}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '18px',
              padding: '14px 20px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              justifyContent: 'space-between'
            }}>
              {/* Search Field */}
              <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '8px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Search size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder="Search candidate name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '0.9rem',
                    color: '#0f172a',
                    fontWeight: '600'
                  }}
                />
              </div>

              {/* Job Filter Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px' }}>
                <Filter size={16} color="#0284c7" />
                <select
                  value={filterJobId}
                  onChange={(e) => setFilterJobId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="">All Open Job Positions</option>
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '6px 14px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                {companyApps.length} Candidates
              </div>
            </div>
          </ScrollReveal>

          {/* MAIN 2-COLUMN LAYOUT: APPLICANTS LIST (LEFT) & CANDIDATE INSPECTION PANEL (RIGHT) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            alignItems: 'start'
          }}>
            
            {/* LEFT COLUMN: CANDIDATE LIST */}
            <ScrollReveal variant="slide-left" delay={150}>
              <Stack gap="3">
                <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Applicant List ({companyApps.length})
                </span>

                {companyApps.length === 0 ? (
                  <div style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '18px', padding: '32px 20px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                    <Users size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>No candidates found</div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Try clearing your search or job position filter.</div>
                  </div>
                ) : (
                  companyApps.map((app) => {
                    const job = jobs.find(j => j.id === app.jobId) || { title: 'Software Engineer' };
                    const isSelected = selectedApp?.id === app.id;
                    const fitScore = app.roleCompassFitScore || 85;

                    return (
                      <div
                        key={app.id}
                        onClick={() => navigate(`/employer/candidates/${app.candidateId}`)}
                        className="rc-glass-hoverable"
                        style={{
                          background: isSelected ? 'rgba(236, 253, 245, 0.75)' : 'rgba(255, 255, 255, 0.48)',
                          backdropFilter: 'blur(22px)',
                          WebkitBackdropFilter: 'blur(22px)',
                          borderRadius: '18px',
                          padding: '18px',
                          border: isSelected ? '2px solid #059669' : '1px solid rgba(255, 255, 255, 0.75)',
                          boxShadow: isSelected ? '0 10px 24px rgba(5, 150, 105, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)' : '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Avatar name={candidateUser.personal?.fullName || 'Arjun Verma'} size="sm" />
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                {candidateUser.personal?.fullName || 'Arjun Verma'}
                              </h4>
                              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                                {job.title}
                              </span>
                            </div>
                          </div>

                          <Badge variant={statusVariantMap[app.status] || 'info'}>
                            {app.status}
                          </Badge>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={13} color="#64748b" /> {app.appliedDate}
                          </span>
                          <span style={{ fontWeight: '800', color: '#059669', background: '#ffffff', padding: '3px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                            <Sparkles size={11} style={{ display: 'inline', marginRight: '3px' }} /> {fitScore}% Match
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </Stack>
            </ScrollReveal>

            {/* RIGHT COLUMN: SELECTED CANDIDATE INSPECTION & FIT ANALYZER */}
            {selectedApp && selectedJob ? (
              <ScrollReveal variant="slide-right" delay={200} style={{ gridColumn: 'span 2' }}>
                <Stack gap="6">
                  
                  {/* CANDIDATE PROFILE HEADER CARD */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
                  }}>
                    <Stack gap="5">
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <Avatar name={candidateUser.personal?.fullName || 'Arjun Verma'} size="lg" />
                          <div>
                            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                              {candidateUser.personal?.fullName || 'Arjun Verma'}
                            </h2>
                            <p style={{ fontSize: '0.92rem', color: '#059669', fontWeight: '700', margin: '2px 0 0' }}>
                              {candidateUser.personal?.title || 'Senior Software Engineer Candidate'}
                            </p>
                            <div style={{ display: 'flex', gap: '14px', fontSize: '0.82rem', color: '#64748b', marginTop: '6px', flexWrap: 'wrap' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={14} color="#059669" /> {candidateUser.personal?.email || 'arjun.verma@example.com'}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={14} color="#059669" /> {candidateUser.personal?.phone || '+91 98765 43210'}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={14} color="#059669" /> {candidateUser.personal?.location || 'Bengaluru, India'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* STATUS SELECTOR DROPDOWN */}
                        <div style={{ minWidth: '180px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                            Update Application Stage
                          </label>
                          <select
                            value={selectedApp.status}
                            onChange={(e) => updateApplicationStatus(selectedApp.id, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px',
                              borderRadius: '12px',
                              border: '2px solid #059669',
                              background: '#ecfdf5',
                              fontSize: '0.9rem',
                              fontWeight: '800',
                              color: '#059669',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Applied">Applied</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* APPLICATION SNAPSHOT STRIP */}
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Applied Role</span>
                          <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>{selectedJob.title}</div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Attached Resume</span>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={15} /> {selectedApp.resumeUsed || candidateUser.resume?.fileName || "Arjun_Verma_Resume_2026.pdf"}
                          </div>
                        </div>

                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Applied Date</span>
                          <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#0f172a' }}>{selectedApp.appliedDate}</div>
                        </div>
                      </div>

                      {/* CANDIDATE SKILLS */}
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                          Candidate Profile Skills
                        </span>
                        <Cluster gap="2">
                          {(candidateUser.skills || ['React', 'JavaScript', 'Node.js', 'TypeScript', 'TailwindCSS']).map(sk => (
                            <span key={sk} style={{ fontSize: '0.82rem', fontWeight: '700', color: '#0369a1', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '5px 12px', borderRadius: '8px' }}>
                              {sk}
                            </span>
                          ))}
                        </Cluster>
                      </div>

                      {/* SCREENING RESPONSES */}
                      {selectedApp.screeningAnswers && (
                        <div style={{ background: 'rgba(255, 255, 255, 0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.85)' }}>
                          <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a', margin: '0 0 12px 0' }}>
                            Job Screening Responses
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', fontSize: '0.88rem' }}>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Notice Period:</span>
                              <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApp.screeningAnswers.noticePeriod || 'Immediate / 15 Days'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '600' }}>Work Preference:</span>
                              <div style={{ fontWeight: '800', color: '#0f172a' }}>{selectedApp.screeningAnswers.workPreference || 'Hybrid / Flexible'}</div>
                            </div>
                            {selectedApp.screeningAnswers.portfolioUrl && (
                              <div>
                                <span style={{ color: '#64748b', fontWeight: '600' }}>Portfolio / GitHub:</span>
                                <div>
                                  <a href={selectedApp.screeningAnswers.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    View Portfolio <ExternalLink size={13} />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </Stack>
                  </div>

                  {/* CANDIDATE ROLECOMPASS FIT ANALYSIS CARD */}
                  <RoleCompassFit fit={fit} title={`RoleCompass Fit Index vs ${selectedJob.title}`} />

                </Stack>
              </ScrollReveal>
            ) : null}

          </div>
        </Stack>
      </PageContainer>
    </Section>
  );
}
