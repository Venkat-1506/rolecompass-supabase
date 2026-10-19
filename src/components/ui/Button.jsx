import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Button({
  children,
  variant = 'primary', // primary | secondary | tertiary | ghost | danger
  size = 'md', // sm | md | lg
  isLoading = false,
  isDisabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const variantClass = `rc-btn-${variant}`;
  const sizeClass = size !== 'md' ? `rc-btn-${size}` : '';

  return (
    <button
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={cn('rc-btn', variantClass, sizeClass, isLoading && 'rc-btn-loading', className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="rc-animate-spin" size={size === 'sm' ? 14 : 18} />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
