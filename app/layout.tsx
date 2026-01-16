import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import ClientNavbarGate from '@/components/layout/ClientNavbarGate';
import ClientFooterGate from '@/components/layout/ClientFooterGate';
import { PromoCTAProvider } from '@/components/sections/PromoCTAContext';
import ClientCTAGate from '@/components/layout/ClientCTAGate';
import BackToTop from '@/components/ui/BackToTop';
import DevtoolsGuard from '@/components/layout/DevtoolsGuard';
import PageTransitionOverlay from '@/components/layout/PageTransitionOverlay';
import { headers } from 'next/headers';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'youthacademicforum.com';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // In a real implementation, you might fetch brand-specific metadata from your API here
  // using the host to lookup the program settings

  return {
    metadataBase: new URL(baseUrl),
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
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className} data-program="jys">
        <PromoCTAProvider>
          <DevtoolsGuard />
          <PageTransitionOverlay />
          <ClientNavbarGate />
          {children}
          <ClientCTAGate />
          <BackToTop />
          <ClientFooterGate />
        </PromoCTAProvider>
      </body>
    </html>
  );
}
