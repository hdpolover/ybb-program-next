'use client';

import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramOverviewSection } from '@/types/programs';

type CurrentProgramProps = {
  overview?: ProgramOverviewSection['content'];
  coverImage?: string;
};

function parseValidDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    const nested = candidate.$date ?? candidate.date ?? candidate.value ?? candidate.iso;
    if (nested !== undefined) return parseValidDate(nested);
  }

  const raw = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  if (!raw.trim()) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateRange(start?: string | null, end?: string | null): string | null {
  const startDate = parseValidDate(start);
  const endDate = parseValidDate(end);
  if (!startDate && !endDate) return null;

  const format = (d: Date) =>
    d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  if (startDate && endDate) {
    return `${format(startDate)} – ${format(endDate)}`;
  }

  if (startDate) return format(startDate);
  return endDate ? format(endDate) : null;
}

export default function CurrentProgram({ overview, coverImage }: CurrentProgramProps) {
  if (!overview) return null;

  const description = overview.description;
  const theme = overview.theme;
  const subthemes = overview.subthemes && overview.subthemes.length > 0 ? overview.subthemes : null;
  const location = overview.location;
  const duration = overview.duration;
  const programFormatLabel = (() => {
    switch (overview.program_format) {
      case 'in_person':
        return 'In-Person';
      case 'hybrid':
        return 'Hybrid';
      case 'online':
        return 'Online';
      default:
        return null;
    }
  })();
  const eventDates = formatDateRange(overview.start_date ?? null, overview.end_date ?? null);
  const guidebooksRaw = overview.guidebooks && overview.guidebooks.length > 0 ? overview.guidebooks : null;
  const guidebooks = guidebooksRaw ? guidebooksRaw.slice(-2) : null;
  const showThemeBlock = Boolean(theme) || Boolean(subthemes);

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
            {description && (
              isHtmlContent(description) ? (
                <div
                  className={componentsTheme.programsCurrent.richText}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className={componentsTheme.programsCurrent.bodyParagraph}>{description}</p>
              )
            )}

            {showThemeBlock && (
              <div className={componentsTheme.programsCurrent.themeBlock}>
                {theme && (
                  <div>
                    <h3 className={componentsTheme.programsCurrent.themeHeading}>Program Theme</h3>
                    <p className={componentsTheme.programsCurrent.themeTitle}>{theme}</p>
                  </div>
                )}
                {subthemes && (
                  <div>
                    <h3 className={componentsTheme.programsCurrent.themeHeading}>Subthemes</h3>
                    <div className={componentsTheme.programsCurrent.subthemesGrid}>
                      {subthemes.map(subtheme => (
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={componentsTheme.programsCurrent.rightCol}>
            <div className={componentsTheme.programsCurrent.rightCard}>
              {coverImage && (
                <div className={componentsTheme.programsCurrent.coverWrapper}>
                  <div className="relative w-full aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src={coverImage}
                      alt="Program cover"
                      fill
                      sizes="(min-width:1024px) 260px, (min-width:640px) 50vw, 100vw"
                      className={`${componentsTheme.programsCurrent.coverImage} object-cover`}
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Info program */}
              <div className={componentsTheme.programsCurrent.infoList}>
                {location && (
                  <div className={componentsTheme.programsCurrent.infoRow}>
                    <MapPin className={componentsTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={componentsTheme.programsCurrent.infoLabel}>
                        Location
                      </p>
                      <p className={componentsTheme.programsCurrent.infoValue}>{location}</p>
                    </div>
                  </div>
                )}

                {(duration || programFormatLabel) && (
                  <div className={componentsTheme.programsCurrent.infoGrid}>
                    {duration && (
                      <div className={componentsTheme.programsCurrent.infoRow}>
                        <CalendarDays className={componentsTheme.programsCurrent.infoIcon} />
                        <div>
                          <p className={componentsTheme.programsCurrent.infoLabel}>
                            Duration
                          </p>
                          <p className={componentsTheme.programsCurrent.infoValue}>{duration}</p>
                        </div>
                      </div>
                    )}
                    {programFormatLabel && (
                      <div className={componentsTheme.programsCurrent.infoRow}>
                        <Square className={componentsTheme.programsCurrent.infoIcon} />
                        <div>
                          <p className={componentsTheme.programsCurrent.infoLabel}>
                            Program Format
                          </p>
                          <p className={componentsTheme.programsCurrent.infoValue}>
                            {programFormatLabel}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {eventDates && (
                  <div className={componentsTheme.programsCurrent.infoRow}>
                    <Calendar className={componentsTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={componentsTheme.programsCurrent.infoLabel}>
                        Event Dates
                      </p>
                      <p className={componentsTheme.programsCurrent.infoValue}>{eventDates}</p>
                    </div>
                  </div>
                )}
              </div>

              {guidebooks && (
                <div className={componentsTheme.programsCurrent.guideButtonsWrapper}>
                  {guidebooks.map((guide, index) => (
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
                          return base || guide.label || 'Read Guidebook';
                        })()}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
