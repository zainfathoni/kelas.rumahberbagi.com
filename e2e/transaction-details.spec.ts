import { expect } from '@playwright/test'
import { Transaction, User } from '@prisma/client'
import { printRupiah } from '../app/utils/locales'
import { TRANSACTION_STATUS } from '../app/models/enum'
import { test } from './base-test'

const validTransactionData: Transaction & { user: Partial<User> } = {
  id: 'baaf91d1-cd03-498c-8b5d-fd46c123b686',
  subscriptionId: 'a41ee28d-ca47-4a70-ab45-cf5d0b66734c',
  userId: '2c15a165-68b2-4b07-8a2e-38aa6345f308',
  bankName: 'Bank Mandiri',
  bankAccountName: 'Pejuang Kode',
  bankAccountNumber: '123456789',
  amount: 25000,
  status: TRANSACTION_STATUS.SUBMITTED,
  createdAt: new Date(1641283151245),
  updatedAt: new Date(1641283151245),
  user: {
    name: 'Pejuang Kode',
    phoneNumber: '-',
  },
}

const validTransactionData1 = {
  id: '817cc1bb-f821-4fb4-b643-46c098919ce3',
  user: {
    phoneNumber: '628999210188',
  },
}

test.use({
  storageState: 'e2e/auth.json',
})

test('redirected to TransactionList page when transaction data with id of $transactionId is not exist', async ({
  page,
}) => {
  await page.goto('/dashboard/transactions/1')

  expect(page.url()).toBe('http://localhost:3000/dashboard/transactions')
})

test('render user name if transaction data exists', async ({ page }) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const username = await page.locator('id=user-name').textContent()

  expect(username).toBe(validTransactionData.user.name)
})

test('render user phonenumber if transaction data exists', async ({ page }) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const phoneNumber = await page.locator('id=user-phone-number').textContent()

  expect(phoneNumber).toBe(validTransactionData.user.phoneNumber)
})

test('render bank name if transaction data exists', async ({ page }) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const bankName = await page.locator('id=bank-name').textContent()

  expect(bankName).toBe(validTransactionData.bankName)
})

test('render bank account number if transaction data exists', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const bankAccountNumber = await page
    .locator('id=bank-account-number')
    .textContent()

  expect(bankAccountNumber).toBe(validTransactionData.bankAccountNumber)
})

test('render bank account name if transaction data exists', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const bankAccountName = await page
    .locator('id=bank-account-name')
    .textContent()

  expect(bankAccountName).toBe(validTransactionData.bankAccountName)
})

test('render transaction nominal amount if transaction data exists', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const nominal = await page.locator('id=transaction-amount').textContent()

  expect(nominal).toBe(printRupiah(validTransactionData.amount))
})

test('render transaction datetime if transaction data exists', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const transactionTime = page.locator('id=transaction-datetime').first()

  await expect(transactionTime).not.toBeEmpty()
})

test('Kontak Whatsapp button should be disabled if user phonenumber is empty', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData.id}`)

  const contactWhatsAppButton = page.locator('id=contact-whatsapp').first()

  await expect(contactWhatsAppButton).toBeVisible()
  await expect(contactWhatsAppButton).toBeDisabled()
})

test('Kontak Whatsapp link should be refering to the valid WhatsApp API if user phonenumber is not empty', async ({
  page,
}) => {
  await page.goto(`/dashboard/transactions/${validTransactionData1.id}`)

  const contactWhatsAppButton = page.locator('id=contact-whatsapp').first()

  await expect(contactWhatsAppButton).toBeVisible()
  await expect(contactWhatsAppButton).toHaveAttribute(
    'href',
    `https://wa.me/${validTransactionData1.user.phoneNumber}`
  )
})
