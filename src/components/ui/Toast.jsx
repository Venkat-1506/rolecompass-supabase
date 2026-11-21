import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '../../utils/helpers.js';

export function Toast({
  message,
  type = 'info', // info | success | warning | error
  onClose,
  className = '',
}) {
  let icon = <Info size={18} color="var(--rc-color-info)" />;
  let border = 'var(--rc-color-soft-slate-200)';

  if (type === 'success') {
    icon = <CheckCircle2 size={18} color="var(--rc-color-green-accent)" />;
    border = 'var(--rc-color-soft-mint-border)';
  } else if (type === 'warning') {
    icon = <AlertTriangle size={18} color="var(--rc-color-warm-yellow)" />;
    border = 'var(--rc-color-warm-yellow-border)';
  } else if (type === 'error') {
    icon = <AlertTriangle size={18} color="var(--rc-color-danger)" />;
    border = 'var(--rc-color-danger-border)';
  }

  return (
    <div
      className={cn(
        'rc-glass-level-3',
        'rc-toast-anim',
        'rc-flex',
        'rc-items-center',
        'rc-justify-between',
        className,
      )}
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 'var(--rc-radius-md)',
        border: `1px solid ${border}`,
        maxWidth: '380px',
        boxShadow: 'var(--rc-shadow-lg)',
      }}
    >
      <div className="rc-flex rc-items-center rc-gap-3">
        {icon}
        <span
          className="rc-small"
          style={{ fontWeight: 500, color: 'var(--rc-color-deep-charcoal-900)' }}
        >
          {message}
        </span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: 0.6,
            marginLeft: '12px',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
