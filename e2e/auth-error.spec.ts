import { test, expect } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/nobody.json',
})

test.skip('Auth Error', async ({ page }) => {
  // Go to http://localhost:3000/dashboard
  await page.goto('/dashboard')

  await expect(page.locator('text=Invalid MIME type').first()).toBeVisible()

  // Expect text=Masuk to be visible and linking to the
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000' }*/),
    page.click('text=Kembali ke beranda'),
  ])

  await expect(page.locator('text=Kelas Rumah Berbagi').first()).toBeVisible()
})
