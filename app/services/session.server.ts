import { createCookieSessionStorage, redirect } from '@remix-run/node'
import { getRequiredServerEnvVar } from '~/utils/misc'

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure:
      process.env.NODE_ENV === 'production' &&
      process.env.RUNNING_E2E !== 'true',
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
