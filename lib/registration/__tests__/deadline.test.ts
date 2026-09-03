// lib/registration/__tests__/deadline.test.ts
/**
 * The countdown rule (resolveRegistrationCountdown).
 *
 * Before this, the rule had only two branches: open window, else soonest
 * close date "so the banner never goes blank". That is how Korea Youth Summit
 * 4th, whose fee windows all started 2026-09-05, rendered a 183-day countdown
 * to 2027-03-05 next to an active "Register Now" while every fee card under it
 * said Closed. The missing branch was UPCOMING; the branch after THAT is the
 * programme fallback, which is what keeps the banner from going blank now.
 *
 * Every window end is compared at WIB end-of-day (see
 * lib/registration/isRegistrationOpen), so the deadlines asserted here carry
 * the ...16:59:59.999Z that the server's own gate uses.
 */
import {
  resolveRegistrationCountdown,
  resolveUpcomingWindowCountdown,
  type CountdownProgramFallback,
} from '../deadline';

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
    expect(result?.deadline).toBe('2026-09-30T16:59:59.999Z');
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
    expect(result?.deadline).toBe('2026-12-05T16:59:59.999Z');
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

/**
 * D1: the fee card and the banner must answer "has this window started" the
 * same way, because they are the same question.
 *
 * The card asks lib/registration/isRegistrationOpen (WIB start-of-day widening
 * on the earliest window); the banner asks the resolvers above. When the
 * banner compared the RAW startDate instead, a period stored at 23:59 WIB the
 * day before opening produced 23 hours of "Open" fee card + live Register
 * button beside a dead "Opens 31 Aug" span.
 */
import { getEditionRegistrationPhase } from '../isRegistrationOpen';

describe('card phase and banner phase agree', () => {
  // The documented 2026-09-01 MEYS shape: opening period stored at 23:59 WIB
  // on 30 Aug, i.e. the whole WIB day of 31 Aug is meant to be open.
  const period = { startDate: '2026-08-31T16:59:00.000Z', endDate: '2026-10-01T16:59:00.000Z' };
  const editions = [
    {
      program_name: 'Middle East Youth Summit 7th',
      registration_dates: { open: null, close: null },
      registration_types: [feeTier(['self_funded'], [period])],
    },
  ];
  const cardTiers = [
    {
      fee_type: 'registration_fee',
      validity_periods: [{ start_date: period.startDate, end_date: period.endDate }],
    },
  ];

  // WIB midnight on 31 Aug is 2026-08-30T17:00:00Z. Walk the 23 hours the two
  // implementations used to disagree over, plus an hour either side.
  const hours = Array.from({ length: 26 }, (_, i) => new Date(Date.UTC(2026, 7, 30, 16, 0, 0) + i * 3600_000));

  it.each(hours.map((now) => [now.toISOString()] as const))('agrees at %s', (iso) => {
    const now = new Date(iso);
    const cardPhase = getEditionRegistrationPhase(cardTiers, null, now);
    const bannerPhase = resolveRegistrationCountdown(editions, now)?.phase ?? 'closed';
    expect(bannerPhase).toBe(cardPhase);
  });

  it('is open (not upcoming) from WIB midnight, the same as the fee card', () => {
    const justAfterWibMidnight = new Date('2026-08-30T18:00:00.000Z');
    expect(getEditionRegistrationPhase(cardTiers, null, justAfterWibMidnight)).toBe('open');
    expect(resolveRegistrationCountdown(editions, justAfterWibMidnight)?.phase).toBe('open');
  });
});

/**
 * D5: "this edition has no fee windows" is a PER-EDITION question. Asking it
 * globally blanked Istanbul's banner and sticky bar whenever any sibling
 * edition anywhere carried a window.
 */
describe('editions with no fee windows keep their program-date countdown', () => {
  it('Istanbul keeps counting down beside a sibling whose windows have all lapsed', () => {
    const now = new Date('2026-09-03T00:00:00.000Z');
    const editions = [
      {
        program_name: 'Istanbul Youth Summit',
        registration_dates: { open: null, close: '2026-12-05T16:59:00.000Z' },
        registration_types: [],
      },
      {
        program_name: 'Lapsed sibling',
        registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-02-01T00:00:00.000Z' },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-02-01T00:00:00.000Z' },
          ]),
        ],
      },
    ];

    const result = resolveRegistrationCountdown(editions, now);
    expect(result?.phase).toBe('open');
    expect(result?.programName).toBe('Istanbul Youth Summit');
    expect(result?.deadline).toBe('2026-12-05T16:59:59.999Z');
  });
});

/**
 * The never-blank guarantee.
 *
 * The banner (RegistrationCountdownGate) and the sticky Register button
 * (StickyBottomBar) BOTH `return null` on a falsy deadline, so a resolver that
 * answers null deletes the site's primary conversion element on all six
 * brands. It may only do that when registration really is over.
 */
