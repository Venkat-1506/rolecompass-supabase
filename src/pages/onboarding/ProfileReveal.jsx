import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderCheck,
  Target,
  Edit2,
  Plus,
  Trash2,
  Check,
  X,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';

export function ProfileReveal() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, completeProfile } = useApp();
  const [activeSection, setActiveSection] = useState('personal');

  // Edit States for Sections
  const [editingSection, setEditingSection] = useState(null); // 'personal', 'experience', 'education', 'skills', 'projects', 'preferences' or null

  // Draft Data States for Editing
  const [personalDraft, setPersonalDraft] = useState({});
  const [skillsDraft, setSkillsDraft] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [preferencesDraft, setPreferencesDraft] = useState({});

  // Item Modal/Inline Add Form States
  const [showItemModal, setShowItemModal] = useState(null); // 'experience', 'education', 'project' or null
  const [itemForm, setItemForm] = useState({});

  const sections = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: FolderCheck },
    { id: 'preferences', label: 'Career Preferences', icon: Target },
  ];

  // Current Profile Derived Data
  const profile = currentUser?.profile || {};
  const personal = profile.personal || {
    fullName: currentUser?.fullName || 'Arjun Verma',
    email: currentUser?.email || 'arjun.verma@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    headline: 'Frontend Engineer & React Developer',
  };

  const experience = profile.experience || [
    {
      id: 'exp-1',
      company: 'TechCorp Solutions',
      role: 'Software Engineer Intern',
      location: 'Bengaluru, India',
      startDate: 'Jun 2025',
      endDate: 'Present',
      current: true,
      description: 'Developed responsive user interfaces with React and CSS. Integrated REST APIs.',
    },
  ];

  const education = profile.education || [
    {
      id: 'edu-1',
      institution: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science & Engineering',
      field: 'Computer Science',
      startYear: '2021',
      endYear: '2025',
      score: 'CGPA: 8.8 / 10',
    },
  ];

  const skills = profile.skills?.length
    ? profile.skills
    : ['React.js', 'JavaScript (ES6+)', 'Node.js', 'HTML5 & CSS3', 'TailwindCSS', 'Git / GitHub'];

  const projects = profile.projects || [
    {
      id: 'proj-1',
      name: 'RoleCompass Job Platform',
      description: 'Built a career navigation demo with local resume readiness checks.',
      technologies: 'React, JavaScript, Vite, CSS',
      url: 'https://github.com/rolecompass/platform',
    },
  ];

  const preferences = profile.preferences || {
    preferredRoles: profile.preferences?.preferredRoles || [
      'Frontend Developer',
      'Full Stack Engineer',
    ],
    preferredLocations: profile.preferences?.preferredLocations || ['Bengaluru', 'Remote'],
    workMode: profile.preferences?.workMode || 'Hybrid',
    employmentType: profile.preferences?.employmentType || 'Full-time',
    targetSalaryRange: profile.preferences?.targetSalaryRange || '₹8,00,000 - ₹12,00,000 / year',
  };

  // HANDLERS FOR SECTION EDITING
  const startEditSection = (sectionId) => {
    setEditingSection(sectionId);
    if (sectionId === 'personal') setPersonalDraft({ ...personal });
    if (sectionId === 'skills') setSkillsDraft([...skills]);
    if (sectionId === 'preferences') {
      setPreferencesDraft({
        preferredRoles: Array.isArray(preferences.preferredRoles)
          ? preferences.preferredRoles.join(', ')
          : preferences.preferredRoles || '',
        preferredLocations: Array.isArray(preferences.preferredLocations)
          ? preferences.preferredLocations.join(', ')
          : preferences.preferredLocations || '',
        workMode: preferences.workMode || 'Hybrid',
        employmentType: preferences.employmentType || 'Full-time',
        targetSalaryRange: preferences.targetSalaryRange || '₹8,00,000 - ₹12,00,000 / year',
      });
    }
  };

  const savePersonalSection = () => {
    updateProfile({ personal: personalDraft });
    setEditingSection(null);
  };

  const saveSkillsSection = () => {
    updateProfile({ skills: skillsDraft });
    setEditingSection(null);
  };

  const savePreferencesSection = () => {
    const rolesArr =
      typeof preferencesDraft.preferredRoles === 'string'
        ? preferencesDraft.preferredRoles
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : preferencesDraft.preferredRoles;
    const locsArr =
      typeof preferencesDraft.preferredLocations === 'string'
        ? preferencesDraft.preferredLocations
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : preferencesDraft.preferredLocations;

    updateProfile({
      preferences: {
        preferredRoles: rolesArr,
        preferredLocations: locsArr,
        workMode: preferencesDraft.workMode,
        employmentType: preferencesDraft.employmentType,
        targetSalaryRange: preferencesDraft.targetSalaryRange,
      },
    });
    setEditingSection(null);
  };

  // SKILL ACTIONS
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (trimmed && !skillsDraft.includes(trimmed)) {
      setSkillsDraft([...skillsDraft, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsDraft(skillsDraft.filter((s) => s !== skillToRemove));
  };

  // EXPERIENCE ACTIONS
  const handleRemoveExperience = (id) => {
    const updated = experience.filter((item) => item.id !== id);
    updateProfile({ experience: updated });
  };

  // EDUCATION ACTIONS
  const handleRemoveEducation = (id) => {
    const updated = education.filter((item) => item.id !== id);
    updateProfile({ education: updated });
  };

  // PROJECT ACTIONS
  const handleRemoveProject = (id) => {
    const updated = projects.filter((item) => item.id !== id);
    updateProfile({ projects: updated });
  };

  // SAVE ITEM FORM (Modal/Inline Form for Add Experience/Education/Project)
  const handleSaveItemForm = (type) => {
    if (type === 'experience') {
      const newItem = {
        id: itemForm.id || `exp-${Date.now()}`,
        company: itemForm.company || 'Company Name',
        role: itemForm.role || 'Job Role',
        location: itemForm.location || 'Location',
        startDate: itemForm.startDate || '2024',
        endDate: itemForm.current ? 'Present' : itemForm.endDate || '2025',
        current: !!itemForm.current,
        description: itemForm.description || '',
      };
      const existing = experience.filter((i) => i.id !== newItem.id);
      updateProfile({ experience: [...existing, newItem] });
    }

    if (type === 'education') {
      const newItem = {
        id: itemForm.id || `edu-${Date.now()}`,
        institution: itemForm.institution || 'University / Institution',
        degree: itemForm.degree || 'Degree / Certificate',
        field: itemForm.field || 'Field of Study',
        startYear: itemForm.startYear || '2021',
        endYear: itemForm.endYear || '2025',
        score: itemForm.score || '',
      };
      const existing = education.filter((i) => i.id !== newItem.id);
      updateProfile({ education: [...existing, newItem] });
    }

    if (type === 'project') {
      const newItem = {
        id: itemForm.id || `proj-${Date.now()}`,
        name: itemForm.name || 'Project Name',
        description: itemForm.description || 'Project Description',
        technologies: itemForm.technologies || 'React, JavaScript',
        url: itemForm.url || '',
      };
      const existing = projects.filter((i) => i.id !== newItem.id);
      updateProfile({ projects: [...existing, newItem] });
    }

    setShowItemModal(null);
    setItemForm({});
  };

  const handleConfirm = () => {
    completeProfile();
    navigate('/onboarding/complete');
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="lg">
        <OnboardingProgress currentStep="review" variant="resume" />

        {/* HEADER AREA WITH MATCH SCORE BADGE */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#059669',
                background: 'rgba(236, 253, 245, 0.85)',
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(167, 243, 208, 0.8)',
                marginBottom: '8px',
              }}
            >
              RESUME CONVERTED TO PROFILE
            </div>
            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Review Your Extracted Profile
            </h1>
          </div>

          <div
            style={{
              background: 'rgba(236, 253, 245, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(167, 243, 208, 0.9)',
              borderRadius: '16px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.1)',
            }}
          >
            <Sparkles size={22} color="#059669" />
            <div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                Extraction Confidence
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#059669' }}>
                {currentUser?.resume?.fileName
                  ? `Extracted • ${profile.confidenceScore || 92}% Accuracy`
                  : 'Profile Extracted'}
              </div>
            </div>
          </div>
        </div>

        {/* RESUME META BAR */}
        {currentUser?.resume?.fileName && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '16px',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={18} color="#059669" />
              <span style={{ fontWeight: '800', color: '#0f172a' }}>Active Resume:</span>
              <span style={{ color: '#475569', fontWeight: '600' }}>
                {currentUser.resume.fileName} ({currentUser.resume.fileSize || 'Attached'})
              </span>
            </div>
            <button
              onClick={() => navigate('/onboarding/resume-upload')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#059669',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Upload Different Resume
            </button>
          </div>
        )}

        {/* MAIN PROFILE WORKSPACE GRID */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 280px) 1fr', gap: '32px' }}
        >
          {/* LEFT: SECTION NAVIGATION */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              height: 'fit-content',
            }}
          >
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? '#059669' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={18} />
                  <span>{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT: STRUCTURED PROFILE CONTENT PANEL */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '24px',
              padding: '36px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            {/* 1. PERSONAL DETAILS SECTION */}
            {(activeSection === 'personal' || activeSection === 'all') && (
              <div id="section-personal">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <User size={20} color="#059669" /> Personal Details
                  </h3>
                  {editingSection !== 'personal' ? (
                    <button
                      onClick={() => startEditSection('personal')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit2 size={14} /> Edit Section
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={savePersonalSection}
                        style={{
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        style={{
                          background: 'rgba(226, 232, 240, 0.8)',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editingSection === 'personal' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={personalDraft.fullName || ''}
                        onChange={(e) =>
                          setPersonalDraft({ ...personalDraft, fullName: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={personalDraft.email || ''}
                        onChange={(e) =>
                          setPersonalDraft({ ...personalDraft, email: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={personalDraft.phone || ''}
                        onChange={(e) =>
                          setPersonalDraft({ ...personalDraft, phone: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        value={personalDraft.location || ''}
                        onChange={(e) =>
                          setPersonalDraft({ ...personalDraft, location: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        value={personalDraft.headline || ''}
                        onChange={(e) =>
                          setPersonalDraft({ ...personalDraft, headline: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Full Name
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {personal.fullName || 'Not provided'}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Email Address
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {personal.email || 'Not provided'}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Phone
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {personal.phone || 'Not provided'}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Location
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {personal.location || 'Not provided'}
                      </div>
                    </div>

                    <div
                      style={{
                        gridColumn: '1 / -1',
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Professional Headline
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {personal.headline || 'Not provided'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. EXPERIENCE SECTION */}
            {(activeSection === 'experience' || activeSection === 'all') && (
              <div id="section-experience">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Briefcase size={20} color="#059669" /> Experience
                  </h3>
                  <button
                    onClick={() => {
                      setItemForm({
                        company: '',
                        role: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        current: false,
                        description: '',
                      });
                      setShowItemModal('experience');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={16} /> Add Experience
                  </button>
                </div>

                {experience.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(248, 250, 252, 0.7)',
                      padding: '24px',
                      borderRadius: '14px',
                      border: '1px dashed #cbd5e1',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                      No work experience added yet. Experience is optional for student and fresher
                      profiles.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {experience.map((exp) => (
                      <div
                        key={exp.id || exp.company}
                        style={{
                          background: 'rgba(248, 250, 252, 0.8)',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                            {exp.role || exp.title}
                          </div>
                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: '700',
                              color: '#059669',
                              marginTop: '2px',
                            }}
                          >
                            {exp.company} {exp.location ? `• ${exp.location}` : ''}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </div>
                          {exp.description && (
                            <p
                              style={{
                                fontSize: '0.85rem',
                                color: '#334155',
                                marginTop: '8px',
                                lineHeight: '1.4',
                              }}
                            >
                              {exp.description}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setItemForm({ ...exp });
                              setShowItemModal('experience');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveExperience(exp.id)}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. EDUCATION SECTION */}
            {(activeSection === 'education' || activeSection === 'all') && (
              <div id="section-education">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <GraduationCap size={20} color="#059669" /> Education
                  </h3>
                  <button
                    onClick={() => {
                      setItemForm({
                        institution: '',
                        degree: '',
                        field: '',
                        startYear: '',
                        endYear: '',
                        score: '',
                      });
                      setShowItemModal('education');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={16} /> Add Education
                  </button>
                </div>

                {education.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(248, 250, 252, 0.7)',
                      padding: '24px',
                      borderRadius: '14px',
                      border: '1px dashed #cbd5e1',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                      No education records added yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {education.map((edu) => (
                      <div
                        key={edu.id || edu.institution}
                        style={{
                          background: 'rgba(248, 250, 252, 0.8)',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                            {edu.degree}
                          </div>
                          <div
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: '700',
                              color: '#059669',
                              marginTop: '2px',
                            }}
                          >
                            {edu.institution || edu.institute} {edu.field ? `(${edu.field})` : ''}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                            {edu.startYear || edu.year} {edu.endYear ? `– ${edu.endYear}` : ''}{' '}
                            {edu.score ? `• ${edu.score}` : ''}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setItemForm({ ...edu });
                              setShowItemModal('education');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveEducation(edu.id)}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SKILLS SECTION */}
            {(activeSection === 'skills' || activeSection === 'all') && (
              <div id="section-skills">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Code size={20} color="#059669" /> Extracted Skills
                  </h3>
                  {editingSection !== 'skills' ? (
                    <button
                      onClick={() => startEditSection('skills')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit2 size={14} /> Edit Skills
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={saveSkillsSection}
                        style={{
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={14} /> Save Skills
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        style={{
                          background: 'rgba(226, 232, 240, 0.8)',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editingSection === 'skills' ? (
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <input
                        type="text"
                        placeholder="Add a new skill (e.g. Python, SQL, Docker)..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddSkill();
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                      <button
                        onClick={() => handleAddSkill()}
                        style={{
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          padding: '0 18px',
                          borderRadius: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        Add
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {skillsDraft.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: '#059669',
                            background: 'rgba(236, 253, 245, 0.95)',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            border: '1px solid rgba(167, 243, 208, 0.9)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          {skill}
                          <X
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          color: '#059669',
                          background: 'rgba(236, 253, 245, 0.95)',
                          padding: '6px 14px',
                          borderRadius: '10px',
                          border: '1px solid rgba(167, 243, 208, 0.9)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. PROJECTS SECTION */}
            {(activeSection === 'projects' || activeSection === 'all') && (
              <div id="section-projects">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FolderCheck size={20} color="#059669" /> Projects
                  </h3>
                  <button
                    onClick={() => {
                      setItemForm({ name: '', description: '', technologies: '', url: '' });
                      setShowItemModal('project');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Plus size={16} /> Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div
                    style={{
                      background: 'rgba(248, 250, 252, 0.7)',
                      padding: '24px',
                      borderRadius: '14px',
                      border: '1px dashed #cbd5e1',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>
                      No projects added yet.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {projects.map((proj) => (
                      <div
                        key={proj.id || proj.name}
                        style={{
                          background: 'rgba(248, 250, 252, 0.8)',
                          padding: '16px 20px',
                          borderRadius: '14px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a' }}>
                            {proj.name || proj.title}
                          </div>
                          <p
                            style={{
                              fontSize: '0.85rem',
                              color: '#475569',
                              marginTop: '4px',
                              lineHeight: '1.4',
                            }}
                          >
                            {proj.description || proj.desc}
                          </p>
                          {proj.technologies && (
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: '#059669',
                                fontWeight: '700',
                                marginTop: '6px',
                              }}
                            >
                              Technologies:{' '}
                              {Array.isArray(proj.technologies)
                                ? proj.technologies.join(', ')
                                : proj.technologies}
                            </div>
                          )}
                          {proj.url && (
                            <a
                              href={proj.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '0.78rem',
                                color: '#2563eb',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginTop: '4px',
                              }}
                            >
                              {proj.url}
                            </a>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setItemForm({ ...proj });
                              setShowItemModal('project');
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleRemoveProject(proj.id)}
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. CAREER PREFERENCES SECTION */}
            {(activeSection === 'preferences' || activeSection === 'all') && (
              <div id="section-preferences">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Target size={20} color="#059669" /> Career Preferences
                  </h3>
                  {editingSection !== 'preferences' ? (
                    <button
                      onClick={() => startEditSection('preferences')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#059669',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit2 size={14} /> Edit Preferences
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={savePreferencesSection}
                        style={{
                          background: '#059669',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={14} /> Save
                      </button>
                      <button
                        onClick={() => setEditingSection(null)}
                        style={{
                          background: 'rgba(226, 232, 240, 0.8)',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {editingSection === 'preferences' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Preferred Roles (comma separated)
                      </label>
                      <input
                        type="text"
                        value={preferencesDraft.preferredRoles || ''}
                        onChange={(e) =>
                          setPreferencesDraft({
                            ...preferencesDraft,
                            preferredRoles: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Preferred Locations
                      </label>
                      <input
                        type="text"
                        value={preferencesDraft.preferredLocations || ''}
                        onChange={(e) =>
                          setPreferencesDraft({
                            ...preferencesDraft,
                            preferredLocations: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                        }}
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Work Mode
                      </label>
                      <select
                        value={preferencesDraft.workMode || 'Hybrid'}
                        onChange={(e) =>
                          setPreferencesDraft({ ...preferencesDraft, workMode: e.target.value })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          background: '#fff',
                        }}
                      >
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          fontWeight: '700',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        Employment Type
                      </label>
                      <select
                        value={preferencesDraft.employmentType || 'Full-time'}
                        onChange={(e) =>
                          setPreferencesDraft({
                            ...preferencesDraft,
                            employmentType: e.target.value,
                          })
                        }
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          background: '#fff',
                        }}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Preferred Roles
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {Array.isArray(preferences.preferredRoles)
                          ? preferences.preferredRoles.join(', ')
                          : preferences.preferredRoles ||
                            preferences.targetRoles ||
                            'Frontend Developer'}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Preferred Locations
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {Array.isArray(preferences.preferredLocations)
                          ? preferences.preferredLocations.join(', ')
                          : preferences.preferredLocations || 'Bengaluru, Remote'}
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(248, 250, 252, 0.7)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600' }}>
                        Work Mode & Type
                      </div>
                      <div
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          marginTop: '2px',
                        }}
                      >
                        {preferences.workMode || 'Hybrid'} •{' '}
                        {preferences.employmentType || 'Full-time'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CONFIRM CTA */}
            <div
              style={{
                borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                paddingTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleConfirm}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1rem',
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Confirm & Complete Profile <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* MODAL FORM FOR ADDING EXPERIENCE / EDUCATION / PROJECT */}
      {showItemModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px 32px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '16px',
              }}
            >
              {itemForm.id ? 'Edit' : 'Add'}{' '}
              {showItemModal.charAt(0).toUpperCase() + showItemModal.slice(1)}
            </h3>

            {showItemModal === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Job Role / Title (e.g. Frontend Developer)"
                  value={itemForm.role || ''}
                  onChange={(e) => setItemForm({ ...itemForm, role: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <input
                  type="text"
                  placeholder="Company Name (e.g. TechCorp)"
                  value={itemForm.company || ''}
                  onChange={(e) => setItemForm({ ...itemForm, company: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <input
                  type="text"
                  placeholder="Location (e.g. Bengaluru, Remote)"
                  value={itemForm.location || ''}
                  onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Start Date (e.g. Jun 2024)"
                    value={itemForm.startDate || ''}
                    onChange={(e) => setItemForm({ ...itemForm, startDate: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="End Date (e.g. Present)"
                    value={itemForm.endDate || ''}
                    onChange={(e) => setItemForm({ ...itemForm, endDate: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
                <textarea
                  placeholder="Brief description of responsibilities and achievements..."
                  rows={3}
                  value={itemForm.description || ''}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            )}

            {showItemModal === 'education' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech in CSE)"
                  value={itemForm.degree || ''}
                  onChange={(e) => setItemForm({ ...itemForm, degree: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <input
                  type="text"
                  placeholder="Institution (e.g. National Institute of Technology)"
                  value={itemForm.institution || ''}
                  onChange={(e) => setItemForm({ ...itemForm, institution: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Start Year (2021)"
                    value={itemForm.startYear || ''}
                    onChange={(e) => setItemForm({ ...itemForm, startYear: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                  <input
                    type="text"
                    placeholder="End Year (2025)"
                    value={itemForm.endYear || ''}
                    onChange={(e) => setItemForm({ ...itemForm, endYear: e.target.value })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Score / Grade (e.g. CGPA: 8.8 / 10)"
                  value={itemForm.score || ''}
                  onChange={(e) => setItemForm({ ...itemForm, score: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
              </div>
            )}

            {showItemModal === 'project' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Project Name (e.g. RoleCompass)"
                  value={itemForm.name || ''}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <textarea
                  placeholder="Short description of your project..."
                  rows={3}
                  value={itemForm.description || ''}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontFamily: 'inherit',
                  }}
                />
                <input
                  type="text"
                  placeholder="Technologies (e.g. React, JavaScript, Vite)"
                  value={itemForm.technologies || ''}
                  onChange={(e) => setItemForm({ ...itemForm, technologies: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <input
                  type="text"
                  placeholder="Project URL (e.g. https://github.com/myrepo)"
                  value={itemForm.url || ''}
                  onChange={(e) => setItemForm({ ...itemForm, url: e.target.value })}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <button
                onClick={() => setShowItemModal(null)}
                style={{
                  background: 'rgba(226, 232, 240, 0.8)',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItemForm(showItemModal)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  cursor: 'pointer',
                }}
              >
                Save {showItemModal.charAt(0).toUpperCase() + showItemModal.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
