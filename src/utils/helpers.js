/**
 * RoleCompass Helper Utilities
 */

/**
 * ClassName Joiner helper to conditionally combine CSS classes cleanly.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate fallback initials from name or company string.
 */
export function getInitials(name = '') {
  if (!name) return 'RC';
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate lightweight unique string IDs.
 */
export function generateId(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Normalizes text for search comparison by lowercasing and removing spaces, hyphens, slashes, and dots.
 */
export function normalizeSearchTerm(str = '') {
  return String(str || '')
    .toLowerCase()
    .replace(/[\s\-_/.]+/g, '');
}

/**
 * Intelligent fuzzy / flexible matcher that matches substrings, variations with/without spaces.
 */
export function fuzzyMatch(text = '', query = '') {
  if (!query) return true;
  if (!text) return false;
  const t = String(text).toLowerCase();
  const q = String(query).toLowerCase().trim();
  if (!q) return true;
  if (t.includes(q)) return true;

  const cleanT = normalizeSearchTerm(t);
  const cleanQ = normalizeSearchTerm(q);
  if (cleanQ && cleanT.includes(cleanQ)) return true;

  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allWordsMatch = words.every((w) => {
      const cleanW = normalizeSearchTerm(w);
      return t.includes(w) || (cleanW && cleanT.includes(cleanW));
    });
    if (allWordsMatch) return true;
  }

  return false;
}

/**
 * Parse salary strings like "₹18 - ₹24 LPA..." or "₹25,000 - ₹35,000 / month..."
 * Returns { min, max, unit } where unit is 'lpa' or 'monthly' (INR).
 */
export function parseSalaryRange(value = '') {
  if (!value || typeof value !== 'string') return null;
  const normalized = value
    .replace(/\uFFFD/g, '')
    .replace(/₹/g, ' ')
    .replace(/,/g, '')
    .toLowerCase();
  const numbers = (normalized.match(/\d+(?:\.\d+)?/g) || []).map((n) => Number(n));
  if (numbers.length === 0) return null;

  const isMonthly =
    normalized.includes('/ month') ||
    normalized.includes('per month') ||
    normalized.includes('stipend');

  let min = numbers[0];
  let max = numbers[1] ?? numbers[0];

  if (!isMonthly && normalized.includes('lpa')) {
    // Values are already in LPA.
  } else if (isMonthly) {
    // Convert monthly INR to LPA for comparison.
    min = (min * 12) / 100000;
    max = (max * 12) / 100000;
  }

  return { min, max, unit: isMonthly ? 'monthly' : 'lpa' };
}

/**
 * Returns true when a job's maximum salary fits within the selected LPA cap.
 * If salary cannot be parsed, it is not excluded by the slider.
 */
export function isSalaryWithinCap(salaryText, capLpa) {
  if (capLpa == null || capLpa >= 60) return true;
  const range = parseSalaryRange(salaryText);
  if (!range) return true;
  return range.max <= capLpa;
}

export function formatDateLabel(dateStr) {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
