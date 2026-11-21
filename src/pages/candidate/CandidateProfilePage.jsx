import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Grid } from '../../components/layout/Grid.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Textarea } from '../../components/ui/Textarea.jsx';
import { Tag } from '../../components/ui/Tag.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import { Progress } from '../../components/ui/Progress.jsx';
import { ApplicationModal } from '../../components/forms/ApplicationModal.jsx';
import { AtsTesterCard } from '../../components/cards/AtsTesterCard.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  FileCode,
  FileText,
  Upload,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Award,
  Languages,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import '../../styles/glass.css';

export function CandidateProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    candidateUser,
    currentUser,
    updateProfile,
    updateCandidateProfile,
    jobs,
    calculateProfileCompletion,
  } = useApp();

  const applyJobId = searchParams.get('applyJobId');
  const targetJob = applyJobId ? jobs.find((j) => j.id === applyJobId) : null;

  const candidateName = candidateUser?.personal?.fullName || currentUser?.fullName || 'Candidate';
  const initialResumeName =
    candidateUser.resume?.fileName &&
    candidateUser.resume?.fileName !== 'Arjun_Verma_Resume_2026.pdf'
      ? candidateUser.resume.fileName
      : `${candidateName.replace(/\s+/g, '_')}_Resume_2026.pdf`;

  // Profile Form States
  const [personal, setPersonal] = useState({
    fullName: candidateUser.personal?.fullName || candidateName,
    title: candidateUser.personal?.title || 'Frontend Engineer & Full Stack Developer',
    email: candidateUser.personal?.email || currentUser?.email || 'candidate@rolecompass.com',
    phone: candidateUser.personal?.phone || '+91 98765 43210',
    location: candidateUser.personal?.location || 'Bengaluru, Karnataka',
    portfolioUrl:
      candidateUser.personal?.portfolioUrl ||
      candidateUser.personal?.githubUrl ||
      'https://github.com',
    bio:
      candidateUser.personal?.bio ||
      'Passionate engineer specialized in modern responsive web applications, state management, and accessible UI engineering.',
  });

  const [education, setEducation] = useState(
    candidateUser.education || [
      {
        id: 'edu-1',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'Anna University',
        year: '2026',
        score: '8.8 / 10 CGPA',
      },
    ],
  );

  const [experience, setExperience] = useState(candidateUser.experience || []);
  const [projects, setProjects] = useState(
    candidateUser.projects || [
      {
        id: 'proj-1',
        title: 'RoleCompass Career Navigation Studio',
        tech: 'React, Vite, CSS Design Tokens, Context API',
        link: 'https://github.com',
        description:
          'Full-stack job portal interface with local role-fit scoring, resume readiness checks, and profile editing.',
      },
    ],
  );

  const [skills, setSkills] = useState(
    candidateUser.skills && candidateUser.skills.length > 0
      ? candidateUser.skills
      : [
          'React',
          'JavaScript',
          'HTML/CSS',
          'TypeScript',
          'Node.js',
          'Git',
          'REST APIs',
          'TailwindCSS',
        ],
  );

  const [certifications, setCertifications] = useState(
    candidateUser.certifications || [
      {
        id: 'cert-1',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2025',
      },
      {
        id: 'cert-2',
        name: 'Meta Certified Front-End Developer',
        issuer: 'Meta / Coursera',
        year: '2025',
      },
    ],
  );

  const [languages, setLanguages] = useState(
    candidateUser.languages || [
      { id: 'lang-1', name: 'English', level: 'Professional Working' },
      { id: 'lang-2', name: 'Hindi', level: 'Native / Conversational' },
      { id: 'lang-3', name: 'Tamil', level: 'Conversational' },
    ],
  );

  const [resume, setResume] = useState(() => {
    const existing = candidateUser.resume || {};
    const fileName =
      existing.fileName && existing.fileName !== 'Arjun_Verma_Resume_2026.pdf'
        ? existing.fileName
        : initialResumeName;
    return {
      fileName,
      fileType: existing.fileType || 'application/pdf',
      fileSize: existing.fileSize || '240 KB',
      uploadedDate: existing.uploadedDate || new Date().toISOString().split('T')[0],
      parsedScore: existing.parsedScore || 92,
    };
  });

  const [newSkill, setNewSkill] = useState('');
  const [toastMsg, setToastMsg] = useState(null);
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);

  // New item draft states
  const [showAddExp, setShowAddExp] = useState(false);
  const [newExp, setNewExp] = useState({ title: '', company: '', period: '', description: '' });

  const [showAddProj, setShowAddProj] = useState(false);
  const [newProj, setNewProj] = useState({ title: '', description: '', tech: '', link: '' });

  const [showAddEdu, setShowAddEdu] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', institution: '', year: '', score: '' });

  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });

  const [showAddLang, setShowAddLang] = useState(false);
  const [newLang, setNewLang] = useState({ name: '', level: 'Professional Working' });

  const profileCompletion = calculateProfileCompletion
    ? calculateProfileCompletion({
        personal,
        education,
        experience,
        skills,
        projects,
      })
    : 88;

  const handleSave = () => {
    const updater = updateCandidateProfile || updateProfile;
    updater({
      personal,
      education,
      experience,
      projects,
      skills,
      certifications,
      languages,
      resume,
    });

    if (targetJob) {
      setSelectedJobToApply(targetJob);
    } else {
      setToastMsg('Candidate profile saved to central repository!');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedResume = {
        fileName: file.name,
        fileType: file.type || 'application/pdf',
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedDate: new Date().toISOString().split('T')[0],
        status: 'uploaded',
      };
      setResume(updatedResume);
      setToastMsg(`Uploaded ${file.name} locally in this demo.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skToRemove) => {
    setSkills(skills.filter((s) => s !== skToRemove));
  };

  const handleAddExperience = () => {
    if (newExp.title && newExp.company) {
      setExperience([...experience, { id: `exp-${Date.now()}`, ...newExp }]);
      setNewExp({ title: '', company: '', period: '', description: '' });
      setShowAddExp(false);
    }
  };

  const removeExperience = (id) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const handleAddProject = () => {
    if (newProj.title) {
      setProjects([...projects, { id: `proj-${Date.now()}`, ...newProj }]);
      setNewProj({ title: '', description: '', tech: '', link: '' });
      setShowAddProj(false);
    }
  };

  const removeProject = (id) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleAddEducation = () => {
    if (newEdu.degree && newEdu.institution) {
      setEducation([...education, { id: `edu-${Date.now()}`, ...newEdu }]);
      setNewEdu({ degree: '', institution: '', year: '', score: '' });
      setShowAddEdu(false);
    }
  };

  const removeEducation = (id) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const handleAddCert = () => {
    if (newCert.name && newCert.issuer) {
      setCertifications([...certifications, { id: `cert-${Date.now()}`, ...newCert }]);
      setNewCert({ name: '', issuer: '', year: '' });
      setShowAddCert(false);
    }
  };

  const removeCert = (id) => {
    setCertifications(certifications.filter((c) => c.id !== id));
  };

  const handleAddLang = () => {
    if (newLang.name) {
      setLanguages([...languages, { id: `lang-${Date.now()}`, ...newLang }]);
      setNewLang({ name: '', level: 'Professional Working' });
      setShowAddLang(false);
    }
  };

  const removeLang = (id) => {
    setLanguages(languages.filter((l) => l.id !== id));
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <Stack gap="8">
          {/* 1. EDITORIAL HEADER BANNER & PROFILE COMPLETED METRIC */}
          <div className="rc-candidate-header-banner">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                minWidth: '280px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Avatar
                  name={personal.fullName || candidateName}
                  size="lg"
                  style={{
                    width: '84px',
                    height: '84px',
                    boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    background: '#059669',
                    color: '#ffffff',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                  }}
                >
                  <CheckCircle2 size={13} />
                </div>
              </div>

              <div>
                <span className="rc-candidate-eyebrow">SINGLE SOURCE OF TRUTH</span>
                <h1
                  className="rc-candidate-h1"
                  style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)' }}
                >
                  {personal.fullName || candidateName}
                </h1>
                <p className="rc-candidate-subtitle" style={{ marginTop: '2px' }}>
                  {personal.title || 'Software Engineer Candidate'} •{' '}
                  {personal.location || 'Bengaluru, India'}
                </p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <Badge variant="success" icon={<ShieldCheck size={13} />}>
                    Local Demo Profile
                  </Badge>
                  <Badge variant="info">{profileCompletion}% Complete</Badge>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Button
                variant="primary"
                onClick={handleSave}
                size="md"
                leftIcon={<Save size={17} />}
              >
                {targetJob ? `Save & Apply for ${targetJob.title}` : 'Save Profile Changes'}
              </Button>
            </div>
          </div>

          {/* First-Time Application Onboarding Callout */}
          {targetJob && (
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(240, 253, 250, 0.9) 100%)',
                border: '2px solid #a7f3d0',
                borderRadius: '16px',
                padding: '20px 24px',
                boxShadow: '0 10px 30px rgba(5, 150, 105, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    padding: '12px',
                    background: '#059669',
                    color: '#ffffff',
                    borderRadius: '12px',
                  }}
                >
                  <Sparkles size={24} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#047857',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    APPLICATION CHECKPOINT
                  </span>
                  <h3
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      margin: '2px 0 0',
                    }}
                  >
                    Confirm Profile Details to Apply for {targetJob.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#334155', margin: 0 }}>
                    Please verify your contact info, resume PDF, and skill tags below before
                    submitting your application.
                  </p>
                </div>
              </div>

              <Button variant="primary" onClick={handleSave} rightIcon={<ArrowRight size={16} />}>
                Proceed to Apply
              </Button>
            </div>
          )}

          {toastMsg && (
            <Toast type="success" message={toastMsg} onClose={() => setToastMsg(null)} />
          )}

          {/* MAIN 2-COLUMN DETAILED PROFILE LAYOUT */}
          <Grid cols="responsive-3" gap="6">
            {/* LEFT 2 COLUMNS: DETAILED SECTIONS */}
            <div className="rc-col-span-2-desktop">
              <Stack gap="6">
                {/* 1. PERSONAL & CONTACT DETAILS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          padding: '8px',
                          background: '#ecfdf5',
                          borderRadius: '10px',
                          color: '#059669',
                        }}
                      >
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                          Personal & Contact Information
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                          Used to prefill local application forms in this demo
                        </p>
                      </div>
                    </div>

                    <Grid cols="responsive-2" gap="4">
                      <Input
                        label="Full Name"
                        value={personal.fullName || ''}
                        onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                        leftIcon={<User size={16} color="#64748b" />}
                      />
                      <Input
                        label="Professional Title / Persona"
                        value={personal.title || ''}
                        onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                        leftIcon={<Briefcase size={16} color="#64748b" />}
                      />
                      <Input
                        label="Email Address"
                        value={personal.email || ''}
                        onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                        leftIcon={<Mail size={16} color="#64748b" />}
                      />
                      <Input
                        label="Phone Number"
                        value={personal.phone || ''}
                        onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                        leftIcon={<Phone size={16} color="#64748b" />}
                      />
                      <Input
                        label="Location / City"
                        value={personal.location || ''}
                        onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                        leftIcon={<MapPin size={16} color="#64748b" />}
                      />
                      <Input
                        label="Portfolio / GitHub Link"
                        value={personal.portfolioUrl || personal.githubUrl || ''}
                        onChange={(e) => setPersonal({ ...personal, portfolioUrl: e.target.value })}
                        leftIcon={<Globe size={16} color="#64748b" />}
                      />
                    </Grid>

                    <Textarea
                      label="Executive Summary / Professional Bio"
                      value={personal.bio || ''}
                      onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
                      rows={3}
                      placeholder="Brief overview of your technical expertise, career achievements, and professional interests..."
                    />
                  </Stack>
                </div>

                {/* 2. WORK EXPERIENCE & INTERNSHIPS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <Cluster justify="between" align="center">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            padding: '8px',
                            background: '#ecfdf5',
                            borderRadius: '10px',
                            color: '#059669',
                          }}
                        >
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                            Work Experience & Internships
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                            Full-time roles, internships, and relevant industry experience
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddExp(!showAddExp)}
                        leftIcon={<Plus size={16} />}
                      >
                        Add Position
                      </Button>
                    </Cluster>

                    {showAddExp && (
                      <div
                        style={{
                          background: 'rgba(236, 253, 245, 0.65)',
                          border: '1px solid #a7f3d0',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <Stack gap="3">
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Role Title (e.g. Frontend Intern)"
                              value={newExp.title}
                              onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                            />
                            <Input
                              placeholder="Company Name (e.g. Swiggy, Google)"
                              value={newExp.company}
                              onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                            />
                          </Grid>
                          <Input
                            placeholder="Employment Period (e.g. Jan 2025 - Present)"
                            value={newExp.period}
                            onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                          />
                          <Textarea
                            placeholder="Key responsibilities and achievements..."
                            value={newExp.description}
                            onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                            rows={2}
                          />
                          <Cluster justify="end" gap="2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddExp(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleAddExperience}>
                              Save Position
                            </Button>
                          </Cluster>
                        </Stack>
                      </div>
                    )}

                    {experience.length > 0 ? (
                      <Stack gap="3">
                        {experience.map((exp, idx) => (
                          <div
                            key={exp.id || idx}
                            style={{
                              background: 'rgba(248, 250, 252, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '14px',
                              padding: '18px 20px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: '12px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  margin: 0,
                                }}
                              >
                                {exp.title}
                              </h4>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  marginTop: '3px',
                                }}
                              >
                                <span
                                  style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}
                                >
                                  {exp.company}
                                </span>
                                <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                                  • {exp.period || exp.duration || '2025 - Present'}
                                </span>
                              </div>
                              {exp.description && (
                                <p
                                  style={{
                                    fontSize: '0.86rem',
                                    color: '#475569',
                                    marginTop: '8px',
                                    lineHeight: '1.5',
                                  }}
                                >
                                  {exp.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeExperience(exp.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '4px',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </Stack>
                    ) : (
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '16px',
                          padding: '28px 20px',
                          textAlign: 'center',
                          background: 'rgba(248, 250, 252, 0.7)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px',
                            background: '#f1f5f9',
                            borderRadius: '50%',
                            color: '#94a3b8',
                          }}
                        >
                          <Briefcase size={26} />
                        </div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '0.94rem',
                            fontWeight: 800,
                            color: '#334155',
                          }}
                        >
                          No Work Experience Listed Yet
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.82rem',
                            color: '#64748b',
                            maxWidth: '380px',
                          }}
                        >
                          Freshers and early career jobseekers can add internships, college tech
                          projects, or freelance work.
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAddExp(true)}
                          leftIcon={<Plus size={14} />}
                          style={{ marginTop: '6px' }}
                        >
                          Add Experience or Internship
                        </Button>
                      </div>
                    )}
                  </Stack>
                </div>

                {/* 3. KEY PROJECTS & PORTFOLIO SHOWCASE */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <Cluster justify="between" align="center">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            padding: '8px',
                            background: '#ecfdf5',
                            borderRadius: '10px',
                            color: '#059669',
                          }}
                        >
                          <FileCode size={20} />
                        </div>
                        <div>
                          <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                            Key Projects & Code Repositories
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                            Showcase practical applications, GitHub repos, and live deployed
                            software
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddProj(!showAddProj)}
                        leftIcon={<Plus size={16} />}
                      >
                        Add Project
                      </Button>
                    </Cluster>

                    {showAddProj && (
                      <div
                        style={{
                          background: 'rgba(236, 253, 245, 0.65)',
                          border: '1px solid #a7f3d0',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <Stack gap="3">
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Project Title (e.g. E-Commerce Microservices)"
                              value={newProj.title}
                              onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                            />
                            <Input
                              placeholder="Tech Stack (e.g. React, Node, Tailwind, Docker)"
                              value={newProj.tech}
                              onChange={(e) => setNewProj({ ...newProj, tech: e.target.value })}
                            />
                          </Grid>
                          <Input
                            placeholder="GitHub / Live Demo Link (e.g. https://github.com/...)"
                            value={newProj.link}
                            onChange={(e) => setNewProj({ ...newProj, link: e.target.value })}
                          />
                          <Textarea
                            placeholder="Project summary, technical challenges solved, and impact..."
                            value={newProj.description}
                            onChange={(e) =>
                              setNewProj({ ...newProj, description: e.target.value })
                            }
                            rows={2}
                          />
                          <Cluster justify="end" gap="2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddProj(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleAddProject}>
                              Save Project
                            </Button>
                          </Cluster>
                        </Stack>
                      </div>
                    )}

                    {projects.length > 0 ? (
                      <Grid cols="responsive-2" gap="4">
                        {projects.map((proj, idx) => (
                          <div
                            key={proj.id || idx}
                            style={{
                              background: 'rgba(248, 250, 252, 0.9)',
                              border: '1px solid #e2e8f0',
                              borderRadius: '14px',
                              padding: '18px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <h4
                                style={{
                                  fontSize: '0.96rem',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  margin: 0,
                                }}
                              >
                                {proj.title}
                              </h4>
                              <button
                                onClick={() => removeProject(proj.id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p
                              style={{
                                fontSize: '0.82rem',
                                color: '#475569',
                                margin: 0,
                                lineHeight: '1.4',
                              }}
                            >
                              {proj.description || proj.summary}
                            </p>
                            {proj.tech && (
                              <div
                                style={{
                                  fontSize: '0.76rem',
                                  color: '#047857',
                                  fontWeight: 700,
                                  background: '#ecfdf5',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  width: 'fit-content',
                                }}
                              >
                                Tech: {proj.tech}
                              </div>
                            )}
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: '0.8rem',
                                  color: '#0284c7',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  marginTop: '4px',
                                  fontWeight: 600,
                                }}
                              >
                                View Project / Repo <ExternalLink size={13} />
                              </a>
                            )}
                          </div>
                        ))}
                      </Grid>
                    ) : (
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '16px',
                          padding: '28px 20px',
                          textAlign: 'center',
                          background: 'rgba(248, 250, 252, 0.7)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            padding: '10px',
                            background: '#f1f5f9',
                            borderRadius: '50%',
                            color: '#94a3b8',
                          }}
                        >
                          <FileCode size={26} />
                        </div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '0.94rem',
                            fontWeight: 800,
                            color: '#334155',
                          }}
                        >
                          No Projects Listed Yet
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.82rem',
                            color: '#64748b',
                            maxWidth: '380px',
                          }}
                        >
                          Add your personal software applications or academic capstone repos to
                          showcase proof of work.
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAddProj(true)}
                          leftIcon={<Plus size={14} />}
                          style={{ marginTop: '6px' }}
                        >
                          Add Project
                        </Button>
                      </div>
                    )}
                  </Stack>
                </div>

                {/* 4. TECHNICAL & SOFT SKILLS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          padding: '8px',
                          background: '#ecfdf5',
                          borderRadius: '10px',
                          color: '#059669',
                        }}
                      >
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                          Technical & Soft Skills
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                          Keywords compared against role requirements for local fit insights
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Input
                        placeholder="Add a skill (e.g. Docker, GraphQL, Kubernetes)"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        style={{ maxWidth: '320px' }}
                      />
                      <Button variant="secondary" onClick={addSkill} leftIcon={<Plus size={16} />}>
                        Add Skill Tag
                      </Button>
                    </div>

                    <div>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#475569',
                          marginBottom: '8px',
                          display: 'block',
                        }}
                      >
                        Active Skills ({skills.length}):
                      </span>
                      <Cluster gap="2">
                        {skills.map((sk) => (
                          <Tag key={sk} onRemove={() => removeSkill(sk)}>
                            {sk}
                          </Tag>
                        ))}
                      </Cluster>
                    </div>
                  </Stack>
                </div>

                {/* 5. EDUCATION BACKGROUND */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <Cluster justify="between" align="center">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            padding: '8px',
                            background: '#ecfdf5',
                            borderRadius: '10px',
                            color: '#059669',
                          }}
                        >
                          <GraduationCap size={20} />
                        </div>
                        <div>
                          <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                            Education & Academic Credentials
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                            Degrees, universities, graduation cohorts, and academic scores
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddEdu(!showAddEdu)}
                        leftIcon={<Plus size={16} />}
                      >
                        Add Education
                      </Button>
                    </Cluster>

                    {showAddEdu && (
                      <div
                        style={{
                          background: 'rgba(236, 253, 245, 0.65)',
                          border: '1px solid #a7f3d0',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <Stack gap="3">
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Degree (e.g. B.Tech Computer Science)"
                              value={newEdu.degree}
                              onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                            />
                            <Input
                              placeholder="Institution (e.g. Anna University)"
                              value={newEdu.institution}
                              onChange={(e) =>
                                setNewEdu({ ...newEdu, institution: e.target.value })
                              }
                            />
                          </Grid>
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Graduation Year (e.g. 2026)"
                              value={newEdu.year}
                              onChange={(e) => setNewEdu({ ...newEdu, year: e.target.value })}
                            />
                            <Input
                              placeholder="CGPA / Score (e.g. 8.8 / 10)"
                              value={newEdu.score}
                              onChange={(e) => setNewEdu({ ...newEdu, score: e.target.value })}
                            />
                          </Grid>
                          <Cluster justify="end" gap="2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddEdu(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleAddEducation}>
                              Save Education
                            </Button>
                          </Cluster>
                        </Stack>
                      </div>
                    )}

                    <Stack gap="3">
                      {education.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          style={{
                            background: 'rgba(248, 250, 252, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '14px',
                            padding: '18px 20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: '1rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                margin: 0,
                              }}
                            >
                              {edu.degree}
                            </h4>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '3px',
                              }}
                            >
                              <span
                                style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}
                              >
                                {edu.institution}
                              </span>
                              <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                                • Class of {edu.year || '2026'}
                              </span>
                            </div>
                            {edu.score && (
                              <div
                                style={{
                                  marginTop: '6px',
                                  fontSize: '0.78rem',
                                  color: '#475569',
                                  fontWeight: 600,
                                }}
                              >
                                Academic Score: {edu.score}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeEducation(edu.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </Stack>
                  </Stack>
                </div>

                {/* 6. CERTIFICATIONS & INDUSTRY CREDENTIALS */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <Cluster justify="between" align="center">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            padding: '8px',
                            background: '#ecfdf5',
                            borderRadius: '10px',
                            color: '#059669',
                          }}
                        >
                          <Award size={20} />
                        </div>
                        <div>
                          <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                            Certifications & Industry Credentials
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                            Accredited technical certifications and professional licensures
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddCert(!showAddCert)}
                        leftIcon={<Plus size={16} />}
                      >
                        Add Certification
                      </Button>
                    </Cluster>

                    {showAddCert && (
                      <div
                        style={{
                          background: 'rgba(236, 253, 245, 0.65)',
                          border: '1px solid #a7f3d0',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <Stack gap="3">
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Certification Name (e.g. AWS Solutions Architect)"
                              value={newCert.name}
                              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                            />
                            <Input
                              placeholder="Issuing Body (e.g. Amazon Web Services, Google)"
                              value={newCert.issuer}
                              onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                            />
                          </Grid>
                          <Input
                            placeholder="Issue Year (e.g. 2025)"
                            value={newCert.year}
                            onChange={(e) => setNewCert({ ...newCert, year: e.target.value })}
                            style={{ maxWidth: '240px' }}
                          />
                          <Cluster justify="end" gap="2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddCert(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleAddCert}>
                              Save Certification
                            </Button>
                          </Cluster>
                        </Stack>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {certifications.map((c) => (
                        <div
                          key={c.id}
                          style={{
                            background: 'rgba(248, 250, 252, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                padding: '8px',
                                background: '#ecfdf5',
                                borderRadius: '8px',
                                color: '#059669',
                              }}
                            >
                              <Award size={18} />
                            </div>
                            <div>
                              <h4
                                style={{
                                  fontSize: '0.94rem',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  margin: 0,
                                }}
                              >
                                {c.name}
                              </h4>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                {c.issuer} • Issued {c.year}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCert(c.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Stack>
                </div>

                {/* 7. LANGUAGES & COMMUNICATION */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '20px',
                    padding: '26px',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                  }}
                >
                  <Stack gap="4">
                    <Cluster justify="between" align="center">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            padding: '8px',
                            background: '#ecfdf5',
                            borderRadius: '10px',
                            color: '#059669',
                          }}
                        >
                          <Languages size={20} />
                        </div>
                        <div>
                          <h3 className="rc-h3" style={{ margin: 0, fontSize: '1.2rem' }}>
                            Languages & Proficiency
                          </h3>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                            Spoken and written communication languages
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddLang(!showAddLang)}
                        leftIcon={<Plus size={16} />}
                      >
                        Add Language
                      </Button>
                    </Cluster>

                    {showAddLang && (
                      <div
                        style={{
                          background: 'rgba(236, 253, 245, 0.65)',
                          border: '1px solid #a7f3d0',
                          borderRadius: '16px',
                          padding: '20px',
                        }}
                      >
                        <Stack gap="3">
                          <Grid cols="responsive-2" gap="3">
                            <Input
                              placeholder="Language (e.g. German, Japanese)"
                              value={newLang.name}
                              onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                            />
                            <Input
                              placeholder="Proficiency (e.g. Professional Working, Conversational)"
                              value={newLang.level}
                              onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                            />
                          </Grid>
                          <Cluster justify="end" gap="2">
                            <Button variant="ghost" size="sm" onClick={() => setShowAddLang(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleAddLang}>
                              Save Language
                            </Button>
                          </Cluster>
                        </Stack>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {languages.map((l) => (
                        <div
                          key={l.id}
                          style={{
                            background: 'rgba(248, 250, 252, 0.9)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <div>
                            <span
                              style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}
                            >
                              {l.name}
                            </span>
                            <span
                              style={{
                                fontSize: '0.74rem',
                                color: '#059669',
                                fontWeight: 700,
                                marginLeft: '6px',
                                background: '#ecfdf5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {l.level}
                            </span>
                          </div>
                          <button
                            onClick={() => removeLang(l.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '2px',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </Stack>
                </div>
              </Stack>
            </div>

            {/* RIGHT COLUMN: RESUME CARD, COMPLETION RATE & READINESS CHECK */}
            <Stack gap="6">
              {/* PRIMARY RESUME DOCUMENT CARD */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow:
                    '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                <Stack gap="4">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <h3 className="rc-h3" style={{ fontSize: '1.15rem', margin: 0 }}>
                      Primary Active Resume
                    </h3>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#059669',
                        background: '#ecfdf5',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      Active
                    </span>
                  </div>

                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.85) 100%)',
                      border: '1px solid #cbd5e1',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        padding: '14px',
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        borderRadius: '50%',
                        color: '#059669',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)',
                      }}
                    >
                      <FileText size={32} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: '0.98rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          margin: 0,
                        }}
                      >
                        {resume.fileName}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#64748b',
                          marginTop: '4px',
                          margin: 0,
                        }}
                      >
                        Uploaded {resume.uploadedDate || 'Recently'} • {resume.fileSize || '240 KB'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '4px' }}>
                      <label
                        style={{
                          flex: 1,
                          background: '#059669',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                        }}
                      >
                        <Upload size={15} /> Replace PDF
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                      </label>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/candidate/resume')}
                        rightIcon={<ArrowRight size={14} />}
                      >
                        Resume Hub
                      </Button>
                    </div>
                  </div>
                </Stack>
              </div>

              {/* PROFILE COMPLETION METER */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.48)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow:
                    '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                <Stack gap="3">
                  <Cluster justify="between" align="center">
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      Profile Completeness
                    </h4>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#059669' }}>
                      {profileCompletion}%
                    </span>
                  </Cluster>
                  <Progress value={profileCompletion} showLabel={false} />
                  <p
                    className="rc-small"
                    style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}
                  >
                    A more complete profile improves your local role-fit and readiness insights.
                  </p>
                </Stack>
              </div>

              {/* INTEGRATED RESUME READINESS CHECK CARD */}
              <AtsTesterCard
                candidateUser={{ personal, education, experience, projects, skills, resume }}
              />
            </Stack>
          </Grid>
        </Stack>

        {/* Application Modal Popup when confirming onboarding */}
        {selectedJobToApply && (
          <ApplicationModal
            job={selectedJobToApply}
            isOpen={!!selectedJobToApply}
            onClose={() => {
              setSelectedJobToApply(null);
              navigate('/candidate/applications');
            }}
          />
        )}
      </PageContainer>
    </Section>
  );
}
