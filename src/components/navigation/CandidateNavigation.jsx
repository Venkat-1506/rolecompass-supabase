import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { UserProfileDropdown } from './UserProfileDropdown.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { fuzzyMatch } from '../../utils/helpers.js';
import { Search, X, Briefcase, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export function CandidateNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs = [], companies = [], roles = [], skills = [] } = useApp() || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const links = [
    { path: '/candidate', label: 'Overview', end: true },
    { path: '/candidate/roles', label: 'Roles & Fit' },
    { path: '/candidate/learning', label: 'Learning Hub' },
    { path: '/candidate/applications', label: 'Applications' },
    { path: '/jobs', label: 'Find Jobs' }
  ];

  // Sync searchQuery with URL query parameter when navigating to /jobs or /explore
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('search');
    if (q !== null && (location.pathname === '/jobs' || location.pathname === '/explore')) {
      setSearchQuery(q);
    }
  }, [location.pathname, location.search]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search matches
  const trimmed = searchQuery.trim().toLowerCase();

  const matchedJobs = useMemo(() => {
    if (!trimmed || trimmed.length < 2) return [];
    return (jobs || []).filter((j) => {
      if (!j) return false;
      const company = (companies || []).find((c) => c?.id === j.companyId);
      const companyName = company?.name || '';
      const matchTitle = fuzzyMatch(j.title, trimmed);
      const matchCompany = fuzzyMatch(companyName, trimmed);
      const matchSkills = Array.isArray(j.skills) && j.skills.some((s) => s && fuzzyMatch(s, trimmed));
      return matchTitle || matchCompany || matchSkills;
    }).slice(0, 3);
  }, [jobs, companies, trimmed]);

  const matchedRoles = useMemo(() => {
    if (!trimmed || trimmed.length < 2) return [];
    return (roles || []).filter((r) => {
      if (!r) return false;
      const matchTitle = fuzzyMatch(r.title, trimmed);
      const matchCategory = fuzzyMatch(r.category, trimmed);
      return matchTitle || matchCategory;
    }).slice(0, 2);
  }, [roles, trimmed]);

  const matchedSkills = useMemo(() => {
    if (!trimmed || trimmed.length < 2) return [];
    return (skills || []).filter((s) => {
      if (!s) return false;
      return fuzzyMatch(s.name, trimmed);
    }).slice(0, 2);
  }, [skills, trimmed]);

  const hasAnyMatches = matchedJobs.length > 0 || matchedRoles.length > 0 || matchedSkills.length > 0;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    inputRef.current?.blur();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleSelectJob = (jobId) => {
    setIsOpen(false);
    navigate(`/jobs/${jobId}`);
  };

  const handleSelectRole = (roleId) => {
    setIsOpen(false);
    navigate(`/candidate/roles/${roleId}`);
  };

  const handleSelectSkill = (skillId) => {
    setIsOpen(false);
    navigate(`/candidate/learning/${skillId}`);
  };

  const handleQuickChipClick = (keyword) => {
    setSearchQuery(keyword);
    setIsOpen(false);
    navigate(`/jobs?search=${encodeURIComponent(keyword)}`);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchQuery('');
    inputRef.current?.focus();
    if (location.pathname === '/jobs' && new URLSearchParams(location.search).get('search')) {
      navigate('/jobs');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '16px' }}>
      {/* 1. Main Navigation Links (Cleanly positioned first in visual hierarchy) */}
      <nav className="rc-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {links.map((l) => (
          <NavLink
            key={l.path}
            to={l.path}
            end={l.end}
            className={({ isActive }) => `rc-candidate-nav-link ${isActive ? 'rc-candidate-nav-link-active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* 2. Action Controls: Interactive Matching Search Bar + User Profile Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Quick Job/Skill Search Input in Navbar */}
        <div
          ref={searchContainerRef}
          style={{ position: 'relative' }}
          className="rc-hide-mobile"
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={15}
              color={isFocused ? '#059669' : '#64748b'}
              style={{
                position: 'absolute',
                left: '12px',
                pointerEvents: 'none',
                transition: 'color 0.2s ease',
                zIndex: 2
              }}
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search jobs, skills, roles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                setIsFocused(true);
                setIsOpen(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              aria-label="Search jobs, skills, and roles"
              aria-expanded={isOpen}
              style={{
                height: '40px',
                width: '235px',
                padding: searchQuery ? '0 36px 0 34px' : '0 14px 0 34px',
                fontSize: '0.86rem',
                fontWeight: '500',
                borderRadius: '12px',
                border: isFocused ? '1px solid #059669' : '1px solid rgba(226, 232, 240, 0.95)',
                background: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: '#0f172a',
                outline: 'none',
                boxShadow: isFocused
                  ? '0 0 0 3px rgba(5, 150, 105, 0.15), 0 4px 12px rgba(15, 23, 42, 0.05)'
                  : '0 2px 8px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.18s ease',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
            />

            {/* Clear Button (shown only when text is entered) */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search input"
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  borderRadius: '50%',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Live Search & Suggestions Dropdown ("It Matches") */}
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '360px',
                maxHeight: '440px',
                overflowY: 'auto',
                background: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderRadius: '16px',
                border: '1px solid rgba(226, 232, 240, 0.95)',
                boxShadow: '0 20px 40px -8px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(15, 23, 42, 0.04)',
                padding: '12px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'rcMobileMenuSlideDown 150ms ease forwards'
              }}
            >
              {/* When user has NOT typed anything yet: Show Suggested Topics */}
              {!trimmed && (
                <div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: '#64748b',
                      padding: '4px 6px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Sparkles size={12} color="#059669" /> Popular Searches
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {['React Developer', 'Frontend Engineer', 'Python', 'Remote Jobs', 'Full Stack'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleQuickChipClick(tag)}
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: '1px solid rgba(226, 232, 240, 0.9)',
                          background: 'rgba(248, 250, 252, 0.85)',
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(5, 150, 105, 0.4)';
                          e.currentTarget.style.color = '#059669';
                          e.currentTarget.style.background = 'rgba(236, 253, 245, 0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
                          e.currentTarget.style.color = '#334155';
                          e.currentTarget.style.background = 'rgba(248, 250, 252, 0.85)';
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* When query is typed: Show Matching Live Results */}
              {trimmed && (
                <>
                  {/* Matching Jobs Section */}
                  {matchedJobs.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#64748b',
                          padding: '4px 6px 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Briefcase size={12} color="#059669" /> Matching Jobs ({matchedJobs.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {matchedJobs.map((j) => {
                          const comp = (companies || []).find((c) => c?.id === j.companyId);
                          return (
                            <div
                              key={j.id}
                              onClick={() => handleSelectJob(j.id)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'background 0.15s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(241, 245, 249, 0.9)')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {j.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span>{comp?.name || 'Top Company'}</span>
                                  <span>•</span>
                                  <span>{j.location || 'Remote'}</span>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#059669', background: 'rgba(236, 253, 245, 0.9)', padding: '2px 7px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                                {j.salaryRange || j.salary || 'Active'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Matching Roles Section */}
                  {matchedRoles.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#64748b',
                          padding: '6px 6px 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderTop: '1px solid rgba(226, 232, 240, 0.7)'
                        }}
                      >
                        <Sparkles size={12} color="#0284c7" /> Career Roles
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {matchedRoles.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => handleSelectRole(r.id)}
                            style={{
                              padding: '7px 10px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(240, 249, 255, 0.9)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                              {r.title}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#0284c7', background: 'rgba(240, 249, 255, 0.95)', padding: '2px 6px', borderRadius: '5px', fontWeight: '600' }}>
                              Role Fit
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Skills Section */}
                  {matchedSkills.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#64748b',
                          padding: '6px 6px 4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderTop: '1px solid rgba(226, 232, 240, 0.7)'
                        }}
                      >
                        <BookOpen size={12} color="#8b5cf6" /> Skills & Learning
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {matchedSkills.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => handleSelectSkill(s.id)}
                            style={{
                              padding: '7px 10px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(245, 243, 255, 0.9)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <span style={{ fontSize: '0.84rem', fontWeight: '700', color: '#0f172a' }}>
                              {s.name}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#8b5cf6', background: 'rgba(245, 243, 255, 0.95)', padding: '2px 6px', borderRadius: '5px', fontWeight: '600' }}>
                              Skill Hub
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If no items matched */}
                  {!hasAnyMatches && (
                    <div style={{ padding: '14px 10px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      No direct items found for "<strong style={{ color: '#0f172a' }}>{searchQuery}</strong>".
                    </div>
                  )}

                  {/* Footer Action: View All Matching Jobs */}
                  <div
                    onClick={handleSearchSubmit}
                    style={{
                      borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                      paddingTop: '10px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'rgba(236, 253, 245, 0.5)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(236, 253, 245, 0.9)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(236, 253, 245, 0.5)')}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Search all jobs for "{searchQuery}" <ArrowRight size={13} />
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(255, 255, 255, 0.9)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(203, 213, 225, 0.6)' }}>
                      ↵ Enter
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <UserProfileDropdown mode="CANDIDATE" />
      </div>
    </div>
  );
}
