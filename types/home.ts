// Home page API types

export type HomeSectionType =
  | 'main_banner'
  | 'registration_overview'
  | 'program_overview'
  | 'program_highlights'
  | 'program_objectives'
  | 'program_gallery'
  | 'program_highlight_videos'
  | 'program_shorts'
  | 'program_impact'
  | 'program_features'
  | 'program_benefits'
  | 'alumni_stories'
  | 'delegate_testimonials'
  | 'program_awards'
  | 'organization_credentials'
  | 'payment_info'
  | 'supported_by'
  | 'participant_demographics'
  | 'promo_cta';

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
      validity_periods?: {
        start_date: string;
        end_date: string;
      }[];
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
			type: 'video' | 'quote' | 'text';
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

export type ProgramShortsSection = {
  type: 'program_shorts';
  content: {
    eyebrow: string;
    title: string;
    description: string;
    items: { id: string; title: string | null; embed_url: string | null }[];
  };
};

export type ProgramImpactSection = {
  type: 'program_impact';
  content: {
    eyebrow: string;
    title: string;
    stats: { id: string; label: string; value: string; icon: 'participants' | 'countries' | 'alumni' }[];
  };
};

export type ProgramFeaturesSection = {
  type: 'program_features';
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { id: string; icon: string; title: string; description: string }[];
  };
};

export type ProgramBenefitsSection = {
  type: 'program_benefits';
  content: {
    eyebrow: string;
    title: string;
    groups: { id: string; title: string; imageUrl: string; items: string[] }[];
  };
};

export type DelegateTestimonialsSection = {
  type: 'delegate_testimonials';
  content: {
    items: {
      id: string;
      name: string;
      role: string;
      quote: string;
      country: string;
      photo: string;
      year: number;
    }[];
  };
};

export type OrganizationCredentialsSection = {
  type: 'organization_credentials';
  content: {
    title: string;
    subtitle: string;
    proofs: {
      iconKey: string;
      title: string;
      subtitle: string;
      bullets?: string[];
    }[];
    trademark: {
      href: string;
      brand: string;
      regNo: string;
      status: string;
      classText: string;
      owner: string;
      logoUrl: string;
    } | null;
  };
};

export type PaymentInfoSection = {
  type: 'payment_info';
  content: {
    eyebrow: string;
    title: string;
    introText: string;
    items: { id: string; icon: string; title: string; body: string }[];
    note: string;
  };
};

export type ParticipantDemographicsSection = {
  type: 'participant_demographics';
  content: {
    eyebrow: string;
    title: string;
    country_levels: Record<string, 'high' | 'medium' | 'low' | 'none'>;
    country_participants: Record<string, number>;
    legend: {
      high: string;
      medium: string;
      low: string;
      none: string;
    };
  };
};

export type PromoCTASection = {
  type: 'promo_cta';
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primary_cta_label: string;
    primary_cta_href: string;
    video_url: string | null;
    video_title: string | null;
    video_description: string | null;
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
	| ProgramShortsSection
	| ProgramImpactSection
	| ProgramFeaturesSection
	| ProgramBenefitsSection
	| AlumniStoriesSection
	| DelegateTestimonialsSection
	| ProgramAwardsSection
	| OrganizationCredentialsSection
	| PaymentInfoSection
	| SupportedBySection
	| ParticipantDemographicsSection
	| PromoCTASection;

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
