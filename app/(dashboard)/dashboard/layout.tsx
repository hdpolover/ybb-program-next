"use client";

import Image from 'next/image';
import { FileText, Menu, Search, SearchX, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import ProgramSelector from '@/components/dashboard/layout/ProgramSelector';
import GreetingWithClock from '@/components/dashboard/GreetingWithClock';
import {
  DashboardDataProvider,
  type AuthMeData,
  type ParticipantMeData,
  type ParticipantOnboardingData,
  type PortalDashboardSummary,
  type AmbassadorData,
} from '@/components/dashboard/DashboardDataContext';
import NotificationsPopover from '@/components/dashboard/layout/NotificationsPopover';
import UserMenuPopover from '@/components/dashboard/layout/UserMenuPopover';
import { getEnvelopeData, isRecord } from '@/lib/api/response';
import { toAmbassadorData } from '@/lib/dashboard/ambassador';
import { componentsTheme } from '@/lib/theme/components';

type DashboardSearchItem = {
  id: string;
  title: string;
  breadcrumb: string;
};

const DASHBOARD_SEARCH_ITEMS: DashboardSearchItem[] = [
  {
    id: 'essay-guidelines-1',
    title: 'Guides your essay content and approach.',
    breadcrumb: 'Submissions Registration Form Entry Information',
  },
  {
    id: 'essay-guidelines-2',
    title: 'Please carefully review the essay guidelines before preparing your submission.',
    breadcrumb: 'Submissions Registration Form Entry Information',
  },
  {
    id: 'payment-schedule',
    title: 'Payment schedule and deadlines for program fees.',
    breadcrumb: 'Payments Overview',
  },
  {
    id: 'onboarding-session',
    title: 'Onboarding session details and preparation checklist.',
    breadcrumb: 'Dashboard Overview',
  },
];

function toParticipantMeData(payload: unknown): ParticipantMeData | null {
  if (!isRecord(payload)) return null;

  const participant: ParticipantMeData = {
    id: typeof payload.id === 'string' ? payload.id : undefined,
    profileCompletionPercentage:
      typeof payload.profileCompletionPercentage === 'number' && Number.isFinite(payload.profileCompletionPercentage)
        ? payload.profileCompletionPercentage
        : undefined,
    displayName: typeof payload.displayName === 'string' ? payload.displayName : undefined,
    fullName: typeof payload.fullName === 'string' ? payload.fullName : undefined,
    profilePictureUrl: typeof payload.profilePictureUrl === 'string' ? payload.profilePictureUrl : undefined,
  };

  return Object.values(participant).some((value) => value !== undefined) ? participant : null;
}

function toPortalDashboardSummary(payload: unknown): PortalDashboardSummary | null {
  if (!payload || typeof payload !== 'object') return null;

  const raw = payload as Partial<PortalDashboardSummary>;
  const rawActiveApplication = isRecord(raw.activeApplication) ? raw.activeApplication : null;
  const guidebooks = Array.isArray(rawActiveApplication?.guidebooks)
    ? rawActiveApplication.guidebooks
        .filter(isRecord)
        .map((guidebook) => ({
          label: typeof guidebook.label === 'string' ? guidebook.label : undefined,
          url: typeof guidebook.url === 'string' ? guidebook.url : undefined,
        }))
        .filter((guidebook) => typeof guidebook.url === 'string' && guidebook.url.trim().length > 0)
    : undefined;
  const rawStats = raw.stats;

  if (!rawStats || typeof rawStats !== 'object') {
    return {
      ...raw,
      activeApplication: rawActiveApplication
        ? {
            ...rawActiveApplication,
            guidebooks,
          }
        : raw.activeApplication,
      stats: {
        applicationsCount: 0,
        completedProgramsCount: 0,
        certificatesCount: 0,
        totalRequired: {
          amount: 0,
          currency: 'USD',
        },
      },
    };
  }

  const stats = rawStats as {
    applicationsCount?: unknown;
    completedProgramsCount?: unknown;
    certificatesCount?: unknown;
    totalRequired?: { amount?: unknown; currency?: unknown } | null;
  };

  const totalRequired = stats.totalRequired;
  const amount =
    typeof totalRequired?.amount === 'number' && Number.isFinite(totalRequired.amount)
      ? totalRequired.amount
      : 0;
  const currency =
    typeof totalRequired?.currency === 'string' && totalRequired.currency.trim().length > 0
      ? totalRequired.currency.toUpperCase()
      : 'USD';

  return {
    ...raw,
    activeApplication: rawActiveApplication
      ? {
          ...rawActiveApplication,
          guidebooks,
        }
      : raw.activeApplication,
    stats: {
      applicationsCount:
        typeof stats.applicationsCount === 'number' && Number.isFinite(stats.applicationsCount)
          ? stats.applicationsCount
          : 0,
      completedProgramsCount:
        typeof stats.completedProgramsCount === 'number' && Number.isFinite(stats.completedProgramsCount)
          ? stats.completedProgramsCount
          : 0,
      certificatesCount:
        typeof stats.certificatesCount === 'number' && Number.isFinite(stats.certificatesCount)
          ? stats.certificatesCount
          : 0,
      totalRequired: {
        amount,
        currency,
      },
    },
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchTheme = componentsTheme.dashboardSearch;
  const [me, setMe] = useState<AuthMeData | null>(null);
  const [onboarding, setOnboarding] = useState<ParticipantOnboardingData | null>(null);
  const [participantProfile, setParticipantProfile] = useState<ParticipantMeData | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<PortalDashboardSummary | null>(null);
  const [isDashboardSummaryLoading, setIsDashboardSummaryLoading] = useState(true);
  const [ambassadorData, setAmbassadorData] = useState<AmbassadorData | null>(null);
  // Start as NOT loading if we have a cached ambassador status — avoids nav flicker on repeat visits
  const [isAmbassadorDataLoading, setIsAmbassadorDataLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('ybb_ambassador_status') === null;
  });
  const cachedIsAmbassador = typeof window !== 'undefined' && localStorage.getItem('ybb_ambassador_status') === 'true';
  const isAmbassador = ambassadorData?.isActive ?? cachedIsAmbassador;

  let sectionLabel: string | null = null;
  let subLabel: string | null = null;
  if (pathname === '/dashboard') {
    sectionLabel = 'Overview';
  } else if (pathname?.startsWith('/dashboard/submission')) {
    sectionLabel = 'Submission';
    if (pathname === '/dashboard/submission/edit') {
      subLabel = 'Edit';
    }
  } else if (pathname?.startsWith('/dashboard/payments')) {
    sectionLabel = 'Payments';
  } else if (pathname?.startsWith('/dashboard/documents')) {
    sectionLabel = 'Documents';
  }

  let pageTitle = 'Dashboard';
  let pageSubtitle = 'Overview of your program, submissions, and payments.';
  if (pathname === '/dashboard') {
    if (isAmbassador) {
      pageTitle = 'Ambassador Dashboard';
      pageSubtitle = 'Track your referral link, code, and ambassador performance.';
    } else {
      pageTitle = 'Dashboard Overview';
      pageSubtitle = 'See your registration status, program details, and important guidebook info.';
    }
  } else if (pathname?.startsWith('/dashboard/submission')) {
    pageTitle = 'Submission';
    pageSubtitle = 'Review and manage your application submission details.';
  } else if (pathname === '/dashboard/progress') {
    // Detail progress page: tampilkan judul mirip breadcrumb
    pageTitle = '';
    pageSubtitle = '';
  } else if (pathname?.startsWith('/dashboard/payments')) {
    pageTitle = 'Payments';
    pageSubtitle = 'Track your payment status and manage your registration payments.';
  } else if (pathname?.startsWith('/dashboard/documents')) {
    pageTitle = 'Available Program Documents';
    pageSubtitle = 'Access and download important program materials. These documents contain essential information to ensure your successful program completion.';
  } else if (pathname?.startsWith('/dashboard/referrals')) {
    pageTitle = 'Referral Funnel';
    pageSubtitle = 'Track who used your ambassador link or code and how far they progressed.';
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) {
        setIsDashboardSummaryLoading(true);
      }

      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (cancelled) return;

        if (res.status === 401) {
          if (!cancelled) {
            setIsDashboardSummaryLoading(false);
          }
          router.push('/login');
          return;
        }

        const json = (await res.json()) as {
          statusCode?: number;
          message?: string;
          data?: AuthMeData | null;
        };

        const data = json?.data ?? null;
        setMe(data);

        try {
          const dashRes = await fetch('/api/portal/dashboard', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });

          if (!cancelled && dashRes.ok) {
            const dashJson = (await dashRes.json().catch(() => null)) as unknown;
            const dashPayload = getEnvelopeData(dashJson);
            const dashData = toPortalDashboardSummary(dashPayload);
            setDashboardSummary(dashData);
          }
        } catch {
          // ignore
        } finally {
          if (!cancelled) {
            setIsDashboardSummaryLoading(false);
          }
        }

        try {
          const profileRes = await fetch('/api/participants/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          });

          if (!cancelled && profileRes.ok) {
            const profileJson = (await profileRes.json().catch(() => null)) as unknown;
            const profilePayload = getEnvelopeData(profileJson);
            const profileData = toParticipantMeData(profilePayload);
            setParticipantProfile(profileData);

            if (data && !profileData?.id) {
              router.push('/onboarding');
            }
          }
        } catch {
          // ignore
        }

        try {
          const ambassadorRes = await fetch('/api/participants/ambassador', {
            method: 'GET',
            cache: 'no-store',
          });

          if (!cancelled && ambassadorRes.ok) {
            const ambassadorJson = (await ambassadorRes.json().catch(() => null)) as unknown;
            const ambassadorPayload = getEnvelopeData(ambassadorJson);
            const ambassador = toAmbassadorData(ambassadorPayload);
            if (ambassador?.isActive) {
              setAmbassadorData(ambassador);
              try { localStorage.setItem('ybb_ambassador_status', 'true'); } catch {}
            } else {
              try { localStorage.setItem('ybb_ambassador_status', 'false'); } catch {}
            }
          } else if (!cancelled) {
            try { localStorage.setItem('ybb_ambassador_status', 'false'); } catch {}
          }
        } catch {
          // ignore
        } finally {
          if (!cancelled) {
            setIsAmbassadorDataLoading(false);
          }
        }
      } catch {
        // ignore
        if (!cancelled) {
          setIsDashboardSummaryLoading(false);
          setIsAmbassadorDataLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isAmbassadorDataLoading || !isAmbassador) return;
    const ambassadorAllowed =
      pathname === '/dashboard' ||
      pathname?.startsWith('/dashboard/referrals') ||
      pathname?.startsWith('/dashboard/settings');
    if (!ambassadorAllowed) {
      router.replace('/dashboard');
    }
  }, [isAmbassador, isAmbassadorDataLoading, pathname, router]);

  const isAmbassadorContentRoute =
    isAmbassador && (pathname === '/dashboard' || pathname?.startsWith('/dashboard/referrals'));

  const greetingName =
    participantProfile?.displayName?.trim() ||
    participantProfile?.fullName?.trim() ||
    onboarding?.displayName?.trim() ||
    onboarding?.fullName?.trim() ||
    'Participant';
  const userMenuName =
    (isAmbassador ? ambassadorData?.fullName?.trim() : '') ||
    greetingName;
  // shell grid: sidebar kiri + konten kanan
  return (
    <main className="relative h-screen overflow-hidden bg-white">
      <div className="flex h-screen">
        {/* Sidebar nempel di kiri */}
        <Sidebar
          isAmbassador={isAmbassador}
          isAmbassadorDataLoading={isAmbassadorDataLoading}
        />

        {/* Kolom kanan: navbar atas + konten */}
        <DashboardDataProvider
          dashboardSummary={dashboardSummary}
          isDashboardSummaryLoading={isDashboardSummaryLoading}
          me={me}
          onboarding={onboarding}
          participantProfile={participantProfile}
          ambassadorData={ambassadorData}
          isAmbassador={isAmbassador}
          isAmbassadorDataLoading={isAmbassadorDataLoading}
        >
          <div className="flex h-screen flex-1 flex-col overflow-y-auto">
          {/* Navbar dashboard */}
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
            {/* Left: mobile menu + collapsible search */}
            <div className="flex flex-1 items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 md:hidden"
                aria-label="Open sidebar"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {searchOpen ? (
                <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-300 w-72 transition-all">
                  <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in dashboard..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                  <button
                    type="button"
                    aria-label="Close search"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="shrink-0 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  aria-label="Open search"
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Right: notifications + program selector + user menu */}
            <div className="flex items-center gap-3">
              <NotificationsPopover />
              <ProgramSelector programs={me?.registeredPrograms ?? []} />
              <UserMenuPopover
                profileName={userMenuName}
                profileEmail={me?.email}
                profileImageUrl={participantProfile?.profilePictureUrl}
                isAmbassador={isAmbassador}
              />
            </div>
          </header>

          {/* Konten utama dashboard */}
          <section className="flex-1 px-6 py-6 lg:px-8">
            <div className={isAmbassadorContentRoute ? "w-full space-y-4" : "mx-auto max-w-6xl space-y-4"}>
              {/* Header halaman (disembunyiin kalau lagi di halaman payments atau saat sedang mencari) */}
               {!pathname?.startsWith('/dashboard/payments') && !pathname?.startsWith('/dashboard/submission') && !pathname?.startsWith('/dashboard/settings') && searchQuery.trim().length < 2 && (
                 <div className="space-y-1">
                   <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                     {pageTitle}
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">{pageSubtitle}</p>
                </div>
              )}

              {/* Greeting cuma nongol di halaman utama dashboard overview, dan disembunyikan saat sedang mencari */}
              {pathname === '/dashboard' && !isAmbassador && searchQuery.trim().length < 2 && (
                <GreetingWithClock name={greetingName} />
              )}

              {/* Hasil smart search dashboard */}
              <DashboardSearchResults
                query={searchQuery}
                items={DASHBOARD_SEARCH_ITEMS}
                theme={searchTheme}
              />

              {/* Konten utama halaman: disembunyikan saat sedang mencari */}
              {searchQuery.trim().length < 2 && children}
            </div>
          </section>
          </div>
        </DashboardDataProvider>
      </div>
    </main>
  );
}

