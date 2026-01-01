import type { LinksFunction } from '@remix-run/node'
import {
  Form,
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteError,
} from '@remix-run/react'

import { XCircleIcon } from '@heroicons/react/solid'
import styles from './tailwind.css'
import fonts from './fonts.css'
import { Footer } from './components/footer'
import { Header } from '~/components/header'

// https://remix.run/api/app#links
export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'stylesheet', href: fonts },
    { rel: 'icon', href: '/rumah-berbagi.jpeg' },
  ]
}

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

// https://remix.run/docs/en/v2/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError()

  // Handle route error responses (formerly CatchBoundary)
  if (isRouteErrorResponse(error)) {
    let message
    switch (error.status) {
      case 401:
        message = (
          <p>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </p>
        )
        break
      case 404:
        message = (
          <p>Oops! Looks like you tried to visit a page that does not exist.</p>
        )
        break
      default:
        message = <p>{error.data || error.statusText}</p>
    }

    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <Layout>
          <h1>
            {error.status}: {error.statusText}
          </h1>
          {message}
        </Layout>
      </Document>
    )
  }

  // Handle thrown errors
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  console.error(error)

  return (
    <Document title="Error!">
      <Layout>
        <Header />
        <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
          <main className="grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-md bg-red-50 p-4 my-4">
              <div className="flex">
                <div className="shrink-0">
                  <XCircleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </h3>
                </div>
              </div>
            </div>
            <div className="py-16">
              <div className="text-center">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                  Error 500
                </p>
                <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Terjadi kesalahan
                </h1>
                <p className="mt-2 text-base text-gray-500">
                  Silakan coba masuk kembali.
                </p>
                <div className="mt-6">
                  <Form action="/logout" method="post">
                    <input type="hidden" name="redirectTo" value="/login" />
                    <button
                      type="submit"
                      className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Kembali ke beranda<span aria-hidden="true"> &rarr;</span>
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer instagramUrl="https://instagram.com/vika.riandini" />
      </Layout>
    </Document>
  )
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  const matches = useMatches()
  const authenticated = matches.find(
    ({ pathname }) => pathname === '/dashboard'
  )

  return (
    <div className="remix-app">
      {authenticated ? null : <Header />}
      <main>{children}</main>
      {authenticated ? null : (
        <Footer instagramUrl="https://instagram.com/vika.riandini" />
      )}
    </div>
  )
}
