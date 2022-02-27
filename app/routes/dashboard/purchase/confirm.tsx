import {
  Form,
  json,
  Link,
  redirect,
  useCatch,
  useLoaderData,
  useTransition,
} from 'remix'
import type { ActionFunction, LoaderFunction, ThrownResponse } from 'remix'
import { Transaction, User } from '@prisma/client'
import { XCircleIcon } from '@heroicons/react/solid'
import { validateRequired } from '~/utils/validators'
import { auth, requireUpdatedUser } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import { getFirstCourse } from '~/models/course'
import { getFirstTransaction } from '~/models/transaction'
import { formatDateTime } from '~/utils/format'
import { Button, Field } from '~/components/form-elements'
import { TRANSACTION_STATUS } from '~/models/enum'

interface TransactionFields {
  userId: string
  courseId: string
  authorId: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
  amount: number
  datetime: Date
  status: string
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)

  const transaction = await getFirstTransaction(user.id)

  if (!transaction) {
    return json({ user })
  }

  return json({ user, transaction })
}

export const action: ActionFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const course = await getFirstCourse()

  if (!course) {
    return redirect('/dashboard')
  }

  const form = await request.formData()
  const id = form.get('id')
  const bankName = form.get('bankName')
  const bankAccountNumber = form.get('bankAccountNumber')
  const bankAccountName = form.get('bankAccountName')
  const amount: string = form.get('amount') as string
  const paymentTime: string = form.get('paymentTime') as string

  const parsedAmount: number = parseInt(amount, 10) as number
  const formattedPaymentTime: Date = new Date(paymentTime)

  if (
    typeof id !== 'string' ||
    typeof bankName !== 'string' ||
    typeof bankAccountNumber !== 'string' ||
    typeof bankAccountName !== 'string' ||
    typeof amount !== 'string' ||
    typeof paymentTime !== 'string'
  ) {
    return { formError: 'Form not submitted correctly.' }
  }

  const fieldErrors = {
    bankName: validateRequired('Nomor WhatsApp', bankName),
    bankAccountNumber: validateRequired('Nama Bank', bankAccountNumber),
    bankAccountName: validateRequired('Nomor Rekening', bankAccountName),
    amount: validateRequired('Nominal', amount),
    paymentTime: validateRequired('Tanggal dan Waktu Pembayaran', paymentTime),
  }

  const fields: TransactionFields = {
    userId: user.id,
    courseId: course.id,
    authorId: course.authorId,
    bankName,
    bankAccountName,
    bankAccountNumber,
    amount: parsedAmount,
    datetime: formattedPaymentTime,
    status: 'SUBMITTED',
  }
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }

  let transaction: Transaction | undefined

  if (id) {
    transaction = await db.transaction.update({
      where: {
        id,
      },
      data: fields,
    })
  } else {
    transaction = await db.transaction.create({ data: fields })
  }

  if (!transaction) {
    throw json({ fields }, { status: 500 })
  }

  return redirect(`/dashboard/purchase/verify/${transaction.id}`)
}

export default function PurchaseConfirm() {
  const { user, transaction } = useLoaderData<{
    user: User
    transaction?: Transaction
  }>()
  const { state } = useTransition()

  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      <Form method="post">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-3">
                <dt className="text-sm font-medium text-gray-500">
                  Nama Lengkap Anda
                </dt>
                <dd id="user-name" className="mt-1 text-sm text-gray-900">
                  {user.name}
                </dd>
              </div>
              <div className="col-span-3">
                <dt className="text-sm font-medium text-gray-500">
                  Nomor WhatsApp Anda
                </dt>
                <dd
                  id="user-phone-number"
                  className="mt-1 text-sm text-gray-900"
                >
                  {user.phoneNumber}
                </dd>
              </div>
              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  Nama Lengkap atau Nomor WhatsApp Anda salah?
                </p>
                <Link
                  to="/dashboard/profile/edit"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Ubah di sini
                </Link>
              </div>
              <input type="hidden" name="id" value={transaction?.id} />
              <Field
                className="col-span-6 lg:col-span-3"
                name="bankName"
                label="Nama Bank"
                placeholder="Bank Jago"
                defaultValue={transaction?.bankName ?? ''}
                autoComplete="organization"
                autoCapitalize="words"
                required
                aria-invalid={transaction?.bankName ? 'false' : 'true'}
              />
              <Field
                className="col-span-6 lg:col-span-3"
                name="bankAccountNumber"
                label="Nomor Rekening"
                placeholder="123-456-789"
                defaultValue={transaction?.bankAccountNumber ?? ''}
                required
                aria-invalid={transaction?.bankAccountNumber ? 'false' : 'true'}
              />
              <Field
                className="col-span-6 lg:col-span-3"
                name="bankAccountName"
                label="Nama Pemilik Rekening"
                placeholder="Cantumkan nama pemilik rekening"
                defaultValue={transaction?.bankAccountName ?? ''}
                autoComplete="name"
                autoCapitalize="words"
                required
                aria-invalid={transaction?.bankAccountName ? 'false' : 'true'}
              />
              <Field
                className="col-span-6 lg:col-span-3"
                name="amount"
                label="Nominal"
                placeholder="200000"
                defaultValue={
                  transaction?.amount ? String(transaction?.amount) : ''
                }
                autoComplete="transaction-amount"
                required
                aria-invalid={transaction?.amount ? 'false' : 'true'}
              />
              <Field
                type="datetime-local"
                className="col-span-6"
                name="paymentTime"
                label="Tanggal dan Waktu Pembayaran"
                defaultValue={
                  transaction?.datetime
                    ? formatDateTime(new Date(transaction.datetime))
                    : undefined
                }
                required
                aria-invalid={transaction?.datetime ? 'false' : 'true'}
              />
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <Button
              type="submit"
              disabled={
                state === 'submitting' ||
                transaction?.status === TRANSACTION_STATUS.VERIFIED
              }
              className="inline-flex"
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse>()

  return (
    <>
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {caught.statusText}
            </h3>
          </div>
        </div>
      </div>
      <div className="py-16">
        <div className="text-center">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Error {caught.status}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Terjadi kesalahan
          </h1>
          <div className="mt-6">
            <Link
              to="/dashboard/purchase/confirm"
              className="text-base font-medium text-indigo-600 hover:text-indigo-500"
            >
              Silakan coba lagi<span aria-hidden="true"> &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
