import React, { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/animations.css';

/**
 * Wraps routed content so every navigation plays a directional page-enter
 * animation plus a top progress sweep, and resets scroll position.
 *
 * Direction is inferred from route depth:
 * - forward  → deeper route (e.g. /jobs → /jobs/42): glide up
 * - back     → shallower route (e.g. /jobs/42 → /jobs): settle down
 * - lateral  → sibling route at the same depth: soft drift
 */
export function PageTransition({ children }) {
  const location = useLocation();
  const routeKey = `${location.pathname}${location.search}`;

  const prevDepthRef = useRef(null);
  const depth = location.pathname.split('/').filter(Boolean).length;

  let direction = 'lateral';
  if (prevDepthRef.current === null || depth > prevDepthRef.current) {
    direction = 'forward';
  } else if (depth < prevDepthRef.current) {
    direction = 'back';
  }

  useLayoutEffect(() => {
    prevDepthRef.current = depth;
  }, [depth]);

  useLayoutEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  return (
    <React.Fragment key={routeKey}>
      <span key={`progress-${routeKey}`} className="rc-page-progress" aria-hidden="true" />
      <div key={`view-${routeKey}`} className={`rc-page-transition rc-page-enter-${direction}`}>
        {children}
      </div>
    </React.Fragment>
  );
}
