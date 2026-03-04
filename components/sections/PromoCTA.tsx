import { promoCtaContent } from '@/data/home/sections/promo-cta/promoCta';
import { componentsTheme } from '@/lib/theme/components';
import Image from 'next/image';

export default function PromoCTA() {
  const { eyebrow, title, subtitle, primaryCtaHref, primaryCtaLabel } = promoCtaContent;
  return (
    <section className={componentsTheme.promoCta.sectionWrapper}>
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/img/ctabackgroundformobile.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Bentuk buat background */}
      <div className={componentsTheme.promoCta.glowLeft} />
      <div className={componentsTheme.promoCta.glowRight} />
      <div className={componentsTheme.promoCta.glowBottom} />

      <div className={componentsTheme.promoCta.container}>
        {/* Isi konten sectionnya */}
        <div className={componentsTheme.promoCta.leftCol}>
          {eyebrow && (
            <p className={componentsTheme.promoCta.eyebrow}>
              {eyebrow}
            </p>
          )}
          <h2 className={componentsTheme.promoCta.title}>
            {title}
          </h2>
          <p className={componentsTheme.promoCta.subtitle}>
            {subtitle}
          </p>
          <div className={componentsTheme.promoCta.actionsRow}>
            <a
              href={primaryCtaHref}
              className={componentsTheme.promoCta.primaryButton}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>

        {/* Kanan: video panduan */}
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
  );
}
