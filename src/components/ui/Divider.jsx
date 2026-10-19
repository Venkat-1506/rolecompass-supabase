import React from 'react';

export function Divider({
  orientation = 'horizontal', // horizontal | vertical
  margin = '4', // 2 | 4 | 6
  className = ''
}) {
  if (orientation === 'vertical') {
    return (
      <div
        className={className}
        style={{
          width: '1px',
          height: '100%',
          backgroundColor: 'var(--rc-color-soft-slate-200)',
          marginLeft: `var(--rc-space-${margin})`,
          marginRight: `var(--rc-space-${margin})`,
          display: 'inline-block'
        }}
      />
    );
  }

  return (
    <hr
      className={className}
      style={{
        border: 'none',
        height: '1px',
        backgroundColor: 'var(--rc-color-soft-slate-200)',
        marginTop: `var(--rc-space-${margin})`,
        marginBottom: `var(--rc-space-${margin})`
      }}
    />
  );
}
