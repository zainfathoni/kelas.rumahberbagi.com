import { chromium, expect } from '@playwright/test'
import { readFixture } from './app/utils/fixtures'

async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/')

  // Click text=Masuk
  await page.click('text=Masuk')

  // Query email
  await page.fill('input[name="email"]', 'me@zainf.dev')

  // Click text=Kirim link ke alamat email
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])

  // Click text=✨ Link telah dikirim ke alamat email Anda ✨
  await expect(
    page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()
  ).toBeVisible()

  const data = await readFixture('magic')
  const { magicLink } = JSON.parse(data)

  // Go to the magic link
  await page.goto(magicLink)

  // If the magic link matches the current token stored in the session storage,
  // the user will be redirected to the dashboard automatically.
  await expect(page).toHaveURL('http://localhost:3000/dashboard')

  // Save authentication session cookie
  await page.context().storageState({ path: 'e2e/fixtures/auth.local.json' })

  await browser.close()
}

export default globalSetup
