import { createCookieSessionStorage, redirect } from 'remix'
import { getRequiredServerEnvVar } from '~/utils/misc'

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
    secure: process.env.NODE_ENV === 'production',
  },
})

export function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export async function logout(request: Request) {
  let session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  })
}

export let { getSession, commitSession, destroySession } = sessionStorage
