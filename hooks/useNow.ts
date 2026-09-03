// hooks/useNow.ts
import { useEffect, useState } from 'react';

const ONE_MINUTE_MS = 60 * 1000;

/**
 * A clock that ADVANCES, for surfaces that derive a phase, a label or a
 * countdown from "now".
 *
 * Frozen at first render so the server HTML and the hydrating client agree,
 * then ticking. A `useState(() => new Date())` that never ticks was how the
 * fee cards ended up on a different clock from the sticky bar: the bar's phase
 * is baked server-side behind a 120s cache and the page reloads with it, while
 * a tab left open kept badging a window that had closed hours earlier.
 *
 * A minute is enough: the smallest unit any of these surfaces prints is hours,
 * and the sticky bar's own phase is already up to 120s stale.
 */
export function useNow(intervalMs: number = ONE_MINUTE_MS): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
