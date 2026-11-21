import { beforeEach, describe, expect, it, vi } from 'vitest';
import { learningService } from './learningService.js';
import { storageService } from './storage/storageService.js';

const resource = {
  id: 'res-react-quickstart',
  title: 'React Quick Start',
  provider: 'React.dev',
  skills: ['React.js'],
  url: 'https://react.dev/learn',
};

const role = { id: 'frontend-engineer', title: 'Frontend Engineer', coreSkills: ['React.js'] };

describe('learningService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('keeps progress isolated by candidate and role', () => {
    const first = learningService.startResource('candidate-a', role, resource);
    const second = learningService.startResource('candidate-b', role, resource);
    const otherRole = learningService.startResource(
      'candidate-a',
      { id: 'backend-engineer', title: 'Backend Cloud Engineer' },
      resource,
    );

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(otherRole.ok).toBe(true);

    learningService.setResourceCompletion('candidate-a', role, resource, true);

    expect(learningService.getRecord('candidate-a', role, resource.id).status).toBe('completed');
    expect(learningService.getRecord('candidate-b', role, resource.id).status).toBe('in_progress');
    expect(
      learningService.getRecord('candidate-a', { id: 'backend-engineer' }, resource.id).status,
    ).toBe('in_progress');
  });

  it('derives completion from checkpoints without arbitrary percentages', () => {
    const definitions = learningService.getResourceCheckpointDefinitions(resource);
    expect(definitions).toHaveLength(3);

    definitions.forEach((checkpoint, index) => {
      const result = learningService.setCheckpoint(
        'candidate-a',
        role,
        resource,
        checkpoint.id,
        true,
      );
      expect(result.ok).toBe(true);
      if (index < definitions.length - 1) {
        expect(result.record.status).toBe('in_progress');
      }
    });

    const record = learningService.getRecord('candidate-a', role, resource.id);
    expect(record.status).toBe('completed');
    expect(record.completedCheckpoints).toBe(3);
    expect(record.checkpointCompletionPercent).toBe(100);
    expect(record.completionSource).toBe('checkpoints');

    const summary = learningService.getProgressSummary('candidate-a', role);
    expect(summary.completedResources).toBe(1);
    expect(summary.checkpointPercent).toBe(100);
  });

  it('does not report success when persistence fails', () => {
    vi.spyOn(storageService, 'set').mockReturnValue({ ok: false, error: 'quota exceeded' });

    const result = learningService.startResource('candidate-a', role, resource);

    expect(result.ok).toBe(false);
    expect(result.error).toBe('quota exceeded');
    expect(learningService.getRecord('candidate-a', role, resource.id)).toBeNull();
  });

  it('recovers from corrupted progress data', () => {
    window.localStorage.setItem('rolecompass_learning_records', '{not-json');

    expect(learningService.getAllRecords('candidate-a')).toEqual({});
    expect(learningService.getRecord('candidate-a', role, resource.id)).toBeNull();
  });

  it('stores only status and timestamp for skill progress', () => {
    const result = learningService.setSkillProgress('candidate-a', role, 'react', 'Practiced');

    expect(result.ok).toBe(true);
    expect(result.skillProgress.status).toBe('practiced');
    expect(result.skillProgress).not.toHaveProperty('completionPercentage');
    expect(result.skillProgress.updatedAt).toBeTruthy();
  });
});
