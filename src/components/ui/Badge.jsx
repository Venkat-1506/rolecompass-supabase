import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Badge({
  children,
  variant = 'default', // default | success | warning | danger | info
  icon = null,
  className = '',
}) {
  return (
    <span className={cn('rc-badge', `rc-badge-${variant}`, className)}>
      {icon}
      <span>{children}</span>
    </span>
  );
}
