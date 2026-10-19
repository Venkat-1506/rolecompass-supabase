import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Radio({
  label,
  name,
  value,
  isChecked = false,
  isDisabled = false,
  onChange,
  className = '',
  id,
  ...props
}) {
  const radioId = id || `radio-${name}-${String(value).toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <label htmlFor={radioId} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}>
      <input
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={onChange}
        style={{ accentColor: 'var(--rc-color-green-accent)', width: '16px', height: '16px' }}
        className={cn(className)}
        {...props}
      />
      {label && <span className="rc-small" style={{ color: 'var(--rc-color-deep-charcoal-900)' }}>{label}</span>}
    </label>
  );
}
