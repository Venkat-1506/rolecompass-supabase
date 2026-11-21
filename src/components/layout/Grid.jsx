import React from 'react';
import { cn } from '../../utils/helpers.js';

export function Grid({
  children,
  cols = 3, // 1 | 2 | 3 | 4 | responsive-2 | responsive-3 | responsive-4
  gap = '6',
  className = '',
  style = {},
}) {
  const colClass = typeof cols === 'number' ? `rc-grid-cols-${cols}` : `rc-grid-${cols}`;

  return (
    <div
      className={cn('rc-grid', colClass, className)}
      style={{
        gap: `var(--rc-space-${gap})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
