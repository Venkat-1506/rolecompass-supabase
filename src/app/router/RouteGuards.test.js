import { describe, expect, it } from 'vitest';
import { getStepRoute } from './RouteGuards.jsx';

describe('getStepRoute', () => {
  it('routes guest-only onboarding steps to the created step for authenticated users', () => {
    expect(getStepRoute('path')).toBe('/onboarding/created');
    expect(getStepRoute('account')).toBe('/onboarding/created');
  });

  it('maps the remaining onboarding steps to their candidate routes', () => {
    expect(getStepRoute('created')).toBe('/onboarding/created');
    expect(getStepRoute('profile-method')).toBe('/onboarding/method');
    expect(getStepRoute('resume-upload')).toBe('/onboarding/resume-upload');
    expect(getStepRoute('review')).toBe('/onboarding/review-profile');
    expect(getStepRoute('manual')).toBe('/onboarding/manual-profile');
    expect(getStepRoute('complete')).toBe('/onboarding/complete');
    expect(getStepRoute('unknown')).toBe('/onboarding/created');
  });
});
