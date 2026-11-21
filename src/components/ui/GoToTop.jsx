import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import '../../styles/glass.css';

/**
 * GoToTop — Reusable RoleCompass Scroll-to-Top Button
 * - Appears after 280px scroll depth
 * - Smooth scroll with prefers-reduced-motion check
 * - Positioned above Mobile Bottom Navigation on mobile
 * - Accessible keyboard focus and ARIA labeling
 */
export function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Go to top"
      className="rc-go-to-top-btn"
      style={{
        position: 'fixed',
        zIndex: 90,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(5, 150, 105, 0.4)',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        color: '#059669',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
        transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isVisible ? 'auto' : 'none',
        outline: 'none',
      }}
    >
      <ArrowUp size={20} strokeWidth={2.4} />
    </button>
  );
}

export default GoToTop;
