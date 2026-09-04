import React, { useEffect, useMemo, useRef, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Validates a 'YYYY-MM-DD' string: correct shape, a real calendar date (no
 * Feb 30), and within [minDate, maxDate]. Bound comparison relies on all
 * three strings sharing the same zero-padded ISO shape, where lexicographic
 * string order matches chronological order.
 */
export function isValidBirthDate(value: string, minDate: string, maxDate: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [y, m, d] = value.split('-').map(Number);
  if (m < 1 || m > 12) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  if (d < 1 || d > daysInMonth) return false;

  if (value < minDate || value > maxDate) return false;
  return true;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toIso(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** Adds `delta` calendar days to an ISO 'YYYY-MM-DD' date, handling month/year rollover. */
function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return toIso(new Date(y, m - 1, d + delta));
}

/** Moves `delta` months, clamping the day to the last day of the target month (e.g. Jan 31 + 1 month -> Feb 28/29). */
function addMonths(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const target = new Date(y, m - 1 + delta, 1);
  const daysInTargetMonth = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, daysInTargetMonth));
  return toIso(target);
}

function startOfWeek(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - date.getDay());
  return toIso(date);
}

function endOfWeek(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + (6 - date.getDay()));
  return toIso(date);
}

function clampIso(iso: string, minDate: string, maxDate: string): string {
  if (iso < minDate) return minDate;
  if (iso > maxDate) return maxDate;
  return iso;
}

