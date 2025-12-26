import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Community Partners — kartu list partner komunitas
export default function CommunityPartnersSection() {
  return (
    <section className={jysSectionTheme.partnersCommunity.sectionWrapper}>
      <div className={jysSectionTheme.partnersCommunity.container}>
        <SectionHeader
          eyebrow="Community Partners"
          title="Organizations providing in-kind support and collaboration"
        />
        <div className={jysSectionTheme.partnersCommunity.listWrapper}>
          <a
            href="/partners/local-youth-council"
            className={jysSectionTheme.partnersCommunity.card}
          >
            <Image
              src="/img/jyslogosolo.png"
              alt="Local Youth Council logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>Local Youth Council</p>
              <span className={jysSectionTheme.partnersCommunity.pinkChip}>Community Partner</span>
            </div>
          </a>
          <a
            href="/partners/university-alliance"
            className={jysSectionTheme.partnersCommunity.card}
          >
            <Image
              src="/img/IYSlogo.png"
              alt="University Alliance logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>University Alliance</p>
              <span className={jysSectionTheme.partnersCommunity.academicChip}>
                Academic Partner
              </span>
            </div>
          </a>
          <a href="/partners/social-impact-hub" className={jysSectionTheme.partnersCommunity.card}>
            <Image
              src="/img/KYSlogo.png"
              alt="Social Impact Hub logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>Social Impact Hub</p>
              <span className={jysSectionTheme.partnersCommunity.innovationChip}>
                Innovation Partner
              </span>
            </div>
          </a>
          <a
            href="/partners/media-partners-network"
            className={jysSectionTheme.partnersCommunity.card}
          >
            <Image
              src="/img/MEYSlogo.png"
              alt="Media Partners Network logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>Media Partners Network</p>
              <span className={jysSectionTheme.partnersCommunity.mediaChip}>Media Partner</span>
            </div>
          </a>
          <a href="/partners/startup-incubators" className={jysSectionTheme.partnersCommunity.card}>
            <Image
              src="/img/WYSlogo.png"
              alt="Startup Incubators logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>Startup Incubators</p>
              <span className={jysSectionTheme.partnersCommunity.businessChip}>
                Business Partner
              </span>
            </div>
          </a>
          <a
            href="/partners/cultural-exchange-foundation"
            className={jysSectionTheme.partnersCommunity.card}
          >
            <Image
              src="/img/YAFlogo.png"
              alt="Cultural Exchange Foundation logo"
              width={48}
              height={48}
              sizes="48px"
              className={jysSectionTheme.partnersCommunity.logoImg}
            />
            <div>
              <p className={jysSectionTheme.partnersCommunity.orgName}>
                Cultural Exchange Foundation
              </p>
              <span className={jysSectionTheme.partnersCommunity.culturalChip}>
                Cultural Partner
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
