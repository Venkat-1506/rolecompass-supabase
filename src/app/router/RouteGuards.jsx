import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useApp } from '../providers/AppProviders.jsx';

export function RouteFallback({ label = 'Loading page…' }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '12px',
        color: '#059669',
      }}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="rc-animate-spin" size={36} />
      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{label}</div>
    </div>
  );
}

function HydrationLoader() {
  return <RouteFallback label="Restoring session..." />;
}

export function getStepRoute(step) {
  switch (step) {
    case 'path':
    case 'account':
    case 'created':
      return '/onboarding/created';
    case 'method':
    case 'profile-method':
      return '/onboarding/method';
    case 'upload':
    case 'resume-upload':
      return '/onboarding/resume-upload';
    case 'processing':
    case 'resume-processing':
      return '/onboarding/resume-processing';
    case 'review':
    case 'profile-review':
      return '/onboarding/review-profile';
    case 'manual':
    case 'manual-profile':
      return '/onboarding/manual-profile';
    case 'complete':
      return '/onboarding/complete';
    default:
      return '/onboarding/created';
  }
}

export function GuestRoute() {
  const { isAuthenticated, isHydrating, currentUser } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  if (isHydrating) return <HydrationLoader />;

  if (isAuthenticated && currentUser) {
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
      return <Navigate to={redirectUrl} replace />;
    }
    if (currentUser.profileCompleted) {
      return <Navigate to="/candidate" replace />;
    }
    return <Navigate to={getStepRoute(currentUser.onboardingStep)} replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const { isAuthenticated, isHydrating, currentUser } = useApp();
  const location = useLocation();

  if (isHydrating) return <HydrationLoader />;

  if (!isAuthenticated || !currentUser) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (!currentUser.profileCompleted) {
    return <Navigate to={getStepRoute(currentUser.onboardingStep)} replace />;
  }

  return <Outlet />;
}

export function OnboardingRoute() {
  const { isAuthenticated, isHydrating, currentUser } = useApp();

  if (isHydrating) return <HydrationLoader />;

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.profileCompleted) {
    return <Navigate to="/candidate" replace />;
  }

  return <Outlet />;
}
