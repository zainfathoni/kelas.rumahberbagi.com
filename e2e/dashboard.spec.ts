import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  // TODO: import session value in auth.json from environment variables
  // to match the SESSION_SECRET and MAGIC_LINK_SECRET in .env file
  storageState: 'e2e/auth.json',
})

test('Dashboard', async ({ page, noscript, queries: { getByRole } }) => {
  // Go to http://localhost:3000/dashboard
  await page.goto('/dashboard')

  // Query phoneNumber
  const phoneNumber = await getByRole('textbox', {
    name: /nomor whatsapp/i,
  })

  // Fill phoneNumber
  await phoneNumber.fill('6512345678')

  // Press Tab
  await phoneNumber.press('Tab')

  // Expect visibility only when JavaScript is enabled
  if (!noscript) {
    await expect(
      page
        .locator(
          'text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
        )
        .first()
    ).toBeVisible()
  }

  // Fill phoneNumber
  await phoneNumber.fill('+6512345678')

  // Click text=Save
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/),
    page.click('text=Simpan'),
  ])

  // Expect invisibility
  await expect(
    page
      .locator(
        'text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
      )
      .first()
  ).not.toBeVisible()
})
