import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('Profile page has rendered in dashboard page', async ({ page }) => {
  await page.goto('/dashboard/profile')

  await expect(page.locator('text=Profile').first()).toBeVisible()
  await expect(page.locator('text=Ubah').first()).toBeVisible()

  const ubahButton = page.locator('a:has-text("Ubah")').first()
  await expect(ubahButton).toBeVisible()
  await expect(ubahButton).toHaveAttribute('href', '/dashboard/profile/edit')
})

test('Redirect to /dashboard/profile/edit after click Ubah button', async ({
  page,
}) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Profile').first()).toBeVisible()
  await expect(page.locator('text=Ubah').first()).toBeVisible()

  await page.click('text=Ubah')

  await expect(page).toHaveURL('http://localhost:3000/dashboard/profile/edit')
  await expect(page.locator('text=Data Diri').first()).toBeVisible()
})
