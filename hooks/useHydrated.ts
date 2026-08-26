// hooks/useHydrated.ts
"use client";

import { useEffect, useState } from "react";

/**
 * False during server render and the first client render, true afterwards.
 *
 * Needed for anything whose output depends on the VIEWER's environment —
 * timezone above all. A `"use client"` component is still server-rendered for
 * the initial HTML, where `Intl` resolves to the SERVER's timezone (UTC in
 * production). Formatting a datetime without guarding on this renders "14 Apr
 * 2026, UTC" into the HTML and then silently changes to the viewer's zone on
 * hydration, which React reports as a mismatch.
 *
 * Pair it with `suppressHydrationWarning` on the element that holds the value:
 * the two renders are INTENTIONALLY different, so the warning is noise, but the
 * difference must be confined to that element.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
