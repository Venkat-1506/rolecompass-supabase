import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { cn } from '../../utils/helpers.js';

export function ErrorState({
  title = 'Something Went Wrong',
  description = 'We encountered an error loading this information. Please try refreshing.',
  onRetry,
  className = '',
}) {
  return (
    <Card
      variant="solid"
      className={cn('rc-flex', 'rc-flex-col', 'rc-items-center', 'rc-justify-center', className)}
      padding="8"
      style={{
        border: '1px solid var(--rc-color-danger-border)',
        background: 'var(--rc-color-danger-bg)',
      }}
    >
      <div style={{ color: 'var(--rc-color-danger)', marginBottom: 'var(--rc-space-4)' }}>
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      <h3
        className="rc-h3"
        style={{
          color: 'var(--rc-color-danger)',
          marginBottom: 'var(--rc-space-2)',
          textAlign: 'center',
        }}
      >
        {title}
      </h3>
      <p
        className="rc-small"
        style={{
          textAlign: 'center',
          maxWidth: '420px',
          marginBottom: onRetry ? 'var(--rc-space-6)' : '0',
        }}
      >
        {description}
      </p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Card>
  );
}
