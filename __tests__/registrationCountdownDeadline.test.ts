// __tests__/registrationCountdownDeadline.test.ts
//
// MEYS 6th/7th concurrent-active-programs bug: two published+active programs
// can both have open registration at once, and the countdown must count down
// to whichever one closes soonest, not simply the newest by year.

import { describe, it, expect } from 'vitest';
import {
  resolveCountdownAcrossPrograms,
  type CountdownProgramEdition,
} from '@/lib/registration/deadline';

const NOW = new Date('2026-08-30T00:00:00.000Z');

function edition(overrides: Partial<CountdownProgramEdition>): CountdownProgramEdition {
  return {
    program_name: 'Program',
    registration_dates: { open: null, close: null },
    registration_types: [],
    ...overrides,
  };
}

describe('resolveCountdownAcrossPrograms', () => {
  it('returns null when there are no editions', () => {
    expect(resolveCountdownAcrossPrograms([], NOW)).toBeNull();
    expect(resolveCountdownAcrossPrograms(null, NOW)).toBeNull();
  });

  it('picks the soonest-closing program and names it (MEYS 6th over MEYS 7th)', () => {
    const winner = resolveCountdownAcrossPrograms(
      [
        edition({
          program_name: 'MEYS 7th',
          registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
        }),
        edition({
          program_name: 'MEYS 6th',
          registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
        }),
      ],
      NOW,
    );

    expect(winner).toEqual({
      deadline: '2026-12-05T00:00:00.000Z',
      programName: 'MEYS 6th',
    });
  });

  it('ignores an edition whose registration has already ended', () => {
    const winner = resolveCountdownAcrossPrograms(
      [
        edition({
          program_name: 'Ended Edition',
          registration_dates: { open: '2025-01-01T00:00:00.000Z', close: '2026-01-01T00:00:00.000Z' },
        }),
        edition({
          program_name: 'Still Open',
          registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2027-01-01T00:00:00.000Z' },
        }),
      ],
      NOW,
    );

    expect(winner?.programName).toBe('Still Open');
  });

  it('falls back to a tier deadline when a program has no registrationCloseDate', () => {
    const winner = resolveCountdownAcrossPrograms(
      [
        edition({
          program_name: 'No Close Date',
          registration_dates: { open: null, close: null },
          registration_types: [
            {
              feeType: 'registration_fee',
              allowedCategories: ['fully_funded'],
              validityPeriods: [{ startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-10-01T00:00:00.000Z' }],
            },
          ],
        }),
      ],
      NOW,
    );

    expect(winner).toEqual({
      deadline: '2026-10-01T00:00:00.000Z',
      programName: 'No Close Date',
    });
  });

  it('a single-program list still resolves normally', () => {
    const winner = resolveCountdownAcrossPrograms(
      [edition({ program_name: 'Solo', registration_dates: { open: null, close: '2026-12-31T00:00:00.000Z' } })],
      NOW,
    );

    expect(winner).toEqual({ deadline: '2026-12-31T00:00:00.000Z', programName: 'Solo' });
  });
});
