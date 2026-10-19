import React from 'react';
import { cn } from '../../utils/helpers.js';
import '../../styles/motion.css';

export function Skeleton({
  width = '100%',
  height = '20px',
  radius = 'md',
  className = ''
}) {
  return (
    <div
      className={cn('rc-skeleton-shimmer', className)}
      style={{
        width,
        height,
        borderRadius: `var(--rc-radius-${radius})`
      }}
    />
  );
}
