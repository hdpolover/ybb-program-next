import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Proven Results — impact angka + logo sponsor
export default function ProvenResultsSection() {
  return (
    <section className={jysSectionTheme.partnersProven.sectionWrapper}>
      <div className={jysSectionTheme.partnersProven.container}>
        <SectionHeader eyebrow="Impact" title="Proven Results" />
        <p className={jysSectionTheme.partnersProven.subtitle}>
          Tangible outcomes powered by our partners and sponsors across programs and regions.
        </p>

        <div className={jysSectionTheme.partnersProven.layout}>
          {/* Left: impact text */}
          <div className={jysSectionTheme.partnersProven.impactCol}>
            <p className={jysSectionTheme.partnersProven.impactValue}>630,000+</p>
            <p className={jysSectionTheme.partnersProven.impactLabel}>
              people directly impacted by funded initiatives
            </p>
          </div>

          {/* Right: card with logos */}
          <div className={jysSectionTheme.partnersProven.card}>
            <div className={jysSectionTheme.partnersProven.cardHeader}>
              <h3 className={jysSectionTheme.partnersProven.cardTitle}>and Our Other Sponsors</h3>
              <p className={jysSectionTheme.partnersProven.cardSubtitle}>
                Brands and institutions that help make this program possible
              </p>
            </div>

            <div className={jysSectionTheme.partnersProven.logosGrid}>
              {/* Logo items - using existing assets to simulate real sponsors */}
              <a href="/partners/iys-global" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/kys-education" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Education"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/meys-media-group" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Media Group"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/wys-technology" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Technology"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/yaf-foundation" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/YAFlogo.png"
                  alt="YAF Foundation"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a
                href="/partners/youth-beyond-borders-network"
                className={jysSectionTheme.partnersProven.logoCard}
              >
                <Image
                  src="/img/jyslogosolo.png"
                  alt="Youth Beyond Borders Network"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/iys-global-partners" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global Partners"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/kys-learning-hub" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Learning Hub"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/meys-broadcasting" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Broadcasting"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
              <a href="/partners/wys-digital-studio" className={jysSectionTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Digital Studio"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={jysSectionTheme.partnersProven.logoImg}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
