export type FooterNavItem = {
  label: string;
  href: string;
};

export type FooterSocialItem = {
  id: 'email' | 'instagram' | 'tiktok' | 'youtube' | 'telegram' | 'location';
  label: string;
  href?: string;
};

export type FooterCopy = {
  description: string;
  menuTitle: string;
  contactTitle: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterInputPlaceholder: string;
  newsletterCtaLabel: string;
  copyright: string;
  nav: FooterNavItem[];
  programPages: FooterNavItem[];
  socials: FooterSocialItem[];
};

export const FOOTER_COPY: FooterCopy = {
  description:
    'Youth Break the Boundaries brings together young leaders from around the world to co-create sustainable solutions, build meaningful connections, and celebrate cultural diversity.',
  menuTitle: 'Menu',
  contactTitle: 'Contact Us',
  newsletterTitle: 'Subscribe to Our Newsletter',
  newsletterBody:
    'Get updates about important dates, program announcements, and opportunities directly in your inbox.',
  newsletterInputPlaceholder: 'Enter your email',
  newsletterCtaLabel: 'Subscribe',
  copyright: '\u00a9 Hilmi Farrel Firjatullah x YBB. All rights reserved.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Programs', href: '/programs' },
    { label: 'Partners & Sponsors', href: '/partners' },
    { label: 'Announcements', href: '/announcements' },
    { label: 'FAQ', href: '/faq' },
  ],
  programPages: [
    { label: 'Program Overview', href: '/programs' },
    { label: 'Insight & Analytics', href: '/programs/insights' },
    { label: 'Photo Gallery', href: '/programs/gallery' },
    { label: 'Testimonials', href: '/programs/testimonials' },
  ],
  socials: [
    {
      id: 'email',
      label: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@youthbreaktheboundaries.com',
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@youthbreaktheboundaries.com'}`,
    },
    {
      id: 'instagram',
      label: '@youthbreaktheboundaries',
      href: 'https://instagram.com/youthbreaktheboundaries',
    },
    {
      id: 'tiktok',
      label: '@youthbreaktheboundaries',
      href: 'https://www.tiktok.com/@youthbreaktheboundaries',
    },
    {
      id: 'youtube',
      label: 'YouthBreakTheBoundaries',
      href: 'https://www.youtube.com/@youthbreaktheboundaries',
    },
    {
      id: 'telegram',
      label: 't.me/youthbreaktheboundaries',
      href: 'https://t.me/youthbreaktheboundaries',
    },
    {
      id: 'location',
      label: 'Ngaglik, Sleman, Yogyakarta, Indonesia',
    },
  ],
};
