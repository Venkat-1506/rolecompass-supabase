import React from 'react';
import { cn } from '../../utils/helpers.js';
import '../../styles/glass.css';

export function GlassOverlay({
  children,
  onClick,
  className = ''
}) {
  return (
    <div className={cn('rc-glass-overlay', className)} onClick={onClick}>
      {children}
    </div>
  );
}
