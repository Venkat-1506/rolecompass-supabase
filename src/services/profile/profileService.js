export function calculateProfileCompletion(candidate) {
  if (!candidate) return 0;
  const personal = candidate.personal || candidate.profile?.personal || {};
  const education = candidate.education || candidate.profile?.education || [];
  const experience = candidate.experience || candidate.profile?.experience || [];
  const skills = candidate.skills || candidate.profile?.skills || [];
  const projects = candidate.projects || candidate.profile?.projects || [];
  const links = candidate.links || candidate.profile?.links || {};

  let score = 0;
  if (personal.fullName) score += 10;
  if (personal.email) score += 10;
  if (personal.phone && personal.location) score += 10;
  if (education.length > 0) score += 20;

  if (skills.length >= 4) score += 25;
  else if (skills.length > 0) score += 15;

  const isFresher = candidate.accountType === 'fresher' || candidate.accountType === 'student';
  if (experience.length > 0) score += 20;
  else if (isFresher && projects.length > 0) score += 20;
  else if (projects.length > 0) score += 10;

  if (
    personal.portfolioUrl ||
    personal.linkedinUrl ||
    personal.githubUrl ||
    links.portfolio ||
    links.linkedin ||
    links.github
  ) {
    score += 5;
  }

  return Math.min(100, score);
}

function trimmed(value) {
  return String(value ?? '').trim();
}

function parseProfileUrl(value) {
  const candidate = trimmed(value);
  if (!candidate) return null;

  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function validGitHubUrl(value) {
  const url = parseProfileUrl(value);
  if (!url) return false;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);
  return host === 'github.com' && segments.length === 1;
}

function validLinkedInUrl(value) {
  const url = parseProfileUrl(value);
  if (!url) return false;
  const host = url.hostname.toLowerCase().replace(/^www\./, '');
  const segments = url.pathname.split('/').filter(Boolean);
  const profileIndex = segments.findIndex((segment) => segment === 'in' || segment === 'pub');
  return host === 'linkedin.com' && profileIndex >= 0 && Boolean(segments[profileIndex + 1]);
}

export function normalizeCandidateProfileContact(contact = {}) {
  return {
    fullName: trimmed(contact.fullName),
    phone: trimmed(contact.phone),
    location: trimmed(contact.location),
    githubUrl: trimmed(contact.githubUrl),
    linkedinUrl: trimmed(contact.linkedinUrl),
  };
}

export function validateCandidateProfileContact(contact = {}) {
  const value = normalizeCandidateProfileContact(contact);
  const errors = {};

  if (!value.fullName) {
    errors.fullName = 'Full name is required.';
  }

  if (value.phone) {
    const digits = value.phone.replace(/\D/g, '');
    if (!/^\+?[0-9()\s.-]+$/.test(value.phone) || digits.length < 7 || digits.length > 15) {
      errors.phone = 'Enter a valid phone number in international format.';
    }
  }

  if (value.githubUrl && !validGitHubUrl(value.githubUrl)) {
    errors.githubUrl = 'Enter a valid GitHub profile URL, for example https://github.com/username.';
  }

  if (value.linkedinUrl && !validLinkedInUrl(value.linkedinUrl)) {
    errors.linkedinUrl =
      'Enter a valid LinkedIn profile URL, for example https://www.linkedin.com/in/username.';
  }

  return errors;
}
