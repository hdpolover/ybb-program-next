'use client';

import { useEffect } from 'react';

type AppVersionWatcherProps = {
  currentVersion: string;
};

const CHECK_INTERVAL_MS = 60_000;
const RELOAD_TARGET_STORAGE_KEY = 'ybb:app-version:reload-target';

type AppVersionResponse = {
  version?: string;
};

async function fetchLiveVersion(): Promise<string | null> {
  const response = await fetch('/api/app-version', {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as AppVersionResponse;
  return typeof payload.version === 'string' && payload.version.trim().length > 0
    ? payload.version.trim()
    : null;
}

async function clearRuntimeCaches(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(registration => registration.unregister()));
  }

  if ('caches' in window) {
    const keys = await window.caches.keys();
    await Promise.all(keys.map(key => window.caches.delete(key)));
  }
}

export default function AppVersionWatcher({ currentVersion }: AppVersionWatcherProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !currentVersion) {
      return;
    }

    let isDisposed = false;
    let isChecking = false;

    const reloadIntoLatestBuild = async (nextVersion: string) => {
      const lastReloadTarget = window.sessionStorage.getItem(RELOAD_TARGET_STORAGE_KEY);
      if (lastReloadTarget === nextVersion) {
        return;
      }

      window.sessionStorage.setItem(RELOAD_TARGET_STORAGE_KEY, nextVersion);
      await clearRuntimeCaches();
      window.location.reload();
    };

    const checkForNewVersion = async () => {
      if (isDisposed || isChecking) {
        return;
      }

      isChecking = true;

      try {
        const liveVersion = await fetchLiveVersion();
        if (!liveVersion || isDisposed) {
          return;
        }

        if (liveVersion === currentVersion) {
          if (window.sessionStorage.getItem(RELOAD_TARGET_STORAGE_KEY) === liveVersion) {
            window.sessionStorage.removeItem(RELOAD_TARGET_STORAGE_KEY);
          }
          return;
        }

        await reloadIntoLatestBuild(liveVersion);
      } catch (error) {
        console.error('[AppVersionWatcher] Failed to check live version:', error);
      } finally {
        isChecking = false;
      }
    };

    const intervalId = window.setInterval(() => {
      void checkForNewVersion();
    }, CHECK_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkForNewVersion();
      }
    };

    const handleWindowFocus = () => {
      void checkForNewVersion();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      isDisposed = true;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [currentVersion]);

  return null;
}