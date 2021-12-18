import { test, expect } from '@playwright/test'

test('Login', async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/')

  // Click text=Masuk
  await page.click('text=Masuk')
  await expect(page).toHaveURL('http://localhost:3000/login')

  // Click input[name="email"]
  await page.click('input[name="email"]')

  // Fill input[name="email"]
  await page.fill('input[name="email"]', 'me@zainf.dev')

  // Click text=Kirim link ke alamat email
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])

  // Click text=✨ Link telah dikirim ke alamat email Anda ✨
  await expect(page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()).toBeVisible()
})
