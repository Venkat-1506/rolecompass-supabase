import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProtectedRoute } from './RouteGuards.jsx';

const mockState = vi.hoisted(() => ({ value: {} }));

vi.mock('../providers/AppProviders.jsx', () => ({
  useApp: () => mockState.value,
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter initialEntries={['/candidate']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/candidate" element={<div>Candidate dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login screen</div>} />
        <Route path="/onboarding/created" element={<div>Account created screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockState.value = { isAuthenticated: false, isHydrating: false, currentUser: null };
  });

  it('redirects unauthenticated users to login', () => {
    renderProtectedRoute();

    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Candidate dashboard')).not.toBeInTheDocument();
  });

  it('redirects incomplete profiles to the correct onboarding step', () => {
    mockState.value = {
      isAuthenticated: true,
      isHydrating: false,
      currentUser: { profileCompleted: false, onboardingStep: 'path' },
    };

    renderProtectedRoute();

    expect(screen.getByText('Account created screen')).toBeInTheDocument();
  });

  it('renders candidate routes for completed profiles', () => {
    mockState.value = {
      isAuthenticated: true,
      isHydrating: false,
      currentUser: { profileCompleted: true, onboardingStep: 'complete' },
    };

    renderProtectedRoute();

    expect(screen.getByText('Candidate dashboard')).toBeInTheDocument();
  });
});
