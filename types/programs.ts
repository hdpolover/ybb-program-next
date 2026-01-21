// Programs page API types

export type ProgramsSectionType = 'hero' | 'program_list';

export type ProgramsHeroSection = {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    bg_image: string | null;
  };
};

export type ProgramsListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  startDate: string;
  endDate: string;
  location: string;
};

export type ProgramsListSection = {
  type: 'program_list';
  data: ProgramsListItem[];
};

export type ProgramsSection = ProgramsHeroSection | ProgramsListSection;

export type ProgramsPageData = {
  slug: string;
  title: string;
  sections: ProgramsSection[];
};

export type ProgramsApiResponse = {
  statusCode: number;
  message: string;
  data: ProgramsPageData;
};
