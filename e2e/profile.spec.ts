import { test, expect } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/member-edit.local.json',
})

const user = {
  name: 'Zain Fathoni',
  phoneNumber: '+6512345678',
  telegram: '@zainfathoni',
  instagram: '@zain.fathoni',
}

test('Validate phone number when updating data', async ({
  page,
  noscript,
  screen,
}) => {
  await page.goto('/dashboard/profile/edit')

  // Query phoneNumber - using Locator-based screen queries
  const phoneNumber = screen.getByRole('textbox', {
    name: /nomor whatsapp/i,
  })

  // Fill phoneNumber with invalid value
  await phoneNumber.fill('6512345678')
  await phoneNumber.press('Tab')

  // Expect visibility only when JavaScript is enabled
  if (!noscript) {
    const errorMessage = page.getByText(
      'Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
    )
    await expect(errorMessage).toBeVisible()
  }

  // Fill phoneNumber with valid value
  await phoneNumber.fill('+6512345678')

  // Submit form - use click and wait for navigation separately
  await page.getByRole('button', { name: /simpan/i }).click()
  await page.waitForURL('**/dashboard/profile')

  // Expect error message to be hidden
  await expect(
    page.getByText(
      'Nomor WhatsApp harus mengandung kode negara dan nomor telepon'
    )
  ).toBeHidden()
})

test('Validate name when updating data', async ({ page, noscript, screen }) => {
  await page.goto('/dashboard/profile/edit')

  const name = screen.getByRole('textbox', {
    name: /nama lengkap/i,
  })

  // Clear name and trigger validation
  await name.fill('')
  await name.press('Tab')

  if (!noscript) {
    const errorMessage = page.getByText('Nama Lengkap wajib diisi')
    await expect(errorMessage).toBeVisible()
  }

  // Fill valid name and submit
  await name.fill(user.name)
  await page.getByRole('button', { name: /simpan/i }).click()

  // Expect error message to be hidden after navigation
  await expect(page.getByText('Nama Lengkap wajib diisi')).toBeHidden()
})

test('Update profile', async ({ page, screen }) => {
  await page.goto('/dashboard/profile/edit')

  // Get element by role - using Locator-based screen queries
  const name = screen.getByRole('textbox', {
    name: /nama lengkap/i,
  })
  const phoneNumber = screen.getByRole('textbox', {
    name: /nomor whatsapp/i,
  })
  const telegram = screen.getByRole('textbox', {
    name: /username telegram/i,
  })
  const instagram = screen.getByRole('textbox', {
    name: /username instagram/i,
  })

  // Fill all input
  await name.fill(user.name)
  await phoneNumber.fill(user.phoneNumber)
  await telegram.fill(user.telegram)
  await instagram.fill(user.instagram)

  // Submit form and wait for the redirect to the /profile page
  await page.getByRole('button', { name: /simpan/i }).click()
  await page.waitForURL('**/dashboard/profile')

  // Expect to see the new data on the View profile page
  await expect(page.getByLabel('Nama Lengkap')).toHaveText(user.name)
  await expect(page.getByLabel('Nomor WhatsApp')).toHaveText(user.phoneNumber)
  await expect(page.getByLabel('Telegram')).toHaveText(user.telegram)
  await expect(page.getByLabel('Instagram')).toHaveText(user.instagram)

  // Go back to the /profile/edit page
  await page.getByRole('link', { name: /ubah/i }).click()
  await page.waitForURL('**/dashboard/profile/edit')

  // Expect to see the new data prefilled
  await expect(page.locator('[name="name"]')).toHaveValue(user.name)
  await expect(page.locator('[name="phoneNumber"]')).toHaveValue(
    user.phoneNumber
  )
  await expect(page.locator('[name="telegram"]')).toHaveValue(user.telegram)
  await expect(page.locator('[name="instagram"]')).toHaveValue(user.instagram)
})

test('Redirect back to the confirm page when the user is coming from it', async ({
  page,
  screen,
}) => {
  await page.goto(
    '/dashboard/profile/edit?redirectTo=%2Fdashboard%2Fpurchase%2Fconfirm'
  )

  // Get element by role - using Locator-based screen queries
  const name = screen.getByRole('textbox', {
    name: /nama lengkap/i,
  })
  const phoneNumber = screen.getByRole('textbox', {
    name: /nomor whatsapp/i,
  })

  // Fill all input
  await name.fill(user.name)
  await phoneNumber.fill(user.phoneNumber)

  // Submit form and wait for redirect
  await page.getByRole('button', { name: /simpan/i }).click()
  await page.waitForURL('**/dashboard/purchase/confirm')

  // Verify we're on the confirm page
  await expect(page).toHaveURL(/dashboard\/purchase\/confirm/)
})
