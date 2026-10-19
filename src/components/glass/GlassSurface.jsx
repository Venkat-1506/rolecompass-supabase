import React from 'react';
import { cn } from '../../utils/helpers.js';
import '../../styles/glass.css';

export function GlassSurface({
  children,
  level = 2, // 1 (Solid) | 2 (Soft Glass) | 3 (Strong Glass) | 4 (Atmospheric)
  className = '',
  style = {},
  ...props
}) {
  const levelClass = `rc-glass-level-${level}`;

  return (
    <div
      className={cn('rc-glass-base', levelClass, className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
