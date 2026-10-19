/**
 * Shared overlay scroll lock.
 *
 * Toggles a class on <html> while any modal/drawer is open. That class both
 * freezes the page behind and pauses the ambient background animations, which
 * is what causes scroll jank inside large dialogs.
 *
 * Counted so nested/overlapping overlays release the lock only once.
 */
let lockCount = 0;

export function lockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount += 1;
  if (lockCount === 1) {
    document.documentElement.classList.add('rc-overlay-open');
  }
}

export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove('rc-overlay-open');
  }
}
