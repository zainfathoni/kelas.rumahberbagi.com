import {
  ExclamationIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import {
  PrimaryButtonLink,
  SecondaryButtonLink,
  TertiaryButtonLink,
} from './button-link'
import { TRANSACTION_STATUS } from '~/models/enum'
import { isNotEmpty } from '~/utils/assertions'
import { printLocaleDateTimeString, printRupiah } from '~/utils/format'
import { stripLeadingPlus } from '~/utils/misc'
import { TransactionWithUser } from '~/models/transaction'

export function TransactionDetails({
  transaction,
}: {
  transaction: TransactionWithUser
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
                      {isNotEmpty(transaction.user.name)
                        ? transaction.user.name
                        : '-'}
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
                      {isNotEmpty(transaction.user.phoneNumber)
                        ? transaction.user.phoneNumber
                        : '-'}
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
                  <TertiaryButtonLink
                    to="reject"
                    replace
                    disabled={
                      transaction.status === TRANSACTION_STATUS.REJECTED
                    }
                  >
                    Tolak Pembelian
                  </TertiaryButtonLink>
                  <SecondaryButtonLink
                    to={`https://wa.me/${stripLeadingPlus(
                      transaction.user.phoneNumber
                    )}`}
                    external
                    disabled={!transaction.user.phoneNumber}
                  >
                    Kontak WhatsApp
                  </SecondaryButtonLink>
                  <PrimaryButtonLink
                    to="verify"
                    replace
                    disabled={
                      transaction.status === TRANSACTION_STATUS.VERIFIED
                    }
                  >
                    Verifikasi Pembelian
                  </PrimaryButtonLink>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
