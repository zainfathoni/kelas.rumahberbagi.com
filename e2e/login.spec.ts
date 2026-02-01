import { readFixture } from '../app/utils/fixtures'
import { test, expect } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/public.json',
})

test.skip('Login', async ({ page, screen }) => {
  // Go to homepage
  await page.goto('/')

  // Click login link and wait for navigation
  await page.getByRole('link', { name: /masuk/i }).click()
  await page.waitForURL('**/login')

  const { email } = JSON.parse(
    await readFixture(`../../e2e/fixtures/users/member.local.json`)
  )

  // Query email - using Locator-based screen queries
  const emailField = screen.getByRole('textbox', {
    name: /alamat email/i,
  })

  // Fill email
  await emailField.fill(email)

  // Submit login form
  await page.getByRole('button', { name: /kirim link/i }).click()

  // Wait for success message
  await expect(
    page.getByText('Link telah dikirim ke alamat email Anda')
  ).toBeVisible()

  const { magicLink } = JSON.parse(
    await readFixture(`../../e2e/fixtures/magic.local.json`)
  )

  // Go to the magic link and verify dashboard redirect
  await page.goto(magicLink)
  await page.waitForURL('**/dashboard')
})
