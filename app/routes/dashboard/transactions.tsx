import { json, redirect, useLoaderData, Outlet, Link, useMatches } from 'remix'
import type { LoaderFunction } from 'remix'
import { useSearchParams } from 'react-router-dom'
import { ArrowNarrowLeftIcon } from '@heroicons/react/solid'
import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'
import { getFirstCourse } from '~/models/course'
import {
  AllTransactionsCount,
  countAllTransactions,
} from '~/models/transaction'
import { requireUser } from '~/services/auth.server'
import { requireCourseAuthor } from '~/utils/permissions'
import { classNames } from '~/utils/class-names'
import { getPagesCount } from '~/utils/pagination'
import { PageLink } from '~/components/page-link'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Transaksi' }

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard')
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

  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status')
  const page = searchParams.get('page')

  const isCurrentTab = ({ params }: { params: string }) =>
    status ? params === status : params === ''

  const matches = useMatches()
  const isDetails = Boolean(matches[3].params.transactionId)
  if (isDetails) return <Outlet />

  let currentCount = total
  switch (status) {
    case 'submitted':
      currentCount = submitted
      break
    case 'verified':
      currentCount = verified
      break
    case 'rejected':
      currentCount = rejected
      break
  }

  const isCurrentPage = (i: number) => (page ? parseInt(page) === i : i === 1)
  const pagesCount = getPagesCount(currentCount)

  const pages: ReactNode[] = []
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(
      <PageLink
        key={i}
        to={`?${
          status
            ? new URLSearchParams({ status, page: i.toString() }).toString()
            : new URLSearchParams({ page: i.toString() }).toString()
        }`}
        isCurrentPage={isCurrentPage(i)}
      >
        {i}
      </PageLink>
    )
  }

  return (
    <main className="bg-white shadow sm:rounded-lg max-w-7xl sm:px-6 lg:px-8 py-6 mt-4 mx-4 sm:mx-6 md:mx-8 ">
      <div className="px-4 sm:px-0">
        <h2 className="text-lg font-medium text-gray-900">Transaksi</h2>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="mt-4 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            defaultValue={tabs.find(isCurrentTab)?.params}
            onChange={(e) => setSearchParams({ status: e.target.value })}
          >
            {tabs.map((tab) => (
              <option key={tab.name} value={tab.params}>
                {tab.name}
              </option>
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
                        'hidden ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium sm:inline-block'
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
        <nav
          className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0"
          aria-label="Pagination"
        >
          <div className="-mt-px w-0 flex-1 flex">
            <PageLink
              to={`?${status ? `status=${status}&` : ''}${
                page ? `page=${parseInt(page) - 1}` : 1
              }`}
              isCurrentPage={isCurrentPage(1)}
              disableOnCurrentPage
            >
              <ArrowNarrowLeftIcon
                className={classNames(
                  'mr-3 h-5 w-5',
                  isCurrentPage(1)
                    ? 'text-gray-300'
                    : 'text-gray-400 hover:text-gray-700'
                )}
                aria-hidden="true"
              />
              Prev
            </PageLink>
          </div>
          <div className="hidden md:-mt-px md:flex">{pages}</div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <PageLink
              to={`?${status ? `status=${status}&` : ''}${
                page ? `page=${parseInt(page) + 1}` : 1
              }`}
              isCurrentPage={isCurrentPage(pagesCount)}
              disableOnCurrentPage
            >
              Next
              <ArrowNarrowRightIcon
                className={classNames(
                  'ml-3 h-5 w-5',
                  isCurrentPage(1)
                    ? 'text-gray-300'
                    : 'text-gray-400 hover:text-gray-700'
                )}
                aria-hidden="true"
              />
            </PageLink>
          </div>
        </nav>
      </div>
    </main>
  )
}
