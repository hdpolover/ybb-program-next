import HeroSection from '@/components/ui/HeroSection';
import MainFAQSection from '@/components/faq/MainFAQSection';
import { getFaqsPageData } from '@/lib/api/faqs';
import type { CtaSupportSection, FaqListSection, FaqsHeroSection } from '@/types/faqs';
import { SetPromoCTA } from '@/components/sections/PromoCTAContext';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default async function FaqPage() {
  let faqsPage: Awaited<ReturnType<typeof getFaqsPageData>> | null = null;

  try {
    faqsPage = await getFaqsPageData();
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
    'Find quick answers about the Japan Youth Summit program, registration, and payments.';
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
          <section className={jysSectionTheme.promoCta.sectionWrapper}>
            <div className={jysSectionTheme.promoCta.glowLeft} />
            <div className={jysSectionTheme.promoCta.glowRight} />
            <div className={jysSectionTheme.promoCta.glowBottom} />

            <div className={jysSectionTheme.promoCta.container}>
              <div className={jysSectionTheme.promoCta.leftCol}>
                <p className={jysSectionTheme.promoCta.eyebrow}>Support</p>
                <h2 className={jysSectionTheme.promoCta.title}>{ctaSupportSection.content.title}</h2>
                {ctaSupportSection.content.description ? (
                  <p className={jysSectionTheme.promoCta.subtitle}>
                    {ctaSupportSection.content.description}
                  </p>
                ) : null}
                <div className={jysSectionTheme.promoCta.actionsRow}>
                  <a
                    href={ctaSupportSection.content.action_url}
                    className={jysSectionTheme.promoCta.primaryButton}
                  >
                    {ctaSupportSection.content.button_text || 'Contact Support'}
                  </a>
                </div>
              </div>

              <div className={jysSectionTheme.promoCta.rightCol}>
                <div className={jysSectionTheme.promoCta.videoCard}>
                  <div className={jysSectionTheme.promoCta.videoFrameWrapper}>
                    <iframe
                      src="https://www.youtube.com/embed/tUR55Fi53rM?si=NEHbcyoMTTsFEVV4"
                      title="Japan Youth Summit 2025 Registration Guideline"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className={jysSectionTheme.promoCta.videoTitle}>
                      Japan Youth Summit 2025 Registration Guideline
                    </h3>
                    <p className={jysSectionTheme.promoCta.videoDescription}>
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
