import React, { useState } from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Tooltip({
  children,
  content,
  position = 'top',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={cn('rc-small', className)}
          style={{
            position: 'absolute',
            bottom: position === 'top' ? '100%' : 'auto',
            top: position === 'bottom' ? '100%' : 'auto',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: position === 'top' ? '6px' : undefined,
            marginTop: position === 'bottom' ? '6px' : undefined,
            padding: '0.25rem 0.625rem',
            background: 'var(--rc-color-deep-charcoal-900)',
            color: 'var(--rc-color-white)',
            borderRadius: 'var(--rc-radius-sm)',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            zIndex: 'var(--rc-z-tooltip)',
            pointerEvents: 'none',
            boxShadow: 'var(--rc-shadow-md)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
