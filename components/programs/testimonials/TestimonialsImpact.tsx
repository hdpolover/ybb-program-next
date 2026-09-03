import { GraduationCap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { IMPACT_STAT_ICONS } from '@/components/sections/impactStatIcons';
import type { ImpactStat } from '@/types/home';

// Section angka-angka impact di halaman Testimonials.
//
// Sourced from the single platform `impact_stats` PlatformSetting row (via the
// `program_impact` section of the home payload this page already fetches), the
// same row the homepage reads. It used to hardcode four figures, two of which
// ("95%" satisfaction rate, "500+" social projects) had no source anywhere in
// the schema — no survey table, no project entity — so they are gone rather
// than defaulted: a satisfaction rate is measured or it is invented.
export default function TestimonialsImpact({ stats }: { stats?: ImpactStat[] }) {
  // No curated figures = no section. Never a placeholder or a dash.
  if (!stats || stats.length === 0) return null;

  return (
    <section className={componentsTheme.programsTestimonialsImpact.sectionWrapper}>
      <div className={componentsTheme.programsTestimonialsImpact.container}>
        <SectionHeader eyebrow="Our Impact" title="Join Our Growing Community" />
        <div className={componentsTheme.programsTestimonialsImpact.grid}>
          {stats.map(stat => {
            const Icon = IMPACT_STAT_ICONS[stat.icon] ?? GraduationCap;
            return (
              <div key={stat.id} className={componentsTheme.programsTestimonialsImpact.card}>
                <div className={componentsTheme.programsTestimonialsImpact.iconCircle}>
                  <Icon className={componentsTheme.programsTestimonialsImpact.icon} />
                </div>
                <p className={componentsTheme.programsTestimonialsImpact.value}>{stat.value}</p>
                <p className={componentsTheme.programsTestimonialsImpact.label}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
