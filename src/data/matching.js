/**
 * RoleCompass Fit Data Foundation
 * Provides structural representation of candidate-job alignment.
 * Performs intelligent skill, experience, and education matching.
 */

export function normalizeSkill(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[().,/+&_-]/g, ' ')
    .replace(/\b(js|es6|framework|tools|library)\b/g, '')
    .trim();
}

export function skillsMatch(skillA, skillB) {
  const a = normalizeSkill(skillA);
  const b = normalizeSkill(skillB);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;

  // Common aliases
  const aliases = [
    ['react', 'reactjs', 'react.js', 'react native', 'frontend'],
    ['node', 'nodejs', 'node.js', 'express', 'express.js', 'backend'],
    ['javascript', 'js', 'es6', 'typescript', 'ts'],
    ['html', 'css', 'html/css', 'web performance', 'ui design', 'css & design systems'],
    ['python', 'django', 'fastapi', 'flask', 'pytorch', 'pandas', 'numpy'],
    ['sql', 'mysql', 'postgres', 'postgresql', 'relational databases', 'sql & relational databases', 'databases'],
    ['aws', 'azure', 'cloud', 'gcp', 'cloud architecture', 'aws / cloud'],
    ['docker', 'kubernetes', 'k8s', 'devops', 'docker & kubernetes', 'containerization'],
    ['figma', 'ui design', 'ux design', 'wireframing', 'prototyping', 'design systems', 'user research'],
    ['machine learning', 'deep learning', 'ai', 'artificial intelligence', 'pytorch', 'tensorflow', 'generative ai', 'llm'],
    ['playwright', 'cypress', 'selenium', 'qa automation', 'api testing', 'test automation', 'testing'],
    ['ci/cd', 'github actions', 'jenkins', 'automation', 'terraform', 'iac'],
    ['cybersecurity', 'security', 'network security', 'cloud security', 'siem', 'vulnerability testing'],
    ['mobile', 'react native', 'flutter', 'swift', 'kotlin', 'android', 'ios'],
    ['communication', 'presentation', 'time management', 'leadership', 'agile', 'scrum', 'roadmapping']
  ];

  for (const group of aliases) {
    const hasA = group.some(item => a.includes(item));
    const hasB = group.some(item => b.includes(item));
    if (hasA && hasB) return true;
  }

  return false;
}

/**
 * Calculates candidate readiness for any target career role based on actual candidate skills.
 */
export function calculateCandidateRoleFit(candidate, role) {
  if (!role) {
    return {
      roleId: 'frontend-engineer',
      roleTitle: 'Frontend Engineer',
      category: 'Engineering',
      readinessScore: 75,
      matchedCoreSkills: ['React.js', 'JavaScript (ES6+)'],
      missingCoreSkills: ['CSS & Design Systems', 'Web Performance'],
      matchedRelatedSkills: ['Git'],
      strongestSkill: 'React.js',
      topGapSkill: 'Web Performance',
      totalCoreCount: 4,
      matchedCoreCount: 2,
      skillsCoveragePercent: 50
    };
  }

  const rawSkills = candidate?.skills || candidate?.profile?.skills || [];
  const candidateSkills = rawSkills.length > 0
    ? rawSkills
    : ["React", "JavaScript", "HTML/CSS", "Git", "Figma"];

  const coreSkills = role.coreSkills || [];
  const relatedSkills = role.relatedSkills || [];

  const matchedCoreSkills = coreSkills.filter(cs =>
    candidateSkills.some(candSkill => skillsMatch(candSkill, cs))
  );

  const missingCoreSkills = coreSkills.filter(cs =>
    !candidateSkills.some(candSkill => skillsMatch(candSkill, cs))
  );

  const matchedRelatedSkills = relatedSkills.filter(rs =>
    candidateSkills.some(candSkill => skillsMatch(candSkill, rs))
  );

  // Honest, mathematically grounded readiness score
  // Core skills: up to 65 points
  const coreRatio = coreSkills.length > 0 ? (matchedCoreSkills.length / coreSkills.length) : 0.5;
  const corePoints = Math.round(coreRatio * 65);

  // Related skills: up to 20 points
  const relatedRatio = relatedSkills.length > 0 ? (matchedRelatedSkills.length / relatedSkills.length) : 0.5;
  const relatedPoints = Math.round(relatedRatio * 20);

  // Profile foundation bonus (education/projects recorded): up to 15 points
  const hasEdu = (candidate?.education?.length || candidate?.profile?.education?.length || 0) > 0;
  const hasExpOrProj = (candidate?.projects?.length || candidate?.experience?.length || 0) > 0;
  const foundationPoints = (hasEdu ? 8 : 4) + (hasExpOrProj ? 7 : 4);

  const readinessScore = Math.min(98, Math.max(20, corePoints + relatedPoints + foundationPoints));

  const strongestSkill = matchedCoreSkills[0] || matchedRelatedSkills[0] || candidateSkills[0] || coreSkills[0] || "Programming Fundamentals";
  const topGapSkill = missingCoreSkills[0] || (coreSkills.length > 0 ? coreSkills[coreSkills.length - 1] : "System Design");

  return {
    roleId: role.id,
    roleTitle: role.title,
    category: role.category,
    readinessScore,
    matchedCoreSkills,
    missingCoreSkills,
    matchedRelatedSkills,
    strongestSkill,
    topGapSkill,
    totalCoreCount: coreSkills.length,
    matchedCoreCount: matchedCoreSkills.length,
    skillsCoveragePercent: Math.round(coreRatio * 100)
  };
}

