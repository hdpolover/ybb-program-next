// app/fees/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroSection from '@/components/ui/HeroSection';
import { getProgramsPageData, getPublicPaymentMethods } from '@/lib/api/programs';
import { collectPaymentMethods, formatPaymentMethodType } from '@/lib/payments/publicMethods';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { resolveBrandDomain } from '@/lib/server/envContext';
import { toRichTextHtml } from '@/lib/content/richText';
import { componentsTheme } from '@/lib/theme/components';
import { pickDefaultEditionIndex } from '@/lib/registration/edition';
import { getRegistrationDatesDisplay, getRegistrationPeriodLabel } from '@/lib/format/registration-period';
import {
  getEditionRegistrationPhase,
  isRegistrationFeeTier,
  normalizeValidityPeriods,
} from '@/lib/registration/isRegistrationOpen';
import type { RegistrationInfoSection } from '@/types/programs';
import type { RegistrationProgramEdition, RegistrationType } from '@/types/home';
import type { SettingsData } from '@/types/settings';

// Always render per request: tier windows and the Open/Closed badge are time-dependent.
export const dynamic = 'force-dynamic';

const DEFAULT_BRAND_NAME = 'Youth Break the Boundaries';
const REFUND_POLICY_LABEL = 'Refund Policy';
const SIGNUP_HREF = '/login?mode=signup';
const CATEGORY_LABELS: Record<string, string> = {
  self_funded: 'Self funded',
  fully_funded: 'Fully funded',
};
const PAYMENT_STEPS = [
  { title: 'Register', text: 'Create your account and choose your registration category.' },
  { title: 'Pay the registration fee', text: 'The registration fee is paid online from your dashboard before you can submit.' },
  { title: 'Submit your application', text: 'Complete the application form and submit it once the registration fee is paid.' },
  { title: 'Pay the program fee', text: 'Program fees are paid from your dashboard according to the payment schedule shown below.' },
];

type EditionView = {
  key: string;
  name: string;
  slug: string | null;
  status: 'open' | 'closed';
  dates: RegistrationProgramEdition['registration_dates'] | null;
  tiers: RegistrationType[];
};

function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function formatPrice(tier: RegistrationType): string {
  return `${tier.currency ?? ''} ${tier.price ?? ''}`.trim();
}

