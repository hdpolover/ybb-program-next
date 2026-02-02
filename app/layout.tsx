import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getHomePageData } from '@/lib/api/home';
import './globals.css';
import ClientNavbarGate from '@/components/layout/ClientNavbarGate';
import ClientFooterGate from '@/components/layout/ClientFooterGate';
import { PromoCTAProvider } from '@/components/sections/PromoCTAContext';
import ClientCTAGate from '@/components/layout/ClientCTAGate';
import BackToTop from '@/components/ui/BackToTop';
import DevtoolsGuard from '@/components/layout/DevtoolsGuard';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') || 'youthacademicforum.com';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  try {
    const data = await getHomePageData(host);
    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: `Home | ${data.title}`,
        template: `%s | ${data.title}`,
      },
      description: `Official website for ${data.title}`,
      keywords: ['Next.js', 'React', 'TypeScript', 'International'],
      authors: [{ name: 'YBB Team' }],
      creator: 'YBB Team',
      icons: {
        icon: '/img/jyslogosolo.png', // This might need to be dynamic too
        shortcut: '/img/jyslogosolo.png',
        apple: '/img/jyslogosolo.png',
      },
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: `Home | ${data.title}`,
        title: `Home | ${data.title}`,
        description: `Official website for ${data.title}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Home | ${data.title}`,
        description: `Official website for ${data.title}`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (e) {
    console.error('Failed to fetch metadata', e);
    // Fallback metadata
    return {
      metadataBase: new URL(baseUrl),
      title: 'Home | Youth Summit',
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const host = headersList.get('host') || 'youthacademicforum.com';
  let programSlug = 'jys'; // Default/fallback

  try {
    const data = await getHomePageData(host);
    if (data.slug) {
      programSlug = data.slug;
    }
  } catch (e) {
    console.error('Failed to fetch program data for layout', e);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className} data-program={programSlug}>
        <PromoCTAProvider>
          <DevtoolsGuard />
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
