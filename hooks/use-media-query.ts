'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if a media query matches
 * @param query - Media query string
 * @returns Boolean indicating if query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize directly from matchMedia so there's no SSR mismatch flash.
  // The effect only subscribes to future changes — no sync setState needed.
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    // Sync once in case query changed between renders and the initial useState
    // didn't capture the new value yet (e.g. the query prop changed after mount).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

