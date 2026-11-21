const STORAGE_PREFIX = 'rolecompass_';

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export const storageService = {
  key(key) {
    return `${STORAGE_PREFIX}${key}`;
  },

  get(key, defaultValue = null) {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = window.localStorage.getItem(this.key(key));
      return safeParse(raw, defaultValue);
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Storage unavailable' };
    }
    try {
      window.localStorage.setItem(this.key(key), JSON.stringify(value));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || 'Unable to save data locally' };
    }
  },

  remove(key) {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Storage unavailable' };
    }
    try {
      window.localStorage.removeItem(this.key(key));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || 'Unable to remove data locally' };
    }
  },

  clearScoped() {
    if (typeof window === 'undefined') {
      return { ok: false, error: 'Storage unavailable' };
    }
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => window.localStorage.removeItem(k));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error?.message || 'Unable to clear local data' };
    }
  },
};
