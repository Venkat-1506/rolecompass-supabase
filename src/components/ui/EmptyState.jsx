import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';
import { cn } from '../../utils/helpers.js';

export function EmptyState({
  title = 'No Items Found',
  description = 'There are no records available to show at this moment.',
  icon = null,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <Card variant="glass" className={cn('rc-flex', 'rc-flex-col', 'rc-items-center', 'rc-justify-center', className)} padding="8">
      <div style={{ color: 'var(--rc-color-muted-gray-400)', marginBottom: 'var(--rc-space-4)' }}>
        {icon || <Inbox size={48} strokeWidth={1.5} />}
      </div>
      <h3 className="rc-h3" style={{ marginBottom: 'var(--rc-space-2)', textAlign: 'center' }}>
        {title}
      </h3>
      <p className="rc-small" style={{ textAlign: 'center', maxWidth: '420px', marginBottom: actionLabel ? 'var(--rc-space-6)' : '0' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
