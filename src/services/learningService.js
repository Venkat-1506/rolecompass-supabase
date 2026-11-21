import { storageService } from './storage/storageService.js';
import { mockRoles } from '../data/roles.js';
import { skillsMatch } from '../data/matching.js';

const STORAGE_KEYS = {
  RECORDS: 'learning_records',
  TIMELINE: 'learning_timeline_events',
  LEGACY_STATES: 'resource_states',
  LEGACY_LAST_ID: 'last_accessed_resource_id',
  SAVED_ITEMS: 'saved_learning_resources',
  CHECKPOINTS: 'learning_checkpoints',
  SKILL_PROGRESS: 'learning_progress',
};

const LEGACY_CANDIDATE_ID = 'candidate-1';
const DEFAULT_ROLE_ID = 'frontend-engineer';

function slug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function canonicalCandidateId(candidateId, allowFallback = false) {
  const id = String(candidateId || '').trim();
  if (id) return id;
  return allowFallback ? LEGACY_CANDIDATE_ID : null;
}

function canonicalRoleId(role, fallback = DEFAULT_ROLE_ID) {
  if (!role) return fallback;

  if (typeof role === 'string') {
    const normalized = slug(role);
    const aliases = {
      'frontend-developer': DEFAULT_ROLE_ID,
      'front-end-engineer': DEFAULT_ROLE_ID,
      'front-end-developer': DEFAULT_ROLE_ID,
      'full-stack-engineer': 'fullstack-engineer',
      'full-stack-developer': 'fullstack-engineer',
      'backend-developer': 'backend-engineer',
      'back-end-engineer': 'backend-engineer',
    };
    const alias = aliases[normalized];
    if (alias) return alias;
    const match = mockRoles.find(
      (item) => slug(item.id) === normalized || slug(item.title) === normalized,
    );
    return match?.id || normalized || fallback;
  }

  const id = slug(role.id);
  if (id) {
    const match = mockRoles.find((item) => slug(item.id) === id);
    return match?.id || id;
  }

  const title = slug(role.title);
  const titleMatch = mockRoles.find((item) => slug(item.title) === title);
  return titleMatch?.id || title || fallback;
}

function roleTitleFor(role, fallback = 'Target Role') {
  if (!role) return fallback;
  if (typeof role === 'string') return role;
  return role.title || role.name || fallback;
}

function readObject(key) {
  const value = storageService.get(key, null);
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function readArray(key) {
  const value = storageService.get(key, []);
  return Array.isArray(value) ? value : [];
}

function write(key, value) {
  return storageService.set(key, value);
}

function failure(error) {
  return { ok: false, error: error || 'Unable to save learning data locally.', record: null };
}

function normalizeSkillStatus(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('demonstrat')) return 'demonstrated';
  if (value.includes('practic')) return 'practiced';
  if (value.includes('learn') || value.includes('progress')) return 'learning';
  return 'not_started';
}

export function getLearningRecordKey(
  candidateId = LEGACY_CANDIDATE_ID,
  roleId = DEFAULT_ROLE_ID,
  resourceId = '',
) {
  return `${canonicalCandidateId(candidateId, true)}_${canonicalRoleId(roleId)}_${resourceId}`;
}

export function getSkillProgressKey(candidateId, role, skillId) {
  return `${canonicalCandidateId(candidateId, true)}_${canonicalRoleId(role)}_${slug(skillId)}`;
}

export function getResourceCheckpointDefinitions(resource) {
  const title = resource?.title || 'this resource';
  return [
    { id: 'reviewed', label: `Reviewed ${title}` },
    { id: 'practiced', label: 'Applied one concept in practice' },
    { id: 'reflected', label: 'Recorded a personal takeaway in notes' },
  ];
}

function checkpointKey(candidateId, roleId, resourceId) {
  return `${canonicalCandidateId(candidateId, true)}_${canonicalRoleId(roleId)}_${resourceId}`;
}

