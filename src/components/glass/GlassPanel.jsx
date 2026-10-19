import React from 'react';
import { GlassSurface } from './GlassSurface.jsx';
import { cn } from '../../utils/helpers.js';

export function GlassPanel({
  children,
  level = 2,
  padding = '6',
  className = '',
  style = {},
  ...props
}) {
  return (
    <GlassSurface
      level={level}
      className={cn('rc-glass-highlight', className)}
      style={{
        padding: `var(--rc-space-${padding})`,
        borderRadius: 'var(--rc-radius-xl)',
        ...style
      }}
      {...props}
    >
      {children}
    </GlassSurface>
  );
}
