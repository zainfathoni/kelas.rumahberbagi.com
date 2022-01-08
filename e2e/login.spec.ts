import { expect } from '@playwright/test'
import { readFixture } from '../app/utils/fixtures'
import { test } from './base-test'

test('Login', async ({ page, queries: { getByRole } }) => {
  // Go to http://localhost:3000/
  await page.goto('/')

  // Click text=Masuk
  await page.click('text=Masuk')
  await expect(page).toHaveURL('http://localhost:3000/login')

  const { email } = JSON.parse(
    await readFixture(`../../e2e/fixtures/users/member.local.json`)
  )

  // Query email
  const emailField = await getByRole('textbox', {
    name: /alamat email/i,
  })

  // Fill email
  await emailField.fill(email)

  // Click text=Kirim link ke alamat email
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])

  // Click text=✨ Link telah dikirim ke alamat email Anda ✨
  await expect(
    page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()
  ).toBeVisible()

  const { magicLink } = JSON.parse(
    await readFixture(`../../e2e/fixtures/magic.local.json`)
  )

  // Go to the magic link
  await page.goto(magicLink)

  // If the magic link matches the current token stored in the session storage,
  // the user will be redirected to the dashboard automatically.
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
})
