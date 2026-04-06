import { Trophy, Gem, Network, Globe2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type PartnershipImpactStats = {
  partnerOrganizations?: string;
  totalPartnershipValue?: string;
  youthImpacted?: string;
  countriesReached?: string;
};

// Section: Partnership Impact — angka-angka impact
export default function PartnershipImpactSection({
  stats,
}: {
  stats?: PartnershipImpactStats;
}) {
  const partnerOrganizations = stats?.partnerOrganizations ?? '50+';
  const totalPartnershipValue = stats?.totalPartnershipValue ?? '$2.5M+';
  const youthImpacted = stats?.youthImpacted ?? '10,000+';
  const countriesReached = stats?.countriesReached ?? '120+';

  return (
    <section className={componentsTheme.partnersImpact.sectionWrapper}>
      <div className={componentsTheme.partnersImpact.container}>
        <SectionHeader eyebrow="Impact" title="Partnership Impact" />
        <div className={componentsTheme.partnersImpact.grid}>
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            value={partnerOrganizations}
            label="Partner Organizations"
          />
          <StatCard
            icon={<Gem className="h-5 w-5" />}
            value={totalPartnershipValue}
            label="Total Partnership Value"
          />
          <StatCard icon={<Network className="h-5 w-5" />} value={youthImpacted} label="Youth Impacted" />
          <StatCard icon={<Globe2 className="h-5 w-5" />} value={countriesReached} label="Countries Reached" />
        </div>
      </div>
    </section>
  );
}
