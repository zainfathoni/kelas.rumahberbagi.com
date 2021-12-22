import type { LoaderFunction } from 'remix'
import { auth } from '~/services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  await auth.authenticate('kcd', request, {
    // If the user was authenticated, we redirect them to their profile page
    // This redirect is optional, if not defined the user will be returnted by
    // the `authenticate` function and you can render something on this page
    // manually redirect the user.
    successRedirect: '/dashboard',
    // If something failed we take them back to the login page
    // This redirect is optional, if not defined any error will be throw and
    // the ErrorBoundary will be rendered.
    failureRedirect: '/login',
  })
}
