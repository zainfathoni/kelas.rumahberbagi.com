import { LockClosedIcon } from '@heroicons/react/solid'
import type { ActionFunction, LoaderFunction } from 'remix'
import { Form, json, useLoaderData } from 'remix'
import { auth } from '~/services/auth.server'
import { sessionStorage } from '~/services/session.server'

export let loader: LoaderFunction = async ({ request }) => {
  auth.isAuthenticated(request, { successRedirect: '/me' })
  let session = await sessionStorage.getSession(request.headers.get('Cookie'))
  // This session key `kcd:magiclink` is the default one used by the KCDStrategy
  // you can customize it passing a `sessionMagicLinkKey` when creating an
  // instance.
  if (session.has('kcd:magiclink')) return json({ magicLinkSent: true })
  return json({ magicLinkSent: false })
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
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img className="mx-auto h-12 w-auto" src="/rumah-berbagi.svg" alt="Rumah Berbagi" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                start your 14-day free trial
              </a>
            </p>
          </div>
          <Form className="mt-8 space-y-6" action="/login" method="post">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your email?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Email a login link
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}
