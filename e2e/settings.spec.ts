import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  // TODO: import session value in auth.json from environment variables
  // to match the SESSION_SECRET and MAGIC_LINK_SECRET in .env file
  storageState: 'e2e/auth.json',
})

test('Validate phone number when updating data', async ({
  page,
  noscript,
  queries: { getByRole },
}) => {
  // Go to http://localhost:3000/dashboard/settings
  await page.goto('/dashboard/settings')
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

test('Validate name when updating data', async ({
  page,
  noscript,
  queries: { getByRole },
}) => {
  await page.goto('/dashboard/settings')

  const name = await getByRole('textbox', {
    name: /nama lengkap/i,
  })

  await name.fill('')
  await name.press('Tab')

  if (!noscript) {
    await expect(
      page.locator('text=Nama Lengkap wajib diisi').first()
    ).toBeVisible()
  }

  await name.fill('Lorem I')
  await page.click('text=Simpan')

  await expect(
    page.locator('text=Nama Lengkap wajib diisi').first()
  ).not.toBeVisible()
})

test('Update profile', async ({ page }) => {
  await page.goto('/dashboard/settings')

  await page.fill('[name="name"]', 'Lorem Ipsum')
  await page.fill('[name="phoneNumber"]', '+6289123456')
  await page.fill('[name="telegram"]', '@lorem_tl')
  await page.fill('[name="instagram"]', '@lorem_ig')

  await page.click('text=Simpan')

  // Reload page to make sure getting the latest user data
  await page.reload()

  await expect(page.locator('[value="Lorem Ipsum"]').first()).toBeVisible()
  await expect(page.locator('[value="+6289123456"]').first()).toBeVisible()
  await expect(page.locator('[value="@lorem_tl"]').first()).toBeVisible()
  await expect(page.locator('[value="@lorem_ig"]').first()).toBeVisible()
})
