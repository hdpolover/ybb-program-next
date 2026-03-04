import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

// Section: Proven Results — impact angka + logo sponsor
export default function ProvenResultsSection() {
  return (
    <section className={componentsTheme.partnersProven.sectionWrapper}>
      <div className={componentsTheme.partnersProven.container}>
        <SectionHeader eyebrow="Impact" title="Proven Results" />
        <p className={componentsTheme.partnersProven.subtitle}>
          Tangible outcomes powered by our partners and sponsors across programs and regions.
        </p>

        <div className={componentsTheme.partnersProven.layout}>
          {/* Left: impact text */}
          <div className={componentsTheme.partnersProven.impactCol}>
            <p className={componentsTheme.partnersProven.impactValue}>630,000+</p>
            <p className={componentsTheme.partnersProven.impactLabel}>
              people directly impacted by funded initiatives
            </p>
          </div>

          {/* Right: card with logos */}
          <div className={componentsTheme.partnersProven.card}>
            <div className={componentsTheme.partnersProven.cardHeader}>
              <h3 className={componentsTheme.partnersProven.cardTitle}>and Our Other Sponsors</h3>
              <p className={componentsTheme.partnersProven.cardSubtitle}>
                Brands and institutions that help make this program possible
              </p>
            </div>

            <div className={componentsTheme.partnersProven.logosGrid}>
              {/* Logo items - using existing assets to simulate real sponsors */}
              <a href="/partners/iys-global" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/kys-education" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Education"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/meys-media-group" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Media Group"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/wys-technology" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Technology"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/yaf-foundation" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/YAFlogo.png"
                  alt="YAF Foundation"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a
                href="/partners/youth-beyond-borders-network"
                className={componentsTheme.partnersProven.logoCard}
              >
                <Image
                  src="/img/jyslogosolo.png"
                  alt="Youth Beyond Borders Network"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/iys-global-partners" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global Partners"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/kys-learning-hub" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Learning Hub"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/meys-broadcasting" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Broadcasting"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/wys-digital-studio" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Digital Studio"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
