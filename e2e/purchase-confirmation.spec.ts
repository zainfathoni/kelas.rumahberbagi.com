import { User } from '@prisma/client'
import { readFixture } from '../app/utils/fixtures'
import { stripLeadingPlus } from '../app/utils/misc'
import { test, expect } from './base-test'
import { authFixtures, getDataFixturePath, isStagingEnv } from './fixtures'

test.use({
  storageState: authFixtures.memberNoTransaction,
})

// Skip tests that verify specific fixture data on staging (data refreshed from production)
test.skip(isStagingEnv, 'Skipping on staging - requires stable fixture data')

let author: User

test.beforeAll(async () => {
  author = JSON.parse(await readFixture(getDataFixturePath('users', 'author')))
})

test('submits transaction confirmation and links to WhatsApp with verification URL', async ({
  page,
  baseURL,
  noscript,
}) => {
  await page.goto('/dashboard/purchase/confirm')

  await page.getByRole('textbox', { name: /nama bank/i }).fill('Bank Jago')
  await page
    .getByRole('textbox', { name: /nomor rekening/i })
    .fill('1234567890')
  await page
    .getByRole('textbox', { name: /nama pemilik rekening/i })
    .fill('Member Test')
  await page.getByRole('textbox', { name: /nominal/i }).fill('200000')

  await page.getByRole('button', { name: /konfirmasi pembayaran/i }).click()
  await page.waitForURL('**/dashboard/purchase/verify/*')

  await expect(page.getByText('Data transaksi tersimpan')).toBeVisible()

  const transactionId = new URL(page.url()).pathname.split('/').pop()
  expect(transactionId).toBeTruthy()

  const whatsAppLink = page.getByRole('link', {
    name: /kirim pesan whatsapp/i,
  })
  await expect(whatsAppLink).toBeVisible()

  const expectedOrigin = noscript
    ? 'https://kelas.rumahberbagi.com'
    : baseURL ?? 'http://localhost:3000'
  const expectedSearchParams = new URLSearchParams()
  expectedSearchParams.append(
    'phone',
    stripLeadingPlus(author.phoneNumber) ?? ''
  )
  expectedSearchParams.append(
    'text',
    `[Kelas Tahun Prasekolahku]\n\nKlik di sini untuk verifikasi pembayaran\n${expectedOrigin}/dashboard/transactions/${transactionId}\n\nBerikut terlampir foto/file bukti pembayaran saya:`
  )

  await expect(whatsAppLink).toHaveAttribute(
    'href',
    `https://api.whatsapp.com/send?${expectedSearchParams.toString()}`
  )
})
