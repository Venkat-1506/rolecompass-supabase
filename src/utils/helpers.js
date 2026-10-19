/**
 * RoleCompass Helper Utilities
 */

/**
 * ClassName Joiner helper to conditionally combine CSS classes cleanly.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Generate fallback initials from name or company string.
 */
export function getInitials(name = "") {
  if (!name) return "RC";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate lightweight unique string IDs.
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Normalizes text for search comparison by lowercasing and removing spaces, hyphens, slashes, and dots.
 */
export function normalizeSearchTerm(str = "") {
  return String(str || "")
    .toLowerCase()
    .replace(/[\s\-_/.]+/g, "");
}

/**
 * Intelligent fuzzy / flexible matcher that matches substrings, variations with/without spaces
 * (e.g. "FullStack" matches "Full Stack", "FrontEnd" matches "Front End", "NodeJS" matches "Node.js").
 */
export function fuzzyMatch(text = "", query = "") {
  if (!query) return true;
  if (!text) return false;
  const t = String(text).toLowerCase();
  const q = String(query).toLowerCase().trim();
  if (!q) return true;
  if (t.includes(q)) return true;

  const cleanT = normalizeSearchTerm(t);
  const cleanQ = normalizeSearchTerm(q);
  if (cleanQ && cleanT.includes(cleanQ)) return true;

  // Word-by-word matching: check if all query words exist in target
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

