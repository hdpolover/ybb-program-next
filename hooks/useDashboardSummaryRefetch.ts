// hooks/useDashboardSummaryRefetch.ts
import { useCallback, useEffect, useRef } from 'react';
import { getEnvelopeData } from '@/lib/api/response';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  DASHBOARD_SUMMARY_STALE_EVENT,
  appendProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
} from '@/lib/dashboard/activeProgram';

type Params = {
  registeredPrograms: Parameters<typeof resolveActiveProgramId>[0] | undefined;
  pathname: string | null;
  /** Receives the unwrapped envelope data; the caller maps it into state. */
  onSummary: (payload: unknown) => void;
};

/**
 * Keeps the dashboard summary fresh after the layout's mount fetch. The layout
 * outlives client navigations, so without this a payment cancelled on the
 * detail page left the overview card on its old "processing" state until a
 * hard reload. Refetches on: program switch, DASHBOARD_SUMMARY_STALE_EVENT,
 * pathname change (catch-all) and the tab becoming visible again (returning
 * from the gateway tab). Updates in place: never touches loading state, and
 * keeps the summary already on screen if the request fails.
 */
export function useDashboardSummaryRefetch({ registeredPrograms, pathname, onSummary }: Params) {
  const onSummaryRef = useRef(onSummary);
  useEffect(() => {
    onSummaryRef.current = onSummary;
  });
  // Only the latest request may write: a slow response for an older trigger
  // (or a program the participant already left) must not land on top.
  const latestRequest = useRef(0);
  const lastPathname = useRef(pathname);

  const refetchSummary = useCallback(async () => {
    if (!registeredPrograms) return;
    const requestId = ++latestRequest.current;
    const programId = resolveActiveProgramId(registeredPrograms, readActiveProgramId());

    try {
      const res = await fetch(appendProgramId('/api/portal/dashboard', programId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (requestId !== latestRequest.current || !res.ok) return;

      const json = (await res.json().catch(() => null)) as unknown;
      if (requestId !== latestRequest.current) return;

      onSummaryRef.current(getEnvelopeData(json));
    } catch {
      // Keep the summary already on screen; the next trigger retries.
    }
  }, [registeredPrograms]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refetchSummary();
    };
    const onStale = () => void refetchSummary();

    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, onStale);
    window.addEventListener(DASHBOARD_SUMMARY_STALE_EVENT, onStale);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      // Invalidate in-flight requests so nothing writes after unmount.
      latestRequest.current += 1;
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, onStale);
      window.removeEventListener(DASHBOARD_SUMMARY_STALE_EVENT, onStale);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refetchSummary]);

  // Skips the first render: the layout's mount fetch already covers it.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    void refetchSummary();
  }, [pathname, refetchSummary]);
}
