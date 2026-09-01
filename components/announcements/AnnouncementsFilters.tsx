// components/announcements/AnnouncementsFilters.tsx
//
// Filter controls for /announcements — all of them navigate to a new URL
// instead of mutating local state, so filtered/paginated views stay
// server-rendered and shareable:
//   - category is a row of `<Link>` pills (mirrors the previous tab design)
//   - search / tag / edition / year are one <form method="get"> (works with
//     no JS at all; the search field's submit button doubles as the Enter-key
//     handler for the whole form)
import Link from 'next/link';
import { Search } from 'lucide-react';
import { buildAnnouncementsHref, formatAnnouncementCategoryLabel } from '@/lib/announcements';
import type { AnnouncementsSearchParams } from '@/lib/announcements';
import type { AnnouncementsFilterValues } from '@/types/announcements';

export default function AnnouncementsFilters({
  current,
  filters,
  basePath,
}: {
  current: AnnouncementsSearchParams;
  filters: AnnouncementsFilterValues;
  basePath: string;
}) {
  const categoryTabs: { key?: string; label: string }[] = [
    { key: undefined, label: 'All' },
    ...filters.categories.map((category) => ({ key: category, label: formatAnnouncementCategoryLabel(category) })),
  ];

  return (
    <div className="mt-4 md:mt-6">
      <form method="get" action={basePath} className="mx-auto w-full max-w-md">
        {/* Category isn't a field in this form (it's the Link-based pills below) —
            carry it through as a hidden field so submitting search/tag/edition/year
            doesn't clear the active category. */}
        {current.category ? <input type="hidden" name="category" value={current.category} /> : null}

        <label className="sr-only" htmlFor="announcements-search">
          Search announcements
        </label>
        <div className="relative">
          <button
            type="submit"
            aria-label="Search announcements"
            className="absolute inset-y-0 left-3 flex items-center text-slate-400 transition hover:text-primary"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id="announcements-search"
            type="text"
            name="q"
            defaultValue={current.search ?? ''}
            placeholder="Type keywords (e.g. scholarship, visa, deadline)"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-blue-950 shadow-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {filters.tags.length > 0 || filters.programs.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {filters.tags.length > 0 ? (
              <label className="block text-xs text-slate-600">
                <span className="sr-only">Tag</span>
                <select
                  name="tag"
                  defaultValue={current.tag ?? ''}
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/60"
                >
                  <option value="">All tags</option>
                  {filters.tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            {filters.programs.length > 0 ? (
              <label className="block text-xs text-slate-600">
                <span className="sr-only">Edition</span>
                <select
                  name="edition"
                  defaultValue={current.programId ?? ''}
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/60"
                >
                  <option value="">All editions</option>
                  {filters.programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="block text-xs text-slate-600">
              <span className="sr-only">Year</span>
              <input
                type="number"
                name="year"
                inputMode="numeric"
                defaultValue={current.year ?? ''}
                placeholder="Year"
                className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/60"
              />
            </label>
          </div>
        ) : null}
      </form>

      {categoryTabs.length > 1 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium">
          {categoryTabs.map((tab) => {
            const isActive = current.category === tab.key;
            return (
              <Link
                key={tab.label}
                href={buildAnnouncementsHref(current, { category: tab.key, page: 1 }, basePath)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center justify-center rounded-full border px-3 py-1 transition ${
                  isActive
                    ? 'border-primary/100 bg-primary/10 text-primary shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:bg-primary/10/60 hover:text-primary'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
