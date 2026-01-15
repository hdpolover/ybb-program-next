import { MapPin, Calendar, Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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
  const primaryGuide = guidelines?.[0];

  return (
    <section className={jysSectionTheme.homeRegistration.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Registration Types" title="Choose how you want to join" />
        <p className={jysSectionTheme.homeRegistration.introText}>
          Explore the available registration options and read the guidebook before you apply.
        </p>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.7fr)]">
          {/* Kiri: Instagram feed + guidebook buttons */}
          <div className="flex flex-col gap-4">
            <div className={jysSectionTheme.homeRegistration.instagramCard}>
              <div className={jysSectionTheme.homeRegistration.instagramHeader}>
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
                    Instagram feed will appear here once available.
                  </div>
                )}
              </div>
              <div className={jysSectionTheme.homeRegistration.instagramFooter}>
                {primaryPost && (
                  <div className="flex w-full flex-col items-center text-center">
                    <p className="mb-1 line-clamp-2 text-xs text-slate-600">
                      {primaryPost.caption}
                    </p>
                    <a
                      href={primaryPost.permalink}
                      target="_blank"
                      rel="noreferrer"
                      className={jysSectionTheme.homeRegistration.instagramLink}
                    >
                      View post on Instagram
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={primaryGuide?.url ?? '#guidebook-en'}
                target={primaryGuide ? '_blank' : undefined}
                rel={primaryGuide ? 'noreferrer' : undefined}
                className={jysSectionTheme.homeRegistration.guidePrimary}
              >
                Read Guidebook (Eng)
              </a>
              <a
                href={primaryGuide?.url ?? '#guidebook-id'}
                target={primaryGuide ? '_blank' : undefined}
                rel={primaryGuide ? 'noreferrer' : undefined}
                className={jysSectionTheme.homeRegistration.guideSecondary}
              >
                Read Guidebook (Ind)
              </a>
            </div>
          </div>

          {/* Kanan: kartu Self Funded & Fully Funded */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Self Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className={jysSectionTheme.applyRegistrationTypes.headerWrapper}>
                <div className={jysSectionTheme.applyRegistrationTypes.headerRow}>
                  <div className={jysSectionTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={jysSectionTheme.applyRegistrationTypes.headerTitle}>
                        {primaryType?.name ?? 'Self Funded'}
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Standard Registration
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeOpen}>
                    Open
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>
                    {primaryType
                      ? `${primaryType.currency} ${primaryType.price}`
                      : '$15.00'}
                  </span>
                  <span className={jysSectionTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={jysSectionTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                  <span>Sep 01 – Dec 31, 2025</span>
                </div>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={jysSectionTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit required documents on time',
                    'Pay fees according to scheduled payment batches',
                  ].map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
                <p className={jysSectionTheme.applyRegistrationTypes.bodySectionSpacer}>Benefit</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {(primaryType?.benefits ?? [
                    'Guaranteed program participation',
                    'Faster application processing',
                    'You pay all scheduled fee batches yourself',
                  ]).map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.cardFooter}>
                <div className={jysSectionTheme.applyRegistrationTypes.ctaWrapper}>
                  <a
                    href="/apply#self-funded"
                    className={`${jysSectionTheme.applyRegistrationTypes.ctaButton} ${jysSectionTheme.applyRegistrationTypes.ctaButtonWide}`}
                  >
                    Register as Self Funded
                  </a>
                </div>
              </div>
            </div>

            {/* Fully Funded */}
            <div className={jysSectionTheme.applyRegistrationTypes.card}>
              <div className={jysSectionTheme.applyRegistrationTypes.headerWrapper}>
                <div className={jysSectionTheme.applyRegistrationTypes.headerRowTopAligned}>
                  <div className={jysSectionTheme.applyRegistrationTypes.headerTitleRow}>
                    <span className={jysSectionTheme.applyRegistrationTypes.iconCircle}>
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className={jysSectionTheme.applyRegistrationTypes.headerTitle}>
                        {secondaryType?.name ?? 'Fully Funded'}
                      </h3>
                      <p className={jysSectionTheme.applyRegistrationTypes.headerSubtitle}>
                        Reimbursement System
                      </p>
                    </div>
                  </div>
                  <span className={jysSectionTheme.applyRegistrationTypes.statusBadgeClosed}>
                    Closed
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.feeRow}>
                  <span className={jysSectionTheme.applyRegistrationTypes.priceText}>
                    {secondaryType
                      ? `${secondaryType.currency} ${secondaryType.price}`
                      : '$10.00'}
                  </span>
                  <span className={jysSectionTheme.applyRegistrationTypes.feeLabel}>
                    Registration Fee
                  </span>
                </div>
                <div className={jysSectionTheme.applyRegistrationTypes.periodRow}>
                  <Calendar className={jysSectionTheme.applyRegistrationTypes.calendarIcon} />
                  <span className={jysSectionTheme.applyRegistrationTypes.periodLabel}>
                    Registration Period:
                  </span>
                  <span>Aug 01 – Sep 30, 2025</span>
                </div>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.bodyWrapper}>
                <p className={jysSectionTheme.applyRegistrationTypes.sectionLabel}>Requirements</p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {[
                    'Complete registration form and documentation',
                    'Submit detailed essays and applications',
                    'Participate in interviews and evaluations',
                  ].map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
                <p className={jysSectionTheme.applyRegistrationTypes.bodySectionSpacer}>
                  Benefit (If Selected)
                </p>
                <ul className={jysSectionTheme.applyRegistrationTypes.list}>
                  {(secondaryType?.benefits ?? [
                    'Full reimbursement of all payments',
                    'Enhanced program recognition',
                    'Access to exclusive fully funded activities',
                  ]).map((label, idx) => (
                    <li key={idx} className={jysSectionTheme.applyRegistrationTypes.listItemRow}>
                      <span
                        className={`${jysSectionTheme.applyRegistrationTypes.bulletCircle} shrink-0`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className={jysSectionTheme.applyRegistrationTypes.listItemText}>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={jysSectionTheme.applyRegistrationTypes.cardFooter}>
                <div className={jysSectionTheme.applyRegistrationTypes.ctaWrapper}>
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
