// app/refund-policy/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import HeroSection from '@/components/ui/HeroSection';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { resolveBrandDomain } from '@/lib/server/envContext';

// Brand name and support email come from per-host settings, so render per request.
export const dynamic = 'force-dynamic';

const DEFAULT_BRAND_NAME = 'Youth Break the Boundaries';

function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await resolveBrandDomain();
  let brandName = DEFAULT_BRAND_NAME;
  try {
    brandName = text((await getSettingsForBrandDomain(host)).brand?.name) ?? brandName;
  } catch (e) {
    console.error('refund-policy metadata: settings fetch failed', e);
  }
  const title = 'Refund Policy';
  const description = `Refund policy for registration and program fees paid to ${brandName}.`;
  return {
    title,
    description,
    alternates: { canonical: '/refund-policy' },
    openGraph: { title, description, url: '/refund-policy', type: 'website' },
  };
}

export default async function RefundPolicyPage() {
  const host = await resolveBrandDomain();
  const [settingsResult, heroResult] = await Promise.allSettled([
    getSettingsForBrandDomain(host),
    getLandingHeroMedia(host, 'programs', { preferredImages: [], fallbackImage: '/img/programsbackground.png' }),
  ]);

  if (settingsResult.status === 'rejected') console.error('refund-policy: settings fetch failed', settingsResult.reason);
  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
  const heroMedia = heroResult.status === 'fulfilled' ? heroResult.value : {};

  const brandName = text(settings?.brand?.name) ?? DEFAULT_BRAND_NAME;
  const email = text(settings?.brand?.support_email);

  return (
    <main className="bg-slate-50">
      <HeroSection
        title="Refund Policy"
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/refund-policy', label: 'Refund Policy' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-base text-slate-700">
            Registration fees and program fees paid to {brandName} are non-refundable. This applies if you withdraw, are not
            selected, cannot attend, or cannot travel (including visa refusal).
          </p>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Program cancellation</h2>
            <p className="mt-2 text-base text-slate-700">
              If {brandName} cancels the program because of circumstances beyond our control (natural disaster, war,
              epidemic, government restriction or similar), we will contact affected participants about refunding fees paid
              for that program.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">Reimbursements are different from refunds</h2>
            <p className="mt-2 text-base text-slate-700">
              Any reimbursement promised in your program&apos;s funding terms (for example for Fully Funded awardees) is paid
              as described in those terms and is not affected by this policy.
            </p>
          </div>

          <p className="text-base text-slate-700">
            Questions:{' '}
            {email ? (
              <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
                {email}
              </a>
            ) : (
              <Link href="/contact" className="font-medium text-primary hover:underline">
                contact page
              </Link>
            )}
            .
          </p>
        </article>
      </section>
    </main>
  );
}
