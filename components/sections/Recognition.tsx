'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import {
  Building2,
  University,
  BadgeCheck,
  ShieldCheck,
  FileText,
  Scale,
  Newspaper,
  Trophy,
  ArrowRight,
  Users,
} from 'lucide-react';
import {
  recognitionContent,
  type RecognitionProofItem,
} from '@/data/home/sections/recognition/recognition';

const resolveProofIcon = (key: RecognitionProofItem['iconKey']): JSX.Element => {
  switch (key) {
    case 'ministry':
      return <Building2 className="h-5 w-5" />;
    case 'university':
      return <University className="h-5 w-5" />;
    case 'official_partners':
      return <BadgeCheck className="h-5 w-5" />;
    case 'legal_recognition':
      return <ShieldCheck className="h-5 w-5" />;
    case 'registered_entity':
      return <FileText className="h-5 w-5" />;
    case 'ip_protection':
      return <Scale className="h-5 w-5" />;
    case 'media_coverage':
      return <Newspaper className="h-5 w-5" />;
    case 'award_winning':
      return <Trophy className="h-5 w-5" />;
    case 'global_alumni':
      return <Users className="h-5 w-5" />;
    default:
      return <BadgeCheck className="h-5 w-5" />;
  }
};

export default function Recognition() {
  const { title, subtitle, proofs, haki } = recognitionContent;
  return (
    <section className={componentsTheme.recognition.sectionWrapper}>
      <div className={componentsTheme.recognition.container}>
        <SectionHeader title={title} />
        <p className={componentsTheme.recognition.subtitle}>{subtitle}</p>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Kiri: panel visual + CTA PDKI */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className={componentsTheme.recognition.hakiCard}>
              <div className="mb-3 inline-flex items-center gap-2">
                <span className={componentsTheme.recognition.hakiIconCircle}>
                  <Scale className="h-5 w-5" />
                </span>
                <div>
                  <h3 className={componentsTheme.recognition.hakiTitle}>Trademark Registered</h3>
                  <p className={componentsTheme.recognition.hakiSubtitle}>DJKI • Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/img/jysfix.png"
                  alt="JYS"
                  width={80}
                  height={80}
                  className="h-12 w-auto"
                />
                <div>
                  <p className={componentsTheme.recognition.hakiBrand}>{haki.brand}</p>
                  <p className={componentsTheme.recognition.hakiClassText}>{haki.classText}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={componentsTheme.recognition.hakiMeta}>
                  <p className={componentsTheme.recognition.hakiMetaLabel}>Registration No.</p>
                  <p className={componentsTheme.recognition.hakiMetaValue}>{haki.regNo}</p>
                </div>
                <div className={componentsTheme.recognition.hakiMeta}>
                  <p className={componentsTheme.recognition.hakiMetaLabel}>Status</p>
                  <p className={componentsTheme.recognition.hakiMetaValue}>{haki.status}</p>
                </div>
                <div className={componentsTheme.recognition.hakiMeta}>
                  <p className={componentsTheme.recognition.hakiMetaLabel}>Owner</p>
                  <p className={componentsTheme.recognition.hakiMetaValue}>{haki.owner}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={haki.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={componentsTheme.recognition.hakiButton}
                >
                  View on PDKI <ArrowRight className="h-4 w-4" />
                </a>
                <span className={componentsTheme.recognition.hakiChip}>HAKI</span>
              </div>
            </div>
          </div>

          {/* Kanan: daftar bukti */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {proofs.map((p, i) => (
                <div key={i} className={componentsTheme.recognition.proofCard}>
                  <div className={componentsTheme.recognition.proofIconCircle}>
                    {resolveProofIcon(p.iconKey)}
                  </div>
                  <h3 className={componentsTheme.recognition.proofTitle}>{p.title}</h3>
                  <p className={componentsTheme.recognition.proofSubtitle}>{p.subtitle}</p>
                  {p.bullets?.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.bullets.slice(0, 2).map(b => (
                        <span key={b} className={componentsTheme.recognition.bulletChip}>
                          {b}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
