export const mockCandidateUser = {
  id: "user-cand-01",
  type: "candidate",
  personal: {
    fullName: "Arjun Verma",
    title: "Aspiring Frontend Engineer & Fresher",
    email: "arjun.verma@rolecompass.demo",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    avatar: null, // Initial fallback fallback to "AV"
    bio: "Passionate Computer Science graduate specializing in modern React, CSS architecture, and accessible web experiences."
  },
  education: [
    {
      id: "edu-1",
      institution: "National Institute of Technology, Trichy",
      degree: "B.Tech in Computer Science & Engineering",
      year: "2021 - 2025",
      score: "8.8 CGPA"
    }
  ],
  // Note: Freshers can have empty or project-focused experience arrays!
  experience: [
    {
      id: "exp-1",
      company: "TechCraft Studios",
      role: "Frontend Developer Intern",
      period: "Jan 2025 - May 2025",
      description: "Built modular React components and improved web vital performance by 28%."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "RoleCompass Career Matrix",
      tech: ["React", "CSS Tokens", "Vite"],
      description: "Built a job discovery and skill gap visualization app."
    }
  ],
  skills: ["React", "JavaScript", "HTML/CSS", "Git", "Figma"],
  resume: {
    fileName: "Arjun_Verma_Resume_2026.pdf",
    uploadedDate: "2026-09-10",
    parsedScore: 86
  },
  careerPreferences: {
    desiredRoles: ["Frontend Engineer", "UI Developer", "Associate Software Engineer"],
    targetSalaryRange: "₹10,000,000 - ₹18,000,000 PA",
    preferredLocations: ["Bengaluru", "Chennai", "Remote"],
    workModes: ["Hybrid", "Remote"]
  },
  roleProfile: {
    primaryTarget: "Frontend Engineer",
    readinessScore: 82,
    strongestSkill: "React",
    topGapSkill: "Web Performance & Performance Profiling"
  }
};

export const mockEmployerUser = {
  id: "user-emp-01",
  type: "employer",
  companyId: "zoho",
  personal: {
    fullName: "Priya Sundaram",
    title: "Senior Talent Acquisition Manager",
    email: "priya.s@zoho.com",
    avatar: null
  },
  company: {
    id: "zoho",
    name: "Zoho Corporation",
    activeJobsCount: 8,
    totalApplicants: 142
  }
};
