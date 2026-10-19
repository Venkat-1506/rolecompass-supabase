import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PublicNavigation } from './PublicNavigation.jsx';
import { CandidateNavigation } from './CandidateNavigation.jsx';
import { EmployerNavigation } from './EmployerNavigation.jsx';
import { Badge } from '../ui/Badge.jsx';
import { useApp } from '../../app/providers/AppProviders.jsx';
import { Search } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.jsx';
import '../../styles/glass.css';
import '../../styles/responsive.css';

export function GlobalHeader({ mode = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useApp() || {};
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const headerRef = useRef(null);

  // Derive global header mode based on auth state & role (Requirement 1, 15)
  let currentMode = 'PUBLIC';
  if (isAuthenticated) {
    if (currentUser?.accountType === 'employer') {
      currentMode = 'EMPLOYER';
    } else {
      currentMode = 'CANDIDATE';
    }
  }

  // If explicit mode prop passed and unauthenticated, fallback to prop
  if (mode && !isAuthenticated) {
    currentMode = mode;
  }

  // Determine logo target destination based on active context (Requirement 10)
  const logoTarget = currentMode === 'EMPLOYER' ? '/employer' : (currentMode === 'CANDIDATE' ? '/candidate' : '/');

  // Scroll Listener for Dynamic Glass Intensity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    const q = mobileSearchQuery.trim();
    if (q) {
      navigate(`/jobs?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/jobs');
    }
  };

  // Keep search bar in sync when on jobs explore page
  useEffect(() => {
    if (location.pathname === '/jobs' || location.pathname === '/explore') {
      const params = new URLSearchParams(location.search);
      setMobileSearchQuery(params.get('search') || '');
    }
  }, [location.pathname, location.search]);

  // Publish live header height so mobile page shells can offset content correctly
  // (the guest mobile header grows to two rows on subpages when the search bar is present)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const apply = () => {
      const h = Math.round(el.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--rc-header-h', `${h}px`);
    };
    apply();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentMode, location.pathname]);

  return (
    <header
      ref={headerRef}
      className="rc-global-header"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 'var(--rc-z-header, 100)',
        borderRadius: 0,
        background: isScrolled ? 'rgba(235, 244, 245, 0.94)' : 'rgba(235, 244, 245, 0.82)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: isScrolled ? '0 8px 30px rgba(40, 70, 90, 0.08)' : '0 4px 20px rgba(40, 70, 90, 0.03)',
        transition: 'all 200ms ease'
      }}
    >
      {/* DESKTOP HEADER ROW (>= 768px): PRESERVED 100% UNCHANGED */}
      <div 
        className="rc-hide-mobile"
        style={{
          width: 'min(1280px, calc(100% - 32px))',
          margin: '0 auto',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}
      >
        {/* BRAND LOGO — DYNAMIC HOME LINK BY WORKSPACE (Requirement 10) */}
        <Link to={logoTarget} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <BrandLogo variant="horizontal" height="34px" />
          {currentMode !== 'PUBLIC' && (
            <Badge variant={currentMode === 'EMPLOYER' ? 'info' : 'success'}>
              {currentMode === 'EMPLOYER' ? 'EMPLOYER' : 'CANDIDATE'}
            </Badge>
          )}
        </Link>

        {/* DESKTOP NAVIGATION MODE */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginLeft: '24px', minWidth: 0 }}>
          {currentMode === 'PUBLIC' && <PublicNavigation />}
          {currentMode === 'CANDIDATE' && <CandidateNavigation />}
          {currentMode === 'EMPLOYER' && <EmployerNavigation />}
        </div>
      </div>

      {/* MOBILE HEADER ROW (< 768px): COMPACT SEARCH BAR + GUEST ACTIONS, NO REDUNDANT HAMBURGER */}
      <div className="rc-show-mobile rc-mobile-header-wrapper" style={{ width: '100%', boxSizing: 'border-box' }}>
        {currentMode === 'PUBLIC' ? (
          <div
            style={{
              width: '100%',
              padding: location.pathname === '/' ? '10px 14px' : '8px 12px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxSizing: 'border-box'
            }}
          >
            {/* Top Row: Brand Logo + Guest Auth Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                width: '100%'
              }}
            >
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <BrandLogo variant="horizontal" height="26px" />
              </Link>

              {/* Guest Authentication Actions: Login + Create Account */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.80rem',
                    fontWeight: '700',
                    color: '#0f172a',
                    textDecoration: 'none',
                    padding: '5px 9px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(203, 213, 225, 0.8)',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  style={{
                    fontSize: '0.80rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '5px 11px',
                    borderRadius: '8px',
                    background: '#059669',
                    border: '1px solid #059669',
                    boxShadow: '0 2px 6px rgba(5, 150, 105, 0.22)',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center'
                  }}
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Bottom Row: Compact Mobile Search Bar (subpages only, homepage features primary hero search) */}
            {location.pathname !== '/' && (
              <form
                onSubmit={handleMobileSearchSubmit}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  margin: 0
                }}
              >
                <Search
                  size={14}
                  color="#059669"
                  style={{ position: 'absolute', left: '11px', pointerEvents: 'none' }}
                />
                <input
                  type="text"
                  placeholder="Search jobs, skills, roles..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  aria-label="Search jobs, skills, roles"
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 10px 0 32px',
                    borderRadius: '10px',
                    border: '1px solid rgba(203, 213, 225, 0.9)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '0.82rem',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    color: '#0f172a',
                    outline: 'none',
                    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)',
                    boxSizing: 'border-box'
                  }}
                />
              </form>
            )}
          </div>
        ) : (
          /* Authenticated Candidate / Employer Mobile Header: Compact Logo + Search, NO Guest Buttons */
          <div
            style={{
              width: '100%',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              boxSizing: 'border-box',
              minHeight: '58px'
            }}
          >
            <Link to={logoTarget} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <BrandLogo variant="horizontal" height="26px" />
              <Badge variant={currentMode === 'EMPLOYER' ? 'info' : 'success'} style={{ fontSize: '0.62rem', padding: '2px 5px' }}>
                {currentMode === 'EMPLOYER' ? 'EMP' : 'CAND'}
              </Badge>
            </Link>

            <form
              onSubmit={handleMobileSearchSubmit}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                minWidth: 0,
                maxWidth: '240px',
                margin: 0
              }}
            >
              <Search
                size={14}
                color="#059669"
                style={{ position: 'absolute', left: '10px', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search jobs..."
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                aria-label="Search jobs"
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 10px 0 30px',
                  borderRadius: '10px',
                  border: '1px solid rgba(203, 213, 225, 0.9)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  fontSize: '0.82rem',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: '#0f172a',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)',
                  boxSizing: 'border-box'
                }}
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
