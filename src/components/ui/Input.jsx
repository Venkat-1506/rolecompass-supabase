import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers.js';
import './ui.css';

export function Input({
  label,
  helperText,
  errorText,
  isSuccess = false,
  isRequired = false,
  isDisabled = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="rc-form-group">
      {label && (
        <label htmlFor={inputId} className="rc-label">
          {label} {isRequired && <span style={{ color: 'var(--rc-color-danger)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span style={{ position: 'absolute', left: '12px', color: 'var(--rc-color-muted-gray-500)', pointerEvents: 'none' }}>
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={isDisabled || isLoading}
          placeholder={placeholder}
          style={{
            paddingLeft: leftIcon ? '2.3rem' : undefined,
            paddingRight: (rightIcon || isLoading) ? '2.3rem' : undefined
          }}
          className={cn(
            'rc-input',
            errorText && 'rc-input-error',
            isSuccess && 'rc-input-success',
            className
          )}
          {...props}
        />
        {(isLoading || rightIcon) && (
          <span style={{ position: 'absolute', right: '12px', color: 'var(--rc-color-muted-gray-500)' }}>
            {isLoading ? <Loader2 className="rc-animate-spin" size={16} /> : rightIcon}
          </span>
        )}
      </div>
      {errorText && <span className="rc-form-error">{errorText}</span>}
      {!errorText && helperText && <span className="rc-form-helper">{helperText}</span>}
    </div>
  );
}
