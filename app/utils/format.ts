export const formatDateTime = (date: Date) => {
  return date
    .toLocaleString('en-CA')
    .replace(/, /g, 'T')
    .replace(/T(\d):/g, 'T0$1:')
    .replace(/:(\d):/g, ':0$1:')
    .replace(/:\d\d .*$/, '')
}
