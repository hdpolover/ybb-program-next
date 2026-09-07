// lib/analytics/pixels.ts
//
// One dispatcher for every ad-platform conversion event. A single call fires
// three ways: the Meta browser pixel, the TikTok browser pixel, and one relay
// POST to our API, which fans out server-side to Meta CAPI + TikTok Events API.
// All three carry the same eventId so both platforms dedupe browser vs server
// into a single conversion.
//
// Funnel layers these map to (see the API's TIKTOK_EVENT_NAMES for the
// server-side twin of the name map below):
//   L1a account signup        -> Lead
//   L1b application created   -> ApplicationCreated (custom, SERVER-ONLY:
//                                the browser knows neither the application id
//                                nor the category the API actually resolved)
//   L2  registration fee paid -> Purchase              <- the ROAS event
//   L2b program fee paid      -> ProgramFeePaid (custom)
//   L3  application submitted -> CompleteRegistration

type PixelParams = Record<string, unknown>;

export type RegistrationCategory = 'self_funded' | 'fully_funded';

interface TrackUserData {
  email?: string;
  phone?: string;
  externalId?: string;
}

// Meta event name -> TikTok event name. Mirrors TIKTOK_EVENT_NAMES in the API
// (services/api/src/modules/meta/tiktok-events.service.ts) — change both.
//
// The crossover is deliberate and looks wrong at a glance: Meta `Lead` (account
// signup) maps to TikTok `CompleteRegistration`, while Meta
// `CompleteRegistration` (application submitted) maps to TikTok `SubmitForm`.
// Each platform's nearest standard event sits at a different funnel depth.
// Do not "fix" this.
const TIKTOK_EVENT_NAMES: Record<string, string> = {
  PageView: 'Pageview',
  ViewContent: 'ViewContent',
  InitiateCheckout: 'InitiateCheckout',
  Lead: 'CompleteRegistration',
  ApplicationCreated: 'ApplicationCreated',
  Purchase: 'CompletePayment',
  ProgramFeePaid: 'ProgramFeePaid',
  CompleteRegistration: 'SubmitForm',
};

// Meta splits its API by whether the name is one of its own standard events;
// a custom name sent through `track` is silently dropped in Events Manager.
const META_STANDARD_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'InitiateCheckout',
  'Lead',
  'Purchase',
  'CompleteRegistration',
]);

// Generates the shared eventID used by the browser pixels and the server-side
// relay, so Meta and TikTok each dedupe the two into a single event.
function generateEventId(): string {
  if (typeof window !== 'undefined' && typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID (very old browsers).
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function fireFbq(event: string, params: PixelParams | undefined, eventId: string): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  const command = META_STANDARD_EVENTS.has(event) ? 'track' : 'trackCustom';
  window.fbq(command, event, params, { eventID: eventId });
}

// No ttq.identify here on purpose. TikTok's pixel would hash the email for us,
// but the server relay already sends SHA-256 identifiers under the same
// event_id, so browser-side matching adds nothing and would put a raw address
// on the wire.
function fireTtq(metaEvent: string, params: PixelParams | undefined, eventId: string): void {
  if (typeof window === 'undefined' || typeof window.ttq?.track !== 'function') return;
  const tiktokEvent = TIKTOK_EVENT_NAMES[metaEvent];
  if (!tiktokEvent) return;
  window.ttq.track(tiktokEvent, params, { event_id: eventId });
}

// Reads a browser cookie value client-side. Needed because the relay POST goes
// cross-origin directly to the API domain, so the backend can't read the
// frontend's _fbp/_fbc/_ttp cookies from the request — we pass them in the body.
function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// TikTok's click id arrives as ?ttclid= and, unlike _fbc, the pixel does not
// persist it to a cookie for us. Stash it on first sight so a conversion that
// happens days later still carries the click that paid for it.
const TTCLID_KEY = 'ybb_ttclid';

export function captureTiktokClickId(): void {
  if (typeof window === 'undefined') return;
  const ttclid = new URLSearchParams(window.location.search).get('ttclid');
  if (!ttclid) return;
  try {
    window.localStorage.setItem(TTCLID_KEY, ttclid);
  } catch {
    // Private mode / storage disabled — the event still sends, just unattributed.
  }
}

function readTtclid(): string | null {
  try {
    return window.localStorage.getItem(TTCLID_KEY);
  } catch {
    return null;
  }
}

/**
 * The click identifiers a conversion needs to be attributed back to the ad
 * that paid for it.
 *
 * These live only in the browser, so a conversion the API reports on its own
 * (a manual bank transfer approved days later, an application row created
 * during signup) has no way to reach them. Capturing them at signup and
 * storing them against the participant is what lets those server-side events
 * be attributed instead of merely counted.
 */
export function readAdAttribution(): Record<string, string> | undefined {
  if (typeof window === 'undefined') return undefined;
  const entries: Record<string, string | null> = {
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc'),
    ttp: readCookie('_ttp'),
    ttclid: readTtclid(),
  };
  const present = Object.entries(entries).filter(([, value]) => Boolean(value));
  return present.length ? Object.fromEntries(present as [string, string][]) : undefined;
}

// Fire-and-forget POST to the backend relay. Never awaited by callers, never
// throws — resilience against ad blockers is the whole point, so this must not
// depend on window.fbq/window.ttq being present, but it must still no-op during
// SSR (no window/fetch context). Cross-origin to the API domain: credentials
// omitted, cookies passed in the body.
function fireRelay(params: {
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

  // Deliberately the legacy path, not the newer /conversions/event alias: the
  // two repos deploy independently, and a frontend that ships before the API
  // would 404 every server-side event with no visible symptom. Switch it once
  // the API carrying the alias is live in production.
  fetch(`${apiBase}/meta/capi`, {
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
      ttp: readCookie('_ttp'),
      ttclid: readTtclid(),
    }),
  }).catch(() => {});
}

