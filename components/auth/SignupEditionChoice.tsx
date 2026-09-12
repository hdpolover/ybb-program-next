// components/auth/SignupEditionChoice.tsx
//
// Makes the edition a signup joins explicit.
//
// MEYS 6th/7th incident (2026-08-30): the 7th was published for part of a day
// and 872 people who believed they were joining the 6th were silently
// assigned to the 7th, because signup picked the brand's newest open program
// and never showed which one that was. With more than one relevant edition the
// person now picks; with exactly one, they at least read its name before they
// submit.
'use client';

import { formatDeadlineForViewer } from '@/lib/format/deadline';
import { SCHEDULE_DATE_META_OPTIONS, formatScheduleDate } from '@/lib/format/datetime';
import { useHydrated } from '@/hooks/useHydrated';

export type SignupEdition = {
  program_name: string;
  program_slug: string;
  registration_dates?: { open: string | null; close: string | null };
  program_dates?: { start: string | null; end: string | null };
};

type Props = {
  editions: SignupEdition[];
  /** program_slug of the chosen edition. */
  value: string;
  onChange: (programSlug: string) => void;
};

/** Event dates are calendar days (Postgres `date`), so they are formatted in
 * UTC: fixed output on both the server render and the browser, and no day
 * shifting for a visitor west of Greenwich. */
const eventDay = (value: string | null | undefined) => {
  const formatted = formatScheduleDate(value, { ...SCHEDULE_DATE_META_OPTIONS, timeZone: 'UTC' }, '');
  return formatted || null;
};

/** "01 Dec 2026 to 05 Dec 2026", or null when the payload carries no event
 * dates (a home payload cached before program_dates existed). */
function eventDates(edition: SignupEdition): string | null {
  const start = eventDay(edition.program_dates?.start);
  const end = eventDay(edition.program_dates?.end);
  if (!start) return null;
  return end && end !== start ? `${start} to ${end}` : start;
}

/**
 * The OPEN date, when it is still in the future.
 *
 * This banner only ever named the close date, so a visitor arriving before
 * registration opened was told "Registration closes 5 Mar 2027" for a programme
 * they could not yet register for -- while the navbar said REGISTER NOW and the
 * fee cards said Closed. Naming the opening is the difference between a
 * confusing form and an honest one.
 *
 * Compared RAW, not widened to the WIB day boundary: the backend gates the
 * programme-level open date raw (auth-program-linking.util.ts and three
 * siblings), and widening here would tell a visitor registration is open up to
 * 7 hours before the API accepts them. Validity-WINDOW starts are widened;
 * this date is not one.
 */
function opensOn(edition: SignupEdition, hydrated: boolean): string | null {
  const raw = edition.registration_dates?.open;
  if (!raw) return null;
  const openMs = new Date(raw).getTime();
  if (Number.isNaN(openMs) || openMs <= Date.now()) return null;
  return formatDeadlineForViewer(raw, { withTime: true, hydrated });
}

/**
 * The close date, WITH the time, in the viewer's own timezone.
 *
 * It used to render as "5 Dec 2026 WIB": a timezone label attached to a bare
 * date, which tells the reader nothing (a date has no timezone) while implying
 * it does. And "WIB" is opaque to most of the people reading it, who are
 * applying from outside Indonesia.
 *
 * Showing the instant fixes both at once. A reader in Karachi now sees
 * "5 Dec 2026, 21:59 GMT+5" instead of doing arithmetic on an abbreviation
 * they may not know. Pre-hydration it still renders WIB with its label, which
 * is correct rather than merely a placeholder.
 */
function closesOn(edition: SignupEdition, hydrated: boolean): string | null {
  const formatted = formatDeadlineForViewer(edition.registration_dates?.close, {
    withTime: true,
    hydrated,
  });
  return formatted === '—' ? null : formatted;
}

export default function SignupEditionChoice({ editions, value, onChange }: Props) {
  // Before the early return below, not after: hooks cannot be called
  // conditionally. Read once here and passed down, because the multi-edition
  // branch formats inside a map and could not call a hook per row.
  const hydrated = useHydrated();

  // No editions loaded (the fetch failed, or the brand has none): stay out of
  // the way. Signup must never break because this could not load.
  if (editions.length === 0) return null;

  if (editions.length === 1) {
    const only = editions[0];
    const event = eventDates(only);
    const opens = opensOn(only, hydrated);
    // Once open, the close date is the useful one; before that, the opening is.
    const close = opens ? null : closesOn(only, hydrated);
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-slate-700">
          You are registering for{' '}
          <span className="font-bold text-slate-900">{only.program_name}</span>.
        </p>
        {/* suppressHydrationWarning below: the server renders WIB and the
            client the viewer's own zone, by design. Confined to that element. */}
        {(event || opens || close) && (
          <p className="mt-1 text-xs text-slate-500" suppressHydrationWarning>
            {[
              event && `Event ${event}`,
              opens && `Registration opens ${opens}`,
              close && `Registration closes ${close}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
    );
  }

  return (
    <fieldset>
      <legend className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1.5">
        Which edition are you registering for?
      </legend>
      <div className="grid grid-cols-1 gap-3">
        {editions.map((edition) => {
          const selected = edition.program_slug === value;
          const event = eventDates(edition);
          const close = closesOn(edition, hydrated);
          return (
            <label
              key={edition.program_slug}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
                selected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <input
                type="radio"
                name="signupEdition"
                className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--brand-primary)]"
                value={edition.program_slug}
                checked={selected}
                onChange={() => onChange(edition.program_slug)}
              />
              <span className="min-w-0">
                <span className="block text-sm font-bold text-slate-900">
                  {edition.program_name}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {event ? `Event ${event}` : 'Event dates to be announced'}
                </span>
                <span className="block text-xs text-slate-500" suppressHydrationWarning>
                  {close ? `Registration closes ${close}` : 'No registration close date set'}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
