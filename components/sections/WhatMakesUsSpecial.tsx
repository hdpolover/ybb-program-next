"use client";

import { componentsTheme } from "@/lib/theme/components";
import SectionHeader from "@/components/ui/SectionHeader";
import { WHAT_MAKES_US_SPECIAL_CONTENT, resolveSpecialIcon, type SpecialIconKey } from "@/data/home/sections/what-makes-us-special/whatMakesUsSpecial";
import type { ProgramFeaturesSection } from "@/types/home";

const specialTheme = componentsTheme.homeWhatMakesSpecial;

interface Props {
  section?: ProgramFeaturesSection;
}

export default function WhatMakesUsSpecialSection({ section }: Props) {
  const eyebrow = section?.content.eyebrow ?? WHAT_MAKES_US_SPECIAL_CONTENT.eyebrow;
  const title = section?.content.title ?? WHAT_MAKES_US_SPECIAL_CONTENT.title;
  const subtitle = section?.content.subtitle ?? WHAT_MAKES_US_SPECIAL_CONTENT.subtitle;
  const cards = section?.content.items ?? WHAT_MAKES_US_SPECIAL_CONTENT.cards;

  const toSpecialIconKey = (icon: string): SpecialIconKey => {
    const validIcons: SpecialIconKey[] = [
      "global_impact",
      "networks_partnerships",
      "sustainable_alumni",
      "innovative_programs",
      "goal_oriented",
      "holistic_development",
    ];

    return validIcons.includes(icon as SpecialIconKey) ? (icon as SpecialIconKey) : "global_impact";
  };

  return (
    <section className={specialTheme.sectionWrapper}>
      <div className={specialTheme.container}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className={specialTheme.grid}>
          {cards.map(card => {
            const Icon = resolveSpecialIcon(toSpecialIconKey(card.icon));
            return (
              <article key={card.id} className={specialTheme.card}>
                <div className={specialTheme.iconCircle}>
                  <Icon className={specialTheme.icon} />
                </div>
                <h3 className={specialTheme.cardTitle}>{card.title}</h3>
                <p className={specialTheme.cardDescription}>{card.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
