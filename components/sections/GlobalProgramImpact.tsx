'use client';

import { Users, Globe2, GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const stats = [
  {
    id: 'participants',
    label: 'Total Participants',
    value: '10,019',
    icon: Users,
  },
  {
    id: 'countries',
    label: 'Total Countries',
    value: '115',
    icon: Globe2,
  },
  {
    id: 'alumni',
    label: 'Alumni',
    value: '9,281',
    icon: GraduationCap,
  },
];

export default function GlobalProgramImpact() {
  return (
    <section className={jysSectionTheme.globalImpact.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Global Reach" title="Global Program Impact" />

        <div className={jysSectionTheme.globalImpact.statsGrid}>
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className={jysSectionTheme.globalImpact.card}>
                <span className={jysSectionTheme.globalImpact.iconCircle}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className={jysSectionTheme.globalImpact.value}>{stat.value}</p>
                <p className={jysSectionTheme.globalImpact.label}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
