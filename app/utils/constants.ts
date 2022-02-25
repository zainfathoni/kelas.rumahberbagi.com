export const STEPS = [
  {
    name: 'Pembayaran',
    description: 'Tranfer biaya ke rekening yang ditentukan',
    pathname: '/dashboard/purchase/',
  },
  {
    name: 'Konfirmasi Pembayaran',
    description: 'Hubungi admin melalui WhatsApp',
    pathname: '/dashboard/purchase/confirm',
  },
  {
    name: 'Menunggu Verifikasi',
    description: 'Nantikan informasi verifikasi pembayaran di email Anda',
    pathname: '/dashboard/purchase/pending-verification',
  },
  {
    name: 'Selesai',
    description: 'Periksa status pembayaran',
    pathname: '/dashboard/purchase/completed',
  },
]
