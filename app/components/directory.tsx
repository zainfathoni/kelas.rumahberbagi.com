import { CheckIcon, VideoCameraIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'
import { Link } from 'remix'
import { DirectoryProvider, useDirectory } from '~/contexts/directory'
import { classNames } from '~/utils/class-names'

export function Directory({
  children,
  label,
  currentId,
  className = '',
}: {
  children: ReactNode
  label: string
  currentId?: string
  className?: string
}) {
  return (
    <DirectoryProvider currentId={currentId}>
      <nav
        className={classNames('h-full overflow-y-auto', className)}
        aria-label={label}
      >
        {children}
      </nav>
    </DirectoryProvider>
  )
}

function Group({ children, name }: { children: ReactNode; name: string }) {
  return (
    <div className="relative">
      <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
        <h3>{name}</h3>
      </div>
      <ul className="relative z-0 divide-y divide-gray-200">{children}</ul>
    </div>
  )
}

function Item({
  to,
  name,
  description,
}: {
  to: string
  name: string
  description: string | null
}) {
  const { currentId } = useDirectory()

  return (
    <li className="bg-white group">
      <div
        className={classNames(
          currentId === to ? 'bg-gray-100' : '',
          'relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500'
        )}
      >
        <div className="flex-shrink-0">
          <span
            className={classNames(
              currentId === to
                ? 'bg-indigo-600'
                : 'bg-indigo-200 group-hover:bg-indigo-400',
              'h-8 w-8 rounded-full flex items-center justify-center'
            )}
          >
            {currentId === to ? (
              <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
            ) : (
              <VideoCameraIcon
                className="h-5 w-5 text-white"
                aria-hidden="true"
              />
            )}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <Link to={to} className="focus:outline-none">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500 truncate">{description}</p>
          </Link>
        </div>
      </div>
    </li>
  )
}

Directory.Group = Group
Directory.Item = Item
