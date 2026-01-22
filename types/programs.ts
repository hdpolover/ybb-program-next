// Programs page API types

export type ProgramsSectionType =
  | 'hero'
  | 'program_list'
  | 'program_overview'
  | 'registration_info'
  | 'program_activities';

export type ProgramsHeroSection = {
  type: 'hero';
  content: {
    title: string;
    subtitle: string;
    bg_image: string | null;
  };
};

export type ProgramOverviewSubtheme = {
  id: string;
  title: string;
  description: string;
};

export type ProgramOverviewGuidebook = {
  label: string;
  url: string;
};

export type ProgramOverviewSection = {
  type: 'program_overview';
  content: {
    description: string | null;
    theme: string | null;
    subthemes: ProgramOverviewSubtheme[] | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    duration: string | null;
    guidebooks: ProgramOverviewGuidebook[] | null;
  };
};

export type RegistrationInfoPricingTier = {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  benefits: string[];
  fee_type: 'full_fee' | 'registration_fee' | string;
  target: 'self_funded' | 'fully_funded' | string;
};

export type RegistrationInfoInstruction = {
  title: string;
  icon: string;
  text: string;
};

export type RegistrationInfoSection = {
  type: 'registration_info';
  content: {
    title: string;
    description: string;
    status: string;
    registration_dates: {
      open: string | null;
      close: string | null;
    } | null;
    pricing_tiers: RegistrationInfoPricingTier[];
    instructions: RegistrationInfoInstruction[];
  };
};

export type ProgramActivitiesItem = {
  day: string;
  title: string;
  date: string;
  time_range: string;
  duration: string;
  description: string;
  checklist: string[];
};

export type ProgramActivitiesSection = {
  type: 'program_activities';
  content: {
    title: string;
    subtitle: string;
    items: ProgramActivitiesItem[];
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

export type ProgramsSection =
  | ProgramsHeroSection
  | ProgramsListSection
  | ProgramOverviewSection
  | RegistrationInfoSection
  | ProgramActivitiesSection;

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
