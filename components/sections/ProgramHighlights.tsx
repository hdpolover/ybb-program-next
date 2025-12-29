import Image from 'next/image';
import { Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function ProgramHighlights() {
  const objectivePoints = [
    'Build strong youth leadership character.',
    'Boost youth confidence through competition and real challenges.',
    'Sharpen the ability to see and seize new opportunities.',
    'Strengthen youth presence and contribution at the international level.',
    'Train collaboration to build the nation together.',
    'Create a strong and supportive YBB alumni network.',
  ];

  return (
    <section className={jysSectionTheme.programHighlights.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Program Objective" title="Program Highlights" />

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* Left: Kolase 3 gambar */}
          <div className="order-1 lg:order-1">
            <div className="relative h-full w-full">
              <div className="grid h-full gap-4 sm:grid-cols-2">
                {/* Gambar besar kiri */}
                <div className={jysSectionTheme.programHighlights.collageLargeCard}>
                  <Image
                    src="/img/programhighlight1.jpg"
                    alt="Delegates during Japan Youth Summit sessions"
                    fill
                    sizes="(min-width:1024px) 420px, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* Dua gambar kecil kanan */}
                <div className={jysSectionTheme.programHighlights.collageSmallCard}>
                  <Image
                    src="/img/programoverview.png"
                    alt="Overview of Japan Youth Summit program"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className={jysSectionTheme.programHighlights.collageSmallCard}>
                  <Image
                    src="/img/benefits.png"
                    alt="Benefits and networking opportunities for delegates"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Program Objective points */}
          <div className={jysSectionTheme.programHighlights.rightWrapper}>
            <p className={jysSectionTheme.programHighlights.objectiveIntro}>
              The Japan Youth Summit program is carefully designed to shape delegates into impactful
              young leaders. Through a mix of forums, competitions, and collaborative projects,
              participants are guided to grow in character, skills, and global perspective.
            </p>

            <ul className="mt-5 space-y-3">
              {objectivePoints.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <span className={jysSectionTheme.programHighlights.checkIcon}>
                    <Check className="h-4 w-4" />
                  </span>
                  <span className={jysSectionTheme.programHighlights.objectivePointText}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
