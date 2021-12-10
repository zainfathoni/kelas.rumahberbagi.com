// app/services/auth.server.ts
import { Authenticator, KCDStrategy } from 'remix-auth'
import { sessionStorage } from '~/services/session.server'
import { sendEmail } from '~/services/email.server'
import { User } from '@prisma/client'
import { createUserByEmail, getUserByEmail } from '~/models/user'
import { verifyEmailAddress } from '~/services/verifier.server'

// This secret is used to encrypt the token sent in the magic link and the
// session used to validate someone else is not trying to sign-in as another
// user.
let secret = process.env.MAGIC_LINK_SECRET
if (!secret) throw new Error('Missing MAGIC_LINK_SECRET env variable.')

export let auth = new Authenticator<User>(sessionStorage)

// Here we need the sendEmail, the secret and the URL where the user is sent
// after clicking on the magic link
auth.use(
  new KCDStrategy(
    { verifyEmailAddress, sendEmail, secret, callbackURL: '/magic' },
    // In the verify callback you will only receive the email address and you
    // should return the user instance
    async (email) => {
      let user = await getUserByEmail(email)
      if (user === null) {
        user = await createUserByEmail(email)
      }
      return user
    }
  )
)
