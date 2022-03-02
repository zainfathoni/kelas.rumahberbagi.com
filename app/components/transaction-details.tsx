import {
  ExclamationIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Transaction, User } from '@prisma/client'
import { ReactNode } from 'react'
import { TRANSACTION_STATUS } from '~/models/enum'
import { isNotEmpty } from '~/utils/assertions'
import { printLocaleDateTimeString, printRupiah } from '~/utils/format'

export function TransactionDetails({
  transaction,
  user,
  children,
}: {
  transaction: Transaction
  user: User
  children: ReactNode
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
                  Detail Pengguna dan Transaksi
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
                      Username Telegram
                    </dt>
                    <dd
                      id="user-phone-number"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(user.telegram) ? user.telegram : '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Username Instagram
                    </dt>
                    <dd
                      id="user-phone-number"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {isNotEmpty(user.instagram) ? user.instagram : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
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
                      Tanggal Konfirmasi
                    </dt>
                    <dd
                      id="transaction-updatedAt"
                      className="mt-1 text-sm text-gray-900"
                    >
                      {transaction.updatedAt ? (
                        <time
                          dateTime={new Date(
                            transaction.updatedAt
                          ).toISOString()}
                        >
                          {printLocaleDateTimeString(
                            new Date(transaction.updatedAt)
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
                      id="transaction-status"
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
                  {children}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
