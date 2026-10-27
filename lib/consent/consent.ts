// lib/consent/consent.ts
//
// Cookie-consent state shared by the trackers, the banner and the pixel
// dispatcher. Region-based: opt-in regions track nothing until Accept; every
// other region tracks immediately and shows a dismissible notice instead.
// Region comes from the browser timezone because not every brand domain sits
// behind Cloudflare, so a country header can't be relied on.

export type ConsentStatus = 'granted' | 'denied';
export type ConsentPrompt = 'banner' | 'notice';

export const CONSENT_KEY = 'ybb_consent_v1';

// EU/EEA, UK, Switzerland, Turkey, South Korea. Every Europe/* zone is covered
// by the prefix check (that also catches Moscow/Minsk: over-asking is safe).
const OPT_IN_ZONES = new Set([
  'Atlantic/Reykjavik',
  'Atlantic/Canary',
  'Atlantic/Madeira',
  'Atlantic/Azores',
  'Atlantic/Faroe',
  'Arctic/Longyearbyen',
  'Asia/Istanbul',
  'Asia/Nicosia',
  'Asia/Famagusta',
  'Asia/Seoul',
  'ROK',
  'Turkey',
  'GB',
  'Eire',
]);

/** Unknown timezone fails safe to opt-in. */
export function isOptInRegion(timeZone: string | null | undefined): boolean {
  if (!timeZone) return true;
  return timeZone.startsWith('Europe/') || OPT_IN_ZONES.has(timeZone);
}

function getTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

// Fallback for when storage throws (private mode, blocked site data): the
// choice still holds for this page load instead of silently doing nothing.
let memoryStatus: ConsentStatus | null = null;

export function readConsent(): ConsentStatus | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (raw) {
      const status = (JSON.parse(raw) as { status?: unknown } | null)?.status;
      if (status === 'granted' || status === 'denied') return status;
    }
  } catch {
    // Unavailable storage or corrupt JSON: treated as no stored choice.
  }
  return memoryStatus;
}

/** Test helper: forget the stored choice. */
export function resetConsent(): void {
  memoryStatus = null;
  reopenRequested = false;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
}

/** Whether tracking scripts / the server relay may run right now. */
export function canTrack(): boolean {
  if (typeof window === 'undefined') return false;
  const status = readConsent();
  if (status) return status === 'granted';
  return !isOptInRegion(getTimeZone());
}

let reopenRequested = false;
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

export function writeConsent(status: ConsentStatus): void {
  memoryStatus = status;
  reopenRequested = false;
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ status, ts: Date.now() }));
  } catch {
    // Kept in memory above.
  }
  emit();
}

/** Footer "Cookie settings": show the prompt again even though a choice exists. */
export function openConsentPrompt(): void {
  reopenRequested = true;
  emit();
}

/** Which prompt to show, if any. Client-only; never call during SSR. */
export function getConsentPrompt(): ConsentPrompt | null {
  if (readConsent() && !reopenRequested) return null;
  return isOptInRegion(getTimeZone()) ? 'banner' : 'notice';
}

// GA (_ga, _ga_<id>, _gid), Meta (_fbp, _fbc) and TikTok (_ttp, _tt_*) cookies.
const TRACKER_COOKIE = /^(_ga|_gid|_gat|_fbp|_fbc|_ttp|_tt_)/;

/**
 * Expires tracker cookies on withdrawal. They are set on the registrable
 * domain (e.g. .koreayouthsummit.com), so try every parent of the host.
 */
export function clearTrackerCookies(): void {
  const names = document.cookie
    .split(';')
    .map((part) => part.split('=')[0].trim())
    .filter((name) => TRACKER_COOKIE.test(name));
  const labels = window.location.hostname.split('.');
  const domains = labels.slice(0, -1).map((_, i) => labels.slice(i).join('.'));
  for (const name of names) {
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`;
    }
  }
}
