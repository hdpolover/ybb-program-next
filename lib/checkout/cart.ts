// lib/checkout/cart.ts
//
// Guest-checkout cart: a single registration-fee line parked in localStorage.
// The stored line carries ids only; /cart re-fetches the authoritative price
// from the API, so nothing here is ever trusted for money. Mirrors payIntent.ts.

export const CART_STORAGE_KEY = 'ybb_cart';
export const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type CartCategory = 'self_funded' | 'fully_funded';

export type CartLine = {
  programSlug: string;
  tierId: string;
  category: CartCategory;
};

type StoredCartLine = CartLine & { savedAt: number };

const TIER_ID_PATTERN = /^[A-Za-z0-9_-]{8,64}$/;
const PROGRAM_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,99}$/i;

export function isCartCategory(value: unknown): value is CartCategory {
  return value === 'self_funded' || value === 'fully_funded';
}

/** Returns a clean line, or null when any field is absent or malformed. */
export function validateCartLine(value: unknown): CartLine | null {
  if (!value || typeof value !== 'object') return null;
  const { programSlug, tierId, category } = value as Record<string, unknown>;
  if (typeof programSlug !== 'string' || !PROGRAM_SLUG_PATTERN.test(programSlug)) return null;
  if (typeof tierId !== 'string' || !TIER_ID_PATTERN.test(tierId)) return null;
  if (!isCartCategory(category)) return null;
  return { programSlug, tierId, category };
}

/** Adding replaces: the cart holds at most one registration fee. */
export function addToCart(line: CartLine, now: number = Date.now()): boolean {
  if (typeof window === 'undefined') return false;
  const clean = validateCartLine(line);
  if (!clean) return false;
  try {
    const stored: StoredCartLine = { ...clean, savedAt: now };
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}

/** Re-validates on read: storage is user-editable, never trust it. */
export function readCart(now: number = Date.now()): CartLine | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredCartLine> | null;
    if (!parsed || typeof parsed.savedAt !== 'number') return null;
    if (now - parsed.savedAt > CART_TTL_MS || parsed.savedAt > now) return null;
    return validateCartLine(parsed);
  } catch {
    return null;
  }
}

export function clearCart(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Nothing stored that we could clear.
  }
}
