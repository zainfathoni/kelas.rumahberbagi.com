import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('test', async ({ page, noscript }) => {
  // Go to http://localhost:3000/dashboard
  await page.goto('http://localhost:3000/dashboard')

  // Click [placeholder="+6281234567890"]
  await page.click('[placeholder="+6281234567890"]')

  // Press a with modifiers
  await page.press('[placeholder="+6281234567890"]', 'Meta+a')

  // Fill [placeholder="+6281234567890"]
  await page.fill('[placeholder="+6281234567890"]', '6512345678')

  // Press Tab
  await page.press('[placeholder="+6281234567890"]', 'Tab')

  // Expect visibility only when JavaScript is enabled
  if (!noscript) {
    await expect(
      page.locator('text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon').first()
    ).toBeVisible()
  }

  // Click [placeholder="+6281234567890"]
  await page.click('[placeholder="+6281234567890"]')

  // Press a with modifiers
  await page.press('[placeholder="+6281234567890"]', 'Meta+a')

  // Press ArrowLeft
  await page.press('[placeholder="+6281234567890"]', 'ArrowLeft')

  // Fill [placeholder="+6281234567890"]
  await page.fill('[placeholder="+6281234567890"]', '+6512345678')

  // Click text=Save
  await Promise.all([page.waitForNavigation(/*{ url: 'http://localhost:3000/dashboard' }*/), page.click('text=Save')])

  // Expect invisibility
  await expect(
    page.locator('text=Nomor WhatsApp harus mengandung kode negara dan nomor telepon').first()
  ).not.toBeVisible()
})
