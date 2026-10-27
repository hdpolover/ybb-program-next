// lib/consent/useConsent.ts
'use client';

import { useSyncExternalStore } from 'react';
import {
  canTrack,
  getConsentPrompt,
  subscribeConsent,
  type ConsentPrompt,
} from '@/lib/consent/consent';

// Server snapshot is null so SSR and first hydration render agree; the real
// value arrives right after mount.
export function useCanTrack(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribeConsent, canTrack, () => null);
}

export function useConsentPrompt(): ConsentPrompt | null {
  return useSyncExternalStore<ConsentPrompt | null>(subscribeConsent, getConsentPrompt, () => null);
}
