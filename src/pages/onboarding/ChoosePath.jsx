import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { GraduationCap, Sparkles, Briefcase, ArrowRight } from 'lucide-react';

export function ChoosePath() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState('fresher');

  const pathways = [
    {
      id: 'student',
      title: 'STUDENT',
      icon: GraduationCap,
      description: 'Learn, build skills, and explore opportunities.',
    },
    {
      id: 'fresher',
      title: 'FRESHER',
      icon: Sparkles,
      description: 'Find your first opportunities and build your career.',
    },
    {
      id: 'experienced',
      title: 'EXPERIENCED',
      icon: Briefcase,
      description: 'Explore better roles and grow your career.',
    },
  ];

  const handleContinue = () => {
    navigate(`/onboarding/account?path=${selectedPath}`);
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="lg">
        {/* Sub-header progress indicator */}
        <OnboardingProgress currentStep="path" />

        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 36px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#059669',
              background: 'rgba(236, 253, 245, 0.85)',
              padding: '6px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(167, 243, 208, 0.8)',
            }}
          >
            ROLECOMPASS REGISTRATION
          </span>

          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 3.5vw, 3rem)',
              fontWeight: '800',
              color: '#0f172a',
              marginTop: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Create Your Account
          </h1>

          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px' }}>
            Select your candidate track to customize your experience.
          </p>
        </div>

        {/* CANDIDATE TRACK CARDS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            maxWidth: '1060px',
            margin: '0 auto 40px',
          }}
        >
          {pathways.map((path, index) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.id;

            return (
              <div
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className={`rc-path-card rc-card-stagger rc-stagger-${index + 1} ${isSelected ? 'selected' : ''}`}
              >
                <div className="path-icon-container">
                  <Icon size={24} />
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: '800',
                    letterSpacing: '0.05em',
                    color: isSelected ? '#059669' : '#0f172a',
                  }}
                >
                  {path.title}
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: '1.5' }}>
                  {path.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* PRIMARY CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleContinue}
            style={{
              background: '#059669',
              color: '#ffffff',
              fontWeight: '800',
              fontSize: '1rem',
              padding: '14px 36px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 200ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(5, 150, 105, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(5, 150, 105, 0.35)';
            }}
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      </PageContainer>
    </Section>
  );
}
