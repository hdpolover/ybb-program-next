import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  toFlagEmoji,
  shuffle,
  randomBetween,
  buildActivityMessage,
} from './activityToastUtils';
import type { ActivityItem } from '@/lib/api/activity';

function buildItem(overrides: Partial<ActivityItem> = {}): ActivityItem {
  return {
    type: 'accepted',
    name: 'Yuki T.',
    country: 'Japan',
    countryCode: 'JP',
    programName: 'AYIMUN',
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('toFlagEmoji', () => {
  it('converts a two letter code into regional indicator symbols', () => {
    expect(toFlagEmoji('JP')).toBe('\u{1F1EF}\u{1F1F5}');
  });

  it('accepts lower case codes', () => {
    expect(toFlagEmoji('id')).toBe(toFlagEmoji('ID'));
  });

  it('returns an empty string for an invalid code', () => {
    expect(toFlagEmoji('')).toBe('');
    expect(toFlagEmoji('JPN')).toBe('');
    expect(toFlagEmoji('J1')).toBe('');
  });
});

describe('shuffle', () => {
  it('returns a new array and leaves the input untouched', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const result = shuffle(input);
    expect(result).not.toBe(input);
    expect(input).toEqual(copy);
  });

  it('preserves every element', () => {
    expect(shuffle([1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });
});

describe('randomBetween', () => {
  it('returns the minimum when random returns zero', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(randomBetween(1000, 2000)).toBe(1000);
  });

  it('stays below the maximum when random approaches one', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999);
    const result = randomBetween(1000, 2000);
    expect(result).toBeGreaterThanOrEqual(1000);
    expect(result).toBeLessThanOrEqual(2000);
  });
});

describe('buildActivityMessage', () => {
  it('builds an acceptance message', () => {
    expect(buildActivityMessage(buildItem())).toBe(
      'Yuki T. from Japan has been accepted as a delegate of AYIMUN.',
    );
  });

  it('builds a registration message', () => {
    expect(buildActivityMessage(buildItem({ type: 'registered' }))).toBe(
      'Yuki T. from Japan just registered for AYIMUN.',
    );
  });
});
