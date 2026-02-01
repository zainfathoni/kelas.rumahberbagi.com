import type { LoaderFunction } from '@remix-run/node'
import { auth } from '~/services/auth.server'
import { getUserSession } from '~/services/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getUserSession(request)
  const redirectTo = (session.get('redirectTo') as string) || '/dashboard'

  await auth.authenticate('email-link', request, {
    // If the user was authenticated, we redirect them to their saved redirectTo
    // or dashboard as fallback.
    successRedirect: redirectTo,
    // If something failed we take them back to the login page
    // This redirect is optional, if not defined any error will be throw and
    // the ErrorBoundary will be rendered.
    failureRedirect: '/login',
  })
}
