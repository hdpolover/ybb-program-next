import Image from 'next/image';
import { jysSectionTheme } from '@/lib/theme/jys-components';
export default function Hero() {
  return (
    <section className={jysSectionTheme.heroHome.sectionWrapper}>
      <div className={jysSectionTheme.heroHome.mobileWrapper}>
        <Image
          src="/img/bannerjys.png"
          alt="Japan Youth Summit"
          width={1920}
          height={600}
          priority
          sizes="100vw"
          className={jysSectionTheme.heroHome.mobileImage}
        />
      </div>
      <div
        className={jysSectionTheme.heroHome.desktopWrapper}
        style={{ backgroundImage: "url('/img/bannerjys.png')" }}
      >
        <div className={jysSectionTheme.heroHome.desktopOverlay} />
        <div className={jysSectionTheme.heroHome.desktopInner}></div>
      </div>
    </section>
  );
}
