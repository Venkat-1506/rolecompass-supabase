import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers/AppProviders.jsx';
import {
  Compass,
  Briefcase,
  Send,
  BookOpen,
  MoreHorizontal,
  Building2,
  Users,
  GitMerge,
  Home,
  LogIn,
  X,
  User,
  Target,
  FileText,
  SlidersHorizontal,
  LogOut,
  ArrowRightLeft,
  Plus
} from 'lucide-react';
import '../../styles/glass.css';

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout, switchWorkspace } = useApp() || {};
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Determine user role
  let role = 'guest';
  if (isAuthenticated) {
    role = currentUser?.accountType === 'employer' ? 'employer' : 'candidate';
  }

  const handleSwitch = (targetRole) => {
    setDrawerOpen(false);
    if (switchWorkspace) {
      switchWorkspace(targetRole);
    }
    navigate(targetRole === 'employer' ? '/employer' : '/candidate');
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    if (logout) logout();
    navigate('/');
  };

  return (
    <>
      {/* ========================================================
          SLIDE-UP MORE OPTIONS DRAWER (FOR EXPANDED MOBILE ACTIONS)
         ======================================================== */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 98,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: 'calc(64px + env(safe-area-inset-bottom))',
              left: 0,
              right: 0,
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              borderTop: '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.15)',
              padding: '20px 24px 28px',
              maxHeight: '75vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b' }}>
                {role === 'employer' ? 'Employer Hub' : (role === 'candidate' ? 'Candidate Menu' : 'RoleCompass Menu')}
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(241, 245, 249, 0.8)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* CANDIDATE EXPANDED ITEMS */}
            {role === 'candidate' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink
                  to="/candidate/profile"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(248, 250, 252, 0.8)', color: '#0f172a', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <User size={18} color="#059669" /> Candidate Profile
                </NavLink>

                <NavLink
                  to="/candidate/roles"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(248, 250, 252, 0.8)', color: '#0f172a', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <Target size={18} color="#7b2cbf" /> Roles & Fit Matrix
                </NavLink>

                <NavLink
                  to="/candidate/resume"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(248, 250, 252, 0.8)', color: '#0f172a', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <FileText size={18} color="#0284c7" /> Resume Hub & ATS Audit
                </NavLink>

                <NavLink
                  to="/candidate/preferences"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(248, 250, 252, 0.8)', color: '#0f172a', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <SlidersHorizontal size={18} color="#d97706" /> Career Preferences
                </NavLink>

                <button
                  onClick={() => handleSwitch('employer')}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(236, 253, 245, 0.9)', border: '1px solid rgba(167, 243, 208, 0.8)', color: '#059669', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '6px' }}
                >
                  <ArrowRightLeft size={18} /> Switch to Employer View
                </button>

                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(254, 242, 242, 0.8)', border: '1px solid rgba(254, 202, 202, 0.8)', color: '#dc2626', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '4px' }}
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}

            {/* EMPLOYER EXPANDED ITEMS */}
            {role === 'employer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink
                  to="/employer/jobs/create"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(236, 253, 245, 0.9)', color: '#059669', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <Plus size={18} /> Post New Job
                </NavLink>

                <NavLink
                  to="/employer/company"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(248, 250, 252, 0.8)', color: '#0f172a', fontWeight: '700', fontSize: '0.92rem' }}
                >
                  <Building2 size={18} color="#0284c7" /> Company Setup & Profile
                </NavLink>

                <button
                  onClick={() => handleSwitch('candidate')}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(240, 249, 255, 0.9)', border: '1px solid rgba(186, 230, 253, 0.8)', color: '#0284c7', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '6px' }}
                >
                  <ArrowRightLeft size={18} /> Switch to Candidate View
                </button>

                <button
                  onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(254, 242, 242, 0.8)', border: '1px solid rgba(254, 202, 202, 0.8)', color: '#dc2626', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '4px' }}
                >
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          FIXED MOBILE BOTTOM NAVIGATION BAR
         ======================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="rc-mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(62px + env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(226, 232, 240, 0.85)',
          boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.08)',
          zIndex: 95,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          alignItems: 'center',
          justifyItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* MODEL A: CANDIDATE (5 DESTINATIONS) */}
        {role === 'candidate' && (
          <>
            <NavLink
              to="/candidate"
              end
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Compass size={20} />
              <span className="rc-mobile-nav-label">Dashboard</span>
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Briefcase size={20} />
              <span className="rc-mobile-nav-label">Jobs</span>
            </NavLink>

            <NavLink
              to="/candidate/applications"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Send size={20} />
              <span className="rc-mobile-nav-label">Applications</span>
            </NavLink>

            <NavLink
              to="/candidate/learning"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <BookOpen size={20} />
              <span className="rc-mobile-nav-label">Learning</span>
            </NavLink>

            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="More candidate destinations"
              className={`rc-mobile-nav-item ${drawerOpen ? 'rc-mobile-nav-item-active' : ''}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <MoreHorizontal size={20} />
              <span className="rc-mobile-nav-label">More</span>
            </button>
          </>
        )}

        {/* MODEL B: EMPLOYER (5 DESTINATIONS) */}
        {role === 'employer' && (
          <>
            <NavLink
              to="/employer"
              end
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Building2 size={20} />
              <span className="rc-mobile-nav-label">Overview</span>
            </NavLink>

            <NavLink
              to="/employer/jobs"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Briefcase size={20} />
              <span className="rc-mobile-nav-label">My Jobs</span>
            </NavLink>

            <NavLink
              to="/employer/candidates"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Users size={20} />
              <span className="rc-mobile-nav-label">Candidates</span>
            </NavLink>

            <NavLink
              to="/employer/pipeline"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <GitMerge size={20} />
              <span className="rc-mobile-nav-label">Pipeline</span>
            </NavLink>

            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="More employer options"
              className={`rc-mobile-nav-item ${drawerOpen ? 'rc-mobile-nav-item-active' : ''}`}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <MoreHorizontal size={20} />
              <span className="rc-mobile-nav-label">More</span>
            </button>
          </>
        )}

        {/* MODEL C: GUEST / PUBLIC (5 DESTINATIONS) */}
        {role === 'guest' && (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Home size={20} />
              <span className="rc-mobile-nav-label">Home</span>
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Briefcase size={20} />
              <span className="rc-mobile-nav-label">Jobs</span>
            </NavLink>

            <NavLink
              to="/companies"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Building2 size={20} />
              <span className="rc-mobile-nav-label">Companies</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <Compass size={20} />
              <span className="rc-mobile-nav-label">How It Works</span>
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) => `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`}
            >
              <LogIn size={20} />
              <span className="rc-mobile-nav-label">Sign In</span>
            </NavLink>
          </>
        )}
      </nav>
    </>
  );
}

export default MobileBottomNav;
