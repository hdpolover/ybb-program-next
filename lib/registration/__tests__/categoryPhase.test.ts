// lib/registration/__tests__/categoryPhase.test.ts
/**
 * Per-category registration window. MEYS/CYS 2026: Fully Funded closed while
 * Self Funded (and the programme's own dates) stayed open, and signup trusted
 * ?applicationCategory=fully_funded from old ads, so Fully Funded accounts kept
 * being created.
 */
import { describe, it, expect } from 'vitest';
import {
  buildCategoryFallbackNotice,
  getCategoryRegistrationPhase,
  normalizeRegistrationCategory,
  resolveSignupCategory,
} from '../categoryPhase';

const NOW = new Date('2026-09-17T05:00:00.000Z');
const lapsed = [{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-09-05T00:00:00.000Z' }];
const running = [{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-11-30T00:00:00.000Z' }];
const future = [{ start_date: '2026-10-01T00:00:00.000Z', end_date: '2026-11-30T00:00:00.000Z' }];

const tier = (categories: string[], validity_periods: typeof lapsed, fee_type = 'registration_fee') => ({
  fee_type,
  allowed_categories: categories,
  validity_periods,
});

const programDates = { open: '2026-07-01T00:00:00.000Z', close: '2026-11-30T00:00:00.000Z' };

describe('getCategoryRegistrationPhase', () => {
  it('reads each category off its own tiers', () => {
    const tiers = [tier(['fully_funded'], lapsed), tier(['self_funded'], running)];
    expect(getCategoryRegistrationPhase(tiers, 'fully_funded', programDates, NOW)).toBe('closed');
    expect(getCategoryRegistrationPhase(tiers, 'self_funded', programDates, NOW)).toBe('open');
  });

  it('is upcoming before the window opens', () => {
    expect(getCategoryRegistrationPhase([tier(['fully_funded'], future)], 'fully_funded', programDates, NOW)).toBe('upcoming');
  });

  it('is open when any tier for the category is open', () => {
    const tiers = [tier(['fully_funded'], lapsed), tier(['fully_funded'], running)];
    expect(getCategoryRegistrationPhase(tiers, 'fully_funded', programDates, NOW)).toBe('open');
  });

  it('is unconfigured without a registration-fee tier for the category', () => {
    expect(getCategoryRegistrationPhase([tier(['self_funded'], running)], 'fully_funded', programDates, NOW)).toBe('unconfigured');
    expect(getCategoryRegistrationPhase([tier(['fully_funded'], lapsed, 'program_fee_1')], 'fully_funded', programDates, NOW)).toBe('unconfigured');
    expect(getCategoryRegistrationPhase([tier([], running)], 'fully_funded', programDates, NOW)).toBe('unconfigured');
  });

  it('lets a tier without windows follow the edition dates', () => {
    expect(getCategoryRegistrationPhase([tier(['fully_funded'], [])], 'fully_funded', programDates, NOW)).toBe('open');
    expect(
      getCategoryRegistrationPhase([tier(['fully_funded'], [])], 'fully_funded', { open: '2026-07-01T00:00:00.000Z', close: '2026-09-01T00:00:00.000Z' }, NOW),
    ).toBe('closed');
  });

  it('accepts the camelCase wire shape and hyphenated categories', () => {
    const camel = { feeType: 'registration_fee', allowedCategories: ['fully-funded'], validityPeriods: [{ startDate: lapsed[0].start_date, endDate: lapsed[0].end_date }] };
    expect(getCategoryRegistrationPhase([camel], 'fully_funded', programDates, NOW)).toBe('closed');
  });
});

describe('resolveSignupCategory', () => {
  const edition = (tiers: ReturnType<typeof tier>[]) => ({ registration_types: tiers, registration_dates: programDates });

  it('moves a closed Fully Funded request to an open Self Funded one', () => {
    const result = resolveSignupCategory('fully_funded', edition([tier(['fully_funded'], lapsed), tier(['self_funded'], running)]), NOW);
    expect(result).toEqual({
      category: 'self_funded',
      fallback: { requested: 'fully_funded', assigned: 'self_funded', reason: 'closed' },
    });
  });

  it('keeps an open request unchanged', () => {
    expect(resolveSignupCategory('fully_funded', edition([tier(['fully_funded'], running), tier(['self_funded'], running)]), NOW)).toEqual({
      category: 'fully_funded',
    });
  });

  it('leaves the request alone when nothing else is open (the server answers closed)', () => {
    expect(resolveSignupCategory('fully_funded', edition([tier(['fully_funded'], lapsed), tier(['self_funded'], lapsed)]), NOW)).toEqual({
      category: 'fully_funded',
    });
  });

  it('reports an upcoming request as not opened yet', () => {
    const result = resolveSignupCategory('fully_funded', edition([tier(['fully_funded'], future), tier(['self_funded'], running)]), NOW);
    expect(result.fallback?.reason).toBe('upcoming');
  });

  it('is a no-op with no request, an unknown category, or no edition data', () => {
    const e = edition([tier(['fully_funded'], lapsed), tier(['self_funded'], running)]);
    expect(resolveSignupCategory('', e, NOW)).toEqual({ category: '' });
    expect(resolveSignupCategory('ambassador', e, NOW)).toEqual({ category: 'ambassador' });
    expect(resolveSignupCategory('fully_funded', null, NOW)).toEqual({ category: 'fully_funded' });
  });
});

describe('buildCategoryFallbackNotice', () => {
  it('names both categories and the programme', () => {
    expect(
      buildCategoryFallbackNotice({ requested: 'fully_funded', assigned: 'self_funded', reason: 'closed' }, 'Middle East Youth Summit 2026'),
    ).toBe('Fully Funded registration for Middle East Youth Summit 2026 has closed, so you will be registered as Self Funded.');
  });

  it('says "has not opened yet" for an upcoming window', () => {
    expect(buildCategoryFallbackNotice({ requested: 'fully_funded', assigned: 'self_funded', reason: 'upcoming' })).toBe(
      'Fully Funded registration has not opened yet, so you will be registered as Self Funded.',
    );
  });
});

describe('normalizeRegistrationCategory', () => {
  it('normalises spelling and rejects unknowns', () => {
    expect(normalizeRegistrationCategory(' Fully-Funded ')).toBe('fully_funded');
    expect(normalizeRegistrationCategory('self_funded')).toBe('self_funded');
    expect(normalizeRegistrationCategory('other')).toBeNull();
    expect(normalizeRegistrationCategory(null)).toBeNull();
  });
});
