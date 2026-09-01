// components/announcements/AnnouncementsPagination.tsx
//
// Real, crawlable numbered pagination for /announcements: every page and the
// prev/next controls are `<Link>`s pointing at `?page=N&...` (current filters
// preserved), rendered server-side — no client state, no "Load More" slice.
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getPaginationRange } from '@/lib/announcements';

export default function AnnouncementsPagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const tokens = getPaginationRange(currentPage, totalPages);

  return (
    <nav aria-label="Announcements pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      <PaginationControl
        href={buildHref(currentPage - 1)}
        disabled={currentPage <= 1}
        ariaLabel="Previous page"
      >
        Prev
      </PaginationControl>

      {tokens.map((token, index) =>
        token === 'ellipsis-start' || token === 'ellipsis-end' ? (
          // eslint-disable-next-line react/no-array-index-key -- tokens are positional, not identity-bearing
          <span key={`${token}-${index}`} aria-hidden="true" className="px-1.5 text-sm text-slate-400">
            …
          </span>
        ) : (
          <PaginationControl
            key={token}
            href={buildHref(token)}
            current={token === currentPage}
            ariaLabel={`Page ${token}`}
          >
            {token}
          </PaginationControl>
        ),
      )}

      <PaginationControl
        href={buildHref(currentPage + 1)}
        disabled={currentPage >= totalPages}
        ariaLabel="Next page"
      >
        Next
      </PaginationControl>
    </nav>
  );
}

function PaginationControl({
  href,
  children,
  current,
  disabled,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  current?: boolean;
  disabled?: boolean;
  ariaLabel: string;
}) {
  const baseClass =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition';

  // Disabled ends (Prev on page 1, Next on the last page) render as a
  // non-interactive span — no dead link, no click handler pretending to navigate.
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={ariaLabel} className={`${baseClass} cursor-not-allowed border-slate-100 text-slate-300`}>
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel}
      className={`${baseClass} ${
        current
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-slate-200 text-slate-600 hover:border-primary/30 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}
