import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { getStepRoute } from '../../app/router/RouteGuards.jsx';
import {
  accountFromAuthUser,
  getSupabaseSession,
} from '../../services/auth/supabaseAuthService.js';
import { ArrowRight, Compass, ShieldCheck, Sparkles, FileText, Eye, EyeOff } from 'lucide-react';

import heroFemaleCutout from '../../assets/images/public/hero-female-professional-cutout.png';
import googleLogo from '../../assets/company-logos/google.svg';
import githubLogo from '../../assets/company-logos/github.svg';

const DEMO_ACCOUNTS = [
  { email: 'arjun.verma@rolecompass.demo', label: 'Arjun Verma', detail: 'Fresher demo profile' },
  { email: 'arun@gmail.com', label: 'Arun', detail: 'Candidate demo profile' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    login,
    signInWithOAuth,
    isSupabaseConfigured,
    currentUser,
    isAuthenticated,
    isHydrating,
  } = useApp();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleForgotPassword = () => {
    setError('');
    setInfoMsg('Password reset is not available in this frontend demo.');
  };

  const completeSignIn = useCallback(
    (user) => {
      if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        navigate(redirectUrl, { replace: true });
        return;
      }
      if (user.profileCompleted) {
        navigate('/candidate', { replace: true });
        return;
      }
      navigate(getStepRoute(user.onboardingStep), { replace: true });
    },
    [navigate, redirectUrl],
  );

  useEffect(() => {
    if (isHydrating || !isAuthenticated || !currentUser) return;
    completeSignIn(currentUser);
  }, [completeSignIn, currentUser, isAuthenticated, isHydrating]);

  useEffect(() => {
    if (isHydrating || isAuthenticated || !isSupabaseConfigured) return undefined;

    let cancelled = false;
    getSupabaseSession()
      .then((session) => {
        if (cancelled || !session?.user || currentUser?.id === session.user.id) return;
        completeSignIn(accountFromAuthUser(session.user));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [completeSignIn, currentUser?.id, isAuthenticated, isHydrating, isSupabaseConfigured]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfoMsg('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Unable to sign in.');
    }
  };

  const handleProviderSignIn = async (provider) => {
    setError('');
    setInfoMsg('');
    setIsLoading(true);

    try {
      await signInWithOAuth(provider.toLowerCase());
    } catch (err) {
      setIsLoading(false);
      setError(err.message || `Unable to start ${provider} sign-in.`);
    }
  };

  return (
    <Section py="8">
      <PageContainer size="lg">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            maxWidth: '1120px',
            margin: '0 auto',
            gap: '44px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
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
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                }}
              >
                CANDIDATE CAREER WORKSPACE
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                lineHeight: '1.12',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.03em',
              }}
            >
              Welcome back. <br />
              <span style={{ color: '#059669' }}>Continue your journey.</span>
            </h1>

            <p
              style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: '1.65',
                maxWidth: '460px',
              }}
            >
              Sign in to access your career matches, application tracking, saved jobs, and learning
              roadmap with your RoleCompass account.
            </p>

            <div
              className="rc-hide-mobile"
              style={{
                position: 'relative',
                marginTop: '10px',
                minHeight: '340px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '10%',
                  width: '260px',
                  height: '260px',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(134, 239, 172, 0.55) 0%, rgba(184, 242, 58, 0.3) 50%, rgba(255, 255, 255, 0) 75%)',
                  filter: 'blur(30px)',
                  zIndex: 0,
                }}
              />
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <img
                  src={heroFemaleCutout}
                  alt="RoleCompass professional"
                  style={{
                    maxHeight: '340px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 16px 24px rgba(15, 23, 42, 0.12))',
                  }}
                />
              </div>
              <div
                className="rc-animate-float-1"
                style={{ position: 'absolute', top: '12%', left: '0%', zIndex: 3 }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(236, 253, 245, 0.9)',
                      color: '#059669',
                      padding: '6px',
                      borderRadius: '8px',
                    }}
                  >
                    <FileText size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                      Local fit score
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                      Deterministic heuristic
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="rc-animate-float-2"
                style={{ position: 'absolute', bottom: '15%', right: '2%', zIndex: 3 }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.85)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(224, 242, 58, 0.3)',
                      color: '#0f172a',
                      padding: '6px',
                      borderRadius: '8px',
                    }}
                  >
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600' }}>
                      Application tracker
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0f172a' }}>
                      Stored in this browser
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rc-auth-shell">
            <div className="rc-auth-glow" />
            <div className="rc-auth-card">
              <form onSubmit={handleSubmit}>
                <Stack gap="5">
                  <div className="rc-auth-header">
                    <div className="rc-auth-brand">
                      <Compass size={22} />
                    </div>
                    <div>
                      <h2 className="rc-auth-title">Welcome back</h2>
                      <p className="rc-auth-subtitle">Sign in to continue your career roadmap.</p>
                    </div>
                    <span className="rc-auth-badge">
                      {isSupabaseConfigured ? 'SUPABASE' : 'DEMO'}
                    </span>
                  </div>

                  {error && (
                    <div
                      role="alert"
                      style={{
                        background: 'rgba(254, 242, 242, 0.95)',
                        border: '1px solid rgba(248, 113, 113, 0.8)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#991b1b',
                        textAlign: 'center',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {infoMsg && (
                    <div
                      role="status"
                      style={{
                        background: 'rgba(236, 253, 245, 0.95)',
                        border: '1px solid rgba(167, 243, 208, 0.8)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: '#065f46',
                        textAlign: 'center',
                      }}
                    >
                      {infoMsg}
                    </div>
                  )}

                  <Input
                    id="signin-email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    autoComplete="email"
                    isRequired
                  />

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                      }}
                    >
                      <span className="rc-label" style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                        Password <span style={{ color: 'var(--rc-color-danger)' }}>*</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--rc-color-green-accent)',
                          cursor: 'pointer',
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
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
                            color: 'var(--rc-color-muted-gray-500)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                    />
                  </div>

                  <button type="submit" className="rc-auth-submit" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight size={18} />
                  </button>

                  <div className="rc-auth-divider">or continue with</div>

                  <div className="rc-auth-providers">
                    <button
                      type="button"
                      className="rc-auth-provider"
                      disabled={isLoading}
                      onClick={() => handleProviderSignIn('Google')}
                    >
                      <img src={googleLogo} alt="" />
                      Google
                    </button>
                    <button
                      type="button"
                      className="rc-auth-provider"
                      disabled={isLoading}
                      onClick={() => handleProviderSignIn('GitHub')}
                    >
                      <img src={githubLogo} alt="" />
                      GitHub
                    </button>
                  </div>

                  <div className="rc-auth-note">
                    <ShieldCheck
                      size={15}
                      style={{ flexShrink: 0, color: 'var(--rc-color-green-accent)' }}
                    />
                    <span>
                      {isSupabaseConfigured ? (
                        <>Supabase Auth is connected. Use your registered email and password.</>
                      ) : (
                        <>
                          Frontend demo only. Session is stored locally. Demo:{' '}
                          <strong>{DEMO_ACCOUNTS[0].email}</strong> / <strong>password123</strong>.
                        </>
                      )}
                    </span>
                  </div>

                  <div className="rc-auth-footer">
                    New to RoleCompass? <Link to="/signup">Create an account</Link>
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
