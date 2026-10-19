/**
 * RoleCompass Formatting Utilities
 */

export function formatCurrency(amount, currency = "INR") {
  if (amount === undefined || amount === null) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function formatExperience(exp) {
  if (!exp) return "Not Specified";
  return String(exp);
}
