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

/**
 * One distinct hue per registration window, in assignment order.
 *
 * Deliberately NOT derived from the brand variable: the whole point is telling
 * two windows apart, and shades of one themeable hue cannot guarantee that.
 * Chosen to stay distinguishable for the common forms of colour blindness
 * (blue/amber/violet separate on lightness as well as hue) and to hold a
 * readable contrast against the white panel. Colour is never the only cue —
 * every window is also named, dated and reachable in the list below.
 */
const EVENT_COLORS = ['#2563eb', '#f59e0b', '#7c3aed', '#059669', '#db2777'];
/** Discrete day markers: a schedule day or a programme date. */
const SCHEDULE_COLOR = '#0f172a';
/** Today's outline, and the selected-day outline. */
const TODAY_COLOR = '#2563eb';

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

  // Lane order is the order the windows arrive in, which is stable for a given
  // payload, so a window keeps the same colour and the same row every time the
  // panel is opened and on every day it covers.
  const lanes = rangeEntries.map((entry, i) => ({
    id: entry.id,
    label: entry.label,
    startKey: entry.startKey,
    endKey: entry.endKey,
    color: EVENT_COLORS[i % EVENT_COLORS.length],
  }));
  const colorFor = (id: string) => lanes.find((l) => l.id === id)?.color ?? SCHEDULE_COLOR;

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

        {/* Each registration window gets its OWN COLOUR and its OWN LANE, and
            the lane sits at the same height on every day, so a window reads as
            one continuous stripe running across the month. Tinting a single
            brand hue by overlap count was the previous attempt and it failed
            for the obvious reason: two different events still looked the same.

            Colours come from a fixed palette rather than the brand variable.
            They have to stay distinguishable from each other, which a single
            themeable hue cannot promise. Applied as inline styles because
            Tailwind only generates classes it can read literally in the source
            -- a class name built from a runtime value is never emitted.

            Days carrying something are buttons that filter the list below.
            Days with nothing stay inert divs, so everything that hovers really
            does click. */}
        <div className="grid grid-cols-7 gap-y-1 px-5 pb-4 pt-1">
          {grid.map((cell, index) => {
            const dayEntryCount = entriesByDay.get(cell.key)?.length ?? 0;
            const covering = spansCovering(cell.key);
            const isToday = cell.key === todayKey;
            const isSelected = selectedDay === cell.key;
            const hasAnything = dayEntryCount > 0 || covering.length > 0;
            const isWeekStart = index % 7 === 0;
            const isWeekEnd = index % 7 === 6;

            const inner = (
              <span className="relative flex h-12 flex-col items-center justify-center gap-1">
                <span className={`text-xs ${isToday ? 'font-bold' : ''}`} style={isToday ? { color: TODAY_COLOR } : undefined}>
                  {cell.day}
                </span>
                <span className="flex w-full flex-col gap-[2px]">
                  {lanes.map((lane) => {
                    const covers = cell.key >= lane.startKey && cell.key <= lane.endKey;
                    // A lane keeps its row even on days it does not cover, so
                    // the stripes above and below never shift position.
                    if (!covers) return <span key={lane.id} className="h-[3px]" />;
                    return (
                      <span
                        key={lane.id}
                        className="h-[3px]"
                        style={{
                          backgroundColor: lane.color,
                          borderTopLeftRadius: lane.startKey === cell.key || isWeekStart ? 999 : 0,
                          borderBottomLeftRadius: lane.startKey === cell.key || isWeekStart ? 999 : 0,
                          borderTopRightRadius: lane.endKey === cell.key || isWeekEnd ? 999 : 0,
                          borderBottomRightRadius: lane.endKey === cell.key || isWeekEnd ? 999 : 0,
                        }}
                      />
                    );
                  })}
                </span>
                {dayEntryCount > 0 && (
                  <span
                    className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: SCHEDULE_COLOR }}
                  />
                )}
              </span>
            );

            // Outlines drawn as an explicit box-shadow rather than Tailwind's
            // ring utilities, for the same reason as the lane colours: the
            // ring-primary/<n> classes this file used to carry compiled to an
            // invalid colour and painted nothing at all.
            const base = `rounded-lg text-xs ${cell.inMonth ? 'text-slate-700' : 'text-slate-300'}`;
            const outline = isSelected
              ? { boxShadow: `0 0 0 2px ${TODAY_COLOR}` }
              : isToday
                ? { boxShadow: `0 0 0 1px ${TODAY_COLOR}80` }
                : undefined;

            if (!hasAnything) {
              return (
                <div key={cell.key} className={base} style={outline}>
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
                className={`${base} cursor-pointer transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2`}
                style={{ ...outline, outlineColor: TODAY_COLOR }}
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
                  // The swatch is what ties a row to its stripe in the grid.
                  const color = colorFor(entry.id);
                  return (
                    <li
                      key={entry.id}
                      className="flex items-start gap-3 rounded-xl px-4 py-3"
                      style={{ backgroundColor: `${color}14`, borderLeft: `3px solid ${color}` }}
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                      <span>
                        <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                        <p className="text-xs text-slate-500">{formatDayRange(entry.startKey, entry.endKey)}</p>
                      </span>
                    </li>
                  );
                }
                if (entry.kind === 'program') {
                  return (
                    <li
                      key={entry.id}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3"
                      style={{ borderLeft: `3px solid ${SCHEDULE_COLOR}` }}
                    >
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: SCHEDULE_COLOR }} />
                      <span>
                        <p className="text-sm font-semibold text-slate-900">{entry.label}</p>
                        <p className="text-xs text-slate-500">{formatDayLabel(entry.dayKey)}</p>
                      </span>
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
