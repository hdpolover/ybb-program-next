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
} from '@/components/dashboard/DashboardDataContext';
import NotificationsPopover from '@/components/dashboard/layout/NotificationsPopover';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const searchTheme = jysSectionTheme.dashboardSearch;
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [me, setMe] = useState<AuthMeData | null>(null);
  const [onboarding, setOnboarding] = useState<ParticipantOnboardingData | null>(null);
  const [participantProfile, setParticipantProfile] = useState<ParticipantMeData | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<PortalDashboardSummary | null>(null);

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
    pageTitle = 'Dashboard Overview';
    pageSubtitle = 'See your registration status, program details, and important guidebook info.';
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
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (cancelled) return;

        if (res.status === 401) {
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
            const dashJson = (await dashRes.json().catch(() => ({}))) as any;
            const dashData = (dashJson?.data ?? dashJson ?? null) as PortalDashboardSummary | null;
            setDashboardSummary(dashData);
          }
        } catch {
          // ignore
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
            const profileJson = (await profileRes.json().catch(() => ({}))) as any;
            const profileData = (profileJson?.data ?? profileJson ?? null) as ParticipantMeData | null;
            setParticipantProfile(profileData);

            if (data && !profileData?.id) {
              router.push('/onboarding');
            }
          }
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const greetingName =
    participantProfile?.displayName?.trim() ||
    participantProfile?.fullName?.trim() ||
    onboarding?.displayName?.trim() ||
    onboarding?.fullName?.trim() ||
    'Participant';
  const greetingText = dashboardSummary?.greeting?.trim() || null;

  // shell grid: sidebar kiri + konten kanan
  return (
    <main className="relative h-screen overflow-hidden bg-white">
      <div className="flex h-screen">
        {/* Sidebar nempel di kiri */}
        <div className="hidden md:block">
          <Sidebar profileEmail={me?.email ?? ''} />
        </div>

        {mobileSidebarOpen ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close sidebar"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileSidebarOpen(false)}
            />

            <div className="absolute left-0 top-0 h-full w-[280px] bg-[#e53b8c] shadow-2xl flex flex-col">
              <div className="flex items-center justify-end px-3 pt-3 pb-2">
                <button
                  type="button"
                  aria-label="Close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/90 ring-1 ring-white/20"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Sidebar profileEmail={me?.email ?? ''} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Kolom kanan: navbar atas + konten */}
        <DashboardDataProvider
          dashboardSummary={dashboardSummary}
          me={me}
          onboarding={onboarding}
          participantProfile={participantProfile}
        >
          <div className="flex h-screen flex-1 flex-col overflow-y-auto">
          {/* Navbar dashboard */}
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 md:hidden"
                aria-label="Open sidebar"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* Spacer kiri (bisa dipakai untuk breadcrumb nanti) */}
              <div className="hidden flex-1 md:block" />
            </div>

            {/* Search bar di tengah */}
            <div className="flex flex-[2] justify-center">
              <div className="w-full max-w-xl">
                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm ring-1 ring-slate-200">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search in dashboard..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full border-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Program selector di kanan */}
            <div className="flex flex-1 justify-end">
              <div className="flex items-center gap-3">
                <NotificationsPopover />
                <ProgramSelector programs={me?.registeredPrograms ?? []} />
              </div>
            </div>
          </header>

          {/* Konten utama dashboard */}
          <section className="flex-1 px-6 py-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-4">
              {/* Header halaman (disembunyiin kalau lagi di halaman payments atau saat sedang mencari) */}
              {!pathname?.startsWith('/dashboard/payments') && searchQuery.trim().length < 2 && (
                <div className="space-y-1">
                  <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    {pageTitle}
                  </h1>
                  <p className="text-xs text-slate-500 sm:text-sm">{pageSubtitle}</p>
                </div>
              )}

              {/* Greeting cuma nongol di halaman utama dashboard overview, dan disembunyikan saat sedang mencari */}
              {pathname === '/dashboard' && searchQuery.trim().length < 2 && (
                <GreetingWithClock name={greetingText || greetingName} />
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
  theme: (typeof jysSectionTheme)['dashboardSearch'];
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
