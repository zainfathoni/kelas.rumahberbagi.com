import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('Logout', async ({ page }) => {
  // Go to http://localhost:3000/dashboard
  await page.goto('http://localhost:3000/dashboard')

  // Click text=Keluar
  await Promise.all([page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/), page.click('text=Keluar')])

  // Expect text=Masuk to be visible and linking to the
  const loginLink = page.locator('text=Masuk').first()
  await expect(loginLink).toBeVisible()
  await expect(loginLink).toHaveAttribute('href', '/login')
})
