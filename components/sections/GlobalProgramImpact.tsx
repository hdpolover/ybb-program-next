'use client';

import { GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { IMPACT_STAT_ICONS } from '@/components/sections/impactStatIcons';
import type { ProgramImpactSection } from '@/types/home';

interface Props {
  section?: ProgramImpactSection;
}

export default function GlobalProgramImpact({ section }: Props) {
  const stats = section?.content.stats ?? [];
  // Also covers a snapshot cached before the API started omitting the section
  // outright: an empty stats array must render nothing, not an empty shell.
  if (!section || stats.length === 0) return null;

  const { eyebrow, title } = section.content;
  // Tailwind needs whole literal class names, so pick between two.
  const gridCols = stats.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3';

  return (
    <section className={componentsTheme.globalImpact.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} />

        <div className={`${componentsTheme.globalImpact.statsGrid} ${gridCols}`}>
          {stats.map(stat => {
            const Icon = IMPACT_STAT_ICONS[stat.icon] ?? GraduationCap;
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
