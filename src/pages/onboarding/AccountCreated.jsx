import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export function AccountCreated() {
  const navigate = useNavigate();

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="md">
        <OnboardingProgress currentStep="created" />

        <div
          style={{
            position: 'relative',
            maxWidth: '680px',
            margin: '20px auto 0',
            zIndex: 2,
          }}
        >
          {/* DECORATIVE GLASS FLOATING SHAPES */}
          <div
            className="rc-animate-float-1"
            style={{
              position: 'absolute',
              top: '-20px',
              left: '-40px',
              width: '70px',
              height: '70px',
              borderRadius: '20px',
              background: 'rgba(236, 253, 245, 0.65)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(167, 243, 208, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
              zIndex: 3,
            }}
          >
            <Sparkles size={28} />
          </div>

          <div
            className="rc-animate-float-2"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '-30px',
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
              zIndex: 3,
            }}
          >
            <ShieldCheck size={24} />
          </div>

          {/* CENTERED GLASS WORKSPACE CARD */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '24px',
              padding: '52px 40px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            {/* ANIMATED GREEN SUCCESS CIRCLE & CHECKMARK */}
            <div
              className="rc-success-pop"
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(5, 150, 105, 0.35)',
              }}
            >
              <svg
                width="42"
                height="42"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path className="rc-checkmark-path" d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            {/* HEADING & SUPPORTING COPY */}
            <div>
              <h1
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: 'clamp(2rem, 3.2vw, 2.6rem)',
                  fontWeight: '800',
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                }}
              >
                Your Account Has Been Created!
              </h1>
              <p
                style={{
                  color: '#475569',
                  fontSize: '1.05rem',
                  lineHeight: '1.65',
                  marginTop: '10px',
                  maxWidth: '480px',
                }}
              >
                Welcome to RoleCompass. Let's set up your profile to help you discover the right
                opportunities.
              </p>
            </div>

            {/* PRIMARY CTA */}
            <button
              onClick={() => navigate('/onboarding/method')}
              style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: '800',
                fontSize: '1.05rem',
                padding: '16px 36px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '8px',
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
              Continue to Build Profile <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
