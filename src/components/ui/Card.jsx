import React from 'react';
import { cn } from '../../utils/helpers.js';
import '../../styles/glass.css';

export function Card({
  children,
  variant = 'glass', // glass (Standard Explore Card) | subtle (Level 1) | strongGlass (Level 3)
  isHoverable = false,
  padding = '6', // 4 | 6 | 8
  className = '',
  onClick,
  style = {},
  ...props
}) {
  let glassLevelClass = 'rc-card-glass';
  if (variant === 'subtle') glassLevelClass = 'rc-glass-level-1';
  if (variant === 'strongGlass') glassLevelClass = 'rc-glass-level-3';

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: '16px',
        padding: `var(--rc-space-${padding})`,
        cursor: onClick || isHoverable ? 'pointer' : 'default',
        boxSizing: 'border-box',
        ...style
      }}
      className={cn(
        'rc-glass-base',
        glassLevelClass,
        isHoverable && 'rc-glass-hoverable',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
