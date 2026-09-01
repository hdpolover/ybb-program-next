// Announcements page API types

export type AnnouncementsSectionType = 'hero' | 'announcement_list';

export type AnnouncementsHeroSection = {
  type: 'hero';
  content: {
    headline: string;
    subheadline: string;
  };
};

// Backend shape isn't fully specified yet; keep flexible but strongly typed for known fields.
export type AnnouncementApiItem = {
  id: string;
  title?: string | null;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  author?: string | null;
  date?: string | null;
  href?: string | null;
  category?: string | null;
  tags?: string[] | null;
};

export type AnnouncementsPagination = {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
};

export type AnnouncementsFilterProgramOption = {
  id: string;
  title: string;
};

export type AnnouncementsFilterValues = {
  categories: string[];
  tags: string[];
  programs: AnnouncementsFilterProgramOption[];
};

export type AnnouncementListSection = {
  type: 'announcement_list';
  data: AnnouncementApiItem[];
  // Optional: older/mocked payloads may omit this, so callers must not assume presence.
  content?: {
    pagination: AnnouncementsPagination;
    filters: AnnouncementsFilterValues;
  };
};

export type AnnouncementsSection = AnnouncementsHeroSection | AnnouncementListSection;

export type AnnouncementsPageData = {
  slug: string;
  title: string;
  sections: AnnouncementsSection[];
};

export type AnnouncementsApiResponse = {
  statusCode: number;
  message: string;
  data: AnnouncementsPageData;
};
