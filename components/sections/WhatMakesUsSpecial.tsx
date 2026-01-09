"use client";

import { Globe2, Users, Leaf, Sparkles, Target, Lightbulb } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import SectionHeader from "@/components/ui/SectionHeader";

const specialTheme = jysSectionTheme.homeWhatMakesSpecial;

const CARDS = [
  {
    title: "Global Impact",
    icon: Globe2,
    description:
      "YBB has connected young people from over 40 countries, creating rich, diverse, and insightful international learning experiences. Through its innovative programs, YBB provides a global platform where youth can interact, learn, and grow in a multicultural environment.",
  },
  {
    title: "Extensive Networks and Strategic Partnerships",
    icon: Users,
    description:
      "With the support of various stakeholders and strategic partners across multiple countries, YBB opens access to international collaboration opportunities, mentorship, and career development pathways.",
  },
  {
    title: "Sustainable Alumni Empowerment",
    icon: Leaf,
    description:
      "YBB alumni are not only successful in their respective fields but also continue to receive mentorship, access to exclusive resources, and support from a global network that strengthens their leadership and career development.",
  },
  {
    title: "Innovative and Adaptive Programs",
    icon: Sparkles,
    description:
      "YBB continuously adapts to emerging trends, innovations, and technological advancements to ensure that its programs remain relevant, impactful, and aligned with global developments.",
  },
  {
    title: "Goal-Oriented Approach",
    icon: Target,
    description:
      "Through the 3C Framework, Connections, Collaboration, and Contribution, YBB designs programs that intentionally support young people in achieving their personal and professional goals while creating positive social impact at local and global levels.",
  },
  {
    title: "Holistic Youth Development",
    icon: Lightbulb,
    description:
      "YBB nurtures both personal and professional growth through leadership training, global exposure, and reflective learning, ensuring that young people develop the mindset, skills, and confidence needed to drive change in their communities.",
  },
];

export default function WhatMakesUsSpecialSection() {
  return (
    <section className={specialTheme.sectionWrapper}>
      <div className={specialTheme.container}>
        <SectionHeader
          eyebrow="Why YBB"
          title="What Makes us Special"
          subtitle="Discover the core pillars that make YBB a unique platform for young leaders to learn, grow, and create impact together."
          align="center"
        />

        <div className={specialTheme.grid}>
          {CARDS.map(card => {
            const Icon = card.icon;
            return (
              <article key={card.title} className={specialTheme.card}>
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
