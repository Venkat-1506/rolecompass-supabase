import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { CheckCircle2, User, Briefcase, BarChart3, Target, ArrowRight, Compass } from 'lucide-react';

export function ProfileComplete() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handleGoToDashboard = () => {
    if (currentUser?.accountType === 'employer') {
      navigate('/employer');
    } else {
      navigate('/candidate');
    }
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="md">
        <OnboardingProgress currentStep="complete" />

        <div style={{
          position: 'relative',
          maxWidth: '680px',
          margin: '20px auto 0',
          zIndex: 2
        }}>
          {/* FLOATING GLASS CONTEXTUAL CARDS */}
          <div className="rc-animate-float-1" style={{
            position: 'absolute',
            top: '-20px',
            left: '-50px',
            background: 'rgba(255, 255, 255, 0.48)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            borderRadius: '14px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
          }}>
            <div style={{ background: 'rgba(236, 253, 245, 0.9)', color: '#059669', padding: '6px', borderRadius: '8px' }}>
              <User size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Profile</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>100% Complete</div>
            </div>
          </div>

          <div className="rc-animate-float-2" style={{
            position: 'absolute',
            top: '20px',
            right: '-40px',
            background: 'rgba(255, 255, 255, 0.48)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            borderRadius: '14px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
          }}>
            <div style={{ background: 'rgba(224, 242, 58, 0.9)', color: '#0284c7', padding: '6px', borderRadius: '8px' }}>
              <Briefcase size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Job Matches</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>14 Roles Ready</div>
            </div>
          </div>

          <div className="rc-animate-float-1" style={{
            position: 'absolute',
            bottom: '10px',
            right: '-30px',
            background: 'rgba(255, 255, 255, 0.48)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            borderRadius: '14px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
          }}>
            <div style={{ background: 'rgba(243, 232, 255, 0.9)', color: '#7b2cbf', padding: '6px', borderRadius: '8px' }}>
              <BarChart3 size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Analytics</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>ATS Optimized</div>
            </div>
          </div>

          {/* MAIN GLASS SUCCESS CARD */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.48)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderRadius: '24px',
            padding: '52px 40px',
            border: '1px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}>
            <div className="rc-success-pop" style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 12px 32px rgba(5, 150, 105, 0.35)'
            }}>
              <CheckCircle2 size={46} strokeWidth={2.5} />
            </div>

            <div>
              <h1 style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.2rem, 3.4vw, 2.8rem)',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.02em'
              }}>
                Welcome, {currentUser?.fullName || 'Arjun'}! <br />
                <span style={{ color: '#059669' }}>Your Profile is Ready.</span>
              </h1>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', marginTop: '10px', maxWidth: '480px' }}>
                You're all set to explore opportunities, apply to jobs, and grow your career with RoleCompass.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
              <button
                onClick={handleGoToDashboard}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '1rem',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 200ms ease'
                }}
              >
                Go to Dashboard <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate('/explore')}
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: '#0f172a',
                  fontWeight: '700',
                  fontSize: '1rem',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 200ms ease'
                }}
              >
                <Compass size={20} color="#059669" /> Explore Jobs
              </button>
            </div>

          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
