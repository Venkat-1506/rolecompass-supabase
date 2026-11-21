import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { ScrollReveal } from '../../components/ui/ScrollReveal.jsx';
import {
  Compass,
  Target,
  BookOpen,
  Send,
  Layers,
  CheckCircle2,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import '../../styles/motion.css';

export function AboutPage() {
  const { hash } = useLocation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (hash === '#how-it-works') {
      const el = document.getElementById('how-it-works');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const stages = [
    {
      num: '01',
      id: 'discover',
      title: 'Discover',
      tagline: 'Career Role Discovery & Market Alignment',
      icon: <Compass size={24} color="#059669" />,
      color: '#059669',
      bgLight: '#ecfdf5',
      borderLight: '#a7f3d0',
      description:
        'Explore target career roles aligned with your interest, skill profile, and current industry hiring demand. RoleCompass maps hidden career pathways across software engineering, product design, data science, and management.',
      highlights: [
        'Dynamic role intelligence database',
        'Competency demand analysis',
        'Salary benchmark transparency',
      ],
    },
    {
      num: '02',
      id: 'understand',
      title: 'Understand',
      tagline: 'Skill Match Index & Gap Identification',
      icon: <Target size={24} color="#0284c7" />,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      borderLight: '#bae6fd',
      description:
        'Instantly evaluate how your candidate profile aligns with actual job requirements. See matched skills, missing required competencies, and deterministic fit percentage scores before applying.',
      highlights: [
        'Automated candidate profile parsing',
        'Matched vs missing skill breakdown',
        'Transparent role readiness percentage',
      ],
    },
    {
      num: '03',
      id: 'prepare',
      title: 'Prepare',
      tagline: 'Targeted Learning & Skill Gap Bridging',
      icon: <BookOpen size={24} color="#7b2cbf" />,
      color: '#7b2cbf',
      bgLight: '#faf5ff',
      borderLight: '#e9d5ff',
      description:
        'Close identified skill gaps with curated learning modules and hands-on curriculum. Build evidence of progress against the requirements of your target roles.',
      highlights: [
        'Curated skill learning paths',
        'Progressive mastery tracking',
        'Portfolio & project showcase',
      ],
    },
    {
      num: '04',
      id: 'apply',
      title: 'Apply',
      tagline: 'Streamlined Application Submission',
      icon: <Send size={24} color="#d97706" />,
      color: '#d97706',
      bgLight: '#fffbeb',
      borderLight: '#fde68a',
      description:
        'Prepare applications with auto-populated profile data and role-specific screening answers. In this frontend demo, application records are saved locally in your browser.',
      highlights: [
        'Auto-populated profile credentials',
        'Role-specific screening questions',
        'Local demo application tracking',
      ],
    },
    {
      num: '05',
      id: 'track',
      title: 'Track',
      tagline: 'Local Application Status',
      icon: <Layers size={24} color="#059669" />,
      color: '#059669',
      bgLight: '#ecfdf5',
      borderLight: '#a7f3d0',
      description:
        'Track the applications you save in this demo workspace. Status changes are local and do not represent employer or recruiter activity.',
      highlights: [
        'Local application status dashboard',
        'No employer or ATS transmission',
        'Single-pane application overview',
      ],
    },
  ];

  const candidateBenefits = [
    {
      title: 'Discover Relevant Roles',
      desc: 'Explore target roles matched with your current skill profile, interest, and industry demand.',
      icon: <Sparkles size={20} color="#059669" />,
    },
    {
      title: 'Understand Role Expectations',
      desc: 'Analyze required competencies, salary expectations, and day-to-day responsibilities clearly.',
      icon: <Target size={20} color="#059669" />,
    },
    {
      title: 'Identify Skill Gaps',
      desc: 'Instantly see missing skills and competency gaps before submitting an application.',
      icon: <Zap size={20} color="#059669" />,
    },
    {
      title: 'Prepare with Learning Modules',
      desc: 'Access recommended learning resources and practice modules to bridge skill gaps.',
      icon: <BookOpen size={20} color="#059669" />,
    },
    {
      title: 'Apply with Profile Data',
      desc: 'Prepare application details from your candidate profile and save them locally in this demo.',
      icon: <Send size={20} color="#059669" />,
    },
    {
      title: 'Track Applications Locally',
      desc: 'Review the application records stored in this browser. No recruiter activity is simulated.',
      icon: <TrendingUp size={20} color="#059669" />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', overflowX: 'hidden' }}>
      {/* 1. OPEN EDITORIAL HERO SECTION (NO HEAVY BOX ENCLOSURE!) */}
      <Section py="8">
        <PageContainer size="lg">
          <div style={{ position: 'relative', padding: '40px 0 20px', minHeight: '440px' }}>
            {/* ATMOSPHERIC AMBIENT GLOW FIELDS IN BACKGROUND */}
            <div
              style={{
                position: 'absolute',
                top: '-10%',
                left: '20%',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(134, 239, 172, 0.45) 0%, rgba(184, 242, 58, 0.25) 50%, rgba(255, 255, 255, 0) 75%)',
                filter: 'blur(50px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '0%',
                right: '10%',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(186, 230, 253, 0.45) 0%, rgba(125, 211, 252, 0.2) 50%, rgba(255, 255, 255, 0) 75%)',
                filter: 'blur(45px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* MAIN EDITORIAL HERO CONTENT LAYOUT */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '860px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <ScrollReveal variant="slide-up">
                {/* Sleek Eyebrow Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#059669',
                      background: 'rgba(236, 253, 245, 0.85)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '8px 20px',
                      borderRadius: '12px',
                      border: '1px solid rgba(167, 243, 208, 0.9)',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#059669',
                        display: 'inline-block',
                      }}
                      className="rc-animate-pulse"
                    />
                    ABOUT ROLECOMPASS
                  </span>
                </div>

                {/* Grand Display Headline */}
                <h1
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(2.8rem, 5.8vw, 4.8rem)',
                    lineHeight: '1.08',
                    fontWeight: '800',
                    color: '#0f172a',
                    letterSpacing: '-0.035em',
                    marginBottom: '24px',
                  }}
                >
                  Navigate your career <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #0284c7 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    with clarity.
                  </span>
                </h1>

                {/* Subtitle Statement */}
                <p
                  style={{
                    fontSize: '1.25rem',
                    color: '#334155',
                    maxWidth: '740px',
                    margin: '0 auto 40px',
                    lineHeight: '1.65',
                    fontWeight: '500',
                  }}
                >
                  RoleCompass is an intelligent career navigation and recruitment architecture
                  designed to bring structure, transparency, and skill-alignment to modern job
                  discovery.
                </p>
              </ScrollReveal>

              {/* FLOATING METRIC BADGES (DYNAMIC ANIMATED SURROUNDINGS) */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  marginTop: '12px',
                }}
              >
                <div
                  className="rc-animate-float-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    borderRadius: '16px',
                    padding: '12px 20px',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: '#ecfdf5',
                      padding: '8px',
                      borderRadius: '10px',
                      color: '#059669',
                    }}
                  >
                    <Compass size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      Architecture
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                      5-Stage Engine
                    </div>
                  </div>
                </div>

                <div
                  className="rc-animate-float-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    borderRadius: '16px',
                    padding: '12px 20px',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: '#f0f9ff',
                      padding: '8px',
                      borderRadius: '10px',
                      color: '#0284c7',
                    }}
                  >
                    <Target size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      Precision
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                      Skill Fit % Matching
                    </div>
                  </div>
                </div>

                <div
                  className="rc-animate-float-1"
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    borderRadius: '16px',
                    padding: '12px 20px',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: '#faf5ff',
                      padding: '8px',
                      borderRadius: '10px',
                      color: '#7b2cbf',
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#64748b',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                      }}
                    >
                      Visibility
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                      Local Tracking
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </Section>

      {/* 2. WHAT IS ROLECOMPASS? (INTERACTIVE STAGE EXPLORER ARCHITECTURE) */}
      <Section py="8">
        <PageContainer size="lg">
          <div id="how-it-works" style={{ scrollMarginTop: '100px' }}>
            <Stack gap="8">
              <ScrollReveal variant="slide-up">
                <div style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#059669',
                    }}
                  >
                    HOW IT WORKS
                  </span>
                  <h2
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '2.5rem',
                      fontWeight: '800',
                      marginTop: '6px',
                      color: '#0f172a',
                    }}
                  >
                    The 5-Stage Career Engine
                  </h2>
                  <p
                    style={{
                      color: '#475569',
                      fontSize: '1.1rem',
                      maxWidth: '640px',
                      margin: '8px auto 0',
                      lineHeight: '1.6',
                    }}
                  >
                    RoleCompass connects candidate skills with hiring organizations through an
                    integrated, stage-by-stage workflow.
                  </p>
                </div>
              </ScrollReveal>

              {/* INTERACTIVE STAGE SELECTOR TABS */}
              <ScrollReveal variant="fade-in" delay={150}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                  }}
                >
                  {stages.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveStep(idx)}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '14px',
                        border:
                          activeStep === idx
                            ? `2px solid ${s.color}`
                            : '1px solid rgba(203, 213, 225, 0.8)',
                        background: activeStep === idx ? s.bgLight : 'rgba(255, 255, 255, 0.75)',
                        color: activeStep === idx ? s.color : '#475569',
                        fontWeight: activeStep === idx ? '800' : '600',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow:
                          activeStep === idx
                            ? `0 6px 20px ${s.color}22`
                            : '0 2px 8px rgba(15, 23, 42, 0.03)',
                      }}
                    >
                      <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{s.num}</span>
                      <span>{s.title}</span>
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {/* ACTIVE STAGE SHOWCASE CARD (FLUID ANIMATED PANEL) */}
              <ScrollReveal variant="scale-up" delay={200}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.48)',
                    backdropFilter: 'blur(22px)',
                    WebkitBackdropFilter: 'blur(22px)',
                    borderRadius: '24px',
                    padding: 'clamp(28px, 4vw, 48px)',
                    border: '1px solid rgba(255, 255, 255, 0.75)',
                    boxShadow:
                      '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '36px',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column: Stage Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          background: stages[activeStep].bgLight,
                          padding: '12px',
                          borderRadius: '14px',
                          border: `1px solid ${stages[activeStep].borderLight}`,
                        }}
                      >
                        {stages[activeStep].icon}
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            color: stages[activeStep].color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          STAGE {stages[activeStep].num}
                        </span>
                        <h3
                          style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: '1.8rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            margin: 0,
                          }}
                        >
                          {stages[activeStep].title}
                        </h3>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#334155' }}>
                      {stages[activeStep].tagline}
                    </h4>

                    <p
                      style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.65', margin: 0 }}
                    >
                      {stages[activeStep].description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        marginTop: '8px',
                      }}
                    >
                      {stages[activeStep].highlights.map((hl, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.92rem',
                            fontWeight: '600',
                            color: '#0f172a',
                          }}
                        >
                          <CheckCircle2 size={18} color={stages[activeStep].color} />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Visual Stage Graphic Preview */}
                  <div
                    style={{
                      background: stages[activeStep].bgLight,
                      borderRadius: '20px',
                      padding: '32px',
                      border: `1px solid ${stages[activeStep].borderLight}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      minHeight: '260px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '3rem',
                        fontWeight: '900',
                        color: stages[activeStep].color,
                        opacity: 0.15,
                        position: 'absolute',
                        top: '10px',
                        right: '20px',
                      }}
                    >
                      {stages[activeStep].num}
                    </div>

                    <div
                      style={{
                        background: '#ffffff',
                        padding: '16px',
                        borderRadius: '50%',
                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
                        marginBottom: '16px',
                      }}
                    >
                      {stages[activeStep].icon}
                    </div>

                    <h4
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: '#0f172a',
                        marginBottom: '8px',
                      }}
                    >
                      {stages[activeStep].title} Workspace Engine
                    </h4>

                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: '#475569',
                        fontWeight: '600',
                        maxWidth: '280px',
                      }}
                    >
                      Integrated candidate intelligence & local role matching.
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </Stack>
          </div>
        </PageContainer>
      </Section>

      {/* 3. FOR CANDIDATES SECTION (ELEGANT GRID - NO CTA DUPLICATION) */}
      <Section py="6">
        <PageContainer size="lg">
          <Stack gap="8">
            <ScrollReveal variant="slide-up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: '14px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                  }}
                >
                  <Users size={24} />
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      color: '#059669',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    CANDIDATE ARCHITECTURE
                  </span>
                  <h2
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '2.2rem',
                      fontWeight: '800',
                      color: '#0f172a',
                      margin: 0,
                    }}
                  >
                    Built for Job Seekers & Professionals
                  </h2>
                </div>
              </div>
            </ScrollReveal>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {candidateBenefits.map((feat, i) => (
                <ScrollReveal key={i} variant="slide-up" delay={i * 80}>
                  <div
                    className="rc-glass-hoverable"
                    style={{
                      background: 'rgba(255, 255, 255, 0.48)',
                      backdropFilter: 'blur(22px)',
                      WebkitBackdropFilter: 'blur(22px)',
                      borderRadius: '20px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.75)',
                      boxShadow:
                        '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        background: '#ecfdf5',
                        padding: '10px',
                        borderRadius: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {feat.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: '800',
                          color: '#0f172a',
                          margin: 0,
                        }}
                      >
                        {feat.title}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.9rem',
                          color: '#475569',
                          marginTop: '6px',
                          lineHeight: '1.55',
                          margin: 0,
                        }}
                      >
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Stack>
        </PageContainer>
      </Section>

      {/* 4. MINIMALIST DISTINCT FOOTNOTE (NO DUPLICATE BIG CTA CARD) */}
      <Section py="8">
        <PageContainer size="md">
          <div
            style={{
              textAlign: 'center',
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
            }}
          >
            <h3
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.4rem',
                fontWeight: '800',
                color: '#0f172a',
                marginBottom: '8px',
              }}
            >
              Explore RoleCompass Features
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
              Connecting candidate skills with top hiring organizations.
            </p>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}
