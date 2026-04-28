"use client";

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Check, CreditCard, ExternalLink, MapPin } from 'lucide-react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type InstagramFeedItem = {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
};

type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

type RegistrationType = {
  id: string;
  name: string;
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

function isRegistrationOpen(periods: ValidityPeriod[] | undefined): boolean {
  if (!periods || periods.length === 0) return false;
  const now = new Date();
  return periods.some((p) => new Date(p.start_date) <= now && now <= new Date(p.end_date));
}

function getActivePeriodLabel(periods: ValidityPeriod[] | undefined): string {
  if (!periods || periods.length === 0) return 'TBD';
  const now = new Date();
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  const active = periods.find((p) => new Date(p.start_date) <= now && now <= new Date(p.end_date));
  if (active) return `${fmt(active.start_date)} - ${fmt(active.end_date)}`;
  const upcoming = periods.find((p) => new Date(p.start_date) > now);
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
  const feeType = (tier.fee_type ?? '').toLowerCase();
  return feeType === 'registration_fee' || tier.name.toLowerCase().includes('registration');
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

  const byName = candidates.find((tier) => tier.name.toLowerCase().includes(target === 'self_funded' ? 'self funded' : 'fully funded'));
  if (byName) return byName;

  if (candidates.length === 0) return undefined;

  const toPrice = (tier: RegistrationType) => {
    const value = Number(String(tier.price).replace(/[^0-9.-]/g, ''));
    return Number.isFinite(value) ? value : 0;
  };

  return [...candidates].sort((a, b) => toPrice(a) - toPrice(b))[target === 'self_funded' ? candidates.length - 1 : 0];
}

export default function HomeRegistrationStrip({
  igFeed,
  registrationTypes,
  guidelines,
}: HomeRegistrationStripProps) {
  if (!registrationTypes || registrationTypes.length === 0) return null;

  const posts = useMemo(
    () =>
      (igFeed ?? []).filter(
        (item): item is InstagramFeedItem =>
          Boolean(item?.id && item?.permalink && item?.imageUrl),
      ),
    [igFeed],
  );
  const [activePostIndex, setActivePostIndex] = useState(0);

  useEffect(() => {
    setActivePostIndex(0);
  }, [posts.length]);

  useEffect(() => {
    if (posts.length <= 1) return;

    const timer = window.setInterval(() => {
      setActivePostIndex((current) => (current + 1) % posts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [posts.length]);

  const activePost = posts[activePostIndex] ?? null;
  const registrationFeeTypes = registrationTypes.filter(isRegistrationFeeTier);
  const fallbackTypes = registrationFeeTypes.length > 0 ? registrationFeeTypes : registrationTypes;
  const primaryType = pickRegistrationTier(fallbackTypes, 'self_funded');
  const secondaryType = pickRegistrationTier(fallbackTypes, 'fully_funded', primaryType?.id);

  const primaryOpen = isRegistrationOpen(primaryType?.validity_periods);
  const secondaryOpen = isRegistrationOpen(secondaryType?.validity_periods);

  const displayedGuidelines = (guidelines ?? []).filter((guide) => Boolean(guide.url)).slice(0, 2);

  return (
    <section className={componentsTheme.homeRegistration.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Registration Types"
          title="Choose how you want to join"
        />
        <p className={componentsTheme.homeRegistration.introText}>
          Explore the available registration options and read the guidebook before you apply.
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          <div className="flex flex-col gap-4">
            <div className={`${componentsTheme.homeRegistration.instagramCard} p-0`}>
              {activePost ? (
                <div className="p-4">
                  <a
                    href={activePost.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={activePost.imageUrl}
                        alt={activePost.caption || 'Instagram post'}
                        fill
                        sizes="(min-width: 1280px) 420px, (min-width: 1024px) 34vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized={activePost.imageUrl.startsWith('http')}
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
                    className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
                      index === 0
                        ? 'border-primary/20 bg-primary/[0.04] hover:border-primary/35 hover:bg-primary/[0.06]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Guidebook
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-900">{guide.title}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-primary" />
                  </a>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center text-sm text-slate-500">
                  Guidebooks will appear here once program resources are published.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
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
                      <p className={componentsTheme.applyRegistrationTypes.headerSubtitle}>
                        Standard Registration
                      </p>
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
                  <span>{getActivePeriodLabel(primaryType?.validity_periods)}</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {(primaryType?.requirements?.length
                    ? primaryType.requirements
                    : [
                        'Complete registration form and documentation',
                        'Submit required documents on time',
                        'Pay fees according to scheduled payment batches',
                      ]
                  ).map((label, idx) => (
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
                  {(primaryType?.benefits ?? [
                    'Guaranteed program participation',
                    'Faster application processing',
                    'You pay all scheduled fee batches yourself',
                  ]).map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
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
                      <p className={componentsTheme.applyRegistrationTypes.headerSubtitle}>
                        Reimbursement System
                      </p>
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
                  <span>{getActivePeriodLabel(secondaryType?.validity_periods)}</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {(secondaryType?.requirements?.length
                    ? secondaryType.requirements
                    : [
                        'Complete registration form and documentation',
                        'Submit detailed essays and applications',
                        'Participate in interviews and evaluations',
                      ]
                  ).map((label, idx) => (
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
                  {(secondaryType?.benefits ?? [
                    'Full reimbursement of all payments',
                    'Enhanced program recognition',
                    'Access to exclusive fully funded activities',
                  ]).map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}>
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
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
    </section>
  );
}