function toEditionViews(section: RegistrationInfoSection | undefined): EditionView[] {
  const content = section?.content;
  if (!content) return [];

  const programs = content.programs ?? [];
  if (programs.length > 0) {
    const open = programs.filter((p) => p.status === 'open');
    // Nothing open: show the same default edition /apply would, rather than an empty page.
    const shown = open.length > 0 ? open : [programs[pickDefaultEditionIndex(programs)]];
    return shown.map((p) => ({
      key: p.program_id,
      name: p.program_name,
      slug: p.program_slug,
      status: p.status,
      dates: p.registration_dates,
      tiers: p.registration_types,
    }));
  }

  return [
    {
      key: 'current',
      name: content.title,
      slug: null,
      status: content.status === 'open' ? 'open' : 'closed',
      dates: content.registration_dates,
      tiers: content.pricing_tiers,
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await resolveBrandDomain();
  let brandName = DEFAULT_BRAND_NAME;
  try {
    brandName = text((await getSettingsForBrandDomain(host)).brand?.name) ?? brandName;
  } catch (e) {
    console.error('fees metadata: settings fetch failed', e);
  }
  const title = 'Fees & Payment';
  const description = `Registration fee, program fees, accepted payment and how paying works for ${brandName}.`;
  return {
    title,
    description,
    alternates: { canonical: '/fees' },
    openGraph: { title, description, url: '/fees', type: 'website' },
  };
}

function TierRow({ tier, dates }: { tier: RegistrationType; dates: EditionView['dates'] }) {
  const periodLabel = getRegistrationPeriodLabel(normalizeValidityPeriods(tier, dates));
  const descriptionHtml = toRichTextHtml(tier.description);
  const categories = (tier.allowed_categories ?? []).map((c) => CATEGORY_LABELS[c] ?? c);

  return (
    <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-base font-semibold text-slate-900">{tier.name}</h4>
        <span className={componentsTheme.applyRegistrationTypes.priceText}>{formatPrice(tier)}</span>
      </div>
      {categories.length > 0 ? (
        <p className="mt-1 text-xs font-medium text-slate-500">For: {categories.join(', ')}</p>
      ) : null}
      {periodLabel !== 'TBD' ? (
        <p className="mt-1 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Payment window:</span> {periodLabel}
        </p>
      ) : null}
      {descriptionHtml ? (
        <div
          className="mt-2 text-sm text-slate-700 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : null}
      {tier.benefits?.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {tier.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function TierGroup({ title, tiers, dates }: { title: string; tiers: RegistrationType[]; dates: EditionView['dates'] }) {
  if (tiers.length === 0) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      <ul className="mt-3 space-y-3">
        {tiers.map((tier) => (
          <TierRow key={tier.id} tier={tier} dates={dates} />
        ))}
      </ul>
    </div>
  );
}

function pickLegalLinks(settings: SettingsData | null) {
  const section = (settings?.footer_navigation ?? []).find((s) => s.title.toLowerCase() === 'legal');
  return (section?.links ?? []).filter((link) => text(link.label) && text(link.url));
}

export default async function FeesPage() {
  const host = await resolveBrandDomain();
  const [programsResult, settingsResult, heroResult, methodsResult] = await Promise.allSettled([
    getProgramsPageData(host),
    getSettingsForBrandDomain(host),
    getLandingHeroMedia(host, 'programs', { preferredImages: [], fallbackImage: '/img/programsbackground.png' }),
    getPublicPaymentMethods(host),
  ]);

  if (programsResult.status === 'rejected') console.error('fees: programs fetch failed', programsResult.reason);
  if (methodsResult.status === 'rejected') console.error('fees: payment methods fetch failed', methodsResult.reason);
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
  const heroMedia = heroResult.status === 'fulfilled' ? heroResult.value : {};

  const section =
    programsResult.status === 'fulfilled'
      ? programsResult.value.sections.find((s): s is RegistrationInfoSection => s.type === 'registration_info')
      : undefined;
  const editions = toEditionViews(section);
  const instructions = section?.content.instructions ?? [];
  const paymentMethods = collectPaymentMethods(
    methodsResult.status === 'fulfilled' ? methodsResult.value : null,
    editions.map((e) => e.key),
  );

  const brandName = text(settings?.brand?.name) ?? DEFAULT_BRAND_NAME;
  const email = text(settings?.brand?.support_email);
  const legalLinks = pickLegalLinks(settings);
  const now = new Date();

  return (
    <main className="bg-slate-50">
      <HeroSection
        title="Fees & Payment"
        subtitle={`What it costs to join ${brandName}, and how payment works.`}
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/fees', label: 'Fees & Payment' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      <section className="mx-auto max-w-5xl space-y-8 px-6 py-12 lg:px-8 lg:py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">How payment works</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {PAYMENT_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className={componentsTheme.applyRegistrationTypes.bulletCircle}>{index + 1}</span>
                <div>
                  <p className="font-semibold text-slate-900">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {editions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Fees</h2>
            <p className="mt-2 text-sm text-slate-600">
              Fee details are not available right now. Please check back shortly
              {email ? (
                <>
                  {' '}or write to{' '}
                  <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                    {email}
                  </a>
                </>
              ) : (
                <>
                  {' '}or visit our{' '}
                  <Link href="/contact" className="font-medium text-primary hover:underline">
                    contact page
                  </Link>
                </>
              )}
              .
            </p>
          </div>
        ) : (
          editions.map((edition) => {
            const phase = getEditionRegistrationPhase(edition.tiers, edition.dates, now);
            const registrationTiers = edition.tiers.filter((t) => isRegistrationFeeTier(t));
            const programTiers = edition.tiers.filter((t) => !isRegistrationFeeTier(t));
            const datesLabel = getRegistrationDatesDisplay(edition.dates).label;
            const ctaHref = edition.slug ? `${SIGNUP_HREF}&programSlug=${encodeURIComponent(edition.slug)}` : SIGNUP_HREF;

            return (
              <article key={edition.key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900">{edition.name}</h2>
                  <span className={componentsTheme.applyRegistrationTypes.statusBadgeByPhase[phase]}>
                    Registration {componentsTheme.applyRegistrationTypes.statusLabelByPhase[phase].toLowerCase()}
                  </span>
                </div>
                {datesLabel !== 'TBD' ? (
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-700">Registration period:</span> {datesLabel}
                  </p>
                ) : null}

                <TierGroup title="Registration fee" tiers={registrationTiers} dates={edition.dates} />
                <TierGroup title="Program fee" tiers={programTiers} dates={edition.dates} />

                {edition.tiers.length === 0 ? (
                  <p className="mt-4 text-sm text-slate-600">Fees for this program have not been published yet.</p>
                ) : null}

                {phase === 'open' ? (
                  <div className="mt-6">
                    <Link
                      href={ctaHref}
                      className={`${componentsTheme.applyRegistrationTypes.ctaButton} ${componentsTheme.applyRegistrationTypes.ctaButtonWide}`}
                    >
                      Register now
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })
        )}

        {instructions.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Payment notes</h2>
            <dl className="mt-4 space-y-3">
              {instructions.map((item) => (
                <div key={item.title}>
                  <dt className="text-sm font-semibold text-slate-900">{item.title}</dt>
                  <dd className="text-sm text-slate-600">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Accepted payment methods</h2>
          {paymentMethods.length > 0 ? (
            <>
              <p className="mt-2 text-sm text-slate-600">
                Payments are made online from your participant dashboard. These methods are accepted for current
                programs; the ones available to you are confirmed on the invoice before you pay.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((method) => (
                  <li
                    key={`${method.name}|${method.type}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    {method.logo_url ? (
                      <Image
                        src={method.logo_url}
                        alt=""
                        width={40}
                        height={40}
                        unoptimized
                        className="h-10 w-10 shrink-0 rounded-md bg-white object-contain"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{method.name}</p>
                      <p className="text-xs text-slate-500">{formatPaymentMethodType(method.type)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-600">
              Payments are made online from your participant dashboard. The payment methods available for your program are
              shown on your invoice before you pay.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Refunds, terms and support</h2>
          <p className="mt-2 text-sm text-slate-600">Refund and payment conditions are set out in our policies.</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li>
              <Link href="/refund-policy" className="font-medium text-primary hover:underline">
                {REFUND_POLICY_LABEL}
              </Link>
            </li>
            {legalLinks
              .filter((link) => link.label.trim().toLowerCase() !== REFUND_POLICY_LABEL.toLowerCase())
              .map((link) => (
                <li key={link.label}>
                  <a href={link.url} className="font-medium text-primary hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            {email ? (
              <>
                Payment questions:{' '}
                <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                  {email}
                </a>
                .{' '}
              </>
            ) : null}
            See also our{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              contact page
            </Link>{' '}
            and{' '}
            <Link href="/faq" className="font-medium text-primary hover:underline">
              FAQ
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
