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
  const d = new Date(date)
  return (
    d.toLocaleString('id', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
    ' ' +
    d.toLocaleTimeString('id', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  )
}
