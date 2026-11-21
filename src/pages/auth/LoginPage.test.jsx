import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from './LoginPage.jsx';

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  signInWithOAuth: vi.fn(),
}));

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    login: mocks.login,
    signInWithOAuth: mocks.signInWithOAuth,
    isSupabaseConfigured: true,
  }),
}));

vi.mock('../../app/router/RouteGuards.jsx', () => ({
  getStepRoute: () => '/onboarding/account',
}));

describe('LoginPage OAuth', () => {
  beforeEach(() => {
    mocks.signInWithOAuth.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts LinkedIn OAuth with the Supabase LinkedIn OIDC provider', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /LinkedIn/ }));

    expect(mocks.signInWithOAuth).toHaveBeenCalledWith('linkedin_oidc');
    expect(mocks.login).not.toHaveBeenCalled();
  });
});
