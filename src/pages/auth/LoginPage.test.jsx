import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage.jsx';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  login: vi.fn(),
  signInWithOAuth: vi.fn(),
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
    isAuthenticated: true,
    isHydrating: false,
  }),
}));

vi.mock('../../app/router/RouteGuards.jsx', () => ({
  getStepRoute: (step) => `/onboarding/${step}`,
}));

describe('LoginPage authenticated redirect', () => {
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
});
