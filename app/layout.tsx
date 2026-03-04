import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';
import { getHomePageData } from '@/lib/api/home';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
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

export const dynamic = 'force-dynamic';

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
  let settingsData = null;

  // Fetch both in parallel for faster loading
  const [settingsResult, homeDataResult] = await Promise.allSettled([
    getSettingsForBrandDomain(host),
    getHomePageData(host),
  ]);

  if (settingsResult.status === 'fulfilled') {
    settingsData = settingsResult.value;
    const rawColor = settingsResult.value?.brand?.primary_color;
    brandAccent = normalizeHex(rawColor);
  } else {
    console.error('[Layout] Failed to load settings:', settingsResult.reason);
  }

  // Fallback to env variable or default if API returns null
  if (!brandAccent) {
    brandAccent = normalizeHex(process.env.NEXT_PUBLIC_DEFAULT_BRAND_COLOR) || '#1c57b3';
    console.log('[Layout] Using fallback theme:', brandAccent);
  } else {
    console.log('[Layout] Theme loaded from API:', brandAccent);
  }

  if (homeDataResult.status === 'fulfilled' && homeDataResult.value.slug) {
    programSlug = homeDataResult.value.slug;
  } else if (homeDataResult.status === 'rejected') {
    console.error('[Layout] Failed to fetch program data:', homeDataResult.reason);
  }

  const accent = brandAccent;
  const themeStyle =
    accent
      ? ({
          ['--brand-primary' as never]: accent,
          ['--brand-primary-foreground' as never]: pickForeground(accent),
          ['--brand-accent' as never]: accent,
          ['--brand-accent-soft' as never]: mixWithWhite(accent, 0.85),
          ['--brand-accent-foreground' as never]: pickForeground(accent),
          ['--brand-border' as never]: accent,
          ['--color-primary' as never]: accent,
          ['--color-primary-foreground' as never]: pickForeground(accent),
          ['--color-accent' as never]: accent,
          ['--color-accent-foreground' as never]: pickForeground(accent),
        } as React.CSSProperties)
      : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className} data-program={programSlug} style={themeStyle}>
        <SettingsProvider initialSettings={settingsData}>
          <PromoCTAProvider>
            <DevtoolsGuard />
            <ClientNavbarGate />
            {children}
            <ClientCTAGate />
            <BackToTop />
            <ClientChatWidgetGate />
            <ClientFooterGate />
          </PromoCTAProvider>
        </SettingsProvider>

        <Script
          src="https://aksamu.com/chat-widget.js"
          data-bot-id="4a9ea369-4638-413f-92d4-9c4600f7c6be"
          data-primary-color={accent || "#16a34a"}
          defer
        />
      </body>
    </html>
  );
}
