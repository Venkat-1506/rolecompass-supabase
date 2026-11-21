/**
 * RoleCompass ATS Resume Readiness Service — Frontend Demo Heuristics
 *
 * Provides a deterministic, rule-based ATS readiness assessment for candidate profiles.
 * Clearly labelled as a Simulated ATS Readiness Demo (no fake AI promises).
 */

import { storageService } from './storage/storageService.js';

export const atsService = {
  /**
   * Evaluates candidate profile and computes deterministic ATS Readiness score (0 - 100).
   * @param {Object} candidateUser Candidate user object
   * @returns {Object} ATS Assessment report
   */
  evaluateReadiness(candidateUser) {
    if (!candidateUser) {
      return {
        score: 0,
        statusLabel: 'No Profile Detected',
        checks: [],
        strengths: [],
        improvements: [],
      };
    }

    const personal = candidateUser.personal || candidateUser.profile?.personal || {};
    const education = candidateUser.education || candidateUser.profile?.education || [];
    const experience = candidateUser.experience || candidateUser.profile?.experience || [];
    const skills = candidateUser.skills || candidateUser.profile?.skills || [];
    const projects = candidateUser.projects || candidateUser.profile?.projects || [];
    const accountType = candidateUser.accountType || 'fresher';

    let score = 0;
    const checks = [];
    const strengths = [];
    const improvements = [];

    // 1. Contact Information Check (20 pts)
    const hasName = Boolean(personal.fullName && personal.fullName.trim());
    const hasEmail = Boolean(personal.email && personal.email.trim());
    const hasPhone = Boolean(personal.phone && personal.phone.trim());
    const hasLocation = Boolean(personal.location && personal.location.trim());

    if (hasName && hasEmail && hasPhone && hasLocation) {
      score += 20;
      checks.push({
        id: 'chk-contact',
        label: 'Complete Contact Details',
        status: 'pass',
        message: 'Name, email, phone, and location detected.',
      });
      strengths.push('Full contact details detected (Email, Phone, City)');
    } else {
      score += (hasName ? 5 : 0) + (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0) + (hasLocation ? 5 : 0);
      checks.push({
        id: 'chk-contact',
        label: 'Contact Details Incomplete',
        status: 'warning',
        message: 'Add missing phone or location details.',
      });
      improvements.push('Add complete phone number and location string');
    }

    // 2. Education Details Check (20 pts)
    if (education.length > 0) {
      score += 20;
      checks.push({
        id: 'chk-edu',
        label: 'Education History',
        status: 'pass',
        message: `${education.length} education entry found.`,
      });
      strengths.push(
        `Degree & academic background present (${education[0]?.degree || 'Graduate'})`,
      );
    } else {
      checks.push({
        id: 'chk-edu',
        label: 'Education History Missing',
        status: 'fail',
        message: 'No degree or college education entry listed.',
      });
      improvements.push('Add your college or degree education background');
    }

    // 3. Technical & Core Skills Check (25 pts)
    if (skills.length >= 4) {
      score += 25;
      checks.push({
        id: 'chk-skills',
        label: 'Skills Section Density',
        status: 'pass',
        message: `${skills.length} core technical skills detected.`,
      });
      strengths.push(`Strong skill density (${skills.length} skills indexed)`);
    } else if (skills.length > 0) {
      score += 15;
      checks.push({
        id: 'chk-skills',
        label: 'Skills Section Light',
        status: 'warning',
        message: 'Only a few skills listed. Add more relevant tags.',
      });
      improvements.push(
        'Add 3-5 more specific technical skill tags to improve local keyword match',
      );
    } else {
      checks.push({
        id: 'chk-skills',
        label: 'Skills Section Missing',
        status: 'fail',
        message: 'No technical skills indexed.',
      });
      improvements.push('Add technical and domain skills to improve local keyword coverage');
    }

    // 4. Experience / Projects Check (20 pts - Non-penalizing for Freshers)
    const isFresherOrStudent = accountType === 'fresher' || accountType === 'student';
    if (experience.length > 0) {
      score += 20;
      checks.push({
        id: 'chk-exp',
        label: 'Work Experience Format',
        status: 'pass',
        message: `${experience.length} work experience entry documented.`,
      });
      strengths.push(`Documented work experience (${experience[0]?.role || 'Intern'})`);
    } else if (isFresherOrStudent && projects.length > 0) {
      // Freshers with projects get full credit!
      score += 20;
      checks.push({
        id: 'chk-exp',
        label: 'Fresher Project Matrix',
        status: 'pass',
        message: 'Fresher path detected with active technical projects.',
      });
      strengths.push('Key technical projects indexed for fresher profile');
    } else if (projects.length > 0) {
      score += 12;
      checks.push({
        id: 'chk-exp',
        label: 'Projects Documented',
        status: 'warning',
        message: 'Project history documented. Consider adding work/intern experience.',
      });
    } else {
      checks.push({
        id: 'chk-exp',
        label: 'Experience & Projects Empty',
        status: 'fail',
        message: 'Add at least one internship or project to demonstrate impact.',
      });
      improvements.push('Add at least one key project or internship to showcase experience');
    }

    // 5. Professional Links & Portfolio (15 pts)
    const hasPortfolio = Boolean(
      personal.portfolioUrl || personal.website || candidateUser.profile?.links?.portfolio,
    );
    const hasGithub = Boolean(personal.githubUrl || candidateUser.profile?.links?.github);
    const hasLinkedin = Boolean(personal.linkedinUrl || candidateUser.profile?.links?.linkedin);

    if (hasPortfolio || hasGithub || hasLinkedin) {
      score += 15;
      checks.push({
        id: 'chk-links',
        label: 'Professional Links Added',
        status: 'pass',
        message: 'GitHub, Portfolio, or LinkedIn link is present in your profile.',
      });
      strengths.push('Professional portfolio / GitHub link included');
    } else {
      checks.push({
        id: 'chk-links',
        label: 'Professional Links Missing',
        status: 'warning',
        message: 'Consider adding a GitHub, portfolio, or LinkedIn link for completeness.',
      });
      improvements.push('Include your GitHub, LinkedIn, or Portfolio link');
    }

    const finalScore = Math.min(100, Math.max(0, score));
    let statusLabel = 'Strong Local Readiness';
    if (finalScore < 60) statusLabel = 'Needs Improvement';
    else if (finalScore < 80) statusLabel = 'Moderate Local Readiness';

    const result = {
      score: finalScore,
      statusLabel,
      evaluatedAt: new Date().toISOString(),
      checks,
      strengths,
      improvements,
    };

    // Save latest evaluation to localStorage
    storageService.set('resume_check', result);
    return result;
  },

  getSavedReadiness() {
    return storageService.get('resume_check', null);
  },
};
