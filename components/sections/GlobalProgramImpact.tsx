'use client';

import { Users, Globe2, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { IMPACT_DISTRIBUTION_COPY } from '@/data/home/sections/impact/impactDistribution';

export default function GlobalProgramImpact() {
  return (
    <section className={componentsTheme.globalImpact.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow={IMPACT_DISTRIBUTION_COPY.globalImpactEyebrow}
          title={IMPACT_DISTRIBUTION_COPY.globalImpactTitle}
        />

        <div className={componentsTheme.globalImpact.statsGrid}>
          {IMPACT_DISTRIBUTION_COPY.stats.map(stat => {
            const Icon = stat.icon === 'participants' ? Users : stat.icon === 'countries' ? Globe2 : GraduationCap;
            return (
              <div key={stat.id} className={componentsTheme.globalImpact.card}>
                <span className={componentsTheme.globalImpact.iconCircle}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className={componentsTheme.globalImpact.value}>{stat.value}</p>
                <p className={componentsTheme.globalImpact.label}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
