// components/marketing/ActivityToastCard.tsx
'use client';

import type { ActivityItem } from '@/lib/api/activity';
import { buildActivityMessage, toFlagEmoji } from './activityToastUtils';

type ActivityToastCardProps = {
  item: ActivityItem;
  onDismiss: () => void;
};

export function ActivityToastCard({ item, onDismiss }: ActivityToastCardProps) {
  const flag = toFlagEmoji(item.countryCode);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full max-w-sm items-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-foreground shadow-lg"
    >
      {flag ? (
        <span aria-hidden="true" className="text-2xl leading-none">
          {flag}
        </span>
      ) : null}
      <p className="flex-1 text-sm font-semibold leading-snug">{buildActivityMessage(item)}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss activity notifications"
        className="shrink-0 rounded-full p-1 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
