import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('Logout', async ({ page, isMobile, queries: { getByRole } }) => {
  // Go to http://localhost:3000/dashboard
  await page.goto('/dashboard')

  if (isMobile) {
    const openSidebar = await getByRole('button', {
      name: /open sidebar/i,
    })
    await openSidebar.click()
  }

  const keluar = await getByRole('button', {
    name: /keluar/i,
  })

  // Click text=Keluar
  await keluar.click()

  // Expect text=Masuk to be visible and linking to the
  const loginLink = page.locator('text=Masuk').first()
  await expect(loginLink).toBeVisible()
  await expect(loginLink).toHaveAttribute('href', '/login')
})
