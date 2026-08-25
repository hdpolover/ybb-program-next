// components/common/LocalDateTime.tsx
"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { formatDeadlineLocal, formatDeadlineWib } from "@/lib/format/deadline";

type Props = {
  /** ISO string or Date from the API. All backend datetimes are stored UTC (timestamptz). */
  value: string | Date | null | undefined;
  /** Include hour and minute. Defaults to true. */
  withTime?: boolean;
  className?: string;
};

/**
 * Renders an instant in the VIEWER's own timezone.
 *
 * Storage is UTC everywhere (278 timestamptz columns), so the instant is
 * unambiguous; only the presentation is localised. Before hydration the
 * viewer's timezone is unknowable, so the server emits the business timezone
 * (WIB) with an explicit label rather than the server's own UTC — a reader
 * without JS, and any crawler, then sees a correctly-labelled Jakarta time
 * instead of a misleading unlabelled one.
 *
 * `suppressHydrationWarning` is deliberate: the server and client renders
 * differ by design. It is scoped to this element only.
 */
export function LocalDateTime({ value, withTime = true, className }: Props) {
  const hydrated = useHydrated();
  const text = hydrated
    ? formatDeadlineLocal(value, { withTime })
    : formatDeadlineWib(value, { withTime });

  return (
    <time
      className={className}
      dateTime={value instanceof Date ? value.toISOString() : (value ?? undefined)}
      suppressHydrationWarning
    >
      {text}
    </time>
  );
}
