'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  // Trigger overlay animation only on first visit per pathname
  useEffect(() => {
    if (!pathname) return;

    // read visited paths from localStorage
    let visited: string[] = [];
    try {
      const raw = window.localStorage.getItem('ybb_visited_paths');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          visited = parsed;
        }
      }
    } catch {
      // ignore parse errors and treat as no cache
    }

    // if this pathname already visited, skip overlay
    if (visited.includes(pathname)) {
      setIsActive(false);
      return;
    }

    // mark as visited for next time
    const updated = Array.from(new Set([...visited, pathname]));
    try {
      window.localStorage.setItem('ybb_visited_paths', JSON.stringify(updated));
    } catch {
      // ignore quota errors
    }

    setIsActive(true);
    const id = setTimeout(() => setIsActive(false), 4000); // 4s overlay for first-time visit
    return () => clearTimeout(id);
  }, [pathname]);

  // Lock body scroll while overlay is active
  useEffect(() => {
    if (!isActive) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[9999] flex items-center justify-center bg-pink-600/80 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center gap-3 text-center text-white">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/90">Loading page</p>
      </div>
    </div>
  );
}
