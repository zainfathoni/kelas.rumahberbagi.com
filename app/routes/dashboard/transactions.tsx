import { json, redirect, useLoaderData, Outlet, Link, useMatches } from 'remix'
import type { LoaderFunction } from 'remix'
import { useSearchParams } from 'react-router-dom'
import { getFirstCourse } from '~/models/course'
import {
  AllTransactionsCount,
  countAllTransactions,
} from '~/models/transaction'
import { requireUpdatedUser } from '~/services/auth.server'
import { requireCourseAuthor } from '~/utils/permissions'
import { classNames } from '~/utils/class-names'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/home')
  }

  const count = await countAllTransactions()

  return json({ count })
}

export default function TransactionsList() {
  const {
    count: { total, submitted, verified, rejected },
  } = useLoaderData<{
    count: AllTransactionsCount
  }>()

  const tabs = [
    {
      name: 'Semua',
      params: '',
      count: total,
    },
    {
      name: 'Menunggu Verifikasi',
      params: 'submitted',
      count: submitted,
    },
    {
      name: 'Terverifikasi',
      params: 'verified',
      count: verified,
    },
    {
      name: 'Ditolak',
      params: 'rejected',
      count: rejected,
    },
  ]

  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')

  const isCurrentTab = ({ params }: { params: string }) =>
    status ? params === status : params === ''

  const matches = useMatches()
  const isDetails = Boolean(matches[3].params.transactionId)
  if (isDetails) return <Outlet />

  return (
    <main className="bg-white shadow sm:rounded-lg max-w-7xl mx-auto sm:px-6 lg:px-8 py-6 mt-4">
      <div className="px-4 sm:px-0">
        <h2 className="text-lg font-medium text-gray-900">Transactions</h2>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            defaultValue={tabs.find(isCurrentTab)?.name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="mt-2 -mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.params ? `?status=${tab.params}` : ''}
                  className={classNames(
                    isCurrentTab(tab)
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  )}
                >
                  {tab.name}
                  {tab.count ? (
                    <span
                      className={classNames(
                        isCurrentTab(tab)
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-900',
                        'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <Outlet />
      </div>
    </main>
  )
}
