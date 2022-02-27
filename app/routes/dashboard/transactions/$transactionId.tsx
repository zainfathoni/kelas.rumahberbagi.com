import { redirect, useLoaderData, Outlet, json } from 'remix'
import type { LoaderFunction, ActionFunction } from 'remix'
import {
  getTransactionById,
  TransactionWithUser,
  updateTransactionStatus,
} from '~/models/transaction'
import { TransactionStatus, TRANSACTION_STATUS } from '~/models/enum'
import { requireUpdatedUser } from '~/services/auth.server'
import { getFirstCourse } from '~/models/course'
import { requireCourseAuthor } from '~/utils/permissions'
import { TransactionDetails } from '~/components/transaction-details'
import {
  PrimaryButtonLink,
  SecondaryButtonLink,
  TertiaryButtonLink,
} from '~/components/button-link'
import { getWhatsAppLink } from '~/utils/whatsapp'

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/transactions')
  }

  const { transactionId } = params

  if (!transactionId) {
    return redirect('/dashboard/transactions')
  }

  const transaction = await getTransactionById(transactionId)

  if (!transaction) {
    return redirect('/dashboard/transactions')
  }

  return { transaction, user }
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/transactions')
  }

  const { transactionId } = params
  if (!transactionId) {
    return redirect('/dashboard/transactions')
  }

  const formData = await request.formData()
  const status = formData.get('status')

  if (typeof status !== 'string') {
    return { formError: 'Form not submitted correctly.' }
  }

  const transaction = await getTransactionById(transactionId)
  if (!transaction) {
    return redirect('/dashboard/purchase')
  }

  const updatedTransaction = await updateTransactionStatus(
    transaction.id,
    status as TransactionStatus
  )
  if (!updatedTransaction) {
    throw json({ ...transaction, status }, { status: 500 })
  }

  return {
    transaction: updatedTransaction,
    user,
  }
}

export default function TransactionDetailsPage() {
  const { transaction } = useLoaderData<{ transaction: TransactionWithUser }>()

  return (
    <>
      <div className="min-h-full">
        <TransactionDetails transaction={transaction} user={transaction.user}>
          {/* TODO: Disable rejecting a verified transaction */}
          <TertiaryButtonLink
            to="reject"
            replace
            disabled={transaction.status === TRANSACTION_STATUS.REJECTED}
          >
            Tolak Transaksi
          </TertiaryButtonLink>
          <SecondaryButtonLink
            to={getWhatsAppLink(transaction.user.phoneNumber)}
            external
            disabled={!transaction.user.phoneNumber}
          >
            Kontak WhatsApp
          </SecondaryButtonLink>
          <PrimaryButtonLink
            to="verify"
            replace
            disabled={transaction.status === TRANSACTION_STATUS.VERIFIED}
          >
            Verifikasi Transaksi
          </PrimaryButtonLink>
        </TransactionDetails>
      </div>
      <Outlet />
    </>
  )
}
