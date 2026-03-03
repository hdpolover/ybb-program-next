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
    'Japan Youth Summit brings together young leaders from around the world to co-create sustainable solutions, build meaningful connections, and celebrate cultural diversity in Japan.',
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
      label: 'info@jys.org',
      href: 'mailto:info@jys.org',
    },
    {
      id: 'instagram',
      label: '@japanyouthsummit',
      href: 'https://instagram.com/japanyouthsummit',
    },
    {
      id: 'tiktok',
      label: '@japanyouthsummit',
      href: 'https://www.tiktok.com/@japanyouthsummit',
    },
    {
      id: 'youtube',
      label: 'japanyouthsummit',
      href: 'https://www.youtube.com/@japanyouthsummit',
    },
    {
      id: 'telegram',
      label: 't.me/japanyouthsummit',
      href: 'https://t.me/japanyouthsummit',
    },
    {
      id: 'location',
      label: 'Ngaglik, Sleman, Yogyakarta, Indonesia',
    },
  ],
};