function migrateLegacyRecords(candidateId = LEGACY_CANDIDATE_ID) {
  const records = readObject(STORAGE_KEYS.RECORDS);
  if (Object.keys(records).length > 0) return records;

  const legacyStates = readObject(STORAGE_KEYS.LEGACY_STATES);
  const migrated = {};
  const uid = canonicalCandidateId(candidateId, true) || LEGACY_CANDIDATE_ID;
  const roleId = DEFAULT_ROLE_ID;
  const roleTitle = 'Frontend Engineer';

  Object.entries(legacyStates).forEach(([resourceId, state]) => {
    if (!resourceId || !state || typeof state !== 'object') return;
    const key = getLearningRecordKey(uid, roleId, resourceId);
    migrated[key] = {
      id: key,
      candidateId: uid,
      roleId,
      roleTitle,
      resourceId,
      resourceTitle: state.resourceTitle || resourceId,
      provider: state.provider || '',
      status: state.status === 'completed' ? 'completed' : 'in_progress',
      startedAt: state.startedAt || new Date().toISOString(),
      lastAccessedAt: state.lastAccessed || state.startedAt || new Date().toISOString(),
      completedAt:
        state.completedAt || (state.status === 'completed' ? new Date().toISOString() : null),
      notes: typeof state.notes === 'string' ? state.notes : '',
      saved: Boolean(state.saved),
      completionSource: state.completionSource || null,
    };
  });

  if (Object.keys(migrated).length > 0) write(STORAGE_KEYS.RECORDS, migrated);
  return migrated;
}

