'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
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

type ProofItem = {
  icon: JSX.Element;
  title: string;
  subtitle: string;
  bullets?: string[];
};

type HakiInfo = {
  href: string;
  brand: string;
  regNo: string;
  status: string;
  classText: string;
  owner: string;
};

interface RecognitionProps {
  title?: string;
  subtitle?: string;
  proofs?: ProofItem[];
  haki?: HakiInfo;
}

const DEFAULT_PROOFS: ProofItem[] = [
  {
    icon: <Building2 className="h-5 w-5" />,
    title: 'Recognized by Ministry',
    subtitle: 'Endorsements or acknowledgements from relevant government bodies',
    bullets: ['Compliance-ready', 'Letters/acknowledgements'],
  },
  {
    icon: <University className="h-5 w-5" />,
    title: 'Supported by Universities',
    subtitle: 'Backed by reputable higher education institutions',
    bullets: ['Academic support', 'Guest lecturers'],
  },
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: 'Official Partners',
    subtitle: 'Formal collaborations with trusted organizations',
    bullets: ['MoU/LoI', 'Program collaboration'],
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Legal Recognition',
    subtitle: 'Meets formal compliance and regulatory standards',
    bullets: ['Policies & SOP', 'Auditable process'],
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Registered Entity',
    subtitle: 'Tax ID, foundation or other legal registration',
    bullets: ['NPWP / Yayasan', 'Valid documents'],
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: 'IP & Legal Protection',
    subtitle: 'Trademark registered at DJKI (Indonesia)',
  },
  {
    icon: <Newspaper className="h-5 w-5" />,
    title: 'Media Coverage',
    subtitle: 'Featured by national and international outlets',
    bullets: ['Online features', 'TV/Press'],
  },
  {
    icon: <Trophy className="h-5 w-5" />,
    title: 'Award-Winning',
    subtitle: 'Winners of international recognitions & awards',
    bullets: ['International awards', 'Jury selection'],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Global Alumni Network',
    subtitle: 'Active community of alumni collaborating across countries',
    bullets: ['Ongoing initiatives', 'Cross-border projects'],
  },
];

const DEFAULT_HAKI: HakiInfo = {
  href: 'https://pdki-indonesia.dgip.go.id/detail/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  brand: 'JAPAN YOUTH SUMMIT',
  regNo: 'IDM001273026',
  status: '(TM) Registered',
  classText: '41 — Education, seminars, conferences, cultural events, etc.',
  owner: 'MUHAMMAD ALDI SUBAKTI (ID)',
};

export default function Recognition({
  title = 'Recognition',
  subtitle = 'Proof that our program and organization are legitimate and credible.',
  proofs = DEFAULT_PROOFS,
  haki = DEFAULT_HAKI,
}: RecognitionProps) {
  return (
    <section className={jysSectionTheme.recognition.sectionWrapper}>
      <div className={jysSectionTheme.recognition.container}>
        <SectionHeader title={title} />
        <p className={jysSectionTheme.recognition.subtitle}>{subtitle}</p>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Kiri: panel visual + CTA PDKI */}
          <div className="flex items-center justify-center lg:col-span-5">
            <div className={jysSectionTheme.recognition.hakiCard}>
              <div className="mb-3 inline-flex items-center gap-2">
                <span className={jysSectionTheme.recognition.hakiIconCircle}>
                  <Scale className="h-5 w-5" />
                </span>
                <div>
                  <h3 className={jysSectionTheme.recognition.hakiTitle}>Trademark Registered</h3>
                  <p className={jysSectionTheme.recognition.hakiSubtitle}>DJKI • Indonesia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Image
                  src="/img/jys.png"
                  alt="JYS"
                  width={80}
                  height={80}
                  className="h-20 w-auto"
                />
                <div>
                  <p className={jysSectionTheme.recognition.hakiBrand}>{haki.brand}</p>
                  <p className={jysSectionTheme.recognition.hakiClassText}>{haki.classText}</p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className={jysSectionTheme.recognition.hakiMeta}>
                  <p className={jysSectionTheme.recognition.hakiMetaLabel}>Registration No.</p>
                  <p className={jysSectionTheme.recognition.hakiMetaValue}>{haki.regNo}</p>
                </div>
                <div className={jysSectionTheme.recognition.hakiMeta}>
                  <p className={jysSectionTheme.recognition.hakiMetaLabel}>Status</p>
                  <p className={jysSectionTheme.recognition.hakiMetaValue}>{haki.status}</p>
                </div>
                <div className={jysSectionTheme.recognition.hakiMeta}>
                  <p className={jysSectionTheme.recognition.hakiMetaLabel}>Owner</p>
                  <p className={jysSectionTheme.recognition.hakiMetaValue}>{haki.owner}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a
                  href={haki.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={jysSectionTheme.recognition.hakiButton}
                >
                  View on PDKI <ArrowRight className="h-4 w-4" />
                </a>
                <span className={jysSectionTheme.recognition.hakiChip}>HAKI</span>
              </div>
            </div>
          </div>

          {/* Kanan: daftar bukti */}
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {proofs.map((p, i) => (
                <div key={i} className={jysSectionTheme.recognition.proofCard}>
                  <div className={jysSectionTheme.recognition.proofIconCircle}>{p.icon}</div>
                  <h3 className={jysSectionTheme.recognition.proofTitle}>{p.title}</h3>
                  <p className={jysSectionTheme.recognition.proofSubtitle}>{p.subtitle}</p>
                  {p.bullets?.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.bullets.slice(0, 2).map(b => (
                        <span key={b} className={jysSectionTheme.recognition.bulletChip}>
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
