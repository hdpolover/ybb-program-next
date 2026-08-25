// components/announcements/AnnouncementDateLabel.tsx
"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { formatAnnouncementDateLabel } from "@/lib/announcements";
import { BUSINESS_TIMEZONE } from "@/lib/format/deadline";

type Props = {
  /** ISO string or date-only string from the API. */
  value?: string | null;
};

/**
 * Renders an announcement's publish date in the VIEWER's own timezone.
 *
 * formatAnnouncementDateLabel resolves to the AMBIENT zone when no explicit
 * timeZone is passed: correct once running in the browser, but the SERVER's
 * zone (UTC in production) during SSR and the first client render. The page
 * this is used from is a Server Component, so there is no `hydrated` flag
 * available there to guard the call directly - this leaf carries that guard
 * client-side, pinning to the business timezone before hydration. Matches the
 * same convention already used in AnnouncementsGrid.
 */
export function AnnouncementDateLabel({ value }: Props) {
  const hydrated = useHydrated();
  const label = formatAnnouncementDateLabel(
    value,
    hydrated ? undefined : { timeZone: BUSINESS_TIMEZONE },
  );

  return <span suppressHydrationWarning>{label}</span>;
}
