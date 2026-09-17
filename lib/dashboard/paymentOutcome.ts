// lib/dashboard/paymentOutcome.ts
//
// Classifies payment-start failures on the API's outcome CODE, never on its
// wording (same rule as the cancel-deletion page, eed69b5): rewording a backend
// message must not change what the participant is told to do.
//
// The codes come from ybb-platform's registration-fee-window.ts. A registration
// fee is payable only while the participant's category registration window is
// open; the pricing tier's validity periods are that window. The BFF routes
// (tiers/[tierId]/ensure-invoice, [id]/confirm) forward `errorCode` from the
// API's HttpExceptionFilter so it survives the hop.

import { getErrorMessage, isRecord } from '@/lib/api/response';

export const REGISTRATION_WINDOW_CLOSED = 'REGISTRATION_WINDOW_CLOSED';
export const REGISTRATION_WINDOW_NOT_OPEN = 'REGISTRATION_WINDOW_NOT_OPEN';
export const REGISTRATION_FEE_CATEGORY_MISMATCH = 'REGISTRATION_FEE_CATEGORY_MISMATCH';

const MESSAGES: Record<string, string> = {
  [REGISTRATION_WINDOW_CLOSED]:
    'Registration for your category has closed, so this registration fee can no longer be paid. If the other category is still open, switch your category on the Payments page to continue.',
  [REGISTRATION_WINDOW_NOT_OPEN]:
    'Registration for your category has not opened yet, so this registration fee cannot be paid yet.',
  [REGISTRATION_FEE_CATEGORY_MISMATCH]:
    'This registration fee belongs to a different category than your application. Refresh the Payments page to see the fee for your category.',
};

export function getPaymentErrorCode(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  return typeof payload.errorCode === 'string' ? payload.errorCode : null;
}

/** The participant-facing message for a failed payment-start response. Known
 * codes win; anything else keeps the API's own message (or the fallback). */
export function getPaymentErrorMessage(payload: unknown, fallback: string): string {
  const code = getPaymentErrorCode(payload);
  if (code && MESSAGES[code]) return MESSAGES[code];
  return getErrorMessage(payload, fallback);
}

/** Shown in place of the Pay action on a registration fee row whose category
 * window has closed (payments list `windowClosed`). */
export const REGISTRATION_WINDOW_CLOSED_ROW_MESSAGE =
  'Registration for your category has closed, so this fee can no longer be paid.';

export type PaymentRowAction = 'pay' | 'window-closed' | 'none';

/**
 * What a payments-list row offers. A closed-window registration fee shows the
 * explanation and the category-switch route INSTEAD of Pay, even if a stale
 * cached row still says canPay: the API would refuse it anyway.
 */
export function resolvePaymentRowAction(payment: {
  status: string;
  canPay?: boolean;
  windowClosed?: boolean;
}): PaymentRowAction {
  if (payment.windowClosed && payment.status !== 'paid' && payment.status !== 'processing') {
    return 'window-closed';
  }
  if (typeof payment.canPay === 'boolean') return payment.canPay ? 'pay' : 'none';
  return payment.status === 'unpaid' || payment.status === 'failed' ? 'pay' : 'none';
}
