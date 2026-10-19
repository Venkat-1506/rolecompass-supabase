import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { GlassCard } from '../../components/glass/GlassCard.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { GraduationCap, Sparkles, Briefcase, Building2, ArrowRight } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateCandidate, loginAsCandidate } = useApp();

  const initialType = searchParams.get('type') || 'fresher';
  const [userType, setUserType] = useState(initialType);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (userType === 'employer') {
        navigate('/employer/company');
      } else {
        loginAsCandidate();
        updateCandidate({
          personal: {
            fullName: fullName || (userType === 'student' ? 'Ananya Sharma' : 'Arjun Verma'),
            email: email || 'candidate@rolecompass.demo',
            title: userType === 'student' ? 'Computer Science Student' : userType === 'fresher' ? 'Aspiring Software Engineer & Fresher' : 'Senior Software Engineer'
          }
        });
        navigate('/candidate/profile');
      }
    }, 400);
  };

  return (
    <Section py="10">
      <PageContainer size="md">
        <GlassCard level={3} padding="8" style={{ borderRadius: 'var(--rc-radius-2xl)', background: 'rgba(255, 255, 255, 0.48)' }}>
          <form onSubmit={handleSignup}>
            <Stack gap="6">
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#059669',
                  background: 'rgba(236, 253, 245, 0.8)',
                  padding: '6px 16px',
                  borderRadius: 'var(--rc-radius-pill)',
                  border: '1px solid #a7f3d0'
                }}>
                  RoleCompass Registration
                </span>
                <h1 className="rc-h1" style={{ fontSize: '2.25rem', fontWeight: '800', marginTop: '12px', color: '#0f172a' }}>
                  Create Your Account
                </h1>
                <p className="rc-small" style={{ color: '#475569', marginTop: '4px' }}>
                  Select your pathway to customize your experience
                </p>
              </div>

              {/* USER PATHWAY SELECTION CHIPS */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                <div
                  onClick={() => setUserType('student')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--rc-radius-lg)',
                    border: userType === 'student' ? '2px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                    background: userType === 'student' ? 'rgba(236, 253, 245, 0.9)' : 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: userType === 'student' ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                >
                  <GraduationCap size={26} color={userType === 'student' ? '#059669' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: userType === 'student' ? '800' : '600', color: userType === 'student' ? '#059669' : '#0f172a' }}>Student</div>
                </div>

                <div
                  onClick={() => setUserType('fresher')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--rc-radius-lg)',
                    border: userType === 'fresher' ? '2px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                    background: userType === 'fresher' ? 'rgba(236, 253, 245, 0.9)' : 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: userType === 'fresher' ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                >
                  <Sparkles size={26} color={userType === 'fresher' ? '#059669' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: userType === 'fresher' ? '800' : '600', color: userType === 'fresher' ? '#059669' : '#0f172a' }}>Fresher</div>
                </div>

                <div
                  onClick={() => setUserType('experienced')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--rc-radius-lg)',
                    border: userType === 'experienced' ? '2px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                    background: userType === 'experienced' ? 'rgba(236, 253, 245, 0.9)' : 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: userType === 'experienced' ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                >
                  <Briefcase size={26} color={userType === 'experienced' ? '#059669' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: userType === 'experienced' ? '800' : '600', color: userType === 'experienced' ? '#059669' : '#0f172a' }}>Experienced</div>
                </div>

                <div
                  onClick={() => setUserType('employer')}
                  style={{
                    padding: '16px 12px',
                    borderRadius: 'var(--rc-radius-lg)',
                    border: userType === 'employer' ? '2px solid #059669' : '1px solid rgba(226, 232, 240, 0.9)',
                    background: userType === 'employer' ? 'rgba(236, 253, 245, 0.9)' : 'rgba(255, 255, 255, 0.65)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: userType === 'employer' ? '0 4px 14px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                >
                  <Building2 size={26} color={userType === 'employer' ? '#059669' : '#64748b'} style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '0.88rem', fontWeight: userType === 'employer' ? '800' : '600', color: userType === 'employer' ? '#059669' : '#0f172a' }}>Employer</div>
                </div>
              </div>

              <Input
                label="Full Name"
                placeholder="e.g. Arjun Verma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isRequired
              />

              <Input
                label="Email Address"
                placeholder="e.g. arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  padding: '14px 28px',
                  borderRadius: 'var(--rc-radius-lg)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                Create {userType.charAt(0).toUpperCase() + userType.slice(1)} Account <ArrowRight size={18} />
              </button>

              <div style={{ textAlign: 'center', color: '#64748b' }} className="rc-small">
                Already registered? <Link to="/login" style={{ color: '#059669', fontWeight: '700' }}>Sign In</Link>
              </div>
            </Stack>
          </form>
        </GlassCard>
      </PageContainer>
    </Section>
  );
}
