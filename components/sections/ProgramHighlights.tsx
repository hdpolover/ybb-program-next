import Image from 'next/image';
import { Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type HighlightImage = {
  url: string;
  caption: string;
  type: string;
};

type ProgramHighlightsProps = {
  imageGallery?: HighlightImage[];
  highlightsTitle?: string;
  highlightItems?: string[];
};

export default function ProgramHighlights({
  imageGallery,
  highlightsTitle,
  highlightItems,
}: ProgramHighlightsProps) {
  const defaultObjectivePoints = [
    'Build strong youth leadership character.',
    'Boost youth confidence through competition and real challenges.',
    'Sharpen the ability to see and seize new opportunities.',
    'Strengthen youth presence and contribution at the international level.',
    'Train collaboration to build the nation together.',
    'Create a strong and supportive YBB alumni network.',
  ];

  const largeImage = imageGallery?.[0];
  const smallImage1 = imageGallery?.[1] ?? imageGallery?.[0];
  const smallImage2 = imageGallery?.[2] ?? imageGallery?.[1] ?? imageGallery?.[0];

  const title = highlightsTitle ?? 'Program Highlights';
  const items = highlightItems && highlightItems.length > 0 ? highlightItems : defaultObjectivePoints;

  return (
    <section className={jysSectionTheme.programHighlights.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="Program Objective" title={title} />

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-10">
          {/* Left: Kolase 3 gambar */}
          <div className="order-1 lg:order-1">
            <div className="relative h-full w-full">
              <div className="grid h-full grid-cols-2 gap-4">
                {/* Gambar besar kiri */}
                <div
                  className={`${jysSectionTheme.programHighlights.collageLargeCard} col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  {largeImage ? (
                    <Image
                      src={largeImage.url}
                      alt={largeImage.caption || 'Program highlight'}
                      fill
                      sizes="(min-width:1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/img/programhighlight1.jpg"
                      alt="Delegates during Japan Youth Summit sessions"
                      fill
                      sizes="(min-width:1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Dua gambar kecil kanan */}
                <div
                  className={`${jysSectionTheme.programHighlights.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  {smallImage1 ? (
                    <Image
                      src={smallImage1.url}
                      alt={smallImage1.caption || 'Program highlight'}
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/img/programoverview.png"
                      alt="Overview of Japan Youth Summit program"
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div
                  className={`${jysSectionTheme.programHighlights.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
                >
                  {smallImage2 ? (
                    <Image
                      src={smallImage2.url}
                      alt={smallImage2.caption || 'Program highlight'}
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/img/benefits.png"
                      alt="Benefits and networking opportunities for delegates"
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className="object-cover"
                    />
                  )}
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
              {items.map(point => (
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
