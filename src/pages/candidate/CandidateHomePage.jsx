import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { CompanyLogoWithFallback } from '../../components/ui/CompanyLogoWithFallback.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  Target,
  FileText,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  BookOpen,
  Send,
  Clock,
  Bookmark,
  Sparkles,
  Award,
  ChevronRight,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import '../../styles/glass.css';
import '../../styles/candidate.css';

export function CandidateHomePage() {
  const { candidateUser, currentUser, jobs, applications, learningRecords = {}, savedJobs = [] } = useApp();
  const navigate = useNavigate();

  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  // Derived candidate profile data
  const userName = (currentUser?.fullName || candidateUser?.personal?.fullName || 'Arjun').split(' ')[0];
  const targetRoleTitle = candidateUser?.roleProfile?.primaryTarget || 'Frontend Engineer';
  const hasTargetRole = Boolean(candidateUser?.roleProfile?.primaryTarget);
  const readinessScore = candidateUser?.roleProfile?.readinessScore ?? 0;
  const userApplications = applications.filter(a => a.candidateId === (candidateUser?.id || currentUser?.id || 'user-cand-01'));
  
  // Real metric breakdowns
  const pendingCount = userApplications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;
  const interviewOrShortlistCount = userApplications.filter(a => a.status === 'Shortlisted' || a.status === 'Interview').length;
  const candidateLearningRecords = Object.values(learningRecords).filter(
    r => (r.candidateId || 'candidate-1') === (candidateUser?.id || 'candidate-1')
  );
  const activeLearningCount = candidateLearningRecords.filter(r => r.status === 'in_progress').length;
  const completedLearningCount = candidateLearningRecords.filter(r => r.status === 'completed').length;
  const savedJobsCount = savedJobs.length;

  // Profile completion calculation based on candidate record
  const profileCompletion = candidateUser?.profileCompletion || 90;

  // Select top 4 recommended jobs matching target role or highest fit
  const recommendedJobs = jobs.slice(0, 4);

  return (
    <Section py="6" className="rc-candidate-dashboard">
      <PageContainer size="lg">

        {/* ========================================================
            1. COMPACT PERSONALIZED OVERVIEW (Directly on glass background)
           ======================================================== */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.52)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="rc-candidate-eyebrow" style={{ margin: 0 }}>
                <Compass size={13} /> CAREER WORKSPACE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                • Target: <strong style={{ color: '#0f172a' }}>{targetRoleTitle}</strong>
              </span>
            </div>

            <h1 className="rc-candidate-h1" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.25rem)', lineHeight: '1.2' }}>
              Welcome back, {userName}
            </h1>

            <p style={{ color: '#475569', fontSize: '0.92rem', margin: '4px 0 0', fontWeight: '500' }}>
              Your profile is matched against {jobs.length} live verified career openings.
            </p>
          </div>

          {/* High-Impact Next Action Shortcut */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/candidate/resume" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(16px)',
                color: '#0f172a',
                fontWeight: '700',
                fontSize: '0.85rem',
                padding: '9px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(203, 213, 225, 0.9)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 180ms ease',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
              }}>
                <FileText size={15} color="#059669" /> Resume Hub
              </button>
            </Link>

            <Link to="/jobs" style={{ textDecoration: 'none' }}>
              <button style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.85rem',
                padding: '9px 18px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.28)',
                transition: 'all 180ms ease'
              }}>
                Explore Jobs <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>

        {/* ========================================================
            2. CLICKABLE CAREER PROGRESS METRICS GRID
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
          marginBottom: '26px'
        }}>
          {/* Card 1: Applications Submitted */}
          <div
            onClick={() => navigate('/candidate/applications')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' }}>
                Applications
              </span>
              <div style={{ background: 'rgba(236, 253, 245, 0.9)', padding: '5px', borderRadius: '8px', color: '#059669' }}>
                <Send size={15} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>
                {userApplications.length}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', marginTop: '4px', display: 'inline-block' }}>
                {pendingCount} in review →
              </span>
            </div>
          </div>

          {/* Card 2: Shortlisted / Interviews */}
          <div
            onClick={() => navigate('/candidate/applications')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' }}>
                Interviews & Offers
              </span>
              <div style={{ background: 'rgba(243, 232, 255, 0.9)', padding: '5px', borderRadius: '8px', color: '#7b2cbf' }}>
                <Award size={15} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#7b2cbf', lineHeight: '1' }}>
                {interviewOrShortlistCount}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#7b2cbf', marginTop: '4px', display: 'inline-block' }}>
                Active pipeline →
              </span>
            </div>
          </div>

          {/* Card 3: Saved Jobs */}
          <div
            onClick={() => navigate('/jobs')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' }}>
                Saved Jobs
              </span>
              <div style={{ background: 'rgba(254, 243, 199, 0.9)', padding: '5px', borderRadius: '8px', color: '#d97706' }}>
                <Bookmark size={15} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0f172a', lineHeight: '1' }}>
                {savedJobsCount}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#d97706', marginTop: '4px', display: 'inline-block' }}>
                Browse saved roles →
              </span>
            </div>
          </div>

          {/* Card 4: Role Readiness Score */}
          <div
            onClick={() => navigate('/candidate/roles')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' }}>
                Role Readiness
              </span>
              <div style={{ background: 'rgba(236, 253, 245, 0.9)', padding: '5px', borderRadius: '8px', color: '#059669' }}>
                <Target size={15} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#059669', lineHeight: '1' }}>
                {hasTargetRole ? `${readinessScore}%` : '—'}
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#059669', marginTop: '4px', display: 'inline-block' }}>
                {hasTargetRole ? 'Skill match breakdown →' : 'Select a target role →'}
              </span>
            </div>
          </div>

          {/* Card 5: Profile Completion */}
          <div
            onClick={() => navigate('/candidate/profile')}
            className="rc-candidate-card rc-candidate-card-hover"
            style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#64748b' }}>
                Profile Strength
              </span>
              <div style={{ background: 'rgba(224, 242, 254, 0.9)', padding: '5px', borderRadius: '8px', color: '#0284c7' }}>
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: '900', color: '#0284c7', lineHeight: '1' }}>
                {profileCompletion}%
              </div>
              <div style={{ marginTop: '6px' }}>
                <Progress value={profileCompletion} />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. ACTION SHORTCUTS PILLS
           ======================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '28px',
          WebkitOverflowScrolling: 'touch'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>
            Quick Shortcuts:
          </span>
          <Link to="/candidate/profile" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <CheckCircle2 size={14} color="#059669" /> Edit Profile
          </Link>
          <Link to="/jobs" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Briefcase size={14} color="#0284c7" /> Find Jobs
          </Link>
          <Link to="/candidate/roles" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <Target size={14} color="#7b2cbf" /> Roles & Fit
          </Link>
          <Link to="/candidate/learning" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <BookOpen size={14} color="#059669" /> Learning Hub ({activeLearningCount})
          </Link>
          <Link to="/candidate/preferences" className="rc-candidate-nav-link" style={{ background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <SlidersHorizontal size={14} color="#64748b" /> Career Preferences
          </Link>
        </div>

        {/* ========================================================
            4. MAIN SPLIT: RECOMMENDED OPPORTUNITIES (LEFT) + RECENT ACTIVITY (RIGHT)
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>

          {/* LEFT COLUMN: RECOMMENDED JOBS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  Recommended Opportunities
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0', fontWeight: '500' }}>
                  Tailored to your {targetRoleTitle} competencies.
                </p>
              </div>

              <Link to="/jobs" style={{ fontSize: '0.84rem', fontWeight: '700', color: '#059669', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                All {jobs.length} Jobs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rc-stagger-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendedJobs.map((job) => {
                const fitScore = job.matchScore || (job.companyId === 'google' ? 88 : job.companyId === 'microsoft' ? 82 : job.companyId === 'amazon' ? 79 : 75);
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
                      padding: '16px 20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                      <CompanyLogoWithFallback
                        companyId={job.companyId}
                        name={job.companyName || 'Company'}
                        logo={job.logo}
                        size="md"
                        variant="square"
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: 0, lineHeight: '1.3' }}>
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
                              border: '1px solid rgba(216, 180, 254, 0.8)',
                              letterSpacing: '0.04em'
                            }}>
                              STIPEND
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px', fontWeight: '500' }}>
                          <strong style={{ color: '#334155' }}>{job.companyName}</strong> • {job.location || 'India'} • {job.workMode || 'Hybrid'}
                        </div>

                        {/* COMPENSATION & SKILLS ROW */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: isInternship ? '#7b2cbf' : '#059669' }}>
                            {job.salary || (isInternship ? '₹20,000 – ₹30,000 / month (Stipend)' : '₹12 – ₹18 LPA')}
                          </span>
                          <span style={{ color: '#cbd5e1' }}>•</span>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
                            {job.experience || '0-2 Yrs'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span className="rc-fit-pill rc-fit-pill-high" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                        {fitScore}% Fit
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
                        justifyContent: 'center',
                        transition: 'all 180ms ease'
                      }}>
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: RECENT APPLICATION ACTIVITY & NEXT STEPS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* BOX 1: RECENT APPLICATION ACTIVITY */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                    Application Tracker
                  </h2>
                  <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '2px 0 0', fontWeight: '500' }}>
                    {userApplications.length} active applications submitted.
                  </p>
                </div>

                <Link to="/candidate/applications" style={{ fontSize: '0.84rem', fontWeight: '700', color: '#059669', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Tracker →
                </Link>
              </div>

              <div className="rc-candidate-card" style={{ padding: 0, overflow: 'hidden' }}>
                {userApplications.length === 0 ? (
                  <div style={{ padding: '28px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                    No applications submitted yet. Browse recommended opportunities to get started!
                  </div>
                ) : (
                  userApplications.slice(0, 3).map((app, idx) => {
                    const matchedJob = jobs.find(j => j.id === app.jobId) || {
                      title: 'Software Engineer',
                      companyName: 'Technology Employer'
                    };

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
                        key={app.id || idx}
                        onClick={() => navigate('/candidate/applications')}
                        style={{
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          borderBottom: idx < userApplications.slice(0, 3).length - 1 ? '1px solid rgba(226, 232, 240, 0.7)' : 'none',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 253, 245, 0.4)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                            {matchedJob.title}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            {matchedJob.companyName} • Applied {app.appliedDate || 'Recently'}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: '800',
                          color: badgeColor,
                          background: badgeBg,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          border: `1px solid ${badgeBorder}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {app.status || 'Under Review'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* BOX 2: CAREER ACTION SHORTCUTS & LEARNING PROGRESS */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 16px', fontFamily: 'Outfit, sans-serif' }}>
                Next Career Milestones
              </h2>

              <div className="rc-candidate-card" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Milestone 1: Profile Completeness */}
                <Link to="/candidate/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)', transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 253, 245, 0.4)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Candidate Profile Review</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Strengths verified at {profileCompletion}%</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </Link>

                {/* Milestone 2: Resume ATS Readiness */}
                <Link to="/candidate/resume" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(226, 232, 240, 0.7)', transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 253, 245, 0.4)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={18} color="#0284c7" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Audit ATS Resume Readiness</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Evaluate keyword density against target roles</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </Link>

                {/* Milestone 3: Skill Upskilling */}
                <Link to="/candidate/learning" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', transition: 'background 0.15s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(236, 253, 245, 0.4)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BookOpen size={18} color="#7b2cbf" />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>Bridge High-Impact Skill Gaps</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{activeLearningCount} in progress • {completedLearningCount} completed learning sources</div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#64748b" />
                </Link>
              </div>
            </div>

          </div>

        </div>

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

export default CandidateHomePage;
