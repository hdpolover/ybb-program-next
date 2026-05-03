import { componentsTheme } from '@/lib/theme/components';
import { normalizeLandingCtaHref } from '@/lib/landing/cta';

export type PromoCTAProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  backgroundImageUrl?: string;
  backgroundImageMobileUrl?: string;
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
  backgroundImageUrl,
  backgroundImageMobileUrl,
  videoUrl,
  videoTitle,
}: PromoCTAProps) {
  const resolvedPrimaryCtaHref = normalizeLandingCtaHref(primaryCtaHref);
  const resolvedDesktopBackground = backgroundImageUrl?.trim() || '/img/ctabekground.png';
  const resolvedMobileBackground =
    backgroundImageMobileUrl?.trim() ||
    backgroundImageUrl?.trim() ||
    '/img/ctabackgroundformobile.png';

  return (
    <section
      className={componentsTheme.promoCta.sectionWrapper}
      style={{ backgroundImage: `url(${resolvedDesktopBackground})` }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: `url(${resolvedMobileBackground})` }}
        aria-hidden="true"
      />

      <div className={componentsTheme.promoCta.glowLeft} />
      <div className={componentsTheme.promoCta.glowRight} />
      <div className={componentsTheme.promoCta.glowBottom} />

      <div className={componentsTheme.promoCta.container}>
        <div className={componentsTheme.promoCta.leftCol}>
          {eyebrow && (
            <p className={`${componentsTheme.promoCta.eyebrow} break-words`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`${componentsTheme.promoCta.title} break-words`}>
            {title}
          </h2>
          <p className={`${componentsTheme.promoCta.subtitle} break-words`}>
            {subtitle}
          </p>
          <div className={componentsTheme.promoCta.actionsRow}>
            <a
              href={resolvedPrimaryCtaHref}
              className={`${componentsTheme.promoCta.primaryButton} max-w-full break-words text-center whitespace-normal`}
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
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
