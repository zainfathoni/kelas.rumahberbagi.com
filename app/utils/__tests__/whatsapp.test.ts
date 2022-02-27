import { getWhatsAppLink, getWhatsAppLinkForConfirmation } from '../whatsapp'

describe('whatsapp', () => {
  it('should get whatsapp link for confirmation with origin set', () => {
    const phoneNumber = '+62812341234'
    const transactionId = '1234567890'
    const origin = 'http://localhost:3000'
    const expected =
      'https://api.whatsapp.com/send?phone=62812341234&text=%5BKelas+Tahun+Prasekolahku%5D%0A%0AKlik+di+sini+untuk+verifikasi+pembayaran%0Ahttp%3A%2F%2Flocalhost%3A3000%2Fdashboard%2Ftransactions%2F1234567890%0A%0ABerikut+terlampir+foto%2Ffile+bukti+pembayaran+saya%3A'
    const actual = getWhatsAppLinkForConfirmation(
      phoneNumber,
      transactionId,
      origin
    )
    expect(actual).toEqual(expected)
  })

  it('should get whatsapp link for confirmation with the default https://kelas.rumahberbagi.com origin', () => {
    const phoneNumber = '+62812341234'
    const transactionId = '1234567890'
    const expected =
      'https://api.whatsapp.com/send?phone=62812341234&text=%5BKelas+Tahun+Prasekolahku%5D%0A%0AKlik+di+sini+untuk+verifikasi+pembayaran%0Ahttps%3A%2F%2Fkelas.rumahberbagi.com%2Fdashboard%2Ftransactions%2F1234567890%0A%0ABerikut+terlampir+foto%2Ffile+bukti+pembayaran+saya%3A'
    const actual = getWhatsAppLinkForConfirmation(phoneNumber, transactionId)
    expect(actual).toEqual(expected)
  })

  it('should get whatsapp link', () => {
    const phoneNumber = '+62812341234'
    const expected = 'https://wa.me/62812341234'
    const actual = getWhatsAppLink(phoneNumber)
    expect(actual).toEqual(expected)
  })
})
