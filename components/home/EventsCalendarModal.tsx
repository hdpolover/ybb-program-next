// components/home/EventsCalendarModal.tsx
//
// The events calendar panel: a month grid plus a list of that month's events.
// Hand-rolled createPortal dialog, following components/dashboard/ui/
// ImageCropperModal.tsx (this repo has no shared modal primitive), but adds
// the focus trap and focus-restore that modal lacks.
'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X, Clock3, MapPin } from 'lucide-react';
import type { RegistrationCalendarEvent } from '@/lib/registration/calendarEvents';
import { fetchProgramSchedules, type ProgramScheduleItem } from '@/lib/api/schedules';
import { formatScheduleDate, formatScheduleTimeRange, SCHEDULE_DATE_META_OPTIONS } from '@/lib/format/datetime';
import {
  buildCalendarEntries,
  buildMonthGrid,
  pickDefaultMonth,
  spansCoveringDay,
  type CalendarEntry,
} from '@/lib/calendar/buildCalendarEntries';

type Props = {
  programId: string;
  programName: string;
  programDates?: { start: string | null; end: string | null };
  registrationEvents: RegistrationCalendarEvent[];
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const MONTH_LABEL = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Calendar-day fields (program dates, schedule days) read in UTC, same rule
// as SignupEditionChoice's eventDay(): they carry no time-of-day meaning, so
// UTC reproduces exactly what was entered for every viewer.
const UTC_DAY_OPTIONS = { ...SCHEDULE_DATE_META_OPTIONS, timeZone: 'UTC' };

function formatDayLabel(key: string): string {
  return formatScheduleDate(`${key}T00:00:00Z`, UTC_DAY_OPTIONS, key);
}

/** Screen-reader summary of what a day carries, so the button is not just a number. */
function describeDay(dayEntryCount: number, spanCount: number): string {
  const parts: string[] = [];
  if (spanCount > 0) parts.push(`${spanCount} registration period${spanCount === 1 ? '' : 's'}`);
  if (dayEntryCount > 0) parts.push(`${dayEntryCount} scheduled item${dayEntryCount === 1 ? '' : 's'}`);
  return parts.length > 0 ? `${parts.join(', ')}. Select to filter.` : 'nothing scheduled';
}

function formatDayRange(startKey: string, endKey: string): string {
  const startLabel = formatDayLabel(startKey);
  if (startKey === endKey) return startLabel;
  return `${startLabel} to ${formatDayLabel(endKey)}`;
}

export default function EventsCalendarModal({
  programId,
  programName,
  programDates,
  registrationEvents,
  onClose,
  triggerRef,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [schedules, setSchedules] = useState<ProgramScheduleItem[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  // Only what the VISITOR chose. The default is derived below, never stored,
  // so there is no setState-inside-an-effect to cascade a re-render.
  const [monthOverride, setMonthOverride] = useState<{ year: number; month0: number } | null>(null);
  // The day a visitor clicked, or null for "show the whole month".
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Schedules are not in the home payload (a multi-week programme can run to
  // hundreds of rows), so they are pulled from the existing public route only
  // once a visitor actually opens the calendar.
  useEffect(() => {
    let cancelled = false;
    fetchProgramSchedules(programId)
      .then((items) => {
        if (!cancelled) setSchedules(items);
      })
      .catch(() => {
        if (!cancelled) {
          setSchedules([]);
          setLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [programId]);

  const entries = useMemo(
    () => buildCalendarEntries(registrationEvents, programDates, schedules ?? []),
    [registrationEvents, programDates, schedules],
  );

  // The month to show: whatever the visitor navigated to, else the default
  // picked from the full entry set once the schedule fetch settles. Derived
  // rather than assigned from an effect — the override takes precedence the
  // moment it exists, so a slow response can still never yank a visitor who
  // has already started navigating back to the default.
  const defaultMonth = useMemo(
    () => (schedules === null ? null : pickDefaultMonth(entries, new Date())),
    [entries, schedules],
  );
  const visibleMonth = monthOverride ?? defaultMonth;

  // Focus trap, Escape-to-close, and focus restore to the trigger on unmount.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => !el.hasAttribute('disabled'));

    focusable()[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      (previouslyFocused ?? triggerRef.current)?.focus();
    };
    // Re-run when the loading state flips so newly-rendered controls (the
    // grid/list) are included in the trap once they exist.
  }, [onClose, triggerRef, visibleMonth]);

  if (typeof document === 'undefined') return null;

  if (!visibleMonth) {
    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={`${programName} events calendar`}
      >
        <div ref={dialogRef} className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
          <p className="mt-3 text-sm text-slate-500">Loading events…</p>
        </div>
      </div>,
      document.body,
    );
  }

  const grid = buildMonthGrid(visibleMonth.year, visibleMonth.month0);
  const monthLabel = MONTH_LABEL.format(new Date(Date.UTC(visibleMonth.year, visibleMonth.month0, 1)));

  const dayEntries = entries.filter((e): e is Extract<CalendarEntry, { kind: 'schedule' | 'program' }> => e.kind !== 'registration');
  const rangeEntries = entries.filter((e): e is Extract<CalendarEntry, { kind: 'registration' }> => e.kind === 'registration');

  const entriesByDay = new Map<string, typeof dayEntries>();
  dayEntries.forEach((entry) => {
    entriesByDay.set(entry.dayKey, [...(entriesByDay.get(entry.dayKey) ?? []), entry]);
  });

  // A span COVERS every day between its edges. Marking only startKey/endKey
  // (what shipped) meant a month sitting entirely inside a window rendered
  // completely blank -- Korea Youth Summit's self-funded window runs
  // 2026-09-05 to 2027-03-05, so November showed no trace of a registration
  // period that was open every single day of it.
  const spansCovering = (key: string) => spansCoveringDay(rangeEntries, key) as typeof rangeEntries;

  const firstOfMonthKey = grid.find((c) => c.inMonth)?.key ?? '';
  const lastOfMonthKey = [...grid].reverse().find((c) => c.inMonth)?.key ?? '';

  // With a day selected the list narrows to that day -- the scheduled items on
  // it, plus every registration window COVERING it (not merely starting or
  // ending on it, which would show nothing on the vast majority of days).
  const monthEntries: CalendarEntry[] = (
    selectedDay
      ? [
          ...dayEntries.filter((e) => e.dayKey === selectedDay),
          ...rangeEntries.filter((e) => selectedDay >= e.startKey && selectedDay <= e.endKey),
        ]
      : [
          ...dayEntries.filter((e) => e.dayKey >= firstOfMonthKey && e.dayKey <= lastOfMonthKey),
          ...rangeEntries.filter((e) => e.endKey >= firstOfMonthKey && e.startKey <= lastOfMonthKey),
        ]
  ).sort((a, b) => {
    const keyOf = (e: CalendarEntry) => (e.kind === 'registration' ? e.startKey : e.dayKey);
    return keyOf(a).localeCompare(keyOf(b));
  });

  const changeMonth = (delta: number) => {
    // A day selection belongs to the month it was made in; carrying it across
    // would filter the new month by a date that is not in it, i.e. an empty
    // panel with no visible reason.
    setSelectedDay(null);
    setMonthOverride((current) => {
      const base = current ?? visibleMonth;
      const next = new Date(Date.UTC(base.year, base.month0 + delta, 1));
      return { year: next.getUTCFullYear(), month0: next.getUTCMonth() };
    });
  };

  const todayKey = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' }).format(new Date());

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="events-calendar-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id="events-calendar-title" className="text-base font-bold text-slate-900">
            {programName} events calendar
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close events calendar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between px-5 py-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-slate-900">{monthLabel}</span>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 px-5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        {/* A registration window renders as a continuous BAND across every day
            it covers, not two lone dots at its edges. The band is drawn as a
            full-bleed layer behind the number (gap-0 on the grid, padding on
            the cell) so consecutive days join with no seam. A dot still marks
            a discrete day entry -- a schedule day or a programme date.

            Days carrying something are buttons: clicking one filters the list
            below to that day. Per the design rules they get real hover and
            focus states; a day with nothing on it stays an inert div rather
            than a button that looks live and does nothing. */}
        <div className="grid grid-cols-7 gap-y-1 px-5 pb-4 pt-1">
          {grid.map((cell, index) => {
            const dayEntryCount = entriesByDay.get(cell.key)?.length ?? 0;
            const covering = spansCovering(cell.key);
            const isToday = cell.key === todayKey;
            const isSelected = selectedDay === cell.key;
            const hasAnything = dayEntryCount > 0 || covering.length > 0;

            // Round only where the band actually terminates: the first or last
            // day of a window, or the edge of a week row where it wraps.
            const opensHere = covering.some((e) => e.startKey === cell.key);
            const closesHere = covering.some((e) => e.endKey === cell.key);
            // color-mix, not `bg-primary/10`: `primary` is defined in
            // tailwind.config.ts as a bare `var(--color-primary)` holding a hex,
            // so Tailwind's slash modifier compiles to
            // `rgb(var(--color-primary) / 0.1)` — invalid, dropped by the
            // browser, drawn as nothing. Every `primary/<n>` in the repo is
            // silently transparent for the same reason.
            const bandClass =
              covering.length > 0
                ? `bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] ${opensHere || index % 7 === 0 ? 'rounded-l-lg' : ''} ${
                    closesHere || index % 7 === 6 ? 'rounded-r-lg' : ''
                  }`
                : '';

            const inner = (
              <span className={`relative flex h-11 flex-col items-center justify-center ${bandClass}`}>
                <span className={isToday ? 'font-bold text-primary' : ''}>{cell.day}</span>
                {dayEntryCount > 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
              </span>
            );

            if (!hasAnything) {
              return (
                <div
                  key={cell.key}
                  className={`text-xs ${cell.inMonth ? 'text-slate-700' : 'text-slate-300'} ${
                    isToday ? 'rounded-lg ring-1 ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]' : ''
                  }`}
                >
                  {inner}
                </div>
              );
            }

            return (
              <button
                key={cell.key}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${formatDayLabel(cell.key)}, ${describeDay(dayEntryCount, covering.length)}`}
                onClick={() => setSelectedDay(isSelected ? null : cell.key)}
                className={`cursor-pointer text-xs transition ${
                  cell.inMonth ? 'text-slate-700' : 'text-slate-300'
                } ${isToday ? 'rounded-lg ring-1 ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]' : ''} ${
                  isSelected ? 'rounded-lg ring-2 ring-primary' : ''
                } hover:brightness-95 focus:outline-none focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]`}
              >
                {inner}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto border-t border-slate-100 px-5 py-4">
          {loadError && (
            <p className="mb-3 text-xs text-amber-600">
              The day-by-day schedule could not be loaded right now. Registration dates below are still accurate.
            </p>
          )}
          {selectedDay && (
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-900">{formatDayLabel(selectedDay)}</p>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="cursor-pointer rounded-full px-3 py-1 text-xs font-semibold text-primary transition hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-primary)_60%,transparent)]"
              >
                Show whole month
              </button>
            </div>
          )}
          {monthEntries.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              {selectedDay ? 'Nothing on this day.' : 'Nothing on the calendar this month yet.'}
            </p>
          ) : (
            <ul className="space-y-3">
              {monthEntries.map((entry) => {
                if (entry.kind === 'registration') {
                  return (
                    <li key={entry.id} className="rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_5%,transparent)] px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                      <p className="text-xs text-slate-500">{formatDayRange(entry.startKey, entry.endKey)}</p>
                    </li>
                  );
                }
                if (entry.kind === 'program') {
                  return (
                    <li key={entry.id} className="rounded-xl bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                      <p className="text-xs text-slate-500">{formatDayLabel(entry.dayKey)}</p>
                    </li>
                  );
                }
                return (
                  <li key={entry.id} className="rounded-xl border border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{formatDayLabel(entry.dayKey)}</p>
                    <ul className="mt-2 space-y-2">
                      {entry.items.map((item) => (
                        <li key={item.id} className="flex items-start gap-2 text-xs text-slate-600">
                          <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <div>
                            <span className="font-medium text-slate-800">{item.activity}</span>
                            <span className="text-slate-500"> · {formatScheduleTimeRange(item.startTime, item.endTime)}</span>
                            {item.location && (
                              <span className="ml-1 inline-flex items-center gap-1 text-slate-500">
                                <MapPin className="h-3 w-3" /> {item.location}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
