import OptimizedImage, { HeroImage } from '@/components/common/OptimizedImage';
import { componentsTheme } from '@/lib/theme/components';
import { normalizeLandingCtaHref } from '@/lib/landing/cta';

type HeroProps = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  registerUrl?: string;
};

export default function Hero({ imageUrl, title, registerUrl }: HeroProps) {
  if (!imageUrl || imageUrl.length === 0) return null;
  const src = imageUrl;
  const alt = title || 'Youth Summit';
  // registerUrl defaults to '/register' (a route that doesn't exist); route it
  // through the landing CTA normalizer so it lands on signup instead of a 404.
  const ctaHref = normalizeLandingCtaHref(registerUrl);

  return (
    <section className={componentsTheme.heroHome.sectionWrapper}>
      <div className={componentsTheme.heroHome.mobileWrapper}>
        <a href={ctaHref}>
          <HeroImage
            src={src}
            alt={alt}
            width={1920}
            height={600}
            className={componentsTheme.heroHome.mobileImage}
          />
        </a>
      </div>
      <div
        className={`${componentsTheme.heroHome.desktopWrapper} relative`}
      >
        <a href={ctaHref}>
          <OptimizedImage
            src={src}
            alt={alt}
            fill
            type="content"
            customSizes="100vw"
            className="object-cover"
          />
          <div className={componentsTheme.heroHome.desktopOverlay} />
          <div className={componentsTheme.heroHome.desktopInner}></div>
        </a>
      </div>
    </section>
  );
}
