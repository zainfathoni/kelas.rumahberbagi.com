import { test, expect } from '@playwright/test'

/**
 * Smoke tests for public pages - no authentication required.
 * These can run against any environment: local, Docker, or production.
 *
 * Usage:
 *   npm run test:e2e:production -- smoke.spec.ts
 *   npm run test:e2e:docker -- smoke.spec.ts
 */

test.describe('Public pages smoke tests', () => {
  test('homepage loads and shows content', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Rumah Berbagi/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('body')).toBeVisible()
    await expect(page.getByText('Masuk ke akun Anda')).toBeVisible()
    await expect(
      page.getByRole('button', { name: /kirim link/i })
    ).toBeVisible()
  })

  test('returns 200 for main routes', async ({ request }) => {
    const routes = ['/', '/login']

    for (const route of routes) {
      const response = await request.get(route)
      expect(response.status(), `${route} should return 200`).toBe(200)
    }
  })
})
