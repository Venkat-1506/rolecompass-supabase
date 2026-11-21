import React, { useState } from 'react';
import { User } from 'lucide-react';
import { getInitials, cn } from '../../utils/helpers.js';
import './ui.css';

export function Avatar({
  src,
  name,
  size = 'md', // sm | md | lg
  className = '',
}) {
  const [hasError, setHasError] = useState(false);
  const initials = getInitials(name);
  const sizeClass = `rc-avatar-${size}`;

  return (
    <div className={cn('rc-avatar', sizeClass, className)} title={name}>
      {src && !hasError ? (
        <img src={src} alt={name || 'Avatar'} onError={() => setHasError(true)} />
      ) : name ? (
        <span>{initials}</span>
      ) : (
        <User size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} />
      )}
    </div>
  );
}