function track(event: string, params?: PixelParams, userData?: TrackUserData, eventId?: string): void {
  const id = eventId || generateEventId();
  fireFbq(event, params, id);
  fireTtq(event, params, id);
  fireRelay({ eventName: event, eventId: id, customData: params, userData });
}

// Both platforms read the funding category off `content_category`, which is why
// every layer takes it: without it the three funnel layers can't be broken down
// into self-funded vs fully-funded in Ads Manager.
function withCategory(params: PixelParams | undefined, category?: RegistrationCategory | null): PixelParams | undefined {
  if (!category) return params;
  return { ...(params || {}), content_category: category };
}

/**
 * Narrows a loose category string to the union the pixels expect. Sources vary
 * in shape: the signup link carries `self_funded`, while the dashboard summary
 * can carry a display form like "Fully Funded" — both must land on the same
 * value or the Ads Manager breakdown splits into near-duplicate buckets.
 */
export function toRegistrationCategory(value: string | null | undefined): RegistrationCategory | null {
  const normalized = (value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
  return normalized === 'self_funded' || normalized === 'fully_funded' ? normalized : null;
}

export function trackViewContent(params?: {
  content_name?: string;
  content_ids?: string[];
  content_type?: string;
}): void {
  track('ViewContent', params);
}

export function trackInitiateCheckout(params?: PixelParams, category?: RegistrationCategory | null): void {
  track('InitiateCheckout', withCategory(params, category));
}

/** Layer 1a — account created. */
export function trackLead(
  params?: PixelParams,
  userData?: TrackUserData,
  category?: RegistrationCategory | null,
): void {
  track('Lead', withCategory(params, category), userData);
}

/** Layer 3 — application submitted. */
export function trackCompleteRegistration(
  params?: PixelParams,
  userData?: TrackUserData,
  category?: RegistrationCategory | null,
): void {
  track('CompleteRegistration', withCategory(params, category), userData);
}

/**
 * Layer 2 — registration fee paid. The ROAS conversion.
 *
 * The API fires this same event server-side off `payment.succeeded` with the
 * same `purchase_<invoiceId>` eventId, which is what makes it survive a
 * participant who pays by manual transfer and never returns to the page.
 */
export function trackPurchase(
  params: {
    value: number;
    currency: string;
    content_name?: string;
  },
  userData?: TrackUserData,
  eventId?: string,
  category?: RegistrationCategory | null,
): void {
  track('Purchase', withCategory(params, category), userData, eventId);
}

/** Layer 2b — a non-registration invoice (program fee) was paid. */
export function trackProgramFeePaid(
  params: {
    value: number;
    currency: string;
    content_name?: string;
  },
  userData?: TrackUserData,
  eventId?: string,
  category?: RegistrationCategory | null,
): void {
  track('ProgramFeePaid', withCategory(params, category), userData, eventId);
}
