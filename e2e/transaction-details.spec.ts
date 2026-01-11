import { Transaction, User } from '@prisma/client'
import { printRupiah } from '../app/utils/format'
import { readFixture } from '../app/utils/fixtures'
import { stripLeadingPlus } from '../app/utils/misc'
import { test, expect } from './base-test'

test.use({
  storageState: 'e2e/fixtures/auth/author.local.json',
})

let memberSubmit: User, submitted: Transaction, rejected: Transaction

test.beforeAll(async () => {
  memberSubmit = JSON.parse(
    await readFixture(`../../e2e/fixtures/users/member-submit.local.json`)
  )
  submitted = JSON.parse(
    await readFixture(`../../e2e/fixtures/transactions/submitted.local.json`)
  )
  rejected = JSON.parse(
    await readFixture(`../../e2e/fixtures/transactions/rejected.local.json`)
  )
})

test('redirected to TransactionList page when transaction data with id of $transactionId is not exist', async ({
  page,
}) => {
  await page.goto('/dashboard/transactions/1')

  expect(page.url()).toBe('http://localhost:3000/dashboard/transactions')
})

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
