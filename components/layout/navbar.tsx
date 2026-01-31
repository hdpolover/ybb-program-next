'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search as SearchIcon, Menu, X } from 'lucide-react';

const navItems: string[] = ['Home', 'Programs', 'Partners & Sponsors', 'Announcements', 'FAQ'];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const submitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // TODO: ini baru hardcode, kalo mau berfungsi hubungin sama real search functionnya
    console.log('Search:', query);
    setSearchOpen(false);
  };
  return (
    <>
      {/* Bar atas */}
      <div className="h-1 w-full bg-gray-800"></div>

      {/* Navbar utama */}
      <nav
        className={`${'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60'} ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between md:h-24">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/img/jysfix.png"
                alt="Logo"
                width={420}
                height={420}
                className="h-9 w-auto sm:h-11 md:h-12 lg:h-14"
                priority
              />
            </div>

            {/* Link Navigasi buat Laptop / Komputer (desktop) */}
            <div className="hidden items-center space-x-10 md:flex">
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
                        ? 'text-lg font-semibold text-pink-600 transition-colors'
                        : 'text-lg font-semibold text-gray-600 transition-colors hover:text-pink-500'
                    }
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              {/* Ikon Pencarian */}
              <button
                className="text-gray-600 transition-colors hover:text-gray-800"
                aria-label="Search"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {/* CTA Desktop */}
              <a
                href="/login"
                className="hidden items-center justify-center rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700 md:inline-flex"
              >
                REGISTER NOW
              </a>

              {/* Tombol menu (mobile) */}
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
          {/* Panel buat Mobile Device */}
          {open && (
            <div className="md:hidden">
              <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                <div className="space-y-2">
                  {navItems.map(item => {
                    const href = hrefFor(item);
                    const isActive =
                      pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                      <a
                        key={item}
                        href={href}
                        aria-current={isActive ? 'page' : undefined}
                        className={
                          isActive
                            ? 'block w-full rounded-xl bg-pink-50 px-4 py-3 text-left text-base font-medium text-pink-600 transition'
                            : 'block w-full rounded-xl px-4 py-3 text-left text-base font-medium text-slate-800 transition hover:bg-pink-50 hover:text-pink-600'
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
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-700"
                  onClick={() => setOpen(false)}
                >
                  REGISTER NOW
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

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
                  className="w-full rounded-lg border border-slate-200 bg-white px-9 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-pink-600 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-pink-700"
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
