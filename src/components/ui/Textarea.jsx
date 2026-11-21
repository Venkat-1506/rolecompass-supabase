import React from 'react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Textarea({
  label,
  helperText,
  errorText,
  isRequired = false,
  isDisabled = false,
  className = '',
  id,
  rows = 4,
  value,
  onChange,
  placeholder,
  ...props
}) {
  const textareaId =
    id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="rc-form-group">
      {label && (
        <label htmlFor={textareaId} className="rc-label">
          {label} {isRequired && <span style={{ color: 'var(--rc-color-danger)' }}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={isDisabled}
        placeholder={placeholder}
        className={cn('rc-textarea', errorText && 'rc-textarea-error', className)}
        {...props}
      />
      {errorText && <span className="rc-form-error">{errorText}</span>}
      {!errorText && helperText && <span className="rc-form-helper">{helperText}</span>}
    </div>
  );
}
