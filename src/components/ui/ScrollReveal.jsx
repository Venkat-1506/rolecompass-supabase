import React, { useEffect, useRef, useState } from 'react';
import '../../styles/animations.css';

/**
 * ScrollReveal component that triggers smooth entrance animations
 * when the element scrolls into view.
 *
 * Props:
 * - variant: 'slide-left' | 'slide-right' | 'slide-up' | 'scale-up' | 'fade-in'
 * - delay: number (milliseconds e.g. 100, 200, 300)
 * - threshold: number (0.1 to 1.0)
 * - style: CSSProperties
 * - className: string
 */
export function ScrollReveal({
  children,
  variant = 'slide-up',
  delay = 0,
  threshold = 0.12,
  style = {},
  className = '',
  once = true,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && domRef.current) {
            observer.unobserve(domRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, once]);

  const variantClass = `rc-reveal-${variant}`;
  const visibleClass = isVisible ? 'rc-reveal-visible' : '';

  return (
    <div
      ref={domRef}
      className={`rc-reveal ${variantClass} ${visibleClass} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
