// components/analytics/PixelBootstrap.tsx
'use client';

import { useEffect } from 'react';
import { captureTiktokClickId } from '@/lib/analytics/pixels';

/**
 * Stashes ?ttclid= on first page view. TikTok's pixel does not persist its
 * click id to a cookie the way Meta's _fbc does, so without this a conversion
 * that lands days after the ad click has nothing to attribute it to.
 */
export default function PixelBootstrap() {
  useEffect(() => {
    captureTiktokClickId();
  }, []);

  return null;
}
