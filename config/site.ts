import type { Locale } from '@/types';

export const siteConfig = {
  name: 'Home | Youth Summit',
  description: 'International website built with Next.js',
  // This is a static fallback. For multi-tenant features, use request headers.
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
  },
  locales: {
    en: {
      name: 'English',
      flag: '🇺🇸',
    },
    id: {
      name: 'Bahasa Indonesia',
      flag: '🇮🇩',
    },
  } as Record<Locale, { name: string; flag: string }>,
} as const;
