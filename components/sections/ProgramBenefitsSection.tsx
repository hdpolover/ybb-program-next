"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ProgramBenefitsSection as ProgramBenefitsSectionType } from "@/types/home";

const theme = componentsTheme.homeProgramBenefits;

interface Props {
  section?: ProgramBenefitsSectionType;
  textColorScheme?: 'light' | 'dark';
}

export default function ProgramBenefitsSection({ section, textColorScheme }: Props) {
  if (!section || !section.content.groups || section.content.groups.length === 0) return null;

  const eyebrow = section.content.eyebrow ?? 'Program Benefits';
  const title = section.content.title ?? 'for Students, University Students, and Professional';
  const groups = section.content.groups;
  const colorScheme = textColorScheme ?? section.content.text_color_scheme ?? 'dark';
  const desktopBg = section.content.background_image_url?.trim() || null;
  const mobileBg = section.content.background_image_mobile_url?.trim() || desktopBg;

  return (
    <section
      className={theme.sectionWrapper}
      style={desktopBg ? {
        backgroundImage: `url('${desktopBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : undefined}
    >
      {/* testing pushh */}
      {mobileBg && mobileBg !== desktopBg && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
          style={{ backgroundImage: `url('${mobileBg}')` }}
          aria-hidden="true"
        />
      )}

      <div className={`${theme.container} relative z-10`}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          align="center"
          colorScheme={colorScheme}
        />

        <div className={theme.grid}>
          {groups.map(group => (
            <article key={group.id} className={theme.card}>
              <div className={theme.imageWrapper}>
                {group.imageUrl ? (
                  <Image
                    src={group.imageUrl}
                    alt={group.title}
                    fill={false}
                    width={640}
                    height={360}
                    className={theme.image}
                    unoptimized={group.imageUrl?.startsWith('http')}
                  />
                ) : (
                  <div className="h-full w-full bg-primary/10" />
                )}
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
