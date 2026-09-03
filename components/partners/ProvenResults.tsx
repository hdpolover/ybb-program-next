import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

// Section: Proven Results — impact angka + logo sponsor.
//
// The figure comes from the platform `impact_stats` row (total_participants),
// carried on the /partners payload. It used to be a hardcoded "630,000+ people
// directly impacted by funded initiatives" — two orders of magnitude above the
// entire users table, describing an outcome the schema does not model at all.
// No fallback: with no curated figure the impact column is dropped and only the
// sponsor logos remain.
export default function ProvenResultsSection({ impactValue }: { impactValue?: string }) {
  return (
    <section className={componentsTheme.partnersProven.sectionWrapper}>
      <div className={componentsTheme.partnersProven.container}>
        <SectionHeader eyebrow="Impact" title="Proven Results" />
        <p className={componentsTheme.partnersProven.subtitle}>
          Tangible outcomes powered by our partners and sponsors across programs and regions.
        </p>

        {/* Without the impact column the two-column split would squeeze the
            logo card into the narrow 0.35fr track, so drop the grid with it. */}
        <div className={impactValue ? componentsTheme.partnersProven.layout : 'mt-10'}>
          {impactValue ? (
            <div className={componentsTheme.partnersProven.impactCol}>
              <p className={componentsTheme.partnersProven.impactValue}>{impactValue}</p>
              <p className={componentsTheme.partnersProven.impactLabel}>
                participants across our programs
              </p>
            </div>
          ) : null}

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
              <Link href="/partners/iys-global" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/kys-education" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Education"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/meys-media-group" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Media Group"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/wys-technology" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Technology"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/yaf-foundation" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/YAFlogo.png"
                  alt="YAF Foundation"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link
                href="/partners/youth-beyond-borders-network"
                className={componentsTheme.partnersProven.logoCard}
              >
                <Image
                  src="/img/ybb-logo.png"
                  alt="Youth Break the Boundaries"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/iys-global-partners" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/IYSlogo.png"
                  alt="IYS Global Partners"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/kys-learning-hub" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/KYSlogo.png"
                  alt="KYS Learning Hub"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/meys-broadcasting" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/MEYSlogo.png"
                  alt="MEYS Broadcasting"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
              <Link href="/partners/wys-digital-studio" className={componentsTheme.partnersProven.logoCard}>
                <Image
                  src="/img/WYSlogo.png"
                  alt="WYS Digital Studio"
                  width={96}
                  height={48}
                  sizes="96px"
                  className={componentsTheme.partnersProven.logoImg}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
