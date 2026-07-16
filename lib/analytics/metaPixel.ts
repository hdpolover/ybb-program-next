// lib/analytics/metaPixel.ts
type PixelParams = Record<string, unknown>;

interface TrackUserData {
  email?: string;
  phone?: string;
  externalId?: string;
}

// Generates the shared eventID used by both the browser pixel call and the
// server-side CAPI relay call, so Meta dedupes the two into a single event.
function generateEventId(): string {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (very old browsers).
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function fireFbq(event: string, params: PixelParams | undefined, eventId: string): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params, { eventID: eventId });
}

// Reads a browser cookie value client-side. Needed because the CAPI POST now
// goes cross-origin directly to the API domain, so the backend can't read the
// frontend's _fbp/_fbc cookies from the request — we pass them in the body.
function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Fire-and-forget POST directly to the backend Conversions API endpoint. Never
// awaited by callers, never throws — CAPI resilience against ad blockers is
// the whole point, so this must not depend on window.fbq being present, but
// it must still no-op during SSR (no window/fetch context). Cross-origin to
// the API domain: credentials omitted, _fbp/_fbc passed in the body.
function fireCapiRelay(params: {
  eventName: string;
  eventId: string;
  customData?: PixelParams;
  userData?: TrackUserData;
}): void {
  if (typeof window === 'undefined') return;

  // NEXT_PUBLIC_API_URL already ends in /v1 in this repo (e.g.
  // https://api.ybbhub.com/v1) — strip any trailing slash and append the path.
  const apiBase = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (!apiBase) return;
  const endpoint = `${apiBase}/meta/capi`;

  fetch(endpoint, {
    method: 'POST',
    keepalive: true,
    credentials: 'omit',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      eventName: params.eventName,
      eventId: params.eventId,
      eventSourceUrl: window.location.href,
      customData: params.customData,
      userData: params.userData,
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
    }),
  }).catch(() => {});
}

function track(event: string, params?: PixelParams, userData?: TrackUserData, eventId?: string): void {
  const id = eventId || generateEventId();
  fireFbq(event, params, id);
  fireCapiRelay({ eventName: event, eventId: id, customData: params, userData });
}

export function trackViewContent(params?: {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
}): void {
  track('ViewContent', params);
}

export function trackInitiateCheckout(params?: PixelParams): void {
  track('InitiateCheckout', params);
}

export function trackLead(params?: PixelParams, userData?: TrackUserData): void {
  track('Lead', params, userData);
}

export function trackCompleteRegistration(params?: PixelParams, userData?: TrackUserData): void {
  track('CompleteRegistration', params, userData);
}

export function trackPurchase(
  params: {
    value: number;
    currency: string;
    content_name?: string;
  },
  userData?: TrackUserData,
  eventId?: string,
): void {
  track('Purchase', params, userData, eventId);
}
