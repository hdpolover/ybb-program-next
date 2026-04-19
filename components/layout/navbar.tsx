'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search as SearchIcon, Menu, X } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';
import type { SettingsData } from '@/types/settings';

const navItems: string[] = ['Home', 'Programs', 'Partners & Sponsors', 'Announcements', 'FAQ'];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [pinned, setPinned] = useState(false);
  const { settings } = useSettings();
  const pathname = usePathname();

  const lastScrollYRef = useRef(0);
  const scrollElRef = useRef<HTMLElement | null>(null);
  const activeScrollElRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
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



  const logoSrc = settings?.brand?.logo_color_url?.trim() || settings?.brand?.logo_url?.trim() || '/img/ybb-logo.png';

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
        className={`${'w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'} ${scrolled ? 'shadow-sm' : ''}`}
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
                href="/login"
                className="hidden min-h-11 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:inline-flex"
              >
                REGISTER NOW
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
                  href="/login"
                  className="mt-2 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => setOpen(false)}
                >
                  REGISTER NOW
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
        className={`${'fixed left-0 right-0 top-0 z-50 will-change-transform transition-[transform,opacity] duration-300'} ${
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
