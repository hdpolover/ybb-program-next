import { componentsTheme } from '@/lib/theme/components';
import Image from 'next/image';
import { normalizeLandingCtaHref } from '@/lib/landing/cta';

export type PromoCTAProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  videoUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
};

export default function PromoCTA({
  eyebrow = 'Ready to Innovate?',
  title = 'Ready to Innovate? Join Us Now!',
  subtitle = 'Be part of a global community of young leaders and innovators who are creating real impact through international programs.',
  primaryCtaLabel = 'Apply Now',
  primaryCtaHref = '/apply',
  videoUrl,
  videoTitle,
  videoDescription,
}: PromoCTAProps) {
  const resolvedPrimaryCtaHref = normalizeLandingCtaHref(primaryCtaHref);

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

      <div className={componentsTheme.promoCta.glowLeft} />
      <div className={componentsTheme.promoCta.glowRight} />
      <div className={componentsTheme.promoCta.glowBottom} />

      <div className={componentsTheme.promoCta.container}>
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
              href={resolvedPrimaryCtaHref}
              className={componentsTheme.promoCta.primaryButton}
            >
              {primaryCtaLabel}
            </a>
          </div>
        </div>

        {videoUrl ? (
          <div className={componentsTheme.promoCta.rightCol}>
            <div className={componentsTheme.promoCta.videoCard}>
              <div className={componentsTheme.promoCta.videoFrameWrapper}>
                <iframe
                  src={videoUrl}
                  title={videoTitle || 'Program Video'}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              {(videoTitle || videoDescription) && (
                <div className="mt-3">
                  {videoTitle && (
                    <h3 className={componentsTheme.promoCta.videoTitle}>
                      {videoTitle}
                    </h3>
                  )}
                  {videoDescription && (
                    <p className={componentsTheme.promoCta.videoDescription}>
                      {videoDescription}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
