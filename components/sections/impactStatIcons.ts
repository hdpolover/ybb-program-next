// components/sections/impactStatIcons.ts
import { Users, Globe2, GraduationCap, CalendarDays, type LucideIcon } from 'lucide-react';
import type { ImpactStat } from '@/types/home';

/** One icon per platform impact figure, shared by every surface that renders
 *  the `program_impact` section so /, /programs/testimonials and /partners
 *  can't drift apart. */
export const IMPACT_STAT_ICONS: Record<ImpactStat['icon'], LucideIcon> = {
  participants: Users,
  countries: Globe2,
  alumni: GraduationCap,
  editions: CalendarDays,
};
