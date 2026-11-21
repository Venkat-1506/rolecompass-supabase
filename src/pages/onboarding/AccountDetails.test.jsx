import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AccountDetails } from './AccountDetails.jsx';

const mocks = vi.hoisted(() => ({
  registerAccount: vi.fn(),
}));

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({ registerAccount: mocks.registerAccount }),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/onboarding/account?path=fresher']}>
      <Routes>
        <Route path="/onboarding/account" element={<AccountDetails />} />
        <Route path="/onboarding/created" element={<div>Created screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillSignupForm(user, { password = 'password123', confirmPassword = password } = {}) {
  await user.type(screen.getByLabelText(/^Full Name/), 'Test Candidate');
  await user.type(screen.getByLabelText(/^Email Address/), 'test@example.com');
  await user.type(screen.getByLabelText(/^Password/), password);
  await user.type(screen.getByLabelText(/^Confirm Password/), confirmPassword);
}

describe('AccountDetails signup form', () => {
  beforeEach(() => {
    mocks.registerAccount.mockResolvedValue({
      requiresConfirmation: true,
      email: 'test@example.com',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows a field-level error and does not submit when passwords do not match', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillSignupForm(user, { confirmPassword: 'different123' });
    await user.click(screen.getByRole('button', { name: /Create Fresher Account/ }));

    expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument();
    expect(mocks.registerAccount).not.toHaveBeenCalled();
  });

  it('toggles visibility for password and confirm password independently', async () => {
    const user = userEvent.setup();
    renderPage();

    await fillSignupForm(user);

    const password = screen.getByLabelText(/^Password/);
    const confirmPassword = screen.getByLabelText(/^Confirm Password/);

    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');
    expect(confirmPassword).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show confirm password' }));
    expect(confirmPassword).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    await user.click(screen.getByRole('button', { name: 'Hide confirm password' }));

    expect(password).toHaveAttribute('type', 'password');
    expect(confirmPassword).toHaveAttribute('type', 'password');
  });

  it('submits matching passwords once without sending the confirmation value', async () => {
    const user = userEvent.setup();
    let resolveSignup;
    mocks.registerAccount.mockReturnValue(
      new Promise((resolve) => {
        resolveSignup = resolve;
      }),
    );
    renderPage();

    await fillSignupForm(user);
    const submit = screen.getByRole('button', { name: /Create Fresher Account/ });
    await user.click(submit);
    await user.click(submit);

    expect(mocks.registerAccount).toHaveBeenCalledTimes(1);
    expect(mocks.registerAccount).toHaveBeenCalledWith({
      fullName: 'Test Candidate',
      email: 'test@example.com',
      password: 'password123',
      accountType: 'fresher',
    });

    resolveSignup({ requiresConfirmation: true, email: 'test@example.com' });
    expect(await screen.findByText(/Check your email to confirm/)).toBeInTheDocument();
  });

  it('shows Supabase errors without reporting success', async () => {
    const user = userEvent.setup();
    mocks.registerAccount.mockRejectedValue(new Error('Email already registered'));
    renderPage();

    await fillSignupForm(user);
    await user.click(screen.getByRole('button', { name: /Create Fresher Account/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already registered');
    expect(screen.queryByText(/Check your email to confirm/)).not.toBeInTheDocument();
    await waitFor(() => expect(mocks.registerAccount).toHaveBeenCalledTimes(1));
  });
});
