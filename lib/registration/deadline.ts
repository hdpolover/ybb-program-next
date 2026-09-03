import {
  getEditionWindows,
  type RegistrationTierLike,
} from '@/lib/registration/isRegistrationOpen';
import type { RegistrationPhase } from '@/lib/registration/status';

/**
 * The homepage countdown: what it counts to, which edition it names, and which
 * application category the Register CTA should carry.
 *
 * All four answers come from ONE pass over the edition windows built by
 * lib/registration/isRegistrationOpen, so the clock, the CTA label and the
 * `?applicationCategory=` on the signup link can never describe different
 * windows. The category used to come from a separate scanner that took the
 * minimum future `endDate` compared RAW: it ignored whether the window had
 * started (so a category opening in October could win over one open today)
 * and it dropped the category from the signup link from 07:00 WIB on a
 * window's last day.
 */

export type RegistrationCategory = 'fully_funded' | 'self_funded';

/** A pricing tier in EITHER wire shape, exactly like `RegistrationTierLike`:
 * snake_case from the home payload, camelCase from
 * /v1/programs/:id/pricing-tiers. Both reach these resolvers, and the
 * hand-rolled snake-to-camel adapter that used to sit in app/layout.tsx was a
 * second place for the fee-type and category rules to drift. */
type DeadlineTier = RegistrationTierLike & {
  allowedCategories?: Array<string> | null;
  allowed_categories?: Array<string> | null;
};

function normalizeToken(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/-/g, '_');
}

/** One currently-relevant program edition, as carried by the home API's
 * registration_overview.content.programs (see home.strategy.ts). */
export type CountdownProgramEdition = {
  program_name: string;
  registration_dates: { open: string | null; close: string | null };
  registration_types: DeadlineTier[];
};

export type CountdownWinner = {
  deadline: string;
  programName: string;
};

/**
 * Every registration window on every edition, as instants, tagged with the
 * edition and category it belongs to.
 *
 * The start rule lives in lib/registration/isRegistrationOpen (WIB
 * start-of-day widening on a tier's earliest window, program dates as the
 * fallback for a tier or an edition that carries none) and is NOT restated
 * here. Comparing raw `startDate` here instead is what had the fee card
 * badging Open next to a sticky bar reading "Opens 31 Aug" for the same 23
 * hours: one rule, two implementations.
 */
function allWindows(
  editions: CountdownProgramEdition[],
): Array<{
  start: number;
  end: number;
  programName: string;
  category: RegistrationCategory | null;
  categoryLabel: string | null;
}> {
  return editions.flatMap((edition) =>
    getEditionWindows(edition.registration_types, edition.registration_dates).map((w) => {
      const category = w.tier ? tierCategory(w.tier) : null;
      return {
        start: w.start,
        end: w.end,
        programName: edition.program_name,
        category,
        categoryLabel: category ? CATEGORY_LABELS[category] : null,
      };
    }),
  );
}

/**
 * The soonest registration window that is OPEN RIGHT NOW, across every edition
 * and category, with the edition and category it belongs to.
 *
 * This is what the banner counts to. The 2026-08-21 incident made the program
 * level close date win instead, because a lapsed tier chain had the banner
 * advertising "closes 31 Aug" while registration really ran to 5 Dec. That
 * failure is not reachable here: a lapsed chain has no window covering now, so
 * it contributes no candidate and the caller falls back to the program date.
 * Only a window a visitor can actually act on can win.
 */
export function resolveOpenWindowCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): (CountdownWinner & { category: RegistrationCategory | null; categoryLabel: string | null }) | null {
  if (!editions || editions.length === 0) return null;
  const nowMs = now.getTime();

  // An open window with no close date is skipped: there is nothing to count
  // down to, and both the banner and the sticky bar unmount on a null
  // deadline, so this really does cost the CTA. That shape only reaches here
  // for a programme with a registration open date and no close date at all;
  // giving the bar a deadline-less mode is the fix, and is not this change.
  const candidates = allWindows(editions).filter(
    (w) => w.start <= nowMs && nowMs <= w.end && Number.isFinite(w.end),
  );
  if (candidates.length === 0) return null;

  const winner = candidates.reduce((soonest, c) => (c.end < soonest.end ? c : soonest));
  return {
    deadline: new Date(winner.end).toISOString(),
    programName: winner.programName,
    category: winner.category,
    categoryLabel: winner.categoryLabel,
  };
}

