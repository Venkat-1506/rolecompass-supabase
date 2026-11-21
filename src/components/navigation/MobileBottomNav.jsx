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
  Home,
  LogIn,
  X,
  User,
  Target,
  FileText,
  SlidersHorizontal,
  LogOut,
  Bookmark,
} from 'lucide-react';
import '../../styles/glass.css';

const drawerItemStyle = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  padding: '12px 14px',
  borderRadius: '12px',
  background: 'rgba(248, 250, 252, 0.8)',
  color: '#0f172a',
  fontWeight: 700,
  fontSize: '0.92rem',
};

export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useApp() || {};
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const role = isAuthenticated && currentUser ? 'candidate' : 'guest';

  const handleLogout = () => {
    setDrawerOpen(false);
    if (logout) logout();
    navigate('/');
  };

  return (
    <>
      {drawerOpen && role === 'candidate' && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 98,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
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
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <div
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#64748b',
                }}
              >
                Candidate Menu
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
                  color: '#64748b',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <NavLink to="/candidate/profile" style={drawerItemStyle}>
                <User size={18} color="#059669" /> Profile & Settings
              </NavLink>
              <NavLink to="/candidate/roles" style={drawerItemStyle}>
                <Target size={18} color="#7b2cbf" /> Job Match & Skill Gaps
              </NavLink>
              <NavLink to="/candidate/resume" style={drawerItemStyle}>
                <FileText size={18} color="#0284c7" /> My Resume
              </NavLink>
              <NavLink to="/candidate/saved-jobs" style={drawerItemStyle}>
                <Bookmark size={18} color="#d97706" /> Saved Jobs
              </NavLink>
              <NavLink to="/candidate/preferences" style={drawerItemStyle}>
                <SlidersHorizontal size={18} color="#d97706" /> Career Preferences
              </NavLink>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(254, 242, 242, 0.8)',
                  border: '1px solid rgba(254, 202, 202, 0.8)',
                  color: '#dc2626',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  marginTop: '4px',
                }}
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

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
          boxSizing: 'border-box',
        }}
      >
        {role === 'candidate' ? (
          <>
            <NavLink
              to="/candidate"
              end
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Compass size={20} />
              <span className="rc-mobile-nav-label">Dashboard</span>
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Briefcase size={20} />
              <span className="rc-mobile-nav-label">Jobs</span>
            </NavLink>

            <NavLink
              to="/candidate/applications"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Send size={20} />
              <span className="rc-mobile-nav-label">Applications</span>
            </NavLink>

            <NavLink
              to="/candidate/learning"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
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
        ) : (
          <>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Home size={20} />
              <span className="rc-mobile-nav-label">Home</span>
            </NavLink>

            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Briefcase size={20} />
              <span className="rc-mobile-nav-label">Jobs</span>
            </NavLink>

            <NavLink
              to="/companies"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Building2 size={20} />
              <span className="rc-mobile-nav-label">Companies</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
            >
              <Compass size={20} />
              <span className="rc-mobile-nav-label">How It Works</span>
            </NavLink>

            <NavLink
              to="/login"
              className={({ isActive }) =>
                `rc-mobile-nav-item ${isActive ? 'rc-mobile-nav-item-active' : ''}`
              }
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
