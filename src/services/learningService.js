/**
 * RoleCompass Career Learning Service
 * Manages role-specific learning progress, multi-learning tracking,
 * in-app learning timeline events, and localStorage persistence.
 */

import { storage } from './storage.js';
import { getAllLearningResources, getResourcesForRole, getResourcesForSkill } from '../data/learning.js';

const STORAGE_KEYS = {
  RECORDS: 'learning_records',
  TIMELINE: 'learning_timeline_events',
  LEGACY_STATES: 'resource_states',
  LEGACY_LAST_ID: 'last_accessed_resource_id',
  SAVED_ITEMS: 'saved_learning_resources'
};

/**
 * Creates a unique composite key for a candidate + role + resource.
 */
export function getLearningRecordKey(candidateId = 'candidate-1', roleId = 'frontend-engineer', resourceId = '') {
  const cId = candidateId || 'candidate-1';
  const rId = (roleId || 'frontend-engineer').toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${cId}_${rId}_${resourceId}`;
}

/**
 * Migrates legacy flat resource_states into role-specific records.
 */
function migrateLegacyRecords() {
  const existingRecords = storage.get(STORAGE_KEYS.RECORDS, null);
  if (existingRecords && typeof existingRecords === 'object' && Object.keys(existingRecords).length > 0) {
    return existingRecords;
  }

  const legacyStates = storage.get(STORAGE_KEYS.LEGACY_STATES, {});
  const migrated = {};
  const defaultRoleId = 'frontend-engineer';
  const defaultRoleTitle = 'Frontend Engineer';

  if (legacyStates && typeof legacyStates === 'object') {
    Object.entries(legacyStates).forEach(([resId, state]) => {
      const key = getLearningRecordKey('candidate-1', defaultRoleId, resId);
      migrated[key] = {
        id: key,
        candidateId: 'candidate-1',
        roleId: defaultRoleId,
        roleTitle: defaultRoleTitle,
        resourceId: resId,
        status: state.status === 'completed' ? 'completed' : 'in_progress',
        startedAt: state.startedAt || new Date().toISOString(),
        lastAccessedAt: state.lastAccessed || state.startedAt || new Date().toISOString(),
        completedAt: state.completedAt || (state.status === 'completed' ? new Date().toISOString() : null),
        notes: '',
        saved: false
      };
    });
    storage.set(STORAGE_KEYS.RECORDS, migrated);
  }

  return migrated;
}

export const learningService = {
  /**
   * Retrieves all role-specific learning progress records.
   */
  getAllRecords() {
    return migrateLegacyRecords();
  },

  /**
   * Retrieves a single learning record for candidate + role + resource.
   */
  getRecord(candidateId, roleId, resourceId) {
    const records = this.getAllRecords();
    const key = getLearningRecordKey(candidateId, roleId, resourceId);
    return records[key] || null;
  },

  /**
   * Retrieves all records for a specific target role.
   */
  getRecordsForRole(candidateId, roleId) {
    const records = this.getAllRecords();
    const targetRoleId = (roleId || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return Object.values(records).filter(r => 
      r.roleId === targetRoleId && (!candidateId || r.candidateId === candidateId)
    );
  },

  /**
   * Retrieves all in-progress records for a role (or all roles if roleId is null).
   */
  getInProgressRecords(candidateId, roleId = null) {
    const records = this.getAllRecords();
    const all = Object.values(records);
    if (!roleId) {
      return all.filter(r => r.status === 'in_progress');
    }
    const targetRoleId = roleId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return all.filter(r => r.roleId === targetRoleId && r.status === 'in_progress');
  },

  /**
   * Retrieves all completed records for a role (or all roles if roleId is null).
   */
  getCompletedRecords(candidateId, roleId = null) {
    const records = this.getAllRecords();
    const all = Object.values(records);
    if (!roleId) {
      return all.filter(r => r.status === 'completed');
    }
    const targetRoleId = roleId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return all.filter(r => r.roleId === targetRoleId && r.status === 'completed');
  },

  /**
   * Retrieves all saved/bookmarked records for a role.
   */
  getSavedRecords(candidateId, roleId = null) {
    const records = this.getAllRecords();
    const all = Object.values(records);
    if (!roleId) {
      return all.filter(r => r.saved === true);
    }
    const targetRoleId = roleId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return all.filter(r => r.roleId === targetRoleId && r.saved === true);
  },

  /**
   * Records a learning resource as started for a specific target role.
   */
  startResource(candidateId, role, resource) {
    if (!resource || !resource.id) return null;
    const records = this.getAllRecords();
    const roleId = role?.id || (role?.title ? role.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'frontend-engineer');
    const roleTitle = role?.title || 'Frontend Engineer';
    const key = getLearningRecordKey(candidateId, roleId, resource.id);
    const existing = records[key] || {};
    const now = new Date().toISOString();

    const isResume = existing.status === 'in_progress' || existing.status === 'completed';

    const updatedRecord = {
      ...existing,
      id: key,
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      status: existing.status === 'completed' ? 'completed' : 'in_progress',
      startedAt: existing.startedAt || now,
      lastAccessedAt: now,
      completedAt: existing.completedAt || null,
      notes: existing.notes || '',
      saved: existing.saved || false
    };

    records[key] = updatedRecord;
    storage.set(STORAGE_KEYS.RECORDS, records);

    // Keep legacy storage key updated for backward compatibility
    const legacy = storage.get(STORAGE_KEYS.LEGACY_STATES, {});
    legacy[resource.id] = {
      status: updatedRecord.status,
      startedAt: updatedRecord.startedAt,
      lastAccessed: now
    };
    storage.set(STORAGE_KEYS.LEGACY_STATES, legacy);
    storage.set(STORAGE_KEYS.LEGACY_LAST_ID, resource.id);

    // Add Timeline Event
    this.addTimelineEvent({
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      eventType: isResume ? 'resumed' : 'started',
      timestamp: now,
      description: isResume 
        ? `Resumed "${resource.title}" for ${roleTitle}` 
        : `Started "${resource.title}" for ${roleTitle}`
    });

    return updatedRecord;
  },

  /**
   * Updates completion status of a resource for a specific target role.
   */
  setResourceCompletion(candidateId, role, resource, isCompleted = true) {
    if (!resource || !resource.id) return null;
    const records = this.getAllRecords();
    const roleId = role?.id || (role?.title ? role.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'frontend-engineer');
    const roleTitle = role?.title || 'Frontend Engineer';
    const key = getLearningRecordKey(candidateId, roleId, resource.id);
    const existing = records[key] || {};
    const now = new Date().toISOString();

    const updatedRecord = {
      ...existing,
      id: key,
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      status: isCompleted ? 'completed' : 'in_progress',
      startedAt: existing.startedAt || now,
      lastAccessedAt: now,
      completedAt: isCompleted ? now : null,
      notes: existing.notes || '',
      saved: existing.saved || false
    };

    records[key] = updatedRecord;
    storage.set(STORAGE_KEYS.RECORDS, records);

    // Keep legacy key updated
    const legacy = storage.get(STORAGE_KEYS.LEGACY_STATES, {});
    legacy[resource.id] = {
      status: updatedRecord.status,
      startedAt: updatedRecord.startedAt,
      completedAt: updatedRecord.completedAt,
      lastAccessed: now
    };
    storage.set(STORAGE_KEYS.LEGACY_STATES, legacy);

    // Add Timeline Event
    this.addTimelineEvent({
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      eventType: isCompleted ? 'completed' : 'reopened',
      timestamp: now,
      description: isCompleted
        ? `Marked "${resource.title}" as completed for ${roleTitle}`
        : `Reopened "${resource.title}" in progress for ${roleTitle}`
    });

    return updatedRecord;
  },

  /**
   * Toggles bookmark / save state for a resource.
   */
  toggleSaveResource(candidateId, role, resource, isSaved = true) {
    if (!resource || !resource.id) return null;
    const records = this.getAllRecords();
    const roleId = role?.id || (role?.title ? role.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'frontend-engineer');
    const roleTitle = role?.title || 'Frontend Engineer';
    const key = getLearningRecordKey(candidateId, roleId, resource.id);
    const existing = records[key] || {};
    const now = new Date().toISOString();

    const updatedRecord = {
      ...existing,
      id: key,
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      status: existing.status || 'not_started',
      startedAt: existing.startedAt || null,
      lastAccessedAt: now,
      completedAt: existing.completedAt || null,
      notes: existing.notes || '',
      saved: isSaved
    };

    records[key] = updatedRecord;
    storage.set(STORAGE_KEYS.RECORDS, records);

    if (isSaved) {
      this.addTimelineEvent({
        candidateId: candidateId || 'candidate-1',
        roleId,
        roleTitle,
        resourceId: resource.id,
        resourceTitle: resource.title,
        provider: resource.provider,
        eventType: 'saved',
        timestamp: now,
        description: `Saved "${resource.title}" to study list for ${roleTitle}`
      });
    }

    return updatedRecord;
  },

  /**
   * Saves candidate notes/checkpoints for a resource.
   */
  saveNotes(candidateId, role, resource, notes = '') {
    if (!resource || !resource.id) return null;
    const records = this.getAllRecords();
    const roleId = role?.id || (role?.title ? role.title.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'frontend-engineer');
    const roleTitle = role?.title || 'Frontend Engineer';
    const key = getLearningRecordKey(candidateId, roleId, resource.id);
    const existing = records[key] || {};
    const now = new Date().toISOString();

    const updatedRecord = {
      ...existing,
      id: key,
      candidateId: candidateId || 'candidate-1',
      roleId,
      roleTitle,
      resourceId: resource.id,
      resourceTitle: resource.title,
      provider: resource.provider,
      status: existing.status || 'in_progress',
      startedAt: existing.startedAt || now,
      lastAccessedAt: now,
      completedAt: existing.completedAt || null,
      notes,
      saved: existing.saved || false
    };

    records[key] = updatedRecord;
    storage.set(STORAGE_KEYS.RECORDS, records);
    return updatedRecord;
  },

  /**
   * Retrieves all chronological timeline events.
   */
  getTimelineEvents(roleId = null) {
    const events = storage.get(STORAGE_KEYS.TIMELINE, []);
    if (!roleId || roleId === 'ALL') {
      return events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    const targetRoleId = roleId.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return events
      .filter(e => e.roleId === targetRoleId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  /**
   * Appends an event to the chronological timeline with deduplication.
   */
  addTimelineEvent(event) {
    const events = storage.get(STORAGE_KEYS.TIMELINE, []);
    const now = new Date().getTime();

    // Deduplication check: ignore if same eventType + roleId + resourceId occurred within 4 seconds
    const isDuplicate = events.some(e => 
      e.eventType === event.eventType &&
      e.roleId === event.roleId &&
      e.resourceId === event.resourceId &&
      (now - new Date(e.timestamp).getTime()) < 4000
    );

    if (isDuplicate) return events;

    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      ...event,
      timestamp: event.timestamp || new Date().toISOString()
    };

    // Keep up to 200 recent events
    const updated = [newEvent, ...events].slice(0, 200);
    storage.set(STORAGE_KEYS.TIMELINE, updated);
    return updated;
  }
};
