import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { PROGRAMS_OBJECTIVES_COPY } from '@/data/programs/sections/objectives/programsObjectives';

export default function Objectives() {
  const { eyebrow, title, items } = PROGRAMS_OBJECTIVES_COPY;
  return (
    <section className="bg-[#eef5ff] px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((obj, i) => (
            <div
              key={obj.n}
              className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:shadow-[0_16px_60px_rgba(2,6,23,0.12)] ${
                i < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={componentsTheme.programsObjectives.numberCircle}>{obj.n}</span>
                <div>
                  <h3 className="text-lg font-extrabold text-blue-900">{obj.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{obj.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
