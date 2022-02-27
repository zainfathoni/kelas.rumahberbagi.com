import { stripLeadingPlus } from './misc'

export function getWhatsAppLinkForConfirmation(
  phoneNumber: string | null | undefined,
  transactionId: string,
  origin = 'https://kelas.rumahberbagi.com'
): string {
  const searchParams = new URLSearchParams()
  const normalizedPhoneNumber = stripLeadingPlus(phoneNumber) ?? ''
  searchParams.append('phone', normalizedPhoneNumber)
  searchParams.append(
    'text',
    `[Kelas Tahun Prasekolahku]\n\nKlik di sini untuk verifikasi pembayaran\n${origin}/dashboard/transactions/${transactionId}\n\nBerikut terlampir foto/file bukti pembayaran saya:`
  )
  return `https://api.whatsapp.com/send?${searchParams.toString()}`
}

export function getWhatsAppLink(
  phoneNumber: string | null | undefined
): string {
  const normalizedPhoneNumber = stripLeadingPlus(phoneNumber)
  return `https://wa.me/${normalizedPhoneNumber}`
}
