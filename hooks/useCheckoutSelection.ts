// hooks/useCheckoutSelection.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { addToCart, clearCart, readCart, type CartCategory } from '@/lib/checkout/cart';
import { fetchCheckoutConfig, type CheckoutConfig } from '@/lib/checkout/checkoutConfig';
import { resolveSelection, selectCategory, selectEdition, type Selection } from '@/lib/checkout/selection';

export type CheckoutSelectionState =
  | { phase: 'loading' }
  | { phase: 'empty' }
  | { phase: 'unavailable' }
  | { phase: 'ready'; config: CheckoutConfig; selection: Selection; notice: boolean };

/** Loads the cart line + authoritative config and keeps the stored line in step with the picker. */
export function useCheckoutSelection() {
  const [state, setState] = useState<CheckoutSelectionState>({ phase: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const stored = readCart();
    if (!stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ phase: 'empty' });
      return;
    }
    fetchCheckoutConfig(stored.programSlug, stored.tierId).then((config) => {
      if (cancelled) return;
      const selection = config?.enabled ? resolveSelection(config, stored) : null;
      if (!config || !selection) return setState({ phase: 'unavailable' });
      if (selection.fellBack) addToCart(selection.line);
      setState({ phase: 'ready', config, selection, notice: selection.fellBack });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const chooseEdition = useCallback(
    (programSlug: string) =>
      setState((prev) => {
        if (prev.phase !== 'ready') return prev;
        const next = selectEdition(prev.config, prev.selection, programSlug);
        if (!next) return prev;
        addToCart(next.line);
        return { ...prev, selection: next, notice: false };
      }),
    [],
  );

  const chooseCategory = useCallback(
    (category: CartCategory) =>
      setState((prev) => {
        if (prev.phase !== 'ready') return prev;
        const next = selectCategory(prev.selection, category);
        if (!next) return prev;
        addToCart(next.line);
        return { ...prev, selection: next, notice: false };
      }),
    [],
  );

  const remove = useCallback(() => {
    clearCart();
    setState({ phase: 'empty' });
  }, []);

  return { state, chooseEdition, chooseCategory, remove };
}
