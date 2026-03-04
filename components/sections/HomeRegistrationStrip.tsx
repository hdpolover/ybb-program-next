import { MapPin, Calendar, Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { HOME_REGISTRATION_COPY } from '@/data/home/sections/registration/homeRegistration';

type InstagramFeedItem = {
  id: string;
  permalink: string;
  imageUrl: string;
  caption: string;
};

type RegistrationType = {
  id: string;
  name: string;
  price: string;
  currency: string;
  benefits: string[];
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

export default function HomeRegistrationStrip({
  igFeed,
  registrationTypes,
  guidelines,
}: HomeRegistrationStripProps) {
  const primaryPost = igFeed?.[0];
  const primaryType = registrationTypes?.[0];
  const secondaryType = registrationTypes?.[1];

  return (
    <section className={componentsTheme.homeRegistration.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow={HOME_REGISTRATION_COPY.eyebrow}
          title={HOME_REGISTRATION_COPY.title}
        />
        <p className={componentsTheme.homeRegistration.introText}>
          {HOME_REGISTRATION_COPY.introText}
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          {/* Kiri: Instagram feed + tombol guidebook */}
          <div className="flex flex-col gap-4">
            <div className={componentsTheme.homeRegistration.instagramCard}>
              <div className={componentsTheme.homeRegistration.instagramHeader}>
                Official Instagram Feed
              </div>
              <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-slate-100">
                {primaryPost ? (
                  <a
                    href={primaryPost.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full w-full"
                  >
                    <Image
                      src={primaryPost.imageUrl}
                      alt={primaryPost.caption || 'Instagram post'}
                      fill
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </a>
                ) : (
                  <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                    {HOME_REGISTRATION_COPY.instagramFallback}
                  </div>
                )}
              </div>
              <div className={componentsTheme.homeRegistration.instagramFooter}>
                {primaryPost && (
                  <div className="flex w-full flex-col items-center text-center">
                    <p className="mb-1 line-clamp-2 text-xs text-slate-600">
                      {primaryPost.caption}
                    </p>
                    <a
                      href={primaryPost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className={componentsTheme.homeRegistration.instagramLink}
                    >
                      {HOME_REGISTRATION_COPY.instagramCtaLabel}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {guidelines && guidelines.length > 0 ? (
                guidelines.slice(0, 2).map((guide, index) => (
                  <a
                    key={guide.id}
                    href={guide.url}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      index === 0
                        ? componentsTheme.homeRegistration.guidePrimary
                        : componentsTheme.homeRegistration.guideSecondary
                    }
                  >
                    {guide.title}
                  </a>
                ))
              ) : (
                <>
                  <a
                    href={HOME_REGISTRATION_COPY.guidebookFallbackPrimaryHref}
                    className={componentsTheme.homeRegistration.guidePrimary}
                  >
                    {HOME_REGISTRATION_COPY.guidebookFallbackPrimaryLabel}
                  </a>
                  <a
                    href={HOME_REGISTRATION_COPY.guidebookFallbackSecondaryHref}
                    className={componentsTheme.homeRegistration.guideSecondary}
                  >
                    {HOME_REGISTRATION_COPY.guidebookFallbackSecondaryLabel}
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Kanan: kartu Self Funded & Fully Funded */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Self Funded */}
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
                  <span className={componentsTheme.applyRegistrationTypes.statusBadgeOpen}>
                    Open
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {primaryType
                      ? `${primaryType.currency} ${primaryType.price}`
                      : '$15.00'}
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
                  <span>Sep 01 – Dec 31, 2025</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit required documents on time',
                    'Pay fees according to scheduled payment batches',
                  ].map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
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
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  <a
                    href="/apply#self-funded"
                    className={`${componentsTheme.applyRegistrationTypes.ctaButton} ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                  >
                    Register as Self Funded
                  </a>
                </div>
              </div>
            </div>

            {/* Fully Funded */}
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
                  <span className={componentsTheme.applyRegistrationTypes.statusBadgeClosed}>
                    Closed
                  </span>
                </div>
                <div className={componentsTheme.applyRegistrationTypes.feeRow}>
                  <span className={componentsTheme.applyRegistrationTypes.priceText}>
                    {secondaryType
                      ? `${secondaryType.currency} ${secondaryType.price}`
                      : '$10.00'}
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
                  <span>Aug 01 – Sep 30, 2025</span>
                </div>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={componentsTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={componentsTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit detailed essays and applications',
                    'Participate in interviews and evaluations',
                  ].map((label, idx) => (
                    <li key={idx} className={componentsTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
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
                      <span
                        className={`${componentsTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={componentsTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={componentsTheme.applyRegistrationTypes.cardFooter}>
                <div className={componentsTheme.applyRegistrationTypes.ctaWrapper}>
                  <button
                    type="button"
                    aria-disabled
                    className="inline-flex w-full max-w-xs cursor-not-allowed items-center justify-center rounded-md bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
                  >
                    Registration Closed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
