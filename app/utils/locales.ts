export function printRupiah(nominal: string | number) {
  return 'Rp. ' + nominal.toLocaleString('id')
}

export function printLocaleDateTimeString(date: Date | string | number) {
  return new Date(date).toLocaleString('id')
}
