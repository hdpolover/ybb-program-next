import Image from 'next/image';
import { Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type HighlightImage = {
  url: string;
  caption: string;
  type: string;
};

type ProgramHighlightsProps = {
  imageGallery?: HighlightImage[];
  highlightsEyebrow?: string;
  highlightsTitle?: string;
  highlightsIntro?: string;
  highlightItems?: string[];
};

export default function ProgramHighlights({
  imageGallery,
  highlightsEyebrow,
  highlightsTitle,
  highlightsIntro,
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

  const eyebrow = highlightsEyebrow ?? 'Program Objective';
  const title = highlightsTitle ?? 'Program Objectives';
  const intro =
    highlightsIntro ??
    'Our program is designed to shape delegates into impactful young leaders through forums, competitions, and collaborative projects.';
  const items = highlightItems && highlightItems.length > 0 ? highlightItems : defaultObjectivePoints;

  return (
    <section className={componentsTheme.programHighlights.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} />

        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] lg:gap-10">
          {/* Left: Kolase 3 gambar */}
          <div className="order-1 lg:order-1">
            <div className="relative h-full w-full">
              <div className="grid h-full grid-cols-2 gap-4">
                {/* Gambar besar kiri */}
                <div
                  className={`${componentsTheme.programHighlights.collageLargeCard} col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto`}
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
                      alt="Delegates during program sessions"
                      fill
                      sizes="(min-width:1024px) 420px, 100vw"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Dua gambar kecil kanan */}
                <div
                  className={`${componentsTheme.programHighlights.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
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
                      alt="Overview of program"
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div
                  className={`${componentsTheme.programHighlights.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
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
          <div className={componentsTheme.programHighlights.rightWrapper}>
            <p className={componentsTheme.programHighlights.objectiveIntro}>
              {intro}
            </p>

            <ul className="mt-5 space-y-3">
              {items.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <span className={componentsTheme.programHighlights.checkIcon}>
                    <Check className="h-4 w-4" />
                  </span>
                  <span className={componentsTheme.programHighlights.objectivePointText}>
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
