'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type SupportedByItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  type?: string;
  tier?: string;
};

type SupportedByProps = {
  items?: SupportedByItem[];
};

export default function SupportedBy({ items }: SupportedByProps) {
  if (!items || items.length === 0) return null;

  const sponsors = items;
  return (
    <section className={componentsTheme.supportedBy.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Supported By"
          title="Organizations that stand behind this program"
        />

        <div className="mt-6 overflow-hidden">
          <div className="logo-marquee flex items-center gap-10">
            {sponsors.map(sponsor => (
              <a
                key={sponsor.id}
                href={sponsor.websiteUrl || '#'}
                target={sponsor.websiteUrl ? '_blank' : undefined}
                rel={sponsor.websiteUrl ? 'noreferrer' : undefined}
                className={componentsTheme.supportedBy.logoWrapper}
              >
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name || 'Supporting organization logo'}
                  fill
                  sizes="(min-width:1024px) 160px, 33vw"
                  className={componentsTheme.supportedBy.logoImg}
                />
              </a>
            ))}
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