const CATEGORY_LABELS: Record<RegistrationCategory, string> = {
  fully_funded: 'Fully Funded',
  self_funded: 'Self Funded',
};

/** The single category a tier is restricted to, or null when it serves more
 * than one (or none): the banner has nothing specific to name and the signup
 * link must not preselect a category the visitor did not choose. */
function tierCategory(tier: DeadlineTier): RegistrationCategory | null {
  const cats = (tier.allowedCategories ?? tier.allowed_categories ?? []).map(normalizeToken);
  if (cats.length !== 1) return null;
  return cats[0] === 'fully_funded' || cats[0] === 'self_funded' ? cats[0] : null;
}

/**
 * The soonest registration window that has NOT STARTED YET, across every
 * edition and category. The "deadline" it returns is that window's START:
 * what the banner should count down to when nothing is open, so a programme
 * opening in two days stops advertising a countdown to a close date months
 * away that nobody can act on.
 */
export function resolveUpcomingWindowCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): (CountdownWinner & { category: RegistrationCategory | null; categoryLabel: string | null }) | null {
  if (!editions || editions.length === 0) return null;
  const nowMs = now.getTime();

  const candidates = allWindows(editions).filter((w) => w.start > nowMs && Number.isFinite(w.start));
  if (candidates.length === 0) return null;

  const winner = candidates.reduce((soonest, c) => (c.start < soonest.start ? c : soonest));
  return {
    deadline: new Date(winner.start).toISOString(),
    programName: winner.programName,
    category: winner.category,
    categoryLabel: winner.categoryLabel,
  };
}

export type RegistrationCountdownResolution = CountdownWinner & {
  /** The application category the Register CTA should carry, or null when the
   * winning window is not restricted to one. */
  category: RegistrationCategory | null;
  categoryLabel: string | null;
  /** What the deadline MEANS: 'open' counts down to a close, 'upcoming' to an
   * opening. One value, so the CTA and the clock can never disagree. */
  phase: 'open' | 'upcoming';
};

/**
 * The programme the layout resolved on its own, offered as the last-resort
 * countdown target. `phase` is the PROGRAM-level answer from
 * lib/registration/status.ts, i.e. "would the backend accept a registration
 * for this programme at all".
 */
export type CountdownProgramFallback = {
  deadline: string | null;
  phase: RegistrationPhase;
  programName: string;
};

/**
 * The homepage countdown rule, in resolution order. Kept here rather than
 * inlined in app/layout.tsx so the branches are one readable rule AND
 * unit-testable; layout calls it in a single line.
 *
 *   1. Something OPEN  -> count down to that window's close. Register CTA live.
 *      (MEYS shape: one edition open, another upcoming. Must not regress.)
 *   2. Nothing open, something UPCOMING -> count down to the soonest OPEN date.
 *      Caller must not render a register CTA. (KYS 4th shape, 2026-09-03.)
 *   3. No edition window either way, but the PROGRAMME itself is open ->
 *      count down to its own close date.
 *   4. Otherwise null. "Closed" is finally the truth.
 *
 * Branch 3 is the never-blank guarantee and it is not cosmetic: the banner and
 * the sticky Register button BOTH unmount on a null deadline, so on all six
 * brands a silent tier configuration would delete the site's primary
 * conversion element while registration was genuinely live. It is deliberately
 * gated on the program phase rather than on the date alone: a lapsed
 * programme with a stale future close date must still go quiet, which is what
 * branch 4 is for.
 *
 * Editions that carry no registration-fee validity windows do not need branch
 * 3: `getEditionWindows` already turns their program-level registration dates
 * into a window, so Istanbul Youth Summit keeps its countdown to 5 Dec even
 * when a sibling edition's windows have all lapsed. That used to be an
 * all-or-nothing global test (`hasAnyRegistrationWindow`), which blanked
 * Istanbul's banner and bar whenever ANY edition anywhere had a window.
 */
export function resolveRegistrationCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
  programFallback?: CountdownProgramFallback | null,
): RegistrationCountdownResolution | null {
  const open = resolveOpenWindowCountdown(editions, now);
  if (open) return { ...open, phase: 'open' };

  const upcoming = resolveUpcomingWindowCountdown(editions, now);
  if (upcoming) return { ...upcoming, phase: 'upcoming' };

  if (programFallback?.phase === 'open' && programFallback.deadline) {
    return {
      deadline: programFallback.deadline,
      programName: programFallback.programName,
      category: null,
      categoryLabel: null,
      phase: 'open',
    };
  }

  return null;
}
