import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer.jsx';
import { Section } from '../../components/layout/Section.jsx';
import { OnboardingProgress } from '../../components/onboarding/OnboardingProgress.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { resumeService } from '../../services/resumeService.js';
import { FileText, Loader2, Sparkles, CheckCircle } from 'lucide-react';

const STEPS = [
  { label: 'Uploading Resume...', threshold: 0 },
  { label: 'Checking Document Format & Integrity...', threshold: 25 },
  { label: 'Extracting Skills, Experience & Education...', threshold: 55 },
  { label: 'Building RoleCompass Career Profile...', threshold: 85 },
];

export function ResumeProcessing() {
  const navigate = useNavigate();
  const { updateProfile, updateOnboardingStep, currentUser } = useApp();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) return undefined;

    const timer = window.setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 4);
      setProgress(progressRef.current);
      if (progressRef.current >= 100) window.clearInterval(timer);
    }, 90);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 100 || hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    const finish = async () => {
      try {
        const extracted = await resumeService.processResume(currentUser?.resume, currentUser);
        updateProfile({
          personal: extracted.personal,
          experience: extracted.experience,
          education: extracted.education,
          skills: extracted.skills,
          projects: extracted.projects,
          preferences: extracted.preferences,
        });
      } catch (error) {
        console.warn('[RoleCompass] Local resume extraction failed:', error);
      }

      updateOnboardingStep('review');
      navigate('/onboarding/review-profile', { replace: true });
    };

    finish();
  }, [progress, currentUser, navigate, updateOnboardingStep, updateProfile]);

  const currentStepIndex = useMemo(() => {
    let index = 0;
    STEPS.forEach((step, idx) => {
      if (progress >= step.threshold) index = idx;
    });
    return index;
  }, [progress]);

  return (
    <Section py="8" className="rc-onboarding-page">
      <PageContainer size="md">
        <OnboardingProgress currentStep="processing" variant="resume" />

        <div className="rc-resume-processing-card">
          <div className="rc-resume-visual" aria-hidden="true">
            <div className="rc-resume-orbit rc-resume-orbit-a" />
            <div className="rc-resume-orbit rc-resume-orbit-b" />
            <div className="rc-resume-scan-sweep" />
            <div className="rc-resume-core">
              <FileText size={34} />
            </div>
            <span className="rc-resume-dot rc-resume-dot-1" />
            <span className="rc-resume-dot rc-resume-dot-2" />
            <span className="rc-resume-dot rc-resume-dot-3" />
          </div>

          <div className="rc-resume-processing-heading">
            <span className="rc-resume-processing-badge">LOCAL DEMO EXTRACTION</span>
            <h1>Processing Your Resume</h1>
            <p>Preparing your local RoleCompass profile from the resume details you provided.</p>
          </div>

          <div className="rc-resume-progress-wrap">
            <div className="rc-resume-progress-meta">
              <span>{STEPS[currentStepIndex].label}</span>
              <span className="rc-resume-progress-value">{progress}%</span>
            </div>
            <div
              className="rc-resume-progress-track"
              role="progressbar"
              aria-label="Resume processing progress"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div className="rc-resume-progress-fill" style={{ width: `${progress}%` }}>
                <span className="rc-resume-progress-shimmer" />
              </div>
            </div>
          </div>

          <div className="rc-resume-step-list">
            {STEPS.map((step, idx) => {
              const isDone = idx < currentStepIndex || progress >= 100;
              const isCurrent = currentStepIndex === idx && progress < 100;

              return (
                <div
                  key={step.label}
                  className={`rc-resume-step ${isDone ? 'is-done' : ''} ${
                    isCurrent ? 'is-current' : ''
                  }`}
                  style={{ '--rc-step-delay': `${idx * 90}ms` }}
                >
                  <span className="rc-resume-step-icon">
                    {isDone ? (
                      <CheckCircle size={18} />
                    ) : isCurrent ? (
                      <Loader2 size={18} className="rc-animate-spin" />
                    ) : (
                      <span className="rc-resume-step-dot" />
                    )}
                  </span>
                  <span>{step.label.replace('...', '')}</span>
                </div>
              );
            })}
          </div>

          <div className="rc-resume-processing-note">
            <Sparkles size={14} /> Local demo extraction • no data leaves this browser
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
