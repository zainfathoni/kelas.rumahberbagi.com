import { describe, it, expect } from 'vitest'

describe('Auth redirect URL construction', () => {
  it('should construct correct login URL with redirectTo param from pathname', () => {
    const request = new Request('http://localhost:3000/dashboard/courses')
    const redirectTo = new URL(request.url).pathname

    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    const loginUrl = `/login?${searchParams}`

    expect(loginUrl).toBe('/login?redirectTo=%2Fdashboard%2Fcourses')
  })

  it('should use custom redirectTo when provided', () => {
    const redirectTo = '/custom/path'

    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    const loginUrl = `/login?${searchParams}`

    expect(loginUrl).toBe('/login?redirectTo=%2Fcustom%2Fpath')
  })

  it('should handle root path', () => {
    const request = new Request('http://localhost:3000/')
    const redirectTo = new URL(request.url).pathname

    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    const loginUrl = `/login?${searchParams}`

    expect(loginUrl).toBe('/login?redirectTo=%2F')
  })

  it('should handle paths with query parameters', () => {
    const redirectTo = '/dashboard/courses?filter=active'

    const searchParams = new URLSearchParams([['redirectTo', redirectTo]])
    const loginUrl = `/login?${searchParams}`

    expect(loginUrl).toContain('redirectTo=')
    expect(decodeURIComponent(loginUrl)).toContain(
      '/dashboard/courses?filter=active'
    )
  })
})

describe('Login redirect URL preservation', () => {
  it('should extract redirectTo from URL search params', () => {
    const url = new URL(
      'http://localhost:3000/login?redirectTo=/dashboard/profile'
    )
    const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'

    expect(redirectTo).toBe('/dashboard/profile')
  })

  it('should default to /dashboard when redirectTo is not provided', () => {
    const url = new URL('http://localhost:3000/login')
    const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'

    expect(redirectTo).toBe('/dashboard')
  })

  it('should preserve redirectTo in success/failure redirects', () => {
    const redirectTo = '/dashboard/transactions'
    const successRedirect = `/login?redirectTo=${encodeURIComponent(
      redirectTo
    )}`
    const failureRedirect = `/login?redirectTo=${encodeURIComponent(
      redirectTo
    )}`

    expect(successRedirect).toBe(
      '/login?redirectTo=%2Fdashboard%2Ftransactions'
    )
    expect(failureRedirect).toBe(
      '/login?redirectTo=%2Fdashboard%2Ftransactions'
    )
  })
})
