import React from 'react';
import { cn } from '../../utils/helpers.js';

export function Cluster({
  children,
  gap = '3',
  align = 'center',
  justify = 'start',
  className = '',
  style = {}
}) {
  return (
    <div
      className={cn('rc-flex', 'rc-flex-wrap', className)}
      style={{
        gap: `var(--rc-space-${gap})`,
        alignItems: align,
        justifyContent: justify,
        ...style
      }}
    >
      {children}
    </div>
  );
}
