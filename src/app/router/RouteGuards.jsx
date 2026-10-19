import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../providers/AppProviders.jsx';
import { Loader2 } from 'lucide-react';

function HydrationLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '12px',
      color: '#059669'
    }}>
      <Loader2 className="rc-animate-spin" size={36} />
      <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
        Restoring RoleCompass Session...
      </div>
    </div>
  );
}

// Maps onboardingStep to route path
export function getStepRoute(step) {
  switch (step) {
    case 'path': return '/onboarding/path';
    case 'account': return '/onboarding/account';
    case 'created': return '/onboarding/created';
    case 'method': case 'profile-method': return '/onboarding/method';
    case 'upload': case 'resume-upload': return '/onboarding/resume-upload';
    case 'processing': case 'resume-processing': return '/onboarding/resume-processing';
    case 'review': case 'profile-review': return '/onboarding/review-profile';
    case 'manual': case 'manual-profile': return '/onboarding/manual-profile';
    case 'complete': return '/onboarding/complete';
    default: return '/onboarding/created';
  }
}

// GuestRoute: Unauthenticated users only. Redirects authenticated users away from /login & /signup
export function GuestRoute() {
  const { isAuthenticated, isHydrating, currentUser } = useApp();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect');

  if (isHydrating) return <HydrationLoader />;

  if (isAuthenticated && currentUser) {
    // If guest was logging in to access a specific target job or internal page, honour that target!
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
      return <Navigate to={redirectUrl} replace />;
    }

    if (currentUser.accountType === 'employer') {
      return <Navigate to="/employer" replace />;
    }
    if (currentUser.profileCompleted) {
      return <Navigate to="/candidate" replace />;
    }
    return <Navigate to={getStepRoute(currentUser.onboardingStep)} replace />;
  }

  return <Outlet />;
}

// ProtectedRoute: Authenticated users only. Redirects unauthenticated users to /login
export function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, isHydrating, currentUser } = useApp();

  if (isHydrating) return <HydrationLoader />;

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.accountType !== allowedRole && allowedRole !== 'candidate') {
    if (currentUser.accountType === 'employer') {
      return <Navigate to="/employer" replace />;
    }
  }

  // Candidate with incomplete profile accessing protected candidate area -> send back to onboarding
  if (currentUser.accountType !== 'employer' && !currentUser.profileCompleted) {
    return <Navigate to={getStepRoute(currentUser.onboardingStep)} replace />;
  }

  return <Outlet />;
}

// OnboardingRoute: Authenticated candidates completing their profile setup
export function OnboardingRoute() {
  const { isAuthenticated, isHydrating, currentUser } = useApp();

  if (isHydrating) return <HydrationLoader />;

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.accountType === 'employer') {
    return <Navigate to="/employer" replace />;
  }

  if (currentUser.profileCompleted) {
    return <Navigate to="/candidate" replace />;
  }

  return <Outlet />;
}
