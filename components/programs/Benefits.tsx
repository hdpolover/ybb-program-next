import { Globe2, Lightbulb, Handshake, Users, GraduationCap, Landmark } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function Benefits() {
  const items: {
    key: string;
    title: string;
    desc: string;
    icon: 'globe' | 'leader' | 'handshake' | 'network' | 'academic' | 'culture';
  }[] = [
    {
      key: 'insights',
      title: 'Global Insights',
      desc: "Attend impactful sessions led by global leaders, professionals, and innovators addressing today's most pressing challenges from diverse perspectives.",
      icon: 'globe',
    },
    {
      key: 'leadership',
      title: 'Leadership & Vision',
      desc: 'Join leadership forums and strategic discussions designed to sharpen your critical thinking and equip you to become an effective changemaker.',
      icon: 'leader',
    },
    {
      key: 'collab',
      title: 'Cross-Cultural Collaboration',
      desc: 'Work alongside youth from various countries to co-create innovative ideas and solutions that empower local and global communities.',
      icon: 'handshake',
    },
    {
      key: 'network',
      title: 'Global Network',
      desc: 'Connect with influential individuals, youth leaders, and professionals, building lasting relationships through shared goals and mutual collaboration.',
      icon: 'network',
    },
    {
      key: 'academic',
      title: 'Academic Pathways',
      desc: 'Discover opportunities for higher education and international scholarships, including information sessions on leading universities and global programs.',
      icon: 'academic',
    },
    {
      key: 'culture',
      title: 'Cultural Experience',
      desc: 'Experience the cultural richness of Istanbul through guided visits to its iconic sites, offering insights into its historical significance and global legacy.',
      icon: 'culture',
    },
  ];

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
        <SectionHeader eyebrow="Why join us" title="Delegate Benefits" />
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
