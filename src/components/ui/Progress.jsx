import React from 'react';
import { cn } from '../../utils/helpers.js';

export function Progress({
  value = 0, // 0 to 100
  max = 100,
  showLabel = false,
  variant = 'accent', // accent | success | warning
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let barColor = 'var(--rc-color-green-accent)';
  if (variant === 'warning') barColor = 'var(--rc-color-warm-yellow)';

  return (
    <div className={cn('rc-flex', 'rc-flex-col', 'rc-gap-1', className)}>
      {showLabel && (
        <div className="rc-flex rc-justify-between rc-small">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--rc-color-soft-slate-200)',
          borderRadius: 'var(--rc-radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: 'var(--rc-radius-pill)',
            transition: 'width var(--rc-motion-medium)',
          }}
        />
      </div>
    </div>
  );
}
