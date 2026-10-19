import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockCandidateUser, mockEmployerUser } from '../../data/users.js';
import { mockJobs } from '../../data/jobs.js';
import { mockCompanies } from '../../data/companies.js';
import { mockRoles } from '../../data/roles.js';
import { mockSkills } from '../../data/skills.js';
import { mockApplications } from '../../data/applications.js';
import { mockLearningModules, verifiedLearningResources, getAllLearningResources, getResourcesForSkill, getResourcesForRole, getRecommendedResourcesForGaps } from '../../data/learning.js';
import { calculateRoleCompassFit, calculateCandidateRoleFit, skillsMatch } from '../../data/matching.js';
import { storage } from '../../services/storage.js';
import { learningService, getLearningRecordKey } from '../../services/learningService.js';
import { LearningViewerModal } from '../../components/learning/LearningViewerModal.jsx';
import { Toast } from '../../components/ui/Toast.jsx';

const safeUseMemo = React.useMemo || useMemo;

const AppContext = createContext(null);

// Initial Accounts Seed
const INITIAL_ACCOUNTS_SEED = [
  {
    id: "user-cand-01",
    fullName: "Arjun Verma",
    email: "arjun.verma@rolecompass.demo",
    password: "password123",
    accountType: "fresher",
    createdAt: "2026-01-15T00:00:00.000Z",
    profileMethod: "resume",
    profileCompleted: true,
    onboardingStep: "complete",
    profile: {
      personal: mockCandidateUser.personal,
      education: mockCandidateUser.education,
      skills: mockCandidateUser.skills,
      experience: mockCandidateUser.experience,
      projects: mockCandidateUser.projects,
      preferences: mockCandidateUser.careerPreferences
    },
    resume: mockCandidateUser.resume
  },
  {
    id: "user-cand-02",
    fullName: "Arun",
    email: "arun@gmail.com",
    password: "password123",
    accountType: "fresher",
    createdAt: "2026-02-01T00:00:00.000Z",
    profileMethod: "resume",
    profileCompleted: true,
    onboardingStep: "complete",
    profile: {
      personal: {
        fullName: "Arun",
        title: "Software Developer Candidate",
        email: "arun@gmail.com",
        phone: "+91 98765 12345",
        location: "Bengaluru, India"
      },
      education: mockCandidateUser.education,
      skills: mockCandidateUser.skills,
      experience: mockCandidateUser.experience,
      projects: mockCandidateUser.projects,
      preferences: mockCandidateUser.careerPreferences
    },
    resume: mockCandidateUser.resume
  },
  {
    id: "user-emp-01",
    fullName: "Priya Sundaram",
    email: "priya.s@zoho.com",
    password: "password123",
    accountType: "employer",
    createdAt: "2026-01-10T00:00:00.000Z",
    profileMethod: "manual",
    profileCompleted: true,
    onboardingStep: "complete",
    profile: {
      personal: mockEmployerUser.personal,
      company: mockEmployerUser.company
    },
    resume: {}
  }
];

