import {
  ExclamationIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Transaction, User } from '@prisma/client'
import { ReactNode } from 'react'
import { Link } from 'remix'
import { TRANSACTION_STATUS } from '~/models/enum'
import { isNotEmpty } from '~/utils/assertions'
import { classNames } from '~/utils/class-names'
import { printLocaleDateTimeString, printRupiah } from '~/utils/format'
import { stripLeadingPlus } from '~/utils/misc'

const buttonClassNames =
  'disabled:opacity-80 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:cursor-not-allowed text-center inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'

function DisabledButton({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <button disabled className={classNames(buttonClassNames, className ?? '')}>
      {children}
    </button>
  )
}

export function TransactionDetails({
  transaction,
  user,
}: {
  transaction: Transaction
  user: User
}) {
  return (
    <main>
      <div className="lg:mt-0 max-w-3xl mx-auto grid grid-cols-1 gap-6 py-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2">
        <div className="relative space-y-6 lg:col-start-1 lg:col-span-2">
          <section aria-labelledby="transaction-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h1
                  id="transaction-title"
                  className="text-lg leading-6 font-medium text-gray-900"
                >
                  Detail Transaksi
                </h1>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Nama</dt>
                    <dd id="user-name" className="mt-1 text-sm text-gray-900">
                      {isNotEmpty(user.name) ? user.name : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Nomor WhatsApp
                    </dt>
                    <dd
                      id="user-phone-number"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(user.phoneNumber) ? user.phoneNumber : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Nama Bank
                    </dt>
                    <dd id="bank-name" className="mt-1 text-sm text-gray-900">
                      {isNotEmpty(transaction.bankName)
                        ? transaction.bankName
                        : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Nomor Rekening
                    </dt>
                    <dd
                      id="bank-account-number"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(transaction.bankAccountNumber)
                        ? transaction.bankAccountNumber
                        : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Nama Pemilik Rekening
                    </dt>
                    <dd
                      id="bank-account-name"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(transaction.bankAccountName)
                        ? transaction.bankAccountName
                        : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Nominal
                    </dt>
                    <dd
                      id="transaction-amount"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(transaction.amount)
                        ? printRupiah(transaction.amount)
                        : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Tanggal dan Waktu Pembayaran
                    </dt>
                    <dd
                      id="transaction-datetime"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {transaction.datetime ? (
                        <time
                          dateTime={new Date(
                            transaction.datetime
                          ).toISOString()}
                        >
                          {printLocaleDateTimeString(
                            new Date(transaction.datetime)
                          )}
                        </time>
                      ) : (
                        '-'
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Status
                    </dt>
                    <dd
                      id="transaction-datetime"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {transaction.status === TRANSACTION_STATUS.VERIFIED ? (
                        <span className="inline-flex">
                          <ShieldCheckIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                            aria-hidden="true"
                          />
                          Terverifikasi
                        </span>
                      ) : transaction.status === TRANSACTION_STATUS.REJECTED ? (
                        <span className="inline-flex">
                          <XCircleIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-red-400"
                            aria-hidden="true"
                          />
                          Ditolak
                        </span>
                      ) : (
                        <span className="inline-flex">
                          <ExclamationIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-orange-400"
                            aria-hidden="true"
                          />
                          Menunggu Verifikasi
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <div className="mt-2 flex flex-col-reverse justify-stretch space-y-2 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                  {/* TODO: Disable rejecting a verified transaction */}
                  {transaction.status !== TRANSACTION_STATUS.REJECTED ? (
                    <Link
                      to="reject"
                      replace
                      className="mr-auto w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                    >
                      Tolak Pembelian
                    </Link>
                  ) : (
                    <DisabledButton className="mr-auto">
                      Tolak Pembelian
                    </DisabledButton>
                  )}
                  {user.phoneNumber ? (
                    <a
                      href={`https://wa.me/${stripLeadingPlus(
                        user.phoneNumber
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClassNames}
                    >
                      Kontak WhatsApp
                    </a>
                  ) : (
                    <DisabledButton>Kontak WhatsApp</DisabledButton>
                  )}
                  {transaction.status !== TRANSACTION_STATUS.VERIFIED ? (
                    <Link
                      to="verify"
                      replace
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                    >
                      Verifikasi Pembelian
                    </Link>
                  ) : (
                    <DisabledButton>Verifikasi Pembelian</DisabledButton>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}