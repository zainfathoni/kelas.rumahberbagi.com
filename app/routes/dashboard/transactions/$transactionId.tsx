import { redirect, useLoaderData, Outlet, Link } from 'remix'
import type { LoaderFunction } from 'remix'
import { Transaction, User } from '@prisma/client'
import {
  ExclamationIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { isNotEmpty } from '~/utils/assertions'
import { getTransactionDetails } from '~/models/transaction'
import { printLocaleDateTimeString, printRupiah } from '~/utils/format'
import { stripLeadingPlus } from '~/utils/misc'
import { TRANSACTION_STATUS } from '~/models/enum'

export const loader: LoaderFunction = async ({ params }) => {
  // TODO: block if the current user is not an admin or the author of the course
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
  const buttonClassNames =
    'disabled:opacity-80 disabled:bg-gray-100 disabled:text-gray-500 text-center inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'
  const buttonText = 'Kontak WhatsApp'
  if (!transactionDetails.user.phoneNumber) {
    kontakWhatsappButton = (
      <button disabled className={buttonClassNames}>
        {buttonText}
      </button>
    )
  } else {
    kontakWhatsappButton = (
      <a
        href={`https://wa.me/${stripLeadingPlus(
          transactionDetails.user.phoneNumber
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClassNames}
      >
        {buttonText}
      </a>
    )
  }

  const [openVerifyDialog, setOpenVerifyDialog] = useState(false)

  return (
    <>
      <div className="min-h-full">
        <main>
          <div className="lg:mt-0 max-w-3xl mx-auto grid grid-cols-1 gap-6 py-4 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
            <div className="relative space-y-6 lg:col-start-1 lg:col-span-2">
              <section aria-labelledby="transaction-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h1
                      id="transaction-title"
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
                          {isNotEmpty(transactionDetails.user.name)
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
                          {isNotEmpty(transactionDetails.user.phoneNumber)
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
                          {isNotEmpty(transactionDetails.bankName)
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
                          {isNotEmpty(transactionDetails.bankAccountNumber)
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
                          {isNotEmpty(transactionDetails.bankAccountName)
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
                          {isNotEmpty(transactionDetails.amount)
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
                          {transactionDetails.datetime ? (
                            <time
                              dateTime={new Date(
                                transactionDetails.datetime
                              ).toISOString()}
                            >
                              {printLocaleDateTimeString(
                                new Date(transactionDetails.datetime)
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
                          {transactionDetails.status ===
                          TRANSACTION_STATUS.VERIFIED ? (
                            <span className="inline-flex">
                              <ShieldCheckIcon
                                className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                                aria-hidden="true"
                              />
                              Terverifikasi
                            </span>
                          ) : transactionDetails.status ===
                            TRANSACTION_STATUS.REJECTED ? (
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
                      <button
                        type="button"
                        className="mr-auto w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                      >
                        Tolak Pembelian
                      </button>
                      {kontakWhatsappButton}
                      <button
                        id="verify-transaction"
                        type="button"
                        onClick={() => setOpenVerifyDialog(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                      >
                        Verifikasi Pembelian
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Transition.Root show={openVerifyDialog} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpenVerifyDialog}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Payment method
                    </h3>
                    <div className="mt-5">
                      <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                        <h4 className="sr-only">Visa</h4>
                        <div className="sm:flex sm:items-start">
                          <svg
                            className="h-8 w-auto sm:flex-shrink-0 sm:h-6"
                            viewBox="0 0 36 24"
                            aria-hidden="true"
                          >
                            <rect
                              width={36}
                              height={24}
                              fill="#224DBA"
                              rx={4}
                            />
                            <path
                              fill="#fff"
                              d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                            />
                          </svg>
                          <div className="mt-3 sm:mt-0 sm:ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Ending with 4242
                            </div>
                            <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                              <div>Expires 12/20</div>
                              <span
                                className="hidden sm:mx-2 sm:inline"
                                aria-hidden="true"
                              >
                                &middot;
                              </span>
                              <div className="mt-1 sm:mt-0">
                                Last updated on 22 Aug 2017
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
