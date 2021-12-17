import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  BellIcon,
  BriefcaseIcon,
  ChatIcon,
  CogIcon,
  DocumentSearchIcon,
  HomeIcon,
  MenuAlt2Icon,
  LogoutIcon,
  UsersIcon,
  XIcon,
} from '@heroicons/react/outline'
import { SearchIcon } from '@heroicons/react/solid'

import type { User } from '@prisma/client'
import { ActionFunction, LoaderFunction, redirect, useActionData, useTransition } from 'remix'
import { Form, json, useLoaderData } from 'remix'
import { auth } from '~/services/auth.server'
import { LogoWithText } from '~/components/logo'
import { Field } from '~/components/form-elements'
import { validatePhoneNumber, validateRequired } from '~/utils/validators'
import { db } from '~/utils/db.server'
import { getUser } from '~/models/user'
import { logout } from '~/services/session.server'

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is here, it's already authenticated, if not redirect them to
  // the login page.
  let { id } = await auth.isAuthenticated(request, { failureRedirect: '/login' })

  // Get the user data from the database.
  let user = await getUser(id)
  if (!user) {
    return logout(request)
  }
  return json({ user })
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    phoneNumber: string | undefined
    instagram: string | undefined
    telegram: string | undefined
  }
  fields?: {
    name: string
    phoneNumber: string
    instagram: string
    telegram: string
  }
}

