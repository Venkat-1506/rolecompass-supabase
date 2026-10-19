import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton.jsx';
import { cn } from '../../utils/helpers.js';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock.js';
import '../../styles/glass.css';
import './ui.css';

export function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer = null,
  size = 'md', // sm | md | lg | xl | full
  className = '',
  overlayClassName = ''
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = `rc-modal-${size}`;

  return (
    <div 
      className={cn('rc-glass-overlay', 'rc-flex', 'rc-items-center', 'rc-justify-center', overlayClassName)}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        className={cn('rc-modal-container', sizeClass, className)} 
        role="dialog" 
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Header Bar */}
        {(title || onClose) && (
          <div className="rc-modal-header">
            {title ? (
              <h3 className="rc-h3" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {title}
              </h3>
            ) : <div />}
            
            {onClose && (
              <IconButton 
                icon={<X size={18} />} 
                ariaLabel="Close Modal" 
                variant="ghost" 
                onClick={onClose} 
              />
            )}
          </div>
        )}

        {/* Scrollable Body Content */}
        <div className="rc-modal-body">
          {children}
        </div>

        {/* Sticky Footer Bar */}
        {footer && (
          <div className="rc-modal-footer">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
}
