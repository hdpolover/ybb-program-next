export type PartnersWhyIconKey =
  | 'global_reach'
  | 'innovation_focus'
  | 'brand_visibility'
  | 'social_impact';

export type PartnersWhyItem = {
  id: string;
  icon: PartnersWhyIconKey;
  title: string;
  description: string;
};

export type PartnersWhyContent = {
  eyebrow: string;
  title: string;
  items: PartnersWhyItem[];
  ctaLabel: string;
};

export const PARTNERS_WHY_CONTENT: PartnersWhyContent = {
  eyebrow: 'Why Partner With Us?',
  title: 'Grow impact together with us',
  items: [
    {
      id: 'global-reach',
      icon: 'global_reach',
      title: 'Global Reach',
      description: 'Connect with 4,000+ young leaders from 120+ countries',
    },
    {
      id: 'innovation-focus',
      icon: 'innovation_focus',
      title: 'Innovation Focus',
      description: 'Support cutting-edge projects and social impact initiatives',
    },
    {
      id: 'brand-visibility',
      icon: 'brand_visibility',
      title: 'Brand Visibility',
      description: 'Enhance your brand presence among future leaders',
    },
    {
      id: 'social-impact',
      icon: 'social_impact',
      title: 'Social Impact',
      description: 'Make a lasting difference in youth development worldwide',
    },
  ],
  ctaLabel: 'Join Our Network',
};
