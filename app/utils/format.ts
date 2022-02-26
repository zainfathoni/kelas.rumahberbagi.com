export const formatDateTime = (date: Date) => {
  return date
    .toLocaleString('en-CA')
    .replace(/, /g, 'T')
    .replace(/:\d\d .*$/, '')
}
