import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import {
  User,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  Bookmark,
  Send,
} from 'lucide-react';

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  borderRadius: '8px',
  fontSize: '0.86rem',
  fontWeight: 600,
  color: '#334155',
  textDecoration: 'none',
  transition: 'background 0.15s ease',
};

export function UserProfileDropdown() {
  const { currentUser, candidateUser, logout, calculateProfileCompletion } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fullName = candidateUser?.personal?.fullName || currentUser?.fullName || 'Candidate';
  const email = candidateUser?.personal?.email || currentUser?.email || '';
  const profileCompletion = calculateProfileCompletion
    ? calculateProfileCompletion(candidateUser)
    : 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
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
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.4)';
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
        }}
      >
        <Avatar name={fullName} size="sm" />
        <div
          style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}
          className="rc-hide-mobile"
        >
          <span
            style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.2' }}
          >
            {fullName.split(' ')[0]}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Candidate</span>
        </div>
        <ChevronDown
          size={14}
          color="#64748b"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

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
            gap: '12px',
          }}
        >
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}
            >
              <Avatar name={fullName} size="md" />
              <div style={{ overflow: 'hidden' }}>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fullName}
                </h4>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748b',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {email}
                </span>
              </div>
            </div>

            <div
              style={{
                background: '#f8fafc',
                padding: '8px 10px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '4px',
                }}
              >
                <span>Profile Completion</span>
                <span style={{ color: '#059669' }}>{profileCompletion}%</span>
              </div>
              <div
                style={{
                  height: '4px',
                  background: '#e2e8f0',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{ width: `${profileCompletion}%`, height: '100%', background: '#059669' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Link to="/candidate/profile" onClick={() => setIsOpen(false)} style={itemStyle}>
              <User size={16} color="#059669" /> Profile & Settings
            </Link>
            <Link to="/candidate/resume" onClick={() => setIsOpen(false)} style={itemStyle}>
              <FileText size={16} color="#0284c7" /> My Resume
            </Link>
            <Link to="/candidate/saved-jobs" onClick={() => setIsOpen(false)} style={itemStyle}>
              <Bookmark size={16} color="#d97706" /> Saved Jobs
            </Link>
            <Link to="/candidate/applications" onClick={() => setIsOpen(false)} style={itemStyle}>
              <Send size={16} color="#059669" /> Applications
            </Link>
            <Link to="/candidate/preferences" onClick={() => setIsOpen(false)} style={itemStyle}>
              <Settings size={16} color="#64748b" /> Career Preferences
            </Link>
            <Link to="/candidate/roles" onClick={() => setIsOpen(false)} style={itemStyle}>
              <Briefcase size={16} color="#7b2cbf" /> Job Match & Skill Gaps
            </Link>
          </div>

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
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#dc2626',
                background: 'rgba(254, 242, 242, 0.8)',
                border: '1px solid rgba(254, 202, 202, 0.8)',
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
