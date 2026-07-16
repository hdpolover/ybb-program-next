// components/analytics/ViewContentTracker.tsx
'use client';

import { useEffect } from 'react';
import { trackViewContent } from '@/lib/analytics/metaPixel';

interface ViewContentTrackerProps {
  contentId?: string | number | null;
  contentName?: string | null;
}

export function ViewContentTracker({ contentId, contentName }: ViewContentTrackerProps) {
  useEffect(() => {
    trackViewContent({
      content_name: contentName ?? undefined,
      content_ids: contentId != null ? [String(contentId)] : undefined,
      content_type: 'product',
    });
  }, [contentId, contentName]);

  return null;
}
