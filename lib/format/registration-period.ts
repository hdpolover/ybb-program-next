// lib/format/registration-period.ts
import { formatDeadlineLocal } from "@/lib/format/deadline";

export type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

/**
 * Admins extend a registration window by APPENDING a new validity period that
 * starts where the previous one ended, because the eligibility rule hides a
 * category's CTA and payment option when no period covers "now". A single tier
 * therefore accumulates a chain of windows — in production, 10 to 22 of them.
 *
 * Displaying only the period that covers "now" (or, once they have all lapsed,
 * the last one) shows a participant the final one-day extension instead of the
 * real registration span: "20 Aug - 21 Aug" rather than "14 Apr - 21 Aug".
 *
 * The span below is DISPLAY ONLY. Eligibility and payment gating still use the
 * per-period logic elsewhere — a participant must not become eligible just
 * because the overall span looks open.
 */
export function getRegistrationPeriodLabel(
  periods: ValidityPeriod[] | undefined,
): string {
  if (!periods || periods.length === 0) return "TBD";

  const times = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  };

  let earliest: { time: number; raw: string } | null = null;
  let latest: { time: number; raw: string } | null = null;

  for (const period of periods) {
    const start = times(period.start_date);
    if (start !== null && (earliest === null || start < earliest.time)) {
      earliest = { time: start, raw: period.start_date };
    }
    const end = times(period.end_date);
    if (end !== null && (latest === null || end > latest.time)) {
      latest = { time: end, raw: period.end_date };
    }
  }

  if (!earliest || !latest) return "TBD";

  const fmt = (value: string) => {
    const result = formatDeadlineLocal(value, { withTime: false });
    return result === "—" ? "TBD" : result;
  };

  const from = fmt(earliest.raw);
  const to = fmt(latest.raw);
  // A single-day span reads better unrepeated.
  return from === to ? from : `${from} - ${to}`;
}
