import { redirect, Outlet, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { getFirstTransaction, TransactionWithUser } from '~/models/transaction'
import { requireUpdatedUser } from '~/services/auth.server'
import { TransactionDetails } from '~/components/transaction-details'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)

  const transaction = await getFirstTransaction(user.id)
  if (!transaction) {
    return redirect('/dashboard/purchase')
  }

  return { transaction }
}

export default function Verify() {
  const { transaction } = useLoaderData<{ transaction: TransactionWithUser }>()
  return (
    <>
      {/* TODO: Render action buttons conditionally */}
      <TransactionDetails transaction={transaction} />
      <Outlet />
    </>
  )
}
