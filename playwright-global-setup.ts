import { chromium, expect } from '@playwright/test'
import { readFixture } from './app/utils/fixtures'

async function globalSetup() {
  const browser = await chromium.launch()

  // stable member
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/')
  await page.click('text=Masuk')
  await page.fill(
    'input[name="email"]',
    JSON.parse(await readFixture(`../../e2e/fixtures/users/member.local.json`))
      ?.email
  )
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('text=Kirim link ke alamat email'),
  ])
  await expect(
    page.locator('text=✨ Link telah dikirim ke alamat email Anda ✨').first()
  ).toBeVisible()
  await page.goto(
    JSON.parse(await readFixture(`../../e2e/fixtures/magic.local.json`))
      ?.magicLink
  )
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
  await page.context().storageState({ path: 'e2e/fixtures/auth.local.json' })

  // member without transaction
  const noTransactionPage = await browser.newPage()
  await noTransactionPage.goto('http://localhost:3000/')
  await noTransactionPage.click('text=Masuk')
  await noTransactionPage.fill(
    'input[name="email"]',
    JSON.parse(
      await readFixture(
        `../../e2e/fixtures/users/member-no-transaction.local.json`
      )
    )?.email
  )
  await Promise.all([
    noTransactionPage.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    noTransactionPage.click('text=Kirim link ke alamat email'),
  ])
  await expect(
    noTransactionPage
      .locator('text=✨ Link telah dikirim ke alamat email Anda ✨')
      .first()
  ).toBeVisible()
  await noTransactionPage.goto(
    JSON.parse(await readFixture(`../../e2e/fixtures/magic.local.json`))
      ?.magicLink
  )
  await expect(noTransactionPage).toHaveURL('http://localhost:3000/dashboard')
  await noTransactionPage
    .context()
    .storageState({ path: 'e2e/fixtures/auth-no-transaction.local.json' })

  // editable member
  const editablePage = await browser.newPage()
  await editablePage.goto('http://localhost:3000/')
  await editablePage.click('text=Masuk')
  await editablePage.fill(
    'input[name="email"]',
    JSON.parse(
      await readFixture(`../../e2e/fixtures/users/member-edit.local.json`)
    )?.email
  )
  await Promise.all([
    editablePage.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    editablePage.click('text=Kirim link ke alamat email'),
  ])
  await expect(
    editablePage
      .locator('text=✨ Link telah dikirim ke alamat email Anda ✨')
      .first()
  ).toBeVisible()
  await editablePage.goto(
    JSON.parse(await readFixture(`../../e2e/fixtures/magic.local.json`))
      ?.magicLink
  )
  await expect(editablePage).toHaveURL('http://localhost:3000/dashboard')
  await editablePage
    .context()
    .storageState({ path: 'e2e/fixtures/auth-edit.local.json' })

  await browser.close()
}

export default globalSetup
