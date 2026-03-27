import { generateId } from '../../utils/nanoid'

export function randomInt(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pick<T>(values: readonly T[]) {
  return values[randomInt(0, values.length - 1)]
}

export function mockEmail() {
  return `user-${generateId()}@rumahberbagi.test`
}

export function mockName(prefix = 'Item') {
  return `${prefix} ${generateId()}`
}

export function mockSentence(prefix = 'Item') {
  return `${prefix} ${generateId()}`
}

export function mockParagraph(prefix = 'Description') {
  return `${prefix} ${generateId()} body copy.`
}

export function mockSlug(prefix = 'item') {
  return `${prefix}-${generateId().toLowerCase()}`
}

export function mockFileUrl(extension: string, folder = 'files') {
  return `https://example.com/${folder}/${mockSlug(folder)}.${extension}`
}

export function mockImageUrl() {
  return `https://images.example.com/${mockSlug('image')}.jpg`
}

export function mockPastDate() {
  return new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000)
}

export function mockBankAccountNumber() {
  return `${randomInt(10_000_000, 99_999_999)}`
}
