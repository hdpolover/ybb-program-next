export type ProgramObjectiveItem = {
  n: string;
  title: string;
  desc: string;
};

export const PROGRAMS_OBJECTIVES_COPY: {
  eyebrow: string;
  title: string;
  items: ProgramObjectiveItem[];
} = {
  eyebrow: 'What we strive for',
  title: 'Program Objectives',
  items: [
    {
      n: '1',
      title: 'Cultivate Youth Leadership',
      desc: 'Cultivate a spirit of youth leadership and collaboration on a global scale.',
    },
    {
      n: '2',
      title: 'Encourage Innovation',
      desc: 'Encourage innovative thinking and initiative-based learning among young participants.',
    },
    {
      n: '3',
      title: 'Provide Inclusive Platform',
      desc: 'Provide an inclusive platform for youth to present real-world solutions and engage in meaningful dialogue.',
    },
    {
      n: '4',
      title: 'Establish Global Network',
      desc: 'Establish a vibrant international network that supports ongoing youth empowerment.',
    },
    {
      n: '5',
      title: 'Shape Sustainable Future',
      desc: 'Highlight the role of youth in shaping a more sustainable, inclusive, and equitable future.',
    },
  ],
};
