import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { CandidateNavigation } from './CandidateNavigation.jsx';
import { UserProfileDropdown } from './UserProfileDropdown.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';

vi.mock('../../app/providers/AppProviders.jsx', () => ({
  useApp: () => ({
    isAuthenticated: true,
    currentUser: { fullName: 'Test Candidate', email: 'test@rolecompass.demo' },
    candidateUser: { personal: { fullName: 'Test Candidate', email: 'test@rolecompass.demo' } },
    jobs: [],
    companies: [],
    roles: [],
    skills: [],
    calculateProfileCompletion: () => 60,
    logout: vi.fn(),
  }),
}));

describe('candidate navigation', () => {
  it('keeps profile, resume, and saved jobs out of the desktop navbar', () => {
    render(
      <MemoryRouter>
        <CandidateNavigation />
      </MemoryRouter>,
    );

    const nav = screen.getByRole('navigation');
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);

    expect(labels).toEqual(['Dashboard', 'Find Jobs', 'Job Match', 'Learning', 'Applications']);
    expect(screen.queryByRole('link', { name: 'My Resume' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Saved Jobs' })).not.toBeInTheDocument();
  });

  it('retains profile, resume, and saved jobs in the user dropdown', async () => {
    render(
      <MemoryRouter>
        <UserProfileDropdown />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'User profile menu' }));

    expect(await screen.findByRole('link', { name: 'Profile & Settings' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Resume' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Saved Jobs' })).toBeInTheDocument();
  });

  it('retains profile, resume, and saved jobs in the mobile More drawer', () => {
    render(
      <MemoryRouter>
        <MobileBottomNav />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'More candidate destinations' }));

    expect(screen.getByRole('link', { name: 'Profile & Settings' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'My Resume' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Saved Jobs' })).toBeInTheDocument();
  });
});
