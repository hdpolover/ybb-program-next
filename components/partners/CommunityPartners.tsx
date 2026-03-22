import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { SponsorItem } from '@/types/partners';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

// Section: Community Partners — kartu list partner komunitas
type CommunityPartnersSectionProps = {
  partners?: SponsorItem[];
};

export default function CommunityPartnersSection({ partners }: CommunityPartnersSectionProps) {
  const hasItems = !!partners && partners.length > 0;

  return (
    <section className={componentsTheme.partnersCommunity.sectionWrapper}>
      <div className={componentsTheme.partnersCommunity.container}>
        <SectionHeader
          eyebrow="Community Partners"
          title="Organizations providing in-kind support and collaboration"
        />
        <div className={componentsTheme.partnersCommunity.listWrapper}>
          {hasItems ? (
            partners.map(p => (
              <a
                key={p.id}
                href={p.website || '#'}
                target={p.website ? '_blank' : undefined}
                rel={p.website ? 'noreferrer' : undefined}
                className={componentsTheme.partnersCommunity.card}
              >
                <Image
                  src={p.logo || '/img/jyslogosolo.png'}
                  alt={`${p.name} logo`}
                  width={48}
                  height={48}
                  sizes="48px"
                  className={componentsTheme.partnersCommunity.logoImg}
                />
                <div>
                  <p className={componentsTheme.partnersCommunity.orgName}>{p.name}</p>
                  <span className={componentsTheme.partnersCommunity.pinkChip}>
                    {p.tier ? p.tier.replace(/_/g, ' ') : DATA_NOT_ADDED}
                  </span>
                </div>
              </a>
            ))
          ) : (
            <div
              className={`${componentsTheme.partnersCommunity.card} border-dashed border-slate-200 bg-slate-50/60`}
            >
              <div>
                <p className={componentsTheme.partnersCommunity.orgName}>{DATA_NOT_ADDED}</p>
                <span className={componentsTheme.partnersCommunity.pinkChip}>{DATA_NOT_ADDED}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
