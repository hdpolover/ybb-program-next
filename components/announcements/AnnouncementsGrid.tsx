'use client';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';

export type AnnouncementCategory =
  | 'awards'
  | 'scholarship'
  | 'program-news'
  | 'conference'
  | 'summit';

export type AnnouncementItem = {
  id: number | string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  href?: string;
  category?: AnnouncementCategory;
  winners?: string[];
};

export default function AnnouncementsGrid({
  items,
  title = 'Information Page',
  subtitle = 'Stay updated with the latest news about our programs.',
}: {
  items: AnnouncementItem[];
  title?: string;
  subtitle?: string;
  showControls?: boolean;
}) {
  const showControls = arguments[0]?.showControls ?? true;
  // search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | AnnouncementCategory>('all');

  // tombol load more — biar ga numpuk panjang, tampil bertahap
  const [visible, setVisible] = useState(Math.min(6, items.length));

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        !q || item.title.toLowerCase().includes(q) || item.excerpt.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [items, searchQuery, activeCategory]);

  const visibleItems = filteredItems.slice(0, visible);

  const handleChangeCategory = (category: 'all' | AnnouncementCategory) => {
    setActiveCategory(category);
    setVisible(6);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisible(6);
  };

  return (
    <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Announcements" title={title} />
        {subtitle ? <p className={jysSectionTheme.announcementsGrid.subtitle}>{subtitle}</p> : null}

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
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-blue-950 shadow-sm outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium">
              {[
                { key: 'all', label: 'All' },
                { key: 'awards', label: 'Awards' },
                { key: 'scholarship', label: 'Scholar' },
                { key: 'program-news', label: 'Program' },
                { key: 'conference', label: 'Conference' },
                { key: 'summit', label: 'Summit' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleChangeCategory(tab.key as 'all' | AnnouncementCategory)}
                  className={`inline-flex items-center justify-center rounded-full border px-3 py-1 transition ${
                    activeCategory === tab.key
                      ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-pink-200 hover:bg-pink-50/60 hover:text-pink-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* grid berita — komponen ini reusable biar gampang dipakai di halaman lain */}
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm font-medium text-slate-600">
            {DATA_NOT_ADDED}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map(n => {
              const Wrapper: React.ElementType = n.href ? 'a' : 'article';
              return (
                <Wrapper
                  key={n.id}
                  {...(n.href ? { href: n.href } : {})}
                  className={jysSectionTheme.announcementsGrid.card}
                >
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
                      <p className="mb-2 inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pink-700">
                        {n.category === 'program-news'
                          ? 'Program'
                          : n.category === 'scholarship'
                            ? 'Scholar'
                            : n.category === 'conference'
                              ? 'Conference'
                              : n.category === 'awards'
                                ? 'Awards'
                                : n.category === 'summit'
                                  ? 'Summit'
                                  : n.category}
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
                    <div className="mt-4 h-px w-full bg-slate-200" />
                    <p className="mt-3 text-xs font-semibold text-blue-900">
                      {n.author} <span className="text-slate-500"> - </span>{' '}
                      <span className="text-blue-900">{n.date}</span>
                    </p>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}

        {visible < filteredItems.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible(v => Math.min(v + 6, filteredItems.length))}
              className={jysSectionTheme.announcementsGrid.loadMoreButton}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
