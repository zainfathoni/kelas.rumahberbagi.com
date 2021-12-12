import type { ActionFunction, LoaderFunction } from 'remix'
import { Form, json, useLoaderData } from 'remix'
import { auth } from '~/services/auth.server'
import { getUserSession } from '~/services/session.server'

export let loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: '/dashboard' })
  let session = await getUserSession(request)
  // This session key `kcd:magiclink` is the default one used by the KCDStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  return json({ user: session.get('user'), magicLinkSent: session.has('zain:magiclink') })
}

export let action: ActionFunction = async ({ request }) => {
  // The success redirect is required in this action, this is where the user is
  // going to be redirected after the magic link is sent, note that here the
  // user is not yet authenticated, so you can't send it to a private page.
  await auth.authenticate('kcd', request, {
    successRedirect: '/login',
    // If this is not set, any error will be throw and the ErrorBoundary will be
    // rendered.
    failureRedirect: '/login',
  })
}

export default function Login() {
  let { magicLinkSent } = useLoaderData<{ magicLinkSent: boolean }>()

  return (
    <div className="min-h-full flex max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-gray-600">atau buat akun baru</p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <Form action="/login" method="post" className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  <button
                    type="submit"
                    disabled={magicLinkSent}
                    className="disabled:opacity-50 disabled:cursor-not-allowed w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Kirim link ke alamat email
                  </button>
                </div>
              </Form>
              {magicLinkSent ? (
                <div className="flex items-center justify-center py-2">
                  <div className="text-sm">
                    <span className="font-medium">✨ Link telah dikirim ke alamat email Anda ✨</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-contain" src="/rumah-berbagi.svg" alt="Rumah Berbagi" />
      </div>
    </div>
  )
}
