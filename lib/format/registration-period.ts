// lib/format/registration-period.ts
import { formatDeadlineLocal, formatDeadlineWib } from "@/lib/format/deadline";

export type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

/**
 * Admins extend a registration window by APPENDING a new validity period that
 * starts where the previous one ended, because the eligibility rule hides a
 * category's CTA and payment option when no period covers "now". A single tier
 * therefore accumulates a chain of windows: in production, 10 to 22 of them.
 *
 * Only ONE window is shown: the one covering "now", so a participant sees the
 * dates that actually apply today rather than an accumulated span ending on the
 * final extension. Falls back to the next upcoming window, then to the last one
 * that ran, so the label never goes blank.
 *
 * DISPLAY ONLY. Eligibility and payment gating still use the per-period logic
 * elsewhere; a participant must not become eligible because a label looks open.
 */
export function getRegistrationPeriodLabel(
  periods: ValidityPeriod[] | undefined,
  hydrated: boolean = true,
  now: Date = new Date(),
): string {
  if (!periods || periods.length === 0) return "TBD";

  const time = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  };

  const parsed = periods
    .map((period) => ({
      period,
      start: time(period.start_date),
      end: time(period.end_date),
    }))
    .filter((entry) => entry.start !== null && entry.end !== null) as Array<{
    period: ValidityPeriod;
    start: number;
    end: number;
  }>;

  if (parsed.length === 0) return "TBD";

  const nowTime = now.getTime();
  const byEarliestEnd = (a: { end: number }, b: { end: number }) => a.end - b.end;

  const current = parsed
    .filter((entry) => entry.start <= nowTime && nowTime <= entry.end)
    .sort(byEarliestEnd)[0];
  const upcoming = parsed.filter((entry) => entry.start > nowTime).sort((a, b) => a.start - b.start)[0];
  const lapsed = [...parsed].sort(byEarliestEnd)[parsed.length - 1];

  const chosen = current ?? upcoming ?? lapsed;

  const fmt = (value: string) => {
    const result = hydrated
      ? formatDeadlineLocal(value, { withTime: false })
      : formatDeadlineWib(value, { withTime: false });
    return result === "—" ? "TBD" : result;
  };

  const from = fmt(chosen.period.start_date);
  const to = fmt(chosen.period.end_date);
  // A single-day window reads better unrepeated.
  return from === to ? from : `${from} - ${to}`;
}
