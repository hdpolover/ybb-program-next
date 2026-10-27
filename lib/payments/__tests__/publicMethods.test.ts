// lib/payments/__tests__/publicMethods.test.ts
import { describe, it, expect } from 'vitest';
import { collectPaymentMethods, formatPaymentMethodType } from '@/lib/payments/publicMethods';

const card = { name: 'Card', type: 'credit_card', logo_url: null };
const bca = { name: 'BCA', type: 'manual', logo_url: 'https://cdn.example.com/bca.png' };
const vakif = { name: 'Vakif', type: 'manual', logo_url: null };

const data = {
  programs: [
    { program_id: 'a', program_slug: 'a', methods: [card, bca] },
    { program_id: 'b', program_slug: 'b', methods: [bca, vakif] },
  ],
};

describe('collectPaymentMethods', () => {
  it('limits to the requested programs and dedupes across them', () => {
    expect(collectPaymentMethods(data, ['a', 'b'])).toEqual([card, bca, vakif]);
    expect(collectPaymentMethods(data, ['b'])).toEqual([bca, vakif]);
  });

  it('falls back to every program when no id matches', () => {
    expect(collectPaymentMethods(data, ['current'])).toEqual([card, bca, vakif]);
  });

  it('returns an empty list for missing data', () => {
    expect(collectPaymentMethods(null, ['a'])).toEqual([]);
  });
});

describe('formatPaymentMethodType', () => {
  it('humanizes gateway categories', () => {
    expect(formatPaymentMethodType('credit_card')).toBe('Credit card');
    expect(formatPaymentMethodType('manual')).toBe('Manual transfer');
  });
});
