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

import { formatDeadlineWib } from '@/lib/format/deadline';
import { SCHEDULE_DATE_META_OPTIONS, formatScheduleDate } from '@/lib/format/datetime';

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

/** The close date is an instant, so it keeps the app's WIB rendering. */
function closesOn(edition: SignupEdition): string | null {
  const formatted = formatDeadlineWib(edition.registration_dates?.close, { withTime: false });
  return formatted === '—' ? null : formatted;
}

export default function SignupEditionChoice({ editions, value, onChange }: Props) {
  // No editions loaded (the fetch failed, or the brand has none): stay out of
  // the way. Signup must never break because this could not load.
  if (editions.length === 0) return null;

  if (editions.length === 1) {
    const only = editions[0];
    const event = eventDates(only);
    const close = closesOn(only);
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-slate-700">
          You are registering for{' '}
          <span className="font-bold text-slate-900">{only.program_name}</span>.
        </p>
        {(event || close) && (
          <p className="mt-1 text-xs text-slate-500">
            {[event && `Event ${event}`, close && `Registration closes ${close}`]
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
          const close = closesOn(edition);
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
                <span className="block text-xs text-slate-500">
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
