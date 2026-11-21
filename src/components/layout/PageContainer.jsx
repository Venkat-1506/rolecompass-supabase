import React from 'react';

export function PageContainer({
  children,
  size = 'lg', // sm | md | lg | full
  className = '',
  style = {},
}) {
  const sizeClass = `rc-container-${size}`;

  return (
    <div className={`rc-container ${sizeClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
