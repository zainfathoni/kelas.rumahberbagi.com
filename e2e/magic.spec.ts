import { expect } from '@playwright/test'
import { test } from './base-test'

test.use({
  storageState: 'e2e/magic.json',
})

const magicLink =
  'http://localhost:3000/magic?token=278a57887a3fc760986f0253a4b3f09d%3A8e46a19ec0a21a46d1943bd9f339bce9fa37268df55134360620b7624535da03ffd7ee5bb953d4dea98f19b220b5affd56544b87e53dc60d29a3981765e8af9a307afd02910818cc58f957eec3eb3e183ad5483bff7798e6bb66c7e65cb8a7b0d7a23afbae181ed38884'

test.skip('Magic Link', async ({ page }) => {
  // Go to the magic link
  await page.goto(magicLink)

  // If the magic link matches the current token stored in the session storage,
  // the user will be redirected to the dashboard automatically.
  await expect(page).toHaveURL('http://localhost:3000/dashboard')

  // Expect text=Keluar to be visible
  await expect(page.locator('text=Keluar').first()).toBeVisible()
})
