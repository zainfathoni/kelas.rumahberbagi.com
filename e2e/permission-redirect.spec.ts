import { test, expect } from './base-test'
import { authFixtures } from './fixtures'

test.describe('Permission redirect for insufficient permissions', () => {
  test.describe('Regular member accessing author-only routes', () => {
    test.use({
      storageState: authFixtures.member,
    })

    test('redirects to dashboard home when accessing /dashboard/transactions', async ({
      page,
    }) => {
      await page.goto('/dashboard/transactions')

      await page.waitForURL('**/dashboard')
      expect(page.url()).not.toContain('/dashboard/transactions')
      expect(page.url()).toContain('/dashboard')
    })

    test('redirects to dashboard home when accessing /dashboard/transactions?status=submitted', async ({
      page,
    }) => {
      await page.goto('/dashboard/transactions?status=submitted')

      await page.waitForURL('**/dashboard')
      expect(page.url()).not.toContain('/dashboard/transactions')
    })
  })

  test.describe('Author accessing author-only routes', () => {
    test.use({
      storageState: authFixtures.author,
    })

    test('allows access to /dashboard/transactions', async ({ page }) => {
      await page.goto('/dashboard/transactions')

      await expect(
        page.getByRole('heading', { name: 'Transaksi' })
      ).toBeVisible()
      expect(page.url()).toContain('/dashboard/transactions')
    })
  })

  test.describe('Admin accessing all routes', () => {
    test.use({
      storageState: authFixtures.admin,
    })

    test('allows access to /dashboard/transactions', async ({ page }) => {
      await page.goto('/dashboard/transactions')

      await expect(
        page.getByRole('heading', { name: 'Transaksi' })
      ).toBeVisible()
      expect(page.url()).toContain('/dashboard/transactions')
    })
  })
})
