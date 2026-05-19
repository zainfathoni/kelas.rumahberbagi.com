import { User } from '@prisma/client'
import { readFixture } from '../app/utils/fixtures'
import { stripLeadingPlus } from '../app/utils/misc'
import { test, expect } from './base-test'
import { authFixtures, getDataFixturePath, isStagingEnv } from './fixtures'

test.use({
  storageState: authFixtures.memberNoTransaction,
})

test.skip(isStagingEnv, 'Skipping on staging - creates local transaction data')
test.describe.configure({ mode: 'serial' })

let author: User
let transactionId: string

const expectedWhatsAppMessage = (origin: string, id: string) =>
  `[Kelas Tahun Prasekolahku]\n\nKlik di sini untuk verifikasi pembayaran\n${origin}/dashboard/transactions/${id}\n\nBerikut terlampir foto/file bukti pembayaran saya:`

async function expectWhatsAppConfirmationLink(
  href: string | null,
  origin: string,
  id: string
) {
  expect(href).toBeTruthy()

  const whatsappUrl = new URL(href as string)
  expect(whatsappUrl.origin).toBe('https://api.whatsapp.com')
  expect(whatsappUrl.pathname).toBe('/send')
  expect(whatsappUrl.searchParams.get('phone')).toBe(
    stripLeadingPlus(author.phoneNumber)
  )
  expect(whatsappUrl.searchParams.get('text')).toBe(
    expectedWhatsAppMessage(origin, id)
  )
}

test.beforeAll(async () => {
  author = JSON.parse(await readFixture(getDataFixturePath('users', 'author')))
})

test('submits transaction details and shows WhatsApp confirmation link with admin transaction URL', async ({
  page,
  baseURL,
}) => {
  await page.goto('/dashboard/purchase/confirm')

  await page.getByLabel('Nama Bank').fill('Bank Jago')
  await page.getByLabel('Nomor Rekening').fill('123-456-789')
  await page.getByLabel('Nama Pemilik Rekening').fill('Member Test')
  await page.getByLabel('Nominal').fill('200000')

  await page.getByRole('button', { name: 'Konfirmasi Pembayaran' }).click()
  await page.waitForURL('**/dashboard/purchase/verify/**')

  transactionId = page.url().split('/').pop() as string
  await page.goto(`/dashboard/purchase/verify/${transactionId}`)
  await expect(
    page.getByRole('heading', { name: 'Data transaksi tersimpan' })
  ).toBeVisible()
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/purchase/verify/${transactionId}$`)
  )

  await expectWhatsAppConfirmationLink(
    await page
      .getByRole('link', { name: 'Kirim Pesan WhatsApp' })
      .getAttribute('href'),
    baseURL as string,
    transactionId
  )
})

test('reopens transaction verification dialog from pending purchase page', async ({
  page,
  baseURL,
}) => {
  await page.goto('/dashboard/purchase/verify')

  await expect(
    page.getByRole('heading', { name: 'Detail Pengguna dan Transaksi' })
  ).toBeVisible()
  await page.getByRole('link', { name: 'Verifikasi Pembelian' }).click()

  await expect(
    page.getByRole('heading', { name: 'Data transaksi tersimpan' })
  ).toBeVisible()
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/purchase/verify/${transactionId}$`)
  )

  await expectWhatsAppConfirmationLink(
    await page
      .getByRole('link', { name: 'Kirim Pesan WhatsApp' })
      .getAttribute('href'),
    baseURL as string,
    transactionId
  )
})
