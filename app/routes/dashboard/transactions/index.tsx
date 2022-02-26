import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Transaction } from '@prisma/client'
import { getFirstCourse } from '~/models/course'
import { getAllTransactions } from '~/models/transaction'
import { requireUpdatedUser } from '~/services/auth.server'
import { requireCourseAuthor } from '~/utils/permissions'
import { TransactionItem } from '~/components/transaction-item'
import type { TransactionStatus } from '~/models/enum'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/home')
  }

  const transactions = await getAllTransactions()

  return json({ transactions })
}

export default function TransactionsList() {
  const { transactions } = useLoaderData<{
    transactions: Transaction[]
  }>()

  return (
    <main className="bg-white shadow sm:rounded-lg max-w-7xl mx-auto sm:px-6 lg:px-8">
      <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transactionId={transaction.id}
            bankAccountName={transaction.bankAccountName}
            bankName={transaction.bankName}
            dateTime={transaction.datetime}
            bankAccountNumber={transaction.bankAccountNumber}
            status={transaction.status as TransactionStatus}
          />
        ))}
      </ul>
    </main>
  )
}
