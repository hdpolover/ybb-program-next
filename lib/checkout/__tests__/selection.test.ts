// lib/checkout/__tests__/selection.test.ts
import { describe, expect, it } from 'vitest';
import type { CheckoutConfig } from '../checkoutConfig';
import { parseConfig } from '../checkoutConfig';
import { resolveSelection, selectCategory, selectEdition } from '../selection';

const opt = (category: 'self_funded' | 'fully_funded', tierId: string, amount: number) => ({
  category,
  tierId,
  tierName: `${category} fee`,
  amount,
  currency: 'USD',
});

const config: CheckoutConfig = {
  enabled: true,
  turnstileSiteKey: null,
  selected: null,
  editions: [
    {
      programSlug: 'meys-7th',
      programName: 'MEYS 7th',
      registrationDates: { open: null, close: '2026-12-01T00:00:00Z' },
      options: [opt('self_funded', 'tier-self-7th', 15), opt('fully_funded', 'tier-full-7th', 25)],
    },
    {
      programSlug: 'meys-8th',
      programName: 'MEYS 8th',
      registrationDates: null,
      options: [opt('self_funded', 'tier-self-8th', 20)],
    },
  ],
};

describe('resolveSelection', () => {
  it('uses the stored cart line when it matches', () => {
    const sel = resolveSelection(config, { programSlug: 'meys-7th', tierId: 'tier-full-7th', category: 'fully_funded' });
    expect(sel?.line.tierId).toBe('tier-full-7th');
    expect(sel?.fellBack).toBe(false);
  });

  it('falls back to config.selected with a notice when the cart line is stale', () => {
    const sel = resolveSelection(
      { ...config, selected: { programSlug: 'meys-8th', tierId: 'tier-self-8th', category: 'self_funded' } },
      { programSlug: 'gone', tierId: 'tier-x-0000', category: 'self_funded' },
    );
    expect(sel?.edition.programSlug).toBe('meys-8th');
    expect(sel?.fellBack).toBe(true);
  });

  it('falls back to the first edition and option when nothing matches', () => {
    const sel = resolveSelection(config, { programSlug: 'meys-7th', tierId: 'old-tier-id', category: 'self_funded' });
    expect(sel?.line).toEqual({ programSlug: 'meys-7th', tierId: 'tier-self-7th', category: 'self_funded' });
    expect(sel?.fellBack).toBe(true);
  });

  it('shows no notice when there was no stored line', () => {
    expect(resolveSelection(config, null)?.fellBack).toBe(false);
  });

  it('returns null when no edition has options', () => {
    expect(resolveSelection({ ...config, editions: [] }, null)).toBeNull();
  });
});

describe('selectEdition / selectCategory', () => {
  const start = resolveSelection(config, { programSlug: 'meys-7th', tierId: 'tier-full-7th', category: 'fully_funded' })!;

  it('keeps the category when the new edition offers it', () => {
    const next = selectEdition({ ...config }, resolveSelection(config, null)!, 'meys-8th');
    expect(next?.line.category).toBe('self_funded');
    expect(next?.line.tierId).toBe('tier-self-8th');
  });

  it('takes the first option when the new edition lacks the category', () => {
    expect(selectEdition(config, start, 'meys-8th')?.line.category).toBe('self_funded');
  });

  it('rejects an unknown edition or unavailable category', () => {
    expect(selectEdition(config, start, 'nope')).toBeNull();
    const only8 = resolveSelection(config, { programSlug: 'meys-8th', tierId: 'tier-self-8th', category: 'self_funded' })!;
    expect(selectCategory(only8, 'fully_funded')).toBeNull();
  });
});

describe('parseConfig', () => {
  it('unwraps the envelope, drops edition with no valid options, validates selected', () => {
    const parsed = parseConfig({
      data: {
        enabled: true,
        turnstileSiteKey: 'k',
        editions: [
          { programSlug: 'a-1', programName: 'A', registrationDates: { open: null, close: 'x' }, options: [{ category: 'bogus' }] },
          { programSlug: 'b-1', programName: 'B', options: [opt('self_funded', 'tier-b-000001', 5)] },
        ],
        selected: { programSlug: 'b-1', tierId: 'tier-b-000001', category: 'self_funded' },
      },
    });
    expect(parsed?.editions.map((e) => e.programSlug)).toEqual(['b-1']);
    expect(parsed?.selected?.tierId).toBe('tier-b-000001');
    expect(parseConfig({ data: { nope: 1 } })).toBeNull();
  });
});
