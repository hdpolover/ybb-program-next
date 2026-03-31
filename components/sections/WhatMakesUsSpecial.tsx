"use client";

import { Globe2, Users, Leaf, Sparkles, Target, Lightbulb } from 'lucide-react';
import { componentsTheme } from "@/lib/theme/components";
import SectionHeader from "@/components/ui/SectionHeader";
import type { ProgramFeaturesSection } from "@/types/home";

type SpecialIconKey =
  | 'global_impact'
  | 'networks_partnerships'
  | 'sustainable_alumni'
  | 'innovative_programs'
  | 'goal_oriented'
  | 'holistic_development';

function resolveSpecialIcon(iconKey: string) {
  switch (iconKey) {
    case 'global_impact':
      return Globe2;
    case 'networks_partnerships':
      return Users;
    case 'sustainable_alumni':
      return Leaf;
    case 'innovative_programs':
      return Sparkles;
    case 'goal_oriented':
      return Target;
    case 'holistic_development':
      return Lightbulb;
    default:
      return Globe2;
  }
}

const specialTheme = componentsTheme.homeWhatMakesSpecial;

interface Props {
  section?: ProgramFeaturesSection;
}

export default function WhatMakesUsSpecialSection({ section }: Props) {
  if (!section) return null;

  const { eyebrow, title, subtitle, items: cards } = section.content;

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
