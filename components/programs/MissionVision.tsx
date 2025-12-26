import { Goal, Eye, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function MissionVision() {
  const missions: string[] = [
    'Build youth capacity in leadership, communication, and critical thinking.',
    'Strengthen international collaboration and cultural understanding among participants.',
    'Provide a platform for youth to initiate and implement impactful social projects.',
    'Facilitate meaningful dialogue between youth and global change-makers.',
    'Establish sustainable networks for long-term youth engagement and cooperation.',
  ];
  const vision =
    'To empower young people to become impactful contributors in addressing global challenges through leadership, collaboration, and innovation. Through our programs, we create a dynamic environment where youth can explore ideas, grow their potential, and take part in shaping a more connected and solution‑oriented global community.';
  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Purpose & Direction" title="Our Mission & Vision" />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Mission */}
          <div className="rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <span className={jysSectionTheme.programsMissionVision.missionIconMain}>
                <Goal className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-extrabold text-blue-900">Our Mission</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {missions.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={jysSectionTheme.programsMissionVision.missionBulletIcon}>
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="rounded-2xl bg-[url('/img/bgprogramoverview.png')] bg-cover bg-center p-6 text-white shadow-[0_10px_40px_rgba(2,6,23,0.12)] ring-1 ring-white/20 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white">
                <Eye className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-extrabold">Our Vision</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/90">{vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
