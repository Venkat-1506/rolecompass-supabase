import React from 'react';

export function Section({
  children,
  py = '8', // 4 | 6 | 8 | 12 | 16
  className = '',
  style = {},
  ...props
}) {
  return (
    <section
      className={className}
      style={{
        paddingTop: `var(--rc-space-${py})`,
        paddingBottom: `var(--rc-space-${py})`,
        ...style
      }}
      {...props}
    >
      {children}
    </section>
  );
}
