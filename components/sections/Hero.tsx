import Image from 'next/image';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type HeroProps = {
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
};

export default function Hero({ imageUrl, title, subtitle }: HeroProps) {
  const fallbackImage = '/img/bannerjys.png';
  const src = imageUrl && imageUrl.length > 0 ? imageUrl : fallbackImage;
  const alt = title || 'Japan Youth Summit';

  return (
    <section className={jysSectionTheme.heroHome.sectionWrapper}>
      <div className={jysSectionTheme.heroHome.mobileWrapper}>
        <Image
          src={src}
          alt={alt}
          width={1920}
          height={600}
          priority
          sizes="100vw"
          className={jysSectionTheme.heroHome.mobileImage}
        />
      </div>
      <div
        className={jysSectionTheme.heroHome.desktopWrapper}
        style={{ backgroundImage: `url('${src}')` }}
      >
        <div className={jysSectionTheme.heroHome.desktopOverlay} />
        <div className={jysSectionTheme.heroHome.desktopInner}></div>
      </div>
    </section>
  );
}
