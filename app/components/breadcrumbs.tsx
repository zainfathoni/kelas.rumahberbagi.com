/* This example requires Tailwind CSS v2.0+ */
import { HomeIcon } from '@heroicons/react/solid'
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
    <li key={name} className="flex">
      <div className="flex items-center">
        <svg
          className="flex-shrink-0 w-6 h-full text-gray-200"
          viewBox="0 0 24 44"
          preserveAspectRatio="none"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
        </svg>
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
    <nav className="flex" aria-label="Breadcrumbs">
      <ol className="bg-white rounded-md shadow px-6 flex space-x-4">
        <li className="flex">
          <div className="flex items-center">
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
