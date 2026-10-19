import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton.jsx';
import { cn } from '../../utils/helpers.js';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock.js';
import '../../styles/glass.css';
import './ui.css';

export function Drawer({
  isOpen = false,
  onClose,
  title,
  children,
  className = ''
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

  return (
    <>
      <div className="rc-glass-overlay" onClick={onClose} />
      <div className={cn('rc-drawer-container', className)} role="dialog" aria-modal="true">
        <div className="rc-flex rc-items-center rc-justify-between" style={{ marginBottom: 'var(--rc-space-6)' }}>
          {title && <h3 className="rc-h3">{title}</h3>}
          {onClose && (
            <IconButton icon={<X size={18} />} ariaLabel="Close Drawer" variant="ghost" onClick={onClose} />
          )}
        </div>
        <div>
          {children}
        </div>
      </div>
    </>
  );
}
