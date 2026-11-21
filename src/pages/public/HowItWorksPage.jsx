import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Cluster } from '../../components/layout/Cluster.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import {
  Target,
  BookOpen,
  Send,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  ChevronDown,
  Zap,
  FileText,
  Cpu,
  BarChart3,
  Check,
} from 'lucide-react';
import '../../styles/motion.css';
import '../../styles/glass.css';

export function HowItWorksPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [selectedSimRole, setSelectedSimRole] = useState('Full Stack Developer');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulated Roles Data for Interactive Demo Widget
  const simRoles = {
    'Full Stack Developer': {
      fitScore: 92,
      matched: ['React.js', 'Node.js', 'TypeScript', 'REST APIs', 'Git'],
      missing: ['GraphQL', 'Docker'],
      salary: '$110,000 - $145,000/yr',
      demand: 'High Demand (1.2k+ jobs open)',
    },
    'UI/UX Designer': {
      fitScore: 85,
      matched: ['Figma', 'Wireframing', 'User Research', 'Design Systems'],
      missing: ['Prototyping in Framer', 'Usability Testing'],
      salary: '$95,000 - $130,000/yr',
      demand: 'Very High Demand',
    },
    'Data Scientist': {
      fitScore: 78,
      matched: ['Python', 'SQL', 'Data Visualization', 'Pandas'],
      missing: ['PyTorch / ML', 'BigQuery', 'A/B Testing'],
      salary: '$120,000 - $160,000/yr',
      demand: 'Rapid Growth',
    },
    'Product Manager': {
      fitScore: 88,
      matched: ['Agile / Scrum', 'Roadmapping', 'User Stories', 'Analytics'],
      missing: ['SQL Queries', 'Technical Specs'],
      salary: '$125,000 - $165,000/yr',
      demand: 'High Demand',
    },
  };

  const candidateStages = [
    {
      num: '01',
      id: 'profile',
      title: 'Profile & Resume Preview',
      tagline: 'Local Demo Profile Setup',
      icon: <FileText size={22} color="#059669" />,
      color: '#059669',
      bg: 'rgba(236, 253, 245, 0.7)',
      border: 'rgba(167, 243, 208, 0.8)',
      description:
        'Upload a resume or build your candidate profile in the demo flow. The app prepares a local profile preview from sample data; it does not read or verify the uploaded file.',
      highlights: [
        'Local demo resume profile preview',
        'Custom career path preference tags',
        'Privacy-first local profile control',
      ],
      demoWidget: (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                background: '#ecfdf5',
                color: '#059669',
                padding: '10px',
                borderRadius: '12px',
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a' }}>
                Resume Intelligence Engine
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '600' }}>
                ✓ 18 Competencies Parsed
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'React.js',
              'TypeScript',
              'Node.js',
              'System Architecture',
              'UI Engineering',
              'PostgreSQL',
            ].map((s) => (
              <span
                key={s}
                style={{
                  background: 'rgba(240, 253, 244, 0.85)',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: '600',
                }}
              >
                ✓ {s}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: '02',
      id: 'match',
      title: 'Role Fit & Skill Gap Analysis',
      tagline: 'Data-Driven Compatibility Matching',
      icon: <Target size={22} color="#0284c7" />,
      color: '#0284c7',
      bg: 'rgba(240, 249, 255, 0.7)',
      border: 'rgba(186, 230, 253, 0.8)',
      description:
        'Compare your profile against sample tech and business roles. RoleCompass calculates an instant local Fit Score breakdown showing matched skills versus specific missing competencies.',
      highlights: [
        'Percentage compatibility fit score',
        'Side-by-side required vs matched skills',
        'Clear identification of skill growth areas',
      ],
      demoWidget: (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
              Role Fit Assessment
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0284c7' }}>
              88% Match
            </span>
          </div>
          <div
            style={{
              height: '8px',
              background: '#e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '88%',
                height: '100%',
                background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
              }}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '0.82rem',
            }}
          >
            <div
              style={{
                background: 'rgba(240, 249, 255, 0.8)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #bae6fd',
              }}
            >
              <div style={{ fontWeight: '700', color: '#0369a1', marginBottom: '4px' }}>
                Matched (8)
              </div>
              <div style={{ color: '#475569' }}>React, Node, REST API, Git...</div>
            </div>
            <div
              style={{
                background: 'rgba(255, 251, 235, 0.8)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #fde68a',
              }}
            >
              <div style={{ fontWeight: '700', color: '#b45309', marginBottom: '4px' }}>
                To Learn (2)
              </div>
              <div style={{ color: '#475569' }}>GraphQL, Docker</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      id: 'prepare',
      title: 'Guided Upskilling & Learning Hub',
      tagline: 'Targeted Curriculum Recommendations',
      icon: <BookOpen size={22} color="#7b2cbf" />,
      color: '#7b2cbf',
      bg: 'rgba(245, 243, 255, 0.7)',
      border: 'rgba(221, 214, 254, 0.8)',
      description:
        "Don't let missing skills hold you back. Access curated learning pathways, courses, and practical project exercises designed to close your skill gaps quickly.",
      highlights: [
        'Personalized learning modules per missing skill',
        'Industry-aligned practical projects',
        'Local completion markers for learning resources',
      ],
      demoWidget: (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          <div
            style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '12px',
            }}
          >
            Recommended Upskilling Module
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyBetween: 'space-between',
              gap: '12px',
              background: 'rgba(245, 243, 255, 0.85)',
              padding: '12px',
              borderRadius: '12px',
              border: '1px solid #ddd6fe',
            }}
          >
            <div
              style={{ background: '#7b2cbf', color: '#fff', padding: '8px', borderRadius: '8px' }}
            >
              <Zap size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4c1d95' }}>
                GraphQL API Masterclass
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b21a8' }}>
                Estimated time: 3 hours • High priority
              </div>
            </div>
            <span
              style={{
                background: '#7b2cbf',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}
            >
              Start
            </span>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      id: 'apply',
      title: 'Local Application Review',
      tagline: 'Demo Application Flow',
      icon: <Send size={22} color="#d97706" />,
      color: '#d97706',
      bg: 'rgba(254, 243, 199, 0.7)',
      border: 'rgba(253, 230, 138, 0.8)',
      description:
        'Review a local application draft with your demo profile and a short note, saved in this browser.',
      highlights: [
        'Local application draft saved in your browser',
        'Profile details prefilled from your demo profile',
        'No application is sent to an employer',
      ],
      demoWidget: (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#0f172a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                Senior Fullstack Engineer
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Stripe Inc. • Bengaluru / Remote
              </div>
            </div>
          </div>
          <div
            style={{
              background: 'rgba(236, 253, 245, 0.85)',
              color: '#047857',
              padding: '10px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: '700',
              textAlign: 'center',
              border: '1px solid #a7f3d0',
            }}
          >
            ✓ Application Draft Saved Locally
          </div>
        </div>
      ),
    },
    {
      num: '05',
      id: 'track',
      title: 'Local Application Tracker',
      tagline: 'Browser-Only Status Timeline',
      icon: <BarChart3 size={22} color="#059669" />,
      color: '#059669',
      bg: 'rgba(236, 253, 245, 0.7)',
      border: 'rgba(167, 243, 208, 0.8)',
      description:
        'Track local application records you create in this demo. Status changes are sample values stored in your browser and are never sent to employers.',
      highlights: [
        'Local status timeline (Saved → Reviewing → Interviewing → Offer)',
        'Demo notes stored in this browser',
        'No recruiter communication or employer routing',
      ],
      demoWidget: (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '12px',
            }}
          >
            Application Tracker Status
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyBetween: 'space-between',
              position: 'relative',
            }}
          >
            {[
              { label: 'Applied', done: true },
              { label: 'Screening', done: true },
              { label: 'Interview', active: true },
              { label: 'Offer', done: false },
            ].map((step, idx) => (
              <div key={idx} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: step.done ? '#059669' : step.active ? '#0284c7' : '#cbd5e1',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 4px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                  }}
                >
                  {step.done ? '✓' : idx + 1}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: step.active ? '700' : '500',
                    color: step.active ? '#0284c7' : '#64748b',
                  }}
                >
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const currentStages = candidateStages;

  const faqs = [
    {
      q: 'How is the RoleCompass Fit Score calculated?',
      a: 'Our algorithm evaluates candidate profiles against specific job requirements across technical competencies, years of experience, domain expertise, and educational background. Matched core skills boost the score, while missing required items highlight skill gaps for upskilling.',
    },
    {
      q: 'Is RoleCompass free for job seekers and candidates?',
      a: 'Yes. In this frontend demo you can build a local profile, preview resume data, view sample fit scores, explore learning resources, and save local application drafts for sample jobs.',
    },
    {
      q: 'How does the resume upload work in this demo?',
      a: 'The upload step records the file name and prepares a local profile preview from existing demo data. It does not read, parse, or verify the file contents.',
    },
    {
      q: 'What makes RoleCompass different from traditional job boards?',
      a: 'Traditional job boards only match keywords. RoleCompass provides competency-based matching, identifies skill gaps before applying, and recommends targeted upskilling resources.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '60px' }}>
      {/* 1. HERO HEADER WITH GLASS AESTHETICS & ROLE TOGGLE */}
      <Section py="6">
        <PageContainer size="lg">
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.42)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow:
                '0 24px 60px 0 rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
              padding: 'clamp(36px, 6vw, 64px)',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            {/* AMBIENT GLOW BACKGROUND CIRCLES */}
            <div
              style={{
                position: 'absolute',
                top: '-20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '350px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(184, 242, 58, 0.35) 0%, rgba(14, 165, 233, 0.2) 50%, rgba(255, 255, 255, 0) 80%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
              <ScrollReveal variant="slide-up">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#059669',
                      background: 'rgba(236, 253, 245, 0.9)',
                      padding: '6px 18px',
                      borderRadius: '12px',
                      border: '1px solid rgba(167, 243, 208, 0.9)',
                      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    THE ROLECOMPASS ARCHITECTURE
                  </span>
                </div>

                <h1
                  className="rc-display"
                  style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    lineHeight: '1.1',
                    fontWeight: '800',
                    color: '#0f172a',
                    letterSpacing: '-0.03em',
                    marginBottom: '20px',
                  }}
                >
                  How <span style={{ color: '#059669' }}>RoleCompass</span> Powers <br />
                  Intelligent Career Navigation
                </h1>

                <p
                  className="rc-body"
                  style={{
                    fontSize: '1.18rem',
                    color: '#334155',
                    lineHeight: '1.65',
                    marginBottom: '36px',
                    maxWidth: '680px',
                    margin: '0 auto 36px',
                  }}
                >
                  A revolutionary career discovery engine that matches candidate skills to real job
                  requirements, provides targeted upskilling recommendations, and streamlines
                  hiring.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '14px',
                    background: 'rgba(236, 253, 245, 0.9)',
                    border: '1px solid rgba(167, 243, 208, 0.9)',
                    color: '#047857',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  <GraduationCap size={18} /> Built for candidates and job seekers
                </div>
              </ScrollReveal>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 2. INTERACTIVE STAGE-BY-STAGE STEPPER JOURNEY */}
      <Section py="6">
        <PageContainer size="lg">
          <Stack gap="8">
            <ScrollReveal variant="slide-up">
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#0284c7',
                  }}
                >
                  STEP-BY-STEP WORKFLOW
                </span>
                <h2
                  className="rc-h2"
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    marginTop: '8px',
                    color: '#0f172a',
                  }}
                >
                  The 5-Stage Candidate Path
                </h2>
              </div>
            </ScrollReveal>

            {/* STAGE SELECTOR TABS */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {currentStages.map((stg, idx) => {
                const isActive = activeStage === idx;
                return (
                  <button
                    key={stg.id}
                    onClick={() => setActiveStage(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 20px',
                      borderRadius: '14px',
                      border: isActive
                        ? `2px solid ${stg.color}`
                        : '1px solid rgba(203, 213, 225, 0.7)',
                      background: isActive ? stg.bg : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(16px)',
                      color: isActive ? '#0f172a' : '#64748b',
                      fontWeight: isActive ? '800' : '600',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive
                        ? `0 8px 24px -4px ${stg.color}30`
                        : '0 2px 8px rgba(15,23,42,0.03)',
                    }}
                  >
                    <span
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        background: isActive ? stg.color : '#e2e8f0',
                        color: isActive ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: '800',
                      }}
                    >
                      {stg.num}
                    </span>
                    <span>{stg.title}</span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE STAGE DISPLAY CARD WITH 2-COLUMN FLEX */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                padding: 'clamp(28px, 4vw, 44px)',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '40px',
                alignItems: 'center',
              }}
            >
              {/* LEFT COLUMN: STAGE DETAILS */}
              <div style={{ flex: '1 1 380px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: currentStages[activeStage].color,
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    marginBottom: '8px',
                  }}
                >
                  {currentStages[activeStage].icon}
                  <span>
                    STAGE {currentStages[activeStage].num} — {currentStages[activeStage].tagline}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    marginBottom: '16px',
                    lineHeight: '1.2',
                  }}
                >
                  {currentStages[activeStage].title}
                </h3>

                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#334155',
                    lineHeight: '1.7',
                    marginBottom: '24px',
                  }}
                >
                  {currentStages[activeStage].description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '28px',
                  }}
                >
                  {currentStages[activeStage].highlights.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#0f172a',
                      }}
                    >
                      <div
                        style={{
                          background: currentStages[activeStage].color,
                          color: '#fff',
                          borderRadius: '50%',
                          padding: '2px',
                          display: 'flex',
                        }}
                      >
                        <Check size={14} />
                      </div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setActiveStage((prev) => (prev + 1) % currentStages.length)}
                    style={{
                      background: currentStages[activeStage].color,
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    Next Stage <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: INTERACTIVE DEMO WIDGET */}
              <div
                style={{
                  flex: '1 1 340px',
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  padding: '24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={14} color="#059669" /> LIVE INTERACTIVE PREVIEW
                </div>
                {currentStages[activeStage].demoWidget}
              </div>
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 3. LIVE INTERACTIVE FIT SCORE SIMULATOR */}
      <Section py="8">
        <PageContainer size="lg">
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 52px)',
              boxShadow: '0 24px 50px rgba(15, 23, 42, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#B8F23A',
                  }}
                >
                  TRY IT OUT NOW
                </span>
                <h2
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    marginTop: '8px',
                    color: '#ffffff',
                  }}
                >
                  Live Role Match & Skill Gap Simulator
                </h2>
                <p
                  style={{
                    color: '#94a3b8',
                    marginTop: '10px',
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                  }}
                >
                  Select a role below to simulate how RoleCompass analyzes candidate profiles
                  against sample role requirements instantly.
                </p>
              </div>

              {/* ROLE SELECTOR BUTTONS */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '32px',
                }}
              >
                {Object.keys(simRoles).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => setSelectedSimRole(roleKey)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '12px',
                      border:
                        selectedSimRole === roleKey
                          ? '2px solid #B8F23A'
                          : '1px solid rgba(148, 163, 184, 0.3)',
                      background:
                        selectedSimRole === roleKey
                          ? 'rgba(184, 242, 58, 0.15)'
                          : 'rgba(255, 255, 255, 0.05)',
                      color: selectedSimRole === roleKey ? '#B8F23A' : '#e2e8f0',
                      fontWeight: selectedSimRole === roleKey ? '800' : '600',
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {roleKey}
                  </button>
                ))}
              </div>

              {/* SIMULATED RESULTS CARD */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '28px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '28px',
                  alignItems: 'center',
                }}
              >
                {/* LEFT: FIT SCORE & METRICS */}
                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Target Role Alignment
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: '#ffffff',
                      marginTop: '4px',
                      marginBottom: '16px',
                    }}
                  >
                    {selectedSimRole}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '50%',
                        background:
                          'radial-gradient(circle, rgba(184,242,58,0.2) 0%, rgba(15,23,42,0.8) 100%)',
                        border: '3px solid #B8F23A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        fontWeight: '900',
                        color: '#B8F23A',
                        boxShadow: '0 0 20px rgba(184, 242, 58, 0.3)',
                      }}
                    >
                      {simRoles[selectedSimRole].fitScore}%
                    </div>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff' }}>
                        Overall Compatibility
                      </div>
                      <div
                        style={{
                          fontSize: '0.82rem',
                          color: '#38bdf8',
                          marginTop: '2px',
                          fontWeight: '600',
                        }}
                      >
                        {simRoles[selectedSimRole].demand}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                        Salary Band: {simRoles[selectedSimRole].salary}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: MATCHED VS MISSING SKILLS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: '#4ade80',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={16} /> Matched Candidate Skills (
                      {simRoles[selectedSimRole].matched.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {simRoles[selectedSimRole].matched.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#4ade80',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                          }}
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: '#fbbf24',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Target size={16} /> Recommended Skill Upgrades (
                      {simRoles[selectedSimRole].missing.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {simRoles[selectedSimRole].missing.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                          }}
                        >
                          + {skill} (Learn in 2 hrs)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 4. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <Section py="8">
        <PageContainer size="md">
          <Stack gap="8">
            <ScrollReveal variant="slide-up">
              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#059669',
                  }}
                >
                  CLEAR ANSWERS
                </span>
                <h2
                  className="rc-h2"
                  style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    marginTop: '8px',
                    color: '#0f172a',
                  }}
                >
                  Frequently Asked Questions
                </h2>
              </div>
            </ScrollReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.48)',
                      backdropFilter: 'blur(22px)',
                      WebkitBackdropFilter: 'blur(22px)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      padding: '18px 24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow:
                        '0 10px 30px 0 rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: '700',
                          color: '#0f172a',
                          margin: 0,
                        }}
                      >
                        {faq.q}
                      </h3>
                      <div
                        style={{
                          color: '#059669',
                          transition: 'transform 0.2s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                        }}
                      >
                        <ChevronDown size={20} />
                      </div>
                    </div>

                    {isOpen && (
                      <p
                        style={{
                          marginTop: '14px',
                          fontSize: '0.95rem',
                          color: '#475569',
                          lineHeight: '1.65',
                          borderTop: '1px solid rgba(226,232,240,0.6)',
                          paddingTop: '12px',
                        }}
                      >
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 5. CALL TO ACTION BANNER */}
      <Section py="8">
        <PageContainer size="md">
          <ScrollReveal variant="scale-up">
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.48)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.75)',
                padding: '44px 32px',
                textAlign: 'center',
                boxShadow:
                  '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              }}
            >
              <h2
                style={{
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  color: '#0f172a',
                  marginBottom: '12px',
                }}
              >
                Ready to Experience RoleCompass?
              </h2>
              <p
                style={{
                  fontSize: '1.08rem',
                  color: '#475569',
                  maxWidth: '520px',
                  margin: '0 auto 28px',
                  lineHeight: '1.6',
                }}
              >
                Join candidates using data-driven role matching and skill-gap planning.
              </p>

              <Cluster gap="4" justify="center">
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      fontWeight: '800',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(5, 150, 105, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Create Free Account <ArrowRight size={18} />
                  </button>
                </Link>

                <Link to="/jobs" style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      color: '#0f172a',
                      fontWeight: '700',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.98rem',
                      cursor: 'pointer',
                    }}
                  >
                    Explore Open Jobs
                  </button>
                </Link>
              </Cluster>
            </div>
          </ScrollReveal>
        </PageContainer>
      </Section>
    </div>
  );
}
