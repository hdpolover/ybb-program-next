'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
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
  coverImage?: string;
};

function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return DATA_NOT_ADDED;

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

  return DATA_NOT_ADDED;
}

export default function CurrentProgram({ overview, coverImage }: CurrentProgramProps) {
  if (!overview) return null;

  const description = overview.description || DATA_NOT_ADDED;
  const theme = overview.theme || DATA_NOT_ADDED;
  const subthemes = overview.subthemes && overview.subthemes.length > 0 ? overview.subthemes : null;
  const location = overview.location || DATA_NOT_ADDED;
  const duration = overview.duration || DATA_NOT_ADDED;
  const eventDates = formatDateRange(overview.start_date ?? null, overview.end_date ?? null);
  const guidebooksRaw = overview.guidebooks && overview.guidebooks.length > 0 ? overview.guidebooks : null;
  const guidebooks = guidebooksRaw ? guidebooksRaw.slice(-2) : null;

  const isHtmlContent = (value?: string | null) => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed.startsWith('<') && trimmed.includes('</');
  };

  return (
    <section className={componentsTheme.programsCurrent.sectionWrapper}>
      <div className={componentsTheme.programsCurrent.container}>
        <div className={componentsTheme.programsCurrent.layoutGrid}>
          {/* Kiri: deskripsi panjang + theme */}
          <div className={componentsTheme.programsCurrent.leftCol}>
            <SectionHeader
              eyebrow="Active Program"
              title={overview.program_name || 'Active Program'}
              align="left"
            />
            {isHtmlContent(description) ? (
              <div
                className={componentsTheme.programsCurrent.richText}
                dangerouslySetInnerHTML={{ __html: description ?? '' }}
              />
            ) : (
              <p className={componentsTheme.programsCurrent.bodyParagraph}>{description}</p>
            )}

            <div className={componentsTheme.programsCurrent.themeBlock}>
              <div>
                <h3 className={componentsTheme.programsCurrent.themeHeading}>Program Theme</h3>
                <p className={componentsTheme.programsCurrent.themeTitle}>{theme}</p>
              </div>
              <div>
                <h3 className={componentsTheme.programsCurrent.themeHeading}>Subthemes</h3>
                <div className={componentsTheme.programsCurrent.subthemesGrid}>
                  {subthemes ? (
                    subthemes.map(subtheme => (
                      <div
                        key={subtheme.id}
                        className={componentsTheme.programsCurrent.subthemeCard}
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
                    <div className={componentsTheme.programsCurrent.subthemeCard}>
                      {DATA_NOT_ADDED}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={componentsTheme.programsCurrent.rightCol}>
            <div className={componentsTheme.programsCurrent.rightCard}>
              {/* Gambar cover */}
              <div className={componentsTheme.programsCurrent.coverWrapper}>
                <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={coverImage ?? '/img/jys26posters.png'}
                    alt="Japan Youth Summit 2026 cover"
                    fill
                    sizes="(min-width:1024px) 260px, (min-width:640px) 50vw, 100vw"
                    className={`${componentsTheme.programsCurrent.coverImage} object-cover`}
                    priority
                  />
                </div>
              </div>

              {/* Info program */}
              <div className={componentsTheme.programsCurrent.infoList}>
                <div className={componentsTheme.programsCurrent.infoRow}>
                  <MapPin className={componentsTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={componentsTheme.programsCurrent.infoLabel}>
                      Location
                    </p>
                    <p className={componentsTheme.programsCurrent.infoValue}>{location}</p>
                  </div>
                </div>

                <div className={componentsTheme.programsCurrent.infoGrid}>
                  <div className={componentsTheme.programsCurrent.infoRow}>
                    <CalendarDays className={componentsTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={componentsTheme.programsCurrent.infoLabel}>
                        Duration
                      </p>
                      <p className={componentsTheme.programsCurrent.infoValue}>{duration}</p>
                    </div>
                  </div>
                  <div className={componentsTheme.programsCurrent.infoRow}>
                    <Square className={componentsTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={componentsTheme.programsCurrent.infoLabel}>
                        Program Format
                      </p>
                      <p className={componentsTheme.programsCurrent.infoValue}>
                        {DATA_NOT_ADDED}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={componentsTheme.programsCurrent.infoRow}>
                  <Calendar className={componentsTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={componentsTheme.programsCurrent.infoLabel}>
                      Event Dates
                    </p>
                    <p className={componentsTheme.programsCurrent.infoValue}>{eventDates}</p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className={componentsTheme.programsCurrent.guideButtonsWrapper}>
                {guidebooks ? (
                  guidebooks.map((guide, index) => (
                    <a
                      key={`${guide.url}-${index}`}
                      href={guide.url}
                      className={`${componentsTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                      target="_blank"
                      rel="noreferrer"
                      title={guide.label}
                    >
                      <span>
                        {(() => {
                          if (!guide.label) return 'Read Guidebook';
                          const base = guide.label.split('(')[0].trim();
                          return (
                            base || guide.label || 'Read Guidebook'
                          );
                        })()}
                      </span>
                    </a>
                  ))
                ) : (
                  <>
                    <span
                      aria-disabled="true"
                      className={`${componentsTheme.homeRegistration.guidePrimary} pointer-events-none flex w-full cursor-not-allowed items-center justify-center gap-2 text-sm opacity-60`}
                    >
                      {DATA_NOT_ADDED}
                    </span>
                    <span
                      aria-disabled="true"
                      className={`${componentsTheme.homeRegistration.guideSecondary} pointer-events-none flex w-full cursor-not-allowed items-center justify-center gap-2 text-sm opacity-60`}
                    >
                      {DATA_NOT_ADDED}
                    </span>
                  </>
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
        return <CalendarDays className={componentsTheme.programsCurrent.infoItemIcon} />;
      case 'date':
        return <Calendar className={componentsTheme.programsCurrent.infoItemIcon} />;
      case 'pin':
        return <MapPin className={componentsTheme.programsCurrent.infoItemIcon} />;
      case 'format':
        return <Square className={componentsTheme.programsCurrent.infoItemIcon} />;
    }
  };
  return (
    <div className={componentsTheme.programsCurrent.infoItemCard}>
      <div className={componentsTheme.programsCurrent.infoItemHeader}>
        <Icon />
        <span className={componentsTheme.programsCurrent.infoItemLabel}>{label}</span>
      </div>
      <div className={componentsTheme.programsCurrent.infoItemValue}>{value}</div>
    </div>
  );
}
