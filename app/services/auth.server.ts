import { Authenticator, KCDStrategy } from 'remix-auth'
import { User } from '@prisma/client'
import { sessionStorage } from '~/services/session.server'
import { sendEmail } from '~/services/email.server'
import { createUserByEmail, getUserByEmail } from '~/models/user'
import { verifyEmailAddress } from '~/services/verifier.server'
import { getRequiredServerEnvVar } from '~/utils/misc'

// This secret is used to encrypt the token sent in the magic link and the
// session used to validate someone else is not trying to sign-in as another
// user.
const secret = getRequiredServerEnvVar('MAGIC_LINK_SECRET')

export const auth = new Authenticator<User>(sessionStorage)

// Here we need the sendEmail, the secret and the URL where the user is sent
// after clicking on the magic link
auth.use(
  new KCDStrategy(
    {
      verifyEmailAddress,
      sendEmail,
      secret,
      callbackURL: '/magic',
      sessionMagicLinkKey: 'zain:magiclink',
    },
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
