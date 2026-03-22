import Image from 'next/image';
import { Gem, Trophy, Medal } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { SponsorItem } from '@/types/partners';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

type SponsorTiersSectionProps = {
  sponsors?: SponsorItem[];
};

// Section: Sponsor Tiers — kartu detail
export default function SponsorTiersSection({ sponsors }: SponsorTiersSectionProps) {
  const diamondSponsor = sponsors?.find(s => s.tier === 'diamond');
  const goldSponsors = sponsors?.filter(s => s.tier === 'gold');
  const platinumSponsors = sponsors?.filter(s => s.tier === 'platinum');
  const totalDynamicSponsors = (goldSponsors?.length ?? 0) + (platinumSponsors?.length ?? 0);
  const hasFewSponsors = totalDynamicSponsors > 0 && totalDynamicSponsors <= 2;

  return (
    <section className={componentsTheme.partnersSponsorTiers.sectionWrapper}>
      <div className={componentsTheme.partnersSponsorTiers.container}>
        <SectionHeader eyebrow="Our Sponsors" title="Sponsor Tiers" />
        <div className={componentsTheme.partnersSponsorTiers.tiersGrid}>
          {/* Detail Diamond */}
          <div className={componentsTheme.partnersSponsorTiers.diamondCard}>
            <div className="mb-3 flex items-center gap-2">
              <span className={componentsTheme.partnersSponsorTiers.diamondIconCircle}>
                <Gem className="h-5 w-5" />
              </span>
              <span className={componentsTheme.partnersSponsorTiers.diamondLabel}>Diamond Sponsor</span>
            </div>
            {diamondSponsor ? (
              <a
                href={diamondSponsor.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3"
              >
                <Image
                  src={diamondSponsor.logo}
                  alt={diamondSponsor.name}
                  width={36}
                  height={36}
                  sizes="36px"
                  className={componentsTheme.partnersSponsorTiers.diamondLogoImg}
                />
                <h3 className={componentsTheme.partnersSponsorTiers.diamondTitle}>{diamondSponsor.name}</h3>
              </a>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-600">
                {DATA_NOT_ADDED}
              </div>
            )}
          </div>

          {/* Detail Gold */}
          <div
            className={`${componentsTheme.partnersSponsorTiers.goldCard} ${
              hasFewSponsors ? 'py-5 sm:py-6' : ''
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={componentsTheme.partnersSponsorTiers.goldIconCircle}>
                <Trophy className="h-5 w-5" />
              </span>
              <span className={componentsTheme.partnersSponsorTiers.goldLabel}>Gold Sponsors</span>
            </div>
            <div className={componentsTheme.partnersSponsorTiers.goldOrgWrapper}>
              {goldSponsors && goldSponsors.length > 0 ? (
                goldSponsors.map(sponsor => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noreferrer"
                    className={componentsTheme.partnersSponsorTiers.goldOrgCard}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={32}
                        height={32}
                        sizes="32px"
                        className={componentsTheme.partnersSponsorTiers.goldLogoImg}
                      />
                      <h3 className={componentsTheme.partnersSponsorTiers.goldOrgTitle}>
                        {sponsor.name}
                      </h3>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/30 px-4 py-3 text-sm font-medium text-slate-600">
                  {DATA_NOT_ADDED}
                </div>
              )}
            </div>
          </div>

          {/* Detail Silver */}
          <div
            className={`${componentsTheme.partnersSponsorTiers.silverCard} ${
              hasFewSponsors ? 'py-5 sm:py-6' : ''
            }`}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className={componentsTheme.partnersSponsorTiers.silverIconCircle}>
                <Medal className="h-5 w-5" />
              </span>
              <span className={componentsTheme.partnersSponsorTiers.silverLabel}>Platinum Sponsors</span>
            </div>
            <div className={componentsTheme.partnersSponsorTiers.silverGrid}>
              {platinumSponsors && platinumSponsors.length > 0 ? (
                platinumSponsors.map(sponsor => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noreferrer"
                    className={componentsTheme.partnersSponsorTiers.silverOrgCard}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width={28}
                        height={28}
                        sizes="28px"
                        className={componentsTheme.partnersSponsorTiers.silverLogoImg}
                      />
                      <p className={componentsTheme.partnersSponsorTiers.silverOrgName}>{sponsor.name}</p>
                    </div>
                  </a>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-600 sm:col-span-2">
                  {DATA_NOT_ADDED}
                </div>
              )}
            </div>
          </div>
        </div>
        {hasFewSponsors && (
          <p className="mt-4 text-center text-xs text-slate-500 sm:text-sm">
            More sponsors will be announced soon.
          </p>
        )}
      </div>
    </section>
  );
}
