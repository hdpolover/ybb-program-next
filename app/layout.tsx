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
import { getProgramDetail, getProgramPricingTiers, type ProgramPricingTier } from '@/lib/api/programs';
import {
  resolveActiveRegistration,
  resolveRegistrationCountdownDeadline,
  resolveCountdownAcrossPrograms,
  resolveOpenWindowCountdown,
  RegistrationCategory,
} from '@/lib/registration/deadline';
import type { RegistrationOverviewSection } from '@/types/home';

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
  let countdownProgramName: string | null = null;
  let activeProgramSlug = process.env.YBB_PROGRAM_SLUG?.trim() || null;
  let registerUrl = '/login?mode=signup';
  let activeCategory: RegistrationCategory | null = null;

  // Settings and the home payload are independent, so fire them together
  // rather than serializing four backend round trips per page render.
  const [settingsResult, homeResult] = await Promise.allSettled([
    getSettingsForBrandDomain(host),
    getHomePageData(host),
  ]);

  let gaId: string | null = null;
  let pixelId: string | null = null;

  if (settingsResult.status === 'fulfilled') {
    settingsData = settingsResult.value;
    const rawColor = settingsResult.value?.brand?.primary_color;
    brandAccent = normalizeHex(rawColor);
    gaId = settingsResult.value?.brand?.google_analytics_id || null;
    pixelId = settingsResult.value?.brand?.pixel_id || null;

    // Deadline shown by the homepage countdown/gates: the program's own
    // registrationCloseDate always wins when set (see resolveRegistrationCountdownDeadline
    // for the incident this precedence fixes). The pricing-tier deadline is
    // only a fallback for brands whose program has no registrationCloseDate.
    activeProgramSlug = settingsData?.active_program?.slug?.trim() || activeProgramSlug;
    if (activeProgramSlug) {
      // Settings already carries the active program id, so the tiers call does
      // not have to wait on program detail to learn it. Only the env-slug path
      // (no active_program in settings) still needs the id from the detail call.
      const settingsProgramId = settingsData?.active_program?.id?.trim() || null;
      const [programResult, tiersResult] = await Promise.allSettled([
        getProgramDetail(activeProgramSlug, host),
        settingsProgramId
          ? getProgramPricingTiers(settingsProgramId, host)
          : Promise.resolve<ProgramPricingTier[]>([]),
      ]);

      if (programResult.status === 'rejected') {
        console.error('[Layout] Failed to fetch program detail:', programResult.reason);
      }
      if (tiersResult.status === 'rejected') {
        console.error('[Layout] Failed to fetch pricing tiers:', tiersResult.reason);
      }

      const program = programResult.status === 'fulfilled' ? programResult.value : null;
      let pricingTiers = tiersResult.status === 'fulfilled' ? tiersResult.value : [];
      if (!settingsProgramId && program?.id) {
        pricingTiers = await getProgramPricingTiers(program.id, host).catch((tierError) => {
          console.error('[Layout] Failed to fetch pricing tiers:', tierError);
          return [];
        });
      }

      let tierDeadline: string | null = null;
      const activeRegistration = resolveActiveRegistration(pricingTiers, new Date());
      if (activeRegistration) {
        tierDeadline = activeRegistration.deadline;
        activeCategory = activeRegistration.category;
      }
      registrationCloseDate = resolveRegistrationCountdownDeadline(
        program?.registrationCloseDate,
        tierDeadline,
      );
    }

    if (activeCategory === 'fully_funded') {
      registerUrl = '/login?mode=signup&applicationCategory=fully_funded';
    } else if (activeCategory === 'self_funded') {
      registerUrl = '/login?mode=signup&applicationCategory=self_funded';
    }

    // Count down to the soonest registration window that is OPEN RIGHT NOW,
    // across every edition and category, and name it. The program level close
    // date describes when the programme stops accepting people, not when the
    // next thing a visitor can act on shuts: MEYS advertised 96 days to 5 Dec
    // while fully funded actually closed that same evening.
    //
    // The 2026-08-21 incident (a lapsed tier chain making the banner advertise
    // a date months too early) cannot recur through this path: a lapsed chain
    // has no window covering now, so it produces no candidate and we keep the
    // program level date resolved above.
    if (homeResult.status === 'rejected') {
      console.error('[Layout] Failed to resolve multi-program countdown:', homeResult.reason);
    } else {
      const homeData = homeResult.value;
      const registrationOverview = homeData.sections?.find(
        (section): section is RegistrationOverviewSection => section.type === 'registration_overview',
      );
      const editions = registrationOverview?.content.programs;
      if (editions && editions.length > 0) {
        // Adapt the home API's snake_case registration_types shape to the
        // camelCase DeadlineTier shape resolveActiveRegistrationDeadline
        // already expects (same shape getProgramPricingTiers returns above)
        // rather than re-deriving the fee/category/window logic here.
        const deadlineEditions = editions.map((edition) => ({
          program_name: edition.program_name,
          registration_dates: edition.registration_dates,
          registration_types: edition.registration_types.map((tier) => ({
            feeType: tier.fee_type ?? '',
            allowedCategories: tier.allowed_categories ?? [],
            validityPeriods: (tier.validity_periods ?? []).map((period) => ({
              startDate: period.start_date,
              endDate: period.end_date,
            })),
          })),
        }));
        const now = new Date();
        // An open window wins. Only if nothing is open do we fall back to the
        // soonest edition close date, so the banner never goes blank.
        const openWindow = resolveOpenWindowCountdown(deadlineEditions, now);
        const winner = openWindow ?? resolveCountdownAcrossPrograms(deadlineEditions, now);
        if (winner) {
          registrationCloseDate = winner.deadline;
          countdownProgramName = openWindow?.categoryLabel
            ? `${winner.programName} ${openWindow.categoryLabel}`
            : winner.programName;
        }
      }
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
              countdownProgramName={countdownProgramName}
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
