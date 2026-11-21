import { describe, expect, it } from 'vitest';
import {
  cn,
  formatDateLabel,
  fuzzyMatch,
  generateId,
  getInitials,
  isSalaryWithinCap,
  normalizeSearchTerm,
  parseSalaryRange,
} from './helpers.js';

describe('helpers', () => {
  it('joins only truthy class names', () => {
    expect(cn('a', null, false, 'b')).toBe('a b');
  });

  it('derives initials from names', () => {
    expect(getInitials('Arjun Verma')).toBe('AV');
    expect(getInitials('Madonna')).toBe('MA');
    expect(getInitials('')).toBe('RC');
  });

  it('generates prefixed ids', () => {
    expect(generateId('job')).toMatch(/^job-/);
  });

  it('normalizes search terms', () => {
    expect(normalizeSearchTerm('React.js / Node-JS')).toBe('reactjsnodejs');
  });

  it('matches fuzzy search terms', () => {
    expect(fuzzyMatch('Frontend Engineer', 'front end')).toBe(true);
    expect(fuzzyMatch('Frontend Engineer', 'backend')).toBe(false);
  });

  it('parses LPA salary ranges', () => {
    expect(parseSalaryRange('₹18 - ₹24 LPA')).toEqual({ min: 18, max: 24, unit: 'lpa' });
  });

  it('converts monthly salary ranges to LPA', () => {
    expect(parseSalaryRange('₹25,000 - ₹35,000 / month')).toEqual({
      min: 3,
      max: 4.2,
      unit: 'monthly',
    });
  });

  it('returns null for unparseable salary text', () => {
    expect(parseSalaryRange('Competitive')).toBeNull();
  });

  it('filters salary ranges by cap', () => {
    expect(isSalaryWithinCap('₹18 - ₹24 LPA', 30)).toBe(true);
    expect(isSalaryWithinCap('₹45 - ₹70 LPA', 50)).toBe(false);
    expect(isSalaryWithinCap('Competitive', 30)).toBe(true);
  });

  it('keeps invalid dates as labels', () => {
    expect(formatDateLabel('not-a-date')).toBe('not-a-date');
    expect(formatDateLabel('')).toBe('Recently');
  });
});
