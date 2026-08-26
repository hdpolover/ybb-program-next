// components/programs/TimelineDateLabel.tsx
"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { formatViewerDayIfDifferent } from "@/lib/format/timeline";

type Props = {
  /** The WIB label already computed server-side, e.g. "15 Aug 2026 WIB". */
  wibLabel: string;
  /** The structured instant this item starts at, if the row has one. */
  startDate?: string | null;
  className?: string;
};

/**
 * Agenda date label: WIB always, plus the viewer's own day when it differs.
 *
 * Program agenda entries describe physical events in Indonesia, so WIB is the
 * authoritative label — it is what a printed agenda says. Converting it away
 * would leave a participant unable to reconcile the site with the schedule in
 * their hand. But for a viewer far enough east or west the event genuinely
 * falls on a different calendar day, and showing only the Jakarta day hides
 * that from exactly the people it matters most to.
 *
 * So both are shown, and the viewer's day appears ONLY when it differs — when
 * the days agree a second label adds nothing.
 *
 * The WIB half renders identically on server and client, so only the appended
 * span is hydration-dependent.
 */
export function TimelineDateLabel({ wibLabel, startDate, className }: Props) {
  const hydrated = useHydrated();
  const viewerDay = hydrated ? formatViewerDayIfDifferent(startDate) : null;

  return (
    <span className={className}>
      {wibLabel}
      {viewerDay ? (
        <span suppressHydrationWarning> · {viewerDay} your time</span>
      ) : null}
    </span>
  );
}
