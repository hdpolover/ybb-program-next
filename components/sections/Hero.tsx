import OptimizedImage, { HeroImage } from '@/components/common/OptimizedImage';
import { componentsTheme } from '@/lib/theme/components';

type HeroProps = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
};

export default function Hero({ imageUrl, title }: HeroProps) {
  if (!imageUrl || imageUrl.length === 0) return null;
  const src = imageUrl;
  const alt = title || 'Youth Summit';

  return (
    <section className={componentsTheme.heroHome.sectionWrapper}>
      <div className={componentsTheme.heroHome.mobileWrapper}>
        <HeroImage
          src={src}
          alt={alt}
          width={1920}
          height={600}
          className={componentsTheme.heroHome.mobileImage}
        />
      </div>
      <div
        className={`${componentsTheme.heroHome.desktopWrapper} relative`}
      >
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
      </div>
    </section>
  );
}
