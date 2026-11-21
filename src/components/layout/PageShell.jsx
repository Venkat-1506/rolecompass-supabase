import React from 'react';
import { MobileBottomNav } from '../navigation/MobileBottomNav.jsx';
import { GoToTop } from '../ui/GoToTop.jsx';

export function PageShell({ children, header, footer, className = '' }) {
  return (
    <div
      className={`rc-page-shell ${className}`}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {header}
      <main style={{ flex: 1, position: 'relative', paddingTop: '76px' }}>{children}</main>
      {footer}
      <GoToTop />
      <MobileBottomNav />
    </div>
  );
}

export function PageContainer({
  children,
  size = 'lg', // sm | md | lg | full
  className = '',
  style = {},
}) {
  const sizeClass = `rc-container-${size}`;

  return (
    <div className={`rc-container ${sizeClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
