import { Browser, chromium, expect } from '@playwright/test'
import { readFixture } from './app/utils/fixtures'

async function loginAs(browser: Browser, user: string) {
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/')
  await page.click('text=Masuk')
  await page.fill(
    'input[name="email"]',
    JSON.parse(await readFixture(`../../e2e/fixtures/users/${user}.local.json`))
      ?.email
  )
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])
  await expect(
    page.locator('text=Link telah dikirim ke alamat email Anda').first()
  ).toBeVisible()
  await page.goto(
    JSON.parse(await readFixture(`../../e2e/fixtures/magic.local.json`))
      ?.magicLink
  )
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
  await page
    .context()
    .storageState({ path: `e2e/fixtures/auth/${user}.local.json` })
}

async function globalSetup() {
  const browser = await chromium.launch()

  // stable member
  await loginAs(browser, 'member')

  // member without transaction
  await loginAs(browser, 'member-no-transaction')

  // editable member
  await loginAs(browser, 'member-edit')

  // course author
  await loginAs(browser, 'author')

  await browser.close()
}

export default globalSetup
