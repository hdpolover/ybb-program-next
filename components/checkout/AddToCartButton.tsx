// components/checkout/AddToCartButton.tsx
'use client';

import { useEffect, useState } from 'react';
import { addToCart, type CartCategory } from '@/lib/checkout/cart';
import { fetchCheckoutConfig } from '@/lib/checkout/checkoutConfig';

type Props = {
  programSlug: string | null | undefined;
  tierId: string | null | undefined;
  category: CartCategory;
  className?: string;
  label?: string;
};

const DEFAULT_CLASS =
  'inline-flex items-center justify-center rounded-md border border-primary bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/5';

/** Renders nothing unless the API says checkout is enabled for this tier (hidden on any error). */
export default function AddToCartButton({ programSlug, tierId, category, className, label }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!programSlug || !tierId) return;
    let cancelled = false;
    fetchCheckoutConfig(programSlug, tierId).then((config) => {
      if (!cancelled) setEnabled(Boolean(config?.enabled));
    });
    return () => {
      cancelled = true;
    };
  }, [programSlug, tierId]);

  if (!enabled || !programSlug || !tierId) return null;

  return (
    <button
      type="button"
      className={className ?? DEFAULT_CLASS}
      onClick={() => {
        // Plain navigation, not useRouter: this renders inside tests/pages without an app-router context.
        // Storage blocked: the cart page would be empty, so stay put.
        if (addToCart({ programSlug, tierId, category })) window.location.assign('/cart');
      }}
    >
      {label ?? 'Add to cart'}
    </button>
  );
}
