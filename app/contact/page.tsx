import HeroSection from '@/components/ui/HeroSection';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { resolveBrandDomain } from '@/lib/server/envContext';

type ContactLink = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

function normalizeText(value: string | null | undefined): string | null {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function buildWhatsappHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : null;
}

export default async function ContactPage() {
  const host = await resolveBrandDomain();

  const [settingsResult, heroMediaResult] = await Promise.allSettled([
    getSettingsForBrandDomain(host),
    getLandingHeroMedia(host, 'contact', {
      fallbackImage: '/img/faqhero.png',
    }),
  ]);

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
  const heroMedia = heroMediaResult.status === 'fulfilled' ? heroMediaResult.value : {};

  const brand = settings?.brand;
  const brandName = normalizeText(brand?.name) ?? 'Youth Break the Boundaries';
  const email = normalizeText(brand?.support_email);
  const phone = normalizeText(brand?.contact_phone);
  const whatsapp = normalizeText(brand?.contact_whatsapp);
  const address = normalizeText(brand?.address);

  const contactLinks: ContactLink[] = [
    ...(email ? [{ id: 'email', label: 'Email', value: email, href: `mailto:${email}` }] : []),
    ...(phone ? [{ id: 'phone', label: 'Phone', value: phone, href: `tel:${phone}` }] : []),
    ...(whatsapp
      ? [
          {
            id: 'whatsapp',
            label: 'WhatsApp',
            value: whatsapp,
            href: buildWhatsappHref(whatsapp) ?? undefined,
          },
        ]
      : []),
    ...(address
      ? [
          {
            id: 'address',
            label: 'Address',
            value: address,
            href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
          },
        ]
      : []),
  ];

  const socialLinks = [
    { label: 'Instagram', url: normalizeText(brand?.social_media?.instagram) },
    { label: 'TikTok', url: normalizeText(brand?.social_media?.tiktok) },
    { label: 'YouTube', url: normalizeText(brand?.social_media?.youtube) },
    { label: 'Telegram', url: normalizeText(brand?.social_media?.telegram) },
  ].filter((item): item is { label: string; url: string } => Boolean(item.url));

  return (
    <main className="bg-slate-50">
      <HeroSection
        title={`Contact ${brandName}`}
        subtitle="Reach our team for registration support, technical help, and general inquiries."
        bgImage={heroMedia.bgImage ?? '/img/faqhero.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/contact', label: 'Contact' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Get in touch</h2>
            <p className="mt-2 text-sm text-slate-600">
              All contact information below is loaded from the active brand settings in the backend.
            </p>

            {contactLinks.length > 0 ? (
              <dl className="mt-6 space-y-4">
                {contactLinks.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-slate-800">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-medium text-primary hover:underline"
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 text-sm text-slate-600">
                Contact information is not configured yet for this brand.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Social channels</h2>
            <p className="mt-2 text-sm text-slate-600">
              Follow our official accounts for announcements and program updates.
            </p>

            {socialLinks.length > 0 ? (
              <ul className="mt-6 space-y-3">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-100"
                    >
                      <span>{social.label}</span>
                      <span className="text-xs text-slate-500">Open</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-slate-600">
                Social channels are not available for this brand yet.
              </p>
            )}

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Need quick answers first? Check our <a href="/faq" className="font-semibold text-primary hover:underline">FAQ</a> page.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
