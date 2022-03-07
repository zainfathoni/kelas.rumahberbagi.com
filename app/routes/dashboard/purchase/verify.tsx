import { redirect, Outlet, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Transaction, User } from '@prisma/client'
import { getFirstTransaction } from '~/models/transaction'
import { requireUser } from '~/services/auth.server'
import { TransactionDetails } from '~/components/transaction-details'
import {
  PrimaryButtonLink,
  SecondaryButtonLink,
} from '~/components/button-link'
import { TRANSACTION_STATUS } from '~/models/enum'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Menunggu Verifikasi' }

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)

  const transaction = await getFirstTransaction(user.id)
  if (!transaction) {
    return redirect('/dashboard/purchase')
  }

  if (transaction.status === TRANSACTION_STATUS.VERIFIED) {
    return redirect('/dashboard/purchase/completed')
  }

  return { transaction, user }
}

export default function Verify() {
  const { transaction, user } =
    useLoaderData<{ transaction: Transaction; user: User }>()
  return (
    <>
      {/* TODO: Render action buttons conditionally */}
      <TransactionDetails transaction={transaction} user={user}>
        <SecondaryButtonLink
          to="/dashboard/purchase/confirm"
          disabled={transaction.status === TRANSACTION_STATUS.VERIFIED}
        >
          Ubah Detail Transaksi
        </SecondaryButtonLink>
        <PrimaryButtonLink
          to={transaction.id}
          replace
          disabled={transaction.status === TRANSACTION_STATUS.VERIFIED}
        >
          Verifikasi Pembelian
        </PrimaryButtonLink>
      </TransactionDetails>
      <Outlet />
    </>
  )
}
