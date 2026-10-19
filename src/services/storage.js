/**
 * RoleCompass Storage Abstraction
 * Centralized wrapper for localStorage to avoid direct calls in UI components.
 */

const STORAGE_PREFIX = "rolecompass_";

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.warn(`[RoleCompass Storage] Error reading key "${key}":`, err);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn(`[RoleCompass Storage] Error writing key "${key}":`, err);
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (err) {
      console.warn(`[RoleCompass Storage] Error removing key "${key}":`, err);
    }
  },

  clear() {
    try {
      Object.keys(window.localStorage)
        .filter(k => k.startsWith(STORAGE_PREFIX))
        .forEach(k => window.localStorage.removeItem(k));
    } catch (err) {
      console.warn(`[RoleCompass Storage] Error clearing storage:`, err);
    }
  }
};
