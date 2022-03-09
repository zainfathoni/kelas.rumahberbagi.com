import { json, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { PencilAltIcon, UserCircleIcon } from '@heroicons/react/solid'
import { User } from '@prisma/client'
import { requireUpdatedUser } from '~/services/auth.server'
import { ButtonLink } from '~/components/button-link'

const tabs = [{ name: 'Profil', href: '#', current: true }]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)

  return json({ user })
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function ProfileIndex() {
  const { user } = useLoaderData<{ user: User }>()
  return (
    <div className="py-4">
      <div>
        {/* Cek */}
        <main>
          <article>
            {/* Profile header */}
            <div>
              <div>
                <img
                  className="h-32 w-full object-cover lg:h-48"
                  src="/images/planner-preview.jpeg"
                  alt=""
                />
              </div>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                  <div className="flex">
                    <UserCircleIcon
                      className="inline-flex items-center justify-center rounded-full h-24 w-24 sm:h-32 sm:w-32 text-gray-500 bg-white"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                    <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {user.name}
                      </h1>
                    </div>
                    <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <ButtonLink to="/dashboard/profile/edit">
                        <PencilAltIcon
                          className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        Ubah
                      </ButtonLink>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {user.name}
                  </h1>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 sm:mt-2 2xl:mt-5">
              <div className="border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <a
                        key={tab.name}
                        href={tab.href}
                        className={classNames(
                          tab.current
                            ? 'border-pink-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                        )}
                        aria-current={tab.current ? 'page' : undefined}
                      >
                        {tab.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Description list */}
            <div className="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.phoneNumber}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Telegram
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.telegram ?? '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Instagram
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.instagram ?? '-'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.role}</dd>
                </div>
              </dl>
            </div>
          </article>
        </main>
      </div>
    </div>
  )
}
