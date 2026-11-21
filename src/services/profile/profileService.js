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
