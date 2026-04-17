'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type DashboardMode = 'participant' | 'ambassador';

const STORAGE_KEY = 'ybb_dashboard_mode';

type DashboardModeContextValue = {
  mode: DashboardMode;
  setMode: (mode: DashboardMode) => void;
  /** True only after first client render — avoids SSR mismatch */
  ready: boolean;
};

const DashboardModeContext = createContext<DashboardModeContextValue>({
  mode: 'participant',
  setMode: () => {},
  ready: false,
});

export function DashboardModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DashboardMode>('participant');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as DashboardMode | null;
      if (stored === 'ambassador' || stored === 'participant') {
        setModeState(stored);
      }
    } catch {}
    setReady(true);
  }, []);

  const setMode = useCallback((next: DashboardMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  return (
    <DashboardModeContext.Provider value={{ mode, setMode, ready }}>
      {children}
    </DashboardModeContext.Provider>
  );
}

export function useDashboardMode() {
  return useContext(DashboardModeContext);
}
