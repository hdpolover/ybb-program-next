import { expect, test } from '@playwright/test';

test.describe('smoke', () => {
  test('health endpoint is healthy', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as { status?: string };
    expect(payload.status).toBe('ok');
  });

  test('app-version endpoint returns current version', async ({ request }) => {
    const response = await request.get('/api/app-version');
    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as { version?: string };
    expect(payload.version).toBeTruthy();
  });

  test('home page renders without server error', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(500);

    await expect(page.locator('body')).toBeVisible();
  });
});

