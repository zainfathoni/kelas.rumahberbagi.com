import { Form, redirect } from 'remix'
import type { ActionFunction } from 'remix'
import { validatePhoneNumber, validateRequired } from '~/utils/validators'
import { auth } from '~/services/auth.server'
import { db } from '~/utils/db.server'
import { getFirstCourse } from '~/models/course'

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

export const action: ActionFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const course = await getFirstCourse()

  if (!course) {
    return redirect('/dashboard')
  }

  const form = await request.formData()
  const name = form.get('name')
  const phoneNumber = form.get('phoneNumber')
  const bankName = form.get('bankName')
  const bankAccountNumber = form.get('bankAccountNumber')
  const bankAccountName = form.get('bankAccountName')
  const amount: string = form.get('amount') as string
  const paymentTime: string = form.get('paymentTime') as string

  const parsedAmount: number = parseInt(amount, 10) as number
  const formattedPaymentTime: Date = new Date(paymentTime)

  if (
    typeof name !== 'string' ||
    typeof phoneNumber !== 'string' ||
    typeof bankName !== 'string' ||
    typeof bankAccountNumber !== 'string' ||
    typeof bankAccountName !== 'string' ||
    typeof amount !== 'string' ||
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

  const transaction = await db.transaction.create({ data: fields })

  if (!transaction) {
    return redirect('/dashboard')
  }

  return redirect(`/dashboard/purchase/verify/${transaction.id}`)
}

export default function PurchaseConfirm() {
  return (
    <>
      <Form action="/dashboard/purchase/confirm" method="post">
        <div>
          <label>
            Nama Lengkap Anda: <input type="text" name="name" />
          </label>
        </div>
        <div>
          <label>
            Nomor WhatsApp Anda: <input type="text" name="phoneNumber" />
          </label>
        </div>
        <div>
          <label>
            Nama Bank: <input type="text" name="bankName" />
          </label>
        </div>
        <div>
          <label>
            Nomor Rekening: <input type="text" name="bankAccountNumber" />
          </label>
        </div>
        <div>
          <label>
            Nama Pemilik Rekening: <input type="text" name="bankAccountName" />
          </label>
        </div>
        <div>
          <label>
            Nominal: <input type="text" name="amount" />
          </label>
        </div>
        <div>
          <label>
            Tanggal dan Waktu Pembayaran:
            <input type="datetime-local" id="meeting-time" name="paymentTime" />
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
