// components/marketing/ActivityToast.tsx
'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import type { ActivityItem } from '@/lib/api/activity';
import { ActivityToastCard } from './ActivityToastCard';
import {
  FIRST_DELAY_MAX_MS,
  FIRST_DELAY_MIN_MS,
  GAP_MAX_MS,
  GAP_MIN_MS,
  MOBILE_BREAKPOINT_PX,
  SESSION_DISMISS_KEY,
  TOAST_DURATION_MS,
  randomBetween,
  shuffle,
} from './activityToastUtils';

type ActivityToastProps = {
  items: ActivityItem[];
};

function isDismissedForSession(): boolean {
  try {
    return window.sessionStorage.getItem(SESSION_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function markDismissedForSession(): void {
  try {
    window.sessionStorage.setItem(SESSION_DISMISS_KEY, '1');
  } catch {
    // Private browsing can reject writes. Losing the preference is acceptable.
  }
}

export function ActivityToast({ items }: ActivityToastProps) {
  useEffect(() => {
    if (items.length === 0) return;
    if (isDismissedForSession()) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let queue: ActivityItem[] = [];

    const stop = () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const dismissForSession = (id: string | number) => {
      markDismissedForSession();
      stop();
      toast.dismiss(id);
    };

    const showNext = () => {
      if (cancelled) return;

      if (queue.length === 0) queue = shuffle(items);
      const item = queue.shift();
      if (!item) return;

      const position = window.innerWidth < MOBILE_BREAKPOINT_PX ? 'bottom-center' : 'bottom-left';

      const id = toast.custom(() => <ActivityToastCard item={item} onDismiss={() => dismissForSession(id)} />, {
        duration: TOAST_DURATION_MS,
        position,
        className: 'activity-toast',
      });

      timer = setTimeout(showNext, randomBetween(GAP_MIN_MS, GAP_MAX_MS));
    };

    timer = setTimeout(showNext, randomBetween(FIRST_DELAY_MIN_MS, FIRST_DELAY_MAX_MS));

    return stop;
  }, [items]);

  return null;
}
