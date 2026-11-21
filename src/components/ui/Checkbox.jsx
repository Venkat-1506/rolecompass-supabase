import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Checkbox({
  label,
  isChecked = false,
  isDisabled = false,
  onChange,
  className = '',
  id,
  ...props
}) {
  const checkboxId = id || (label ? `chk-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <label
      htmlFor={checkboxId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <input
        type="checkbox"
        id={checkboxId}
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        style={{ accentColor: 'var(--rc-color-green-accent)', width: '16px', height: '16px' }}
        className={cn(className)}
        {...props}
      />
      {label && (
        <span className="rc-small" style={{ color: 'var(--rc-color-deep-charcoal-900)' }}>
          {label}
        </span>
      )}
    </label>
  );
}
