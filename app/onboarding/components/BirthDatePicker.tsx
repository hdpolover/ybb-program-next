import React, { useMemo, useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';
import { FormField } from '@/components/ui/FormField';
import { Gift } from 'lucide-react';

export function BirthDatePicker({
  value,
  onChange,
  errorClassName = '',
}: {
  value: string;
  onChange: (value: string) => void;
  errorClassName?: string;
}) {
  const [birthPickerOpen, setBirthPickerOpen] = useState(false);
  const [birthPickerMonth, setBirthPickerMonth] = useState(() => new Date().getMonth());
  const [birthPickerYear, setBirthPickerYear] = useState(() => new Date().getFullYear() - 18);
  const [birthPickerMode, setBirthPickerMode] = useState<'day' | 'month' | 'year'>('day');
  const [birthPickerYearPageStart, setBirthPickerYearPageStart] = useState(
    () => new Date().getFullYear() - 18 - 12
  );

  const birthPickerMeta = useMemo(() => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const firstDayOfMonth = new Date(birthPickerYear, birthPickerMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const daysInMonth = new Date(birthPickerYear, birthPickerMonth + 1, 0).getDate();

    const monthLabel = `${monthNames[birthPickerMonth]} ${birthPickerYear}`;
    const monthName = monthNames[birthPickerMonth];
    const yearLabel = String(birthPickerYear);

    const cells: Array<{ day: number | null; iso: string | null }> = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ day: null, iso: null });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${birthPickerYear}-${String(birthPickerMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, iso });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, iso: null });
    }

    return { monthLabel, monthName, yearLabel, cells, monthNames };
  }, [birthPickerMonth, birthPickerYear]);

  const birthDateDisplay = useMemo(() => {
    if (!value) return '';
    const [y, m, d] = value.split('-');
    if (!y || !m || !d) return value;
    return `${d}/${m}/${y}`;
  }, [value]);

  const goBirthPickerPrev = () => {
    setBirthPickerMonth(prev => {
      if (prev === 0) {
        setBirthPickerYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const goBirthPickerNext = () => {
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

  const goBirthPickerYearPrevPage = () => {
    setBirthPickerYearPageStart(y => y - 24);
  };

  const goBirthPickerYearNextPage = () => {
    setBirthPickerYearPageStart(y => y + 24);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`${componentsTheme.login.input} ${errorClassName} flex items-center justify-between`}
        onClick={() => setBirthPickerOpen(v => !v)}
      >
        <span className={birthDateDisplay ? 'text-slate-900' : 'text-slate-400'}>
          {birthDateDisplay || 'Select date'}
        </span>
        <span className="text-slate-400">▾</span>
      </button>

      {birthPickerOpen ? (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => setBirthPickerMode(m => (m === 'month' ? 'day' : 'month'))}
              >
                {birthPickerMeta.monthName}
              </button>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => {
                  setBirthPickerMode(m => (m === 'year' ? 'day' : 'year'));
                  setBirthPickerYearPageStart(birthPickerYear - 12);
                }}
              >
                {birthPickerMeta.yearLabel}
              </button>
            </div>

            <button
              type="button"
              className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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

              <div className="mt-2 grid grid-cols-7 gap-1">
                {birthPickerMeta.cells.map((cell, idx) => {
                  const selected = cell.iso && cell.iso === value;
                  const isEmpty = !cell.day || !cell.iso;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isEmpty}
                      onClick={() => {
                        const iso = cell.iso;
                        if (!iso) return;
                        onChange(iso);
                        setBirthPickerOpen(false);
                      }}
                      className={
                        isEmpty
                          ? 'h-9 rounded-lg'
                          : `h-9 rounded-lg text-sm font-semibold ${
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
              {birthPickerMeta.monthNames.map((name, idx) => {
                const selected = idx === birthPickerMonth;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setBirthPickerMonth(idx);
                      setBirthPickerMode('day');
                    }}
                    className={`h-10 rounded-lg text-sm font-semibold ${
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
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setBirthPickerYear(y);
                      setBirthPickerMode('day');
                    }}
                    className={`h-10 rounded-lg text-sm font-semibold ${
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
              onClick={() => {
                setBirthPickerOpen(false);
                setBirthPickerMode('day');
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
