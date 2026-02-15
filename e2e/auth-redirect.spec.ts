import { test, expect } from './base-test'
import { authFixtures } from './fixtures'

test.describe('Auto-redirect after authentication', () => {
  test.describe('Unauthenticated user', () => {
    test.use({
      storageState: authFixtures.public,
    })

    test('redirects to login with redirectTo param when accessing protected route', async ({
      page,
    }) => {
      await page.goto('/dashboard/profile/edit')

      await page.waitForURL('**/login**')
      const url = new URL(page.url())
      expect(url.pathname).toBe('/login')
      expect(url.searchParams.get('redirectTo')).toBe('/dashboard/profile/edit')
    })

    test('login page preserves redirectTo in form action URL', async ({
      page,
    }) => {
      await page.goto('/login?redirectTo=/dashboard/transactions')

      await expect(page.getByText('Masuk ke akun Anda')).toBeVisible()

      const currentUrl = new URL(page.url())
      expect(currentUrl.searchParams.get('redirectTo')).toBe(
        '/dashboard/transactions'
      )
    })
  })

  test.describe('Authenticated user', () => {
    test.use({
      storageState: authFixtures.member,
    })

    test('login page redirects to redirectTo param if already authenticated', async ({
      page,
    }) => {
      await page.goto('/login?redirectTo=/dashboard/profile/edit')

      await page.waitForURL('**/dashboard/profile/edit')
      expect(page.url()).toContain('/dashboard/profile/edit')
    })

    test('login page redirects to dashboard by default if already authenticated', async ({
      page,
    }) => {
      await page.goto('/login')

      await page.waitForURL('**/dashboard')
      expect(page.url()).toContain('/dashboard')
    })
  })
})
