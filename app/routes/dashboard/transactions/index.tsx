import { json, redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { useSearchParams } from 'react-router-dom'
import { Transaction } from '@prisma/client'
import { getFirstCourse } from '~/models/course'
import { getAllTransactions } from '~/models/transaction'
import { requireUser } from '~/services/auth.server'
import { requireCourseAuthor } from '~/utils/permissions'
import { TransactionItem } from '~/components/transaction-item'
import type { TransactionStatus } from '~/models/enum'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard')
  }

  const url = new URL(request.url)
  const status = url.searchParams.get('status')
  const page = url.searchParams.get('page')

  const transactions = await getAllTransactions({
    status: status ? (status.toUpperCase() as TransactionStatus) : undefined,
    page: page ? parseInt(page) : undefined,
  })

  return json({ transactions })
}

export default function TransactionsList() {
  const { transactions } = useLoaderData<{
    transactions: Transaction[]
  }>()
  const [searchParams] = useSearchParams()
  console.log(searchParams)

  return (
    <ul className="mt-5 border-t border-gray-200 divide-y divide-gray-200 sm:mt-0 sm:border-t-0">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          to={`${transaction.id}?${searchParams.toString()}`}
          bankAccountName={transaction.bankAccountName}
          bankName={transaction.bankName}
          updatedAt={transaction.updatedAt}
          bankAccountNumber={transaction.bankAccountNumber}
          status={transaction.status as TransactionStatus}
        />
      ))}
    </ul>
  )
}
