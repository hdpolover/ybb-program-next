// lib/registration/isRegistrationOpen.ts
//
// Single source of truth for "is this registration window open right now",
// previously implemented twice with byte-identical bodies
// (components/sections/HomeRegistrationStrip.tsx and
// components/programs/registrationTypes.tsx), which is exactly how a
// duplicated bug fix stays half-applied.

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** The instant at which the WIB (Asia/Jakarta, UTC+7, no DST) calendar day containing `date` began. */
function startOfWibDay(date: Date): Date {
  const wallClockMs = date.getTime() + WIB_OFFSET_MS;
  const wibMidnightWallClockMs = Math.floor(wallClockMs / MS_PER_DAY) * MS_PER_DAY;
  return new Date(wibMidnightWallClockMs - WIB_OFFSET_MS);
}

export type RegistrationValidityPeriod = {
  start_date: string;
  end_date: string;
};

/**
 * Whether `now` falls within any of `periods`.
 *
 * Admins pick whole calendar days for a period's start/end, but a period's
 * `start_date` is only guaranteed to be WIB start-of-day for the
 * chronologically-EARLIEST period on a tier — that's the one gating "is
 * registration open" and the only one this widens (see
 * services/api/src/shared/utils/tier-period.util.ts for the server-side
 * counterpart and the 2026-09-01 Middle East Youth Summit 7th incident this
 * closes off: its opening period was stored at 23:59 WIB instead of 00:00,
 * so the strip read "Closed" all day it was meant to open).
 *
 * Every other period is compared exactly as received: chained periods
 * intentionally hand over at an exact instant (installment 2 starts the
 * moment installment 1 ends, frequently 23:59 WIB), and widening those too
 * would make adjacent installments overlap — two prices open at once.
 */
export function isRegistrationOpen(
  periods: RegistrationValidityPeriod[] | undefined,
  now: Date,
): boolean {
  if (!periods || periods.length === 0) return false;

  const parsed = periods
    .map((p) => ({ start: new Date(p.start_date), end: new Date(p.end_date) }))
    .filter((p) => !Number.isNaN(p.start.getTime()) && !Number.isNaN(p.end.getTime()));
  if (parsed.length === 0) return false;

  const earliestStartMs = Math.min(...parsed.map((p) => p.start.getTime()));

  return parsed.some((p) => {
    const isEarliest = p.start.getTime() === earliestStartMs;
    const effectiveStart = isEarliest ? startOfWibDay(p.start) : p.start;
    return effectiveStart <= now && now <= p.end;
  });
}
