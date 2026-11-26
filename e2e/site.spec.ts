import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page renders the main sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ali Reza Ghiasi');
  for (const name of ['Experience', 'Skills', 'Education']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
});

test('content is in the HTML before JavaScript runs (prerendered)', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).toContain('Ali Reza Ghiasi');
  expect(html).toContain('Experience');
});

test('no console errors or CSP violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(errors).toEqual([]);
});

test('no private details are published', async ({ request }) => {
  const html = await (await request.get('/')).text();
  // Phone numbers, street addresses and work-status lines must never ship.
  expect(html).not.toMatch(/\+?1?[\s.-]?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/);
  expect(html).not.toMatch(/work permit|permanent resident|sponsorship/i);
});

test('has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
