import React from 'react';
import { GlassSurface } from './GlassSurface.jsx';
import { cn } from '../../utils/helpers.js';

export function GlassCard({
  children,
  level = 2,
  isHoverable = true,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  return (
    <GlassSurface
      level={level}
      className={cn(isHoverable && 'rc-glass-hoverable', className)}
      style={{
        padding: 'var(--rc-space-5)',
        borderRadius: 'var(--rc-radius-lg)',
        cursor: onClick || isHoverable ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
      {...props}
    >
      {children}
    </GlassSurface>
  );
}
