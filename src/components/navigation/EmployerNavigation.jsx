import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { UserProfileDropdown } from './UserProfileDropdown.jsx';

export function EmployerNavigation() {
  const links = [
    { path: '/employer', label: 'Overview', end: true },
    { path: '/employer/jobs', label: 'Jobs' },
    { path: '/employer/candidates', label: 'Candidates' },
    { path: '/employer/pipeline', label: 'Pipeline' },
    { path: '/employer/company', label: 'Company' }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '28px' }}>
      <nav className="rc-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {links.map(l => (
          <NavLink
            key={l.path}
            to={l.path}
            end={l.end}
            style={({ isActive }) => ({
              fontWeight: isActive ? '700' : '600',
              fontSize: '0.92rem',
              color: isActive ? '#0284c7' : '#475569',
              padding: '6px 12px',
              borderRadius: '8px',
              borderBottom: isActive ? '2px solid #0284c7' : '2px solid transparent',
              background: isActive ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
              textDecoration: 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <NavLink to="/employer/jobs/create" style={{ textDecoration: 'none' }}>
          <button style={{
            background: '#059669',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.88rem',
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
          }}>
            <Plus size={15} /> Post Job
          </button>
        </NavLink>
        <UserProfileDropdown mode="EMPLOYER" />
      </div>
    </div>
  );
}
