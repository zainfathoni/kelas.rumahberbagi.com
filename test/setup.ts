import '@testing-library/jest-dom/vitest'
import { beforeAll, afterAll, vi } from 'vitest'

const REACT_ROUTER_FUTURE_WARNING = 'React Router Future Flag Warning'
const originalWarn = console.warn

let warnSpy: ReturnType<typeof vi.spyOn>

beforeAll(() => {
  warnSpy = vi
    .spyOn(console, 'warn')
    .mockImplementation((...args: unknown[]) => {
      const [firstArg] = args
      if (
        typeof firstArg === 'string' &&
        firstArg.includes(REACT_ROUTER_FUTURE_WARNING)
      ) {
        return
      }

      originalWarn(...args)
    })
})

afterAll(() => {
  warnSpy?.mockRestore()
})
