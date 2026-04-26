export interface CachedPaymentPreview {
  id: string;
  label: string;
  status: 'paid' | 'unpaid' | 'processing' | 'failed';
  paymentType: string;
  amountLabel: string;
  syncDate: string;
  hasInvoice?: boolean;
}

const PAYMENTS_CACHE_STORAGE_KEY = 'ybb-dashboard-payments-cache';

function readCacheStore(): Record<string, CachedPaymentPreview[]> {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.sessionStorage.getItem(PAYMENTS_CACHE_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};

    return parsed as Record<string, CachedPaymentPreview[]>;
  } catch {
    return {};
  }
}

function writeCacheStore(store: Record<string, CachedPaymentPreview[]>) {
  if (typeof window === 'undefined') return;

  window.sessionStorage.setItem(PAYMENTS_CACHE_STORAGE_KEY, JSON.stringify(store));
}

function getProgramCacheKey(programId?: string | null): string {
  return programId?.trim() ? programId : 'default';
}

export function storeCachedPaymentPreviews(
  programId: string | null | undefined,
  previews: CachedPaymentPreview[]
) {
  const store = readCacheStore();
  store[getProgramCacheKey(programId)] = previews;
  writeCacheStore(store);
}

export function upsertCachedPaymentPreview(
  programId: string | null | undefined,
  preview: CachedPaymentPreview
) {
  const store = readCacheStore();
  const cacheKey = getProgramCacheKey(programId);
  const current = store[cacheKey] ?? [];

  store[cacheKey] = [...current.filter(item => item.id !== preview.id), preview];
  writeCacheStore(store);
}

export function readCachedPaymentPreview(
  programId: string | null | undefined,
  paymentId: string
): CachedPaymentPreview | null {
  const store = readCacheStore();
  const current = store[getProgramCacheKey(programId)] ?? [];
  return current.find(item => item.id === paymentId) ?? null;
}
