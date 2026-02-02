import { promoCtaContent } from '@/data/home/sections/promo-cta/promoCta';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function PromoCTA() {
  const { eyebrow, title, subtitle, primaryCtaHref, primaryCtaLabel } = promoCtaContent;
  return (
    <section className={jysSectionTheme.promoCta.sectionWrapper}>
      {/* Bentuk buat background */}
      <div className={jysSectionTheme.promoCta.glowLeft} />
      <div className={jysSectionTheme.promoCta.glowRight} />
      <div className={jysSectionTheme.promoCta.glowBottom} />

      <div className={jysSectionTheme.promoCta.container}>
        {/* Isi konten sectionnya */}
        <div className={jysSectionTheme.promoCta.leftCol}>
          {eyebrow && (
            <p className={jysSectionTheme.promoCta.eyebrow}>
              {eyebrow}
            </p>
          )}
          <h2 className={jysSectionTheme.promoCta.title}>
            {title}
          </h2>
          <p className={jysSectionTheme.promoCta.subtitle}>
            {subtitle}
          </p>
          <div className={jysSectionTheme.promoCta.actionsRow}>
            <a
              href={primaryCtaHref}
              className={jysSectionTheme.promoCta.primaryButton}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>

        {/* Kanan: video panduan */}
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
  );
}
