import { Globe2, Users, Leaf, Sparkles, Target, Lightbulb } from 'lucide-react';

export type SpecialIconKey =
  | 'global_impact'
  | 'networks_partnerships'
  | 'sustainable_alumni'
  | 'innovative_programs'
  | 'goal_oriented'
  | 'holistic_development';

export type SpecialCard = {
  id: string;
  icon: SpecialIconKey;
  title: string;
  description: string;
};

export type WhatMakesUsSpecialContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cards: SpecialCard[];
};

export const WHAT_MAKES_US_SPECIAL_CONTENT: WhatMakesUsSpecialContent = {
  eyebrow: 'Why YBB',
  title: 'What Makes us Special',
  subtitle:
    'Discover the core pillars that make YBB a unique platform for young leaders to learn, grow, and create impact together.',
  cards: [
    {
      id: 'global-impact',
      icon: 'global_impact',
      title: 'Global Impact',
      description:
        'YBB has connected young people from over 40 countries, creating rich, diverse, and insightful international learning experiences. Through its innovative programs, YBB provides a global platform where youth can interact, learn, and grow in a multicultural environment.',
    },
    {
      id: 'networks-partnerships',
      icon: 'networks_partnerships',
      title: 'Extensive Networks and Strategic Partnerships',
      description:
        'With the support of various stakeholders and strategic partners across multiple countries, YBB opens access to international collaboration opportunities, mentorship, and career development pathways.',
    },
    {
      id: 'sustainable-alumni',
      icon: 'sustainable_alumni',
      title: 'Sustainable Alumni Empowerment',
      description:
        'YBB alumni are not only successful in their respective fields but also continue to receive mentorship, access to exclusive resources, and support from a global network that strengthens their leadership and career development.',
    },
    {
      id: 'innovative-programs',
      icon: 'innovative_programs',
      title: 'Innovative and Adaptive Programs',
      description:
        'YBB continuously adapts to emerging trends, innovations, and technological advancements to ensure that its programs remain relevant, impactful, and aligned with global developments.',
    },
    {
      id: 'goal-oriented',
      icon: 'goal_oriented',
      title: 'Goal-Oriented Approach',
      description:
        'Through the 3C Framework, Connections, Collaboration, and Contribution, YBB designs programs that intentionally support young people in achieving their personal and professional goals while creating positive social impact at local and global levels.',
    },
    {
      id: 'holistic-development',
      icon: 'holistic_development',
      title: 'Holistic Youth Development',
      description:
        'YBB nurtures both personal and professional growth through leadership training, global exposure, and reflective learning, ensuring that young people develop the mindset, skills, and confidence needed to drive change in their communities.',
    },
  ],
};

export function resolveSpecialIcon(iconKey: SpecialIconKey) {
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
