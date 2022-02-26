export const formatDateTime = (date: Date) => {
  return date
    .toLocaleString('en-CA')
    .replace(/, /g, 'T')
    .replace(/T(\d):/g, 'T0$1:')
    .replace(/:(\d):/g, ':0$1:')
    .replace(/:\d\d .*$/, '')
}

export function printRupiah(nominal: string | number) {
  return 'Rp. ' + nominal.toLocaleString('id')
}

export function printLocaleDateTimeString(date: Date | string | number) {
  return new Date(date).toLocaleString('id')
}
