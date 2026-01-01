import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  HomeIcon,
  CashIcon,
  LogoutIcon,
  XIcon,
  MenuIcon,
  ServerIcon,
  AcademicCapIcon,
  VideoCameraIcon,
} from '@heroicons/react/outline'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useMatches,
  useSearchParams,
} from '@remix-run/react'
import { UserCircleIcon } from '@heroicons/react/solid'
import { Course } from '@prisma/client'
import { requireUpdatedUser } from '~/services/auth.server'
import { LogoWithText } from '~/components/logo'
import { requireActiveSubscription, requireAuthor } from '~/utils/permissions'
import { Breadcrumbs } from '~/components/breadcrumbs'
import { Serialized, SideNavigationItem } from '~/utils/types'
import { UserWithSubscriptions } from '~/models/user'
import { getFirstCourse } from '~/models/course'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  return json({ user, course })
}

const navigation: SideNavigationItem[] = [
  { name: 'Beranda', href: '/dashboard/', icon: HomeIcon },
  {
    name: 'Pembelian',
    href: '/dashboard/purchase',
    icon: CashIcon,
  },
  {
    name: 'Transaksi',
    href: '/dashboard/transactions?status=submitted',
    icon: ServerIcon,
    permission: requireAuthor,
  },
  {
    name: 'Kelas',
    href: '/dashboard/course',
    icon: VideoCameraIcon,
    permission: requireActiveSubscription,
  },
  { name: 'Tentang Kelas', href: '/', icon: AcademicCapIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const matches = useMatches()
  const currentPathname = matches[2]?.pathname
  const [searchParams] = useSearchParams()
  const { user, course } = useLoaderData<{
    user: Serialized<UserWithSubscriptions>
    course: Serialized<Course>
  }>()

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <LogoWithText />
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => {
                      if (item.permission && !item.permission(user, course)) {
                        return null
                      }
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.href.split('?')[0] === currentPathname
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon
                            className={classNames(
                              item.href.split('?')[0] === currentPathname
                                ? 'text-gray-500'
                                : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
                <div className="shrink-0 flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                  <Form action="/logout" method="post">
                    <button
                      type="submit"
                      className="group border-l-4 border-transparent py-2 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <LogoutIcon
                        className="text-gray-400 group-hover:text-gray-500 mr-4 shrink-0 h-6 w-6"
                        aria-hidden="true"
                      />
                      Keluar
                    </button>
                  </Form>
                </div>
                <div className="shrink-0 flex border-t border-gray-200 p-4">
                  <Link
                    to="/dashboard/profile"
                    className="shrink-0 group block"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center">
                      <div>
                        <UserCircleIcon
                          className="h-10 w-10 text-gray-500"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          View profile
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </Transition.Child>
            <div className="shrink-0 w-14">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <LogoWithText />
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  if (item.permission && !item.permission(user, course)) {
                    return null
                  }
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.href.split('?')[0] === currentPathname
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={classNames(
                          item.href.split('?')[0] === currentPathname
                            ? 'text-gray-500'
                            : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="group shrink-0 flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="group border-l-4 border-transparent py-2 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogoutIcon
                    className="text-gray-400 group-hover:text-gray-500 mr-4 shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  Keluar
                </button>
              </Form>
            </div>
            <div className="shrink-0 flex border-t border-gray-200 p-4">
              <Link
                to="/dashboard/profile"
                className="shrink-0 w-full group block"
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center">
                  <div>
                    <UserCircleIcon
                      className="h-10 w-10 text-gray-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:pl-64 flex flex-col h-screen">
          <div className="sticky top-0 z-20 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-2 bg-white">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Breadcrumbs
              matches={matches}
              searchParams={searchParams}
              className="-translate-y-1"
            />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  )
}
