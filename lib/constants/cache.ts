// Server-side Next.js Data Cache.
// Keep a moderate TTL for stable landing data and use revalidate endpoints
// for instant invalidation when admins publish changes.
export const SETTINGS_CACHE_TAG = 'settings';
export const SETTINGS_CACHE_TTL = 300; // seconds
export const HOME_CACHE_TAG = 'home';
export const HOME_CACHE_TTL = 120; // seconds
export const ACTIVITY_CACHE_TAG = 'landing-activity';
export const ACTIVITY_CACHE_TTL = 300; // seconds

function normalizeDomain(input: string): string {
  return (input || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '').split('/')[0].split(':')[0];
}

function normalizedSuffix(input: string): string {
  return normalizeDomain(input) || 'default';
}

export function getSettingsCacheTag(brandDomain: string): string {
  return `${SETTINGS_CACHE_TAG}:${normalizedSuffix(brandDomain)}`;
}

export function getHomeCacheTag(brandDomain: string): string {
  return `${HOME_CACHE_TAG}:${normalizedSuffix(brandDomain)}`;
}

export function getActivityCacheTag(brandDomain: string): string {
  return `${ACTIVITY_CACHE_TAG}:${normalizedSuffix(brandDomain)}`;
}

// Client-side localStorage — matches server TTL so stale entries expire together.
export const SETTINGS_LS_LEGACY_KEY = 'ybb:settings';
export function getSettingsLsKey(brandDomain: string): string {
  return `${SETTINGS_LS_LEGACY_KEY}:${normalizedSuffix(brandDomain)}`;
}
export const SETTINGS_LS_TTL_MS = SETTINGS_CACHE_TTL * 1000;
