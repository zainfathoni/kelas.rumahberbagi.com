import { redirect, Outlet, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Transaction, User } from '@prisma/client'
import { getFirstTransaction } from '~/models/transaction'
import { requireUpdatedUser } from '~/services/auth.server'
import { TransactionDetails } from '~/components/transaction-details'
import { SecondaryButtonLink } from '~/components/button-link'
import { TRANSACTION_STATUS } from '~/models/enum'
import { getWhatsAppLink } from '~/utils/whatsapp'
import { getUser } from '~/models/user'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)

  const transaction = await getFirstTransaction(user.id)
  if (!transaction) {
    return redirect('/dashboard/purchase')
  }

  if (transaction.status !== TRANSACTION_STATUS.VERIFIED) {
    return redirect('/dashboard/purchase/verify')
  }

  const author = await getUser(transaction.authorId)
  if (!author) {
    throw new Response('Author not found', {
      status: 404,
    })
  }

  return { transaction, user, authorPhoneNumber: author.phoneNumber }
}

export default function Completed() {
  const { transaction, user, authorPhoneNumber } = useLoaderData<{
    transaction: Transaction
    user: User
    authorPhoneNumber: string | null
  }>()
  return (
    <>
      {/* TODO: Render action buttons conditionally */}
      <TransactionDetails transaction={transaction} user={user}>
        <SecondaryButtonLink to={getWhatsAppLink(authorPhoneNumber)} external>
          Kontak Admin
        </SecondaryButtonLink>
      </TransactionDetails>
      <Outlet />
    </>
  )
}
