import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getUserByEmail } from '~/models/user'
import { auth, getHeadersWithUpdatedUser } from '~/services/auth.server'
import { getUserSession } from '~/services/session.server'

const previewEmails = new Set([
  'admin@rumahberbagi.com',
  'author@rumahberbagi.com',
  'member@rumahberbagi.com',
])

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const previewEmail = url.searchParams
    .get('previewEmail')
    ?.trim()
    .toLowerCase()

  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.RUNNING_E2E === 'true' &&
    process.env.ORB_PORTAL === 'true' &&
    previewEmail &&
    previewEmails.has(previewEmail)
  ) {
    const user = await getUserByEmail(previewEmail)

    if (user) {
      return redirect('/dashboard', {
        headers: await getHeadersWithUpdatedUser(request, user),
      })
    }

    return redirect('/login')
  }

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
