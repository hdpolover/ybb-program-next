// lib/registration/__tests__/deadline.test.ts
/**
 * Tests for lib/registration/deadline.ts.
 *
 * resolveRegistrationCountdownDeadline covers a real production incident
 * (2026-08-21): the homepage countdown/gates were fed `tierDeadline` first and
 * `program.registrationCloseDate` only as a fallback. That meant a pricing
 * tier's registration-fee validity window (which can close months before the
 * program's real registration deadline) silently overrode the program's
 * actual close date. middleeastyouthsummit.com advertised "Registration
 * closes in: 2026-08-31" while the program's real registrationCloseDate was
 * 2026-12-05 - a fully-funded tier window just happened to end first.
 *
 * The fix flips the precedence: the program's registrationCloseDate must win
 * whenever it is set. The tier deadline stays as a fallback for brands whose
 * program has no registrationCloseDate at all (e.g. Istanbul Youth Summit,
 * Youth Academic Forum), so those countdowns keep working.
 */
import { describe, it, expect } from 'vitest';
import { resolveRegistrationCountdownDeadline } from '../deadline';

describe('resolveRegistrationCountdownDeadline', () => {
  it('prefers the program registrationCloseDate when both are set', () => {
    // This is the exact incident shape: tier deadline is earlier than the
    // program's real close date and must NOT win.
    const result = resolveRegistrationCountdownDeadline(
      '2026-12-05T16:59:00.000Z',
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-12-05T16:59:00.000Z');
  });

  it('falls back to the tier deadline when the program has no registrationCloseDate', () => {
    const result = resolveRegistrationCountdownDeadline(
      null,
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-08-31T16:59:00.000Z');
  });

  it('falls back to the tier deadline when registrationCloseDate is undefined', () => {
    const result = resolveRegistrationCountdownDeadline(
      undefined,
      '2026-08-31T16:59:00.000Z',
    );
    expect(result).toBe('2026-08-31T16:59:00.000Z');
  });

  it('returns null when neither source has a date', () => {
    expect(resolveRegistrationCountdownDeadline(null, null)).toBeNull();
  });

  it('returns the program date even when there is no tier deadline at all', () => {
    const result = resolveRegistrationCountdownDeadline(
      '2026-12-05T16:59:00.000Z',
      null,
    );
    expect(result).toBe('2026-12-05T16:59:00.000Z');
  });
});

/**
 * The three-branch countdown rule (resolveRegistrationCountdown).
 *
 * Before this, the rule had only two branches: open window, else soonest
 * close date "so the banner never goes blank". That is how Korea Youth Summit
 * 4th, whose fee windows all started 2026-09-05, rendered a 183-day countdown
 * to 2027-03-05 next to an active "Register Now" while every fee card under it
 * said Closed. The missing branch is UPCOMING.
 */
import { resolveRegistrationCountdown, resolveUpcomingWindowCountdown } from '../deadline';

const feeTier = (
  categories: string[],
  periods: Array<{ startDate: string; endDate: string }>,
) => ({ feeType: 'registration_fee', allowedCategories: categories, validityPeriods: periods });

describe('resolveRegistrationCountdown', () => {
  it('MEYS: one edition open and one upcoming counts to the OPEN window close', () => {
    // The regression guard that matters most. MEYS 6th is live, MEYS 7th opens
    // later; the banner must keep describing the window a visitor can act on.
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Middle East Youth Summit 6th',
        registration_dates: { open: '2026-07-01T00:00:00.000Z', close: '2026-12-05T16:59:00.000Z' },
        registration_types: [
          feeTier(['fully_funded'], [
            { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-09-30T16:59:00.000Z' },
          ]),
        ],
      },
      {
        program_name: 'Middle East Youth Summit 7th',
        registration_dates: { open: '2026-11-01T00:00:00.000Z', close: '2027-03-05T16:59:00.000Z' },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-11-01T00:00:00.000Z', endDate: '2027-03-05T16:59:00.000Z' },
          ]),
        ],
      },
    ];

    const result = resolveRegistrationCountdown(editions, now);
    expect(result?.phase).toBe('open');
    expect(result?.deadline).toBe('2026-09-30T16:59:00.000Z');
    expect(result?.programName).toBe('Middle East Youth Summit 6th');
  });

  it('KYS: every window still upcoming counts to the SOONEST OPEN date', () => {
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Korea Youth Summit 4th',
        registration_dates: { open: '2026-08-28T16:59:00.000Z', close: '2027-03-05T16:59:00.000Z' },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-09-04T17:00:00.000Z', endDate: '2027-03-05T16:59:00.000Z' },
          ]),
          feeTier(['fully_funded'], [
            { startDate: '2026-09-04T17:00:00.000Z', endDate: '2026-11-20T16:59:00.000Z' },
          ]),
        ],
      },
    ];

    const result = resolveRegistrationCountdown(editions, now);
    expect(result?.phase).toBe('upcoming');
    // The open date, NOT the 2027-03-05 close date the old two-branch rule picked.
    expect(result?.deadline).toBe('2026-09-04T17:00:00.000Z');
  });

  it('all editions past: no countdown, so no active register CTA', () => {
    const now = new Date('2027-06-01T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Korea Youth Summit 4th',
        // A future program-level close date must NOT resurrect the countdown
        // once every window a visitor could act on has lapsed.
        registration_dates: { open: '2026-08-28T16:59:00.000Z', close: '2028-01-01T00:00:00.000Z' },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-09-04T17:00:00.000Z', endDate: '2027-03-05T16:59:00.000Z' },
          ]),
        ],
      },
    ];

    expect(resolveRegistrationCountdown(editions, now)).toBeNull();
  });

  it('keeps the program-date countdown for editions with no fee windows at all', () => {
    // Istanbul Youth Summit / Youth Academic Forum shape: registration is
    // governed purely by the program's own dates. Blanking their banner would
    // be a regression, not a fix.
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Istanbul Youth Summit',
        registration_dates: { open: null, close: '2026-12-05T16:59:00.000Z' },
        registration_types: [],
      },
    ];

    const result = resolveRegistrationCountdown(editions, now);
    expect(result?.phase).toBe('open');
    expect(result?.deadline).toBe('2026-12-05T16:59:00.000Z');
  });

  it('returns null for no editions at all', () => {
    expect(resolveRegistrationCountdown([], new Date())).toBeNull();
    expect(resolveRegistrationCountdown(null, new Date())).toBeNull();
  });
});

describe('resolveUpcomingWindowCountdown', () => {
  it('picks the soonest start across editions and categories', () => {
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Later',
        registration_dates: { open: null, close: null },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-11-01T00:00:00.000Z', endDate: '2027-01-01T00:00:00.000Z' },
          ]),
        ],
      },
      {
        program_name: 'Sooner',
        registration_dates: { open: null, close: null },
        registration_types: [
          feeTier(['fully_funded'], [
            { startDate: '2026-09-04T17:00:00.000Z', endDate: '2026-11-20T16:59:00.000Z' },
          ]),
        ],
      },
    ];

    const result = resolveUpcomingWindowCountdown(editions, now);
    expect(result?.deadline).toBe('2026-09-04T17:00:00.000Z');
    expect(result?.programName).toBe('Sooner');
    expect(result?.categoryLabel).toBe('Fully Funded');
  });

  it('ignores windows that have already started', () => {
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Running',
        registration_dates: { open: null, close: null },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-12-01T00:00:00.000Z' },
          ]),
        ],
      },
    ];
    expect(resolveUpcomingWindowCountdown(editions, now)).toBeNull();
  });
});
