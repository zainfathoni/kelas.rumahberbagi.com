import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData, useNavigation } from '@remix-run/react'
import { Alert, ErrorAlert } from '~/components/alerts'
import { Button } from '~/components/form-elements'
import {
  enforceMagicLinkRateLimit,
  MAGIC_LINK_RATE_LIMIT_MESSAGE,
} from '~/services/magic-link-rate-limit.server'
import { auth } from '~/services/auth.server'
import { commitSession, getUserSession } from '~/services/session.server'

const loginNonceSessionKey = 'login:nonce'
const loginNonceFormKey = 'loginNonce'

function createLoginNonce() {
  return crypto.randomUUID()
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'

  await auth.isAuthenticated(request, { successRedirect: redirectTo })
  const session = await getUserSession(request)
  // This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  const error = session.get(auth.sessionErrorKey) as
    | { message: string }
    | undefined
  const loginNonce = createLoginNonce()

  session.set('redirectTo', redirectTo)
  session.set(loginNonceSessionKey, loginNonce)

  return json(
    {
      user: session.get('user'),
      magicLinkSent: session.has('zain:magiclink'),
      error: error?.message,
      redirectTo,
      loginNonce,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  )
}

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'
  const failureRedirect = `/login?redirectTo=${encodeURIComponent(redirectTo)}`
  const session = await getUserSession(request)
  const form = await request.clone().formData()
  const submittedNonce = form.get(loginNonceFormKey)
  const expectedNonce = session.get(loginNonceSessionKey)

  if (
    typeof submittedNonce !== 'string' ||
    typeof expectedNonce !== 'string' ||
    submittedNonce !== expectedNonce
  ) {
    return redirect(failureRedirect, {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    })
  }

  session.unset(loginNonceSessionKey)
  const committedSession = await commitSession(session)
  const verifiedRequestHeaders = new Headers(request.headers)
  verifiedRequestHeaders.set('Cookie', committedSession.split(';', 1)[0])
  const verifiedRequest = new Request(request, {
    headers: verifiedRequestHeaders,
  })

  try {
    await enforceMagicLinkRateLimit(verifiedRequest.clone())
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === MAGIC_LINK_RATE_LIMIT_MESSAGE
    ) {
      session.flash(auth.sessionErrorKey, { message: error.message })

      return redirect(failureRedirect, {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      })
    }

    throw error
  }

  // The success redirect is required in this action, this is where the user is
  // going to be redirected after the magic link is sent, note that here the
  // user is not yet authenticated, so you can't send it to a private page.
  return await auth.authenticate('email-link', verifiedRequest, {
    successRedirect: failureRedirect,
    // If this is not set, any error will be throw and the ErrorBoundary will be
    // rendered.
    failureRedirect,
  })
}

export default function Login() {
  const { magicLinkSent, error, redirectTo, loginNonce } = useLoaderData<{
    magicLinkSent: boolean
    error?: string
    redirectTo: string
    loginNonce: string
  }>()
  const { state } = useNavigation()

  return (
    <div className="min-h-full flex max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Masuk ke akun Anda
            </h2>
            <p className="mt-2 text-sm text-gray-600">atau buat akun baru</p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <Form
                action={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                method="post"
                className="space-y-6"
              >
                <input
                  type="hidden"
                  name={loginNonceFormKey}
                  value={loginNonce}
                />
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Alamat email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={state === 'submitting' || magicLinkSent}
                    className="w-full"
                  >
                    {state === 'submitting'
                      ? 'Sedang memproses...'
                      : 'Kirim link ke alamat email'}
                  </Button>
                </div>
              </Form>
              {error ? <ErrorAlert>{error}</ErrorAlert> : null}
              {magicLinkSent ? (
                <Form action="/logout" method="post">
                  <input type="hidden" name="redirectTo" value="/login" />
                  <Alert>Link telah dikirim ke alamat email Anda</Alert>
                  <div className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <span className="font-medium">Belum menerima email?</span>
                    </div>
                    <button
                      type="submit"
                      className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                    >
                      Coba lagi
                    </button>
                  </div>
                </Form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-contain"
          src="/rumah-berbagi.svg"
          alt="Rumah Berbagi"
        />
      </div>
    </div>
  )
}