export function AppProviders({ children }) {
  // 1. ACCOUNTS REGISTRY & SESSION HYDRATION STATE
  const [accounts, setAccounts] = useState(() => storage.get('rc_accounts', INITIAL_ACCOUNTS_SEED));
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);

  // Shared platform domain data - auto-merged with fresh seed datasets
  const [jobs, setJobs] = useState(() => {
    const stored = storage.get('jobs', null);
    if (!stored || !Array.isArray(stored) || stored.length < mockJobs.length) {
      storage.set('jobs', mockJobs);
      return mockJobs;
    }
    // Update canonical jobs with fresh definitions while preserving any user-added jobs
    const freshIds = new Set(mockJobs.map(j => j.id));
    const userAdded = stored.filter(s => s && !freshIds.has(s.id));
    const merged = [...mockJobs, ...userAdded];
    storage.set('jobs', merged);
    return merged;
  });

  // Employer-supplied overrides (e.g. custom company icon / name) keyed by companyId
  const [companyOverrides, setCompanyOverrides] = useState(() => storage.get('company_overrides', {}) || {});

  const [companies, setCompanies] = useState(() => {
    const overrides = storage.get('company_overrides', {}) || {};
    const applyOverrides = (list) => list.map(c => (c && overrides[c.id]) ? { ...c, ...overrides[c.id] } : c);
    const stored = storage.get('companies', null);
    if (!stored || !Array.isArray(stored) || stored.length < mockCompanies.length) {
      const seeded = applyOverrides(mockCompanies);
      storage.set('companies', seeded);
      return seeded;
    }
    // Always refresh company records with fresh logos and metadata from mockCompanies
    const freshIds = new Set(mockCompanies.map(c => c.id));
    const userAdded = stored.filter(s => s && !freshIds.has(s.id));
    const merged = applyOverrides([...mockCompanies, ...userAdded]);
    storage.set('companies', merged);
    return merged;
  });
  const [roles] = useState(mockRoles);
  const [skills, setSkills] = useState(mockSkills);
  const [applications, setApplications] = useState(() => storage.get('applications', mockApplications));
  const [savedJobs, setSavedJobs] = useState(() => storage.get('savedJobs', ['job-001']));
  const [bgIntensity, setBgIntensity] = useState('medium');

  // Track roles explicitly targeted by candidate via "Set as Target Role" in Roles & Fit
  const [targetedRoleTitles, setTargetedRoleTitles] = useState(() => {
    const storedList = storage.get('targeted_roles', null);
    if (Array.isArray(storedList) && storedList.length > 0) {
      return storedList;
    }
    const directStored = storage.get('target_role', null);
    if (directStored && typeof directStored === 'string') {
      return [directStored];
    }
    return [];
  });

  // Single Source of Truth for Active Target Career Role (persisted in localStorage)
  const [targetRoleTitle, setTargetRoleTitle] = useState(() => {
    const directStored = storage.get('target_role', null);
    if (directStored && typeof directStored === 'string') return directStored;
    const storedList = storage.get('targeted_roles', null);
    if (Array.isArray(storedList) && storedList.length > 0) return storedList[0];
    return null;
  });

  // Role-specific learning records map: { [`${candidateId}_${roleId}_${resourceId}`]: Record }
  const [learningRecords, setLearningRecords] = useState(() => {
    return learningService.getAllRecords();
  });

  // Chronological timeline events for target roles
  const [timelineEvents, setTimelineEvents] = useState(() => {
    return learningService.getTimelineEvents();
  });

  // Active resource currently opened in the in-app learning viewer modal
  const [activeViewerResource, setActiveViewerResource] = useState(null);

  // Global toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3600);
  };

  // Track status of individual verified learning resources (legacy sync): { [id]: { status, lastAccessed, startedAt, completedAt } }
  const [resourceStates, setResourceStates] = useState(() => {
    return storage.get('resource_states', {});
  });

  // Track candidate's last-focused learning resource for resume-action
  const [lastAccessedResourceId, setLastAccessedResourceId] = useState(() => {
    return storage.get('last_accessed_resource_id', 'res-react-quickstart');
  });

  // Curated learning modules with persistent progress states
  const [learningModules, setLearningModules] = useState(() => {
    return storage.get('learning_progress', mockLearningModules);
  });

  // Perform Session Hydration on initial app load
  useEffect(() => {
    const savedSession = storage.get('rc_active_session', null);
    if (savedSession && savedSession.id) {
      // Find latest user record from accounts
      const freshUser = accounts.find(a => a.id === savedSession.id) || savedSession;
      setCurrentUser(freshUser);
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    setIsHydrating(false);
  }, []);

  // Helper to persist accounts array
  const persistAccounts = (updatedAccounts) => {
    setAccounts(updatedAccounts);
    storage.set('rc_accounts', updatedAccounts);
  };

  // Helper to update current active user session
  const persistActiveUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    storage.set('rc_active_session', updatedUser);
    setAccounts((prevAccounts) => {
      const updatedList = prevAccounts.map(acc => acc.id === updatedUser.id ? updatedUser : acc);
      storage.set('rc_accounts', updatedList);
      return updatedList;
    });
  };

  // 2. AUTHENTICATION & ACCOUNT FUNCTIONS
  const registerAccount = ({ fullName, email, password, accountType }) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Duplicate Email Check
    const exists = accounts.some(acc => acc.email.toLowerCase() === trimmedEmail);
    if (exists) {
      throw new Error('An account with this email already exists.');
    }

    const newAccount = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: trimmedEmail,
      password: password,
      accountType: accountType || 'fresher',
      createdAt: new Date().toISOString(),
      profileMethod: 'resume',
      profileCompleted: false,
      onboardingStep: accountType === 'employer' ? 'employer-company' : 'created',
      profile: {
        personal: {
          fullName: fullName.trim(),
          email: trimmedEmail,
          phone: '',
          location: '',
          headline: `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Candidate`
        },
        education: [],
        skills: [],
        experience: [],
        projects: [],
        preferences: {
          desiredRoles: [],
          targetSalaryRange: '',
          preferredLocations: [],
          workModes: []
        }
      },
      resume: {
        fileName: '',
        fileType: '',
        fileSize: '',
        uploadedAt: '',
        status: 'none'
      }
    };

    const updatedAccounts = [...accounts, newAccount];
    persistAccounts(updatedAccounts);

    // Establish authenticated session
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    storage.set('rc_active_session', newAccount);

    return newAccount;
  };

  const login = ({ email, password, roleType }) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const trimmedPassword = (password || '').trim();

    if (!trimmedEmail) {
      throw new Error('Email address is required.');
    }
    if (!trimmedPassword) {
      throw new Error('Password is required.');
    }

    const matchedAccount = accounts.find(a => a.email.toLowerCase() === trimmedEmail);
    if (!matchedAccount || matchedAccount.password !== trimmedPassword) {
      throw new Error('Email or password is incorrect.');
    }

    // Establish Session
    setCurrentUser(matchedAccount);
    setIsAuthenticated(true);
    storage.set('rc_active_session', matchedAccount);

    return matchedAccount;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    storage.remove('rc_active_session');
  };

  // 3. ONBOARDING & PROFILE UPDATERS
  const updateOnboardingStep = (step) => {
    if (!currentUser) return;
    const updated = { ...currentUser, onboardingStep: step };
    persistActiveUser(updated);
  };

  const setProfileMethod = (method) => {
    if (!currentUser) return;
    const updated = { ...currentUser, profileMethod: method };
    persistActiveUser(updated);
  };

  // Canonical Target Role Setter (Single source of truth, works in both auth and guest modes)
  const setTargetRole = (roleOrTitle) => {
    const title = typeof roleOrTitle === 'string' ? roleOrTitle : roleOrTitle?.title;
    if (!title) return null;

    const canonicalRole = roles.find(r =>
      r.title.toLowerCase() === title.toLowerCase() ||
      r.id.toLowerCase() === title.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      r.title.toLowerCase().includes(title.toLowerCase())
    ) || roles[0];

    setTargetRoleTitle(canonicalRole.title);
    storage.set('target_role', canonicalRole.title);

    // Save to list of explicitly targeted roles
    setTargetedRoleTitles((prev) => {
      const filtered = (prev || []).filter(t => t.toLowerCase() !== canonicalRole.title.toLowerCase());
      const updated = [canonicalRole.title, ...filtered];
      storage.set('targeted_roles', updated);
      return updated;
    });

    const fit = calculateCandidateRoleFit(candidateUser, canonicalRole);

    if (currentUser) {
      const existingPrefs = currentUser.profile?.preferences || {};
      const otherDesired = (existingPrefs.desiredRoles || []).filter(r => r !== canonicalRole.title);
      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          preferences: {
            ...existingPrefs,
            desiredRoles: [canonicalRole.title, ...otherDesired]
          },
          roleProfile: {
            primaryTarget: canonicalRole.title,
            targetRoleId: canonicalRole.id,
            readinessScore: fit.readinessScore,
            strongestSkill: fit.strongestSkill,
            topGapSkill: fit.topGapSkill,
            matchedCoreSkills: fit.matchedCoreSkills,
            missingCoreSkills: fit.missingCoreSkills,
            totalCoreCount: fit.totalCoreCount,
            matchedCoreCount: fit.matchedCoreCount,
            skillsCoveragePercent: fit.skillsCoveragePercent
          }
        }
      };
      persistActiveUser(updatedUser);
    }

    return {
      success: true,
      role: canonicalRole,
      roleFit: fit
    };
  };

  // Canonical Candidate Profile Update API
  const updateCandidateProfile = (partialProfile) => {
    if (partialProfile?.roleProfile?.primaryTarget) {
      setTargetRoleTitle(partialProfile.roleProfile.primaryTarget);
      storage.set('target_role', partialProfile.roleProfile.primaryTarget);
    }
    if (partialProfile?.preferences?.desiredRoles?.[0]) {
      setTargetRoleTitle(partialProfile.preferences.desiredRoles[0]);
      storage.set('target_role', partialProfile.preferences.desiredRoles[0]);
    }
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      profile: {
        ...currentUser.profile,
        ...partialProfile,
        personal: { ...(currentUser.profile?.personal || {}), ...(partialProfile.personal || {}) },
        preferences: { ...(currentUser.profile?.preferences || {}), ...(partialProfile.preferences || {}) },
        roleProfile: { ...(currentUser.profile?.roleProfile || {}), ...(partialProfile.roleProfile || {}) }
      }
    };
    persistActiveUser(updated);
  };

  // Aliases for full workspace API compatibility
  const updateProfile = updateCandidateProfile;
  const updateCandidate = updateCandidateProfile;

  // Demo candidate authentication helper for guest apply modal
  const loginAsCandidate = () => {
    const matchedAccount = accounts.find(a => a.accountType !== 'employer') || INITIAL_ACCOUNTS_SEED[0];
    setCurrentUser(matchedAccount);
    setIsAuthenticated(true);
    storage.set('rc_active_session', matchedAccount);
    return matchedAccount;
  };

  // Deterministic profile completion calculator (No hardcoded 90%; non-penalizing for freshers)
  const calculateProfileCompletion = (candidateObj = null) => {
    const user = candidateObj || currentUser || candidateUser;
    if (!user) return 0;

    const personal = user.personal || user.profile?.personal || {};
    const education = user.education || user.profile?.education || [];
    const experience = user.experience || user.profile?.experience || [];
    const skills = user.skills || user.profile?.skills || [];
    const projects = user.projects || user.profile?.projects || [];

    let score = 0;
    // Personal Info (30%)
    if (personal.fullName) score += 10;
    if (personal.email) score += 10;
    if (personal.phone && personal.location) score += 10;

    // Education (20%)
    if (education.length > 0) score += 20;

    // Skills (25%)
    if (skills.length >= 4) score += 25;
    else if (skills.length > 0) score += 15;

    // Experience / Projects (20%) — Freshers/Students not penalized for missing work experience if projects exist
    const isFresher = user.accountType === 'fresher' || user.accountType === 'student';
    if (experience.length > 0) {
      score += 20;
    } else if (isFresher && projects.length > 0) {
      score += 20;
    } else if (projects.length > 0) {
      score += 10;
    }

    // Links (5%)
    if (personal.portfolioUrl || personal.linkedinUrl || personal.githubUrl || user.profile?.links) {
      score += 5;
    }

    return Math.min(100, score);
  };

  const setResumeData = (resumeMetadata) => {
    if (!currentUser) return;
    const updated = { ...currentUser, resume: resumeMetadata };
    persistActiveUser(updated);
  };

  const completeProfile = () => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      profileCompleted: true,
      onboardingStep: 'complete'
    };
    persistActiveUser(updated);
  };

  // Workspace Switcher API
  const switchWorkspace = (targetRole) => {
    if (!currentUser) return;
    const isTargetEmployer = targetRole === 'employer';
    const updated = {
      ...currentUser,
      accountType: isTargetEmployer ? 'employer' : (currentUser._previousCandidateType || 'fresher'),
      _previousCandidateType: currentUser.accountType !== 'employer' ? currentUser.accountType : (currentUser._previousCandidateType || 'fresher')
    };
    persistActiveUser(updated);
  };

  // Canonical active target role object and live computed role fit
  const activeTargetRole = safeUseMemo(() => {
    if (!targetRoleTitle) return null;
    return roles.find(r =>
      r.title.toLowerCase() === targetRoleTitle.toLowerCase() ||
      r.id.toLowerCase() === targetRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, '-') ||
      r.title.toLowerCase().includes(targetRoleTitle.toLowerCase())
    ) || null;
  }, [roles, targetRoleTitle]);

  const targetedRoles = safeUseMemo(() => {
    if (!targetedRoleTitles || targetedRoleTitles.length === 0) return [];
    return roles.filter(r =>
      targetedRoleTitles.some(t =>
        r.title.toLowerCase() === t.toLowerCase() ||
        r.id.toLowerCase() === t.toLowerCase().replace(/[^a-z0-9]/g, '-')
      )
    );
  }, [roles, targetedRoleTitles]);

  const hasTargetRole = Boolean(activeTargetRole && targetedRoles.length > 0);

  const candidateSkillsList = (currentUser?.profile?.skills && currentUser.profile.skills.length > 0)
    ? currentUser.profile.skills
    : mockCandidateUser.skills;

  const activeRoleFit = safeUseMemo(() => {
    if (!activeTargetRole) {
      return {
        readinessScore: 0,
        strongestSkill: 'None',
        topGapSkill: 'None',
        matchedCoreSkills: [],
        missingCoreSkills: [],
        matchedRelatedSkills: [],
        totalCoreCount: 0,
        matchedCoreCount: 0,
        skillsCoveragePercent: 0
      };
    }
    return calculateCandidateRoleFit(
      { ...mockCandidateUser, ...(currentUser?.profile || {}), skills: candidateSkillsList },
      activeTargetRole
    );
  }, [currentUser, mockCandidateUser, candidateSkillsList, activeTargetRole]);

  // Derive candidateUser for workspace compatibility
  const candidateUser = currentUser && currentUser.accountType !== 'employer'
    ? {
      id: currentUser.id,
      accountType: currentUser.accountType || 'fresher',
      personal: currentUser.profile?.personal || { fullName: currentUser.fullName, email: currentUser.email, phone: "+91 98765 43210", location: "Bengaluru, Karnataka" },
      education: (currentUser.profile?.education && currentUser.profile.education.length > 0) ? currentUser.profile.education : mockCandidateUser.education,
      experience: currentUser.profile?.experience || mockCandidateUser.experience,
      skills: candidateSkillsList,
      projects: (currentUser.profile?.projects && currentUser.profile.projects.length > 0) ? currentUser.profile.projects : mockCandidateUser.projects,
      resume: (currentUser.resume && currentUser.resume.fileName) ? currentUser.resume : mockCandidateUser.resume,
      careerPreferences: {
        ...(currentUser.profile?.preferences || mockCandidateUser.careerPreferences),
        desiredRoles: activeTargetRole ? [
          activeTargetRole.title,
          ...((currentUser.profile?.preferences?.desiredRoles || mockCandidateUser.careerPreferences.desiredRoles).filter(r => r !== activeTargetRole.title))
        ] : (currentUser.profile?.preferences?.desiredRoles || mockCandidateUser.careerPreferences.desiredRoles)
      },
      roleProfile: {
        primaryTarget: activeTargetRole?.title || '',
        targetRoleId: activeTargetRole?.id || '',
        readinessScore: activeRoleFit.readinessScore,
        strongestSkill: activeRoleFit.strongestSkill,
        topGapSkill: activeRoleFit.topGapSkill,
        matchedCoreSkills: activeRoleFit.matchedCoreSkills,
        missingCoreSkills: activeRoleFit.missingCoreSkills,
        matchedRelatedSkills: activeRoleFit.matchedRelatedSkills,
        totalCoreCount: activeRoleFit.totalCoreCount,
        matchedCoreCount: activeRoleFit.matchedCoreCount,
        skillsCoveragePercent: activeRoleFit.skillsCoveragePercent
      },
      profileCompleted: Boolean(currentUser.profileCompleted),
      hasCompletedProfile: Boolean(currentUser.profileCompleted)
    }
    : {
      ...mockCandidateUser,
      careerPreferences: {
        ...mockCandidateUser.careerPreferences,
        desiredRoles: activeTargetRole ? [
          activeTargetRole.title,
          ...mockCandidateUser.careerPreferences.desiredRoles.filter(r => r !== activeTargetRole.title)
        ] : mockCandidateUser.careerPreferences.desiredRoles
      },
      roleProfile: {
        primaryTarget: activeTargetRole?.title || '',
        targetRoleId: activeTargetRole?.id || '',
        readinessScore: activeRoleFit.readinessScore,
        strongestSkill: activeRoleFit.strongestSkill,
        topGapSkill: activeRoleFit.topGapSkill,
        matchedCoreSkills: activeRoleFit.matchedCoreSkills,
        missingCoreSkills: activeRoleFit.missingCoreSkills,
        matchedRelatedSkills: activeRoleFit.matchedRelatedSkills,
        totalCoreCount: activeRoleFit.totalCoreCount,
        matchedCoreCount: activeRoleFit.matchedCoreCount,
        skillsCoveragePercent: activeRoleFit.skillsCoveragePercent
      },
      profileCompleted: true,
      hasCompletedProfile: true
    };

  // Derive employerUser
  const employerUser = currentUser && currentUser.accountType === 'employer'
    ? {
      id: currentUser.id,
      type: 'employer',
      companyId: 'zoho',
      personal: {
        fullName: currentUser.fullName,
        email: currentUser.email,
        title: 'Hiring Manager'
      },
      company: currentUser.profile?.company || mockEmployerUser.company
    }
    : mockEmployerUser;

  // Update a company record (e.g. employer uploads a custom icon) and persist the override
  const updateCompany = (companyId, partial = {}) => {
    const targetId = companyId || (employerUser && employerUser.companyId) || 'zoho';
    if (!targetId) return;

    setCompanyOverrides((prev) => {
      const updated = { ...prev, [targetId]: { ...(prev[targetId] || {}), ...partial } };
      storage.set('company_overrides', updated);
      return updated;
    });

    setCompanies((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = freshIdsHas(prev, targetId);
      const updated = exists
        ? prev.map(c => c.id === targetId ? { ...c, ...partial } : c)
        : [...prev, { id: targetId, name: partial.name || targetId, ...partial }];
      storage.set('companies', updated);
      return updated;
    });
  };

  // Update the signed-in employer's profile + company record
  const updateEmployer = (partial = {}) => {
    if (!currentUser) return;
    const companyId = employerUser?.companyId || 'zoho';
    const nextCompany = {
      ...(currentUser.profile?.company || {}),
      ...(partial.company || {})
    };
    const updatedUser = {
      ...currentUser,
      fullName: partial.fullName || currentUser.fullName,
      profile: { ...currentUser.profile, company: nextCompany }
    };
    persistActiveUser(updatedUser);
    updateCompany(companyId, { name: partial.company?.name, ...partial.company });
  };

  // Domain Actions (Add Job, Submit App, etc.)
  const addJob = (newJobData) => {
    const createdJob = {
      id: `job-${Date.now().toString().slice(-4)}`,
      postedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      companyId: employerUser.companyId || "zoho",
      ...newJobData
    };

    setJobs((prevJobs) => {
      const updated = [createdJob, ...prevJobs];
      storage.set('jobs', updated);
      return updated;
    });

    return createdJob;
  };

  const submitApplication = ({ jobId, screeningAnswers = {} }) => {
    const existing = applications.find(a => a.jobId === jobId && a.candidateId === candidateUser.id);
    if (existing) return existing;

    const fit = calculateRoleCompassFit(candidateUser, jobs.find(j => j.id === jobId));

    const newApp = {
      id: `RC-${Math.floor(100000 + Math.random() * 900000)}`,
      jobId,
      candidateId: candidateUser.id,
      companyId: jobs.find(j => j.id === jobId)?.companyId || 'company',
      status: "Applied",
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      resumeUsed: candidateUser.resume?.fileName || "Candidate_Resume_2026.pdf",
      roleCompassFitScore: fit.fitScore,
      screeningAnswers,
      candidateSnapshot: {
        fullName: candidateUser.personal?.fullName,
        email: candidateUser.personal?.email,
        phone: candidateUser.personal?.phone,
        skills: candidateUser.skills,
        education: candidateUser.education,
        experience: candidateUser.experience
      },
      notes: "Newly submitted application by candidate."
    };

    setApplications((prev) => {
      const updated = [newApp, ...prev];
      storage.set('applications', updated);
      return updated;
    });

    return newApp;
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    setApplications((prev) => {
      const updated = prev.map((app) => {
        if (app.id === applicationId) {
          return {
            ...app,
            status: newStatus,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return app;
      });
      storage.set('applications', updated);
      return updated;
    });
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      storage.set('savedJobs', updated);
      return updated;
    });
  };

  // In-App Viewer Modal Actions
  const openLearningViewer = (resourceId, roleObj = null) => {
    if (!resourceId) return;
    const all = getAllLearningResources();
    const res = all.find(r => r.id === resourceId) || verifiedLearningResources.find(r => r.id === resourceId);
    if (!res) return;
    const targetRole = roleObj || activeTargetRole;
    const record = learningService.getRecord(candidateUser?.id, targetRole.id, res.id);
    setActiveViewerResource({ resource: res, role: targetRole, record });
  };

  const closeLearningViewer = () => {
    setActiveViewerResource(null);
  };

  const startLearningResource = (resourceId, roleObj = null) => {
    if (!resourceId) return null;
    const all = getAllLearningResources();
    const res = all.find(r => r.id === resourceId) || verifiedLearningResources.find(r => r.id === resourceId);
    if (!res) return null;
    const targetRole = roleObj || activeTargetRole;
    const updatedRecord = learningService.startResource(candidateUser?.id, targetRole, res);

    setLearningRecords({ ...learningService.getAllRecords() });
    setTimelineEvents([...learningService.getTimelineEvents()]);
    setResourceStates(storage.get('resource_states', {}));
    setLastAccessedResourceId(resourceId);

    // Open in-app viewer modal
    setActiveViewerResource({ resource: res, role: targetRole, record: updatedRecord });
    return updatedRecord;
  };

  const resumeLearningResource = (resourceId, roleObj = null) => {
    return startLearningResource(resourceId, roleObj);
  };

  const completeLearningResource = (resourceId, markCompleted = true, roleObj = null) => {
    if (!resourceId) return null;
    const all = getAllLearningResources();
    const res = all.find(r => r.id === resourceId) || verifiedLearningResources.find(r => r.id === resourceId);
    if (!res) return null;
    const targetRole = roleObj || activeTargetRole;
    const updatedRecord = learningService.setResourceCompletion(candidateUser?.id, targetRole, res, markCompleted);

    setLearningRecords({ ...learningService.getAllRecords() });
    setTimelineEvents([...learningService.getTimelineEvents()]);
    setResourceStates(storage.get('resource_states', {}));

    if (activeViewerResource && activeViewerResource.resource.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updatedRecord });
    }
    return updatedRecord;
  };

  const saveLearningResource = (resourceId, isSaved = true, roleObj = null) => {
    if (!resourceId) return null;
    const all = getAllLearningResources();
    const res = all.find(r => r.id === resourceId) || verifiedLearningResources.find(r => r.id === resourceId);
    if (!res) return null;
    const targetRole = roleObj || activeTargetRole;
    const updatedRecord = learningService.toggleSaveResource(candidateUser?.id, targetRole, res, isSaved);

    setLearningRecords({ ...learningService.getAllRecords() });
    setTimelineEvents([...learningService.getTimelineEvents()]);

    if (activeViewerResource && activeViewerResource.resource.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updatedRecord });
    }
    return updatedRecord;
  };

  const saveLearningNotes = (resourceId, notes = '', roleObj = null) => {
    if (!resourceId) return null;
    const all = getAllLearningResources();
    const res = all.find(r => r.id === resourceId) || verifiedLearningResources.find(r => r.id === resourceId);
    if (!res) return null;
    const targetRole = roleObj || activeTargetRole;
    const updatedRecord = learningService.saveNotes(candidateUser?.id, targetRole, res, notes);

    setLearningRecords({ ...learningService.getAllRecords() });

    if (activeViewerResource && activeViewerResource.resource.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updatedRecord });
    }
    return updatedRecord;
  };

  const updateSkillProgress = (skillId, progressState) => {
    if (!skillId) return;
    setLearningModules((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const percentageFor = (state) => {
        if (state === 'Learning') return 45;
        if (state === 'Practiced') return 75;
        if (state === 'Demonstrated') return 100;
        return 0;
      };

      let matched = false;
      const mapped = list.map((mod) => {
        if (mod.skillId === skillId) {
          matched = true;
          return { ...mod, progressState, completionPercentage: percentageFor(progressState) };
        }
        return mod;
      });

      // Persist progress for skills that had no seeded module record yet
      if (!matched) {
        mapped.push({
          id: `mod-${skillId}`,
          skillId,
          title: `${skillId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Mastery`,
          progressState,
          completionPercentage: percentageFor(progressState),
          estimatedHours: 4
        });
      }

      storage.set('learning_progress', mapped);
      return mapped;
    });
  };

  const getJobFit = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    return calculateRoleCompassFit(candidateUser, job);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isHydrating,
        accounts,
        registerAccount,
        login,
        loginAsCandidate,
        logout,
        switchWorkspace,
        updateOnboardingStep,
        setProfileMethod,
        updateCandidateProfile,
        updateProfile,
        updateCandidate,
        setTargetRole,
        targetRoleTitle,
        activeTargetRole,
        activeRoleFit,
        targetedRoles,
        targetedRoleTitles,
        hasTargetRole,
        calculateProfileCompletion,
        setResumeData,
        completeProfile,

        jobs,
        companies,
        roles,
        skills,
        candidateUser,
        employerUser,
        applications,
        learningModules,
        resourceStates,
        lastAccessedResourceId,
        verifiedLearningResources,
        learningRecords,
        timelineEvents,
        activeViewerResource,
        openLearningViewer,
        closeLearningViewer,
        startLearningResource,
        resumeLearningResource,
        completeLearningResource,
        saveLearningResource,
        saveLearningNotes,
        learningService,
        showToast,
        savedJobs,
        bgIntensity,
        setBgIntensity,
        addJob,
        submitApplication,
        updateApplicationStatus,
        updateCompany,
        updateEmployer,
        toggleSaveJob,
        updateSkillProgress,
        getJobFit
      }}
    >
      {children}

      {/* Global In-App Learning Viewer Modal */}
      {activeViewerResource && (
        <LearningViewerModal
          isOpen={!!activeViewerResource}
          onClose={closeLearningViewer}
          resource={activeViewerResource.resource}
          targetRole={activeViewerResource.role}
          record={activeViewerResource.record}
          onToggleComplete={(res, isDone) => completeLearningResource(res.id, isDone, activeViewerResource.role)}
          onToggleSave={(res, isSaved) => saveLearningResource(res.id, isSaved, activeViewerResource.role)}
          onSaveNotes={(resId, notes) => saveLearningNotes(resId, notes, activeViewerResource.role)}
          showToast={showToast}
        />
      )}

      {/* Global Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProviders');
  }
  return context;
}


