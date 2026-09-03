import { describe, it, expect } from 'vitest';
import { resolveOpenWindowCountdown } from '@/lib/registration/deadline';

const tier = (cat: string, periods: Array<[string, string]>) => ({
  feeType: 'registration_fee',
  allowedCategories: [cat],
  validityPeriods: periods.map(([startDate, endDate]) => ({ startDate, endDate })),
});

const edition = (name: string, close: string, tiers: ReturnType<typeof tier>[]) => ({
  program_name: name,
  registration_dates: { open: null, close },
  registration_types: tiers,
});

const NOW = new Date('2026-08-31T10:00:00Z');

describe('resolveOpenWindowCountdown', () => {
  it('counts to the soonest window that is open right now, and names the category', () => {
    // The real MEYS case: fully funded closes tonight, self funded in November,
    // and the programme itself not until December.
    const winner = resolveOpenWindowCountdown(
      [
        edition('MEYS 6th', '2026-12-05T16:59:00Z', [
          tier('fully_funded', [['2026-07-28T16:59:00Z', '2026-08-31T16:59:00Z']]),
          tier('self_funded', [['2026-05-24T17:01:00Z', '2026-11-07T16:59:00Z']]),
        ]),
      ],
      NOW,
    );
    // WIB end-of-day on the window's last calendar day, the same boundary
    // the server's tier-period gate uses.
    expect(winner?.deadline).toBe('2026-08-31T16:59:59.999Z');
    expect(winner?.programName).toBe('MEYS 6th');
    expect(winner?.categoryLabel).toBe('Fully Funded');
  });

  it('ignores windows that have not opened yet', () => {
    const winner = resolveOpenWindowCountdown(
      [
        edition('MEYS 7th', '2027-03-20T16:59:00Z', [
          tier('fully_funded', [['2026-09-01T16:59:00Z', '2026-11-10T16:59:00Z']]),
        ]),
      ],
      NOW,
    );
    expect(winner).toBeNull();
  });

  it('returns null when every window has lapsed, so the caller keeps the program date', () => {
    // This is the 2026-08-21 incident shape: a lapsed chain must not produce a
    // deadline months earlier than the real registration close.
    const winner = resolveOpenWindowCountdown(
      [
        edition('China 2026', '2026-11-02T16:59:00Z', [
          tier('fully_funded', [['2026-04-14T00:00:00Z', '2026-08-21T16:59:00Z']]),
        ]),
      ],
      NOW,
    );
    expect(winner).toBeNull();
  });

  it('picks across editions, not just within one', () => {
    const winner = resolveOpenWindowCountdown(
      [
        edition('Later edition', '2027-03-20T16:59:00Z', [
          tier('self_funded', [['2026-01-01T00:00:00Z', '2027-02-02T16:59:00Z']]),
        ]),
        edition('Sooner edition', '2026-12-05T16:59:00Z', [
          tier('self_funded', [['2026-01-01T00:00:00Z', '2026-09-30T16:59:00Z']]),
        ]),
      ],
      NOW,
    );
    expect(winner?.programName).toBe('Sooner edition');
  });
});
