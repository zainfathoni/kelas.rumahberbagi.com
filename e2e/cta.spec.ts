import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('Call to action has rendered in dashboard page', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Biaya kelas').first()).toBeVisible()
  await expect(
    page.locator('text=Terbatas untuk 30 orang peserta').first()
  ).toBeVisible()

  const purchaseButton = page.locator('a:has-text("Daftarkan diri")').first()
  await expect(purchaseButton).toBeVisible()
  await expect(purchaseButton).toHaveAttribute('href', '/dashboard/purchase')
})

test('Redirect to /dashboard/purchase after click CTA button', async ({
  page,
}) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Biaya kelas').first()).toBeVisible()
  await expect(
    page.locator('text=Terbatas untuk 30 orang peserta').first()
  ).toBeVisible()

  await page.click('text=Daftarkan diri')

  await expect(page).toHaveURL('http://localhost:3000/dashboard/purchase')
  await expect(page.locator('text=Purchase').first()).toBeVisible()
})
