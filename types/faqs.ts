// FAQs page API types

export type FaqsSectionType = 'hero' | 'faq_list' | 'cta_support';

export type FaqsHeroSection = {
  type: 'hero';
  content: {
    title: string;
    subheadline: string;
    bg_image: string | null;
  };
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
};

export type FaqListSection = {
  type: 'faq_list';
  content: {
    items: FaqItem[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
};

export type CtaSupportSection = {
  type: 'cta_support';
  content: {
    title: string;
    description: string;
    button_text: string;
    action_url: string;
    video_url?: string | null;
    video_title?: string | null;
    video_description?: string | null;
  };
};

export type FaqsSection = FaqsHeroSection | FaqListSection | CtaSupportSection;

export type FaqsPageData = {
  slug: string;
  title: string;
  sections: FaqsSection[];
};

export type FaqsApiResponse = {
  statusCode: number;
  message: string;
  data: FaqsPageData;
};
