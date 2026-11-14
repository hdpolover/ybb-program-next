// lib/auth/turnstileSiteKey.ts

// Browser -> BFF -> API all use this one header name.
export const TURNSTILE_HEADER = 'x-turnstile-token';

let cached: Promise<string | null> | null = null;

/**
 * Site key from the BFF's auth context, or null when Turnstile is off. Cached
 * for the page lifetime (it is per-brand config) but a failed lookup is not,
 * so a transient error does not disable the widget until reload.
 */
export function fetchTurnstileSiteKey(): Promise<string | null> {
  cached ??= fetch('/api/auth/context')
    .then(async (res) => {
      if (!res.ok) throw new Error(`auth context ${res.status}`);
      const json = (await res.json()) as { data?: { turnstileSiteKey?: unknown } | null };
      const key = json?.data?.turnstileSiteKey;
      return typeof key === 'string' && key ? key : null;
    })
    .catch(() => {
      cached = null;
      return null;
    });
  return cached;
}

/** Test seam. */
export function resetTurnstileSiteKeyCache(): void {
  cached = null;
}
