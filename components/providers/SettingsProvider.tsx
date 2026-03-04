'use client';

import React, { createContext, useContext } from 'react';
import type { SettingsData } from '@/types/settings';

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
  return (
    <SettingsContext.Provider value={{ settings: initialSettings, isLoading: false }}>
      {children}
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
