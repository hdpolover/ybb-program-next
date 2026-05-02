"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Check, CreditCard, ExternalLink, MapPin, X } from 'lucide-react';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';

type InstagramFeedItem = {
  id: string;
  permalink: string;
  imageUrl?: string | null;
  caption?: string | null;
};

type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

type RegistrationType = {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  currency: string;
  fee_type?: string;
  allowed_categories?: Array<'self_funded' | 'fully_funded' | string>;
  benefits: string[];
  requirements?: string[];
  validity_periods?: ValidityPeriod[];
};

type Guideline = {
  id: string;
  title: string;
  type: string;
  url: string;
};

type HomeRegistrationStripProps = {
  igFeed?: InstagramFeedItem[];
  registrationTypes?: RegistrationType[];
  guidelines?: Guideline[];
};

function isRegistrationOpen(periods: ValidityPeriod[] | undefined, now: Date): boolean {
  if (!periods || periods.length === 0) return false;

  return periods.some((p) => {
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
    return start <= now && now <= end;
  });
}

function getActivePeriodLabel(periods: ValidityPeriod[] | undefined, now: Date): string {
  if (!periods || periods.length === 0) return 'TBD';
  const parse = (d: string) => {
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };
  const fmt = (d: string) => {
    const parsed = parse(d);
    if (!parsed) return 'TBD';
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };
  const active = periods.find((p) => {
    const start = parse(p.start_date);
    const end = parse(p.end_date);
    return Boolean(start && end && start <= now && now <= end);
  });
  if (active) return `${fmt(active.start_date)} - ${fmt(active.end_date)}`;
  const upcoming = periods.find((p) => {
    const start = parse(p.start_date);
    return Boolean(start && start > now);
  });
  if (upcoming) return `${fmt(upcoming.start_date)} - ${fmt(upcoming.end_date)}`;
  const last = periods[periods.length - 1];
  return `${fmt(last.start_date)} - ${fmt(last.end_date)}`;
}

function normalizeCategory(category: string): 'self_funded' | 'fully_funded' | null {
  const normalized = category.trim().toLowerCase();
  if (normalized === 'self_funded' || normalized === 'self-funded') return 'self_funded';
  if (normalized === 'fully_funded' || normalized === 'fully-funded') return 'fully_funded';
  return null;
}

function hasCategory(
  tier: RegistrationType,
  target: 'self_funded' | 'fully_funded',
): boolean {
  return (tier.allowed_categories ?? [])
    .map((item) => normalizeCategory(String(item)))
    .some((item) => item === target);
}

function isRegistrationFeeTier(tier: RegistrationType): boolean {
  return (tier.fee_type ?? '').toLowerCase() === 'registration_fee';
}

