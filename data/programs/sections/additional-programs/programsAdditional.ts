export type AdditionalProgramItem = {
  title: string;
  dates: string;
  cover: string;
  logo: string;
  href?: string;
};

export const PROGRAMS_ADDITIONAL_COPY: {
  headerTitle: string;
  subtitle: string;
  items: AdditionalProgramItem[];
} = {
  headerTitle: 'Our Additional Programs',
  subtitle: 'Explore more programs you can join soon',
  items: [
    {
      title: 'World Youth Fest 2025',
      dates: 'October 06  –  October 09, 2025',
      cover: '/img/WYScover.png',
      logo: '/img/WYSlogo.png',
    },
    {
      title: 'Middle East Youth Summit 2025',
      dates: 'December 01  –  December 04, 2025',
      cover: '/img/MEYScover.png',
      logo: '/img/MEYSlogo.png',
    },
    {
      title: 'Youth Academic Forum 2025',
      dates: 'December 08  –  December 11, 2025',
      cover: '/img/YAFcover.png',
      logo: '/img/YAFlogo.png',
    },
    {
      title: 'Korea Youth Summit 2026',
      dates: 'February 02  –  February 05, 2026',
      cover: '/img/KYScover.png',
      logo: '/img/KYSlogo.png',
    },
    {
      title: 'Istanbul Youth Summit 2026',
      dates: 'February 09  –  February 12, 2026',
      cover: '/img/IYScover.jpg',
      logo: '/img/IYSlogo.png',
    },
  ],
};
