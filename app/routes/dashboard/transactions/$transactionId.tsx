import { redirect, useLoaderData, Outlet } from 'remix'
import type { LoaderFunction } from 'remix'
import { useSearchParams } from 'react-router-dom'
import { getTransactionById, TransactionWithUser } from '~/models/transaction'
import { TRANSACTION_STATUS } from '~/models/enum'
import { requireUser } from '~/services/auth.server'
import { getFirstCourse } from '~/models/course'
import { requireCourseAuthor } from '~/utils/permissions'
import { TransactionDetails } from '~/components/transaction-details'
import {
  PrimaryButtonLink,
  SecondaryButtonLink,
  TertiaryButtonLink,
} from '~/components/button-link'
import { getWhatsAppLink } from '~/utils/whatsapp'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Detail Transaksi' }

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request)
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

export default function TransactionDetailsPage() {
  const { transaction } = useLoaderData<{ transaction: TransactionWithUser }>()
  const [searchParams] = useSearchParams()

  return (
    <>
      <div className="min-h-full">
        <TransactionDetails transaction={transaction} user={transaction.user}>
          {/* TODO: Disable rejecting a verified transaction */}
          <TertiaryButtonLink
            to={`reject?${searchParams.toString()}`}
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
            to={`verify?${searchParams.toString()}`}
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
