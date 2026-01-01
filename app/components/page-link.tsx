import { ReactNode } from 'react'
import { Link } from '@remix-run/react'
import { classNames } from '~/utils/class-names'

export function PageLink({
  to,
  isCurrentPage,
  disableOnCurrentPage,
  children,
}: {
  to: string
  isCurrentPage: boolean
  disableOnCurrentPage?: boolean
  children: ReactNode
}) {
  const className = classNames(
    'border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium',
    isCurrentPage
      ? 'border-purple-500 text-purple-600 disabled:cursor-not-allowed'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
    disableOnCurrentPage ? 'disabled:text-gray-400 disabled:border-hidden' : ''
  )
  if (isCurrentPage) {
    return (
      <button disabled className={className}>
        {children}
      </button>
    )
  } else {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }
}
