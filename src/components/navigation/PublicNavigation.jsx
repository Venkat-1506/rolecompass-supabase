import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { UserProfileDropdown } from './UserProfileDropdown.jsx';

export function PublicNavigation() {
  const { isAuthenticated } = useApp() || {};

  const publicLinks = [
    { path: '/jobs', label: 'Explore Jobs' },
    { path: '/companies', label: 'Companies' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '28px',
      }}
    >
      <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {publicLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className="rc-nav-link"
            style={({ isActive }) => ({
              fontSize: '0.92rem',
              fontWeight: isActive ? '700' : '600',
              color: isActive ? '#059669' : '#334155',
              textDecoration: 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              padding: '6px 14px',
              borderRadius: '8px',
              transition: 'all 0.15s ease',
              background: isActive ? 'rgba(5, 150, 105, 0.09)' : 'transparent',
              border: isActive ? '1px solid rgba(167, 243, 208, 0.6)' : '1px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {isAuthenticated ? (
        <UserProfileDropdown />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink
            to="/login"
            style={({ isActive }) => ({
              fontSize: '0.92rem',
              fontWeight: isActive ? '700' : '600',
              color: isActive ? '#059669' : '#334155',
              textDecoration: 'none',
              padding: '8px 16px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              borderRadius: '10px',
              transition: 'all 0.15s ease',
            })}
          >
            Log in
          </NavLink>

          <NavLink to="/signup" style={{ textDecoration: 'none' }}>
            <button
              style={{
                height: '42px',
                background: '#059669',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.9rem',
                padding: '0 22px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Create Account
            </button>
          </NavLink>
        </div>
      )}
    </div>
  );
}
