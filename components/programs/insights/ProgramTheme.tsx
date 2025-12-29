import SectionHeader from '@/components/ui/SectionHeader';
import { HeartPulse, GraduationCap, Briefcase, Leaf, Scale } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function ProgramThemeSection() {
  const items = [
    {
      sdg: 3,
      tag: 'SDG 3',
      title: 'Good Health and Well‑being',
      desc: 'Improving youth access to mental health support, public health education, and basic healthcare services.',
      icon: <HeartPulse className="h-5 w-5" />,
    },
    {
      sdg: 4,
      tag: 'SDG 4',
      title: 'Quality Education',
      desc: 'Expanding equal access to quality learning through digital tools, alternative education, and youth skill development.',
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      sdg: 8,
      tag: 'SDG 8',
      title: 'Decent Work and Economic Growth',
      desc: 'Creating jobs and entrepreneurship opportunities for youth in the digital and creative economy.',
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      sdg: 13,
      tag: 'SDG 13',
      title: 'Climate Action',
      desc: 'Empowering youth to lead climate campaigns, promote sustainability, and build eco‑friendly solutions.',
      icon: <Leaf className="h-5 w-5" />,
    },
    {
      sdg: 16,
      tag: 'SDG 16',
      title: 'Peace, Justice, and Strong Institutions',
      desc: 'Promoting youth participation in governance, conflict prevention, and access to justice.',
      icon: <Scale className="h-5 w-5" />,
    },
  ];
  return (
    <section className="relative w-full bg-[#eef5ff] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Program Theme" title="Subthemes we focus on" />
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map(t => (
            <div key={t.title} className={jysSectionTheme.insightsTheme.card}>
              <span aria-hidden className={jysSectionTheme.insightsTheme.leftAccent} />
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={jysSectionTheme.insightsTheme.tagChip}>{t.tag}</span>
                  <span className={jysSectionTheme.insightsTheme.iconCircle}>{t.icon}</span>
                </div>
                <span className={jysSectionTheme.insightsTheme.sdgCircle}>{t.sdg}</span>
              </div>
              <h3 className="text-base font-extrabold text-blue-900 sm:text-lg">{t.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
