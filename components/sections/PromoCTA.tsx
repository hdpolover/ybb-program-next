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
  /** 'dark' = dark text (default); 'light' = white text for dark/vivid backgrounds */
  textColorScheme?: 'light' | 'dark';
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
  textColorScheme = 'dark',
}: PromoCTAProps) {
  const resolvedPrimaryCtaHref = normalizeLandingCtaHref(primaryCtaHref);
  const resolvedDesktopBackground = backgroundImageUrl?.trim() || undefined;
  const resolvedMobileBackground =
    backgroundImageMobileUrl?.trim() ||
    backgroundImageUrl?.trim() ||
    undefined;

  const eyebrowCls = textColorScheme === 'light'
    ? 'text-white/80'
    : componentsTheme.promoCta.eyebrow.replace(/text-\S+/g, '').trim() + ' text-slate-700';
  const titleCls = textColorScheme === 'light' ? 'text-white' : 'text-slate-900';
  const subtitleCls = textColorScheme === 'light' ? 'text-white/70' : 'text-slate-700';

  return (
    <section
      className={componentsTheme.promoCta.sectionWrapper}
      style={resolvedDesktopBackground ? { backgroundImage: `url(${resolvedDesktopBackground})` } : undefined}
    >
      {resolvedMobileBackground && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
          style={{ backgroundImage: `url(${resolvedMobileBackground})` }}
          aria-hidden="true"
        />
      )}

      <div className={componentsTheme.promoCta.glowLeft} />
      <div className={componentsTheme.promoCta.glowRight} />
      <div className={componentsTheme.promoCta.glowBottom} />

      <div className={componentsTheme.promoCta.container}>
        <div className={componentsTheme.promoCta.leftCol}>
          {eyebrow && (
            <p className={`text-sm font-semibold uppercase tracking-[0.18em] break-words ${eyebrowCls}`}>
              {eyebrow}
            </p>
          )}
          <h2 className={`text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl break-words ${titleCls}`}>
            {title}
          </h2>
          <p className={`mt-4 max-w-xl break-words ${subtitleCls}`}>
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
