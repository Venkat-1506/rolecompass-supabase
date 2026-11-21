import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { Stack } from '../../components/layout/Stack.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Check, ArrowRight } from 'lucide-react';

export function ManualProfile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile, completeProfile } = useApp();

  const [fullName, setFullName] = useState(
    currentUser?.profile?.personal?.fullName || currentUser?.fullName || 'Arjun Verma',
  );
  const [email, setEmail] = useState(
    currentUser?.profile?.personal?.email || currentUser?.email || 'arjun@example.com',
  );
  const [phone, setPhone] = useState(currentUser?.profile?.personal?.phone || '+91 98765 43210');
  const [location, setLocation] = useState(
    currentUser?.profile?.personal?.location || 'Bengaluru, India',
  );
  const [degree, setDegree] = useState(
    currentUser?.profile?.education?.[0]?.degree || 'B.Tech Computer Science',
  );
  const [skills, setSkills] = useState(
    currentUser?.profile?.skills?.join(', ') || 'React, JavaScript, HTML/CSS, Git',
  );

  const handleSave = (e) => {
    e.preventDefault();
    const skillsList = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateProfile({
      personal: {
        fullName,
        email,
        phone,
        location,
        headline: `${degree} Candidate`,
      },
      education: [{ degree, institution: 'University / Institute', year: '2021 - 2025' }],
      skills: skillsList,
    });

    completeProfile();
    navigate('/onboarding/complete');
  };

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="lg">
        <OnboardingProgress currentStep="manual" variant="manual" />

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
            MANUAL PROFILE BUILDER
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
            Tell Us About Yourself
          </h1>

          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px' }}>
            Help us create a better profile for you.
          </p>
        </div>

        {/* 2-COLUMN MANUAL PROFILE LAYOUT */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 300px) 1fr',
            gap: '32px',
            maxWidth: '1080px',
            margin: '0 auto',
          }}
        >
          {/* LEFT: PROFILE STRENGTH & CHECKLIST */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255, 255, 255, 0.75)',
              boxShadow:
                '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              height: 'fit-content',
            }}
          >
            {/* STRENGTH RING */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#059669 0% 75%, #e2e8f0 75% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: '#059669',
                  }}
                >
                  75%
                </div>
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#0f172a' }}>
                Profile Strength
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                Good progress! Keep going.
              </div>
            </div>

            {/* CHECKLIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#059669',
                }}
              >
                <div
                  style={{
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>{' '}
                Basic Details
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#059669',
                }}
              >
                <div
                  style={{
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>{' '}
                Education
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: '#059669',
                }}
              >
                <div
                  style={{
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    padding: '2px',
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>{' '}
                Key Skills
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #cbd5e1',
                  }}
                />{' '}
                Work Experience
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #cbd5e1',
                  }}
                />{' '}
                Projects & Links
              </div>
            </div>
          </div>

          {/* RIGHT: FORM WORKSPACE */}
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
            <form onSubmit={handleSave}>
              <Stack gap="5">
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
                  Basic Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isRequired
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    isRequired
                  />
                  <Input
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    isRequired
                  />
                </div>

                <h2
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    marginTop: '12px',
                  }}
                >
                  Education & Skills
                </h2>

                <Input
                  label="Highest Education / Degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  isRequired
                />
                <Input
                  label="Top Technical Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  isRequired
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      background: '#059669',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '1rem',
                      padding: '14px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 18px rgba(5, 150, 105, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Save & Continue <ArrowRight size={18} />
                  </button>
                </div>
              </Stack>
            </form>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
