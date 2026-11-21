import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { FileUp, Edit3, Check, ArrowRight } from 'lucide-react';

export function ProfileMethod() {
  const navigate = useNavigate();
  const { setProfileMethod, updateOnboardingStep } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('resume'); // resume | manual

  const handleSelectResume = (e) => {
    e?.stopPropagation();
    setProfileMethod('resume');
    updateOnboardingStep('upload');
    navigate('/onboarding/resume-upload');
  };

  const handleSelectManual = (e) => {
    e?.stopPropagation();
    setProfileMethod('manual');
    updateOnboardingStep('manual');
    navigate('/onboarding/manual-profile');
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="lg">
        {/* Sub-header progress indicator */}
        <OnboardingProgress currentStep="method" />

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
            PROFILE SETUP METHOD
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
            Build Your RoleCompass Profile
          </h1>

          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px' }}>
            Choose how you want to get started. You can always update it later.
          </p>
        </div>

        {/* 2 MAJOR METHOD CARDS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            maxWidth: '960px',
            margin: '0 auto 40px',
          }}
        >
          {/* METHOD 1: RESUME UPLOAD */}
          <div
            onClick={() => setSelectedMethod('resume')}
            style={{
              background:
                selectedMethod === 'resume'
                  ? 'rgba(236, 253, 245, 0.75)'
                  : 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              padding: '32px',
              border:
                selectedMethod === 'resume'
                  ? '2px solid #059669'
                  : '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                selectedMethod === 'resume'
                  ? '0 16px 36px rgba(5, 150, 105, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                  : '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              transition: 'all 220ms ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: selectedMethod === 'resume' ? '#059669' : 'rgba(241, 245, 249, 0.9)',
                  color: selectedMethod === 'resume' ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  transition: 'all 200ms ease',
                }}
              >
                <FileUp size={26} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                USE MY RESUME
              </h2>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.92rem',
                  marginTop: '8px',
                  lineHeight: '1.6',
                }}
              >
                Upload a resume and review a locally generated profile preview built from existing
                demo data.
              </p>

              {/* BENEFITS LIST */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Extract skills and experience
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Identify education background
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Review information before
                  saving
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectResume}
              style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.95rem',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
              }}
            >
              Upload Resume <ArrowRight size={18} />
            </button>
          </div>

          {/* METHOD 2: BUILD MANUALLY */}
          <div
            onClick={() => setSelectedMethod('manual')}
            style={{
              background:
                selectedMethod === 'manual'
                  ? 'rgba(236, 253, 245, 0.75)'
                  : 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              padding: '32px',
              border:
                selectedMethod === 'manual'
                  ? '2px solid #059669'
                  : '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                selectedMethod === 'manual'
                  ? '0 16px 36px rgba(5, 150, 105, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                  : '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              transition: 'all 220ms ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: selectedMethod === 'manual' ? '#059669' : 'rgba(241, 245, 249, 0.9)',
                  color: selectedMethod === 'manual' ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  transition: 'all 200ms ease',
                }}
              >
                <Edit3 size={26} />
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                BUILD MY PROFILE MANUALLY
              </h2>
              <p
                style={{
                  color: '#475569',
                  fontSize: '0.92rem',
                  marginTop: '8px',
                  lineHeight: '1.6',
                }}
              >
                Enter your education, skills, experience, projects and preferences step by step.
              </p>

              {/* STEPS PREVIEW LIST */}
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Step-by-step guidance
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Complete control over every
                  detail
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    fontWeight: '600',
                  }}
                >
                  <Check size={16} color="#059669" strokeWidth={3} /> Ideal if you don't have a PDF
                  resume
                </div>
              </div>
            </div>

            <button
              onClick={handleSelectManual}
              style={{
                background: selectedMethod === 'manual' ? '#059669' : '#0f172a',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '0.95rem',
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
              }}
            >
              Build Manually <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
