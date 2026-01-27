'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { CalendarDays, Clock, Info } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_RUNDOWNS_COPY } from '@/data/programs/sections/rundowns/programsRundowns';

export type RundownItem = {
  dateLabel: string; // e.g. Oct 12, 2025
  activitiesCount: number; // e.g. 1
  timeRange: string; // e.g. 12:00 PM - 03:00 PM
  duration: string; // e.g. Duration: 3h
  title: string; // e.g. Airport Assistance, Registration (Hotel Check-in)
  description: string;
};

export default function ProgramRundowns({
  title = PROGRAMS_RUNDOWNS_COPY.title,
  subtitle = PROGRAMS_RUNDOWNS_COPY.subtitle,
  days,
  note = PROGRAMS_RUNDOWNS_COPY.note,
}: {
  title?: string;
  subtitle?: string;
  days: { label: string; items: RundownItem[] }[];
  note?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={title} title={subtitle} align="center" />

        {/* tab hari */}
        <div className="mx-auto mt-2 w-full overflow-hidden rounded-2xl border border-blue-100 bg-white">
          <div className="grid grid-cols-4">
            {days.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setActive(i)}
                className={`${jysSectionTheme.programRundowns.tabButton} ${
                  i === active ? 'text-blue-950' : 'text-blue-900/60 hover:bg-blue-50'
                }`}
                aria-current={i === active}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <CalendarDays className={jysSectionTheme.programRundowns.tabLabelIcon} />
                  <span>{d.label}</span>
                </span>
                {i === active ? (
                  <span className={jysSectionTheme.programRundowns.tabActiveUnderline} />
                ) : (
                  <span className="absolute inset-y-3 right-0 hidden w-px bg-blue-100 last:hidden sm:block" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* daftar rundown */}
        <div className="mt-6 space-y-5">
          {days[active]?.items.map((it, idx) => (
            <div
              key={idx}
              className="min-h-[170px] rounded-2xl bg-blue-50/70 p-5 ring-1 ring-blue-100 sm:min-h-[150px]"
            >
              <div className="flex h-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* konten kiri */}
                <div>
                  <h3 className="text-lg font-extrabold text-blue-900">{it.title}</h3>
                  <p
                    className="mt-1 max-w-3xl text-sm leading-6 text-slate-700"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {it.description}
                  </p>
                </div>
                {/* meta kanan */}
                <div className="flex flex-col gap-2 sm:text-right">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900">
                    <CalendarDays className="h-4 w-4" />
                    <span>{it.dateLabel}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="h-4 w-4" />
                    <span>{it.timeRange}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                    <Info className="h-4 w-4" />
                    <span>{it.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* catatan di bawah tab */}
        {note ? (
          <div className="mt-4 flex items-start gap-3 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-200">
            <Info className={jysSectionTheme.programRundowns.noteIcon} />
            <p className="text-sm leading-6 text-blue-900">{note}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
