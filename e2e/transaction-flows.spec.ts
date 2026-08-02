import { Course, PrismaClient, Transaction, User } from '@prisma/client'
import { readFixture } from '../app/utils/fixtures'
import { generateId } from '../app/utils/nanoid'
import { stripLeadingPlus } from '../app/utils/misc'
import { getWhatsAppLinkForConfirmation } from '../app/utils/whatsapp'
import { transactionBuilder } from '../app/models/__mocks__/transaction'
import { userBuilder } from '../app/models/__mocks__/user'
import { test, expect } from './base-test'
import { authFixtures, getDataFixturePath, isStagingEnv } from './fixtures'

process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'file:./test.db'

const db = new PrismaClient()

test.skip(isStagingEnv, 'Skipping on staging - creates local transaction data')
test.skip(
  ({ browserName, noscript }) => browserName !== 'chromium' || noscript,
  'Transaction flow tests mutate shared local database fixtures'
)

test.afterAll(async () => {
  await db.$disconnect()
})

async function readUserFixture(name: string): Promise<User> {
  return JSON.parse(await readFixture(getDataFixturePath('users', name)))
}

async function getCourse(): Promise<Course> {
  const course = await db.course.findFirst()

  if (!course) {
    throw new Error('Expected a seeded course fixture')
  }

  return course
}

test.describe('Transaction confirmation process', () => {
  test.use({ storageState: authFixtures.memberEdit })

  test.beforeEach(async () => {
    const member = await readUserFixture('member-edit')
    await db.transaction.deleteMany({ where: { userId: member.id } })
  })

  test('submits payment details and generates the WhatsApp confirmation link', async ({
    page,
    baseURL,
  }) => {
    const author = await readUserFixture('author')

    await page.goto('/dashboard/purchase/confirm')

    await page.getByRole('textbox', { name: /nama bank/i }).fill('Bank Jago')
    await page
      .getByRole('textbox', { name: /nomor rekening/i })
      .fill('123-456-789')
    await page
      .getByRole('textbox', { name: /nama pemilik rekening/i })
      .fill('Member Edit')
    await page.getByRole('textbox', { name: /nominal/i }).fill('200000')

    await page.getByRole('button', { name: /konfirmasi pembayaran/i }).click()
    await page.waitForURL(/\/dashboard\/purchase\/verify\/[^/]+$/)

    const verifyPurchaseLink = page.getByRole('link', {
      name: /verifikasi pembelian/i,
    })
    await expect(verifyPurchaseLink).toBeVisible()

    await expect(verifyPurchaseLink).toHaveAttribute(
      'href',
      /\/dashboard\/purchase\/verify\/[^/]+$/
    )

    const verifyPurchaseHref = await verifyPurchaseLink.getAttribute('href')
    const transactionId = (verifyPurchaseHref as string).split('/').at(-1)
    const href = getWhatsAppLinkForConfirmation(
      author.phoneNumber,
      transactionId as string,
      baseURL
    )

    const url = new URL(href)
    expect(url.origin).toBe('https://api.whatsapp.com')
    expect(url.pathname).toBe('/send')
    expect(url.searchParams.get('phone')).toBe(
      stripLeadingPlus(author.phoneNumber)
    )
    expect(url.searchParams.get('text')).toContain(
      `${baseURL}/dashboard/transactions/${transactionId}`
    )
  })
})

test.describe('Transaction verification process', () => {
  test.use({ storageState: authFixtures.author })

  let member: User
  let transaction: Transaction

  test.beforeEach(async () => {
    const course = await getCourse()
    member = await db.user.create({
      data: {
        id: generateId(),
        ...userBuilder({ overrides: { phoneNumber: '+6281234567890' } }),
      },
    })
    transaction = await db.transaction.create({
      data: {
        id: generateId(),
        userId: member.id,
        courseId: course.id,
        authorId: course.authorId,
        ...transactionBuilder(),
      },
    })
  })

  test('verifies a submitted transaction and exposes the member WhatsApp link', async ({
    page,
  }) => {
    await page.goto(`/dashboard/transactions/${transaction.id}`)

    const contactWhatsAppButton = page.getByRole('link', {
      name: /kontak whatsapp/i,
    })
    await expect(contactWhatsAppButton).toBeVisible()
    await expect(contactWhatsAppButton).toHaveAttribute(
      'href',
      `https://wa.me/${stripLeadingPlus(member.phoneNumber)}`
    )

    const verifyTransactionLink = page.getByRole('link', {
      name: /verifikasi transaksi/i,
    })
    await expect(verifyTransactionLink).toHaveAttribute(
      'href',
      `/dashboard/transactions/${transaction.id}/verify`
    )

    const response = await page.request.post(
      `/dashboard/transactions/${transaction.id}/verify`,
      {
        form: {
          status: 'VERIFIED',
          notes: 'Valid payment',
        },
      }
    )
    expect(response.ok()).toBe(true)

    await page.goto(`/dashboard/transactions/${transaction.id}`)
    await expect(page.locator('id=transaction-status')).toContainText(
      'Terverifikasi'
    )
    await expect(page.locator('id=notes')).toContainText('Valid payment')
  })
})
