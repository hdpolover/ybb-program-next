// Partners & Sponsors page API types

export type PartnersSectionType = 'hero' | 'sponsors_grid' | 'partners_grid' | 'cta_become_partner';

export type PartnersHeroSection = {
  type: 'hero';
  content: {
    headline: string;
    subheadline: string;
  };
};

export type SponsorItem = {
  id: string;
  name: string;
  logo: string;
  website: string;
  tier: string;
};

export type SponsorsGridSection = {
  type: 'sponsors_grid';
  data: SponsorItem[];
};

export type PartnersGridSection = {
  type: 'partners_grid';
  data: SponsorItem[];
};

export type CtaBecomePartnerSection = {
  type: 'cta_become_partner';
  content: {
    text: string;
    link: string;
  };
};

export type PartnersSection =
  | PartnersHeroSection
  | SponsorsGridSection
  | PartnersGridSection
  | CtaBecomePartnerSection;

export type PartnersPageData = {
  slug: string;
  title: string;
  sections: PartnersSection[];
};

export type PartnersApiResponse = {
  statusCode: number;
  message: string;
  data: PartnersPageData;
};
