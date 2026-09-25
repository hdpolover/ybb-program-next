// components/announcements/AnnouncementsFilters.tsx
//
// Filter controls for /announcements — all of them navigate to a new URL
// instead of mutating local state, so filtered/paginated views stay
// server-rendered and shareable:
//   - category is a row of `<Link>` pills (mirrors the previous tab design)
//   - search / tag / edition / year are one <form method="get"> (works with
//     no JS at all: Enter, or the always-visible "Apply filters" button,
//     submits it)
//
// Client component only so tag/edition/year can auto-submit on change instead
// of silently doing nothing until the visitor notices and hits Enter — on
// mobile, number keypads often have no Enter key at all, so that made the
// filters look broken. `requestSubmit()` runs the exact same native GET
// submission Enter or the Apply button would, so there's one submit path, not
// two behaviors to keep in sync. Because the <form> has no hidden `page`
// field, every submit (JS or not) naturally drops any `page` query param —
// there's nothing to reset by hand.
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { buildAnnouncementYearOptions, buildAnnouncementsHref, formatAnnouncementCategoryLabel } from '@/lib/announcements';
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
  const formRef = useRef<HTMLFormElement>(null);
  const submitForm = () => formRef.current?.requestSubmit();

  const categoryTabs: { key?: string; label: string }[] = [
    { key: undefined, label: 'All' },
    ...filters.categories.map((category) => ({ key: category, label: formatAnnouncementCategoryLabel(category) })),
  ];

  // `years` is an optional, in-progress backend field (see AnnouncementsFilterValues) —
  // fall back to the free-text year input on any response that doesn't have it yet.
  const hasYearPicklist = filters.years !== undefined;
  const yearOptions = buildAnnouncementYearOptions(filters.years, current.year);

  return (
    <div className="mt-4 md:mt-6">
      <form ref={formRef} method="get" action={basePath} className="mx-auto w-full max-w-md">
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

        {filters.tags.length > 0 || filters.programs.length > 0 || hasYearPicklist || current.year !== undefined ? (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {filters.tags.length > 0 ? (
              <label className="block text-xs text-slate-600">
                <span className="sr-only">Tag</span>
                <select
                  name="tag"
                  defaultValue={current.tag ?? ''}
                  onChange={submitForm}
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
                  onChange={submitForm}
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
              {hasYearPicklist ? (
                <select
                  name="year"
                  defaultValue={current.year !== undefined ? String(current.year) : ''}
                  onChange={submitForm}
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/60"
                >
                  <option value="">All years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="number"
                  name="year"
                  inputMode="numeric"
                  defaultValue={current.year ?? ''}
                  placeholder="Year"
                  // A number input fires onChange per keystroke — submitting on every
                  // digit would reload the page mid-type. onBlur submits once the
                  // visitor is done (tabs or clicks away), which also covers mobile
                  // number keypads that have no Enter key.
                  onBlur={submitForm}
                  className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-primary/60"
                />
              )}
            </label>
          </div>
        ) : null}

        {/* Always-visible fallback submit, not a <noscript>-only one: Next hydration
            timing makes a noscript-gated button fragile (briefly absent/mismatched
            during hydration), while a plain always-rendered button works identically
            whether JS has loaded, is still loading, or never runs at all. */}
        <button
          type="submit"
          className="mt-3 w-full rounded-full border border-primary/30 bg-white px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
        >
          Apply filters
        </button>
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
