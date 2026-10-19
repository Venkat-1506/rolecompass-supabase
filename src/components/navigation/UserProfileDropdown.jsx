import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Badge } from '../ui/Badge.jsx';
import { 
  User, FileText, Briefcase, Settings, LogOut, ChevronDown, 
  Building2, ArrowRightLeft, ShieldCheck, Sparkles 
} from 'lucide-react';

export function UserProfileDropdown({ mode = 'AUTO' }) {
  const { 
    currentUser, 
    candidateUser, 
    employerUser, 
    logout, 
    switchWorkspace, 
    calculateProfileCompletion 
  } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isEmployer = mode === 'EMPLOYER' || (mode === 'AUTO' && currentUser?.accountType === 'employer');

  const fullName = isEmployer 
    ? (employerUser?.personal?.fullName || currentUser?.fullName || "Priya Sundaram")
    : (candidateUser?.personal?.fullName || currentUser?.fullName || "Arjun Verma");

  const email = isEmployer
    ? (employerUser?.personal?.email || currentUser?.email || "priya.s@zoho.com")
    : (candidateUser?.personal?.email || currentUser?.email || "arjun.verma@example.com");

  const companyName = employerUser?.company?.name || "Zoho Corporation";
  const profileCompletion = calculateProfileCompletion ? calculateProfileCompletion(candidateUser) : 90;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const handleSwitchWorkspace = (targetRole) => {
    setIsOpen(false);
    if (switchWorkspace) {
      switchWorkspace(targetRole);
    }
    navigate(targetRole === 'employer' ? '/employer' : '/candidate');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="User profile menu"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          borderRadius: '12px',
          padding: '6px 12px 6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.4)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)'}
      >
        <Avatar name={fullName} size="sm" />
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="rc-hide-mobile">
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}>
            {fullName.split(' ')[0]}
          </span>
          <span style={{ fontSize: '0.72rem', color: isEmployer ? '#0284c7' : '#059669', fontWeight: 700 }}>
            {isEmployer ? 'Employer Portal' : 'Candidate'}
          </span>
        </div>
        <ChevronDown size={14} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Glass Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '280px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.15)',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {/* User Profile Summary */}
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Avatar name={fullName} size="md" />
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {fullName}
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email}
                </span>
              </div>
            </div>

            {/* Candidate Completion Bar OR Employer Organization Card */}
            {!isEmployer ? (
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>Profile Completion</span>
                  <span style={{ color: '#059669' }}>{profileCompletion}%</span>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${profileCompletion}%`, height: '100%', background: '#059669' }} />
                </div>
              </div>
            ) : (
              <div style={{ background: '#f0f9ff', padding: '8px 10px', borderRadius: '10px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={15} color="#0284c7" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369a1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {companyName}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {!isEmployer ? (
              <>
                <Link
                  to="/candidate/profile"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <User size={16} color="#059669" /> My Profile
                </Link>

                <Link
                  to="/candidate/resume"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <FileText size={16} color="#0284c7" /> Resume & ATS Hub
                </Link>

                <Link
                  to="/candidate/applications"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Briefcase size={16} color="#059669" /> Saved & Applied Jobs
                </Link>

                <Link
                  to="/candidate/preferences"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={16} color="#64748b" /> Career Preferences
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/employer/company"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Building2 size={16} color="#0284c7" /> Company Profile
                </Link>

                <Link
                  to="/employer/company"
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#334155',
                    textDecoration: 'none',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Settings size={16} color="#64748b" /> Settings
                </Link>

                <button
                  type="button"
                  onClick={() => handleSwitchWorkspace('candidate')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                >
                  <ArrowRightLeft size={15} /> 
                  Switch to Candidate Workspace
                </button>
              </>
            )}
          </div>

          {/* Logout Action Button */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#dc2626',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
