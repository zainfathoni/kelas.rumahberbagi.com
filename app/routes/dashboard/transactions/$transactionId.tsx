/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-redundant-roles */
import { Fragment } from 'react'
import { ROLES } from '~/models/enum'
import { isEmpty } from '~/utils/assertions'

const user = {
  name: 'Whitney Francis',
  email: 'whitney@example.com',
  phoneNumber: '6285711453538',
  telegram: 'whitneyf',
  instagram: 'whitney.f',
  role: ROLES.MEMBER,
}

export default function TransactionDetails() {
  return (
    <>
      <div className="min-h-full">
        <main className="py-10">
          {/* Page header */}
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
            <div className="flex items-center space-x-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
              <a
                href={`https://wa.me/${user.phoneNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                Kontak Whatsapp
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              >
                Verifikasi Pembelian
              </button>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              <section aria-labelledby="user-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="user-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      User Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Email address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {isEmpty(user.email) ? user.email : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {isEmpty(user.phoneNumber) ? user.phoneNumber : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Telegram
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {isEmpty(user.telegram) ? user.telegram : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Instagram
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {isEmpty(user.instagram) ? user.instagram : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Role
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {user.role ?? '-'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
