/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import type { Params } from '@remix-run/react'
import { Link } from '@remix-run/react'
import { classNames } from '~/utils/class-names'
import { Handle } from '~/utils/types'

function BreadcrumbItem({
  name,
  to,
  current,
}: {
  name: string
  to: string
  current?: boolean
}) {
  return (
    <li key={name}>
      <div className="flex items-center">
        <ChevronRightIcon
          className="flex-shrink-0 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <Link
          to={to}
          className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
          aria-current={current ? 'page' : undefined}
        >
          {name}
        </Link>
      </div>
    </li>
  )
}

export type Matches = {
  id: string
  pathname: string
  params: Params<string>
  data: unknown
  handle: Handle
}[]

export function Breadcrumbs({
  matches,
  searchParams,
  className,
}: {
  matches: Matches
  searchParams: URLSearchParams
  className?: string
}) {
  return (
    <nav
      className={classNames('inline-flex', className ?? '')}
      aria-label="Breadcrumbs"
    >
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </div>
        </li>
        {matches.map(
          ({ pathname, handle }: { pathname: string; handle: Handle }, index) =>
            handle?.name ? (
              <BreadcrumbItem
                key={handle.name}
                name={handle.name}
                to={`${pathname}?${searchParams.toString()}`}
                current={index === matches.length - 1}
              />
            ) : null
        )}
      </ol>
    </nav>
  )
}
