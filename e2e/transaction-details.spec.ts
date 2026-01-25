import { Transaction, User } from '@prisma/client'
import { printRupiah } from '../app/utils/format'
import { readFixture } from '../app/utils/fixtures'
import { stripLeadingPlus } from '../app/utils/misc'
import { test, expect } from './base-test'
import { authFixtures, getDataFixturePath, isStagingEnv } from './fixtures'

test.use({
  storageState: authFixtures.author,
})

let memberSubmit: User, submitted: Transaction, rejected: Transaction

// Skip tests that verify specific fixture data on staging (data refreshed from production)
test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
  memberSubmit = JSON.parse(
    await readFixture(getDataFixturePath('users', 'member-submit'))
  )
  submitted = JSON.parse(
    await readFixture(getDataFixturePath('transactions', 'submitted'))
  )
  rejected = JSON.parse(
    await readFixture(getDataFixturePath('transactions', 'rejected'))
  )
})

test('redirected to TransactionList page when transaction data with id of $transactionId is not exist', async ({
  page,
  baseURL,
}) => {
  await page.goto('/dashboard/transactions/1')

  expect(page.url()).toBe(`${baseURL}/dashboard/transactions`)
})

test.skip(isStagingEnv, 'Skipping on staging - requires stable fixture data')
test('render transaction data if transaction data exists', async ({ page }) => {
  await page.goto(`/dashboard/transactions/${submitted.id}`)

  await expect(page.locator('id=user-name')).toHaveText(
    memberSubmit.name as string
  )

  await expect(page.locator('id=user-phone-number')).toHaveText(
    memberSubmit.phoneNumber as string
  )

  await expect(page.locator('id=bank-name')).toHaveText(submitted.bankName)

  await expect(page.locator('id=bank-account-number')).toHaveText(
    submitted.bankAccountNumber
  )

  await expect(page.locator('id=bank-account-name')).toHaveText(
    submitted.bankAccountName as string
  )

  await expect(page.locator('id=transaction-amount')).toHaveText(
    printRupiah(submitted.amount)
  )

  const transactionTime = page.locator('id=transaction-updatedAt').first()
  await expect(transactionTime).not.toBeEmpty()
})

test('Kontak Whatsapp button should be disabled if user phonenumber is empty', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${rejected.id}`)

  const contactWhatsAppButton = page.locator('text=Kontak WhatsApp').first()

  await expect(contactWhatsAppButton).toBeVisible()
  await expect(contactWhatsAppButton).toBeDisabled()
})

test('Kontak Whatsapp link should be refering to the valid WhatsApp API if user phonenumber is not empty', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${submitted.id}`)

  const contactWhatsAppButton = page.locator('text=Kontak WhatsApp').first()

  await expect(contactWhatsAppButton).toBeVisible()
  await expect(contactWhatsAppButton).toHaveAttribute(
    'href',
    `https://wa.me/${stripLeadingPlus(memberSubmit?.phoneNumber)}`
  )
})
