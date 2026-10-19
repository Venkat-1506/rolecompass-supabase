import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { resumeService } from '../../services/resumeService.js';
import { FileText, Loader2, Sparkles, CheckCircle } from 'lucide-react';

export function ResumeProcessing() {
  const navigate = useNavigate();
  const { updateProfile, updateOnboardingStep, currentUser } = useApp();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: 'Uploading Resume...', minProgress: 0 },
    { label: 'Checking Document Format & Integrity...', minProgress: 25 },
    { label: 'Extracting Skills, Experience & Education...', minProgress: 55 },
    { label: 'Building RoleCompass Career Profile...', minProgress: 85 }
  ];

  useEffect(() => {
    let timer;

    const runExtraction = async () => {
      // Process resume via parsing service abstraction
      const extracted = await resumeService.processResume(currentUser?.resume, currentUser);

      // Save extracted profile into central state
      updateProfile({
        personal: extracted.personal,
        experience: extracted.experience,
        education: extracted.education,
        skills: extracted.skills,
        projects: extracted.projects,
        preferences: extracted.preferences,
        confidenceScore: extracted.confidenceScore
      });

      updateOnboardingStep('review');

      setTimeout(() => {
        navigate('/onboarding/review-profile');
      }, 500);
    };

    timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          runExtraction();
          return 100;
        }

        const next = prev + 5;
        if (next >= 85) setCurrentStepIndex(3);
        else if (next >= 55) setCurrentStepIndex(2);
        else if (next >= 25) setCurrentStepIndex(1);
        else setCurrentStepIndex(0);

        return next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="md">
        <OnboardingProgress currentStep="processing" variant="resume" />

        <div style={{
          background: 'rgba(255, 255, 255, 0.48)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderRadius: '24px',
          padding: '52px 40px',
          border: '1px solid rgba(255, 255, 255, 0.75)',
          boxShadow: '0 10px 30px 0 rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          maxWidth: '640px',
          margin: '20px auto 0',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px'
        }}>
          {/* FLOATING DOCUMENT ICON & PROGRESS RING */}
          <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '4px solid rgba(236, 253, 245, 0.9)',
              borderTopColor: '#059669',
              animation: 'rcProgressRingSpin 1.8s linear infinite'
            }} />
            
            <div className="rc-animate-float-1" style={{
              width: '74px',
              height: '74px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 28px rgba(5, 150, 105, 0.35)'
            }}>
              <FileText size={36} />
            </div>
          </div>

          {/* HEADINGS */}
          <div>
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: 'clamp(2rem, 3.2vw, 2.5rem)',
              fontWeight: '800',
              color: '#0f172a',
              letterSpacing: '-0.02em'
            }}>
              Processing Your Resume
            </h1>
            <p style={{ color: '#475569', fontSize: '1rem', marginTop: '8px' }}>
              We're analyzing your resume and extracting your professional information.
            </p>
          </div>

          {/* PROGRESS PERCENTAGE & BAR */}
          <div style={{ width: '100%', maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
              <span>{steps[currentStepIndex].label}</span>
              <span style={{ color: '#059669' }}>{progress}%</span>
            </div>

            <div style={{
              height: '10px',
              width: '100%',
              background: 'rgba(226, 232, 240, 0.8)',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '2px',
              border: '1px solid rgba(203, 213, 225, 0.6)'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #059669 0%, #B8F23A 100%)',
                borderRadius: '8px',
                transition: 'width 150ms linear'
              }} />
            </div>
          </div>

          {/* STATUS STEPS CHECKLIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '380px', textAlign: 'left' }}>
            {steps.map((step, idx) => {
              const isDone = progress >= step.minProgress + 25;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.85rem',
                  fontWeight: isCurrent ? '800' : '600',
                  color: isDone ? '#0f172a' : isCurrent ? '#059669' : '#94a3b8',
                  transition: 'all 200ms ease'
                }}>
                  {isDone ? (
                    <CheckCircle size={18} color="#059669" />
                  ) : isCurrent ? (
                    <Loader2 size={18} className="rc-animate-spin" color="#059669" />
                  ) : (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                  )}
                  <span>{step.label.replace('...', '')}</span>
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#059669" /> Structured Profile Extraction Service Active
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
