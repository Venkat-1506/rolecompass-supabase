import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Tag } from '../ui/Tag.jsx';
import { CompanyLogoWithFallback } from '../ui/CompanyLogoWithFallback.jsx';
import { Cluster } from '../layout/Cluster.jsx';
import { Stack } from '../layout/Stack.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import '../../styles/application-modal.css';
import { 
  CheckCircle2, ArrowRight, ShieldCheck, FileText, Sparkles, 
  Lock, Upload, Check, AlertCircle, Briefcase, MapPin, ExternalLink, 
  Edit3, Clock, DollarSign, Building2, Zap, Award, UserCheck, ChevronRight
} from 'lucide-react';

const WIZARD_STEPS = [
  { num: 1, label: "Profile & Resume Match" },
  { num: 2, label: "Role Screening" },
  { num: 3, label: "Availability & Pitch" },
  { num: 4, label: "Review & Sign" }
];

export function ApplicationModal({ job, isOpen, onClose }) {
  const { 
    isAuthenticated, 
    loginAsCandidate, 
    candidateUser, 
    submitApplication, 
    companies, 
    getJobFit,
    calculateProfileCompletion 
  } = useApp();
  const navigate = useNavigate();

  // Wizard Steps:
  // Step 0: Auth Gate
  // Step 1: Candidate Identity & Smart Resume Match
  // Step 2: Role & Department Screening Questions
  // Step 3: Availability, CTC & AI Pitch Builder
  // Step 4: Executive Review & Attestation
  // Step 5: Success Confirmation & Pipeline Tracker
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    noticePeriod: "Immediate / 15 Days",
    workPreference: "Hybrid / Flexible",
    expectedCtc: "",
    willingToRelocate: "Yes",
    portfolioUrl: candidateUser?.personal?.portfolioUrl || candidateUser?.personal?.githubUrl || "https://github.com/arjunverma",
    departmentAnswer1: "",
    departmentAnswer2: "",
    coverNote: ""
  });
  const [eSigned, setESigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeName, setResumeName] = useState(candidateUser?.resume?.fileName || "Arjun_Verma_Resume_2026.pdf");
  const [resumeSize, setResumeSize] = useState("2.4 MB PDF");
  const [submittedAppId, setSubmittedAppId] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (!isAuthenticated) {
        setStep(0);
      } else {
        setStep(1);
      }
      setESigned(false);
    }
  }, [isOpen, isAuthenticated]);

  if (!job) return null;

  const company = (companies || []).find(c => c && c.id === job.companyId) || { name: job.companyId || "Company" };
  const fitData = getJobFit ? getJobFit(job.id) : { fitScore: 82, matchedSkills: [], missingRequiredSkills: [], skillGaps: [] };
  const profileCompletion = calculateProfileCompletion ? calculateProfileCompletion(candidateUser) : 85;

  // Auto-seed expected CTC from job range if available
  const defaultCtc = job.salary ? job.salary.split('(')[0].trim() : "₹18 - ₹22 LPA";

  const handleAuthStep = () => {
    loginAsCandidate();
    setStep(1);
  };

  const handleNext = () => {
    if (step === 4) {
      if (!eSigned) return;
      setIsSubmitting(true);
      setTimeout(() => {
        const createdApp = submitApplication({ 
          jobId: job.id, 
          screeningAnswers: { 
            ...answers, 
            expectedCtc: answers.expectedCtc || defaultCtc,
            resumeName 
          } 
        });
        setSubmittedAppId(createdApp?.id || `RC-APP-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsSubmitting(false);
        setStep(5);
      }, 650);
    } else {
      setStep(step + 1);
    }
  };

  const handleClose = () => {
    setStep(isAuthenticated ? 1 : 0);
    setESigned(false);
    if (onClose) onClose();
  };

  const handleResumeReplace = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeName(file.name);
      setResumeSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB ${file.name.split('.').pop().toUpperCase()}`);
    }
  };

  // AI Pitch Prompt Generator Templates
  const handleApplyAiPitch = (type) => {
    const topSkills = (fitData.matchedSkills?.length ? fitData.matchedSkills : job.skills || []).slice(0, 3).join(', ');
    if (type === 'impact') {
      setAnswers(prev => ({
        ...prev,
        coverNote: `I bring strong hands-on proficiency in ${topSkills || 'modern full-stack tools'}, along with a disciplined track record of engineering production-ready applications. I am keen to leverage my technical problem-solving capabilities to deliver immediate measurable value to ${company.name}'s ${job.subcategory || 'engineering'} initiatives.`
      }));
    } else if (type === 'growth') {
      setAnswers(prev => ({
        ...prev,
        coverNote: `As an ambitious and fast-learning candidate with deep passion for ${job.title}, I take pride in high-ownership execution and cross-functional agility. Having studied ${company.name}'s product architecture and market trajectory, I am eager to contribute fresh perspectives and continuous energy to your team.`
      }));
    } else if (type === 'mission') {
      setAnswers(prev => ({
        ...prev,
        coverNote: `I have long admired ${company.name}'s standard of innovation and customer delight. My core strengths in ${topSkills || 'software engineering'} and clean systems design closely align with the core requirements for ${job.title}, and I would love the opportunity to contribute to your long-term roadmap.`
      }));
    }
  };

  // Sticky Workspace Footer Component
  const renderFooter = () => {
    if (step === 0) {
      return (
        <div className="rc-app-footer-bar" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="primary" onClick={handleAuthStep} rightIcon={<ArrowRight size={15} />}>
            Sign In with Candidate Profile
          </Button>
        </div>
      );
    }

    if (step > 0 && step < 5) {
      return (
        <div className="rc-app-footer-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
              <ShieldCheck size={16} color="#059669" /> RoleCompass Verified Application
            </div>
          )}

          <div className="rc-app-footer-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }} className="rc-hide-mobile">
              Step {step} of 4
            </span>
            <Button 
              variant="primary" 
              isLoading={isSubmitting} 
              disabled={step === 4 && !eSigned}
              onClick={handleNext} 
              rightIcon={<ArrowRight size={14} />}
            >
              {step === 4 ? "Transmit Application" : "Continue"}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const categoryName = (job.category || 'Technology').toLowerCase();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 5 ? "Application Transmitted" : "Job Application Workspace"}
      size="xl"
      className="rc-application-modal"
      overlayClassName="rc-application-overlay"
      footer={renderFooter()}
    >
      {/* 1. TOP BRANDED APPLICATION HERO BANNER */}
      {step > 0 && step < 5 && (
        <div className="rc-app-hero" style={{
          background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.75), rgba(248, 250, 252, 0.95))',
          padding: '18px 22px',
          borderRadius: '18px',
          border: '1px solid rgba(167, 243, 208, 0.5)',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
        }}>
          <div className="rc-app-hero-main" style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '260px', flex: 1 }}>
            <div style={{
              background: '#ffffff',
              padding: '4px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
              flexShrink: 0
            }}>
              <CompanyLogoWithFallback companyId={job.companyId} name={company.name} logo={company.logo} size="md" variant="square" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {company.name}
                </span>
                <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
                  Verified Recruiter
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px', lineHeight: 1.3 }}>
                {job.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#059669" /> {job.location}
                </span>
                <span>•</span>
                <span style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, color: '#334155' }}>
                  {job.workMode || 'Hybrid'}
                </span>
                <span>•</span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {job.salary || 'Competitive CTC'}
                </span>
              </div>
            </div>
          </div>

          <div className="rc-app-hero-match" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #a7f3d0',
              padding: '8px 16px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)'
            }}>
              <Sparkles size={16} color="#059669" />
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>RoleCompass Match</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>{fitData.fitScore}% Fit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC 4-STAGE WIZARD STEPPER */}
      {step > 0 && step < 5 && (
        <div className="rc-app-stepper">
          {/* Mobile-only current step summary */}
          <div className="rc-show-mobile rc-app-stepper-mobile">
            <span className="rc-app-stepper-mobile-step">Step {step} of 4</span>
            <span className="rc-app-stepper-mobile-title">{WIZARD_STEPS[step - 1].label}</span>
          </div>

          <div className="rc-app-stepper-track">
            {WIZARD_STEPS.map((s) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div
                  key={s.num}
                  className={`rc-app-step ${isCurrent ? 'rc-app-step-current' : ''} ${isCompleted ? 'rc-app-step-done' : ''}`}
                  style={{ opacity: isCurrent || isCompleted ? 1 : 0.45 }}
                >
                  <div className="rc-app-step-bar" style={{
                    background: isCompleted || isCurrent ? 'linear-gradient(90deg, #059669, #10b981)' : '#e2e8f0'
                  }} />
                  <span className="rc-app-step-label" style={{ color: isCurrent ? '#059669' : '#64748b' }}>
                    {s.num}. {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 0: AUTHENTICATION GATE */}
      {step === 0 && (
        <Stack gap="6" align="center" style={{ padding: '24px 0', textAlign: 'center' }}>
          <div style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', 
            color: '#059669', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.18)'
          }}>
            <Lock size={32} />
          </div>

          <div>
            <h2 className="rc-h2" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sign in to Submit Application</h2>
            <p className="rc-body" style={{ maxWidth: '480px', margin: '8px auto 0', fontSize: '0.95rem', color: '#475569' }}>
              To apply for <strong>{job.title}</strong> at <strong>{company.name}</strong>, authenticate your candidate profile for one-click transmission.
            </p>
          </div>

          <div className="rc-app-auth-card" style={{
            width: '100%',
            maxWidth: '540px',
            background: '#ffffff',
            border: '1px solid rgba(5, 150, 105, 0.3)',
            borderRadius: '18px',
            padding: '22px',
            textAlign: 'left',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
          }}>
            <div className="rc-app-auth-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                color: '#ffffff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
              }}>
                {candidateUser?.personal?.fullName?.slice(0, 2).toUpperCase() || 'AV'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {candidateUser?.personal?.fullName || "Arjun Verma"}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                  {candidateUser?.personal?.title || 'Aspiring Software Candidate'} • {candidateUser?.personal?.email || "arjun.verma@rolecompass.demo"}
                </p>
              </div>
              <Badge variant="success">Candidate Demo</Badge>
            </div>
          </div>
        </Stack>
      )}

      {/* STEP 1: CANDIDATE IDENTITY & SMART RESUME MATCH */}
      {step === 1 && (
        <Stack gap="5">
          {/* Candidate Profile Dossier Card */}
          <div className="rc-app-card rc-app-dossier" style={{
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '18px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <div className="rc-app-dossier-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                  VERIFIED CANDIDATE IDENTITY
                </span>
                <h3 className="rc-h3" style={{ fontSize: '1.25rem', marginTop: '2px', fontWeight: 800, color: '#0f172a' }}>
                  {candidateUser.personal?.fullName || "Arjun Verma"}
                </h3>
                <p className="rc-small" style={{ color: '#475569', marginTop: '2px', fontWeight: 600 }}>
                  {candidateUser.personal?.title || "Candidate"}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                  <span>{candidateUser.personal?.email || "arjun.verma@rolecompass.demo"}</span>
                  <span>•</span>
                  <span>{candidateUser.personal?.phone || "+91 98765 43210 (Verified)"}</span>
                  <span>•</span>
                  <span>{candidateUser.personal?.location || "Bengaluru, Karnataka"}</span>
                </div>
              </div>

              <div className="rc-app-dossier-meta" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 14px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700 }}>
                  Profile Completion: {profileCompletion}%
                </div>
                <Link to="/candidate/profile" onClick={handleClose} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                  <Edit3 size={14} /> Edit Full Profile
                </Link>
              </div>
            </div>

            {/* Resume Selection Chip Widget */}
            <div className="rc-app-resume" style={{
              marginTop: '18px',
              padding: '14px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px'
            }}>
              <div className="rc-app-resume-main" style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '12px', color: '#059669', flexShrink: 0 }}>
                  <FileText size={24} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>{resumeName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    <span>{resumeSize}</span>
                    <span>•</span>
                    <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Check size={12} /> AI ATS Scan Verified
                    </span>
                  </div>
                </div>
              </div>
              <label className="rc-app-resume-label" style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#059669',
                background: '#ffffff',
                border: '1px solid #a7f3d0',
                padding: '8px 16px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.08)'
              }}>
                <Upload size={14} /> Change Resume
                <input type="file" accept=".pdf,.docx" onChange={handleResumeReplace} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* AI Skill Alignment Matrix Card */}
          <div className="rc-app-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '18px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#059669" /> RoleCompass Skill Match & Readiness Alignment
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '8px' }}>
                  Matched Required Skills ({fitData.matchedSkills?.length || (job.skills || []).slice(0, 3).length}):
                </span>
                <Cluster gap="2">
                  {(fitData.matchedSkills?.length ? fitData.matchedSkills : (job.skills || []).slice(0, 4)).map(sk => (
                    <span key={sk} style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#047857',
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Check size={13} /> {sk}
                    </span>
                  ))}
                </Cluster>
              </div>

              {(fitData.skillGaps?.length > 0 || fitData.missingRequiredSkills?.length > 0) && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '14px 18px', borderRadius: '14px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', display: 'block', marginBottom: '8px' }}>
                    Identified Skill Gaps for this Role (Quick Learning Available):
                  </span>
                  <Cluster gap="2">
                    {(fitData.skillGaps || fitData.missingRequiredSkills || []).map(sk => (
                      <span key={sk} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', background: '#ffffff', border: '1px solid #fcd34d', padding: '5px 12px', borderRadius: '8px', color: '#92400e', fontWeight: 600 }}>
                        {sk}
                        <Link 
                          to={`/candidate/learning/${sk.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} 
                          onClick={handleClose} 
                          style={{ color: '#059669', textDecoration: 'underline', fontWeight: 700, fontSize: '0.75rem' }}
                        >
                          Learn in Hub
                        </Link>
                      </span>
                    ))}
                  </Cluster>
                </div>
              )}
            </div>
          </div>
        </Stack>
      )}

      {/* STEP 2: DEPARTMENT & ROLE-SPECIFIC SCREENING QUESTIONS */}
      {step === 2 && (
        <Stack gap="5">
          <div className="rc-app-subhead" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Badge variant="info">
              Step 2 of 4: {job.category || 'Role'} Specific Screening
            </Badge>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Customized for {company.name}</span>
          </div>

          {/* Department-tailored questions */}
          <div className="rc-app-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '18px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {(categoryName.includes('tech') || categoryName.includes('software') || categoryName.includes('engineer')) && (
              <>
                <Input
                  label="GitHub / Portfolio / Live Project URL *"
                  value={answers.portfolioUrl}
                  onChange={(e) => setAnswers({ ...answers, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/yourhandle or live URL"
                />
                <Input
                  label="Primary Tech Stack & Framework Experience *"
                  value={answers.departmentAnswer1}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer1: e.target.value })}
                  placeholder="e.g. React, Node.js, TypeScript, SQL, Docker (2 years)"
                />
                <Textarea
                  label="System Architecture & Complex Feature Experience"
                  value={answers.departmentAnswer2}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer2: e.target.value })}
                  placeholder="Briefly describe a complex feature, API integration, or bug optimization you successfully implemented..."
                  rows={2}
                />
              </>
            )}

            {(categoryName.includes('design') || categoryName.includes('creative')) && (
              <>
                <Input
                  label="Figma / Behance / Dribbble Portfolio Link *"
                  value={answers.portfolioUrl}
                  onChange={(e) => setAnswers({ ...answers, portfolioUrl: e.target.value })}
                  placeholder="https://figma.com/@yourportfolio or Behance"
                />
                <Input
                  label="Design System & Prototyping Experience *"
                  value={answers.departmentAnswer1}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer1: e.target.value })}
                  placeholder="e.g. Multi-brand tokens in Figma, auto-layout, interactive micro-animations"
                />
                <Textarea
                  label="Key User Experience & Usability Achievement"
                  value={answers.departmentAnswer2}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer2: e.target.value })}
                  placeholder="Describe a user friction point you researched and redesigned, and its impact..."
                  rows={2}
                />
              </>
            )}

            {(categoryName.includes('product')) && (
              <>
                <Input
                  label="Product Portfolio / PRD Sample / Case Study URL *"
                  value={answers.portfolioUrl}
                  onChange={(e) => setAnswers({ ...answers, portfolioUrl: e.target.value })}
                  placeholder="https://notion.so/your-prd-sample or personal website"
                />
                <Input
                  label="Agile / Product Metrics Tracking Frameworks *"
                  value={answers.departmentAnswer1}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer1: e.target.value })}
                  placeholder="e.g. Jira, Mixpanel, Amplitude, RICE prioritization, SQL funnels"
                />
                <Textarea
                  label="Core Product Launch or Feature Success Metric"
                  value={answers.departmentAnswer2}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer2: e.target.value })}
                  placeholder="Summarize a 0-to-1 feature or optimization that drove conversion, retention, or GMV..."
                  rows={2}
                />
              </>
            )}

            {(categoryName.includes('data') || categoryName.includes('ai')) && (
              <>
                <Input
                  label="Kaggle / GitHub / Data Portfolio URL *"
                  value={answers.portfolioUrl}
                  onChange={(e) => setAnswers({ ...answers, portfolioUrl: e.target.value })}
                  placeholder="https://github.com/your-models or Kaggle profile"
                />
                <Input
                  label="Machine Learning / Data Pipeline Frameworks *"
                  value={answers.departmentAnswer1}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer1: e.target.value })}
                  placeholder="e.g. PyTorch, Pandas, SQL, Spark, Transformers, Power BI"
                />
                <Textarea
                  label="Model Training & Real-Time Inference Experience"
                  value={answers.departmentAnswer2}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer2: e.target.value })}
                  placeholder="Mention scale of data processed, latency targets, and evaluation metrics achieved..."
                  rows={2}
                />
              </>
            )}

            {(!categoryName.includes('tech') && !categoryName.includes('design') && !categoryName.includes('product') && !categoryName.includes('data')) && (
              <>
                <Input
                  label="LinkedIn / Professional Profile / Portfolio URL *"
                  value={answers.portfolioUrl}
                  onChange={(e) => setAnswers({ ...answers, portfolioUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/yourhandle"
                />
                <Input
                  label="Core Industry Tools & Methodologies *"
                  value={answers.departmentAnswer1}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer1: e.target.value })}
                  placeholder="e.g. Salesforce, Excel Financial Modeling, SAP, SEO / Google Analytics"
                />
                <Textarea
                  label="Key Professional Achievement in your Domain"
                  value={answers.departmentAnswer2}
                  onChange={(e) => setAnswers({ ...answers, departmentAnswer2: e.target.value })}
                  placeholder="Highlight a campaign, budget optimization, or operational milestone you led..."
                  rows={2}
                />
              </>
            )}
          </div>
        </Stack>
      )}

      {/* STEP 3: AVAILABILITY, CTC & AI COVER PITCH BUILDER */}
      {step === 3 && (
        <Stack gap="5">
          <Badge variant="info" style={{ alignSelf: 'flex-start' }}>
            Step 3 of 4: Availability & Pitch
          </Badge>

          {/* Notice Period Pills */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              Notice Period / Earliest Join Date *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {["Immediate / 15 Days", "30 Days", "60 Days", "90 Days"].map(np => (
                <button
                  key={np}
                  type="button"
                  onClick={() => setAnswers({ ...answers, noticePeriod: np })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: answers.noticePeriod === np ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: answers.noticePeriod === np ? '#ecfdf5' : '#ffffff',
                    color: answers.noticePeriod === np ? '#059669' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    boxShadow: answers.noticePeriod === np ? '0 4px 12px rgba(5, 150, 105, 0.12)' : 'none'
                  }}
                >
                  {np}
                </button>
              ))}
            </div>
          </div>

          {/* Work Mode Preference Pills */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              Work Mode Preference *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
              {["Hybrid / Flexible", "Remote Only", "On-Site / Willing to Relocate"].map(wm => (
                <button
                  key={wm}
                  type="button"
                  onClick={() => setAnswers({ ...answers, workPreference: wm })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: answers.workPreference === wm ? '2px solid #059669' : '1px solid #e2e8f0',
                    background: answers.workPreference === wm ? '#ecfdf5' : '#ffffff',
                    color: answers.workPreference === wm ? '#059669' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    boxShadow: answers.workPreference === wm ? '0 4px 12px rgba(5, 150, 105, 0.12)' : 'none'
                  }}
                >
                  {wm}
                </button>
              ))}
            </div>
          </div>

          {/* Expected CTC */}
          <Input
            label="Expected Compensation (Annual CTC in INR) *"
            value={answers.expectedCtc}
            onChange={(e) => setAnswers({ ...answers, expectedCtc: e.target.value })}
            placeholder={`e.g. ${defaultCtc} (Job Budget: ${job.salary || 'Competitive'})`}
          />

          {/* AI Cover Pitch Generator Assistant */}
          <div>
            <div className="rc-app-pitch-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                Cover Pitch / Highlights for Hiring Manager
              </label>
              <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={13} /> 1-Click AI Pitch Prompts:
              </span>
            </div>

            {/* Prompt Quick Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => handleApplyAiPitch('impact')}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#047857',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                ⚡ High Impact
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiPitch('growth')}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0369a1',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🎯 Fast Learner
              </button>
              <button
                type="button"
                onClick={() => handleApplyAiPitch('mission')}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#6d28d9',
                  background: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🏢 Company Mission Alignment
              </button>
            </div>

            <Textarea
              value={answers.coverNote}
              onChange={(e) => setAnswers({ ...answers, coverNote: e.target.value })}
              placeholder="Click an AI prompt above or summarize why your background matches this position..."
              rows={3}
            />
          </div>
        </Stack>
      )}

      {/* STEP 4: EXECUTIVE REVIEW & DIGITAL E-SIGN */}
      {step === 4 && (
        <Stack gap="5">
          <Badge variant="success" style={{ alignSelf: 'flex-start' }}>
            Step 4 of 4: Final Application Review & Attestation
          </Badge>

          {/* Dossier Review Card */}
          <div className="rc-app-card" style={{
            background: '#ffffff',
            border: '1px solid rgba(226, 232, 240, 0.95)',
            borderRadius: '18px',
            padding: '22px 24px',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
          }}>
            <Stack gap="3">
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Applicant:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  {candidateUser.personal?.fullName || "Arjun Verma"} ({candidateUser.personal?.email})
                </span>
              </div>
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Target Role:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  {job.title} at {company.name}
                </span>
              </div>
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Attached Document:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <FileText size={15} /> {resumeName}
                </span>
              </div>
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>RoleCompass Fit:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#059669' }}>
                  ✨ {fitData.fitScore}% Match Fit
                </span>
              </div>
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Availability:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  {answers.noticePeriod} • {answers.workPreference}
                </span>
              </div>
              <div className="rc-app-review-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>Expected CTC:</span>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  {answers.expectedCtc || defaultCtc}
                </span>
              </div>
            </Stack>
          </div>

          <label className="rc-app-esign" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            background: eSigned ? '#ecfdf5' : '#ffffff',
            padding: '16px 20px',
            borderRadius: '14px',
            border: eSigned ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: eSigned ? '0 4px 14px rgba(5, 150, 105, 0.1)' : 'none'
          }}>
            <input
              type="checkbox"
              checked={eSigned}
              onChange={(e) => setESigned(e.target.checked)}
              style={{ marginTop: '3px', width: '20px', height: '20px', accentColor: '#059669', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 600, lineHeight: '1.45' }}>
              I confirm that all candidate profile details, screening answers, and attached resume information are complete and authentic for direct submission to the hiring managers at <strong>{company.name}</strong>.
            </span>
          </label>
        </Stack>
      )}

      {/* STEP 5: SUCCESS CONFIRMATION & LIFECYCLE TRACKER */}
      {step === 5 && (
        <Stack gap="6" align="center" style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 12px 36px rgba(5, 150, 105, 0.25)',
            animation: 'rcPulse 2s infinite'
          }}>
            <CheckCircle2 size={50} />
          </div>

          <div>
            <Badge variant="success" style={{ marginBottom: '12px', padding: '6px 16px', fontSize: '0.9rem' }}>
              Application Reference: {submittedAppId}
            </Badge>
            <h2 className="rc-h2" style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a' }}>
              Application Transmitted!
            </h2>
            <p className="rc-body" style={{ maxWidth: '480px', margin: '10px auto 0', fontSize: '0.96rem', color: '#475569' }}>
              Your application for <strong>{job.title}</strong> at <strong>{company.name}</strong> has been logged in the employer's applicant tracking pipeline.
            </p>
          </div>

          {/* 4-Stage Application Lifecycle Pipeline Tracker */}
          <div className="rc-app-card rc-app-pipeline" style={{
            width: '100%',
            maxWidth: '680px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '20px 24px',
            textAlign: 'left',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
          }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '14px' }}>
              APPLICATION LIFECYCLE STATUS
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 800, fontSize: '0.82rem' }}>
                  <Check size={14} /> Submitted
                </div>
                <div style={{ fontSize: '0.72rem', color: '#047857', marginTop: '2px' }}>Today</div>
              </div>

              <div style={{ padding: '10px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontWeight: 800, fontSize: '0.82rem' }}>
                  <Clock size={14} /> Recruiter Screen
                </div>
                <div style={{ fontSize: '0.72rem', color: '#1e40af', marginTop: '2px' }}>Est. 48 Hours</div>
              </div>

              <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', opacity: 0.6 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#64748b' }}>Technical Loop</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Stage 3</div>
              </div>

              <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', opacity: 0.6 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#64748b' }}>Decision / Offer</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>Stage 4</div>
              </div>
            </div>
          </div>

          <Cluster gap="3" className="rc-app-success-actions">
            <Button
              variant="primary"
              onClick={() => {
                handleClose();
                navigate('/candidate/applications');
              }}
            >
              Track in Applications
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();
                navigate(`/jobs/${job.id}`);
              }}
            >
              View Job Listing
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                handleClose();
                navigate('/explore');
              }}
            >
              Explore More Roles
            </Button>
          </Cluster>
        </Stack>
      )}
    </Modal>
  );
}
