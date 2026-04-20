// Server-side Next.js Data Cache.
// 15s TTL so brand logo/color changes surface quickly without cross-service
// cache-bust coordination. The /api/settings/revalidate route can flush instantly.
export const SETTINGS_CACHE_TAG = 'settings';
export const SETTINGS_CACHE_TTL = 15; // seconds

// Client-side localStorage — matches server TTL so stale entries expire together.
export const SETTINGS_LS_KEY = 'ybb:settings';
export const SETTINGS_LS_TTL_MS = 15 * 1000; // 15s
