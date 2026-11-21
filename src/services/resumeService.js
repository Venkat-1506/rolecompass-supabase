/**
 * Resume Parsing Service Abstraction — RoleCompass
 *
 * Provides structured profile extraction from uploaded candidate resumes (PDF, DOC, DOCX).
 * Clearly labelled as a FRONTEND DEMO EXTRACTION layer.
 * Designed so a production parser API (e.g., Affinda, Sovren, OpenAI) can be plugged in later
 * without modifying UI components or state structures.
 */

export const resumeService = {
  /**
   * Process a resume file object and extract structured profile data.
   * Deterministic demo parser — no random values, clearly marked demo mode.
   *
   * @param {File|Object} file - Selected file or resume metadata
   * @param {Object} currentUser - Currently authenticated user
   * @returns {Promise<Object>} Structured candidate profile object
   */
  async processResume(file, currentUser = null) {
    const fileName = file?.name || currentUser?.resume?.fileName || 'candidate_resume.pdf';
    const fileSize = file?.size
      ? `${(file.size / 1024).toFixed(0)} KB`
      : currentUser?.resume?.fileSize || '240 KB';
    const fullName =
      currentUser?.fullName || currentUser?.profile?.personal?.fullName || 'Arjun Verma';
    const email =
      currentUser?.email || currentUser?.profile?.personal?.email || 'arjun.verma@rolecompass.demo';

    return {
      isDemoExtraction: true,
      extractionMode: 'demo',

      personal: {
        fullName: fullName,
        email: email,
        phone: currentUser?.profile?.personal?.phone || '+91 98765 43210',
        location: currentUser?.profile?.personal?.location || 'Bengaluru, Karnataka, India',
        headline: currentUser?.profile?.personal?.headline || 'Frontend Engineer & React Developer',
        bio:
          currentUser?.profile?.personal?.bio ||
          'Passionate Computer Science graduate specializing in React, CSS tokens architecture, and accessible web experiences.',
        linkedinUrl:
          currentUser?.profile?.personal?.linkedinUrl || 'https://linkedin.com/in/arjunverma',
        githubUrl: currentUser?.profile?.personal?.githubUrl || 'https://github.com/arjunverma',
        portfolioUrl: currentUser?.profile?.personal?.portfolioUrl || 'https://arjunverma.dev',
      },

      education: currentUser?.profile?.education?.length
        ? currentUser.profile.education
        : [
            {
              id: 'edu-1',
              institution: 'National Institute of Technology, Trichy',
              degree: 'B.Tech',
              field: 'Computer Science & Engineering',
              year: '2021 - 2025',
              score: '8.8 CGPA',
            },
          ],

      experience: currentUser?.profile?.experience?.length
        ? currentUser.profile.experience
        : [
            {
              id: 'exp-1',
              company: 'TechCraft Studios',
              role: 'Frontend Developer Intern',
              period: 'Jan 2025 - May 2025',
              description:
                'Built modular React components and improved web vital performance by 28%.',
            },
          ],

      skills: currentUser?.profile?.skills?.length
        ? currentUser.profile.skills
        : ['React', 'JavaScript', 'HTML/CSS', 'Node.js', 'Git', 'Figma', 'REST APIs'],

      projects: currentUser?.profile?.projects?.length
        ? currentUser.profile.projects
        : [
            {
              id: 'proj-1',
              title: 'RoleCompass Career Matrix',
              tech: ['React', 'CSS Tokens', 'Vite'],
              description:
                'Built a job discovery and skill gap visualization app with local readiness checks.',
            },
          ],

      certifications: currentUser?.profile?.certifications?.length
        ? currentUser.profile.certifications
        : [
            {
              id: 'cert-1',
              name: 'Meta Front-End Developer Professional Certificate',
              issuer: 'Coursera / Meta',
              year: '2025',
            },
          ],

      languages: currentUser?.profile?.languages?.length
        ? currentUser.profile.languages
        : ['English (Professional)', 'Tamil (Native)', 'Hindi (Conversational)'],

      links: {
        portfolio: currentUser?.profile?.personal?.portfolioUrl || 'https://arjunverma.dev',
        linkedin:
          currentUser?.profile?.personal?.linkedinUrl || 'https://linkedin.com/in/arjunverma',
        github: currentUser?.profile?.personal?.githubUrl || 'https://github.com/arjunverma',
      },

      preferences: currentUser?.profile?.preferences?.desiredRoles?.length
        ? currentUser.profile.preferences
        : {
            desiredRoles: ['Frontend Engineer', 'UI Developer', 'Associate Software Engineer'],
            targetSalaryRange: '₹10,00,000 - ₹18,00,000 PA',
            preferredLocations: ['Bengaluru', 'Chennai', 'Remote'],
            workModes: ['Hybrid', 'Remote'],
          },

      resume: {
        fileName,
        fileSize,
        fileType: fileName.endsWith('.pdf') ? 'PDF' : fileName.endsWith('.docx') ? 'DOCX' : 'DOC',
        uploadedAt: new Date().toISOString(),
        extractionMode: 'demo',
        isDemoExtraction: true,
      },
    };
  },

  // Alias for service flexibility
  async parseResume(file, currentUser = null) {
    return this.processResume(file, currentUser);
  },
};
