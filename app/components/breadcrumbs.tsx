/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import { ReactNode } from 'react'
import { Link } from 'remix'

export function BreadcrumbItem({
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

export function Breadcrumbs({ children }: { children: ReactNode }) {
  return (
    <nav className="inline-flex" aria-label="Breadcrumbs">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </div>
        </li>
        {children}
      </ol>
    </nav>
  )
}
