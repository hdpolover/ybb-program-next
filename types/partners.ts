// Partners & Sponsors page API types

// The partners payload carries the same platform-wide `program_impact` section
// the home payload does (one PlatformSetting row, one builder in the API), so
// reuse that type instead of declaring a second, driftable copy.
import type { ProgramImpactSection } from '@/types/home';

export type PartnersSectionType = 'hero' | 'sponsors_grid' | 'partners_grid' | 'cta_become_partner' | 'canva_embed' | 'program_impact';

export type PartnersHeroSection = {
  type: 'hero';
  content: {
    headline: string;
    subheadline: string;
  };
};

export type CanvaEmbedSection = {
  type: 'canva_embed';
  content: {
    url: string;
    // Null for the legacy brand-level fallback embed (pre per-program
    // migration); set for every per-program embed.
    program_id?: string | null;
    program_name?: string | null;
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
    video_url?: string | null;
    video_title?: string | null;
    video_description?: string | null;
    affiliate_commission?: {
      fully_funded_pct: number;
      self_funded_pct: number;
    } | null;
    sponsorship_tiers?: {
      silver?: string | null;
      gold?: string | null;
      diamond?: string | null;
    } | null;
  };
};

export type PartnersSection =
  | PartnersHeroSection
  | CanvaEmbedSection
  | SponsorsGridSection
  | PartnersGridSection
  | CtaBecomePartnerSection
  | ProgramImpactSection;

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
