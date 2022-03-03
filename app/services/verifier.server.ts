import { VerifyEmailFunction } from 'remix-auth-email-link'
import { isEmailBurner } from 'burner-email-providers'
import isEmail from 'validator/lib/isEmail'

export const verifyEmailAddress: VerifyEmailFunction = async (email) => {
  if (!isEmail(email)) throw new Error('Invalid email address.')
  if (isEmailBurner(email)) throw new Error('Email not allowed.')
}
