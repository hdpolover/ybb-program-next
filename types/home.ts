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
  | 'further_information'
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

export type RegistrationType = {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  currency: string;
  fee_type?: string;
  allowed_categories?: Array<'self_funded' | 'fully_funded' | string>;
  requirements?: string[];
  benefits: string[];
  validity_periods?: {
    start_date: string;
    end_date: string;
  }[];
};

// One currently-relevant program edition (MEYS 6th/7th concurrent-active-
// programs bug: a brand can have more than one published+active program
// with open registration at once). Additive on top of the single-program
// fields below, which stay driven by the brand's resolved active program.
export type RegistrationProgramEdition = {
  program_id: string;
  program_name: string;
  program_slug: string;
  year: number;
  status: 'open' | 'closed';
  registration_dates: {
    open: string | null;
    close: string | null;
  };
  // Event dates. Optional because a cached home payload built before this
  // field existed will not carry it.
  program_dates?: {
    start: string | null;
    end: string | null;
  };
  registration_types: RegistrationType[];
  /** Per-edition guidebook (see FurtherInformation's SelectedEditionContext wiring). */
  guidelines?: {
    id: string;
    title: string;
    type: string;
    url: string;
  }[];
};

export type RegistrationOverviewSection = {
  type: 'registration_overview';
  content: {
    ig_feed: {
      id: string;
      permalink: string;
      imageUrl?: string | null;
      caption?: string | null;
      embedHtml?: string | null;
    }[];
    registration_types: RegistrationType[];
    guidelines: {
      id: string;
      title: string;
      type: string;
      url: string;
    }[];
    programs?: RegistrationProgramEdition[];
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
    background_image_url?: string;
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
			alumni_year: number | null;
		}[];
	};
};

export type ProgramGallerySection = {
	type: 'program_gallery';
	content: {
		title: string;
		description: string;
		gallery?: {
			id: string;
			url: string;
			caption: string;
		}[];
		images?: {
			id: string;
			url: string;
			caption: string;
		}[];
		// Untruncated pool for the full /programs/gallery page; `gallery`/`images`
		// above stay capped at 12 for the homepage teaser.
		full_gallery?: {
			id: string;
			url: string;
			caption: string;
		}[];
		// Per-edition tabs, same shape as `program_highlight_videos`' `tabs`.
		// Optional: a payload cached before the tabs shipped has none, and the
		// gallery falls back to the flat `gallery`/`images` list.
		tabs?: {
			program_id: string;
			program_name: string;
			year: number | null;
			is_active: boolean;
			gallery: {
				id: string;
				url: string;
				caption: string;
			}[];
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
		eyebrow?: string;
		title: string;
		intro?: string;
		items: {
			id: string;
			description: string;
			order: number;
		}[];
		gallery?: {
			url: string;
			caption: string;
		}[];
		images?: {
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
    background_image_url?: string | null;
    /** 'dark' = dark text (default); 'light' = white text for dark backgrounds */
    text_color_scheme?: 'light' | 'dark';
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
    background_image_url?: string | null;
    background_image_mobile_url?: string | null;
    /** 'dark' = dark text (default); 'light' = white text for dark backgrounds */
    text_color_scheme?: 'light' | 'dark';
  };
};

export type QuoteTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  country: string;
  photo: string;
  year: number | null;
};

export type DelegateTestimonialsSection = {
  type: 'delegate_testimonials';
  content: {
    items: QuoteTestimonial[];
    // category: 'speaker' rows. Optional so a cached payload predating the
    // speaker query still type-checks; the section falls back to delegates-only.
    speakers?: QuoteTestimonial[];
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

export type FurtherInformationSection = {
  type: 'further_information';
  content: {
    eyebrow: string;
    title: string;
    subtitle: string;
    background_image_url: string | null;
    background_image_mobile_url: string | null;
    mockup_image_url: string | null;
    /** 'dark' = dark text (default); 'light' = white text for dark backgrounds */
    text_color_scheme?: 'light' | 'dark';
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
    background_image_url: string | null;
    background_image_mobile_url: string | null;
    video_url: string | null;
    video_title: string | null;
    video_description: string | null;
    /** 'dark' = dark text (default); 'light' = white text for dark backgrounds */
    text_color_scheme?: 'light' | 'dark';
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
  | FurtherInformationSection
  | PromoCTASection;

export type ProgramHighlightsSection = {
  type: 'program_highlights';
  content: {
    gallery?: {
      url: string;
      caption: string;
      type: string;
    }[];
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
