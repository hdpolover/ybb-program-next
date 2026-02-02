import { Globe2, Lightbulb, Handshake, Users, GraduationCap, Landmark } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_BENEFITS_COPY } from '@/data/programs/sections/benefits/programsBenefits';

export default function Benefits() {
  const { eyebrow, title, items } = PROGRAMS_BENEFITS_COPY;

  const iconEls: Record<(typeof items)[number]['icon'], JSX.Element> = {
    globe: <Globe2 className="h-5 w-5" />,
    leader: <Lightbulb className="h-5 w-5" />,
    handshake: <Handshake className="h-5 w-5" />,
    network: <Users className="h-5 w-5" />,
    academic: <GraduationCap className="h-5 w-5" />,
    culture: <Landmark className="h-5 w-5" />,
  };

  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(it => (
            <div
              key={it.key}
              className="group rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)]"
            >
              <div className="flex items-start gap-3">
                <span className={jysSectionTheme.programsBenefits.iconCircle}>
                  {iconEls[it.icon]}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold text-blue-900">{it.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
