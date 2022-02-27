import { stripLeadingPlus } from './misc'

export function getWhatsAppLinkForConfirmation(
  phoneNumber: string | null | undefined,
  transactionId: string
): string {
  const normalizedPhoneNumber = stripLeadingPlus(phoneNumber)
  return `https://api.whatsapp.com/send?phone=${normalizedPhoneNumber}&text=%5BKelas%20Tahun%20Prasekolahku%5D%0A%0AKlik%20di%20sini%20untuk%20verifikasi%20pembayaran%0Ahttps%3A%2F%2Frbagi.id%2Fverify%2F${transactionId}%0A%0ABerikut%20terlampir%20foto%2Ffile%20bukti%20pembayaran%20saya%3A`
}

export function getWhatsAppLink(
  phoneNumber: string | null | undefined
): string {
  const normalizedPhoneNumber = stripLeadingPlus(phoneNumber)
  return `https://wa.me/${normalizedPhoneNumber}`
}
