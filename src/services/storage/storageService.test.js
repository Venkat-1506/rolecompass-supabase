import { beforeEach, describe, expect, it } from 'vitest';
import { storageService } from './storageService.js';

describe('storageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('prefixes scoped keys', () => {
    expect(storageService.key('applications')).toBe('rolecompass_applications');
  });

  it('stores and reads JSON values', () => {
    expect(storageService.set('profile', { name: 'Arjun' })).toEqual({ ok: true });
    expect(storageService.get('profile')).toEqual({ name: 'Arjun' });
  });

  it('falls back when stored JSON is corrupt', () => {
    window.localStorage.setItem('rolecompass_profile', '{bad json');
    expect(storageService.get('profile', { safe: true })).toEqual({ safe: true });
  });

  it('removes scoped values', () => {
    storageService.set('profile', { name: 'Arjun' });
    expect(storageService.remove('profile')).toEqual({ ok: true });
    expect(storageService.get('profile')).toBeNull();
  });

  it('clears only rolecompass keys', () => {
    storageService.set('profile', { name: 'Arjun' });
    window.localStorage.setItem('unrelated', 'keep');

    expect(storageService.clearScoped()).toEqual({ ok: true });
    expect(storageService.get('profile')).toBeNull();
    expect(window.localStorage.getItem('unrelated')).toBe('keep');
  });
});
