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
  image?: string | null;
  author?: string | null;
  date?: string | null;
  href?: string | null;
  category?: string | null;
};

export type AnnouncementListSection = {
  type: 'announcement_list';
  data: AnnouncementApiItem[];
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