describe('programme fallback keeps the banner and the register CTA alive', () => {
  const now = new Date('2026-09-03T00:00:00.000Z');
  const openProgramme: CountdownProgramFallback = {
    deadline: '2026-12-05T16:59:00.000Z',
    phase: 'open',
    programName: 'Middle East Youth Summit 6th',
  };

  // The reported shape: a programme accepting registrations to December whose
  // only fee window lapsed in August. No window covers now and none is
  // upcoming, so branches 1 and 2 both decline.
  const lapsedOnly = [
    {
      program_name: 'Middle East Youth Summit 6th',
      registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T16:59:00.000Z' },
      registration_types: [
        feeTier(['fully_funded'], [
          { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-08-01T16:59:00.000Z' },
        ]),
      ],
    },
  ];

  it('without the fallback the resolver goes silent, which is the regression', () => {
    expect(resolveRegistrationCountdown(lapsedOnly, now)).toBeNull();
  });

  it('counts down to the programme close date while the programme is open', () => {
    const result = resolveRegistrationCountdown(lapsedOnly, now, openProgramme);
    expect(result?.phase).toBe('open');
    expect(result?.deadline).toBe('2026-12-05T16:59:00.000Z');
    expect(result?.programName).toBe('Middle East Youth Summit 6th');
    // No window won, so no category may be preselected on the signup link.
    expect(result?.category).toBeNull();
  });

  it('works with no editions at all, not just with lapsed ones', () => {
    expect(resolveRegistrationCountdown([], now, openProgramme)?.phase).toBe('open');
    expect(resolveRegistrationCountdown(null, now, openProgramme)?.phase).toBe('open');
    expect(resolveRegistrationCountdown(undefined, now, openProgramme)?.phase).toBe('open');
  });

  it('stays silent when the programme itself is not open', () => {
    // A stale future close date on a closed/unpublished/allowRegistration-off
    // programme must NOT resurrect the CTA. This is why the fallback carries
    // the phase and not just the date.
    for (const phase of ['closed', 'upcoming'] as const) {
      expect(resolveRegistrationCountdown(lapsedOnly, now, { ...openProgramme, phase })).toBeNull();
    }
  });

  it('stays silent when the open programme has no close date to count to', () => {
    expect(
      resolveRegistrationCountdown(lapsedOnly, now, { ...openProgramme, deadline: null }),
    ).toBeNull();
  });

  it('never outranks a real window a visitor can act on', () => {
    const live = [
      {
        program_name: 'Live edition',
        registration_dates: { open: null, close: null },
        registration_types: [
          feeTier(['self_funded'], [
            { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-09-30T16:59:00.000Z' },
          ]),
        ],
      },
    ];
    const result = resolveRegistrationCountdown(live, now, openProgramme);
    expect(result?.deadline).toBe('2026-09-30T16:59:59.999Z');
    expect(result?.programName).toBe('Live edition');
  });
});

/**
 * The signup link's `?applicationCategory=`. It used to come from a separate
 * scanner (resolveActiveRegistration) that took the minimum future `endDate`
 * compared RAW, which meant two defects: it preferred a category that had not
 * opened yet, and it dropped the parameter from 07:00 WIB on a window's last
 * day. It now comes from the window that wins the countdown.
 */
describe('the Register CTA category follows the winning window', () => {
  const now = new Date('2026-09-03T00:00:00.000Z');
  const edition = (types: ReturnType<typeof feeTier>[]) => [
    { program_name: 'Edition', registration_dates: { open: null, close: null }, registration_types: types },
  ];

  it('picks the category that is OPEN, not the one that closes soonest in future', () => {
    const result = resolveRegistrationCountdown(
      edition([
        // Opens in November: nothing a visitor can act on today.
        feeTier(['fully_funded'], [
          { startDate: '2026-11-01T00:00:00.000Z', endDate: '2026-11-30T16:59:00.000Z' },
        ]),
        feeTier(['self_funded'], [
          { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-12-01T16:59:00.000Z' },
        ]),
      ]),
      now,
    );
    expect(result?.category).toBe('self_funded');
    expect(result?.categoryLabel).toBe('Self Funded');
  });

  it('keeps the category through the whole last WIB day of the window', () => {
    // 2026-09-03T00:00:00Z is 07:00 in Jakarta on the window's final day. The
    // raw `endDate > now` test dropped the parameter from exactly here.
    const editions = edition([
      feeTier(['fully_funded'], [
        { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-09-03T00:00:00.000Z' },
      ]),
    ]);
    expect(resolveRegistrationCountdown(editions, now)?.category).toBe('fully_funded');
    expect(
      resolveRegistrationCountdown(editions, new Date('2026-09-03T16:00:00.000Z'))?.category,
    ).toBe('fully_funded');
    // WIB midnight on 4 Sept: genuinely over.
    expect(resolveRegistrationCountdown(editions, new Date('2026-09-03T17:00:00.000Z'))).toBeNull();
  });

  it('reads the snake_case home payload without an adapter', () => {
    const result = resolveRegistrationCountdown(
      [
        {
          program_name: 'Edition',
          registration_dates: { open: null, close: null },
          registration_types: [
            {
              fee_type: 'registration_fee',
              allowed_categories: ['fully_funded'],
              validity_periods: [
                { start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T16:59:00.000Z' },
              ],
            },
          ],
        },
      ],
      now,
    );
    expect(result?.category).toBe('fully_funded');
  });

  it('preselects nothing when the winning window serves more than one category', () => {
    const result = resolveRegistrationCountdown(
      edition([
        feeTier(['self_funded', 'fully_funded'], [
          { startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-12-01T16:59:00.000Z' },
        ]),
      ]),
      now,
    );
    expect(result?.category).toBeNull();
  });
});
