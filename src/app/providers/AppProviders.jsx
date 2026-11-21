import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { mockCandidateUser } from '../../data/users.js';
import { mockCompanies } from '../../data/companies.js';
import { mockRoles } from '../../data/roles.js';
import { mockSkills } from '../../data/skills.js';
import { mockApplications } from '../../data/applications.js';
import { verifiedLearningResources } from '../../data/learning.js';
import { calculateCandidateRoleFit, calculateRoleCompassFit } from '../../data/matching.js';
import { storageService } from '../../services/storage/storageService.js';
import { learningService } from '../../services/learningService.js';
import { LearningViewerModal } from '../../components/learning/LearningViewerModal.jsx';
import { Toast } from '../../components/ui/Toast.jsx';
import {
  createCandidateAccount,
  sanitizeAccount,
  validateDemoCredentials,
} from '../../services/auth/demoAuthService.js';
import {
  accountFromAuthUser,
  getSupabaseSession,
  isSupabaseAuthEnabled,
  loadSupabaseAccount,
  signInWithSupabase,
  signInWithSupabaseOAuth,
  signOutSupabase,
  signUpWithSupabase,
  subscribeToSupabaseAuth,
  updateSupabaseAccount,
} from '../../services/auth/supabaseAuthService.js';
import {
  hydrateCandidateState,
  saveAccounts,
  saveSession,
} from '../../services/storage/accountStorage.js';
import { getJobsState } from '../../services/jobs/jobsService.js';
import {
  createLocalApplication,
  isValidApplicationStatus,
  loadApplications,
  saveApplications,
} from '../../services/applications/applicationsService.js';
import { calculateProfileCompletion } from '../../services/profile/profileService.js';

const AppContext = createContext(null);

const INITIAL_CANDIDATE_ACCOUNTS = [
  {
    id: 'user-cand-01',
    fullName: 'Arjun Verma',
    email: 'arjun.verma@rolecompass.demo',
    accountType: 'candidate',
    candidateTrack: 'fresher',
    createdAt: '2026-01-15T00:00:00.000Z',
    profileMethod: 'resume',
    profileCompleted: true,
    onboardingStep: 'complete',
    profile: {
      personal: mockCandidateUser.personal,
      education: mockCandidateUser.education,
      skills: mockCandidateUser.skills,
      experience: mockCandidateUser.experience,
      projects: mockCandidateUser.projects,
      preferences: mockCandidateUser.careerPreferences,
      links: {
        portfolio: mockCandidateUser.personal?.portfolioUrl || '',
        linkedin: mockCandidateUser.personal?.linkedinUrl || '',
        github: mockCandidateUser.personal?.githubUrl || '',
      },
    },
    resume: mockCandidateUser.resume,
  },
  {
    id: 'user-cand-02',
    fullName: 'Arun',
    email: 'arun@gmail.com',
    accountType: 'candidate',
    candidateTrack: 'fresher',
    createdAt: '2026-02-01T00:00:00.000Z',
    profileMethod: 'resume',
    profileCompleted: true,
    onboardingStep: 'complete',
    profile: {
      personal: {
        fullName: 'Arun',
        title: 'Software Developer Candidate',
        email: 'arun@gmail.com',
        phone: '+91 98765 12345',
        location: 'Bengaluru, India',
      },
      education: mockCandidateUser.education,
      skills: mockCandidateUser.skills,
      experience: mockCandidateUser.experience,
      projects: mockCandidateUser.projects,
      preferences: mockCandidateUser.careerPreferences,
      links: {},
    },
    resume: mockCandidateUser.resume,
  },
];

function uniqueById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function getSavedJobsKey(userId) {
  return userId ? `saved_jobs_${userId}` : 'saved_jobs_guest';
}

