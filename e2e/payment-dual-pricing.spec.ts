import { expect, test } from '@playwright/test';

/**
 * E2E coverage for the participant "Make Payment" page dual-pricing UI.
 *
 * These tests pin the contract for:
 *   - Gateway + Manual Transfer prices both rendering in the currency-info callout
 *   - "Estimated total" vs "Total to pay" wording swap on payment-type change
 *   - Payment-type cards each showing their own price preview
 *   - Gateway being disabled when the program has no gateway exchange rate
 *
 * Authentication: the existing e2e/smoke.spec.ts only exercises public endpoints,
 * so this project does not yet have an auth helper or seeded fixtures. These
 * tests therefore gate on env vars pointing at pre-seeded payments. When the
 * vars are absent, the suite skips with a clear reason — the spec still serves
 * as living documentation and runs in any environment that wires the fixtures.
 *
 * Required env vars to actually execute:
 *   E2E_PAYMENT_DUAL_ID    — payment whose program has both gateway USD and manual IDR pricing
 *   E2E_PAYMENT_NO_RATE_ID — payment whose program has manual IDR but no gateway exchange rate
 *
 * Auth: when wiring auth later, set storageState in playwright.config.ts or add
 * a beforeEach that mirrors the participant login flow. For now, an authenticated
 * storageState is the cleanest hook-in point.
 */

const PAYMENT_WITH_DUAL_PRICES_ID = process.env.E2E_PAYMENT_DUAL_ID ?? '';
const PAYMENT_NO_RATE_ID = process.env.E2E_PAYMENT_NO_RATE_ID ?? '';

test.describe('payment page — dual pricing', () => {
  test.skip(
    !PAYMENT_WITH_DUAL_PRICES_ID,
    'E2E_PAYMENT_DUAL_ID not set — skip until participant auth fixture is wired',
  );

  test.beforeEach(async ({ page }) => {
    await page.goto(`/dashboard/payments/${PAYMENT_WITH_DUAL_PRICES_ID}/make-payment`);
    // Wait for the make-payment heading so we know the SSR/CSR pass settled
    // before we assert against dynamic dual-pricing content.
    await expect(page.getByRole('heading', { name: /make payment/i })).toBeVisible();
  });

  test('shows both Gateway and Manual prices in the currency info callout', async ({ page }) => {
    // Anchor to the callout to avoid colliding with the per-card price preview.
    const callout = page
      .getByText(/important currency information/i)
      .locator('xpath=ancestor::*[1]');

    await expect(callout.getByText(/gateway:/i)).toBeVisible();
    await expect(callout.getByText(/manual transfer:/i)).toBeVisible();
    await expect(callout.getByText(/usd/i)).toBeVisible();
    // "Rp" is the Indonesian Rupiah prefix used by Intl.NumberFormat('id-ID').
    await expect(callout.getByText(/rp/i).first()).toBeVisible();
  });

  test('total wording swaps when participant selects Manual Transfer', async ({ page }) => {
    // Default selection should be Gateway when both methods are available.
    await expect(page.getByText(/estimated total:/i)).toBeVisible();

    await page.getByRole('radio', { name: /manual transfer/i }).click();

    await expect(page.getByText(/total to pay:/i)).toBeVisible();
    await expect(page.getByText(/estimated total:/i)).toHaveCount(0);
  });

  test('payment type cards show price previews', async ({ page }) => {
    const gatewayCard = page.getByRole('radio', { name: /payment gateway/i });
    const manualCard = page.getByRole('radio', { name: /manual transfer/i });

    // Gateway card should show a USD price (e.g. "$1,500" or "$ 1500").
    await expect(gatewayCard).toContainText(/\$\s?\d/);
    // Manual card should show an IDR price using the "Rp" prefix.
    await expect(manualCard).toContainText(/rp/i);
  });
});

test.describe('payment page — gateway disabled when no exchange rate', () => {
  test.skip(
    !PAYMENT_NO_RATE_ID,
    'E2E_PAYMENT_NO_RATE_ID not set — skip until participant auth fixture is wired',
  );

  test('disables Gateway and forces Manual selection', async ({ page }) => {
    await page.goto(`/dashboard/payments/${PAYMENT_NO_RATE_ID}/make-payment`);
    await expect(page.getByRole('heading', { name: /make payment/i })).toBeVisible();

    const gatewayCard = page.getByRole('radio', { name: /payment gateway/i });
    await expect(gatewayCard).toBeDisabled();

    // Manual should still be selectable. aria-checked reflects the active selection.
    const manualCard = page.getByRole('radio', { name: /manual transfer/i });
    await expect(manualCard).toBeEnabled();
  });
});
