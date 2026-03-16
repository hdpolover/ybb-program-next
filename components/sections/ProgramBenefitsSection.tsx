"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ProgramBenefitsSection as ProgramBenefitsSectionType } from "@/types/home";

const theme = componentsTheme.homeProgramBenefits;

const DEFAULT_GROUPS = [
  {
    id: 'high_school',
    title: 'Benefits for High School Students',
    imageUrl: '/img/programoverview.png',
    items: [
      'Relevant to Indonesian National Curriculum',
      'Relevance to the IB Curriculum',
      'Support for the Cambridge Curriculum',
      'Curated Certification by PUSPRENAS (Indonesia)',
    ],
  },
  {
    id: 'university_professional',
    title: 'Global-Scale Benefits for University Students & Professionals',
    imageUrl: '/img/benefits.png',
    items: [
      'Global Exposure & International Networking',
      'Academic & Career Development',
      'Recognized Credential',
      'Global Mindset & Impact Leadership',
    ],
  },
];

interface Props {
  section?: ProgramBenefitsSectionType;
}

export default function ProgramBenefitsSection({ section }: Props) {
  const eyebrow = section?.content.eyebrow ?? 'Program Benefits';
  const title = section?.content.title ?? 'for Students, University Students, and Professional';
  const groups = section?.content.groups ?? DEFAULT_GROUPS;

  return (
    <section
      className={theme.sectionWrapper}
      style={{
        backgroundImage: `url('${theme.backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={theme.container}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          align="center"
        />

        <div className={theme.grid}>
          {groups.map(group => (
            <article key={group.id} className={theme.card}>
              <div className={theme.imageWrapper}>
                <Image
                  src={group.imageUrl || '/img/programoverview.png'}
                  alt={group.title}
                  fill={false}
                  width={640}
                  height={360}
                  className={theme.image}
                  unoptimized={group.imageUrl?.startsWith('http')}
                />
              </div>
              <h3 className={theme.cardTitle}>{group.title}</h3>
              <ul className={theme.list}>
                {group.items.map((item, idx) => (
                  <li key={idx} className={theme.listItem}>
                    <CheckCircle2 className={theme.listCheckIcon} />
                    <span className={theme.listText}>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
