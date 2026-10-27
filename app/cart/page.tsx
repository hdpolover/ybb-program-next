// app/cart/page.tsx
//
// Single-line cart for the registration fee. The line is ids only; edition,
// funding type and price always come from the API's current config.
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CheckoutPicker from '@/components/checkout/CheckoutPicker';
import { useCheckoutSelection } from '@/hooks/useCheckoutSelection';
import { clearCart } from '@/lib/checkout/cart';
import { formatAmount } from '@/lib/checkout/checkoutConfig';
import { savePayIntent } from '@/lib/checkout/payIntent';

const PRIMARY_BUTTON =
  'inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90';

export default function CartPage() {
  const router = useRouter();
  const { state, chooseEdition, chooseCategory, remove } = useCheckoutSelection();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => !cancelled && setIsLoggedIn(res.ok))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const proceed = () => {
    if (state.phase !== 'ready') return;
    if (!isLoggedIn) return router.push('/checkout');
    // Already has an account: the existing pay-intent flow mints the invoice.
    const { line } = state.selection;
    clearCart();
    savePayIntent({ tierId: line.tierId, programSlug: line.programSlug });
    router.push('/dashboard/pay');
  };

  return (
    <main className="min-h-[60vh] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Your cart</h1>

        {state.phase === 'loading' ? <p className="text-sm text-slate-600">Loading your cart...</p> : null}

        {state.phase === 'empty' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-slate-600">Your cart is empty.</p>
            <Link href="/apply" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
              Browse registration fees
            </Link>
          </div>
        ) : null}

        {state.phase === 'unavailable' ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-slate-600">
              Checkout is not available right now. You can still register and pay from your dashboard.
            </p>
            <div className="mt-3 flex justify-center gap-4 text-sm font-semibold">
              <button type="button" onClick={remove} className="text-slate-600 hover:underline">
                Clear cart
              </button>
              <Link href="/login?mode=signup" className="text-primary hover:underline">
                Register
              </Link>
            </div>
          </div>
        ) : null}

        {state.phase === 'ready' ? (
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <CheckoutPicker
              config={state.config}
              selection={state.selection}
              notice={state.notice}
              onEdition={chooseEdition}
              onCategory={chooseCategory}
            />
            <div className="flex items-start justify-between gap-4 border-t border-slate-200 pt-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {state.selection.edition.programName}
                </p>
                <p className="text-sm font-semibold text-slate-900">Registration fee: {state.selection.option.tierName}</p>
              </div>
              <p className="text-base font-bold text-primary">{formatAmount(state.selection.option)}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-900">{formatAmount(state.selection.option)}</span>
            </div>
            <button type="button" className={PRIMARY_BUTTON} onClick={proceed}>
              {isLoggedIn ? 'Continue to payment' : 'Checkout'}
            </button>
            <button type="button" onClick={remove} className="w-full text-center text-xs font-semibold text-slate-600 hover:underline">
              Remove from cart
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