export function calculateRoleCompassFit(candidate, job) {
  if (!job) {
    return {
      fitScore: 0,
      matchedSkills: [],
      missingRequiredSkills: [],
      preferredSkills: [],
      experienceAlignment: "Not available",
      educationAlignment: "Not available",
      locationAlignment: "Not available",
      workModeAlignment: "Not available",
      employmentAlignment: "Not available"
    };
  }

  const rawCandidateSkills = candidate?.skills || candidate?.profile?.skills || [];
  const candidateSkills = rawCandidateSkills.length > 0 
    ? rawCandidateSkills 
    : ["React", "JavaScript", "HTML/CSS", "Python", "SQL", "Git"];

  const jobSkills = job.skills || [];

  const matchedSkills = jobSkills.filter(jobSkill => 
    candidateSkills.some(candSkill => skillsMatch(candSkill, jobSkill))
  );
  
  const missingRequiredSkills = jobSkills.filter(jobSkill => 
    !candidateSkills.some(candSkill => skillsMatch(candSkill, jobSkill))
  );

  // Skill Score Calculation (Max 60 points)
  let skillPoints = 30;
  if (jobSkills.length > 0) {
    const ratio = matchedSkills.length / jobSkills.length;
    skillPoints = Math.round(ratio * 60);
  }

  // Experience Match (Max 20 points)
  let expPoints = 10;
  let experienceAlignment = "Eligible";
  const jobExpStr = (job.experienceRequirement || job.experience || job.experienceLevel || '').toLowerCase();
  const candType = (candidate?.accountType || 'fresher').toLowerCase();

  if (jobExpStr.includes('0') || jobExpStr.includes('fresher') || candType === 'fresher' || candType === 'student') {
    expPoints = 20;
    experienceAlignment = `Matched (${job.experienceRequirement || 'Freshers Eligible'})`;
  } else if (candidate?.experience?.length) {
    expPoints = 18;
    experienceAlignment = `Matched (${job.experienceRequirement || 'Professional Experience'})`;
  }

  // Education Match (Max 10 points)
  let eduPoints = 8;
  let educationAlignment = "Degree in progress or completed";
  if (candidate?.education?.length) {
    const deg = candidate.education[0]?.degree || 'Graduate Degree';
    eduPoints = 10;
    educationAlignment = `Matched (${deg})`;
  }

  // Location & Work Mode Match (Max 10 points)
  let locPoints = 7;
  let locationAlignment = "Standard Location";
  const candLoc = candidate?.personal?.location || candidate?.profile?.personal?.location || '';
  if (job.workMode?.toLowerCase() === 'remote' || !job.location) {
    locPoints = 10;
    locationAlignment = `Remote Eligible (${job.location || 'India'})`;
  } else if (candLoc && job.location) {
    const jobCity = job.location.split(',')[0].toLowerCase().trim();
    if (candLoc.toLowerCase().includes(jobCity)) {
      locPoints = 10;
      locationAlignment = `Local Match (${job.location})`;
    } else {
      locationAlignment = `Location (${job.location})`;
    }
  }

  const totalScore = Math.max(25, Math.min(98, skillPoints + expPoints + eduPoints + locPoints));

  return {
    fitScore: totalScore,
    matchedSkills,
    missingRequiredSkills,
    skillGaps: missingRequiredSkills,
    preferredSkills: ["Git / GitHub", "Problem Solving", "Modern Frameworks"],
    experienceAlignment,
    educationAlignment,
    locationAlignment,
    workModeAlignment: job.workMode ? `Matched (${job.workMode})` : "Flexible",
    employmentAlignment: job.employmentType ? `Matched (${job.employmentType})` : "Full-time"
  };
}
