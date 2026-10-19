import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { ArrowRight, ShieldCheck, Sparkles, FileText, Briefcase, Globe, Eye, EyeOff } from 'lucide-react';

import heroFemaleCutout from '../../assets/images/public/hero-female-professional-cutout.png';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useApp();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [roleType, setRoleType] = useState('candidate'); // candidate | employer
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleForgotPassword = () => {
    if (!email.trim()) {
      setError('Please enter your email address above first.');
      return;
    }
    setError('');
    setInfoMsg(`Password reset instructions have been sent to ${email.trim()}.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      try {
        const user = login({ email, password, roleType });
        setIsLoading(false);

        // If target redirect URL was preserved (e.g. /jobs/job-001), navigate back directly!
        if (redirectUrl) {
          navigate(redirectUrl);
          return;
        }

        if (user.accountType === 'employer') {
          navigate('/employer');
        } else if (user.profileCompleted) {
          navigate('/candidate');
        } else {
          // Send candidate to their current onboarding step
          const step = user.onboardingStep || 'created';
          const routeMap = {
            'path': '/onboarding/path',
            'account': '/onboarding/account',
            'created': '/onboarding/created',
            'method': '/onboarding/method',
            'upload': '/onboarding/resume-upload',
            'processing': '/onboarding/resume-processing',
            'review': '/onboarding/review-profile',
            'manual': '/onboarding/manual-profile',
            'complete': '/onboarding/complete'
          };
          navigate(routeMap[step] || '/onboarding/created');
        }
      } catch (err) {
        setIsLoading(false);
        setError(err.message || 'Email or password is incorrect.');
      }
    }, 400);
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          maxWidth: '1120px',
          margin: '0 auto',
          gap: '44px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* 1. LEFT COLUMN: EDITORIAL HERO BRANDING & VISUAL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 2 }}>
            
            {/* Subtle Glass Eyebrow */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#059669',
                background: 'rgba(236, 253, 245, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '6px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(167, 243, 208, 0.8)',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
              }}>
                INTELLIGENT CAREER NAVIGATION
              </span>
            </div>

            {/* Editorial Heading */}
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              lineHeight: '1.12',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.03em'
            }}>
              Welcome back. <br />
              <span style={{ color: '#059669' }}>Continue your journey.</span>
            </h1>

            {/* Supporting Copy */}
            <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.65', maxWidth: '460px' }}>
              Sign in to access your personalized career matches, application tracking, and global role intelligence with RoleCompass.
            </p>

            {/* FEMALE VISUAL WITH INTEGRATED FLOATING CARDS */}
            <div className="rc-hide-mobile" style={{
              position: 'relative',
              marginTop: '10px',
              minHeight: '340px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}>
              {/* Soft Ambient Light Glow */}
              <div style={{
                position: 'absolute',
                top: '10%',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(134, 239, 172, 0.55) 0%, rgba(184, 242, 58, 0.3) 50%, rgba(255, 255, 255, 0) 75%)',
                filter: 'blur(30px)',
                zIndex: 0
              }} />

              {/* Female Cutout */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <img 
                  src={heroFemaleCutout} 
                  alt="RoleCompass Professional" 
                  style={{
                    maxHeight: '340px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 16px 24px rgba(15, 23, 42, 0.12))'
                  }}
                />
              </div>

              {/* CARD 1: MATCH SCORE */}
              <div className="rc-animate-float-1" style={{ position: 'absolute', top: '12%', left: '0%', zIndex: 3 }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ background: 'rgba(236, 253, 245, 0.9)', color: '#059669', padding: '6px', borderRadius: '8px' }}>
                    <FileText size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Match Index</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>92% Fit Score</div>
                  </div>
                </div>
              </div>

              {/* CARD 2: REAL-TIME TRACKER */}
              <div className="rc-animate-float-2" style={{ position: 'absolute', bottom: '15%', right: '2%', zIndex: 3 }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ background: 'rgba(224, 242, 58, 0.3)', color: '#0f172a', padding: '6px', borderRadius: '8px' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>Live Tracking</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>5-Stage Pipeline</div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* 2. RIGHT COLUMN: PRIMARY SIGN IN CARD (FRONT & CENTER FOCAL POINT) */}
          <div style={{
            position: 'relative',
            zIndex: 3
          }}>
            {/* Ambient Backlight for Sign In Card */}
            <div style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(184, 242, 58, 0.25), rgba(5, 150, 105, 0.15))',
              filter: 'blur(20px)',
              zIndex: -1
            }} />

            <div style={{
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderRadius: '24px',
              padding: '40px 36px',
              border: '1px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '0 25px 60px rgba(15, 23, 42, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
            }}>
              <form onSubmit={handleSubmit}>
                <Stack gap="5">
                  <div>
                    <h2 className="rc-h2" style={{ color: '#0f172a', fontSize: '1.85rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                      Sign In
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                      Select your workspace type to log in
                    </p>
                  </div>

                  {/* ERROR ALERT BANNER */}
                  {error && (
                    <div style={{
                      background: 'rgba(254, 242, 242, 0.95)',
                      border: '1px solid rgba(248, 113, 113, 0.8)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#991b1b',
                      textAlign: 'center'
                    }}>
                      {error}
                    </div>
                  )}

                  {/* INFO ALERT BANNER */}
                  {infoMsg && (
                    <div style={{
                      background: 'rgba(236, 253, 245, 0.95)',
                      border: '1px solid rgba(167, 243, 208, 0.8)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#065f46',
                      textAlign: 'center'
                    }}>
                      {infoMsg}
                    </div>
                  )}

                  {/* Segmented Glass Role Switcher */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    background: 'rgba(241, 245, 249, 0.85)',
                    padding: '5px',
                    borderRadius: '12px',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        setRoleType('candidate');
                        setEmail(candidateUser.personal.email);
                      }}
                      style={{
                        flex: 1,
                        padding: '11px 14px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: roleType === 'candidate' ? '#ffffff' : 'transparent',
                        boxShadow: roleType === 'candidate' ? '0 2px 10px rgba(15, 23, 42, 0.08)' : 'none',
                        color: roleType === 'candidate' ? '#059669' : '#64748b'
                      }}
                    >
                      Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRoleType('employer');
                        setEmail(employerUser.personal.email);
                      }}
                      style={{
                        flex: 1,
                        padding: '11px 14px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: roleType === 'employer' ? '#ffffff' : 'transparent',
                        boxShadow: roleType === 'employer' ? '0 2px 10px rgba(15, 23, 42, 0.08)' : 'none',
                        color: roleType === 'employer' ? '#059669' : '#64748b'
                      }}
                    >
                      Employer
                    </button>
                  </div>

                  {/* Email Field */}
                  <Input
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    isRequired
                  />

                  {/* Password Field with Eye Show/Hide Toggle */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="rc-label" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                        Password <span style={{ color: 'var(--rc-color-danger)' }}>*</span>
                      </span>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          color: '#059669',
                          cursor: 'pointer'
                        }}
                        onClick={handleForgotPassword}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      isRequired
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>

                  {/* Primary Action Button — Dynamic Role Text */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      background: '#B8F23A',
                      color: '#0f172a',
                      fontWeight: '800',
                      fontSize: '1rem',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(184, 242, 58, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      marginTop: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 22px rgba(184, 242, 58, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 18px rgba(184, 242, 58, 0.45)';
                    }}
                  >
                    Continue to {roleType === 'employer' ? 'Employer Workspace' : 'Candidate Workspace'} <ArrowRight size={18} />
                  </button>

                  {/* Social Login Options */}
                  <div style={{ textAlign: 'center', margin: '4px 0', fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600' }}>
                    ────── OR ──────
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        background: 'rgba(255, 255, 255, 0.65)',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        background: 'rgba(255, 255, 255, 0.65)',
                        fontSize: '0.82rem',
                        fontWeight: '600',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      LinkedIn
                    </button>
                  </div>

                  {/* Footer Create Account Link */}
                  <div style={{ textAlign: 'center', marginTop: '6px' }} className="rc-small">
                    Don't have an account? <Link to="/signup" style={{ color: '#059669', fontWeight: '700', textDecoration: 'none' }}>Create Account</Link>
                  </div>
                </Stack>
              </form>
            </div>
          </div>

        </div>
      </PageContainer>
    </Section>
  );
}
