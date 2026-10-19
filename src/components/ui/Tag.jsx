import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Tag({
  children,
  icon = null,
  onRemove = null,
  className = ''
}) {
  return (
    <span className={cn('rc-tag', className)}>
      {icon}
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{ background: 'none', border: 'none', padding: 0, marginLeft: '4px', cursor: 'pointer', opacity: 0.7 }}
        >
          ×
        </button>
      )}
    </span>
  );
}
