'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import {
  formatAnnouncementCategoryLabel,
  formatAnnouncementDateLabel,
  isExternalHref,
} from '@/lib/announcements';
import { BUSINESS_TIMEZONE } from '@/lib/format/deadline';
import { componentsTheme } from '@/lib/theme/components';
import { useHydrated } from '@/hooks/useHydrated';

export type AnnouncementItem = {
  id: number | string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  href?: string;
  category?: string;
  tags?: string[];
  winners?: string[];
};

export default function AnnouncementsGrid({
  items,
  title = 'Information Page',
  subtitle = 'Stay updated with the latest news about our programs.',
  showControls = true,
}: {
  items: AnnouncementItem[];
  title?: string;
  subtitle?: string;
  showControls?: boolean;
}) {
  // false during SSR/first client render; true once hydrated. Gates the date's
  // timezone — see hooks/useHydrated.ts.
  const hydrated = useHydrated();

  // search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // tombol load more — biar ga numpuk panjang, tampil bertahap
  const [visible, setVisible] = useState(Math.min(6, items?.length ?? 0));
  const categoryOptions = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((item) => item.category?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ),
    [items],
  );

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        (item.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [items, searchQuery, activeCategory]);

  const visibleItems = filteredItems.slice(0, visible);

  const handleChangeCategory = (category: string) => {
    setActiveCategory(category);
    setVisible(6);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisible(6);
  };

  if (!items || items.length === 0) {
    return (
      <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Announcements" title={title} />
          {subtitle ? <p className={componentsTheme.announcementsGrid.subtitle}>{subtitle}</p> : null}
          <EmptyState
            className="mt-10 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center"
            icon={
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-400" />
              </span>
            }
            title="No announcements yet"
            description="There are no announcements at the moment. Check back later for the latest news and updates."
          />
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Announcements" title={title} />
        {subtitle ? <p className={componentsTheme.announcementsGrid.subtitle}>{subtitle}</p> : null}

        {/* Search bar + category filter (optional) */}
        {showControls ? (
          <div className="mt-4 md:mt-6">
            <div className="mx-auto w-full max-w-md">
              <label className="sr-only" htmlFor="announcements-search">
                Search announcements
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Search className="h-4 w-4" aria-hidden="true" />
                </span>
                <input
                  id="announcements-search"
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder="Type keywords (e.g. scholarship, visa, deadline)"
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-blue-950 shadow-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium">
              {[{ key: 'all', label: 'All' }, ...categoryOptions.map((category) => ({
                key: category,
                label: formatAnnouncementCategoryLabel(category),
              }))].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleChangeCategory(tab.key)}
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 transition ${
                    activeCategory === tab.key
                      ? 'border-primary/100 bg-primary/10 text-primary shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:bg-primary/10/60 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* grid berita — komponen ini reusable biar gampang dipakai di halaman lain */}
        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map(n => {
            const dateLabel = formatAnnouncementDateLabel(
              n.date,
              hydrated ? undefined : { timeZone: BUSINESS_TIMEZONE },
            );
            const cardContent = (
              <>
                <div className="relative h-44 w-full overflow-hidden sm:h-52">
                  <Image
                    src={n.image}
                    alt={n.title}
                    fill
                    className="origin-center scale-100 transform object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {n.category ? (
                    <p className="mb-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {formatAnnouncementCategoryLabel(n.category)}
                    </p>
                  ) : null}
                  <h3 className="text-xl font-extrabold text-blue-950">{n.title}</h3>
                  {n.winners && n.winners.length > 0 ? (
                    <ol className="mt-2 list-decimal pl-5 text-sm leading-6 text-slate-700">
                      {n.winners.map(name => (
                        <li key={name}>{name}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-slate-700">{n.excerpt}</p>
                  )}
                  {n.tags && n.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-4 h-px w-full bg-slate-200" />
                  <p className="mt-3 text-xs font-semibold text-blue-900">
                    {n.author} <span className="text-slate-500"> - </span>{' '}
                    <span className="text-blue-900" suppressHydrationWarning>{dateLabel}</span>
                  </p>
                </div>
              </>
            );

            if (!n.href) {
              return (
                <article key={n.id} className={componentsTheme.announcementsGrid.card}>
                  {cardContent}
                </article>
              );
            }

            if (isExternalHref(n.href)) {
              return (
                <a
                  key={n.id}
                  href={n.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${componentsTheme.announcementsGrid.card} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link
                key={n.id}
                href={n.href}
                className={`${componentsTheme.announcementsGrid.card} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {visible < filteredItems.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible(v => Math.min(v + 6, filteredItems.length))}
              className={componentsTheme.announcementsGrid.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
