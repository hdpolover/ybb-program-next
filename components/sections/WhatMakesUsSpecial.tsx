"use client";

import { jysSectionTheme } from "@/lib/theme/jys-components";
import SectionHeader from "@/components/ui/SectionHeader";
import { WHAT_MAKES_US_SPECIAL_CONTENT, resolveSpecialIcon } from "@/data/home/sections/what-makes-us-special/whatMakesUsSpecial";

const specialTheme = jysSectionTheme.homeWhatMakesSpecial;

export default function WhatMakesUsSpecialSection() {
  const content = WHAT_MAKES_US_SPECIAL_CONTENT;

  return (
    <section className={specialTheme.sectionWrapper}>
      <div className={specialTheme.container}>
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={content.subtitle}
          align="center"
        />

        <div className={specialTheme.grid}>
          {content.cards.map(card => {
            const Icon = resolveSpecialIcon(card.icon);
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
