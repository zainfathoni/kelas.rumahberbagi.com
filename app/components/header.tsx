import { Link } from '@remix-run/react'

export function Header() {
  return (
    <header>
      <div className="relative bg-white">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 space-x-10 lg:px-8">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link prefetch="intent" to="/">
              <span className="sr-only">Rumah Berbagi</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="/rumah-berbagi.svg"
                alt="Rumah Berbagi"
                height={32}
                width={32}
              />
            </Link>
          </div>
          <nav className="flex space-x-10">
            <a
              href="https://rumahberbagi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Blog
            </a>
          </nav>
          <div className="flex items-center justify-end flex-1 lg:w-0">
            <Link
              prefetch="intent"
              to="/login"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
