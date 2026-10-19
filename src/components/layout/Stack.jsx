import React from 'react';
import { cn } from '../../utils/helpers.js';

export function Stack({
  children,
  gap = '4', // 1 | 2 | 3 | 4 | 6 | 8
  align = 'stretch', // start | center | end | stretch
  className = '',
  style = {}
}) {
  return (
    <div
      className={cn('rc-flex', 'rc-flex-col', className)}
      style={{
        gap: `var(--rc-space-${gap})`,
        alignItems: align,
        ...style
      }}
    >
      {children}
    </div>
  );
}
