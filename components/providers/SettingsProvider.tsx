'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Toaster } from 'sonner';
import type { SettingsData } from '@/types/settings';
import { getSettingsLsKey, SETTINGS_LS_LEGACY_KEY, SETTINGS_LS_TTL_MS } from '@/lib/constants/cache';

export type RegistrationPhase = 'open' | 'upcoming' | 'closed';

type SettingsContextType = {
  settings: SettingsData | null;
  isLoading: boolean;
  /**
   * Whether the brand is currently accepting registrations, resolved once per
   * request in app/layout.tsx by the same rule the countdown uses.
   *
   * Deliberately NOT part of `settings`: that object is JSON-compared against a
   * refetch and cached to localStorage, so a per-request value would pollute
   * both. Any client CTA that offers registration should read this rather than
   * assume it can — the navbar's "REGISTER NOW" asserted it for years.
   */
  registrationPhase: RegistrationPhase;
  /**
   * Short WIB day-month label for when registration opens, e.g. "5 Sept".
   * Formatted on the SERVER so it cannot render in the viewer's timezone and
   * disagree with the countdown beside it - that exact bug shipped once already.
   * Null unless the phase is 'upcoming'.
   */
  registrationOpensLabel: string | null;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  // Default open: a surface that cannot learn the phase must not hide a CTA
  // from someone who can genuinely register. Failing the other way loses signups.
  registrationPhase: 'open',
  registrationOpensLabel: null,
});

export function SettingsProvider({
  children,
  initialSettings,
  registrationPhase = 'open',
  registrationOpensLabel = null,
}: {
  children: React.ReactNode;
  initialSettings: SettingsData | null;
  registrationPhase?: RegistrationPhase;
  registrationOpensLabel?: string | null;
}) {
  // Keep localStorage in sync with whatever the server provided.
  // Since getSettingsForBrandDomain uses unstable_cache server-side,
  // initialSettings is already the cached/fresh version from Next.js Data Cache.
  // Writing it here means client-side calls to getSettings() will hit localStorage
  // instead of the network for the configured TTL window, even after a browser reload.
  useEffect(() => {
    if (!initialSettings) return;
    try {
      const scopedKey = getSettingsLsKey(window.location.hostname);
      const stored = localStorage.getItem(scopedKey);
      if (stored) {
        const { data, cachedAt } = JSON.parse(stored) as { data: SettingsData; cachedAt: number };
        // Only update if server data differs or cached entry is older than half the TTL
        const isStale = Date.now() - cachedAt > SETTINGS_LS_TTL_MS / 2;
        const isDifferent = JSON.stringify(data.brand) !== JSON.stringify(initialSettings.brand);
        if (!isStale && !isDifferent) return;
      }
      localStorage.setItem(
        scopedKey,
        JSON.stringify({ data: initialSettings, cachedAt: Date.now() }),
      );
      if (localStorage.getItem(SETTINGS_LS_LEGACY_KEY)) {
        localStorage.removeItem(SETTINGS_LS_LEGACY_KEY);
      }
    } catch {
      // Ignore localStorage errors (private browsing, quota exceeded, etc.)
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings: initialSettings, isLoading: false, registrationPhase, registrationOpensLabel }}>
      {children}
      <Toaster position="top-center" richColors />
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
