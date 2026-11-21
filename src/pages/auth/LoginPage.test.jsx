import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage.jsx';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  login: vi.fn(),
  signInWithOAuth: vi.fn(),
  getSupabaseSession: vi.fn(),
  isAuthenticated: true,
  currentUser: {
    id: 'auth-user-1',
    email: 'candidate@example.com',
    profileCompleted: false,
    onboardingStep: 'created',
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mocks.navigate };
});

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    login: mocks.login,
    signInWithOAuth: mocks.signInWithOAuth,
    isSupabaseConfigured: true,
    currentUser: mocks.currentUser,
    isAuthenticated: mocks.isAuthenticated,
    isHydrating: false,
  }),
}));

vi.mock('../../services/auth/supabaseAuthService.js', () => ({
  accountFromAuthUser: (user) => ({
    id: user.id,
    email: user.email,
    profileCompleted: false,
    onboardingStep: 'created',
  }),
  getSupabaseSession: mocks.getSupabaseSession,
}));

vi.mock('../../app/router/RouteGuards.jsx', () => ({
  getStepRoute: (step) => `/onboarding/${step}`,
}));

describe('LoginPage authenticated redirect', () => {
  beforeEach(() => {
    mocks.isAuthenticated = true;
    mocks.currentUser = {
      id: 'auth-user-1',
      email: 'candidate@example.com',
      profileCompleted: false,
      onboardingStep: 'created',
    };
    mocks.getSupabaseSession.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('moves an OAuth-authenticated user to the next onboarding step', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/onboarding/created', { replace: true });
    });
  });

  it('redirects from a Supabase session when provider state has not synced', async () => {
    mocks.isAuthenticated = false;
    mocks.currentUser = null;
    mocks.getSupabaseSession.mockResolvedValue({
      user: { id: 'oauth-user-1', email: 'oauth@example.com' },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/onboarding/created', { replace: true });
    });
  });
});