function pickRegistrationTier(
  tiers: RegistrationType[],
  target: 'self_funded' | 'fully_funded',
  excludeId?: string,
): RegistrationType | undefined {
  const candidates = tiers.filter((tier) => tier.id !== excludeId);
  const exact = candidates.find(
    (tier) => hasCategory(tier, target) && !hasCategory(tier, target === 'self_funded' ? 'fully_funded' : 'self_funded'),
  );
  if (exact) return exact;

  const inclusive = candidates.find((tier) => hasCategory(tier, target));
  if (inclusive) return inclusive;

  if (candidates.length === 0) return undefined;

  const toPrice = (tier: RegistrationType) => {
    const value = Number(String(tier.price).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(value) ? value : 0;
  };

  return [...candidates].sort((a, b) => toPrice(a) - toPrice(b))[target === 'self_funded' ? candidates.length - 1 : 0];
}

function decodePossiblyEncodedHtml(value: string): string {
  if (!value.includes('&lt;')) return value;
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&');
}

function sanitizeRichHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toRichHtml(value?: string | null): string {
  const raw = decodePossiblyEncodedHtml((value ?? '').trim());
  if (!raw) return '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  const html = hasHtml ? raw : `<p>${escapeHtml(raw).replace(/\r?\n/g, '<br />')}</p>`;
  return sanitizeRichHtml(html);
}

function hasRichTextContent(value?: string | null): boolean {
  const richHtml = toRichHtml(value);
  if (!richHtml) return false;
  const plain = richHtml.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > 0;
}

export default function HomeRegistrationStrip({
  igFeed,
  registrationTypes,
  guidelines,
}: HomeRegistrationStripProps) {
  if (!registrationTypes || registrationTypes.length === 0) return null;
  const [currentNow, setCurrentNow] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentNow(new Date());
  }, []);

  const posts = useMemo(
    () =>
      (igFeed ?? []).filter(
        (item): item is InstagramFeedItem =>
          Boolean(item?.id && item?.permalink),
      ),
    [igFeed],
  );
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [fallbackImageFailed, setFallbackImageFailed] = useState(false);
  const [descriptionDialog, setDescriptionDialog] = useState<{
    title: string;
    descriptionHtml: string;
    requirements: string[];
    benefits: string[];
    benefitsLabel: string;
  } | null>(null);
  const primaryContentRef = useRef<HTMLDivElement | null>(null);
  const secondaryContentRef = useRef<HTMLDivElement | null>(null);
  const [showPrimaryReadDetails, setShowPrimaryReadDetails] = useState(false);
  const [showSecondaryReadDetails, setShowSecondaryReadDetails] = useState(false);

  useEffect(() => {
    setActivePostIndex(0);
    setFallbackImageFailed(false);
  }, [posts.length]);

  useEffect(() => {
    if (posts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActivePostIndex((current) => (current + 1) % posts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [posts.length]);

  useEffect(() => {
    setFallbackImageFailed(false);
  }, [activePostIndex, posts]);

  useEffect(() => {
    if (!descriptionDialog) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDescriptionDialog(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [descriptionDialog]);

  const activePost = posts[activePostIndex] ?? null;
  const registrationFeeTypes = registrationTypes.filter(isRegistrationFeeTier);
  const fallbackTypes = registrationFeeTypes.length > 0 ? registrationFeeTypes : registrationTypes;
  const primaryType = pickRegistrationTier(fallbackTypes, 'self_funded');
  const secondaryType = pickRegistrationTier(fallbackTypes, 'fully_funded', primaryType?.id);
  const primaryDescriptionHtml = toRichHtml(primaryType?.description);
  const secondaryDescriptionHtml = toRichHtml(secondaryType?.description);
  const primaryRequirements = primaryType?.requirements?.length
    ? primaryType.requirements
    : [
        'Complete registration form and documentation',
        'Submit required documents on time',
        'Pay fees according to scheduled payment batches',
      ];
  const secondaryRequirements = secondaryType?.requirements?.length
    ? secondaryType.requirements
    : [
        'Complete registration form and documentation',
        'Submit detailed essays and applications',
        'Participate in interviews and evaluations',
      ];
  const primaryBenefits = primaryType?.benefits ?? [
    'Guaranteed program participation',
    'Faster application processing',
    'You pay all scheduled fee batches yourself',
  ];
  const secondaryBenefits = secondaryType?.benefits ?? [
    'Full reimbursement of all payments',
    'Enhanced program recognition',
    'Access to exclusive fully funded activities',
  ];

  const primaryOpen = currentNow ? isRegistrationOpen(primaryType?.validity_periods, currentNow) : false;
  const secondaryOpen = currentNow ? isRegistrationOpen(secondaryType?.validity_periods, currentNow) : false;

  const displayedGuidelines = (guidelines ?? []).filter((guide) => Boolean(guide.url)).slice(0, 2);

  useEffect(() => {
    const checkOverflow = () => {
      const primaryElement = primaryContentRef.current;
      const secondaryElement = secondaryContentRef.current;

      setShowPrimaryReadDetails(
        Boolean(primaryElement && primaryElement.scrollHeight > primaryElement.clientHeight),
      );
      setShowSecondaryReadDetails(
        Boolean(secondaryElement && secondaryElement.scrollHeight > secondaryElement.clientHeight),
      );
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [primaryDescriptionHtml, secondaryDescriptionHtml, primaryRequirements, secondaryRequirements, primaryBenefits, secondaryBenefits]);

  return (
    <section className={componentsTheme.homeRegistration.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          <div className="flex h-full min-h-0 flex-col gap-4">
            <div className={`${componentsTheme.homeRegistration.instagramCard} flex min-h-0 flex-1 flex-col p-0`}>
              {activePost ? (
                <div className="flex h-full min-h-0 flex-col p-4">
                  {activePost.imageUrl?.trim() && !fallbackImageFailed ? (
                    <a
                      href={activePost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="group block flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 lg:h-full lg:min-h-[420px] lg:aspect-auto">
                        <Image
                          src={activePost.imageUrl}
                          alt={activePost.caption || 'Instagram post'}
                          fill
                          sizes="(min-width: 1280px) 420px, (min-width: 1024px) 34vw, 100vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          unoptimized={activePost.imageUrl.startsWith('http')}
                          onError={() => setFallbackImageFailed(true)}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent p-4">
                          <div className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                            Instagram
                          </div>
                          <p className="mt-3 line-clamp-3 text-sm font-medium text-white">
                            {activePost.caption?.trim() || 'Open this post on Instagram'}
                          </p>
                        </div>
                      </div>
                    </a>
                  ) : (
                    <a
                      href={activePost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-2xl border border-slate-200 bg-white p-6"
                    >
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        Instagram
                      </div>
                      <p className="mt-4 line-clamp-4 text-sm font-medium text-slate-800">
                        {activePost.caption?.trim() || 'Open this post on Instagram'}
                      </p>
                    </a>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {posts.map((post, index) => (
                        <button
                          key={post.id}
                          type="button"
                          aria-label={`Show Instagram post ${index + 1}`}
                          onClick={() => setActivePostIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === activePostIndex ? 'w-7 bg-primary' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                          }`}
                        />
                      ))}
                    </div>
                    <a
                      href={activePost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary/80"
                    >
                      View on Instagram
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[420px] items-center justify-center px-6 text-center text-sm text-slate-500">
                  Instagram feed will appear here once active posts are available.
                </div>
              )}
            </div>

            <div className="grid gap-3">
              {displayedGuidelines.length > 0 ? (
                displayedGuidelines.map((guide, index) => (
                  <a
                    key={guide.id}
                    href={guide.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-4 py-3 text-left transition ${
                      index === 0
                        ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] hover:opacity-95'
                        : 'border-[var(--brand-border)] bg-[var(--brand-accent-soft)] hover:opacity-90'
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-[var(--brand-accent)]" />
                    <div className="min-w-0">
                      <p className="inline-flex items-center rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-accent)]">
                        Guideline
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-900">{guide.title}</p>
                    </div>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[var(--brand-accent)] transition group-hover:bg-[var(--brand-accent-soft)]">
                      <ExternalLink className="h-4 w-4" />
                    </span>
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                  Guidelines will appear here once program resources are published.
                </div>
              )}
            </div>
          </div>

          <div className="flex h-full min-h-0 flex-col space-y-4">
            <div className="space-y-2">
              <p className="text-accent text-xs font-semibold uppercase tracking-wider">
                Registration Types
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
                Choose how you want to join
              </h2>
              <p className="max-w-3xl text-sm text-slate-600 sm:text-base">
                Explore the available registration options and read the guidebook before you apply.
              </p>
            </div>

            <div className="grid flex-1 gap-6 lg:grid-cols-2">
            <div className={componentsTheme.applyRegistrationTypes.card}>
              <div className={componentsTheme.applyRegistrationTypes.headerWrapper}>
                <div className={componentsTheme.applyRegistrationTypes.headerRow}>
                  <div className={componentsTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={componentsTheme.applyRegistrationTypes.iconCircle}>
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={componentsTheme.applyRegistrationTypes.headerTitle}>
                        {primaryType?.name ?? 'Self Funded'}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={
                      primaryOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {primaryOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {primaryType ? `${primaryType.currency} ${primaryType.price}` : '$15.00'}
                  </span>
                  <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                    <span>{getActivePeriodLabel(primaryType?.validity_periods, currentNow ?? new Date(0))}</span>
                </div>
              </div>
              <div className={`${componentsTheme.applyRegistrationTypes.bodyWrapper} flex flex-col`}>
                <div ref={primaryContentRef} className="h-[360px] overflow-hidden">
                  {hasRichTextContent(primaryType?.description) && (
                    <div
                      className="mb-3 prose prose-sm max-w-none text-slate-700 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-a:text-primary"
                      dangerouslySetInnerHTML={{ __html: primaryDescriptionHtml }}
                    />
                  )}
                  <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                  <ul className={componentsTheme.applyRegistrationTypes.list}>
                    {primaryRequirements.map((label, idx) => (
                      <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                        <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>Benefit</p>
                  <ul className={componentsTheme.applyRegistrationTypes.list}>
                    {primaryBenefits.map((label, idx) => (
                      <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                        <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {showPrimaryReadDetails && (
                  <div className="mt-auto pt-3 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary transition hover:text-primary/80"
                      onClick={() =>
                        setDescriptionDialog({
                          title: primaryType?.name ?? 'Self Funded',
                          descriptionHtml: primaryDescriptionHtml,
                          requirements: primaryRequirements,
                          benefits: primaryBenefits,
                          benefitsLabel: 'Benefit',
                        })
                      }
                    >
                      Read details
                    </button>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  {primaryOpen ? (
                    <a
                      href="/apply/self-funded"
                      className={`${componentsTheme.applyRegistrationTypes.ctaButton} ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                    >
                      Register as Self Funded
                    </a>
                  ) : (
                    <button
                      type="button"
                      aria-disabled
                      className="inline-flex w-full max-w-xs cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={componentsTheme.applyRegistrationTypes.card}>
              <div className={componentsTheme.applyRegistrationTypes.headerWrapper}>
                <div className={componentsTheme.applyRegistrationTypes.headerRowTopAligned}>
                  <div className={componentsTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={componentsTheme.applyRegistrationTypes.iconCircle}>
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={componentsTheme.applyRegistrationTypes.headerTitle}>
                        {secondaryType?.name ?? 'Fully Funded'}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={
                      secondaryOpen
                        ? componentsTheme.applyRegistrationTypes.statusBadgeOpen
                        : componentsTheme.applyRegistrationTypes.statusBadgeClosed
                    }
                  >
                    {secondaryOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {secondaryType ? `${secondaryType.currency} ${secondaryType.price}` : '$10.00'}
                  </span>
                  <span className={componentsTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={componentsTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={componentsTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                    <span>{getActivePeriodLabel(secondaryType?.validity_periods, currentNow ?? new Date(0))}</span>
                </div>
              </div>
              <div className={`${componentsTheme.applyRegistrationTypes.bodyWrapper} flex flex-col`}>
                <div ref={secondaryContentRef} className="h-[360px] overflow-hidden">
                  {hasRichTextContent(secondaryType?.description) && (
                    <div
                      className="mb-3 prose prose-sm max-w-none text-slate-700 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-a:text-primary"
                      dangerouslySetInnerHTML={{ __html: secondaryDescriptionHtml }}
                    />
                  )}
                  <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                  <ul className={componentsTheme.applyRegistrationTypes.list}>
                    {secondaryRequirements.map((label, idx) => (
                      <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                        <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                    Benefit (If Selected)
                  </p>
                  <ul className={componentsTheme.applyRegistrationTypes.list}>
                    {secondaryBenefits.map((label, idx) => (
                      <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                        <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                          <Check className="h-3 w-3" />
                        </span>
                        <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {showSecondaryReadDetails && (
                  <div className="mt-auto pt-3 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-primary transition hover:text-primary/80"
                      onClick={() =>
                        setDescriptionDialog({
                          title: secondaryType?.name ?? 'Fully Funded',
                          descriptionHtml: secondaryDescriptionHtml,
                          requirements: secondaryRequirements,
                          benefits: secondaryBenefits,
                          benefitsLabel: 'Benefit (If Selected)',
                        })
                      }
                    >
                      Read details
                    </button>
                  </div>
                )}
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  {secondaryOpen ? (
                    <a
                      href="/apply/fully-funded"
                      className={`${componentsTheme.applyRegistrationTypes.ctaButton} ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                    >
                      Register as Fully Funded
                    </a>
                  ) : (
                    <button
                      type="button"
                      aria-disabled
                      className="inline-flex w-full max-w-xs cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
      {descriptionDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${descriptionDialog.title} details`}
        >
          <div
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm"
            onClick={() => setDescriptionDialog(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">{descriptionDialog.title} Details</h3>
              <button
                type="button"
                onClick={() => setDescriptionDialog(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label="Close details dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              {hasRichTextContent(descriptionDialog.descriptionHtml) && (
                <div
                  className="prose prose-sm mb-4 max-w-none text-slate-700 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: descriptionDialog.descriptionHtml }}
                />
              )}
              <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
              <ul className={componentsTheme.applyRegistrationTypes.list}>
                {descriptionDialog.requirements.map((label, idx) => (
                  <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                    <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                      <Check className="h-3 w-3" />
                    </span>
                    <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                  </li>
                ))}
              </ul>
              <p className={componentsTheme.applyRegistrationTypes.bodySectionSpacer}>
                {descriptionDialog.benefitsLabel}
              </p>
              <ul className={componentsTheme.applyRegistrationTypes.list}>
                {descriptionDialog.benefits.map((label, idx) => (
                  <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                    <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                      <Check className="h-3 w-3" />
                    </span>
                    <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
