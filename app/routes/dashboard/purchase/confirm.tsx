import { Form, json, Link, redirect, useCatch, useLoaderData } from 'remix'
import type { ActionFunction, LoaderFunction, ThrownResponse } from 'remix'
import { Transaction, User } from '@prisma/client'
import { XCircleIcon } from '@heroicons/react/solid'
import { validateRequired } from '~/utils/validators'
import { auth } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import { getFirstCourse } from '~/models/course'
import { getFirstTransaction } from '~/models/transaction'
import { getUser } from '~/models/user'
import { formatDateTime } from '~/utils/format'

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
  const { id } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  // TODO: we can use the user instance from the auth service only when we always commit new changes in /profile/edit
  // until then, we need to fetch the user from the database
  const user = await getUser(id)

  if (!user) {
    redirect('/logout')
  }

  const transaction = await getFirstTransaction(id)

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

  return (
    <>
      <Form action="/dashboard/purchase/confirm" method="post">
        <input type="hidden" name="id" value={transaction?.id} />
        <div>
          Nama Lengkap Anda: <span>{user.name}</span>
        </div>
        <div>
          Nomor WhatsApp Anda: <span>{user.phoneNumber}</span>
        </div>
        <div>
          Nama Lengkap atau Nomor WhatsApp Anda salah?{' '}
          <Link to="/dashboard/profile/edit">Ubah di sini</Link>
        </div>
        <div>
          <label>
            Nama Bank:{' '}
            <input
              type="text"
              name="bankName"
              defaultValue={transaction?.bankName}
            />
          </label>
        </div>
        <div>
          <label>
            Nomor Rekening:{' '}
            <input
              type="text"
              name="bankAccountNumber"
              defaultValue={transaction?.bankAccountNumber}
            />
          </label>
        </div>
        <div>
          <label>
            Nama Pemilik Rekening:{' '}
            <input
              type="text"
              name="bankAccountName"
              defaultValue={transaction?.bankAccountName}
            />
          </label>
        </div>
        <div>
          <label>
            Nominal:{' '}
            <input
              type="text"
              name="amount"
              defaultValue={transaction?.amount}
            />
          </label>
        </div>
        <div>
          <label>
            Tanggal dan Waktu Pembayaran:
            <input
              type="datetime-local"
              id="meeting-time"
              name="paymentTime"
              defaultValue={
                transaction?.datetime
                  ? formatDateTime(new Date(transaction.datetime))
                  : undefined
              }
            />
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Konfirmasi Pembayaran
          </button>
        </div>
      </Form>
    </>
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
