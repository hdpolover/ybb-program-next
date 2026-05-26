import { Plus_Jakarta_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import Script from 'next/script';
import { getHomePageData } from '@/lib/api/home';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { resolveBrandDomain } from '@/lib/server/envContext';
import { SettingsProvider } from '@/components/providers/SettingsProvider';
import './globals.css';
import ClientNavbarGate from '@/components/layout/ClientNavbarGate';
import ClientFooterGate from '@/components/layout/ClientFooterGate';
import { PromoCTAProvider } from '@/components/sections/PromoCTAContext';
import ClientCTAGate from '@/components/layout/ClientCTAGate';
import BackToTop from '@/components/ui/BackToTop';
import ClientChatWidgetGate from '@/components/layout/ClientChatWidgetGate';
import AppVersionWatcher from '@/components/layout/AppVersionWatcher';
import RegistrationCountdownGate from '@/components/layout/RegistrationCountdownGate';
import StickyBottomBarGate from '@/components/layout/StickyBottomBarGate';
import { getProgramDetail, getProgramPricingTiers } from '@/lib/api/programs';

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
  return relativeLuminance(hex) > 0.6 ? '#020617' : '#ffffff';
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await resolveBrandDomain();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const iconVersion = encodeURIComponent(process.env.NEXT_PUBLIC_APP_BUILD_ID || 'development');
  const iconUrl = `/icon?v=${iconVersion}`;
  const appleIconUrl = `/apple-icon?v=${iconVersion}`;

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
        icon: [{ url: iconUrl, type: 'image/png' }],
        shortcut: [{ url: iconUrl, type: 'image/png' }],
        apple: [{ url: appleIconUrl, type: 'image/png' }],
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
    // Fallback
    return {
      metadataBase: new URL(baseUrl),
      title: 'Home | Youth Summit',
    };
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = await resolveBrandDomain();
  const appVersion = process.env.NEXT_PUBLIC_APP_BUILD_ID || 'development';

  let brandAccent: string | null = null;
  let settingsData = null;
  let registrationCloseDate: string | null = null;

  const [settingsResult] = await Promise.allSettled([getSettingsForBrandDomain(host)]);

  let gaId: string | null = null;

  if (settingsResult.status === 'fulfilled') {
    settingsData = settingsResult.value;
    const rawColor = settingsResult.value?.brand?.primary_color;
    brandAccent = normalizeHex(rawColor);
    gaId = settingsResult.value?.brand?.google_analytics_id || null;

    // Ambil data registrasi deadline dari tipe program yang active
    const programSlug = settingsData?.active_program?.slug || process.env.YBB_PROGRAM_SLUG?.trim();
    if (programSlug) {
      try {
        const program = await getProgramDetail(programSlug, host);
        const programId = program?.id;

        // Ambil dulu dari fully funded, klo gk ada fully funded ambil dari self funded ( jika tanggal nya sudah lewat )
        if (programId) {
          try {
            const pricingTiers = await getProgramPricingTiers(programId, host);
            const fullyFundedTier = pricingTiers?.find(
              (tier) => tier.name.toLowerCase().includes('fully funded') || tier.name.toLowerCase().includes('fully-funded')
            );
            const selfFundedTier = pricingTiers?.find(
              (tier) => tier.name.toLowerCase().includes('self funded') || tier.name.toLowerCase().includes('self-funded')
            );

            const fullyFundedEndDate = fullyFundedTier?.validityPeriods?.[0]?.endDate;
            const selfFundedEndDate = selfFundedTier?.validityPeriods?.[0]?.endDate;

            // Cek klo fully funded masih buka
            if (fullyFundedEndDate) {
              const fullyFundedDate = new Date(fullyFundedEndDate);
              const now = new Date();
              if (fullyFundedDate > now) {
                registrationCloseDate = fullyFundedEndDate;
              } else if (selfFundedEndDate) {
                // Klo udh tutup fully funded maka beralih ke self funded
                registrationCloseDate = selfFundedEndDate;
              } else {
                registrationCloseDate = program?.registrationCloseDate || null;
              }
            } else if (selfFundedEndDate) {
              registrationCloseDate = selfFundedEndDate;
            } else {
              registrationCloseDate = program?.registrationCloseDate || null;
            }
          } catch (pricingError) {
            console.error('[Layout] Failed to fetch pricing tiers:', pricingError);
            registrationCloseDate = program?.registrationCloseDate || null;
          }
        } else {
          registrationCloseDate = program?.registrationCloseDate || null;
        }
      } catch (error) {
        console.error('[Layout] Failed to fetch program detail:', error);
      }
    }
  } else {
    console.error('[Layout] Failed to load settings:', settingsResult.reason);
  }

  // fallback ke default klo emg gk ada dua dua nya
  if (!brandAccent) {
    brandAccent = normalizeHex(process.env.NEXT_PUBLIC_DEFAULT_BRAND_COLOR) || '#1c57b3';
    console.log('[Layout] Using fallback theme:', brandAccent);
  } else {
    console.log('[Layout] Theme loaded from API:', brandAccent);
  }

  const programSlug = process.env.YBB_PROGRAM_SLUG?.trim() || settingsData?.active_program?.slug || 'ybb';
  const defaultChatBotId = '4a9ea369-4638-413f-92d4-9c4600f7c6be';
  const chatBotId = process.env.NEXT_PUBLIC_CHAT_WIDGET_BOT_ID?.trim() || defaultChatBotId;

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
        <AppVersionWatcher currentVersion={appVersion} />
        <SettingsProvider initialSettings={settingsData}>
          <PromoCTAProvider>
            <ClientNavbarGate />
            <RegistrationCountdownGate registrationDeadline={registrationCloseDate} />
            {children}
            <ClientCTAGate />
            <BackToTop />
            <ClientFooterGate />
            <StickyBottomBarGate deadline={registrationCloseDate} registerUrl="/register" />
          </PromoCTAProvider>
        </SettingsProvider>

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        <ClientChatWidgetGate
          enabled={false}
          botId={chatBotId}
          primaryColor={accent || '#16a34a'}
        />
      </body>
    </html>
  );
}
