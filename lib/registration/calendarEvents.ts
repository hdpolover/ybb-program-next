// lib/registration/calendarEvents.ts
//
// Turns registration-fee validity windows into calendar-ready spans for the
// home page events calendar.
//
// THE DISCLOSURE RULE: a window that has not started yet must not surface
// anywhere, not merged into a span, not as a name, nothing at all, since an
// unannounced reopening is meant to stay a surprise until the day it opens.
// Filtering happens FIRST, before any merge runs, on the same WIB-widened
// start every other registration surface already uses (parseRegistrationWindows
// in isRegistrationOpen.ts), so "started" means the same thing here as it does
// on the fee card badge.
import {
  isRegistrationFeeTier,
  normalizeValidityPeriods,
  parseRegistrationWindows,
  type RegistrationDates,
  type RegistrationTierLike,
  type RegistrationValidityPeriod,
} from './isRegistrationOpen';
import { formatTokenLabel } from '../utils';

export type CalendarSpan = { start: number; end: number };

// Windows are admin-entered calendar days, chained at 23:59 -> 00:00
// boundaries (China Youth Summit's self-funded tier has 19 of them back to
// back). A gap under 24h is that handover, not a real break, so it merges
// into one span rather than rendering as its own event.
const GAP_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/**
 * Filter to windows that have started, then merge the ones close enough
 * together into visible spans.
 *
 * Order matters: an unstarted window must never reach the merge step, or a
 * span could absorb it and leak its existence through a pushed-out end date.
 */
export function mergeVisibleSpans(
  periods: RegistrationValidityPeriod[] | undefined,
  now: Date,
): CalendarSpan[] {
  const nowMs = now.getTime();
  const started = parseRegistrationWindows(periods)
    .filter((w) => w.start <= nowMs)
    .sort((a, b) => a.start - b.start);

  if (started.length === 0) return [];

  const spans: CalendarSpan[] = [];
  let current: CalendarSpan = { start: started[0].start, end: started[0].end };

  for (const window of started.slice(1)) {
    if (window.start - current.end < GAP_THRESHOLD_MS) {
      current = { start: current.start, end: Math.max(current.end, window.end) };
    } else {
      spans.push(current);
      current = { start: window.start, end: window.end };
    }
  }
  spans.push(current);

  return spans;
}

export type RegistrationCalendarEvent = {
  id: string;
  label: string;
  start: number;
  end: number;
};

type CalendarTier = RegistrationTierLike & {
  id?: string;
  allowed_categories?: Array<string> | null;
};

/**
 * One calendar event per merged span, per funding category, across every
 * registration-fee tier an edition offers.
 *
 * Grouping is by CATEGORY, not by tier: the copy never names a tier (see the
 * repo's no-jargon rule), and two tiers covering the same category read as
 * one line on the calendar, e.g. "Self Funded registration".
 *
 * A tier whose periods are all in the future contributes nothing here: not a
 * name, not a placeholder. That is the disclosure rule enforced structurally,
 * not hidden with CSS.
 */
export function buildRegistrationCalendarEvents(
  tiers: CalendarTier[] | null | undefined,
  registrationDates: RegistrationDates,
  now: Date,
): RegistrationCalendarEvent[] {
  const feeTiers = (tiers ?? []).filter(isRegistrationFeeTier);

  const periodsByCategory = new Map<string, RegistrationValidityPeriod[]>();
  for (const tier of feeTiers) {
    const categories = tier.allowed_categories?.length ? tier.allowed_categories : ['general'];
    const periods = normalizeValidityPeriods(tier, registrationDates) ?? [];
    for (const category of categories) {
      const key = String(category);
      periodsByCategory.set(key, [...(periodsByCategory.get(key) ?? []), ...periods]);
    }
  }

  const events: RegistrationCalendarEvent[] = [];
  for (const [category, periods] of periodsByCategory) {
    const spans = mergeVisibleSpans(periods, now);
    spans.forEach((span, index) => {
      events.push({
        id: `${category}-${index}`,
        label: `${formatTokenLabel(category)} registration`,
        start: span.start,
        end: span.end,
      });
    });
  }

  return events;
}
