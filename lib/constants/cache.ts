// Server-side Next.js Data Cache.
// Keep a moderate TTL for stable landing data and use revalidate endpoints
// for instant invalidation when admins publish changes.
export const SETTINGS_CACHE_TAG = 'settings';
export const SETTINGS_CACHE_TTL = 300; // seconds
export const HOME_CACHE_TAG = 'home';
export const HOME_CACHE_TTL = 120; // seconds

// Client-side localStorage — matches server TTL so stale entries expire together.
export const SETTINGS_LS_KEY = 'ybb:settings';
export const SETTINGS_LS_TTL_MS = SETTINGS_CACHE_TTL * 1000;
