// __tests__/consent.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CONSENT_KEY,
  canTrack,
  clearTrackerCookies,
  getConsentPrompt,
  isOptInRegion,
  openConsentPrompt,
  readConsent,
  resetConsent,
  writeConsent,
} from '@/lib/consent/consent';
import { readAdAttribution, trackLead } from '@/lib/analytics/pixels';

function setTimeZone(timeZone: string | undefined) {
  vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({ timeZone } as Intl.ResolvedDateTimeFormatOptions);
}

// Own storage stub: newer Node versions ship a half-working global localStorage
// that shadows jsdom's, so these tests don't depend on the environment's one.
function installStorage(overrides: Partial<Storage> = {}) {
  const data = new Map<string, string>();
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    ...overrides,
  } as Storage;
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true });
}

beforeEach(() => {
  installStorage();
  resetConsent();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('isOptInRegion', () => {
  it.each(['Europe/Berlin', 'Europe/Istanbul', 'Europe/London', 'Asia/Seoul', 'Atlantic/Azores', 'GB', 'Turkey'])(
    'treats %s as opt-in',
    (zone) => expect(isOptInRegion(zone)).toBe(true),
  );

  it.each(['Asia/Jakarta', 'America/New_York', 'Australia/Sydney'])('treats %s as notice-only', (zone) =>
    expect(isOptInRegion(zone)).toBe(false),
  );

  it('fails safe to opt-in when the timezone is unknown', () => {
    expect(isOptInRegion(undefined)).toBe(true);
    expect(isOptInRegion('')).toBe(true);
  });
});

describe('storage', () => {
  it('returns null for corrupt JSON', () => {
    window.localStorage.setItem(CONSENT_KEY, '{not json');
    expect(readConsent()).toBeNull();
  });

  it('returns null for an unknown status value', () => {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ status: 'maybe' }));
    expect(readConsent()).toBeNull();
  });

  it('survives a throwing localStorage and keeps the choice in memory', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    installStorage({ getItem: blocked, setItem: blocked, removeItem: blocked });
    expect(readConsent()).toBeNull();
    expect(() => writeConsent('granted')).not.toThrow();
    expect(readConsent()).toBe('granted');
  });

  it('persists status and timestamp under the versioned key', () => {
    writeConsent('denied');
    const stored = JSON.parse(window.localStorage.getItem(CONSENT_KEY) as string);
    expect(stored.status).toBe('denied');
    expect(typeof stored.ts).toBe('number');
  });
});

describe('canTrack and prompt', () => {
  it('blocks undecided visitors in an opt-in region', () => {
    setTimeZone('Europe/Berlin');
    expect(canTrack()).toBe(false);
    expect(getConsentPrompt()).toBe('banner');
  });

  it('allows undecided visitors elsewhere but shows the notice', () => {
    setTimeZone('Asia/Jakarta');
    expect(canTrack()).toBe(true);
    expect(getConsentPrompt()).toBe('notice');
  });

  it('honours an explicit choice in either region', () => {
    setTimeZone('Asia/Jakarta');
    writeConsent('denied');
    expect(canTrack()).toBe(false);
    expect(getConsentPrompt()).toBeNull();
    setTimeZone('Europe/Berlin');
    writeConsent('granted');
    expect(canTrack()).toBe(true);
  });

  it('reopens the prompt on request until the next choice', () => {
    setTimeZone('Asia/Jakarta');
    writeConsent('granted');
    openConsentPrompt();
    expect(getConsentPrompt()).toBe('notice');
    writeConsent('granted');
    expect(getConsentPrompt()).toBeNull();
  });
});

describe('gating of the dispatcher and click ids', () => {
  const fbq = vi.fn();
  const ttqTrack = vi.fn();
  const fetchMock = vi.fn(() => Promise.resolve(new Response('{}')));

  beforeEach(() => {
    fbq.mockClear();
    ttqTrack.mockClear();
    fetchMock.mockClear();
    window.fbq = fbq as unknown as Window['fbq'];
    window.ttq = { track: ttqTrack };
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://api.test/v1');
    window.localStorage.setItem('ybb_ttclid', 'ttc123');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const expectNothingSent = () => {
    expect(fbq).not.toHaveBeenCalled();
    expect(ttqTrack).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  };

  it('sends nothing when denied', () => {
    setTimeZone('Asia/Jakarta');
    writeConsent('denied');
    trackLead();
    expectNothingSent();
  });

  it('sends nothing when undecided in an opt-in region', () => {
    setTimeZone('Europe/Berlin');
    trackLead();
    expectNothingSent();
  });

  it('sends pixels and relay when granted', () => {
    setTimeZone('Europe/Berlin');
    writeConsent('granted');
    trackLead();
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(ttqTrack).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns no click ids when denied, and returns them when granted', () => {
    setTimeZone('Asia/Jakarta');
    writeConsent('denied');
    expect(readAdAttribution()).toBeUndefined();
    writeConsent('granted');
    expect(readAdAttribution()).toEqual({ ttclid: 'ttc123' });
  });
});

describe('clearTrackerCookies', () => {
  it('expires tracker cookies and keeps essential ones', () => {
    document.cookie = '_fbp=fb.1.123; path=/';
    document.cookie = '_ga=GA1.1.1; path=/';
    document.cookie = 'accessToken=keep; path=/';
    clearTrackerCookies();
    expect(document.cookie).not.toMatch(/_fbp|_ga=/);
    expect(document.cookie).toContain('accessToken=keep');
  });
});
