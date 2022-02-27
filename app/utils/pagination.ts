export const PAGE_SIZE = 10

export function getSkip(page?: number) {
  return page ? (page - 1) * PAGE_SIZE : 0
}

export function getPagesCount(total = 0) {
  return Math.ceil(total / PAGE_SIZE)
}
