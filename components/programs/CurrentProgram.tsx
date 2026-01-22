'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
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
  const description = overview?.description || 'Data not added';
  const theme = overview?.theme || 'Data not added';
  const subthemes = overview?.subthemes && overview.subthemes.length > 0 ? overview.subthemes : null;
  const location = overview?.location || 'Data not added';
  const duration = overview?.duration || 'Data not added';
  const eventDates = formatDateRange(overview?.start_date ?? null, overview?.end_date ?? null);
  const guidebooksRaw = overview?.guidebooks && overview.guidebooks.length > 0 ? overview.guidebooks : null;
  const guidebooks = guidebooksRaw ? guidebooksRaw.slice(-2) : null;

  return (
    <section className={jysSectionTheme.programsCurrent.sectionWrapper}>
      <div className={jysSectionTheme.programsCurrent.container}>
        <div className={jysSectionTheme.programsCurrent.layoutGrid}>
          {/* Kiri: deskripsi panjang + theme */}
          <div className={jysSectionTheme.programsCurrent.leftCol}>
            <SectionHeader eyebrow="Active Program" title="Japan Youth Summit 2026" align="left" />
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
                        {subtheme.title}
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
                <Image
                  src="/img/jys26posters.png"
                  alt="Japan Youth Summit 2026 cover"
                  width={260}
                  height={360}
                  className={jysSectionTheme.programsCurrent.coverImage}
                  priority
                />
              </div>

              {/* Info program */}
              <div className={jysSectionTheme.programsCurrent.infoList}>
                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <MapPin className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>Location</p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>{location}</p>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoGrid}>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <CalendarDays className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>Duration</p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>{duration}</p>
                    </div>
                  </div>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <Square className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>Program Format</p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>Data not added</p>
                    </div>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <Calendar className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>Event Dates</p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>{eventDates}</p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className={jysSectionTheme.programsCurrent.guideButtonsWrapper}>
                {guidebooks ? (
                  guidebooks.map(guide => (
                    <a
                      key={guide.url}
                      href={guide.url}
                      className={`${jysSectionTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                      target="_blank"
                      rel="noreferrer"
                      title={guide.label}
                    >
                      <span>
                        {(() => {
                          if (!guide.label) return 'Read Guidebook';
                          const base = guide.label.split('(')[0].trim();
                          return base || guide.label || 'Read Guidebook';
                        })()}
                      </span>
                    </a>
                  ))
                ) : (
                  <p className={jysSectionTheme.programsCurrent.bodyParagraph}>Data not added</p>
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
