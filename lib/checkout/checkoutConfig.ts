// lib/checkout/checkoutConfig.ts
//
// Browser-side read of the checkout config (via the /api/checkout/config BFF).
// The config is authoritative for prices, editions and which options exist; the
// cart's stored line is ids only.
import { getEnvelopeData, isRecord } from '@/lib/api/response';
import { isCartCategory, validateCartLine, type CartCategory, type CartLine } from './cart';

export type CheckoutOption = {
  category: CartCategory;
  tierId: string;
  tierName: string;
  amount: number;
  currency: string;
  amountIdr?: number;
};

export type CheckoutEdition = {
  programSlug: string;
  programName: string;
  registrationDates: { open: string | null; close: string | null } | null;
  options: CheckoutOption[];
};

export type CheckoutConfig = {
  enabled: boolean;
  turnstileSiteKey: string | null;
  editions: CheckoutEdition[];
  selected: CartLine | null;
};

const cache = new Map<string, Promise<CheckoutConfig | null>>();

const asDate = (v: unknown): string | null => (typeof v === 'string' ? v : null);

function parseOption(raw: unknown): CheckoutOption | null {
  if (!isRecord(raw) || !isCartCategory(raw.category)) return null;
  if (typeof raw.tierId !== 'string' || typeof raw.tierName !== 'string') return null;
  if (typeof raw.amount !== 'number' || typeof raw.currency !== 'string') return null;
  return {
    category: raw.category,
    tierId: raw.tierId,
    tierName: raw.tierName,
    amount: raw.amount,
    currency: raw.currency,
    ...(typeof raw.amountIdr === 'number' ? { amountIdr: raw.amountIdr } : {}),
  };
}

function parseEdition(raw: unknown): CheckoutEdition | null {
  if (!isRecord(raw) || typeof raw.programSlug !== 'string' || typeof raw.programName !== 'string') return null;
  const options = Array.isArray(raw.options)
    ? raw.options.map(parseOption).filter((o): o is CheckoutOption => o !== null)
    : [];
  if (options.length === 0) return null;
  const dates = isRecord(raw.registrationDates) ? raw.registrationDates : null;
  return {
    programSlug: raw.programSlug,
    programName: raw.programName,
    registrationDates: dates ? { open: asDate(dates.open), close: asDate(dates.close) } : null,
    options,
  };
}

export function parseConfig(payload: unknown): CheckoutConfig | null {
  const data = getEnvelopeData(payload);
  if (!isRecord(data) || typeof data.enabled !== 'boolean') return null;
  return {
    enabled: data.enabled,
    turnstileSiteKey: typeof data.turnstileSiteKey === 'string' ? data.turnstileSiteKey : null,
    editions: Array.isArray(data.editions)
      ? data.editions.map(parseEdition).filter((e): e is CheckoutEdition => e !== null)
      : [],
    selected: validateCartLine(data.selected),
  };
}

/** Resolves null on any failure so callers hide the feature rather than error. */
export function fetchCheckoutConfig(programSlug: string, tierId: string): Promise<CheckoutConfig | null> {
  const key = `${programSlug}|${tierId}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const params = new URLSearchParams({ programSlug, tierId });
  const request = fetch(`/api/checkout/config?${params.toString()}`, { cache: 'no-store' })
    .then(async (res) => (res.ok ? parseConfig(await res.json().catch(() => null)) : null))
    .catch(() => null)
    .then((config) => {
      if (!config) cache.delete(key); // do not pin a transient failure
      return config;
    });
  cache.set(key, request);
  return request;
}

export function formatAmount(option: Pick<CheckoutOption, 'amount' | 'currency'>): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: option.currency }).format(option.amount);
  } catch {
    return `${option.currency} ${option.amount}`;
  }
}
