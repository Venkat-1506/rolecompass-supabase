import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Select({
  label,
  options = [],
  helperText,
  errorText,
  isRequired = false,
  isDisabled = false,
  className = '',
  id,
  value,
  onChange,
  placeholder = 'Select an option',
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="rc-form-group">
      {label && (
        <label htmlFor={selectId} className="rc-label">
          {label} {isRequired && <span style={{ color: 'var(--rc-color-danger)' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        className={cn('rc-select', errorText && 'rc-select-error', className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt, i) => (
          <option key={opt.value || i} value={opt.value}>
            {opt.label || opt.value}
          </option>
        ))}
      </select>
      {errorText && <span className="rc-form-error">{errorText}</span>}
      {!errorText && helperText && <span className="rc-form-helper">{helperText}</span>}
    </div>
  );
}