export function BirthDatePicker({
  value,
  onChange,
  errorClassName = '',
  minDate,
  maxDate,
}: {
  value: string;
  onChange: (value: string) => void;
  errorClassName?: string;
  /** Earliest selectable date, inclusive, 'YYYY-MM-DD'. */
  minDate: string;
  /** Latest selectable date, inclusive, 'YYYY-MM-DD'. */
  maxDate: string;
}) {
  const [birthPickerOpen, setBirthPickerOpen] = useState(false);
  const [birthPickerMonth, setBirthPickerMonth] = useState(() => new Date().getMonth());
  const [birthPickerYear, setBirthPickerYear] = useState(() => new Date().getFullYear() - 18);
  const [birthPickerMode, setBirthPickerMode] = useState<'day' | 'month' | 'year'>('day');
  const [birthPickerYearPageStart, setBirthPickerYearPageStart] = useState(
    () => new Date().getFullYear() - 18 - 12
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dayButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Roving-tabindex target for the day grid: the one day cell that is a Tab
  // stop, moved by arrow keys instead of exposing 42 separate Tab stops.
  const [focusedIso, setFocusedIso] = useState<string | null>(null);

  // Viewport-aware placement, mirroring components/ui/StyledSelect.tsx so the
  // calendar flips above/below the trigger instead of assuming there is
  // always room in one fixed direction.
  const [calPlacement, setCalPlacement] = useState<'bottom' | 'top'>('bottom');
  const [calRect, setCalRect] = useState<{ left: number; width: number; top: number; bottom: number } | null>(null);
  const [calMaxHeight, setCalMaxHeight] = useState<number>(420);

  const bounds = useMemo(() => {
    const [minYear, minMonth] = minDate.split('-').map(Number);
    const [maxYear, maxMonth] = maxDate.split('-').map(Number);
    return { minYear, minMonth: minMonth - 1, maxYear, maxMonth: maxMonth - 1 };
  }, [minDate, maxDate]);

  // Re-sync the visible month/year to the current value every time the
  // picker opens — covers the async-prefill case, where `value` starts empty
  // and is populated later, well after this component's initial mount.
  useEffect(() => {
    if (!birthPickerOpen) return;

    const parsed = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (parsed) {
      const y = Number(parsed[1]);
      const m = Number(parsed[2]) - 1;
      // Syncing the calendar's display position to the controlled value/open
      // transition, not deriving render output; see comment above this effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBirthPickerYear(y);
      setBirthPickerMonth(m);
      setBirthPickerYearPageStart(y - 12);
      setFocusedIso(value);
    } else {
      const fallbackYear = clamp(new Date().getFullYear() - 18, bounds.minYear, bounds.maxYear);
      setBirthPickerYear(fallbackYear);
      setBirthPickerMonth(0);
      setBirthPickerYearPageStart(fallbackYear - 12);
      setFocusedIso(clampIso(`${fallbackYear}-01-01`, minDate, maxDate));
    }
    setBirthPickerMode('day');
    // Intentionally only re-syncs on open/value change, not on every bounds
    // recompute (bounds are effectively static for the lifetime of the form).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthPickerOpen, value]);

  // Close on outside click and Escape, mirroring StyledSelect's behaviour.
  // Keyboard users must not get dumped to the top of the document: return
  // focus to the trigger button on close. The one exception is an outside
  // click that itself landed on another focusable control (e.g. the next
  // form field) — the browser is already moving focus there, so stealing it
  // back to the trigger would fight the user's click.
  useEffect(() => {
    if (!birthPickerOpen) return;

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (wrapperRef.current && !wrapperRef.current.contains(target)) {
        setBirthPickerOpen(false);
        setBirthPickerMode('day');
        const targetEl = target instanceof Element ? target : null;
        const clickedFocusable = targetEl?.closest('button, a[href], input, select, textarea, [tabindex]');
        if (!clickedFocusable) {
          triggerRef.current?.focus();
        }
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setBirthPickerOpen(false);
        setBirthPickerMode('day');
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [birthPickerOpen]);

  // Viewport-boundary detection for the calendar's placement, following
  // StyledSelect's updatePosition pattern: prefer opening below the trigger,
  // flip above when there isn't enough room below but there is above.
  useEffect(() => {
    if (!birthPickerOpen) return;

    function updatePosition() {
      const buttonEl = triggerRef.current;
      if (!buttonEl) return;

      const rect = buttonEl.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const gap = 8;
      const padding = 12;

      const spaceBelow = viewportHeight - rect.bottom - gap - padding;
      const spaceAbove = rect.top - gap - padding;

      const desired = 420;
      const minHeight = 260;

      // The calendar is NOT sized to the trigger. It used to be
      // `min(rect.width, ...)`, and the trigger is a narrow field in a
      // two-column form, so seven day columns plus their gaps were squeezed
      // into ~160px: the numbers ran together ("18 19 2021 222324"), the tap
      // targets fell under a finger's width, and reaching the year control
      // meant fighting the layout. Reported from the MEYS 7th signup.
      //
      // 304 = 7 columns x 40px + the dialog's own 12px padding either side.
      // It is a FLOOR, not a fixed width: a trigger wider than that keeps its
      // own width, and the viewport clamp still wins on a small screen.
      const width = Math.min(Math.max(rect.width, 304), viewportWidth - padding * 2);

      // Clamp against the FINAL width, not rect.width. Computing this from
      // the trigger's width was harmless only while the calendar could never
      // be wider than the trigger; now that it can, using rect.width here
      // would let the dialog hang off the right edge of the viewport.
      const left = Math.min(Math.max(rect.left, padding), viewportWidth - padding - width);

      if (spaceBelow < minHeight && spaceAbove > spaceBelow) {
        setCalPlacement('top');
        setCalMaxHeight(Math.max(minHeight, Math.min(desired, spaceAbove)));
        setCalRect({ left, width, top: 0, bottom: viewportHeight - rect.top + gap });
      } else {
        setCalPlacement('bottom');
        setCalMaxHeight(Math.max(minHeight, Math.min(desired, spaceBelow)));
        setCalRect({ left, width, top: rect.bottom + gap, bottom: 0 });
      }
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [birthPickerOpen]);

  // Follows focusedIso: after arrow-key navigation moves it (possibly across
  // a month boundary, which re-renders the grid), imperatively move real DOM
  // focus onto that day's button.
  useEffect(() => {
    if (!birthPickerOpen || birthPickerMode !== 'day' || !focusedIso) return;
    dayButtonRefs.current.get(focusedIso)?.focus();
  }, [focusedIso, birthPickerMonth, birthPickerYear, birthPickerOpen, birthPickerMode]);

  // Keeps focusedIso inside the currently displayed month whenever it's
  // changed by something other than moveFocusTo (the Prev/Next month
  // buttons, or picking a month/year from those sub-panels). Without this,
  // the day grid would end up with zero tabIndex=0 cells (no roving Tab
  // stop) after navigating away from the originally focused month.
  useEffect(() => {
    if (!birthPickerOpen || birthPickerMode !== 'day') return;
    // Syncing the roving-tabindex target to the displayed month/year, not
    // deriving render output; see comment above this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusedIso(prev => {
      const daysInMonth = new Date(birthPickerYear, birthPickerMonth + 1, 0).getDate();
      if (prev) {
        const [py, pm, pd] = prev.split('-').map(Number);
        if (py === birthPickerYear && pm - 1 === birthPickerMonth) return prev;
        const candidate = `${birthPickerYear}-${pad2(birthPickerMonth + 1)}-${pad2(Math.min(pd, daysInMonth))}`;
        return clampIso(candidate, minDate, maxDate);
      }
      return clampIso(`${birthPickerYear}-${pad2(birthPickerMonth + 1)}-01`, minDate, maxDate);
    });
  }, [birthPickerOpen, birthPickerMode, birthPickerYear, birthPickerMonth, minDate, maxDate]);

  const birthPickerMeta = useMemo(() => {
    const firstDayOfMonth = new Date(birthPickerYear, birthPickerMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(birthPickerYear, birthPickerMonth + 1, 0).getDate();

    const monthLabel = `${MONTH_NAMES[birthPickerMonth]} ${birthPickerYear}`;
    const monthName = MONTH_NAMES[birthPickerMonth];
    const yearLabel = String(birthPickerYear);

    const cells: Array<{ day: number | null; iso: string | null; disabled: boolean }> = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ day: null, iso: null, disabled: true });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${birthPickerYear}-${String(birthPickerMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, iso, disabled: iso < minDate || iso > maxDate });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, iso: null, disabled: true });
    }

    return { monthLabel, monthName, yearLabel, cells };
  }, [birthPickerMonth, birthPickerYear, minDate, maxDate]);

  const birthDateDisplay = useMemo(() => {
    if (!value) return '';
    const [y, m, d] = value.split('-');
    if (!y || !m || !d) return value;
    return `${d}/${m}/${y}`;
  }, [value]);

  const atMinMonth = birthPickerYear <= bounds.minYear && birthPickerMonth <= bounds.minMonth;
  const atMaxMonth = birthPickerYear >= bounds.maxYear && birthPickerMonth >= bounds.maxMonth;

  const goBirthPickerPrev = () => {
    if (atMinMonth) return;
    setBirthPickerMonth(prev => {
      if (prev === 0) {
        setBirthPickerYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goBirthPickerNext = () => {
    if (atMaxMonth) return;
    setBirthPickerMonth(prev => {
      if (prev === 11) {
        setBirthPickerYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const birthPickerYearOptions = useMemo(() => {
    const start = birthPickerYearPageStart;
    return Array.from({ length: 24 }, (_, i) => start + i);
  }, [birthPickerYearPageStart]);

  const atMinYearPage = birthPickerYearPageStart <= bounds.minYear;
  const atMaxYearPage = birthPickerYearPageStart + 24 > bounds.maxYear;

  const goBirthPickerYearPrevPage = () => {
    if (atMinYearPage) return;
    setBirthPickerYearPageStart(y => y - 24);
  };

  const goBirthPickerYearNextPage = () => {
    if (atMaxYearPage) return;
    setBirthPickerYearPageStart(y => y + 24);
  };

  function closePicker() {
    setBirthPickerOpen(false);
    setBirthPickerMode('day');
    triggerRef.current?.focus();
  }

  function selectDay(iso: string) {
    if (iso < minDate || iso > maxDate) return;
    onChange(iso);
    closePicker();
  }

  /** Moves the roving-tabindex day, changing the displayed month/year first if it crosses a boundary. */
  function moveFocusTo(iso: string) {
    const [y, m] = iso.split('-').map(Number);
    const targetMonth = m - 1;
    if (y !== birthPickerYear || targetMonth !== birthPickerMonth) {
      setBirthPickerYear(y);
      setBirthPickerMonth(targetMonth);
    }
    setFocusedIso(iso);
  }

  // WAI-ARIA datepicker keyboard pattern: arrow keys move by day/week, Home/
  // End jump to the start/end of the visible week, PageUp/PageDown step a
  // month. Keeps navigation to a single roving Tab stop instead of 42.
  function onDayGridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const current = focusedIso ?? (value || `${birthPickerYear}-${pad2(birthPickerMonth + 1)}-01`);
    let next: string | null = null;

    switch (event.key) {
      case 'ArrowRight': next = addDays(current, 1); break;
      case 'ArrowLeft': next = addDays(current, -1); break;
      case 'ArrowDown': next = addDays(current, 7); break;
      case 'ArrowUp': next = addDays(current, -7); break;
      case 'Home': next = startOfWeek(current); break;
      case 'End': next = endOfWeek(current); break;
      case 'PageUp': next = addMonths(current, -1); break;
      case 'PageDown': next = addMonths(current, 1); break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectDay(current);
        return;
      default:
        return;
    }

    event.preventDefault();
    moveFocusTo(clampIso(next, minDate, maxDate));
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={birthPickerOpen}
        aria-label="Date of birth"
        className={`${componentsTheme.login.input} ${errorClassName} flex items-center justify-between`}
        onClick={() => setBirthPickerOpen(v => !v)}
      >
        <span className={birthDateDisplay ? 'text-slate-900' : 'text-slate-400'}>
          {birthDateDisplay || 'Select date'}
        </span>
        <span className="text-slate-400" aria-hidden="true">▾</span>
      </button>

      {birthPickerOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose date of birth"
          className="fixed z-20 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
          style={
            calRect
              ? {
                  left: calRect.left,
                  width: calRect.width,
                  top: calPlacement === 'bottom' ? calRect.top : undefined,
                  bottom: calPlacement === 'top' ? calRect.bottom : undefined,
                  maxHeight: calMaxHeight,
                }
              : undefined
          }
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label={
                birthPickerMode === 'day'
                  ? 'Previous month'
                  : birthPickerMode === 'year'
                  ? 'Previous years'
                  : 'Previous year'
              }
              disabled={birthPickerMode === 'day' ? atMinMonth : birthPickerMode === 'year' ? atMinYearPage : birthPickerYear <= bounds.minYear}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              onClick={
                birthPickerMode === 'day'
                  ? goBirthPickerPrev
                  : birthPickerMode === 'year'
                  ? goBirthPickerYearPrevPage
                  : () => setBirthPickerYear(y => y - 1)
              }
            >
              Prev
            </button>

            {/*
              These two open the month and year panels, and they always did —
              but styled as bare text they read as a heading, so the reported
              complaint was that the year "cannot be clicked" and the only way
              anyone found to reach 2004 was stepping Prev a month at a time.
              A control that is discoverable only on hover is not discoverable
              on a phone at all, which is where this form is mostly filled in.
              Give them a border, a chevron and a name that says what they do.
            */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label={`Change month, currently ${birthPickerMeta.monthName}`}
                aria-expanded={birthPickerMode === 'month'}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => setBirthPickerMode(m => (m === 'month' ? 'day' : 'month'))}
              >
                {birthPickerMeta.monthName}
                <span className="text-[10px] leading-none text-slate-400" aria-hidden="true">▾</span>
              </button>
              <button
                type="button"
                aria-label={`Change year, currently ${birthPickerMeta.yearLabel}`}
                aria-expanded={birthPickerMode === 'year'}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => {
                  setBirthPickerMode(m => (m === 'year' ? 'day' : 'year'));
                  setBirthPickerYearPageStart(birthPickerYear - 12);
                }}
              >
                {birthPickerMeta.yearLabel}
                <span className="text-[10px] leading-none text-slate-400" aria-hidden="true">▾</span>
              </button>
            </div>

            <button
              type="button"
              aria-label={
                birthPickerMode === 'day'
                  ? 'Next month'
                  : birthPickerMode === 'year'
                  ? 'Next years'
                  : 'Next year'
              }
              disabled={birthPickerMode === 'day' ? atMaxMonth : birthPickerMode === 'year' ? atMaxYearPage : birthPickerYear >= bounds.maxYear}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              onClick={
                birthPickerMode === 'day'
                  ? goBirthPickerNext
                  : birthPickerMode === 'year'
                  ? goBirthPickerYearNextPage
                  : () => setBirthPickerYear(y => y + 1)
              }
            >
              Next
            </button>
          </div>

          {birthPickerMode === 'day' ? (
            <>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
                <div>Su</div>
                <div>Mo</div>
                <div>Tu</div>
                <div>We</div>
                <div>Th</div>
                <div>Fr</div>
                <div>Sa</div>
              </div>

              <div
                className="mt-2 grid grid-cols-7 gap-1"
                aria-label={birthPickerMeta.monthLabel}
                onKeyDown={onDayGridKeyDown}
              >
                {birthPickerMeta.cells.map((cell, idx) => {
                  const selected = cell.iso && cell.iso === value;
                  const isEmpty = !cell.day || !cell.iso;
                  const isFocusTarget = Boolean(cell.iso) && cell.iso === focusedIso;
                  return (
                    <button
                      key={idx}
                      type="button"
                      ref={el => {
                        if (!cell.iso) return;
                        if (el) dayButtonRefs.current.set(cell.iso, el);
                        else dayButtonRefs.current.delete(cell.iso);
                      }}
                      disabled={isEmpty || cell.disabled}
                      tabIndex={isFocusTarget ? 0 : -1}
                      aria-current={cell.iso === value ? 'date' : undefined}
                      aria-label={cell.iso ? `${cell.day} ${birthPickerMeta.monthName} ${birthPickerYear}` : undefined}
                      onFocus={() => {
                        if (cell.iso && cell.iso !== focusedIso) setFocusedIso(cell.iso);
                      }}
                      onClick={() => {
                        if (!cell.iso) return;
                        selectDay(cell.iso);
                      }}
                      className={
                        isEmpty
                          ? 'h-9 rounded-lg'
                          : `h-9 rounded-lg text-sm font-semibold disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent ${
                              selected
                                ? 'bg-slate-900 text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`
                      }
                    >
                      {cell.day ?? ''}
                    </button>
                  );
                })}
              </div>
            </>
          ) : birthPickerMode === 'month' ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((name, idx) => {
                const selected = idx === birthPickerMonth;
                const disabled =
                  (birthPickerYear === bounds.minYear && idx < bounds.minMonth) ||
                  (birthPickerYear === bounds.maxYear && idx > bounds.maxMonth);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setBirthPickerMonth(idx);
                      setBirthPickerMode('day');
                    }}
                    className={`h-10 rounded-lg text-sm font-semibold disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent ${
                      selected
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {birthPickerYearOptions.map(y => {
                const selected = y === birthPickerYear;
                const disabled = y < bounds.minYear || y > bounds.maxYear;
                return (
                  <button
                    key={y}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setBirthPickerYear(y);
                      setBirthPickerMode('day');
                    }}
                    className={`h-10 rounded-lg text-sm font-semibold disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent ${
                      selected
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={closePicker}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
