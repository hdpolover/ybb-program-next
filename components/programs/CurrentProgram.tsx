'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square, ExternalLink } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramOverviewSection } from '@/types/programs';
import { parseApiDate } from '@/lib/utils';

type InstagramFeedItem = {
  id: string;
  permalink: string;
  imageUrl?: string | null;
  caption?: string | null;
  embedHtml?: string | null;
};

type CurrentProgramProps = {
  overview?: ProgramOverviewSection['content'];
  coverImage?: string;
  guidebooks?: Array<{ label: string; url: string }>;
  igFeed?: InstagramFeedItem[];
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

  const parsed = parseApiDate(raw);
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

function extractInstagramPermalink(input?: string | null): string | null {
  const raw = (input ?? '').trim();
  if (!raw || !/instagram\.com/i.test(raw)) return null;

  const permalinkCandidate =
    raw.match(/data-instgrm-permalink=(['"])(.*?)\1/i)?.[2] ??
    raw.match(/href=(['"])(https?:\/\/(?:www\.)?instagram\.com\/[^'"]+)\1/i)?.[2] ??
    raw;

  try {
    const url = new URL(permalinkCandidate);
    const hostname = url.hostname.toLowerCase();
    if (hostname !== 'instagram.com' && hostname !== 'www.instagram.com') return null;

    const path = url.pathname.replace(/\/+$/, '');
    const supportedPath = path.match(/^\/(p|reel|tv)\/[^/]+/i)?.[0];
    if (!supportedPath) return null;

    return `https://www.instagram.com${supportedPath}/`;
  } catch {
    return null;
  }
}

function buildInstagramEmbedHtml(permalink: string): string {
  const safePermalink = permalink.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return `<blockquote class="instagram-media" data-instgrm-permalink="${safePermalink}" data-instgrm-version="14"><a href="${safePermalink}" target="_blank" rel="noreferrer">View this post on Instagram</a></blockquote>`;
}

function resolveInstagramEmbedPermalink(post: InstagramFeedItem | null): string | null {
  if (!post) return null;

  return (
    extractInstagramPermalink(post.embedHtml) ??
    extractInstagramPermalink(post.imageUrl) ??
    extractInstagramPermalink(post.permalink)
  );
}

type InstagramWindow = Window & {
  instgrm?: {
    Embeds?: {
      process: () => void;
    };
  };
};

export default function CurrentProgram({ overview, coverImage, guidebooks: backendGuidebooks, igFeed }: CurrentProgramProps) {
  const [subthemesExpanded, setSubthemesExpanded] = useState(false);
  const [activePostIndex, setActivePostIndex] = useState(0);

  const posts = useMemo(
    () =>
      (igFeed ?? []).filter(
        (item): item is InstagramFeedItem =>
          Boolean(item?.id && item?.permalink),
      ),
    [igFeed],
  );

  useEffect(() => {
    if (posts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActivePostIndex((current) => (current + 1) % posts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [posts.length]);

  const normalizedActivePostIndex =
    activePostIndex >= 0 && activePostIndex < posts.length ? activePostIndex : 0;
  const activePost = posts[normalizedActivePostIndex] ?? null;
  const activePostEmbedPermalink = resolveInstagramEmbedPermalink(activePost);
  const activePostEmbedHtml = activePostEmbedPermalink
    ? buildInstagramEmbedHtml(activePostEmbedPermalink)
    : '';

  useEffect(() => {
    if (!activePostEmbedHtml) return;

    const processEmbeds = () => {
      (window as InstagramWindow).instgrm?.Embeds?.process();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]',
    );
    const frameId = window.requestAnimationFrame(processEmbeds);

    if (existingScript) {
      return () => window.cancelAnimationFrame(frameId);
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = processEmbeds;
    document.body.appendChild(script);

    return () => {
      window.cancelAnimationFrame(frameId);
      script.onload = null;
    };
  }, [activePostEmbedHtml]);

  const subthemes = useMemo(() => {
    const list = overview?.subthemes;
    return list && list.length > 0 ? list : null;
  }, [overview?.subthemes]);

  const visibleSubthemes = useMemo(() => {
    if (!subthemes) return [];
    if (subthemesExpanded) return subthemes;
    return subthemes.slice(0, 2);
  }, [subthemes, subthemesExpanded]);

  if (!overview) return null;

  const description = overview.description;
  const theme = overview.theme;
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
  const guidebooksRaw =
    backendGuidebooks && backendGuidebooks.length > 0
      ? backendGuidebooks
      : overview.guidebooks && overview.guidebooks.length > 0
        ? overview.guidebooks
        : null;
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
              <div className="relative" style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '8px' }}>
                {isHtmlContent(description) ? (
                  <div
                    className={componentsTheme.programsCurrent.richText}
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className={componentsTheme.programsCurrent.bodyParagraph}>{description}</p>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            )}

            {showThemeBlock && (
              <div className={componentsTheme.programsCurrent.themeBlock}>
                {theme && (
                  <div>
                    <h3 className={componentsTheme.programsCurrent.themeHeading}>Program Theme</h3>
                    <div className={componentsTheme.programsCurrent.themeCard}>
                      <p className={componentsTheme.programsCurrent.themeTitle}>{theme}</p>
                    </div>
                  </div>
                )}
                {subthemes && (
                  <div>
                    <h3 className={componentsTheme.programsCurrent.themeHeading}>Subthemes</h3>
                    <div className={componentsTheme.programsCurrent.subthemesGrid}>
                      {(visibleSubthemes ?? []).map(subtheme => (
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

                    {subthemes.length > 2 && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="text-sm font-semibold text-primary hover:underline"
                          onClick={() => setSubthemesExpanded((v) => !v)}
                        >
                          {subthemesExpanded ? 'Show less' : 'Read more'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={componentsTheme.programsCurrent.rightCol}>
            <div className={componentsTheme.programsCurrent.rightCard}>
              {activePost && (
                <div className={componentsTheme.programsCurrent.instagramFeedWrapper}>
                  {activePostEmbedHtml ? (
                    <div className={componentsTheme.programsCurrent.instagramEmbedContainer}>
                      <div
                        className={componentsTheme.programsCurrent.instagramEmbed}
                        dangerouslySetInnerHTML={{ __html: activePostEmbedHtml }}
                      />
                    </div>
                  ) : (
                    <a
                      href={activePost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className={componentsTheme.programsCurrent.instagramFallbackCard}
                    >
                      <div className={componentsTheme.programsCurrent.instagramBadge}>
                        Instagram
                      </div>
                      <p className={componentsTheme.programsCurrent.instagramCaption}>
                        {activePost.caption?.trim() || 'Open this post on Instagram'}
                      </p>
                    </a>
                  )}

                  <div className={componentsTheme.programsCurrent.instagramControls}>
                    {posts.length > 1 ? (
                      <div className={componentsTheme.programsCurrent.instagramDotsWrapper}>
                        {posts.map((post, index) => (
                          <button
                            key={post.id}
                            type="button"
                            aria-label={`Show Instagram post ${index + 1}`}
                            onClick={() => setActivePostIndex(index)}
                            className={`${componentsTheme.programsCurrent.instagramDot} ${
                              index === normalizedActivePostIndex ? componentsTheme.programsCurrent.instagramDotActive : componentsTheme.programsCurrent.instagramDotInactive
                            }`}
                          />
                        ))}
                      </div>
                    ) : null}
                    <a
                      href={activePost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className={componentsTheme.programsCurrent.instagramLink}
                    >
                      <span className={componentsTheme.programsCurrent.instagramLinkText}>View on Instagram</span>
                      <ExternalLink className={componentsTheme.programsCurrent.instagramLinkIcon} />
                    </a>
                  </div>
                </div>
              )}

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
                          if (!guide.label) return 'Read Guideline';
                          const normalized = guide.label.replace(/\bguidebooks?\b/gi, 'Guideline').trim();
                          return normalized || 'Read Guideline';
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
