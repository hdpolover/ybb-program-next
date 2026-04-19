// Server-side Next.js Data Cache.
// Kept short so admin-side brand changes (logo, colors, contact info) surface
// on the landing within a minute without relying on cross-service cache-bust
// coordination. The /api/revalidate-settings route can flip cache instantly
// when the admin wants to force a refresh.
export const SETTINGS_CACHE_TAG = 'settings';
export const SETTINGS_CACHE_TTL = 60; // seconds

// Client-side localStorage — same reasoning as above. A stale entry older than
// this is ignored at read time, so reducing the constant implicitly expires
// anything older than 60s in the user's browser.
export const SETTINGS_LS_KEY = 'ybb:settings';
export const SETTINGS_LS_TTL_MS = 60 * 1000; // 60s
