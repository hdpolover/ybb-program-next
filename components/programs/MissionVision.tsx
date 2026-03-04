import { Goal, Eye, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { PROGRAMS_MISSION_VISION_COPY } from '@/data/programs/sections/mission-vision/programsMissionVision';

export default function MissionVision() {
  const { header, missionTitle, missions, visionTitle, vision } = PROGRAMS_MISSION_VISION_COPY;
  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={header.eyebrow} title={header.title} />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Misi */}
          <div className="rounded-2xl bg-[url('/img/bgourprogram.png')] bg-cover bg-center shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 sm:p-8">
            <div className="flex items-center gap-3">
              <span className={componentsTheme.programsMissionVision.missionIconMain}>
                <Goal className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-extrabold text-blue-900">{missionTitle}</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {missions.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className={componentsTheme.programsMissionVision.missionBulletIcon}>
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-6 text-slate-700">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visi */}
          <div className="rounded-2xl bg-[url('/img/bgprogramoverview.png')] bg-cover bg-center p-6 text-white shadow-[0_10px_40px_rgba(2,6,23,0.12)] ring-1 ring-white/20 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white">
                <Eye className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-extrabold">{visionTitle}</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/90">{vision}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
