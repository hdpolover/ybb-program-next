// components/announcements/AnnouncementsGrid.tsx
//
// Server-rendered announcement list. Filtering, search and pagination all
// live in the URL (see app/announcements/page.tsx + AnnouncementsFilters /
// AnnouncementsPagination) instead of client state — every page/filter
// combination is real, crawlable, server-rendered HTML on first load.
import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import AnnouncementsFilters from '@/components/announcements/AnnouncementsFilters';
import AnnouncementsPagination from '@/components/announcements/AnnouncementsPagination';
import { AnnouncementDateLabel } from '@/components/announcements/AnnouncementDateLabel';
import { buildAnnouncementsHref, formatAnnouncementCategoryLabel, isExternalHref } from '@/lib/announcements';
import type { AnnouncementsSearchParams } from '@/lib/announcements';
import { componentsTheme } from '@/lib/theme/components';
import type { AnnouncementsFilterValues, AnnouncementsPagination as AnnouncementsPaginationData } from '@/types/announcements';

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

const EMPTY_FILTERS: AnnouncementsFilterValues = { categories: [], tags: [], programs: [] };
const EMPTY_SEARCH_PARAMS: AnnouncementsSearchParams = { page: 1 };

export default function AnnouncementsGrid({
  items,
  title = 'Information Page',
  subtitle = 'Stay updated with the latest news about our programs.',
  showControls = true,
  pagination,
  filters = EMPTY_FILTERS,
  current = EMPTY_SEARCH_PARAMS,
  basePath = '/announcements',
}: {
  items: AnnouncementItem[];
  title?: string;
  subtitle?: string;
  showControls?: boolean;
  /** Backend pagination metadata for this page — omit (or leave undefined) to render the list unpaginated. */
  pagination?: AnnouncementsPaginationData;
  /** Brand-scoped filter picklists, unaffected by the currently applied filters. */
  filters?: AnnouncementsFilterValues;
  /** The search params the server rendered this page with — drives pagination/filter link hrefs. */
  current?: AnnouncementsSearchParams;
  basePath?: string;
}) {
  const isFiltered = Boolean(current.search || current.category || current.tag || current.programId || current.year);

  if (!items || items.length === 0) {
    return (
      <section className="px-6 py-12 sm:py-14 md:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Announcements" title={title} />
          {subtitle ? <p className={componentsTheme.announcementsGrid.subtitle}>{subtitle}</p> : null}
          {showControls ? <AnnouncementsFilters current={current} filters={filters} basePath={basePath} /> : null}
          <EmptyState
            className="mt-10 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center"
            icon={
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-400" />
              </span>
            }
            title={isFiltered ? 'No announcements match your filters' : 'No announcements yet'}
            description={
              isFiltered
                ? 'Try a different search term or clear some filters to see more announcements.'
                : 'There are no announcements at the moment. Check back later for the latest news and updates.'
            }
            action={
              isFiltered ? (
                <Link
                  href={basePath}
                  className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Clear filters
                </Link>
              ) : undefined
            }
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

        {showControls ? <AnnouncementsFilters current={current} filters={filters} basePath={basePath} /> : null}

        <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((n) => {
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
                      {n.winners.map((name) => (
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
                    <span className="text-blue-900">
                      <AnnouncementDateLabel value={n.date} />
                    </span>
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

        {pagination ? (
          <AnnouncementsPagination
            currentPage={pagination.page}
            totalPages={pagination.total_pages}
            buildHref={(page) => buildAnnouncementsHref(current, { page }, basePath)}
          />
        ) : null}
      </div>
    </section>
  );
}
