import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Home | Japan Youth Summit',
    template: '%s | Japan Youth Summit',
  },
  description: 'International website built with Next.js',
  keywords: ['Next.js', 'React', 'TypeScript', 'International'],
  authors: [{ name: 'YBB Team' }],
  creator: 'YBB Team',
  icons: {
    icon: '/img/jyslogosolo.png',
    shortcut: '/img/jyslogosolo.png',
    apple: '/img/jyslogosolo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Home | Japan Youth Summit',
    title: 'Home | Japan Youth Summit',
    description: 'International website built with Next.js',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home | Japan Youth Summit',
    description: 'International website built with Next.js',
  },
  robots: {
    index: true,
    follow: true,
  },
};
