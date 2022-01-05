import { redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Transaction, User } from '@prisma/client'
import { isEmpty } from '~/utils/assertions'
import { getTransactionDetails } from '~/models/transaction'
import { printRupiah } from '~/utils/locales'

export const loader: LoaderFunction = async ({ params }) => {
  const { transactionId } = params

  if (!transactionId) {
    return redirect('/dashboard/transactions')
  }

  const transaction = await getTransactionDetails(transactionId)

  if (!transaction) {
    return redirect('/dashboard/transactions')
  }

  return transaction
}

export default function TransactionDetails() {
  const transactionDetails: Transaction & { user: User } = useLoaderData()

  let kontakWhatsappButton: JSX.Element
  if (!transactionDetails.user.phoneNumber) {
    kontakWhatsappButton = (
      <button
        id="contact-whatsapp"
        disabled
        className="disabled:opacity-80 disabled:bg-gray-100 disabled:text-gray-500 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        Kontak Whatsapp
      </button>
    )
  } else {
    kontakWhatsappButton = (
      <a
        id="contact-whatsapp"
        href={`https://wa.me/${transactionDetails.user.phoneNumber}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
      >
        Kontak Whatsapp
      </a>
    )
  }

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="lg:mt-0 max-w-3xl mx-auto grid grid-cols-1 gap-6 py-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="relative space-y-6 lg:col-start-1 lg:col-span-2">
              <section aria-labelledby="user-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h1
                      id="user-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Transaction Details
                    </h1>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Nama
                        </dt>
                        <dd
                          id="user-name"
                          className="mt-1 text-sm text-gray-900"
                        >
                          {isEmpty(transactionDetails.user.name)
                            ? transactionDetails.user.name
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
                          {isEmpty(transactionDetails.user.phoneNumber)
                            ? transactionDetails.user.phoneNumber
                            : '-'}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Nama Bank
                        </dt>
                        <dd
                          id="bank-name"
                          className="mt-1 text-sm text-gray-900"
                        >
                          {isEmpty(transactionDetails.bankName)
                            ? transactionDetails.bankName
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
                          {isEmpty(transactionDetails.bankAccountNumber)
                            ? transactionDetails.bankAccountNumber
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
                          {isEmpty(transactionDetails.bankAccountName)
                            ? transactionDetails.bankAccountName
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
                          {isEmpty(transactionDetails.amount)
                            ? printRupiah(transactionDetails.amount)
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
                          {transactionDetails.createdAt
                            ? new Date(
                                transactionDetails.createdAt
                              ).toLocaleString('id')
                            : '-'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
              <div className="absolute right-0 max-w-3xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl">
                <div className="mt-2 flex flex-col-reverse justify-stretch space-y-2 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                  {kontakWhatsappButton}
                  <button
                    id="verify-transaction"
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                  >
                    Verifikasi Pembelian
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
