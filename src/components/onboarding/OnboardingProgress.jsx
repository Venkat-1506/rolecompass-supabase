import React from 'react';
import { Check } from 'lucide-react';

export function OnboardingProgress({ currentStep = 'path', variant = 'standard' }) {
  // Define step configurations based on variant or unified journey
  const getSteps = () => {
    if (variant === 'resume') {
      return [
        { id: 'path', label: 'Path' },
        { id: 'account', label: 'Account' },
        { id: 'upload', label: 'Upload' },
        { id: 'processing', label: 'Processing' },
        { id: 'review', label: 'Review' },
        { id: 'complete', label: 'Complete' },
      ];
    }
    if (variant === 'manual') {
      return [
        { id: 'path', label: 'Path' },
        { id: 'account', label: 'Account' },
        { id: 'method', label: 'Method' },
        { id: 'manual', label: 'Profile' },
        { id: 'complete', label: 'Complete' },
      ];
    }
    // Default Candidate Journey
    return [
      { id: 'path', label: 'Path' },
      { id: 'account', label: 'Account' },
      { id: 'method', label: 'Profile Setup' },
      { id: 'complete', label: 'Complete' },
    ];
  };

  const steps = getSteps();

  const getStepStatus = (stepId, index) => {
    const stepOrder = steps.map((s) => s.id);
    const currentIndex = stepOrder.indexOf(currentStep);

    // Fallback logic for intermediate states like 'created'
    let effectiveCurrentIndex = currentIndex;
    if (currentStep === 'created') effectiveCurrentIndex = stepOrder.indexOf('account');
    if (
      currentStep === 'upload' ||
      currentStep === 'processing' ||
      currentStep === 'review' ||
      currentStep === 'manual'
    ) {
      const profileIndex =
        stepOrder.indexOf('method') !== -1
          ? stepOrder.indexOf('method')
          : stepOrder.indexOf('upload');
      if (profileIndex !== -1 && currentIndex === -1) effectiveCurrentIndex = profileIndex;
    }

    if (index < effectiveCurrentIndex) return 'completed';
    if (index === effectiveCurrentIndex || stepId === currentStep) return 'active';
    return 'future';
  };

  return (
    <div className="rc-onboarding-progress-container" aria-label="Onboarding Progress">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id, index);
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className={`rc-progress-step ${status}`}>
              <div className="rc-step-badge">
                {status === 'completed' ? <Check size={14} strokeWidth={3} /> : index + 1}
              </div>
              <span
                style={{ fontSize: '0.82rem', fontWeight: status === 'active' ? '800' : '600' }}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`rc-progress-connector ${status === 'completed' ? 'active' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
