'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search as SearchIcon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  Compass,
  MapPin,
  PanelsTopLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import type { SettingsAvailableBrand } from '@/types/settings';
import { trackInitiateCheckout } from '@/lib/analytics/metaPixel';

const navItems: string[] = ['Home', 'Programs', 'Partners & Sponsors', 'Announcements', 'FAQ'];

type QuickSearchEntry = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  external: boolean;
};

type HomeApiGuideline = {
  id?: string;
  title?: string;
  url?: string;
  type?: string;
};

type HomeApiSection = {
  type?: string;
  content?: {
    guidelines?: HomeApiGuideline[];
  };
};

type HomeApiResponse = {
  data?: {
    sections?: HomeApiSection[];
  };
};

function pickCurrentProgramLogo(settings: ReturnType<typeof useSettings>['settings']): string | null {
  return (
    settings?.active_program?.logo_icon_url?.trim() ||
    settings?.active_program?.logo_url?.trim() ||
    settings?.brand?.logo_icon_url?.trim() ||
    settings?.brand?.logo_url?.trim() ||
    null
  );
}

function pickAvailableBrandLogo(brand: SettingsAvailableBrand): string | null {
  return brand.logo_icon_url?.trim() || brand.logo_url?.trim() || null;
}

function chunkItems<T>(items: T[], chunkSize: number): T[][] {
  if (chunkSize <= 0) return [items];

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const currentHost = typeof window !== 'undefined' ? window.location.hostname.replace(/^www\./, '').toLowerCase() : '';
  const [query, setQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dynamicSearchEntries, setDynamicSearchEntries] = useState<QuickSearchEntry[]>([]);
  const { settings } = useSettings();
  const pathname = usePathname();
  const router = useRouter();

  const navMeasureRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(84);
  const lastScrollYRef = useRef(0);
  const scrollElRef = useRef<HTMLElement | null>(null);
  const activeScrollElRef = useRef<HTMLElement | null>(null);
  const closeProgramsMenuTimerRef = useRef<number | null>(null);
  const scrollDirRef = useRef<'up' | 'down'>('down');
  const scrollAccumRef = useRef(0);
  const dynamicSearchLoadedRef = useRef(false);
  const openRef = useRef(false);

  const hrefFor = (item: string): string => {
    switch (item) {
      case 'Home':
        return '/';
      case 'Programs':
        return '/programs';
      case 'Partners & Sponsors':
        return '/partners';
      case 'Announcements':
        return '/announcements';
      case 'FAQ':
        return '/faq';
      default:
        return '/';
    }
  };

  const toBrandProgramsHref = (brand: SettingsAvailableBrand): string | null => {
    const raw = (brand.landing_url || brand.website_url || '').trim();
    if (!raw) return null;
    const origin = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return `${origin.replace(/\/+$/, '')}/programs`;
  };

  const extractHost = (input: string): string => {
    const raw = input.trim();
    if (!raw) return '';
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      return new URL(normalized).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return normalized
        .replace(/^https?:\/\//i, '')
        .split('/')[0]
        .split(':')[0]
        .replace(/^www\./, '')
        .toLowerCase();
    }
  };

  const normalizeOptionalText = (value?: string | null): string | null => {
    const cleaned = (value || '').trim();
    return cleaned || null;
  };

  const inferLocationFromBrandName = (name: string): string | null => {
    const cleaned = name
      .replace(/\b(youth|summit|festival|fest|forum|academic|program|programs)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!cleaned) return null;
    return cleaned.toLowerCase() === name.trim().toLowerCase() ? null : cleaned;
  };

  const currentBrandName = settings?.brand?.name?.trim().toLowerCase() || '';
  const normalizedCurrentHost = currentHost.replace(/^www\./, '').toLowerCase();
  const availableBrands = settings?.available_brands || [];
  const brandProgramLinks = availableBrands.map(brand => ({
    id: brand.id,
    name: brand.name,
    href: toBrandProgramsHref(brand),
    host: extractHost(brand.landing_url || brand.website_url || ''),
    logoIconUrl: pickAvailableBrandLogo(brand),
    location:
      normalizeOptionalText(
        brand.location ||
          [brand.city, brand.country].filter(Boolean).join(', ') ||
          brand.address ||
          inferLocationFromBrandName(brand.name)
      ) || 'Program location',
    subtitle: (() => {
      const tagline = normalizeOptionalText(brand.tagline || brand.description);
      const location = normalizeOptionalText(
        brand.location ||
          [brand.city, brand.country].filter(Boolean).join(', ') ||
          brand.address ||
          inferLocationFromBrandName(brand.name)
      );
      if (tagline && location) return `${tagline} • ${location}`;
      return tagline || location || 'Explore this program';
    })(),
  }));

  const shouldShowProgramsDropdown = availableBrands.length > 1;
  const otherBrandProgramLinks = brandProgramLinks.filter(brand => {
    const isSameHost = normalizedCurrentHost ? brand.host === normalizedCurrentHost : false;
    const isSameName = brand.name.trim().toLowerCase() === currentBrandName;
    return !isSameHost && !isSameName;
  });
  const featuredProgramDestinations = otherBrandProgramLinks.slice(0, 4);
  const extraProgramDestinations = otherBrandProgramLinks.slice(4);
  const featuredProgramColumns = chunkItems(
    featuredProgramDestinations,
    Math.max(1, Math.ceil(featuredProgramDestinations.length / 2))
  );

  const clearProgramsCloseTimer = () => {
    if (closeProgramsMenuTimerRef.current !== null) {
      window.clearTimeout(closeProgramsMenuTimerRef.current);
      closeProgramsMenuTimerRef.current = null;
    }
  };

  const openProgramsMenu = () => {
    clearProgramsCloseTimer();
    setProgramMenuOpen(true);
  };

  const closeProgramsMenuWithDelay = () => {
    clearProgramsCloseTimer();
    closeProgramsMenuTimerRef.current = window.setTimeout(() => {
      setProgramMenuOpen(false);
      closeProgramsMenuTimerRef.current = null;
    }, 140);
  };

  const brandInitial = (name: string): string => {
    const cleaned = name.trim();
    return cleaned ? cleaned.charAt(0).toUpperCase() : '?';
  };

  useLayoutEffect(() => {
    const node = navMeasureRef.current;
    if (!node) return;

    const updateHeight = () => setNavHeight(node.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [pathname, open, programMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProgramMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);

    const isScrollable = (el: Element): el is HTMLElement => {
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      const oy = style.overflowY;
      if (oy !== 'auto' && oy !== 'scroll') return false;
      return el.scrollHeight > el.clientHeight + 1;
    };

    const rootScrollEl =
      (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
    scrollElRef.current = rootScrollEl;
    activeScrollElRef.current = rootScrollEl;
    lastScrollYRef.current = rootScrollEl.scrollTop;

    let raf = 0;
    const onScroll = (e?: Event) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;

        const target = e?.target;
        if (target && target instanceof Element && isScrollable(target)) {
          activeScrollElRef.current = target;
        }

        const active = activeScrollElRef.current ?? scrollElRef.current;
        const y = active?.scrollTop ?? 0;
        setScrolled(y > 0);

        const PIN_THRESHOLD = 64;
        const canAutoHide = y > PIN_THRESHOLD;
        if (!canAutoHide) {
          setHidden(false);
        }

        const lastY = lastScrollYRef.current;
        const diff = y - lastY;
        lastScrollYRef.current = y;

        if (!canAutoHide) return;

        // Accumulate scroll distance per direction to support trackpads/momentum
        if (Math.abs(diff) < 1) return;

        const dir: 'up' | 'down' = diff > 0 ? 'down' : 'up';
        if (dir !== scrollDirRef.current) {
          scrollDirRef.current = dir;
          scrollAccumRef.current = 0;
        }

        scrollAccumRef.current += Math.abs(diff);

        const HIDE_AFTER = 50;
        const SHOW_AFTER = 30;

        if (dir === 'down' && scrollAccumRef.current >= HIDE_AFTER) {
          if (!openRef.current) setHidden(true);
          scrollAccumRef.current = 0;
        }

        if (dir === 'up' && scrollAccumRef.current >= SHOW_AFTER) {
          setHidden(false);
          scrollAccumRef.current = 0;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, {
        capture: true,
      } as AddEventListenerOptions);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeProgramsMenuTimerRef.current !== null) {
        window.clearTimeout(closeProgramsMenuTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
  }, [open]);


  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const checkAuthState = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          signal: controller.signal,
        });
        if (alive) setIsAuthenticated(res.ok);
      } catch {
        if (alive) setIsAuthenticated(false);
      }
    };

    checkAuthState();

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!searchOpen || dynamicSearchLoadedRef.current) return;
    dynamicSearchLoadedRef.current = true;

    const controller = new AbortController();

    const loadSearchEntries = async () => {
      try {
        const res = await fetch('/api/home', {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = (await res.json()) as HomeApiResponse;
        const sections = json?.data?.sections || [];
        const registrationOverview = sections.find(
          section => section.type === 'registration_overview'
        );
        const guidelines = registrationOverview?.content?.guidelines || [];
        const guidelineEntries: QuickSearchEntry[] = guidelines
          .map((guideline, index) => {
            const title = (guideline.title || '').trim();
            const href = (guideline.url || '').trim();
            if (!title || !href) return null;
            const typeLabel = (guideline.type || 'Document').trim();
            return {
              id: `guideline-${guideline.id || index}`,
              title,
              subtitle: `Guideline • ${typeLabel}`,
              href,
              external: /^https?:\/\//i.test(href),
            };
          })
          .filter((entry): entry is QuickSearchEntry => Boolean(entry));

        setDynamicSearchEntries(guidelineEntries);
      } catch {
        // Keep base search index available even if dynamic data fails.
      }
    };

    void loadSearchEntries();
    return () => controller.abort();
  }, [searchOpen]);

  const ctaHref = isAuthenticated ? '/dashboard' : '/login';
  const ctaLabel = isAuthenticated ? 'DASHBOARD' : 'REGISTER NOW';
  const currentProgramLogo = pickCurrentProgramLogo(settings);

  const logoSrc =
    settings?.brand?.logo_url?.trim() ||
    settings?.active_program?.logo_url?.trim() ||
    '/img/ybb-logo.png';

  const quickSearchIndex = useMemo(() => {
    const pageEntries: QuickSearchEntry[] = navItems.map(item => ({
      id: `page-${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: item,
      subtitle: 'Page',
      href: hrefFor(item),
      external: false,
    }));

    const programEntries: QuickSearchEntry[] = brandProgramLinks
      .filter(brand => Boolean(brand.href))
      .map(brand => ({
        id: `program-${brand.id}`,
        title: brand.name,
        subtitle: brand.subtitle,
        href: brand.href || '/programs/discover',
        external: /^https?:\/\//i.test(brand.href || ''),
      }));

    return [...pageEntries, ...programEntries, ...dynamicSearchEntries];
  }, [brandProgramLinks, dynamicSearchEntries]);

  const previewResults = (() => {
    const term = query.trim().toLowerCase();
    if (!term) return quickSearchIndex.slice(0, 6);

    return quickSearchIndex
      .map(entry => {
        const text = `${entry.title} ${entry.subtitle}`.toLowerCase();
        if (!text.includes(term)) return null;
        const startsWithTitle = entry.title.toLowerCase().startsWith(term);
        const startsWithSubtitle = entry.subtitle.toLowerCase().startsWith(term);
        return {
          ...entry,
          score: startsWithTitle ? 3 : startsWithSubtitle ? 2 : 1,
        };
      })
      .filter((entry): entry is (typeof quickSearchIndex)[number] & { score: number } =>
        Boolean(entry)
      )
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 8);
  })();

  const queryTrimmed = query.trim();

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const term = queryTrimmed;
    if (!term) {
      setSearchOpen(false);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  const navbarContent = (
    <>
      <nav
        className={`relative z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm supports-[backdrop-filter]:bg-white/72 supports-[backdrop-filter]:backdrop-blur-md ${scrolled ? 'shadow-sm' : ''} ${open ? 'max-md:pb-10' : ''}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4 md:h-24">
            <div className="flex shrink-0 items-center">
              <Link href="/" aria-label="Go to home" onClick={() => setOpen(false)}>
                <Image
                  src={logoSrc}
                  alt="Logo"
                  width={420}
                  height={420}
                  className="h-9 w-auto sm:h-11 md:h-12 lg:h-14"
                  unoptimized
                />
              </Link>
            </div>

            <div className="hidden items-center gap-5 md:flex lg:gap-7 xl:gap-10">
              {navItems.map(item => {
                const href = hrefFor(item);
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                if (item === 'Programs' && shouldShowProgramsDropdown) {
                  return (
                    <div
                      key={item}
                      className="static flex items-center"
                      onMouseEnter={openProgramsMenu}
                      onMouseLeave={closeProgramsMenuWithDelay}
                    >
                      <button
                        type="button"
                        aria-label="Toggle programs menu"
                        aria-expanded={programMenuOpen}
                        aria-haspopup="menu"
                        onClick={() => setProgramMenuOpen(openState => !openState)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all lg:text-base ${
                          isActive || programMenuOpen
                            ? 'bg-slate-100 text-[var(--brand-accent)]'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-[var(--brand-accent)]'
                        }`}
                      >
                        <span>{item}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${programMenuOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {programMenuOpen && (
                        <div className="absolute inset-x-0 top-full z-[90]">
                          <div className="overflow-hidden border-b border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                              <div className="border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white py-5">
                                <div className="flex items-start justify-between gap-6">
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                                      Program directory
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                                      Explore YBB programs
                                    </h3>
                                    <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                                      Browse the active program site, jump to another program, or
                                      compare the programs currently available across the YBB
                                      network.
                                    </p>
                                  </div>
                                  <Link
                                    href="/programs/discover"
                                    onClick={() => setProgramMenuOpen(false)}
                                    className="hover:bg-[var(--brand-accent-soft)]/60 inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                                  >
                                    <Compass className="h-4 w-4" />
                                    <span>See all programs</span>
                                  </Link>
                                </div>
                              </div>

                              <div className="grid gap-8 py-7 lg:grid-cols-[1.05fr_1.55fr]">
                                <div className="space-y-4">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    Current program
                                  </p>
                                  <Link
                                    href="/programs"
                                    onClick={() => setProgramMenuOpen(false)}
                                    className="border-[var(--brand-accent)]/15 hover:border-[var(--brand-accent)]/35 hover:shadow-[var(--brand-accent)]/10 group block rounded-[1.6rem] border bg-[linear-gradient(180deg,var(--brand-accent-soft)_0%,rgba(255,255,255,0.98)_100%)] p-5 transition-all hover:shadow-lg"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex min-w-0 items-center gap-3">
                                        {currentProgramLogo ? (
                                          <Image
                                            src={currentProgramLogo}
                                            alt={`${settings?.brand?.name || 'Current Program'} logo`}
                                            width={52}
                                            height={52}
                                            className="border-[var(--brand-accent)]/15 h-12 w-12 shrink-0 rounded-2xl border bg-white object-cover p-1"
                                            unoptimized
                                          />
                                        ) : (
                                          <span className="border-[var(--brand-accent)]/15 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border bg-white text-sm font-bold uppercase text-[var(--brand-accent)]">
                                            {brandInitial(
                                              settings?.brand?.name || 'Current Program'
                                            )}
                                          </span>
                                        )}
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent)]">
                                              Active site
                                            </span>
                                            <Check className="h-4 w-4 text-[var(--brand-accent)]" />
                                          </div>
                                          <div className="mt-3 truncate text-xl font-semibold text-slate-900">
                                            {settings?.brand?.name || 'Current Program'}
                                          </div>
                                          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                                            {settings?.active_program?.name ||
                                              'Continue browsing the current program experience.'}
                                          </p>
                                        </div>
                                      </div>
                                      <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-[var(--brand-accent)]" />
                                    </div>
                                  </Link>

                                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                    <Link
                                      href="/programs"
                                      onClick={() => setProgramMenuOpen(false)}
                                      className="hover:bg-[var(--brand-accent-soft)]/40 group rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[var(--brand-accent)]"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-white group-hover:text-[var(--brand-accent)]">
                                          <PanelsTopLeft className="h-4.5 w-4.5" />
                                        </span>
                                        <div className="min-w-0">
                                          <div className="truncate text-sm font-semibold text-slate-900">
                                            Current site overview
                                          </div>
                                          <div className="truncate text-sm text-slate-600">
                                            Go to this program&apos;s listing page
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                    <Link
                                      href="/programs/discover"
                                      onClick={() => setProgramMenuOpen(false)}
                                      className="hover:bg-[var(--brand-accent-soft)]/40 group rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-[var(--brand-accent)]"
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-white group-hover:text-[var(--brand-accent)]">
                                          <Compass className="h-4.5 w-4.5" />
                                        </span>
                                        <div className="min-w-0">
                                          <div className="truncate text-sm font-semibold text-slate-900">
                                            Discover programs
                                          </div>
                                          <div className="truncate text-sm text-slate-600">
                                            Browse every destination in one place
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  </div>
                                </div>

                                <div className="space-y-5">
                                  <div className="flex items-end justify-between gap-4">
                                    <div>
                                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        Other programs
                                      </p>
                                      <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Open another YBB program site directly from the navigation.
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className={`grid gap-4 ${featuredProgramColumns.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}
                                  >
                                    {featuredProgramColumns.map((column, columnIndex) => (
                                      <div
                                        key={`program-column-${columnIndex}`}
                                        className="space-y-3"
                                      >
                                        {column.map(brand =>
                                          brand.href ? (
                                            <a
                                              key={brand.id}
                                              href={brand.href}
                                              onClick={() => setProgramMenuOpen(false)}
                                              className="hover:bg-[var(--brand-accent-soft)]/50 group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition-all hover:border-[var(--brand-accent)] hover:shadow-sm"
                                            >
                                              <div className="flex min-w-0 items-start gap-3">
                                                {brand.logoIconUrl ? (
                                                  <Image
                                                    src={brand.logoIconUrl}
                                                    alt={`${brand.name} logo`}
                                                    width={44}
                                                    height={44}
                                                    className="h-11 w-11 shrink-0 rounded-2xl border border-slate-200 bg-white object-cover p-1"
                                                    unoptimized
                                                  />
                                                ) : (
                                                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold uppercase text-slate-500">
                                                    {brandInitial(brand.name)}
                                                  </span>
                                                )}
                                                <div className="min-w-0">
                                                  <div className="truncate text-[15px] font-semibold text-slate-900">
                                                    {brand.name}
                                                  </div>
                                                  <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-500">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate">
                                                      {brand.location}
                                                    </span>
                                                  </div>
                                                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                                                    {brand.subtitle}
                                                  </p>
                                                </div>
                                              </div>
                                              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-[var(--brand-accent)]" />
                                            </a>
                                          ) : (
                                            <span
                                              key={brand.id}
                                              className="flex items-start justify-between gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4 text-slate-400"
                                            >
                                              <div className="flex min-w-0 items-start gap-3">
                                                {brand.logoIconUrl ? (
                                                  <Image
                                                    src={brand.logoIconUrl}
                                                    alt={`${brand.name} logo`}
                                                    width={44}
                                                    height={44}
                                                    className="h-11 w-11 shrink-0 rounded-2xl border border-slate-200 object-cover p-1"
                                                    unoptimized
                                                  />
                                                ) : (
                                                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-sm font-bold uppercase text-slate-500">
                                                    {brandInitial(brand.name)}
                                                  </span>
                                                )}
                                                <div className="min-w-0">
                                                  <div className="truncate text-[15px] font-semibold text-slate-500">
                                                    {brand.name}
                                                  </div>
                                                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                    {brand.subtitle}
                                                  </p>
                                                </div>
                                              </div>
                                              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                Soon
                                              </span>
                                            </span>
                                          )
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {extraProgramDestinations.length > 0 && (
                                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/60 p-4">
                                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        More programs
                                      </p>
                                      <div className="mt-3 flex flex-wrap gap-2.5">
                                        {extraProgramDestinations.map(brand =>
                                          brand.href ? (
                                            <a
                                              key={brand.id}
                                              href={brand.href}
                                              onClick={() => setProgramMenuOpen(false)}
                                              className="hover:bg-[var(--brand-accent-soft)]/50 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                                            >
                                              {brand.name}
                                            </a>
                                          ) : (
                                            <span
                                              key={brand.id}
                                              className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-400"
                                            >
                                              {brand.name}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <a
                    key={item}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={
                      isActive
                        ? 'text-sm font-semibold text-[var(--brand-accent)] transition-colors lg:text-base'
                        : 'text-sm font-semibold text-gray-600 transition-colors hover:text-[var(--brand-accent)] lg:text-base'
                    }
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center space-x-3 md:space-x-5">
              <button
                className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              <a
                href={ctaHref}
                className="hover:bg-primary/90 hidden min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:inline-flex"
                onClick={() => { if (ctaHref === '/login') trackInitiateCheckout(); }}
              >
                {ctaLabel}
              </a>

              <button
                type="button"
                aria-label="Open menu"
                className="rounded-md p-2 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 md:hidden"
                onClick={() => setOpen(o => !o)}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden pb-5">
              <div className="mt-2 max-h-[calc(100vh-140px)] overflow-y-auto rounded-2xl border border-gray-200 bg-white px-4 pt-3 pb-6 shadow-sm">
                <div className="space-y-2">
                  {navItems.map(item => {
                    const href = hrefFor(item);
                    const isActive =
                      pathname === href || (href !== '/' && pathname.startsWith(href));
                    if (item === 'Programs' && shouldShowProgramsDropdown) {
                      return (
                        <div key={item} className="space-y-2">
                          <a
                            href={href}
                            aria-current={isActive ? 'page' : undefined}
                            className={
                              isActive
                                ? 'block w-full rounded-xl bg-[var(--brand-accent-soft)] px-4 py-3 text-left text-base font-medium text-[var(--brand-accent)] transition'
                                : 'block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]'
                            }
                            onClick={() => setOpen(false)}
                          >
                            {settings?.brand?.name ? `${item} (${settings.brand.name})` : item}
                          </a>
                          <div className="max-h-[250px] overflow-y-auto space-y-2">
                            {otherBrandProgramLinks.map(brand =>
                              brand.href ? (
                                <a
                                  key={brand.id}
                                  href={brand.href}
                                  className="group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-700 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]"
                                  onClick={() => setOpen(false)}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    {brand.logoIconUrl ? (
                                      <Image
                                        src={brand.logoIconUrl}
                                        alt={`${brand.name} logo`}
                                        width={36}
                                        height={36}
                                        className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold uppercase text-slate-500">
                                        {brandInitial(brand.name)}
                                      </span>
                                    )}
                                    <div className="min-w-0">
                                      <div className="truncate text-[15px]">{brand.name}</div>
                                      <div className="truncate text-xs leading-tight text-slate-600">
                                        {brand.location}
                                      </div>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-[var(--brand-accent)]" />
                                </a>
                              ) : (
                                <span
                                  key={brand.id}
                                  className="flex w-full cursor-not-allowed items-center justify-between gap-3 rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-400"
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    {brand.logoIconUrl ? (
                                      <Image
                                        src={brand.logoIconUrl}
                                        alt={`${brand.name} logo`}
                                        width={36}
                                        height={36}
                                        className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-xs font-bold uppercase text-slate-500">
                                        {brandInitial(brand.name)}
                                      </span>
                                    )}
                                    <div className="min-w-0">
                                      <div className="truncate text-[15px]">{brand.name}</div>
                                      <div className="truncate text-xs leading-tight text-slate-500">
                                        {brand.location}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                    Soon
                                  </span>
                                </span>
                              )
                            )}
                          </div>
                          <Link
                            href="/programs/discover"
                            className="block w-full rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-700 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]"
                            onClick={() => setOpen(false)}
                          >
                            Explore all programs
                          </Link>
                        </div>
                      );
                    }
                    return (
                      <a
                        key={item}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={
                          isActive
                            ? 'block w-full rounded-xl bg-[var(--brand-accent-soft)] px-4 py-3 text-left text-base font-medium text-[var(--brand-accent)] transition'
                            : 'block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]'
                        }
                        onClick={() => setOpen(false)}
                      >
                        {item}
                      </a>
                    );
                  })}
                </div>
                <div className="my-4 h-px w-full bg-gray-200" />
                <a
                  href={ctaHref}
                  className="hover:bg-primary/90 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => {
                    setOpen(false);
                    if (ctaHref === '/login') trackInitiateCheckout();
                  }}
                >
                  {ctaLabel}
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );

  return (
    <>
      <div
        aria-hidden
        className="shrink-0 transition-[height] duration-300 ease-out"
        style={{ height: hidden ? 0 : navHeight }}
      />

      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[transform] duration-300 ease-out will-change-transform ${
          hidden ? 'pointer-events-none' : ''
        }`}
        style={{
          transform: hidden ? `translate3d(0, -${navHeight}px, 0)` : 'translate3d(0, 0, 0)',
        }}
      >
        <div ref={navMeasureRef}>{navbarContent}</div>
      </header>

      {/* Overlay buat Searchnya */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-white/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400">
                  <SearchIcon className="h-4 w-4" />
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-9 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--brand-accent)] focus:ring-2 focus:ring-[var(--brand-accent-soft)]"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-[var(--brand-accent)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--brand-accent-foreground)] shadow-sm transition hover:opacity-90"
              >
                Search
              </button>
            </form>
            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
              {previewResults.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500">No quick matches found.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {previewResults.map(result => (
                    <a
                      key={result.id}
                      href={result.href}
                      target={result.external ? '_blank' : undefined}
                      rel={result.external ? 'noopener noreferrer' : undefined}
                      className="hover:bg-[var(--brand-accent-soft)]/40 block border-b border-slate-100 px-3 py-2.5 last:border-b-0"
                      onClick={() => {
                        setSearchOpen(false);
                        setOpen(false);
                      }}
                    >
                      <p className="text-sm font-semibold text-slate-900">{result.title}</p>
                      <p className="truncate text-xs text-slate-600">{result.subtitle}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
            {queryTrimmed && (
              <a
                href={`/search?q=${encodeURIComponent(queryTrimmed)}`}
                className="hover:bg-[var(--brand-accent-soft)]/40 mt-3 block rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)]"
                onClick={() => {
                  setSearchOpen(false);
                  setOpen(false);
                }}
              >
                See all results for &quot;{queryTrimmed}&quot;
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