export function AppProviders({ children }) {
  const initialState = useMemo(() => hydrateCandidateState(INITIAL_CANDIDATE_ACCOUNTS), []);
  const initialLearningUserId = initialState.session?.id || 'guest';
  const supabaseEnabled = useMemo(() => isSupabaseAuthEnabled(), []);

  const [accounts, setAccounts] = useState(initialState.accounts || []);
  const [currentUser, setCurrentUser] = useState(initialState.session || null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialState.session));
  const [isHydrating, setIsHydrating] = useState(supabaseEnabled);

  const [jobs] = useState(() => getJobsState());
  const [companies] = useState(() => mockCompanies);
  const [roles] = useState(() => mockRoles);
  const [skills] = useState(() => mockSkills);

  const [applications, setApplications] = useState(() => {
    const stored = loadApplications();
    const merged = uniqueById([...stored, ...(mockApplications || [])]);
    if (merged.length !== stored.length) {
      saveApplications(merged);
    }
    return merged;
  });

  const [savedJobs, setSavedJobs] = useState([]);
  const [learningRecords, setLearningRecords] = useState(() =>
    learningService.getAllRecords(initialLearningUserId),
  );
  const [timelineEvents, setTimelineEvents] = useState(() =>
    learningService.getTimelineEvents(null, initialLearningUserId),
  );
  const [resourceStates, setResourceStates] = useState(() =>
    storageService.get('resource_states', {}),
  );
  const [lastAccessedResourceId] = useState(() =>
    storageService.get('last_accessed_resource_id', 'res-react-quickstart'),
  );
  const [skillProgress, setSkillProgress] = useState(() =>
    learningService.getSkillProgress(initialLearningUserId, null),
  );
  const [activeViewerResource, setActiveViewerResource] = useState(null);
  const [toast, setToast] = useState(null);

  const [targetRoleTitle, setTargetRoleTitle] = useState(() => {
    const direct = storageService.get('target_role', null);
    if (typeof direct === 'string' && direct) return direct;
    const list = storageService.get('targeted_roles', null);
    return Array.isArray(list) && list.length > 0 ? list[0] : null;
  });
  const [targetedRoleTitles, setTargetedRoleTitles] = useState(() => {
    const stored = storageService.get('targeted_roles', null);
    if (Array.isArray(stored)) return stored;
    const direct = storageService.get('target_role', null);
    return typeof direct === 'string' && direct ? [direct] : [];
  });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3600);
  }, []);

  useEffect(() => {
    if (!supabaseEnabled) {
      setIsHydrating(false);
      return undefined;
    }

    let cancelled = false;

    const applySupabaseSession = async (session) => {
      if (!session?.user) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        storageService.remove('rc_active_session');
        return;
      }

      let loaded;
      try {
        loaded = await loadSupabaseAccount(session.user);
      } catch (error) {
        showToast('error', error?.message || 'Unable to load profile data.');
        loaded = { account: accountFromAuthUser(session.user), preferences: null };
      }
      if (cancelled || !loaded?.account) return;

      setCurrentUser(loaded.account);
      setIsAuthenticated(true);
      saveSession(loaded.account);

      if (loaded.preferences?.target_role) {
        setTargetRoleTitle(loaded.preferences.target_role);
      }
      if (Array.isArray(loaded.preferences?.targeted_roles)) {
        setTargetedRoleTitles(loaded.preferences.targeted_roles);
      }
    };

    const hydrateSupabaseSession = async () => {
      try {
        const session = await getSupabaseSession();
        await applySupabaseSession(session);
      } catch (error) {
        if (!cancelled) showToast('error', error?.message || 'Unable to restore Supabase session.');
      } finally {
        if (!cancelled) setIsHydrating(false);
      }
    };

    hydrateSupabaseSession();

    const subscription = subscribeToSupabaseAuth(async (_event, session) => {
      try {
        await applySupabaseSession(session);
      } catch (error) {
        showToast('error', error?.message || 'Unable to sync Supabase session.');
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabaseEnabled, showToast]);

  useEffect(() => {
    const key = getSavedJobsKey(currentUser?.id);
    setSavedJobs(storageService.get(key, []));
  }, [currentUser?.id]);

  const persistAccounts = (nextAccounts) => {
    const cleaned = (nextAccounts || []).map(sanitizeAccount).filter(Boolean);
    setAccounts(cleaned);
    const ok = saveAccounts(cleaned).ok !== false;
    if (!ok)
      showToast('error', 'Unable to save account data locally. Check browser storage settings.');
    return cleaned;
  };

  const persistActiveUser = (updatedUser) => {
    const cleaned = sanitizeAccount(updatedUser);
    if (!cleaned) return null;
    setCurrentUser(cleaned);
    const result = saveSession(cleaned);
    if (result?.ok === false) {
      showToast('error', 'Unable to persist session locally. You may be signed out on refresh.');
    }
    setAccounts((prev) => {
      const next = prev.map((a) => (a.id === cleaned.id ? cleaned : a));
      saveAccounts(next);
      return next;
    });

    if (supabaseEnabled && !String(cleaned.id).startsWith('user-')) {
      updateSupabaseAccount(cleaned, {
        data: { learning_view_mode: storageService.get('learning_view_mode', 'focused') },
      })
        .then((syncResult) => {
          if (syncResult?.ok === false) {
            showToast('error', syncResult.error || 'Unable to save profile to Supabase.');
          }
        })
        .catch((error) => {
          showToast('error', error?.message || 'Unable to save profile to Supabase.');
        });
    }

    return cleaned;
  };

  const registerAccount = async ({ fullName, email, password, accountType = 'candidate' }) => {
    const trimmedEmail = String(email || '')
      .trim()
      .toLowerCase();
    if (!trimmedEmail) throw new Error('Email address is required.');

    if (supabaseEnabled) {
      const result = await signUpWithSupabase({
        email: trimmedEmail,
        password,
        fullName,
        candidateTrack: accountType,
      });

      if (result.requiresConfirmation) {
        return { requiresConfirmation: true, email: trimmedEmail };
      }

      const account = sanitizeAccount(result.account);
      persistAccounts([...accounts.filter((a) => a.id !== account.id), account]);
      setCurrentUser(account);
      setIsAuthenticated(true);
      saveSession(account);
      storageService.set(getSavedJobsKey(account.id), []);
      return account;
    }

    if (accounts.some((a) => a.email?.toLowerCase() === trimmedEmail)) {
      throw new Error('An account with this email already exists in this demo workspace.');
    }

    const newAccount = createCandidateAccount({ fullName, email: trimmedEmail, accountType });
    const next = [...accounts, newAccount];
    persistAccounts(next);
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    saveSession(newAccount);
    storageService.set(getSavedJobsKey(newAccount.id), []);

    return newAccount;
  };

  const login = async ({ email, password }) => {
    if (supabaseEnabled) {
      const result = await signInWithSupabase({ email, password });
      const account = sanitizeAccount(result.account);
      setCurrentUser(account);
      setIsAuthenticated(true);
      const saved = saveSession(account);
      if (saved?.ok === false) {
        throw new Error('Unable to start session because local storage is unavailable.');
      }
      if (result.preferences?.target_role) {
        setTargetRoleTitle(result.preferences.target_role);
      }
      if (Array.isArray(result.preferences?.targeted_roles)) {
        setTargetedRoleTitles(result.preferences.targeted_roles);
      }
      return account;
    }

    const result = validateDemoCredentials(email, password, accounts);
    if (!result.ok) {
      throw new Error(result.error);
    }
    const account = sanitizeAccount(result.account);
    setCurrentUser(account);
    setIsAuthenticated(true);
    const saved = saveSession(account);
    if (saved?.ok === false) {
      throw new Error('Unable to start session because local storage is unavailable.');
    }
    if (result.notice) {
      showToast('info', result.notice);
    }
    return account;
  };

  const signInWithOAuth = async (provider) => {
    if (!supabaseEnabled) {
      throw new Error('OAuth sign-in is not configured in this demo workspace.');
    }
    return signInWithSupabaseOAuth(provider);
  };

  const logout = async () => {
    if (supabaseEnabled) {
      const result = await signOutSupabase();
      if (result?.ok === false) {
        showToast('error', result.error || 'Unable to sign out of Supabase.');
      }
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    storageService.remove('rc_active_session');
  };

  const updateOnboardingStep = (step) => {
    if (!currentUser) return;
    persistActiveUser({ ...currentUser, onboardingStep: step });
  };

  const setProfileMethod = (method) => {
    if (!currentUser) return;
    persistActiveUser({ ...currentUser, profileMethod: method });
  };

  const candidateSkillsList = useMemo(() => {
    const fromUser = currentUser?.profile?.skills;
    if (Array.isArray(fromUser) && fromUser.length > 0) return fromUser;
    return [];
  }, [currentUser]);

  const activeTargetRole = useMemo(() => {
    if (!targetRoleTitle) return null;
    return (
      roles.find(
        (r) =>
          r.title.toLowerCase() === targetRoleTitle.toLowerCase() ||
          r.id.toLowerCase() === targetRoleTitle.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ) || null
    );
  }, [roles, targetRoleTitle]);

  const targetedRoles = useMemo(() => {
    if (!Array.isArray(targetedRoleTitles) || targetedRoleTitles.length === 0) return [];
    return roles.filter((r) =>
      targetedRoleTitles.some(
        (t) =>
          r.title.toLowerCase() === String(t).toLowerCase() ||
          r.id.toLowerCase() ===
            String(t)
              .toLowerCase()
              .replace(/[^a-z0-9]/g, '-'),
      ),
    );
  }, [roles, targetedRoleTitles]);

  const candidateUser = useMemo(() => {
    if (!currentUser) {
      return {
        id: 'guest',
        accountType: 'guest',
        personal: { fullName: 'Guest', email: '' },
        education: [],
        experience: [],
        projects: [],
        skills: [],
        resume: {},
        careerPreferences: { desiredRoles: [], preferredLocations: [], workModes: [] },
        roleProfile: {},
        profileCompleted: false,
        hasCompletedProfile: false,
      };
    }

    const profile = currentUser.profile || {};
    const fit = activeTargetRole
      ? calculateCandidateRoleFit(
          { ...mockCandidateUser, ...profile, skills: candidateSkillsList },
          activeTargetRole,
        )
      : null;

    return {
      id: currentUser.id,
      accountType: currentUser.accountType || 'candidate',
      candidateTrack: currentUser.candidateTrack || 'candidate',
      personal: profile.personal || { fullName: currentUser.fullName, email: currentUser.email },
      education: profile.education || [],
      experience: profile.experience || [],
      projects: profile.projects || [],
      skills: candidateSkillsList,
      resume: currentUser.resume || {},
      careerPreferences: profile.preferences || {
        desiredRoles: [],
        preferredLocations: [],
        workModes: [],
      },
      roleProfile: {
        ...(profile.roleProfile || {}),
        primaryTarget: activeTargetRole?.title || profile.roleProfile?.primaryTarget || '',
        targetRoleId: activeTargetRole?.id || profile.roleProfile?.targetRoleId || '',
        readinessScore: fit?.readinessScore ?? 0,
        strongestSkill: fit?.strongestSkill || 'None',
        topGapSkill: fit?.topGapSkill || 'None',
        matchedCoreSkills: fit?.matchedCoreSkills || [],
        missingCoreSkills: fit?.missingCoreSkills || [],
        matchedRelatedSkills: fit?.matchedRelatedSkills || [],
        totalCoreCount: fit?.totalCoreCount || 0,
        matchedCoreCount: fit?.matchedCoreCount || 0,
        skillsCoveragePercent: fit?.skillsCoveragePercent || 0,
      },
      profileCompleted: Boolean(currentUser.profileCompleted),
      hasCompletedProfile: Boolean(currentUser.profileCompleted),
    };
  }, [currentUser, activeTargetRole, candidateSkillsList]);

  const activeRoleFit = candidateUser.roleProfile || {
    readinessScore: 0,
    matchedCoreSkills: [],
    missingCoreSkills: [],
  };

  const hasTargetRole = Boolean(activeTargetRole);

  const setTargetRole = (roleOrTitle) => {
    const title = typeof roleOrTitle === 'string' ? roleOrTitle : roleOrTitle?.title;
    if (!title) return null;
    const canonical =
      roles.find(
        (r) =>
          r.title.toLowerCase() === title.toLowerCase() ||
          r.id.toLowerCase() === title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      ) || null;
    if (!canonical) return null;

    setTargetRoleTitle(canonical.title);
    storageService.set('target_role', canonical.title);

    setTargetedRoleTitles((prev) => {
      const filtered = (prev || []).filter(
        (t) => t.toLowerCase() !== canonical.title.toLowerCase(),
      );
      const updated = [canonical.title, ...filtered];
      storageService.set('targeted_roles', updated);
      return updated;
    });

    const fit = calculateCandidateRoleFit(
      { ...(currentUser?.profile || {}), skills: candidateSkillsList },
      canonical,
    );

    if (currentUser) {
      const existingPrefs = currentUser.profile?.preferences || {};
      const otherDesired = (existingPrefs.desiredRoles || []).filter((r) => r !== canonical.title);
      const updatedRoles = [
        canonical.title,
        ...(targetedRoleTitles || []).filter(
          (t) => String(t).toLowerCase() !== canonical.title.toLowerCase(),
        ),
      ];
      persistActiveUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          preferences: {
            ...existingPrefs,
            desiredRoles: [canonical.title, ...otherDesired],
          },
          roleProfile: {
            ...(currentUser.profile?.roleProfile || {}),
            primaryTarget: canonical.title,
            targetRoleId: canonical.id,
            readinessScore: fit.readinessScore,
            strongestSkill: fit.strongestSkill,
            topGapSkill: fit.topGapSkill,
          },
        },
      });

      if (supabaseEnabled && !String(currentUser.id).startsWith('user-')) {
        updateSupabaseAccount(currentUser, {
          targetRole: canonical.title,
          targetedRoles: updatedRoles,
          data: { learning_view_mode: storageService.get('learning_view_mode', 'focused') },
        })
          .then((result) => {
            if (result?.ok === false) {
              showToast('error', result.error || 'Unable to save target role to Supabase.');
            }
          })
          .catch((error) => {
            showToast('error', error?.message || 'Unable to save target role to Supabase.');
          });
      }
    }

    return { success: true, role: canonical, roleFit: fit };
  };

  const buildUpdatedCandidateAccount = (partialProfile = {}) => {
    if (!currentUser) return null;
    if (partialProfile?.roleProfile?.primaryTarget) {
      setTargetRoleTitle(partialProfile.roleProfile.primaryTarget);
      storageService.set('target_role', partialProfile.roleProfile.primaryTarget);
    }
    const nextFullName =
      String(partialProfile?.personal?.fullName || '').trim() || currentUser.fullName;

    return {
      ...currentUser,
      fullName: nextFullName,
      profile: {
        ...(currentUser.profile || {}),
        ...partialProfile,
        personal: { ...(currentUser.profile?.personal || {}), ...(partialProfile.personal || {}) },
        preferences: {
          ...(currentUser.profile?.preferences || {}),
          ...(partialProfile.preferences || {}),
        },
        roleProfile: {
          ...(currentUser.profile?.roleProfile || {}),
          ...(partialProfile.roleProfile || {}),
        },
        links: { ...(currentUser.profile?.links || {}), ...(partialProfile.links || {}) },
      },
    };
  };

  const updateCandidateProfile = (partialProfile = {}) => {
    const updated = buildUpdatedCandidateAccount(partialProfile);
    if (!updated) return null;
    return persistActiveUser(updated);
  };

  const saveCandidateProfile = async (partialProfile = {}) => {
    const updated = buildUpdatedCandidateAccount(partialProfile);
    if (!updated) return { ok: false, error: 'No signed-in candidate was found.' };

    const cleaned = sanitizeAccount(updated);
    setCurrentUser(cleaned);
    const saved = saveSession(cleaned);
    if (saved?.ok === false) {
      return {
        ok: false,
        error: 'Unable to persist session locally. Check browser storage settings.',
      };
    }
    setAccounts((prev) => {
      const next = prev.map((account) => (account.id === cleaned.id ? cleaned : account));
      saveAccounts(next);
      return next;
    });

    if (supabaseEnabled && !String(cleaned.id).startsWith('user-')) {
      const result = await updateSupabaseAccount(cleaned, {
        data: { learning_view_mode: storageService.get('learning_view_mode', 'focused') },
      });
      if (result?.ok === false) {
        return { ok: false, error: result.error || 'Unable to save profile to Supabase.' };
      }
    }

    return { ok: true, account: cleaned };
  };

  const updateProfile = updateCandidateProfile;
  const updateCandidate = updateCandidateProfile;

  const setResumeData = (resumeMetadata) => {
    if (!currentUser) return;
    persistActiveUser({
      ...currentUser,
      resume: { ...(currentUser.resume || {}), ...resumeMetadata },
    });
  };

  const completeProfile = () => {
    if (!currentUser) return;
    persistActiveUser({ ...currentUser, profileCompleted: true, onboardingStep: 'complete' });
  };

  const getJobFit = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    const candidateForFit = currentUser
      ? { ...(currentUser.profile || {}), skills: candidateSkillsList }
      : { skills: [] };
    return calculateRoleCompassFit(candidateForFit, job);
  };

  const userApplications = useMemo(
    () => (currentUser ? applications.filter((a) => a.candidateId === currentUser.id) : []),
    [applications, currentUser],
  );

  const submitApplication = ({ jobId, screeningAnswers = {} }) => {
    if (!currentUser) {
      return { ok: false, error: 'Sign in to save an application in this demo workspace.' };
    }
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return { ok: false, error: 'Job not found.' };

    const existing = applications.find(
      (a) => a.jobId === jobId && a.candidateId === currentUser.id,
    );
    if (existing) return { ok: true, application: existing, duplicate: true };

    const fit = getJobFit(jobId);
    const app = createLocalApplication({
      job,
      candidateUser,
      screeningAnswers,
      fitScore: fit?.fitScore ?? null,
    });

    setApplications((prev) => {
      const next = [app, ...prev];
      const saved = saveApplications(next);
      if (saved?.ok === false) {
        showToast('error', 'Unable to save application locally. Check browser storage settings.');
      }
      return next;
    });
    return { ok: true, application: app };
  };

  const updateApplicationStatus = (applicationId, newStatus) => {
    if (!isValidApplicationStatus(newStatus)) return false;
    setApplications((prev) => {
      const next = prev.map((app) =>
        app.id === applicationId && app.candidateId === currentUser?.id
          ? { ...app, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
          : app,
      );
      saveApplications(next);
      return next;
    });
    return true;
  };

  const toggleSaveJob = (jobId) => {
    const key = getSavedJobsKey(currentUser?.id);
    setSavedJobs((prev) => {
      const isSaved = prev.includes(jobId);
      const next = isSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      storageService.set(key, next);
      return next;
    });
  };

  const currentLearningUserId = candidateUser?.id || 'guest';

  const syncLearningState = useCallback(
    (user = currentUser, role = activeTargetRole) => {
      const uid = user?.id || 'guest';
      setLearningRecords(learningService.getAllRecords(uid));
      setTimelineEvents(learningService.getTimelineEvents(null, uid));
      setResourceStates(storageService.get('resource_states', {}));
      setSkillProgress(learningService.getSkillProgress(uid, role));
    },
    [currentUser, activeTargetRole],
  );

  useEffect(() => {
    syncLearningState(currentUser, activeTargetRole);
  }, [syncLearningState, currentUser, activeTargetRole]);

  const resolveLearningResource = (resourceOrId) => {
    if (!resourceOrId) return null;
    if (typeof resourceOrId === 'object') return resourceOrId;
    return (
      (verifiedLearningResources || []).find((resource) => resource.id === resourceOrId) || null
    );
  };

  const handleLearningResult = (result, fallbackMessage) => {
    if (result?.ok === false) {
      showToast('error', result.error || fallbackMessage);
      return null;
    }
    syncLearningState();
    return result?.record || null;
  };

  const openLearningViewer = (resource, role, record) =>
    setActiveViewerResource({ resource, role, record });
  const closeLearningViewer = () => setActiveViewerResource(null);

  const startLearningResource = (resourceId, roleOverride = null) => {
    const targetRole = roleOverride || activeTargetRole;
    const res = resolveLearningResource(resourceId);
    if (!res || !targetRole) return null;
    const result = learningService.startResource(currentLearningUserId, targetRole, res);
    const updated = handleLearningResult(result, 'Unable to save learning progress locally.');
    if (!updated) return null;
    openLearningViewer(res, targetRole, updated);
    return updated;
  };

  const resumeLearningResource = (resourceId, roleOverride = null) =>
    startLearningResource(resourceId, roleOverride);

  const completeLearningResource = (resourceId, markCompleted = true, roleOverride = null) => {
    const targetRole = roleOverride || activeTargetRole;
    const res = resolveLearningResource(resourceId);
    if (!res || !targetRole) return null;
    const result = learningService.setResourceCompletion(
      currentLearningUserId,
      targetRole,
      res,
      markCompleted,
    );
    const updated = handleLearningResult(result, 'Unable to update learning completion locally.');
    if (updated && activeViewerResource?.resource?.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updated });
    }
    return updated;
  };

  const saveLearningResource = (resourceId, isSaved = true, roleOverride = null) => {
    const targetRole = roleOverride || activeTargetRole;
    const res = resolveLearningResource(resourceId);
    if (!res || !targetRole) return null;
    const result = learningService.toggleSaveResource(
      currentLearningUserId,
      targetRole,
      res,
      isSaved,
    );
    const updated = handleLearningResult(result, 'Unable to update saved learning resources.');
    if (updated && activeViewerResource?.resource?.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updated });
    }
    return updated;
  };

  const saveLearningNotes = (resourceId, notes = '', roleOverride = null) => {
    const targetRole = roleOverride || activeTargetRole;
    const res = resolveLearningResource(resourceId);
    if (!res || !targetRole) return null;
    const result = learningService.saveNotes(currentLearningUserId, targetRole, res, notes);
    const updated = handleLearningResult(result, 'Unable to save study notes locally.');
    if (updated && activeViewerResource?.resource?.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updated });
    }
    return updated;
  };

  const setLearningCheckpoint = (
    resourceId,
    checkpointId,
    completed = true,
    roleOverride = null,
  ) => {
    const targetRole = roleOverride || activeTargetRole;
    const res = resolveLearningResource(resourceId);
    if (!res || !targetRole) return null;
    const result = learningService.setCheckpoint(
      currentLearningUserId,
      targetRole,
      res,
      checkpointId,
      completed,
    );
    const updated = handleLearningResult(result, 'Unable to save learning checkpoints locally.');
    if (updated && activeViewerResource?.resource?.id === resourceId) {
      setActiveViewerResource({ ...activeViewerResource, record: updated });
    }
    return updated;
  };

  const updateSkillProgress = (skillId, progressState) => {
    if (!skillId) return null;
    const result = learningService.setSkillProgress(
      currentLearningUserId,
      activeTargetRole,
      skillId,
      progressState,
    );
    if (result?.ok === false) {
      showToast('error', result.error || 'Unable to save skill progress locally.');
      return null;
    }
    syncLearningState();
    return result?.skillProgress || null;
  };

  const getLearningSummary = (role = activeTargetRole) =>
    learningService.getProgressSummary(currentLearningUserId, role);

  const getSkillEvidence = (skillName, resources = []) =>
    learningService.getSkillEvidence(currentLearningUserId, activeTargetRole, skillName, resources);

  const getPathProgress = (role = activeTargetRole, steps = []) =>
    learningService.getPathProgress(currentLearningUserId, role, steps);

  const learningModules = useMemo(
    () =>
      Object.entries(skillProgress || {}).map(([key, item]) => ({
        id: `mod-${key}`,
        skillId: item?.skillId || key,
        progressState: item?.status || 'not_started',
        status: item?.status || 'not_started',
        updatedAt: item?.updatedAt || null,
      })),
    [skillProgress],
  );

  const value = {
    currentUser,
    isAuthenticated,
    isHydrating,
    isSupabaseConfigured: supabaseEnabled,
    accounts,
    registerAccount,
    login,
    signInWithOAuth,
    logout,
    updateOnboardingStep,
    setProfileMethod,
    updateCandidateProfile,
    saveCandidateProfile,
    updateProfile,
    updateCandidate,
    setTargetRole,
    targetRoleTitle,
    activeTargetRole,
    activeRoleFit,
    targetedRoles,
    targetedRoleTitles,
    hasTargetRole,
    calculateProfileCompletion: (candidateObj = null) =>
      calculateProfileCompletion(candidateObj || candidateUser),
    setResumeData,
    completeProfile,
    jobs,
    companies,
    roles,
    skills,
    candidateUser,
    applications: userApplications,
    allApplications: applications,
    learningModules,
    skillProgress,
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
    setLearningCheckpoint,
    getLearningSummary,
    getSkillEvidence,
    getPathProgress,
    learningService,
    showToast,
    savedJobs,
    submitApplication,
    updateApplicationStatus,
    toggleSaveJob,
    updateSkillProgress,
    getJobFit,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {activeViewerResource && (
        <LearningViewerModal
          isOpen={!!activeViewerResource}
          onClose={closeLearningViewer}
          resource={activeViewerResource.resource}
          targetRole={activeViewerResource.role}
          record={activeViewerResource.record}
          onToggleComplete={(res, isDone) =>
            completeLearningResource(res.id, isDone, activeViewerResource.role)
          }
          onToggleSave={(res, isSaved) =>
            saveLearningResource(res.id, isSaved, activeViewerResource.role)
          }
          onSaveNotes={(resId, notes) => saveLearningNotes(resId, notes, activeViewerResource.role)}
          onToggleCheckpoint={(res, checkpointId, completed) =>
            setLearningCheckpoint(res.id, checkpointId, completed, activeViewerResource.role)
          }
          showToast={showToast}
        />
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
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
