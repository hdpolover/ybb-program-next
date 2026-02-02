'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_CURRENT_COPY } from '@/data/programs/sections/current/programsCurrent';
import type { ProgramOverviewSection } from '@/types/programs';

function useCountdown(target: Date) {
  const targetMs = useMemo(() => target.getTime(), [target]);
  const [now, setNow] = useState<number>(() => targetMs);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

type CurrentProgramProps = {
  overview?: ProgramOverviewSection['content'];
};

function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return 'Data not added';

  try {
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    const format = (d: Date | null) =>
      d?.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) ?? '';

    if (startDate && endDate) {
      return `${format(startDate)} – ${format(endDate)}`;
    }

    if (startDate) return format(startDate);
    if (endDate) return format(endDate);
  } catch {
    // kalau format tanggal tidak valid, fallback ke text mentah
    if (start && end) return `${start} – ${end}`;
    if (start) return start;
    if (end) return end;
  }

  return 'Data not added';
}

export default function CurrentProgram({ overview }: CurrentProgramProps) {
  const description = overview?.description || PROGRAMS_CURRENT_COPY.dataNotAdded;
  const theme = overview?.theme || PROGRAMS_CURRENT_COPY.dataNotAdded;
  const subthemes = overview?.subthemes && overview.subthemes.length > 0 ? overview.subthemes : null;
  const location = overview?.location || PROGRAMS_CURRENT_COPY.dataNotAdded;
  const duration = overview?.duration || PROGRAMS_CURRENT_COPY.dataNotAdded;
  const eventDates = formatDateRange(overview?.start_date ?? null, overview?.end_date ?? null);
  const guidebooksRaw = overview?.guidebooks && overview.guidebooks.length > 0 ? overview.guidebooks : null;
  const guidebooks = guidebooksRaw ? guidebooksRaw.slice(-2) : null;

  return (
    <section className={jysSectionTheme.programsCurrent.sectionWrapper}>
      <div className={jysSectionTheme.programsCurrent.container}>
        <div className={jysSectionTheme.programsCurrent.layoutGrid}>
          {/* Kiri: deskripsi panjang + theme */}
          <div className={jysSectionTheme.programsCurrent.leftCol}>
            <SectionHeader
              eyebrow={PROGRAMS_CURRENT_COPY.eyebrow}
              title={PROGRAMS_CURRENT_COPY.title}
              align="left"
            />
            <p className={jysSectionTheme.programsCurrent.bodyParagraph}>{description}</p>

            <div className={jysSectionTheme.programsCurrent.themeBlock}>
              <div>
                <h3 className={jysSectionTheme.programsCurrent.themeHeading}>Program Theme</h3>
                <p className={jysSectionTheme.programsCurrent.themeTitle}>{theme}</p>
              </div>
              <div>
                <h3 className={jysSectionTheme.programsCurrent.themeHeading}>Subthemes</h3>
                <div className={jysSectionTheme.programsCurrent.subthemesGrid}>
                  {subthemes ? (
                    subthemes.map(subtheme => (
                      <div
                        key={subtheme.id}
                        className={jysSectionTheme.programsCurrent.subthemeCard}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {subtheme.title}
                        </p>
                        {subtheme.description && (
                          <p className="mt-1 text-xs leading-relaxed text-slate-600">
                            {subtheme.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className={jysSectionTheme.programsCurrent.subthemeCard}>Data not added</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={jysSectionTheme.programsCurrent.rightCol}>
            <div className={jysSectionTheme.programsCurrent.rightCard}>
              {/* Gambar cover */}
              <div className={jysSectionTheme.programsCurrent.coverWrapper}>
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src="/img/jys26posters.png"
                    alt="Japan Youth Summit 2026 cover"
                    fill
                    sizes="(min-width:1024px) 260px, (min-width:640px) 50vw, 100vw"
                    className={`${jysSectionTheme.programsCurrent.coverImage} object-cover`}
                    priority
                  />
                </div>
              </div>

              {/* Info program */}
              <div className={jysSectionTheme.programsCurrent.infoList}>
                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <MapPin className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>
                      {PROGRAMS_CURRENT_COPY.labels.location}
                    </p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>{location}</p>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoGrid}>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <CalendarDays className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>
                        {PROGRAMS_CURRENT_COPY.labels.duration}
                      </p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>{duration}</p>
                    </div>
                  </div>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <Square className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>
                        {PROGRAMS_CURRENT_COPY.labels.format}
                      </p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>
                        {PROGRAMS_CURRENT_COPY.dataNotAdded}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <Calendar className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>
                      {PROGRAMS_CURRENT_COPY.labels.dates}
                    </p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>{eventDates}</p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className={jysSectionTheme.programsCurrent.guideButtonsWrapper}>
                {guidebooks ? (
                  guidebooks.map((guide, index) => (
                    <a
                      key={`${guide.url}-${index}`}
                      href={guide.url}
                      className={`${jysSectionTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                      target="_blank"
                      rel="noreferrer"
                      title={guide.label}
                    >
                      <span>
                        {(() => {
                          if (!guide.label) return PROGRAMS_CURRENT_COPY.guidebookFallbackLabel;
                          const base = guide.label.split('(')[0].trim();
                          return (
                            base || guide.label || PROGRAMS_CURRENT_COPY.guidebookFallbackLabel
                          );
                        })()}
                      </span>
                    </a>
                  ))
                ) : (
                  <p className={jysSectionTheme.programsCurrent.bodyParagraph}>
                    {PROGRAMS_CURRENT_COPY.dataNotAdded}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: 'calendar' | 'date' | 'pin' | 'format';
  label: string;
  value: string;
}) {
  const Icon = () => {
    switch (icon) {
      case 'calendar':
        return <CalendarDays className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'date':
        return <Calendar className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'pin':
        return <MapPin className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'format':
        return <Square className={jysSectionTheme.programsCurrent.infoItemIcon} />;
    }
  };
  return (
    <div className={jysSectionTheme.programsCurrent.infoItemCard}>
      <div className={jysSectionTheme.programsCurrent.infoItemHeader}>
        <Icon />
        <span className={jysSectionTheme.programsCurrent.infoItemLabel}>{label}</span>
      </div>
      <div className={jysSectionTheme.programsCurrent.infoItemValue}>{value}</div>
    </div>
  );
}
