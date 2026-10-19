import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  Plus,
  Briefcase,
  Users,
  GitMerge,
  Building2,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles
} from 'lucide-react';
import '../../styles/glass.css';

export function EmployerOverviewPage() {
  const { employerUser, currentUser, jobs, applications, candidateUser, companies } = useApp();
  const navigate = useNavigate();

  const companyId = employerUser?.companyId || 'zoho';
  const companyJobs = jobs.filter(j => j.companyId === companyId);
  const companyApplications = applications || [];
  const companyObj = companies.find(c => c.id === companyId) || { name: 'Zoho' };
  const companyName = currentUser?.profile?.company?.name || employerUser?.company?.name || companyObj.name;

  const shortlistedCount = companyApplications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = companyApplications.filter(a => a.status === 'Interview').length;
  const underReviewCount = companyApplications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;

  return (
    <Section py="6" className="rc-employer-dashboard">
      <PageContainer size="lg">

        {/* ========================================================
            1. RECRUITMENT WORKSPACE HERO BANNER
           ======================================================== */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.52)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '22px',
          padding: '28px 32px',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <CompanyLogoWithFallback
              companyId={companyId}
              name={companyName}
              logo={companyObj.logo}
              size="lg"
              variant="square"
            />
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                fontWeight: '800',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#059669',
                background: 'rgba(236, 253, 245, 0.95)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(167, 243, 208, 0.9)',
                marginBottom: '6px'
              }}>
                <Building2 size={13} color="#059669" /> VERIFIED EMPLOYER PORTAL
              </div>

              <h1 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.03em',
                margin: 0,
                lineHeight: '1.2'
              }}>
                {companyName} Hiring Portal
              </h1>

              <p style={{ color: '#475569', fontSize: '0.94rem', margin: '4px 0 0', fontWeight: '500' }}>
                Manage candidate talent pipelines, open positions, and interview workflows.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/employer/company" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(16px)',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '0.85rem',
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid rgba(203, 213, 225, 0.9)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 180ms ease'
              }}>
                <Settings size={15} color="#059669" /> Company Setup
              </button>
            </Link>

            <Link to="/employer/jobs/create" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.85rem',
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                transition: 'all 180ms ease'
              }}>
                <Plus size={16} /> Post New Job
              </button>
            </Link>
          </div>
        </div>

        {/* ========================================================
            2. 4 METRIC KPI GLASS CARDS (CLICKABLE)
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '26px'
        }}>
          {/* KPI 1: Active Postings */}
          <div
            onClick={() => navigate('/employer/jobs')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Job Postings
              </span>
              <div style={{ background: 'rgba(236, 253, 245, 0.9)', padding: '6px', borderRadius: '8px', color: '#059669' }}>
                <Briefcase size={16} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#059669', lineHeight: '1' }}>
                {companyJobs.length}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>
                Manage listings →
              </span>
            </div>
          </div>

          {/* KPI 2: Total Applicants */}
          <div
            onClick={() => navigate('/employer/candidates')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total Applicants
              </span>
              <div style={{ background: 'rgba(224, 242, 254, 0.9)', padding: '6px', borderRadius: '8px', color: '#0284c7' }}>
                <Users size={16} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0284c7', lineHeight: '1' }}>
                {companyApplications.length}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>
                Review candidate pool →
              </span>
            </div>
          </div>

          {/* KPI 3: Shortlisted Candidates */}
          <div
            onClick={() => navigate('/employer/pipeline')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Shortlisted
              </span>
              <div style={{ background: 'rgba(243, 232, 255, 0.9)', padding: '6px', borderRadius: '8px', color: '#7b2cbf' }}>
                <UserCheck size={16} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#7b2cbf', lineHeight: '1' }}>
                {shortlistedCount}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#7b2cbf', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>
                Open pipeline →
              </span>
            </div>
          </div>

          {/* KPI 4: Interviews Scheduled */}
          <div
            onClick={() => navigate('/employer/pipeline')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Interviews & Offers
              </span>
              <div style={{ background: 'rgba(254, 243, 199, 0.9)', padding: '6px', borderRadius: '8px', color: '#d97706' }}>
                <Calendar size={16} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#d97706', lineHeight: '1' }}>
                {interviewCount}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700', marginTop: '6px', display: 'inline-block' }}>
                View schedules →
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. QUICK RECRUITMENT SHORTCUTS
           ======================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '26px',
          WebkitOverflowScrolling: 'touch'
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
            Hiring Actions:
          </span>
          <Link to="/employer/jobs/create" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Plus size={14} color="#059669" /> Post New Role
          </Link>
          <Link to="/employer/jobs" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Briefcase size={14} color="#0284c7" /> Manage Postings ({companyJobs.length})
          </Link>
          <Link to="/employer/candidates" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Users size={14} color="#7b2cbf" /> Candidate Pool ({companyApplications.length})
          </Link>
          <Link to="/employer/pipeline" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <GitMerge size={14} color="#d97706" /> Stage Pipeline
          </Link>
          <Link to="/employer/company" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Building2 size={14} color="#64748b" /> Company Profile
          </Link>
        </div>

        {/* ========================================================
            4. ACTIVE JOBS & RECENT APPLICANTS SPLIT
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>

          {/* LEFT: ACTIVE JOB POSTINGS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#059669" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  Active Job Postings
                </h2>
              </div>
              <Link to="/employer/jobs" style={{ fontSize: '0.84rem', fontWeight: '700', color: '#059669', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Manage All ({companyJobs.length}) <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companyJobs.length === 0 ? (
                <div className="rc-candidate-card" style={{ padding: '28px', textAlign: 'center', color: '#64748b' }}>
                  No active listings yet. <Link to="/employer/jobs/create" style={{ color: '#059669', fontWeight: '700' }}>Post a job</Link> to start sourcing candidates!
                </div>
              ) : (
                companyJobs.map((job) => {
                  const isInternship = job.employmentType === 'Internship';
                  return (
                    <div
                      key={job.id}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="rc-candidate-card rc-candidate-card-hover"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '16px 20px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                            {job.title}
                          </h3>
                          {isInternship && (
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: '800',
                              color: '#7b2cbf',
                              background: 'rgba(243, 232, 255, 0.95)',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              border: '1px solid rgba(216, 180, 254, 0.8)'
                            }}>
                              STIPEND
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                          {job.location} • {job.workMode || 'Hybrid'} • {job.experience || '1-3 Yrs'}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: isInternship ? '#7b2cbf' : '#059669', fontWeight: '700', marginTop: '5px' }}>
                          {job.salary || (isInternship ? '₹20,000 – ₹30,000 / month (Stipend)' : '₹12 – ₹18 LPA')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(236, 253, 245, 0.95)',
                          color: '#059669',
                          border: '1px solid rgba(167, 243, 208, 0.9)'
                        }}>
                          Active
                        </span>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(236, 253, 245, 0.95)',
                          color: '#059669',
                          border: '1px solid rgba(167, 243, 208, 0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ArrowUpRight size={15} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: RECENT APPLICANTS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#0284c7" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  Recent Applicants
                </h2>
              </div>
              <Link to="/employer/candidates" style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0284c7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Candidate Pool ({companyApplications.length}) <ArrowRight size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companyApplications.length === 0 ? (
                <div className="rc-candidate-card" style={{ padding: '28px', textAlign: 'center', color: '#64748b' }}>
                  No applicant submissions yet.
                </div>
              ) : (
                companyApplications.map((app) => {
                  const job = jobs.find(j => j.id === app.jobId) || { title: 'Candidate Role' };
                  const applicantName = candidateUser?.personal?.fullName || 'Arjun Verma';

                  let badgeColor = '#0284c7';
                  let badgeBg = 'rgba(224, 242, 254, 0.95)';
                  let badgeBorder = 'rgba(186, 230, 253, 0.9)';

                  if (app.status === 'Shortlisted') {
                    badgeColor = '#7b2cbf';
                    badgeBg = 'rgba(243, 232, 255, 0.95)';
                    badgeBorder = 'rgba(216, 180, 254, 0.9)';
                  } else if (app.status === 'Interview') {
                    badgeColor = '#059669';
                    badgeBg = 'rgba(236, 253, 245, 0.95)';
                    badgeBorder = 'rgba(167, 243, 208, 0.9)';
                  }

                  return (
                    <div
                      key={app.id}
                      onClick={() => navigate('/employer/pipeline')}
                      className="rc-candidate-card rc-candidate-card-hover"
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
                          {applicantName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                          Applied for <strong style={{ color: '#334155' }}>{job.title}</strong> • {app.appliedDate || 'Recent'}
                        </div>
                        {app.notes && (
                          <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
                            {app.notes}
                          </div>
                        )}
                      </div>

                      <span style={{
                        fontSize: '0.76rem',
                        fontWeight: '800',
                        padding: '5px 12px',
                        borderRadius: '8px',
                        background: badgeBg,
                        color: badgeColor,
                        border: `1px solid ${badgeBorder}`,
                        whiteSpace: 'nowrap'
                      }}>
                        {app.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </PageContainer>
    </Section>
  );
}

export default EmployerOverviewPage;