function DashboardSearchResults({
  query,
  items,
  theme,
}: {
  query: string;
  items: DashboardSearchItem[];
  theme: (typeof componentsTheme)['dashboardSearch'];
}) {
  const normalized = query.trim();

  const { filtered, keyword } = useMemo(() => {
    const value = normalized;
    if (value.length < 2) {
      return { filtered: [] as DashboardSearchItem[], keyword: '' };
    }

    const lower = value.toLowerCase();
    const matches = items.filter(item => item.title.toLowerCase().includes(lower));
    return { filtered: matches, keyword: value };
  }, [items, normalized]);

  if (!keyword) return null;

  const highlight = (text: string) => {
    const lower = text.toLowerCase();
    const lowerKey = keyword.toLowerCase();
    const index = lower.indexOf(lowerKey);
    if (index === -1) return <span>{text}</span>;

    const before = text.slice(0, index);
    const match = text.slice(index, index + keyword.length);
    const after = text.slice(index + keyword.length);

    return (
      <span>
        {before}
        <span className={theme.itemHighlight}>{match}</span>
        {after}
      </span>
    );
  };

  if (filtered.length === 0) {
    return (
      <div className={theme.emptyWrapper}>
        <div className={theme.emptyIconCircle}>
          <SearchX className={theme.emptyIcon} />
        </div>
        <p className={theme.emptyTextMain}>
          The keyword <span className={theme.emptyKeyword}>
            "{keyword}"
          </span>{' '}
          is not found.
        </p>
        <p className={theme.emptyTextSub}>Please try another keyword.</p>
      </div>
    );
  }

  return (
    <div className={theme.resultsWrapper}>
      <p className={theme.summaryText}>
        Found {filtered.length} part{filtered.length === 1 ? '' : 's'} for the keyword{' '}
        <span className={theme.summaryKeyword}>{keyword}</span>
      </p>

      <div className={theme.list}>
        {filtered.map(item => (
          <article key={item.id} className={theme.itemCard}>
            <div className={theme.itemInnerRow}>
              <div className={theme.itemIconCircle}>
                <FileText className={theme.itemIcon} />
              </div>
              <div>
                <p className={theme.itemTitle}>{highlight(item.title)}</p>
                <p className={theme.itemBreadcrumb}>{item.breadcrumb}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
