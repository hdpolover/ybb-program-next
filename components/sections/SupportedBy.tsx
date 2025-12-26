'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const supportedLogos = [
  '/img/jysfooter.png',
  '/img/IYSlogo.png',
  '/img/YAFlogo.png',
  '/img/KYSlogo.png',
  '/img/MEYSlogo.png',
  '/img/WYSlogo.png',
];

export default function SupportedBy() {
  return (
    <section className={jysSectionTheme.supportedBy.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Supported By"
          title="Organizations that stand behind this program"
        />

        <div className="mt-6 overflow-hidden">
          <div className="logo-marquee flex items-center gap-10">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(dupIndex =>
              supportedLogos.map((src, index) => (
                <div
                  key={`${src}-${dupIndex}-${index}`}
                  className={jysSectionTheme.supportedBy.logoWrapper}
                >
                  <Image
                    src={src}
                    alt="Supporting organization logo"
                    fill
                    sizes="(min-width:1024px) 160px, 33vw"
                    className={jysSectionTheme.supportedBy.logoImg}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .logo-marquee {
          width: max-content;
          animation: logo-marquee 100s linear infinite;
        }

        @keyframes logo-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
