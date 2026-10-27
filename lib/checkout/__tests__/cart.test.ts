// lib/checkout/__tests__/cart.test.ts
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CART_STORAGE_KEY,
  CART_TTL_MS,
  addToCart,
  clearCart,
  readCart,
  validateCartLine,
} from '../cart';

const TIER = '3f1c2b9e-7a44-4c1e-9d2a-0b6f5e8a1c77';
const LINE = { programSlug: 'meys-7th', tierId: TIER, category: 'self_funded' as const };

describe('cart', () => {
  // Map-backed stand-in: Node 25 ships its own global localStorage that shadows jsdom's.
  beforeEach(() => {
    const data = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
        removeItem: (k: string) => void data.delete(k),
      },
    });
  });

  it('round-trips a line', () => {
    expect(addToCart(LINE)).toBe(true);
    expect(readCart()).toEqual(LINE);
  });

  it('replaces the existing line on add', () => {
    addToCart(LINE);
    addToCart({ ...LINE, programSlug: 'kys-3rd', category: 'fully_funded' });
    expect(readCart()).toEqual({ ...LINE, programSlug: 'kys-3rd', category: 'fully_funded' });
  });

  it('expires after the 7-day TTL', () => {
    addToCart(LINE, 1_000);
    expect(readCart(1_000 + CART_TTL_MS)).toEqual(LINE);
    expect(readCart(1_000 + CART_TTL_MS + 1)).toBeNull();
  });

  it('rejects a savedAt in the future', () => {
    addToCart(LINE, 5_000);
    expect(readCart(1_000)).toBeNull();
  });

  it('rejects tampered storage', () => {
    const bad = [
      { ...LINE, tierId: '../x' },
      { ...LINE, programSlug: 'a b' },
      { ...LINE, category: 'free' },
      'not-an-object',
    ];
    for (const entry of bad) {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(typeof entry === 'string' ? entry : { ...entry, savedAt: Date.now() }),
      );
      expect(readCart()).toBeNull();
    }
    window.localStorage.setItem(CART_STORAGE_KEY, '{nope');
    expect(readCart()).toBeNull();
  });

  it('refuses to store an invalid line', () => {
    expect(addToCart({ ...LINE, tierId: '' })).toBe(false);
    expect(readCart()).toBeNull();
  });

  it('clears the line', () => {
    addToCart(LINE);
    clearCart();
    expect(readCart()).toBeNull();
  });

  it('survives blocked storage', () => {
    const blocked = () => {
      throw new Error('blocked');
    };
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: { getItem: blocked, setItem: blocked, removeItem: blocked },
    });
    expect(addToCart(LINE)).toBe(false);
    expect(readCart()).toBeNull();
    expect(() => clearCart()).not.toThrow();
  });

  it('validateCartLine strips unknown fields', () => {
    expect(validateCartLine({ ...LINE, extra: 1 })).toEqual(LINE);
  });
});