export let action: ActionFunction = async ({ request }) => {
  let user = await auth.isAuthenticated(request, { failureRedirect: '/login' })

  let form = await request.formData()
  let name = form.get('name')
  let phoneNumber = form.get('phoneNumber')
  let instagram = form.get('instagram')
  let telegram = form.get('telegram')
  // TODO: Use `zod` instead
  if (
    typeof name !== 'string' ||
    typeof phoneNumber !== 'string' ||
    typeof instagram !== 'string' ||
    typeof telegram !== 'string'
  ) {
    return { formError: 'Form not submitted correctly.' }
  }

  let fieldErrors = {
    name: validateRequired('Nama Lengkap', name),
    phoneNumber: validatePhoneNumber('Nomor WhatsApp', phoneNumber),
  }
  let fields = { name, phoneNumber, instagram, telegram }
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }

  await db.user.update({ where: { id: user.id }, data: fields })

  return redirect('/dashboard')
}

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: false },
  { name: 'Jobs', href: '#', icon: BriefcaseIcon, current: false },
  { name: 'Applications', href: '#', icon: DocumentSearchIcon, current: false },
  { name: 'Messages', href: '#', icon: ChatIcon, current: false },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Settings', href: '#', icon: CogIcon, current: true },
]
const tabs = [
  { name: 'General', href: '#', current: true },
  { name: 'Password', href: '#', current: false },
  { name: 'Notifications', href: '#', current: false },
  { name: 'Plan', href: '#', current: false },
  { name: 'Billing', href: '#', current: false },
  { name: 'Team Members', href: '#', current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  let { user } = useLoaderData<{ user: User }>()
  let actionData = useActionData<ActionData>()

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-40 flex md:hidden" onClose={setSidebarOpen}>
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
              <div className="relative max-w-xs w-full bg-white pt-5 pb-4 flex-1 flex flex-col">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-14 p-1">
                    <button
                      type="button"
                      className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:bg-gray-600"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      <span className="sr-only">Close sidebar</span>
                    </button>
                  </div>
                </Transition.Child>
                <LogoWithText />
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                  <nav className="h-full flex flex-col">
                    <div className="space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-purple-50 border-purple-600 text-purple-600'
                              : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group border-l-4 py-2 px-3 flex items-center text-base font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500',
                              'mr-4 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="mt-auto pt-10 space-y-1">
                      <Form action="/logout" method="post">
                        <button
                          type="submit"
                          className="group border-l-4 border-transparent py-2 px-3 flex items-center text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <LogoutIcon
                            className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          Keluar
                        </button>
                      </Form>
                    </div>
                  </nav>
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <nav className="bg-gray-50 border-r border-gray-200 pt-5 pb-4 flex flex-col flex-grow overflow-y-auto">
            <LogoWithText />
            <div className="flex-grow mt-5">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'bg-purple-50 border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                      'group border-l-4 py-2 px-3 flex items-center text-sm font-medium'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 block w-full">
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="group border-l-4 border-transparent py-2 px-3 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogoutIcon className="text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6" aria-hidden="true" />
                  Keluar
                </button>
              </Form>
            </div>
          </nav>
        </div>

        {/* Content area */}
        <div className="md:pl-64">
          <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">
            <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 flex">
              <button
                type="button"
                className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-1 flex justify-between px-4 md:px-0">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="mobile-search-field" className="sr-only">
                      Search
                    </label>
                    <label htmlFor="desktop-search-field" className="sr-only">
                      Search
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      </div>
                      <input
                        name="mobile-search-field"
                        id="mobile-search-field"
                        className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                        placeholder="Search"
                        type="search"
                      />
                      <input
                        name="desktop-search-field"
                        id="desktop-search-field"
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search jobs, applicants, and more"
                        type="search"
                      />
                    </div>
                  </form>
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <button
                    type="button"
                    className="bg-white rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                    <span className="sr-only">View notifications</span>
                  </button>
                </div>
              </div>
            </div>

            <main className="flex-1">
              <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
                <div className="pt-10 pb-16">
                  <div className="px-4 sm:px-6 md:px-0">
                    <h1 className="text-3xl font-extrabold text-gray-900">Settings</h1>
                  </div>
                  <div className="px-4 sm:px-6 md:px-0">
                    <div className="py-6">
                      {/* Tabs */}
                      <div className="lg:hidden">
                        <label htmlFor="selected-tab" className="sr-only">
                          Select a tab
                        </label>
                        <select
                          id="selected-tab"
                          name="selected-tab"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                          defaultValue={tabs.find((tab) => tab.current)?.name}
                        >
                          {tabs.map((tab) => (
                            <option key={tab.name}>{tab.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="hidden lg:block">
                        <div className="border-b border-gray-200">
                          <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => (
                              <a
                                key={tab.name}
                                href={tab.href}
                                className={classNames(
                                  tab.current
                                    ? 'border-purple-500 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                                )}
                              >
                                {tab.name}
                              </a>
                            ))}
                          </nav>
                        </div>
                      </div>
                    </div>

                    {/* Description list with inline editing */}
                    <div className="mt-10 sm:mt-0">
                      <div className="md:grid md:grid-cols-3 md:gap-6">
                        <div className="md:col-span-1">
                          <div className="px-4 sm:px-0">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Data Diri</h3>
                            <p className="mt-1 text-sm text-gray-600">Untuk keperluan proses administrasi akun Anda.</p>
                          </div>
                        </div>
                        <div className="mt-5 md:mt-0 md:col-span-2">
                          <Form action="/dashboard" method="post">
                            <div className="shadow overflow-hidden sm:rounded-md">
                              <div className="px-4 py-5 bg-white sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                  <Field
                                    className="col-span-6"
                                    name="name"
                                    label="Nama Lengkap"
                                    placeholder="Cantumkan nama lengkap Anda"
                                    defaultValue={user.name ?? ''}
                                    autoComplete="name"
                                    autoCapitalize="words"
                                    required
                                    aria-invalid={user.name ? 'false' : 'true'}
                                  />
                                  <Field
                                    className="col-span-6 lg:col-span-3"
                                    name="email"
                                    label="Alamat Email"
                                    placeholder="alamat.email@gmail.com"
                                    defaultValue={user.email}
                                    readOnly
                                    autoComplete="tel"
                                  />
                                  <Field
                                    className="col-span-6 lg:col-span-3"
                                    name="phoneNumber"
                                    label="Nomor WhatsApp"
                                    placeholder="+6281234567890"
                                    defaultValue={actionData?.fields?.phoneNumber ?? user.phoneNumber ?? ''}
                                    error={actionData?.fieldErrors?.phoneNumber}
                                    validator={validatePhoneNumber}
                                    required
                                    autoComplete="tel"
                                  />
                                  <Field
                                    className="col-span-6 lg:col-span-3"
                                    name="telegram"
                                    label="Username Telegram"
                                    placeholder="@username"
                                    defaultValue={user.telegram ?? ''}
                                    autoComplete="nickname"
                                  />
                                  <Field
                                    className="col-span-6 lg:col-span-3"
                                    name="instagram"
                                    label="Username Instagram"
                                    placeholder="@user.name"
                                    defaultValue={user.instagram ?? ''}
                                    autoComplete="nickname"
                                  />
                                </div>
                              </div>
                              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button
                                  type="submit"
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
