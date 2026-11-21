import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function IconButton({
  icon,
  ariaLabel,
  variant = 'secondary',
  size = 'md',
  isDisabled = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'rc-btn',
        `rc-btn-${variant}`,
        'rc-btn-icon-only',
        size !== 'md' && `rc-btn-${size}`,
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
