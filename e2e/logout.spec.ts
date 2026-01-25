import { test, expect } from './base-test'
import { authFixtures } from './fixtures'

test.use({
  storageState: authFixtures.member,
})

test('Logout', async ({ page, isMobile, screen }) => {
  await page.goto('/dashboard')

  // Open sidebar on mobile
  if (isMobile) {
    const openSidebar = screen.getByRole('button', {
      name: /open sidebar/i,
    })
    await openSidebar.click()
  }

  // Click the logout button
  await screen.getByRole('button', { name: /keluar/i }).click()

  // Wait for redirect to homepage
  await page.waitForURL('/')

  // Verify login link is visible
  const loginLink = page.getByRole('link', { name: /masuk/i })
  await expect(loginLink).toBeVisible()
  await expect(loginLink).toHaveAttribute('href', '/login')
})
