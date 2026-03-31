import HeroSection from '@/components/ui/HeroSection';
import MainFAQSection from '@/components/faq/MainFAQSection';
import { getFaqsPageData } from '@/lib/api/faqs';
import { headers } from 'next/headers';
import type { CtaSupportSection, FaqListSection, FaqsHeroSection } from '@/types/faqs';
import { SetPromoCTA } from '@/components/sections/PromoCTAContext';
import { componentsTheme } from '@/lib/theme/components';

export default async function FaqPage() {
  const host = (await headers()).get('host') || '';
  let faqsPage: Awaited<ReturnType<typeof getFaqsPageData>> | null = null;

  try {
    faqsPage = await getFaqsPageData(host);
  } catch (e) {
    console.error('Failed to fetch faqs page data', e);
  }

  const heroSection = faqsPage?.sections.find(
    (section): section is FaqsHeroSection => section.type === 'hero',
  );

  const faqListSection = faqsPage?.sections.find(
    (section): section is FaqListSection => section.type === 'faq_list',
  );

  const ctaSupportSection = faqsPage?.sections.find(
    (section): section is CtaSupportSection => section.type === 'cta_support',
  );

  const heroTitle = heroSection?.content.title ?? 'Frequently Asked Questions';
  const heroSubtitle =
    heroSection?.content.subheadline ??
    'Find quick answers about the program, registration, and payments.';
  const heroBgImage = heroSection?.content.bg_image ?? '/img/faqhero.png';

  return (
    <main className="relative">
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/faq', label: 'FAQ' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />

      {ctaSupportSection?.content.title && ctaSupportSection?.content.action_url ? (
        <SetPromoCTA>
          <section className={componentsTheme.promoCta.sectionWrapper}>
            <div className={componentsTheme.promoCta.glowLeft} />
            <div className={componentsTheme.promoCta.glowRight} />
            <div className={componentsTheme.promoCta.glowBottom} />

            <div className={componentsTheme.promoCta.container}>
              <div className={componentsTheme.promoCta.leftCol}>
                <p className={componentsTheme.promoCta.eyebrow}>Support</p>
                <h2 className={componentsTheme.promoCta.title}>{ctaSupportSection.content.title}</h2>
                {ctaSupportSection.content.description ? (
                  <p className={componentsTheme.promoCta.subtitle}>
                    {ctaSupportSection.content.description}
                  </p>
                ) : null}
                <div className={componentsTheme.promoCta.actionsRow}>
                  <a
                    href={ctaSupportSection.content.action_url}
                    className={componentsTheme.promoCta.primaryButton}
                  >
                    {ctaSupportSection.content.button_text || 'Contact Support'}
                  </a>
                </div>
              </div>

              <div className={componentsTheme.promoCta.rightCol}>
                <div className={componentsTheme.promoCta.videoCard}>
                  <div className={componentsTheme.promoCta.videoFrameWrapper}>
                    <iframe
                      src="https://www.youtube.com/embed/tUR55Fi53rM?si=NEHbcyoMTTsFEVV4"
                      title="Japan Youth Summit 2025 Registration Guideline"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className={componentsTheme.promoCta.videoTitle}>
                      Japan Youth Summit 2025 Registration Guideline
                    </h3>
                    <p className={componentsTheme.promoCta.videoDescription}>
                      Watch this short walkthrough to understand the step-by-step registration flow,
                      required documents, and key deadlines before you submit your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SetPromoCTA>
      ) : null}

      <MainFAQSection
        title={heroTitle}
        subtitle={heroSubtitle}
        items={faqListSection?.content.items}
      />
    </main>
  );
}
