import { Trophy, Gem, Network, Globe2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Partnership Impact — angka-angka impact
export default function PartnershipImpactSection() {
  return (
    <section className={jysSectionTheme.partnersImpact.sectionWrapper}>
      <div className={jysSectionTheme.partnersImpact.container}>
        <SectionHeader eyebrow="Impact" title="Partnership Impact" />
        <div className={jysSectionTheme.partnersImpact.grid}>
          <StatCard
            icon={<Trophy className="h-5 w-5" />}
            value="50+"
            label="Partner Organizations"
          />
          <StatCard
            icon={<Gem className="h-5 w-5" />}
            value="$2.5M+"
            label="Total Partnership Value"
          />
          <StatCard icon={<Network className="h-5 w-5" />} value="10,000+" label="Youth Impacted" />
          <StatCard icon={<Globe2 className="h-5 w-5" />} value="120+" label="Countries Reached" />
        </div>
      </div>
    </section>
  );
}