function getCheckpointStatesRaw(candidateId, roleId, resourceId) {
  const checkpoints = readObject(STORAGE_KEYS.CHECKPOINTS);
  const key = checkpointKey(candidateId, roleId, resourceId);
  const value = checkpoints[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function withCheckpoints(record) {
  if (!record) return null;
  const definitions = getResourceCheckpointDefinitions({
    id: record.resourceId,
    title: record.resourceTitle,
  });
  const states = getCheckpointStatesRaw(record.candidateId, record.roleId, record.resourceId);
  const completedCheckpoints = definitions.filter((item) => Boolean(states[item.id])).length;
  const totalCheckpoints = definitions.length;
  return {
    ...record,
    checkpoints: states,
    completedCheckpoints,
    totalCheckpoints,
    checkpointCompletionPercent: totalCheckpoints
      ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
      : 0,
  };
}

function updateLegacyState(record, now) {
  const legacy = readObject(STORAGE_KEYS.LEGACY_STATES);
  legacy[record.resourceId] = {
    status: record.status,
    startedAt: record.startedAt,
    completedAt: record.completedAt,
    lastAccessed: now,
    resourceTitle: record.resourceTitle,
    provider: record.provider,
    saved: record.saved,
    notes: record.notes,
    completionSource: record.completionSource,
  };
  write(STORAGE_KEYS.LEGACY_STATES, legacy);
  write(STORAGE_KEYS.LEGACY_LAST_ID, record.resourceId);
}

function appendTimelineEvent(event) {
  const events = readArray(STORAGE_KEYS.TIMELINE);
  const now = Date.now();
  const idempotencyKey = event.idempotencyKey || '';
  const isDuplicate = events.some((item) => {
    if (idempotencyKey && item.idempotencyKey === idempotencyKey) return true;
    const sameAction =
      item.eventType === event.eventType &&
      item.roleId === event.roleId &&
      item.resourceId === event.resourceId;
    return sameAction && now - new Date(item.timestamp).getTime() < 4000;
  });

  if (isDuplicate) return { ok: true, events, error: null };

  const newEvent = {
    ...event,
    id:
      event.id ||
      `evt-${idempotencyKey || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`,
    idempotencyKey,
    timestamp: event.timestamp || new Date().toISOString(),
  };
  const updated = [newEvent, ...events].slice(0, 200);
  const result = write(STORAGE_KEYS.TIMELINE, updated);
  return result.ok
    ? { ok: true, events: updated, error: null }
    : { ok: false, events, error: result.error };
}

function commitRecord(candidateId, role, resource, patch, eventMeta = null) {
  const uid = canonicalCandidateId(candidateId);
  if (!uid) return failure('A candidate is required to save learning progress.');
  if (!resource || !resource.id) return failure('A learning resource is required.');

  const roleId = canonicalRoleId(role);
  const records = migrateLegacyRecords(uid);
  const key = getLearningRecordKey(uid, roleId, resource.id);
  const existing = records[key] || {};
  const now = new Date().toISOString();
  const nextStatus = patch.status ?? existing.status ?? 'not_started';
  const next = {
    ...existing,
    id: key,
    candidateId: uid,
    roleId,
    roleTitle: roleTitleFor(role, existing.roleTitle),
    resourceId: resource.id,
    resourceTitle: resource.title || existing.resourceTitle || resource.id,
    provider: resource.provider || existing.provider || '',
    status: nextStatus,
    startedAt: patch.startedAt ?? existing.startedAt ?? (nextStatus === 'not_started' ? null : now),
    lastAccessedAt: now,
    completedAt:
      patch.completedAt !== undefined
        ? patch.completedAt
        : nextStatus === 'completed'
          ? existing.completedAt || now
          : null,
    notes: patch.notes !== undefined ? patch.notes : existing.notes || '',
    saved: patch.saved !== undefined ? Boolean(patch.saved) : Boolean(existing.saved),
    completionSource:
      patch.completionSource !== undefined
        ? patch.completionSource
        : existing.completionSource || null,
  };

  records[key] = next;
  const saved = write(STORAGE_KEYS.RECORDS, records);
  if (!saved.ok) return failure(saved.error);

  updateLegacyState(next, now);

  if (eventMeta) {
    appendTimelineEvent({
      candidateId: uid,
      roleId,
      roleTitle: next.roleTitle,
      resourceId: resource.id,
      resourceTitle: next.resourceTitle,
      provider: next.provider,
      eventType: eventMeta.type,
      description: eventMeta.description,
      timestamp: now,
      idempotencyKey: eventMeta.idempotencyKey
        ? eventMeta.idempotencyKey(uid, roleId, resource.id, existing, next)
        : '',
    });
  }

  return { ok: true, record: withCheckpoints(next), error: null };
}

function migrateLegacySkillProgress(candidateId, role) {
  const uid = canonicalCandidateId(candidateId, true) || LEGACY_CANDIDATE_ID;
  const roleId = canonicalRoleId(role);
  const raw = storageService.get(STORAGE_KEYS.SKILL_PROGRESS, null);

  if (Array.isArray(raw)) {
    const migrated = {};
    raw.forEach((item) => {
      if (!item?.skillId) return;
      const key = getSkillProgressKey(uid, roleId, item.skillId);
      migrated[key] = {
        skillId: item.skillId,
        status: normalizeSkillStatus(item.progressState || item.status),
        updatedAt: item.updatedAt || new Date().toISOString(),
        source: 'migrated',
      };
    });
    write(STORAGE_KEYS.SKILL_PROGRESS, migrated);
    return migrated;
  }

  return readObject(STORAGE_KEYS.SKILL_PROGRESS);
}

export const learningService = {
  getResourceCheckpointDefinitions(resource) {
    return getResourceCheckpointDefinitions(resource);
  },

  getAllRecords(candidateId = null) {
    const uid = canonicalCandidateId(candidateId, true);
    return migrateLegacyRecords(uid || LEGACY_CANDIDATE_ID);
  },

  getRecord(candidateId, role, resourceId) {
    const uid = canonicalCandidateId(candidateId, true);
    if (!uid || !resourceId) return null;
    const records = migrateLegacyRecords(uid);
    const record = records[getLearningRecordKey(uid, role, resourceId)];
    return withCheckpoints(record);
  },

  getRecordsForRole(candidateId, role) {
    const uid = canonicalCandidateId(candidateId);
    const roleId = canonicalRoleId(role);
    const records = this.getAllRecords(candidateId);
    return Object.values(records)
      .filter((record) => record.roleId === roleId && (!uid || record.candidateId === uid))
      .map(withCheckpoints);
  },

  getInProgressRecords(candidateId, roleId = null) {
    const uid = canonicalCandidateId(candidateId);
    const targetRoleId = roleId ? canonicalRoleId(roleId) : null;
    return Object.values(this.getAllRecords(candidateId)).filter(
      (record) =>
        record.status === 'in_progress' &&
        (!uid || record.candidateId === uid) &&
        (!targetRoleId || record.roleId === targetRoleId),
    );
  },

  getCompletedRecords(candidateId, roleId = null) {
    const uid = canonicalCandidateId(candidateId);
    const targetRoleId = roleId ? canonicalRoleId(roleId) : null;
    return Object.values(this.getAllRecords(candidateId)).filter(
      (record) =>
        record.status === 'completed' &&
        (!uid || record.candidateId === uid) &&
        (!targetRoleId || record.roleId === targetRoleId),
    );
  },

  getSavedRecords(candidateId, roleId = null) {
    const uid = canonicalCandidateId(candidateId);
    const targetRoleId = roleId ? canonicalRoleId(roleId) : null;
    return Object.values(this.getAllRecords(candidateId)).filter(
      (record) =>
        record.saved === true &&
        (!uid || record.candidateId === uid) &&
        (!targetRoleId || record.roleId === targetRoleId),
    );
  },

  startResource(candidateId, role, resource) {
    return commitRecord(
      candidateId,
      role,
      resource,
      { status: 'in_progress' },
      {
        type: 'started',
        description: `Started "${resource.title}" for ${roleTitleFor(role)}`,
        idempotencyKey: (uid, roleId, resourceId, existing) =>
          `${uid}_${roleId}_${resourceId}_${existing?.status ? 'resumed' : 'started'}`,
      },
    );
  },

  setResourceCompletion(candidateId, role, resource, isCompleted = true) {
    return commitRecord(
      candidateId,
      role,
      resource,
      {
        status: isCompleted ? 'completed' : 'in_progress',
        completionSource: isCompleted ? 'manual' : null,
      },
      {
        type: isCompleted ? 'completed' : 'reopened',
        description: isCompleted
          ? `Marked "${resource.title}" as completed for ${roleTitleFor(role)}`
          : `Reopened "${resource.title}" in progress for ${roleTitleFor(role)}`,
        idempotencyKey: (uid, roleId, resourceId) =>
          `${uid}_${roleId}_${resourceId}_${isCompleted ? 'completed' : 'reopened'}`,
      },
    );
  },

  toggleSaveResource(candidateId, role, resource, isSaved = true) {
    const result = commitRecord(candidateId, role, resource, { saved: Boolean(isSaved) });
    if (result.ok && isSaved) {
      appendTimelineEvent({
        candidateId: canonicalCandidateId(candidateId),
        roleId: canonicalRoleId(role),
        roleTitle: roleTitleFor(role),
        resourceId: resource.id,
        resourceTitle: resource.title,
        provider: resource.provider,
        eventType: 'saved',
        description: `Saved "${resource.title}" to study list for ${roleTitleFor(role)}`,
        idempotencyKey: `${canonicalCandidateId(candidateId)}_${canonicalRoleId(role)}_${resource.id}_saved`,
      });
    }
    return result;
  },

  saveNotes(candidateId, role, resource, notes = '') {
    return commitRecord(
      candidateId,
      role,
      resource,
      { notes },
      {
        type: 'notes',
        description: `Updated study notes for "${resource.title}" in ${roleTitleFor(role)}`,
        idempotencyKey: (uid, roleId, resourceId) =>
          `${uid}_${roleId}_${resourceId}_notes_${Date.now()}`,
      },
    );
  },

  getCheckpointStates(candidateId, role, resource) {
    if (!resource?.id) return {};
    const roleId = canonicalRoleId(role);
    const states = getCheckpointStatesRaw(
      canonicalCandidateId(candidateId, true),
      roleId,
      resource.id,
    );
    return getResourceCheckpointDefinitions(resource).reduce((acc, item) => {
      acc[item.id] = Boolean(states[item.id]);
      return acc;
    }, {});
  },

  setCheckpoint(candidateId, role, resource, checkpointId, completed = true) {
    const uid = canonicalCandidateId(candidateId);
    if (!uid) return failure('A candidate is required to save checkpoints.');
    if (!resource?.id) return failure('A learning resource is required.');

    const definitions = getResourceCheckpointDefinitions(resource);
    if (!definitions.some((item) => item.id === checkpointId)) {
      return failure('Unknown learning checkpoint.');
    }

    const roleId = canonicalRoleId(role);
    const mapKey = checkpointKey(uid, roleId, resource.id);
    const checkpoints = readObject(STORAGE_KEYS.CHECKPOINTS);
    const previous = checkpoints[mapKey] || {};
    const nextStates = { ...previous, [checkpointId]: Boolean(completed) };
    const savedCheckpoints = write(STORAGE_KEYS.CHECKPOINTS, {
      ...checkpoints,
      [mapKey]: nextStates,
    });
    if (!savedCheckpoints.ok) return failure(savedCheckpoints.error);

    const completedCount = definitions.filter((item) => Boolean(nextStates[item.id])).length;
    const allComplete = completedCount === definitions.length;
    const existingRecord = this.getRecord(uid, role, resource.id);
    const keepManualCompletion =
      existingRecord?.status === 'completed' && existingRecord?.completionSource === 'manual';
    const nextStatus = allComplete
      ? 'completed'
      : keepManualCompletion
        ? 'completed'
        : 'in_progress';

    const recordResult = commitRecord(
      uid,
      role,
      resource,
      {
        status: nextStatus,
        completionSource: allComplete ? 'checkpoints' : existingRecord?.completionSource || null,
      },
      {
        type: allComplete ? 'checkpoint_completed' : 'checkpoint_updated',
        description: allComplete
          ? `Completed all checkpoints for "${resource.title}" in ${roleTitleFor(role)}`
          : `Updated checkpoint for "${resource.title}" in ${roleTitleFor(role)}`,
        idempotencyKey: (candidate, currentRoleId, resourceId) =>
          `${candidate}_${currentRoleId}_${resourceId}_${allComplete ? 'checkpoints_complete' : `checkpoint_${checkpointId}_${completed}`}`,
      },
    );

    if (!recordResult.ok) {
      write(STORAGE_KEYS.CHECKPOINTS, { ...checkpoints, [mapKey]: previous });
      return recordResult;
    }

    return {
      ok: true,
      checkpointStates: nextStates,
      record: recordResult.record,
      error: null,
    };
  },

  getTimelineEvents(roleId = null, candidateId = null) {
    const uid = canonicalCandidateId(candidateId);
    const targetRoleId = roleId && roleId !== 'ALL' ? canonicalRoleId(roleId) : null;
    return readArray(STORAGE_KEYS.TIMELINE)
      .filter((event) => {
        if (!event || typeof event !== 'object') return false;
        if (uid && event.candidateId && event.candidateId !== uid) return false;
        if (targetRoleId && event.roleId !== targetRoleId) return false;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  addTimelineEvent(event) {
    const result = appendTimelineEvent(event);
    return result.events;
  },

  getSkillProgress(candidateId, role) {
    return migrateLegacySkillProgress(candidateId, role);
  },

  setSkillProgress(candidateId, role, skillId, status) {
    const uid = canonicalCandidateId(candidateId);
    if (!uid) return failure('A candidate is required to save skill progress.');
    if (!skillId) return failure('A skill is required.');

    const progress = migrateLegacySkillProgress(uid, role);
    const key = getSkillProgressKey(uid, role, skillId);
    const next = {
      skillId,
      status: normalizeSkillStatus(status),
      updatedAt: new Date().toISOString(),
      source: 'manual',
    };
    const result = write(STORAGE_KEYS.SKILL_PROGRESS, { ...progress, [key]: next });
    return result.ok ? { ok: true, skillProgress: next, error: null } : failure(result.error);
  },

  getSkillEvidence(candidateId, role, skillName, resources = []) {
    const uid = canonicalCandidateId(candidateId, true);
    const roleId = canonicalRoleId(role);
    const matched = (Array.isArray(resources) ? resources : []).filter((resource) =>
      (resource.skills || []).some(
        (item) => skillsMatch(item, skillName) || skillsMatch(item, skillName.replace(/^mod-/, '')),
      ),
    );
    const records = this.getRecordsForRole(uid, roleId);
    const recordByResource = new Map(records.map((record) => [record.resourceId, record]));
    let completedResources = 0;
    let inProgressResources = 0;
    let completedCheckpoints = 0;
    let totalCheckpoints = 0;

    matched.forEach((resource) => {
      const record = recordByResource.get(resource.id);
      if (record?.status === 'completed') completedResources += 1;
      else if (record?.status === 'in_progress') inProgressResources += 1;
      completedCheckpoints += record?.completedCheckpoints || 0;
      totalCheckpoints += record?.totalCheckpoints || 0;
    });

    const progressKey = getSkillProgressKey(uid, roleId, skillName);
    const manualStatus =
      migrateLegacySkillProgress(uid, roleId)[progressKey]?.status || 'not_started';
    const evidenceStatus = completedResources
      ? 'resource_completed'
      : inProgressResources
        ? 'in_progress'
        : manualStatus;

    return {
      totalResources: matched.length,
      completedResources,
      inProgressResources,
      completedCheckpoints,
      totalCheckpoints,
      checkpointPercent: totalCheckpoints
        ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
        : 0,
      manualStatus,
      evidenceStatus,
    };
  },

  getPathProgress(candidateId, role, steps = []) {
    const uid = canonicalCandidateId(candidateId, true);
    const records = this.getRecordsForRole(uid, role);
    const recordByResource = new Map(records.map((record) => [record.resourceId, record]));
    let completedSteps = 0;
    let completedResources = 0;
    let inProgressResources = 0;
    let totalResources = 0;

    (Array.isArray(steps) ? steps : []).forEach((step) => {
      const resources = Array.isArray(step?.resources) ? step.resources : [];
      totalResources += resources.length;
      const stepCompleted = resources.every(
        (resource) => recordByResource.get(resource.id)?.status === 'completed',
      );
      if (resources.length === 0 || stepCompleted) completedSteps += 1;
    });

    records.forEach((record) => {
      if (record.status === 'completed') completedResources += 1;
      if (record.status === 'in_progress') inProgressResources += 1;
    });

    return {
      totalSteps: steps.length,
      completedSteps,
      totalResources,
      completedResources,
      inProgressResources,
      percent: steps.length ? Math.round((completedSteps / steps.length) * 100) : 0,
    };
  },

  getProgressSummary(candidateId, role) {
    const records = this.getRecordsForRole(candidateId, role);
    const completedCheckpoints = records.reduce(
      (sum, record) => sum + record.completedCheckpoints,
      0,
    );
    const totalCheckpoints = records.reduce((sum, record) => sum + record.totalCheckpoints, 0);
    return {
      totalResources: records.length,
      inProgressResources: records.filter((record) => record.status === 'in_progress').length,
      completedResources: records.filter((record) => record.status === 'completed').length,
      savedResources: records.filter((record) => record.saved).length,
      completedCheckpoints,
      totalCheckpoints,
      checkpointPercent: totalCheckpoints
        ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
        : 0,
      trackedSkills: Object.keys(this.getSkillProgress(candidateId, role)).length,
    };
  },
};
