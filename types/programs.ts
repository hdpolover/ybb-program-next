// Programs page API types

export type ProgramsSectionType =
  | 'hero'
  | 'program_list'
  | 'program_overview'
  | 'registration_info'
  | 'program_activities'
  | 'program_journey'
  | 'program_important_dates'
  | 'previous_programs'
  | 'program_faqs';

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

export type ProgramJourneyItem = {
  step_number: string;
  title: string;
  description: string;
  date_display: string;
};

export type ProgramJourneySection = {
  type: 'program_journey';
  content: {
    title: string;
    subtitle: string;
    items: ProgramJourneyItem[];
  };
};

export type ProgramImportantDatesItem = {
  date_display: string;
  status: string;
  name: string;
  description: string;
  is_active: boolean;
};

export type ProgramImportantDatesSection = {
  type: 'program_important_dates';
  content: {
    title: string;
    subtitle: string;
    items: ProgramImportantDatesItem[];
  };
};

export type PreviousProgramItem = {
  id: string;
  name: string;
  slug: string;
  thumbnail: string | null;
  year: number | null;
  location: string | null;
};

export type PreviousProgramsSection = {
  type: 'previous_programs';
  content: {
    title: string;
    items: PreviousProgramItem[];
  };
};

export type ProgramFaqItem = {
  question: string;
  answer: string;
  category: string;
};

export type ProgramFaqsSection = {
  type: 'program_faqs';
  content: {
    title: string;
    items: ProgramFaqItem[];
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
  | ProgramActivitiesSection
  | ProgramJourneySection
  | ProgramImportantDatesSection
  | PreviousProgramsSection
  | ProgramFaqsSection;

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
