import { test, expect } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/member-no-transaction.local.json',
})

test('Call to action has rendered in dashboard page', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page.getByText('Biaya kelas')).toBeVisible()
  await expect(
    page.getByText('Sistem pendaftaran peserta melalui website ini')
  ).toBeVisible()

  const purchaseButton = page.getByRole('link', { name: /daftarkan diri/i })
  await expect(purchaseButton).toBeVisible()
  await expect(purchaseButton).toHaveAttribute('href', '/dashboard/purchase')
})

test('Redirect to /dashboard/purchase after click CTA button', async ({
  page,
}) => {
  await page.goto('/dashboard')

  await expect(page.getByText('Biaya kelas')).toBeVisible()
  await expect(
    page.getByText('Sistem pendaftaran peserta melalui website ini')
  ).toBeVisible()

  await page.getByRole('link', { name: /daftarkan diri/i }).click()
  await page.waitForURL('**/dashboard/purchase')
})
