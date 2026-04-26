'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Toaster } from 'sonner';
import type { SettingsData } from '@/types/settings';
import { SETTINGS_LS_KEY, SETTINGS_LS_TTL_MS } from '@/lib/constants/cache';

type SettingsContextType = {
  settings: SettingsData | null;
  isLoading: boolean;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
});

export function SettingsProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: SettingsData | null;
}) {
  // Keep localStorage in sync with whatever the server provided.
  // Since getSettingsForBrandDomain uses unstable_cache (1 hr TTL) server-side,
  // initialSettings is already the cached/fresh version from Next.js Data Cache.
  // Writing it here means client-side calls to getSettings() will hit localStorage
  // instead of the network for the next hour, even after a browser reload.
  useEffect(() => {
    if (!initialSettings) return;
    try {
      const stored = localStorage.getItem(SETTINGS_LS_KEY);
      if (stored) {
        const { data, cachedAt } = JSON.parse(stored) as { data: SettingsData; cachedAt: number };
        // Only update if server data differs or cached entry is older than half the TTL
        const isStale = Date.now() - cachedAt > SETTINGS_LS_TTL_MS / 2;
        const isDifferent = JSON.stringify(data.brand) !== JSON.stringify(initialSettings.brand);
        if (!isStale && !isDifferent) return;
      }
      localStorage.setItem(
        SETTINGS_LS_KEY,
        JSON.stringify({ data: initialSettings, cachedAt: Date.now() }),
      );
    } catch {
      // Ignore localStorage errors (private browsing, quota exceeded, etc.)
    }
  }, [initialSettings]);

  return (
    <SettingsContext.Provider value={{ settings: initialSettings, isLoading: false }}>
      {children}
      <Toaster position="bottom-right" richColors />
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
