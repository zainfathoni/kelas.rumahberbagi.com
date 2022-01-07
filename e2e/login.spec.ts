import fs from 'fs'
import path from 'path'
import { expect } from '@playwright/test'
import { test } from './base-test'

test('Login', async ({ context, page, queries: { getByRole } }) => {
  // Go to http://localhost:3000/
  await page.goto('/')

  // Click text=Masuk
  await page.click('text=Masuk')
  await expect(page).toHaveURL('http://localhost:3000/login')

  // Query email
  const email = await getByRole('textbox', {
    name: /alamat email/i,
  })

  // Fill email
  await email.fill('me@zainf.dev')

  // Click text=Kirim link ke alamat email
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])

  // Click text=✨ Link telah dikirim ke alamat email Anda ✨
  await expect(
    page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()
  ).toBeVisible()

  const magicFixturePath = path.join(
    __dirname,
    `../e2e/fixtures/magic.local.json`
  )
  const data = await fs.promises.readFile(magicFixturePath, 'utf8')
  const { magicLink } = JSON.parse(data)

  // Go to the magic link
  await page.goto(magicLink)

  // If the magic link matches the current token stored in the session storage,
  // the user will be redirected to the dashboard automatically.
  await expect(page).toHaveURL('http://localhost:3000/dashboard')

  // Save authentication session cookie
  await context.storageState({ path: 'e2e/fixtures/auth.local.json' })
})
