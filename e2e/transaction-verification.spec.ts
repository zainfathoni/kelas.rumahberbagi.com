import { Transaction, User } from '@prisma/client'
import { printRupiah } from '../app/utils/format'
import { readFixture } from '../app/utils/fixtures'
import { stripLeadingPlus } from '../app/utils/misc'
import { test, expect } from './base-test'
import { authFixtures, getDataFixturePath } from './fixtures'

let memberSubmit: User,
  submitted: Transaction,
  member: User,
  verified: Transaction,
  author: User

test.describe.configure({ mode: 'serial' })

test.beforeAll(async () => {
  memberSubmit = JSON.parse(
    await readFixture(getDataFixturePath('users', 'member-submit'))
  )
  submitted = JSON.parse(
    await readFixture(getDataFixturePath('transactions', 'submitted'))
  )
  member = JSON.parse(await readFixture(getDataFixturePath('users', 'member')))
  verified = JSON.parse(
    await readFixture(getDataFixturePath('transactions', 'verified'))
  )
  author = JSON.parse(await readFixture(getDataFixturePath('users', 'author')))
})

test.describe(
  'Member purchase verification flow (submitted transaction)',
  () => {
    test.use({ storageState: authFixtures.memberSubmit })

    test('member sees transaction details on verify page', async ({ page }) => {
      await page.goto('/dashboard/purchase/verify')

      // Should see transaction details
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

      // Should see "Verifikasi Pembelian" button
      const verifyButton = page.locator('text=Verifikasi Pembelian')
      await expect(verifyButton).toBeVisible()
    })

    test('member sees WhatsApp confirmation modal with correct link to api.whatsapp.com', async ({
      page,
      noscript,
    }) => {
      test.skip(noscript, 'Modal requires JavaScript')
      await page.goto(`/dashboard/purchase/verify/${submitted.id}`)

      // Modal should show confirmation message
      await expect(page.getByText('Data transaksi tersimpan')).toBeVisible()
      await expect(
        page.getByText(
          'Silakan klik tombol di bawah ini untuk mengirimkan pesan WhatsApp kepada kami.'
        )
      ).toBeVisible()

      // Verify WhatsApp link structure
      const whatsappButton = page.locator('text=Kirim Pesan WhatsApp')
      await expect(whatsappButton).toBeVisible()

      const href = await whatsappButton.getAttribute('href')
      expect(href).toContain('https://api.whatsapp.com/send?')
      expect(href).toContain(`phone=${stripLeadingPlus(author.phoneNumber)}`)
      expect(href).toContain('text=')
      // The pre-filled text should include the transaction URL
      expect(href).toContain(
        encodeURIComponent(`/dashboard/transactions/${submitted.id}`)
      )
    })
  }
)

test.describe('Member completed purchase page (verified transaction)', () => {
  test.use({ storageState: authFixtures.member })

  test('member sees completed page with Kontak Admin WhatsApp link to wa.me', async ({
    page,
  }) => {
    await page.goto('/dashboard/purchase/completed')

    // Should see transaction details
    await expect(page.locator('id=user-name')).toHaveText(member.name as string)
    await expect(page.locator('id=bank-name')).toHaveText(verified.bankName)
    await expect(page.locator('id=transaction-status')).toContainText(
      'Terverifikasi'
    )

    // "Kontak Admin" button should have correct WhatsApp link
    const kontakAdmin = page.locator('text=Kontak Admin')
    await expect(kontakAdmin).toBeVisible()
    await expect(kontakAdmin).toHaveAttribute(
      'href',
      `https://wa.me/${stripLeadingPlus(author.phoneNumber)}`
    )
  })
})
