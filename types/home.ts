// Home page API types

export type HomeSectionType =
  | 'main_banner'
  | 'registration_overview'
  | 'program_overview'
  | 'program_highlights'
  | 'program_objectives'
  | 'program_gallery'
  | 'program_highlight_videos'
  | 'alumni_stories'
  | 'program_awards'
  | 'supported_by';

export type MainBannerSection = {
  type: 'main_banner';
  content: {
    imageUrl: string;
    link: string;
    title: string;
    subtitle: string;
  };
};

export type RegistrationOverviewSection = {
  type: 'registration_overview';
  content: {
    ig_feed: {
      id: string;
      permalink: string;
      imageUrl: string;
      caption: string;
    }[];
    registration_types: {
      id: string;
      name: string;
      price: string;
      currency: string;
      benefits: string[];
    }[];
    guidelines: {
      id: string;
      title: string;
      type: string;
      url: string;
    }[];
  };
};

export type ProgramOverviewSection = {
  type: 'program_overview';
  content: {
    about_us: string;
    vision_mission: {
      vision: string;
      mission: string;
    };
  };
};

export type AlumniStoriesSection = {
	type: 'alumni_stories';
	content: {
		title: string;
		subtitle: string;
		items: {
			id: string;
			name: string;
			role: string;
			testimonial: string;
			type: 'video' | 'quote';
			video_url: string | null;
			thumbnail_url: string | null;
			avatar_url: string | null;
			is_featured: boolean;
		}[];
	};
};

export type ProgramGallerySection = {
	type: 'program_gallery';
	content: {
		title: string;
		description: string;
		images: {
			id: string;
			url: string;
			caption: string;
		}[];
		cta: {
			label: string;
			url: string;
		};
	};
};

export type SupportedBySection = {
	type: 'supported_by';
	data: {
		id: string;
		name: string;
		logoUrl: string;
		websiteUrl: string;
		type: string;
		tier: string;
	}[];
};

export type ProgramAwardsSection = {
	type: 'program_awards';
	content: {
		title: string;
		subtitle: string;
		items: {
			id: string;
			name: string;
			description: string;
			winner_count: number;
			tags: string[];
			color: string;
			icon_url: string | null;
		}[];
	};
};

export type ProgramObjectivesSection = {
	type: 'program_objectives';
	content: {
		title: string;
		items: {
			id: string;
			description: string;
			order: number;
		}[];
		images: {
			url: string;
			caption: string;
		}[];
	};
};

export type ProgramHighlightVideosSection = {
	type: 'program_highlight_videos';
	content: {
		title: string;
		subtitle: string;
		tabs: {
			year: number;
			program_name: string;
			videos: {
				id: string;
				title: string;
				description: string;
				thumbnail: string;
				video_url: string;
			}[];
		}[];
	};
};

export type HomeSection =
	| MainBannerSection
	| RegistrationOverviewSection
	| ProgramOverviewSection
	| ProgramHighlightsSection
	| ProgramObjectivesSection
	| ProgramGallerySection
	| ProgramHighlightVideosSection
	| AlumniStoriesSection
	| ProgramAwardsSection
	| SupportedBySection;

export type ProgramHighlightsSection = {
  type: 'program_highlights';
  content: {
    image_gallery: {
      url: string;
      caption: string;
      type: string;
    }[];
    content: {
      title: string;
      items: string[];
    };
  };
};

export type HomePageData = {
  slug: string;
  title: string;
  sections: HomeSection[];
};

export type HomeApiResponse = {
  statusCode: number;
  message: string;
  data: HomePageData;
};
