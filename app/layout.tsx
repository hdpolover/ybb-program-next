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
import BackToHome from '@/components/ui/BackToHome';
import ClientChatWidgetGate from '@/components/layout/ClientChatWidgetGate';
import AppVersionWatcher from '@/components/layout/AppVersionWatcher';
import RegistrationCountdownGate from '@/components/layout/RegistrationCountdownGate';
import StickyBottomBarGate from '@/components/layout/StickyBottomBarGate';
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton';
import { getProgramDetail, getProgramPricingTiers } from '@/lib/api/programs';
import { resolveActiveRegistration, RegistrationCategory } from '@/lib/registration/deadline';

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
  let activeProgramSlug = process.env.YBB_PROGRAM_SLUG?.trim() || null;
  let registerUrl = '/register';
  let activeCategory: RegistrationCategory | null = null;

  const [settingsResult] = await Promise.allSettled([getSettingsForBrandDomain(host)]);

  let gaId: string | null = null;
  let pixelId: string | null = null;

  if (settingsResult.status === 'fulfilled') {
    settingsData = settingsResult.value;
    const rawColor = settingsResult.value?.brand?.primary_color;
    brandAccent = normalizeHex(rawColor);
    gaId = settingsResult.value?.brand?.google_analytics_id || null;
    pixelId = settingsResult.value?.brand?.pixel_id || null;

    // Derive the registration deadline from the program's registration-fee
    // windows: fully funded close first, then self funded once fully funded
    // has passed. Falls back to the program-level field when tiers are absent.
    activeProgramSlug = settingsData?.active_program?.slug?.trim() || activeProgramSlug;
    if (activeProgramSlug) {
      try {
        const program = await getProgramDetail(activeProgramSlug, host);
        let tierDeadline: string | null = null;
        if (program?.id) {
          try {
            const pricingTiers = await getProgramPricingTiers(program.id, host);
            const activeRegistration = resolveActiveRegistration(pricingTiers, new Date());
            if (activeRegistration) {
              tierDeadline = activeRegistration.deadline;
              activeCategory = activeRegistration.category;
            }
          } catch (tierError) {
            console.error('[Layout] Failed to fetch pricing tiers:', tierError);
          }
        }
        registrationCloseDate = tierDeadline ?? program?.registrationCloseDate ?? null;
      } catch (error) {
        console.error('[Layout] Failed to fetch program detail:', error);
      }
    }

    if (activeCategory === 'fully_funded') {
      registerUrl = '/login?applicationCategory=fully_funded';
    } else if (activeCategory === 'self_funded') {
      registerUrl = '/login?applicationCategory=self_funded';
    }
  } else {
    console.error('[Layout] Failed to load settings:', settingsResult.reason);
  }

  if (!brandAccent) {
    brandAccent = normalizeHex(process.env.NEXT_PUBLIC_DEFAULT_BRAND_COLOR) || '#1c57b3';
  }

  const programSlug = activeProgramSlug || 'ybb';
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
            <RegistrationCountdownGate
              registrationDeadline={registrationCloseDate}
              activeProgramSlug={activeProgramSlug}
            />
            {children}
            <ClientCTAGate />
            <BackToHome />
            <BackToTop />
            <ClientFooterGate />
            <StickyBottomBarGate
              deadline={registrationCloseDate}
              registerUrl={registerUrl}
              activeProgramSlug={activeProgramSlug}
            />
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

        {pixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                alt=""
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}

        <ClientChatWidgetGate
          enabled={false}
          botId={chatBotId}
          primaryColor={accent || '#16a34a'}
        />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
