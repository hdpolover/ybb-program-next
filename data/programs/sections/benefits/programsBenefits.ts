export type ProgramBenefitItem = {
  key: string;
  title: string;
  desc: string;
  icon: 'globe' | 'leader' | 'handshake' | 'network' | 'academic' | 'culture';
};

export const PROGRAMS_BENEFITS_COPY: {
  eyebrow: string;
  title: string;
  items: ProgramBenefitItem[];
} = {
  eyebrow: 'Why join us',
  title: 'Delegate Benefits',
  items: [
    {
      key: 'insights',
      title: 'Global Insights',
      desc: "Attend impactful sessions led by global leaders, professionals, and innovators addressing today's most pressing challenges from diverse perspectives.",
      icon: 'globe',
    },
    {
      key: 'leadership',
      title: 'Leadership & Vision',
      desc: 'Join leadership forums and strategic discussions designed to sharpen your critical thinking and equip you to become an effective changemaker.',
      icon: 'leader',
    },
    {
      key: 'collab',
      title: 'Cross-Cultural Collaboration',
      desc: 'Work alongside youth from various countries to co-create innovative ideas and solutions that empower local and global communities.',
      icon: 'handshake',
    },
    {
      key: 'network',
      title: 'Global Network',
      desc: 'Connect with influential individuals, youth leaders, and professionals, building lasting relationships through shared goals and mutual collaboration.',
      icon: 'network',
    },
    {
      key: 'academic',
      title: 'Academic Pathways',
      desc: 'Discover opportunities for higher education and international scholarships, including information sessions on leading universities and global programs.',
      icon: 'academic',
    },
    {
      key: 'culture',
      title: 'Cultural Experience',
      desc: 'Experience the cultural richness of Istanbul through guided visits to its iconic sites, offering insights into its historical significance and global legacy.',
      icon: 'culture',
    },
  ],
};
