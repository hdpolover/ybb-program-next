export type SettingsSocialMedia = {
  instagram?: string | null;
  tiktok?: string | null;
  youtube?: string | null;
  telegram?: string | null;
  email?: string | null;
};

export type SettingsBrand = {
  name: string;
  logo_url: string | null;
  logo_white_url: string | null;
  logo_color_url: string | null;
  logo_icon_url: string | null;
  primary_color: string | null;
  description?: string | null;
  support_email: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  address: string | null;
  social_media: SettingsSocialMedia;
  google_analytics_id?: string | null;
  pixel_id?: string | null;
};

export type SettingsFooterNavItem = {
  label: string;
  url: string;
};

export type SettingsFooterNavSection = {
  title: string;
  links: SettingsFooterNavItem[];
};

export type SettingsCurrency = {
  code: string;
  rate_to_idr: number;
};

export type SettingsData = {
  maintenance: {
    is_maintenance_mode: boolean;
  };
  brand: SettingsBrand;
  footer_navigation: SettingsFooterNavSection[];
  currency: SettingsCurrency;
  active_program?: { 
    id: string; 
    name: string; 
    slug: string; 
    year?: number;
    logo_url?: string | null;
    logo_white_url?: string | null;
    logo_color_url?: string | null;
    logo_icon_url?: string | null;
  };
};
