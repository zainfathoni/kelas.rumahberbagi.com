import { KCDVerifyEmailFunction } from 'remix-auth'
import { isEmailBurner } from 'burner-email-providers'
import isEmail from 'validator/lib/isEmail'

export let verifyEmailAddress: KCDVerifyEmailFunction = async (email) => {
  if (!isEmail(email)) throw new Error('Invalid email address.')
  if (isEmailBurner(email)) throw new Error('Email not allowed.')
}
