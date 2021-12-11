import { createCookieSessionStorage } from 'remix'
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

export let { getSession, commitSession, destroySession } = sessionStorage
