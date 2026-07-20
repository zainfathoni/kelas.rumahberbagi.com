import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { getRequiredServerEnvVar } from '~/utils/misc'

const isOrbPortal = process.env.ORB_PORTAL === 'true'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: isOrbPortal ? 'none' : 'lax',
    partitioned: isOrbPortal,
    path: '/',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure:
      isOrbPortal ||
      (process.env.NODE_ENV === 'production' &&
        process.env.RUNNING_E2E !== 'true'),
  },
})

export function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export async function logout(request: Request) {
  const session = await getUserSession(request)
  const form = await request.formData()
  const redirectTo = form.get('redirectTo') ?? '/'
  if (typeof redirectTo !== 'string') {
    return { formError: `Form not submitted correctly.` }
  }
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export const { getSession, commitSession, destroySession } = sessionStorage
