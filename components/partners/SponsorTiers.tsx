import Image from 'next/image';
import { Gem, Trophy, Medal } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Sponsor Tiers — kartu detail
export default function SponsorTiersSection() {
  return (
    <section className={jysSectionTheme.partnersSponsorTiers.sectionWrapper}>
      <div className={jysSectionTheme.partnersSponsorTiers.container}>
        <SectionHeader eyebrow="Our Sponsors" title="Sponsor Tiers" />
        <div className={jysSectionTheme.partnersSponsorTiers.tiersGrid}>
          {/* Detail Diamond */}
          <a
            href="/partners/global-innovation-foundation"
            className={jysSectionTheme.partnersSponsorTiers.diamondCard}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={jysSectionTheme.partnersSponsorTiers.diamondIconCircle}>
                <Gem className="h-5 w-5" />
              </span>
              <span className={jysSectionTheme.partnersSponsorTiers.diamondLabel}>
                Diamond Sponsor
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src="/img/IYSlogo.png"
                alt="Global Innovation Foundation logo"
                width={36}
                height={36}
                sizes="36px"
                className={jysSectionTheme.partnersSponsorTiers.diamondLogoImg}
              />
              <h3 className={jysSectionTheme.partnersSponsorTiers.diamondTitle}>
                Global Innovation Foundation
              </h3>
            </div>
            <p className={jysSectionTheme.partnersSponsorTiers.mutedMeta}>Partner since 2020</p>
            <p className={jysSectionTheme.partnersSponsorTiers.bodyText}>
              Contribution: Primary Program Funding & Strategic Partnership
            </p>
            <p className={jysSectionTheme.partnersSponsorTiers.bodyText}>
              Leading global foundation supporting youth innovation and entrepreneurship worldwide
              through comprehensive funding and mentorship programs.
            </p>
          </a>

          {/* Detail Gold */}
          <div className={jysSectionTheme.partnersSponsorTiers.goldCard}>
            <div className="mb-3 flex items-center gap-2">
              <span className={jysSectionTheme.partnersSponsorTiers.goldIconCircle}>
                <Trophy className="h-5 w-5" />
              </span>
              <span className={jysSectionTheme.partnersSponsorTiers.goldLabel}>Gold Sponsor</span>
            </div>
            <div className={jysSectionTheme.partnersSponsorTiers.goldOrgWrapper}>
              <a
                href="/partners/future-leaders-institute"
                className={jysSectionTheme.partnersSponsorTiers.goldOrgCard}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/KYSlogo.png"
                    alt="Future Leaders Institute logo"
                    width={32}
                    height={32}
                    sizes="32px"
                    className={jysSectionTheme.partnersSponsorTiers.goldLogoImg}
                  />
                  <h3 className={jysSectionTheme.partnersSponsorTiers.goldOrgTitle}>
                    Future Leaders Institute
                  </h3>
                </div>
                <p className={jysSectionTheme.partnersSponsorTiers.goldOrgMeta}>
                  Partner since 2021
                </p>
                <p className={jysSectionTheme.partnersSponsorTiers.goldOrgBody}>
                  Scholarship Fund & Training Programs
                </p>
              </a>
              <a
                href="/partners/international-development-bank"
                className={jysSectionTheme.partnersSponsorTiers.goldOrgCard}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/MEYSlogo.png"
                    alt="International Development Bank logo"
                    width={32}
                    height={32}
                    sizes="32px"
                    className={jysSectionTheme.partnersSponsorTiers.goldLogoImg}
                  />
                  <h3 className={jysSectionTheme.partnersSponsorTiers.goldOrgTitle}>
                    International Development Bank
                  </h3>
                </div>
                <p className={jysSectionTheme.partnersSponsorTiers.goldOrgMeta}>
                  Partner since 2021
                </p>
                <p className={jysSectionTheme.partnersSponsorTiers.goldOrgBody}>
                  Workshop Facilities & Technology Infrastructure
                </p>
              </a>
            </div>
          </div>

          {/* Detail Silver */}
          <div className={jysSectionTheme.partnersSponsorTiers.silverCard}>
            <div className="mb-3 flex items-center gap-2">
              <span className={jysSectionTheme.partnersSponsorTiers.silverIconCircle}>
                <Medal className="h-5 w-5" />
              </span>
              <span className={jysSectionTheme.partnersSponsorTiers.silverLabel}>
                Silver Sponsors
              </span>
            </div>
            <div className={jysSectionTheme.partnersSponsorTiers.silverGrid}>
              <a
                href="/partners/techcorp-solutions"
                className={jysSectionTheme.partnersSponsorTiers.silverOrgCard}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/WYSlogo.png"
                    alt="TechCorp Solutions logo"
                    width={28}
                    height={28}
                    sizes="28px"
                    className={jysSectionTheme.partnersSponsorTiers.silverLogoImg}
                  />
                  <p className={jysSectionTheme.partnersSponsorTiers.silverOrgName}>
                    TechCorp Solutions
                  </p>
                </div>
                <p className={jysSectionTheme.partnersSponsorTiers.silverOrgDesc}>
                  Technology Support
                </p>
              </a>
              <a
                href="/partners/education-partners-ltd"
                className={jysSectionTheme.partnersSponsorTiers.silverOrgCard}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/YAFlogo.png"
                    alt="Education Partners Ltd logo"
                    width={28}
                    height={28}
                    sizes="28px"
                    className={jysSectionTheme.partnersSponsorTiers.silverLogoImg}
                  />
                  <p className={jysSectionTheme.partnersSponsorTiers.silverOrgName}>
                    Education Partners Ltd
                  </p>
                </div>
                <p className={jysSectionTheme.partnersSponsorTiers.silverOrgDesc}>
                  Educational Resources
                </p>
              </a>
              <a
                href="/partners/youth-development-network"
                className={jysSectionTheme.partnersSponsorTiers.silverOrgCardWide}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/jyslogosolo.png"
                    alt="Youth Development Network logo"
                    width={28}
                    height={28}
                    sizes="28px"
                    className={jysSectionTheme.partnersSponsorTiers.silverLogoImg}
                  />
                  <p className={jysSectionTheme.partnersSponsorTiers.silverOrgName}>
                    Youth Development Network
                  </p>
                </div>
                <p className={jysSectionTheme.partnersSponsorTiers.silverOrgDesc}>
                  Networking & Mentorship
                </p>
              </a>
            </div>
          </div>
        </div>

        {/* Other sponsors grid */}
        <div className={jysSectionTheme.partnersSponsorTiers.othersCard}>
          <div className={jysSectionTheme.partnersSponsorTiers.othersHeader}>
            <h3 className={jysSectionTheme.partnersSponsorTiers.othersTitle}>
              and Our Other Sponsor
            </h3>
            <p className={jysSectionTheme.partnersSponsorTiers.othersSubtitle}>
              Brands and institutions that help make this program possible
            </p>
          </div>
          <div className={jysSectionTheme.partnersSponsorTiers.othersGrid}>
            {/* Logo items - using existing assets to simulate real sponsors */}
            <a
              href="/partners/iys-global"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/IYSlogo.png"
                alt="IYS Global"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/kys-education"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/KYSlogo.png"
                alt="KYS Education"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/meys-media-group"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/MEYSlogo.png"
                alt="MEYS Media Group"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/wys-technology"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/WYSlogo.png"
                alt="WYS Technology"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/yaf-foundation"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/YAFlogo.png"
                alt="YAF Foundation"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/youth-beyond-borders-network"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/jyslogosolo.png"
                alt="Youth Beyond Borders Network"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/iys-global-partners"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/IYSlogo.png"
                alt="IYS Global Partners"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/kys-learning-hub"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/KYSlogo.png"
                alt="KYS Learning Hub"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/meys-broadcasting"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/MEYSlogo.png"
                alt="MEYS Broadcasting"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
            <a
              href="/partners/wys-digital-studio"
              className={jysSectionTheme.partnersSponsorTiers.othersLogoCard}
            >
              <Image
                src="/img/WYSlogo.png"
                alt="WYS Digital Studio"
                width={96}
                height={48}
                sizes="96px"
                className={jysSectionTheme.partnersSponsorTiers.othersLogoImg}
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
