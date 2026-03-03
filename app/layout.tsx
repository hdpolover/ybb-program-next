import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getHomePageData } from '@/lib/api/home';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import './globals.css';
import ClientNavbarGate from '@/components/layout/ClientNavbarGate';
import ClientFooterGate from '@/components/layout/ClientFooterGate';
import { PromoCTAProvider } from '@/components/sections/PromoCTAContext';
import ClientCTAGate from '@/components/layout/ClientCTAGate';
import BackToTop from '@/components/ui/BackToTop';
import DevtoolsGuard from '@/components/layout/DevtoolsGuard';
import ClientChatWidgetGate from '@/components/layout/ClientChatWidgetGate';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

function normalizeHex(input: string | null | undefined): string | null {
  const raw = (input || '').trim();
  if (!raw) return null;
  const withHash = raw.startsWith('#') ? raw : `#${raw}`;
  const hex = withHash.toLowerCase();
  return /^#[0-9a-f]{6}$/.test(hex) ? hex : null;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const r = Number.parseInt(cleaned.slice(0, 2), 16);
  const g = Number.parseInt(cleaned.slice(2, 4), 16);
  const b = Number.parseInt(cleaned.slice(4, 6), 16);
  return { r, g, b };
}

function mixWithWhite(hex: string, amount = 0.85): string {
  const { r, g, b } = hexToRgb(hex);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  return `#${[mix(r), mix(g), mix(b)]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')}`;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const rl = toLinear(r);
  const gl = toLinear(g);
  const bl = toLinear(b);
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function pickForeground(hex: string): string {
  // Threshold tuned to keep readable text on bright accents
  return relativeLuminance(hex) > 0.6 ? '#020617' : '#ffffff';
}

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

  let brandAccent: string | null = null;

  try {
    const settings = await getSettingsForBrandDomain(host);
    brandAccent = normalizeHex(settings?.brand?.primary_color);
  } catch {
    // ignore
  }

  try {
    const data = await getHomePageData(host);
    if (data.slug) {
      programSlug = data.slug;
    }
  } catch (e) {
    console.error('Failed to fetch program data for layout', e);
  }

  const accent = brandAccent;
  const themeStyle =
    accent
      ? ({
          ['--brand-accent' as never]: accent,
          ['--brand-accent-soft' as never]: mixWithWhite(accent, 0.85),
          ['--brand-accent-foreground' as never]: pickForeground(accent),
          ['--brand-border' as never]: accent,
          ['--color-accent' as never]: accent,
          ['--color-accent-foreground' as never]: pickForeground(accent),
        } as React.CSSProperties)
      : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className} data-program={programSlug} style={themeStyle}>
        <PromoCTAProvider>
          <DevtoolsGuard />
          <ClientNavbarGate />
          {children}
          <ClientCTAGate />
          <BackToTop />
          <ClientChatWidgetGate />
          <ClientFooterGate />
        </PromoCTAProvider>
      </body>
    </html>
  );
}
