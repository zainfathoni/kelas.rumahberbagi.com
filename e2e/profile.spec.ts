import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/auth.json',
})

test('Dashboard page has Profile nav link in side menu', async ({
  page,
  isMobile,
  queries: { getByRole },
}) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Profile').first()).toBeVisible()

  const profileButton = page.locator('a:has-text("Profile")').first()
  await expect(profileButton).toBeVisible()
  await expect(profileButton).toHaveAttribute('href', '/dashboard/profile')

  // test mobile
  await page.goto('/dashboard')

  if (isMobile) {
    const openSidebar = await getByRole('button', {
      name: /open sidebar/i,
    })
    await openSidebar.click()
  }

  const profLink = await expect(
    page.locator('text=Profile').first()
  ).toBeVisible()
  await expect(profLink).toHaveAttribute('href', '/dashboard/profile/edit')
})

test('Profile page has rendered in dashboard page after click Profile in side menu', async ({
  page,
  isMobile,
  queries: { getByRole },
}) => {
  await page.goto('/dashboard')

  await expect(page.locator('text=Profile').first()).toBeVisible()

  await page.click('text=Profile')

  await expect(page).toHaveURL('http://localhost:3000/dashboard/profile')
  await expect(page.locator('text=Profile').first()).toBeVisible()

  // test mobile
  await page.goto('/dashboard')

  if (isMobile) {
    const openSidebar = await getByRole('button', {
      name: /open sidebar/i,
    })
    await openSidebar.click()
  }

  const profile = await getByRole('button', {
    name: /profile/i,
  })

  // Click text=Profile
  await profile.click()

  // Expect text=Profile page to be visible and has Ubah button
  await expect(page).toHaveURL('http://localhost:3000/dashboard/profile')
  await expect(page.locator('text=Profile').first()).toBeVisible()
})

test('Redirect to /dashboard/profile/edit after click Ubah button', async ({
  page,
  isMobile,
  queries: { getByRole },
}) => {
  await page.goto('/dashboard/profile')

  await expect(page.locator('text=Profile').first()).toBeVisible()
  await expect(page.locator('text=Ubah').first()).toBeVisible()

  await page.click('text=Ubah')

  await expect(page).toHaveURL('http://localhost:3000/dashboard/profile/edit')
  await expect(page.locator('text=Data Diri').first()).toBeVisible()

  // test mobile
  await page.goto('/dashboard')

  if (isMobile) {
    const openSidebar = await getByRole('button', {
      name: /open sidebar/i,
    })
    await openSidebar.click()
  }

  const profile = await getByRole('button', {
    name: /profile/i,
  })

  // Click text=Profile
  await profile.click()

  // Expect text=Profile page to be visible and has Ubah button
  const ubahLink = page.locator('text=Ubah').first()
  await expect(ubahLink).toBeVisible()
  await expect(ubahLink).toHaveAttribute('href', '/dashboard/profile/edit')
})
