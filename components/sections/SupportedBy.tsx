'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type SupportedByItem = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  type?: string;
  tier?: string;
};

const fallbackSupportedLogos: SupportedByItem[] = [
  { id: 'local-jys', name: 'JYS', logoUrl: '/img/jysfix.png', websiteUrl: '#', type: 'local', tier: 'primary' },
  { id: 'local-iys', name: 'IYS', logoUrl: '/img/IYSlogo.png', websiteUrl: '#', type: 'local', tier: 'primary' },
  { id: 'local-yaf', name: 'YAF', logoUrl: '/img/YAFlogo.png', websiteUrl: '#', type: 'local', tier: 'primary' },
  { id: 'local-kys', name: 'KYS', logoUrl: '/img/KYSlogo.png', websiteUrl: '#', type: 'local', tier: 'primary' },
  { id: 'local-meys', name: 'MEYS', logoUrl: '/img/MEYSlogo.png', websiteUrl: '#', type: 'local', tier: 'primary' },
  { id: 'local-wys', name: 'WYS', logoUrl: '/img/WYSlogo.png', websiteUrl: '#', type: 'local', tier: 'primary' },
];

type SupportedByProps = {
  items?: SupportedByItem[];
};

export default function SupportedBy({ items }: SupportedByProps) {
  const sponsors = items && items.length > 0 ? items : fallbackSupportedLogos;
  return (
    <section className={jysSectionTheme.supportedBy.sectionWrapper}>
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
                className={jysSectionTheme.supportedBy.logoWrapper}
              >
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name || 'Supporting organization logo'}
                  fill
                  sizes="(min-width:1024px) 160px, 33vw"
                  className={jysSectionTheme.supportedBy.logoImg}
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
