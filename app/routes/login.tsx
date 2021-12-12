import { User } from '@prisma/client'
import { ActionFunction, Link, LoaderFunction } from 'remix'
import { Form, json, useLoaderData } from 'remix'
import { AuthForm } from '~/components/auth-form'
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
  let { user, magicLinkSent } = useLoaderData<{ user: User; magicLinkSent: boolean }>()

  return <AuthForm type="LOGIN" user={user} magicLinkSent={magicLinkSent} />
}
