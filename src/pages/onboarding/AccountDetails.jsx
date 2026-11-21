import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { ShieldCheck, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

export function AccountDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerAccount } = useApp();
  const path = searchParams.get('path') || 'fresher';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPathLabel = () => {
    switch (path) {
      case 'student':
        return 'Student';
      case 'experienced':
        return 'Experienced';
      default:
        return 'Fresher';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');

    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerAccount({
        fullName,
        email,
        password,
        accountType: path,
      });

      setIsSubmitting(false);
      if (result?.requiresConfirmation) {
        setInfoMsg(
          `Account created for ${result.email}. Check your email to confirm, then sign in.`,
        );
        return;
      }
      navigate('/onboarding/created');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'An error occurred while creating your account.');
    }
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="lg">
        {/* Sub-header progress indicator */}
        <OnboardingProgress currentStep="account" />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            maxWidth: '1100px',
            margin: '0 auto',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN: EDITORIAL HEADING & FEATURE ROWS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
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
                  lineHeight: '1.15',
                  letterSpacing: '-0.02em',
                }}
              >
                Create Your <br />
                <span style={{ color: '#059669' }}>{getPathLabel()} Account</span>
              </h1>

              <p
                style={{
                  color: '#475569',
                  fontSize: '1.05rem',
                  marginTop: '12px',
                  lineHeight: '1.65',
                }}
              >
                Start your personalized career journey with RoleCompass.
              </p>
            </div>

            {/* THREE FEATURE ROWS */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    background: 'rgba(236, 253, 245, 0.95)',
                    padding: '10px',
                    borderRadius: '12px',
                    color: '#059669',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                    Access to curated job matches
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Matched specifically to your skills & role fit
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    background: 'rgba(236, 253, 245, 0.95)',
                    padding: '10px',
                    borderRadius: '12px',
                    color: '#059669',
                  }}
                >
                  <Sparkles size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                    Track your applications
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Local application status tracking in this browser
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    background: 'rgba(236, 253, 245, 0.95)',
                    padding: '10px',
                    borderRadius: '12px',
                    color: '#059669',
                  }}
                >
                  <UserCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f172a' }}>
                    Build your professional profile
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    Structured profile review and skill-gap insights
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CREATE ACCOUNT FORM WORKSPACE */}
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
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack gap="5">
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a' }}>
                    Enter Details
                  </h2>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
                    Create your RoleCompass account with Supabase Auth.
                  </p>
                </div>

                {/* ERROR BANNER */}
                {error && (
                  <div
                    style={{
                      background: 'rgba(254, 242, 242, 0.95)',
                      border: '1px solid rgba(248, 113, 113, 0.8)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#991b1b',
                      textAlign: 'center',
                    }}
                  >
                    {error}{' '}
                    {error.includes('exists') && (
                      <div style={{ marginTop: '6px' }}>
                        <Link
                          to="/login"
                          style={{
                            color: '#059669',
                            textDecoration: 'underline',
                            fontWeight: '800',
                          }}
                        >
                          Sign In to your account
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <Input
                  label="Full Name"
                  placeholder="e.g. Arjun Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  isRequired
                />

                <Input
                  label="Email Address"
                  placeholder="arjun@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  isRequired
                />

                {infoMsg && (
                  <div
                    role="status"
                    style={{
                      background: 'rgba(236, 253, 245, 0.95)',
                      border: '1px solid rgba(167, 243, 208, 0.8)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: '#065f46',
                      textAlign: 'center',
                    }}
                  >
                    {infoMsg} <Link to="/login">Go to sign in</Link>
                  </div>
                )}

                <div
                  style={{
                    background: 'rgba(239, 246, 255, 0.9)',
                    border: '1px solid rgba(191, 219, 254, 0.9)',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    color: '#1e3a8a',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                  }}
                >
                  Your password is handled by Supabase Auth. RoleCompass never stores it in the
                  browser or database.
                </div>

                {/* DYNAMIC CTA BUTTON BASED ON SELECTED PATH */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: '800',
                    fontSize: '1rem',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    transition: 'all 200ms ease',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'wait' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Creating Account...' : `Create ${getPathLabel()} Account`}{' '}
                  <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', color: '#64748b' }} className="rc-small">
                  Already registered?{' '}
                  <Link
                    to="/login"
                    style={{ color: '#059669', fontWeight: '700', textDecoration: 'none' }}
                  >
                    Sign In
                  </Link>
                </div>
              </Stack>
            </form>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
