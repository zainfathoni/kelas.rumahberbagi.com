import { Outlet, redirect } from 'remix'
import type { ActionFunction, LoaderFunction } from 'remix'
import type { Subscription, User } from '@prisma/client'
import { validatePhoneNumber, validateRequired } from '~/utils/validators'
import { auth } from '~/services/auth.server'
import { db } from '~/utils/db.server'

interface TransactionFields {
  userId: string
  subscriptionId: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  amount: number
  status: string
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    phoneNumber: string | undefined
    bankName: string | undefined
    bankAccountNumber: string | undefined
    bankAccountName: string | undefined
    amount: number | undefined
    paymentTime: string | undefined
  }
  fields: TransactionFields
}

export const action: ActionFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const form = await request.formData()
  const name = form.get('name')
  const phoneNumber = form.get('phoneNumber')
  const bankName = form.get('bankName')
  const bankAccountNumber = form.get('bankAccountNumber')
  const bankAccountName = form.get('bankAccountName')
  const amount = form.get('amount')
  const paymentTime = form.get('paymentTime')

  if (
    typeof name !== 'string' ||
    typeof phoneNumber !== 'string' ||
    typeof bankName !== 'string' ||
    typeof bankAccountNumber !== 'string' ||
    typeof bankAccountName !== 'string' ||
    typeof amount !== 'number' ||
    typeof paymentTime !== 'string'
  ) {
    return { formError: 'Form not submitted correctly.' }
  }

  const fieldErrors = {
    name: validateRequired('Nama Lengkap', name),
    phoneNumber: validatePhoneNumber('Nomor WhatsApp', phoneNumber),
    bankName: validateRequired('Nomor WhatsApp', bankName),
    bankAccountNumber: validateRequired('Nama Bank', bankAccountNumber),
    bankAccountName: validateRequired('Nomor Rekening', bankAccountName),
    amount: validateRequired('Nominal', amount),
    paymentTime: validateRequired('Nominal', paymentTime),
  }

  const fields: TransactionFields = {
    userId: user.id,
    subscriptionId: '123', //should create assign subcription first?
    bankName,
    bankAccountName,
    bankAccountNumber,
    amount,
    status: 'SUBMITTED',
  }
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }

  const transaction = await db.transaction.create({ data: fields })
}

export default function Confirm() {
  return <Outlet />
}
