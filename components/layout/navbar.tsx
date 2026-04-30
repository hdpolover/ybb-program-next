'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search as SearchIcon, Menu, X, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import type { SettingsAvailableBrand } from '@/types/settings';

const navItems: string[] = ['Home', 'Programs', 'Partners & Sponsors', 'Announcements', 'FAQ'];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [programMenuOpen, setProgramMenuOpen] = useState(false);
  const [currentHost, setCurrentHost] = useState('');
  const [query, setQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { settings } = useSettings();
  const pathname = usePathname();

  const lastScrollYRef = useRef(0);
  const scrollElRef = useRef<HTMLElement | null>(null);
  const activeScrollElRef = useRef<HTMLElement | null>(null);
  const closeProgramsMenuTimerRef = useRef<number | null>(null);
  const scrollDirRef = useRef<'up' | 'down'>('down');
  const scrollAccumRef = useRef(0);

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
  const brandProgramLinks = availableBrands
    .map((brand) => ({
      id: brand.id,
      name: brand.name,
      href: toBrandProgramsHref(brand),
      host: extractHost(brand.landing_url || brand.website_url || ''),
      logoIconUrl: brand.logo_icon_url?.trim() || null,
      subtitle:
        (() => {
          const tagline = normalizeOptionalText(brand.tagline || brand.description);
          const location = normalizeOptionalText(
            brand.location || [brand.city, brand.country].filter(Boolean).join(', ') || brand.address || inferLocationFromBrandName(brand.name),
          );
          if (tagline && location) return `${tagline} • ${location}`;
          return tagline || location || 'Explore this program';
        })(),
    }));

  const shouldShowProgramsDropdown = availableBrands.length > 1;
  const otherBrandProgramLinks = brandProgramLinks.filter((brand) => {
    const isSameHost = normalizedCurrentHost ? brand.host === normalizedCurrentHost : false;
    const isSameName = brand.name.trim().toLowerCase() === currentBrandName;
    return !isSameHost && !isSameName;
  });
  const featuredProgramDestinations = otherBrandProgramLinks.slice(0, 4);
  const extraProgramDestinations = otherBrandProgramLinks.slice(4);

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

    const rootScrollEl = (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
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

        const PIN_THRESHOLD = 120;
        const nextPinned = y > PIN_THRESHOLD;
        setPinned(nextPinned);
        if (!nextPinned) {
          setHidden(false);
        }

        const lastY = lastScrollYRef.current;
        const diff = y - lastY;
        lastScrollYRef.current = y;

        if (!nextPinned) return;

        // Accumulate scroll distance per direction to support trackpads/momentum
        if (Math.abs(diff) < 1) return;

        const dir: 'up' | 'down' = diff > 0 ? 'down' : 'up';
        if (dir !== scrollDirRef.current) {
          scrollDirRef.current = dir;
          scrollAccumRef.current = 0;
        }

        scrollAccumRef.current += Math.abs(diff);

        const HIDE_AFTER = 24;
        const SHOW_AFTER = 12;

        if (dir === 'down' && scrollAccumRef.current >= HIDE_AFTER) {
          setHidden(true);
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
      document.removeEventListener('scroll', onScroll, { capture: true } as AddEventListenerOptions);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setCurrentHost(window.location.hostname.replace(/^www\./, '').toLowerCase());
  }, []);

  useEffect(() => {
    return () => {
      if (closeProgramsMenuTimerRef.current !== null) {
        window.clearTimeout(closeProgramsMenuTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setProgramMenuOpen(false);
  }, [pathname]);

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

  const ctaHref = isAuthenticated ? '/dashboard' : '/login';
  const ctaLabel = isAuthenticated ? 'DASHBOARD' : 'REGISTER NOW';



  const logoSrc = settings?.brand?.logo_url?.trim() || settings?.active_program?.logo_url?.trim() || '/img/ybb-logo.png';

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // TODO: ini baru hardcode, kalo mau berfungsi hubungin sama real search functionnya
    console.log('Search:', query);
    setSearchOpen(false);
  };

  const navbarContent = (
    <>
      <div className="h-1 w-full bg-gray-800" />

      <nav
        className={`${'relative z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'} ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-4 md:h-24">
            <div className="flex shrink-0 items-center">
              <Image
                src={logoSrc}
                alt="Logo"
                width={420}
                height={420}
                className="h-9 w-auto sm:h-11 md:h-12 lg:h-14"
                unoptimized

              />
            </div>

            <div className="hidden items-center gap-5 lg:gap-7 xl:gap-10 md:flex">
              {navItems.map(item => {
                const href = hrefFor(item);
                const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
                if (item === 'Programs' && shouldShowProgramsDropdown) {
                  return (
                    <div
                      key={item}
                      className="relative flex items-center gap-1"
                      onMouseEnter={openProgramsMenu}
                      onMouseLeave={closeProgramsMenuWithDelay}
                    >
                      <a
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
                      <button
                        type="button"
                        aria-label="Toggle programs brands menu"
                        aria-expanded={programMenuOpen}
                        aria-haspopup="menu"
                        onClick={() => setProgramMenuOpen(openState => !openState)}
                        className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[var(--brand-accent)]"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${programMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {programMenuOpen && (
                        <div className="absolute left-0 top-full z-[90] w-[36rem] max-w-[90vw] pt-3">
                          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5">
                            <div className="border-b border-slate-200 bg-slate-50/70 p-3">
                              <div className="grid grid-cols-2 gap-2">
                                <a
                                  href="/programs"
                                  onClick={() => setProgramMenuOpen(false)}
                                  className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--brand-accent)] bg-[var(--brand-accent-soft)] px-3 py-2.5 text-sm font-semibold text-[var(--brand-accent)] transition-colors"
                                >
                                  <span className="flex min-w-0 items-center gap-2">
                                    {settings?.brand?.logo_icon_url ? (
                                      <Image
                                        src={settings.brand.logo_icon_url}
                                        alt={`${settings?.brand?.name || 'Current Program'} logo`}
                                        width={32}
                                        height={32}
                                        className="h-6 w-6 shrink-0 rounded-full border border-[var(--brand-accent)]/30 object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--brand-accent)]/30 bg-white text-[11px] font-bold uppercase">
                                        {brandInitial(settings?.brand?.name || 'Current Program')}
                                      </span>
                                    )}
                                    <span className="truncate">{settings?.brand?.name || 'Current Program'}</span>
                                  </span>
                                  <Check className="h-4 w-4 shrink-0" />
                                </a>
                              </div>
                            </div>

                            <div className="max-h-[22rem] overflow-y-auto p-3">
                              {featuredProgramDestinations.length > 0 && (
                                <>
                                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Programs</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    {featuredProgramDestinations.map(brand => (
                                      brand.href ? (
                                        <a
                                          key={brand.id}
                                          href={brand.href}
                                          onClick={() => setProgramMenuOpen(false)}
                                          className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]/60 hover:text-[var(--brand-accent)]"
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
                                              <div className="truncate text-[13px] leading-tight text-slate-600">{brand.subtitle}</div>
                                            </div>
                                          </div>
                                          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-[var(--brand-accent)]" />
                                        </a>
                                      ) : (
                                        <span
                                          key={brand.id}
                                          className="flex min-h-16 cursor-not-allowed items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400"
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
                                              <div className="truncate text-[13px] leading-tight text-slate-500">{brand.subtitle}</div>
                                            </div>
                                          </div>
                                          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                            Soon
                                          </span>
                                        </span>
                                      )
                                    ))}
                                  </div>
                                </>
                              )}

                              {extraProgramDestinations.length > 0 && (
                                <>
                                  <p className={`text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 ${featuredProgramDestinations.length > 0 ? 'mb-2 mt-4' : 'mb-2'}`}>
                                    More programs
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {extraProgramDestinations.map(brand => (
                                      brand.href ? (
                                        <a
                                          key={brand.id}
                                          href={brand.href}
                                          onClick={() => setProgramMenuOpen(false)}
                                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]/50 hover:text-[var(--brand-accent)]"
                                        >
                                          {brand.name}
                                        </a>
                                      ) : (
                                        <span
                                          key={brand.id}
                                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-400"
                                        >
                                          {brand.name}
                                        </span>
                                      )
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="border-t border-slate-200 p-3">
                              <a
                                href="/programs/discover"
                                onClick={() => setProgramMenuOpen(false)}
                                className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-[var(--brand-accent)] hover:bg-[var(--brand-accent-soft)]/50 hover:text-[var(--brand-accent)]"
                              >
                                <span className="truncate">Explore all programs</span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-[var(--brand-accent)]" />
                              </a>
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
                className="hidden min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:inline-flex"
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
            <div className="md:hidden">
              <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="space-y-2">
                  {navItems.map(item => {
                    const href = hrefFor(item);
                    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
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
                          {otherBrandProgramLinks.map(brand => (
                            brand.href ? (
                              <a
                                key={brand.id}
                                href={brand.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-700 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]"
                                onClick={() => setOpen(false)}
                              >
                                {brand.name}
                              </a>
                            ) : (
                              <span
                                key={brand.id}
                                className="block w-full cursor-not-allowed rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-400"
                              >
                                {brand.name}
                              </span>
                            )
                          ))}
                          <a
                            href="/programs/discover"
                            className="block w-full rounded-xl px-4 py-2.5 pl-7 text-left text-sm font-medium text-slate-700 transition hover:bg-[var(--brand-accent-soft)] hover:text-[var(--brand-accent)]"
                            onClick={() => setOpen(false)}
                          >
                            Explore all programs
                          </a>
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
                <div className="my-3 h-px w-full bg-gray-200" />
                <a
                  href={ctaHref}
                  className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setOpen(false)}
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
      <div>{navbarContent}</div>

      <div
        className={`${'fixed left-0 right-0 top-0 z-[70] will-change-transform transition-[transform,opacity] duration-300'} ${
          pinned ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      >
        {navbarContent}
      </div>

      {/* Overlay buat Searchnya */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-blue-900/70 p-4"
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
          </div>
        </div>
      )}
    </>
  );
}
