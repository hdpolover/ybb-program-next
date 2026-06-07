'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { CalendarDays, Clock, Info } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

export type RundownItem = {
  dateLabel: string; // e.g. Oct 12, 2025
  activitiesCount: number; // e.g. 1
  timeRange: string; // e.g. 12:00 PM - 03:00 PM
  duration: string; // e.g. Duration: 3h
  title: string; // e.g. Airport Assistance, Registration (Hotel Check-in)
  description: string;
};

export default function ProgramRundowns({
  title = 'Program Rundowns',
  subtitle = 'Detailed schedule of activities for this program',
  days,
  note = 'Note: This rundown is an estimation only. The final schedule will be updated closer to the program date. Please check back regularly for the most accurate information.',
}: {
  title?: string;
  subtitle?: string;
  days: { label: string; items: RundownItem[] }[];
  note?: string;
}) {
  const [active, setActive] = useState(0);

  if (!days || days.length === 0) return null;

  return (
    <section className={componentsTheme.programRundowns.sectionWrapper}>
      <div className={componentsTheme.programRundowns.container}>
        <SectionHeader eyebrow={title} title={subtitle} align="center" />

        {/* tab hari */}
        <div className={componentsTheme.programRundowns.tabWrapper}>
          <div className={componentsTheme.programRundowns.tabGrid}>
            {days.map((d, i) => (
              <button
                key={d.label}
                type="button"
                onClick={() => setActive(i)}
                className={`${componentsTheme.programRundowns.tabButton} ${
                  i === active ? 'text-blue-950' : 'text-blue-900/60 hover:bg-blue-50'
                }`}
                aria-current={i === active}
              >
                <span className={componentsTheme.programRundowns.tabLabel}>
                  <CalendarDays className={componentsTheme.programRundowns.tabLabelIcon} />
                  <span>{d.label}</span>
                </span>
                {i === active ? (
                  <span className={componentsTheme.programRundowns.tabActiveUnderline} />
                ) : (
                  <span className={componentsTheme.programRundowns.tabDivider} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* daftar rundown */}
        <div className={componentsTheme.programRundowns.listWrapper}>
          {days[active]?.items.map((it, idx) => (
            <div
              key={idx}
              className={componentsTheme.programRundowns.card}
            >
              <div className={componentsTheme.programRundowns.cardInner}>
                {/* konten kiri */}
                <div>
                  <h3 className={componentsTheme.programRundowns.cardTitle}>{it.title}</h3>
                  {it.description ? (
                    <p className={componentsTheme.programRundowns.cardDescription}>
                      {it.description}
                    </p>
                  ) : null}
                </div>
                {/* meta kanan */}
                <div className={componentsTheme.programRundowns.metaRow}>
                  <div className={`${componentsTheme.programRundowns.metaItem} ${componentsTheme.programRundowns.metaItemDate}`}>
                    <CalendarDays className="h-4 w-4" />
                    <span>{it.dateLabel}</span>
                  </div>
                  <div className={`${componentsTheme.programRundowns.metaItem} ${componentsTheme.programRundowns.metaItemTime}`}>
                    <Clock className="h-4 w-4" />
                    <span>{it.timeRange}</span>
                  </div>
                  {it.duration ? (
                    <div className={`${componentsTheme.programRundowns.metaItem} ${componentsTheme.programRundowns.metaItemDuration}`}>
                      <Info className="h-4 w-4" />
                      <span>{it.duration}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* catatan di bawah tab */}
        {note ? (
          <div className={componentsTheme.programRundowns.noteWrapper}>
            <Info className={componentsTheme.programRundowns.noteIcon} />
            <p className={componentsTheme.programRundowns.noteText}>{note}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
