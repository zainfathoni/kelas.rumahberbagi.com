import { redirect, useLoaderData, Form, useMatches, json } from 'remix'
import type { LoaderFunction, ActionFunction } from 'remix'
import { Transaction, User } from '@prisma/client'
import { CashIcon } from '@heroicons/react/solid'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getTransactionById,
  updateTransactionStatus,
} from '~/models/transaction'
import { printLocaleDateTimeString, printRupiah } from '~/utils/format'
import { TransactionStatus, TRANSACTION_STATUS } from '~/models/enum'
import { requireUpdatedUser } from '~/services/auth.server'
import { getFirstCourse } from '~/models/course'
import { requireCourseAuthor } from '~/utils/permissions'
import { classNames } from '~/utils/class-names'
import {
  activateSubscription,
  deactivateSubscription,
} from '~/models/subscription'

export const loader: LoaderFunction = async ({ params }) => {
  // TODO: block if the current user is not an admin or the author of the course
  const { transactionId } = params

  if (!transactionId) {
    return redirect('/dashboard/transactions')
  }

  const transaction = await getTransactionById(transactionId)

  if (!transaction) {
    return redirect('/dashboard/transactions')
  }

  return transaction
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/transactions')
  }

  const { transactionId } = params
  if (!transactionId) {
    return redirect('/dashboard/transactions')
  }

  const formData = await request.formData()
  const status = formData.get('status')

  if (typeof status !== 'string') {
    return { formError: 'Form not submitted correctly.' }
  }

  const transaction = await getTransactionById(transactionId)
  if (!transaction) {
    return redirect('/dashboard/purchase')
  }

  const updatedTransaction = await updateTransactionStatus(
    transaction.id,
    status as TransactionStatus
  )
  if (!updatedTransaction) {
    throw json({ transaction, status }, { status: 500 })
  }

  if (updatedTransaction.status === TRANSACTION_STATUS.VERIFIED) {
    const subscription = await activateSubscription(updatedTransaction.userId)
    if (!subscription) {
      throw json({ updatedTransaction, status }, { status: 500 })
    }
  } else if (updatedTransaction.status === TRANSACTION_STATUS.REJECTED) {
    const subscription = await deactivateSubscription(updatedTransaction.userId)
    if (!subscription) {
      throw json({ updatedTransaction, status }, { status: 500 })
    }
  }

  return redirect(`/dashboard/transactions/${transactionId}`)
}

export default function VerifyTransaction() {
  const transactionDetails: Transaction & { user: User } = useLoaderData()
  const navigate = useNavigate()
  const matches = useMatches()
  const destinationStatus = (
    matches?.[matches.length - 1]?.params?.action === 'verify'
      ? TRANSACTION_STATUS.VERIFIED
      : TRANSACTION_STATUS.REJECTED
  ) as TransactionStatus

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() =>
          navigate(`/dashboard/transactions/${transactionDetails.id}`, {
            replace: true,
          })
        }
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Pastikan data ini valid
                  </h3>
                  <div className="mt-5">
                    <div className="rounded-md bg-gray-50 px-6 py-5 sm:flex sm:items-start sm:justify-between">
                      <h4 className="sr-only">Visa</h4>
                      <div className="sm:flex sm:items-start">
                        <CashIcon
                          className="h-8 w-auto sm:flex-shrink-0 sm:h-6"
                          aria-hidden="true"
                        />
                        <div className="mt-3 sm:mt-0 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900 sm:flex sm:items-center">
                            <div>{transactionDetails.bankAccountName}</div>
                            <span
                              className="hidden sm:mx-2 sm:inline"
                              aria-hidden="true"
                            >
                              &middot;
                            </span>
                            <div className="mt-1 sm:mt-0">
                              {printRupiah(transactionDetails.amount)}
                            </div>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 sm:flex sm:items-center">
                            <div>{transactionDetails.bankName}</div>
                            <span
                              className="hidden sm:mx-2 sm:inline"
                              aria-hidden="true"
                            >
                              &middot;
                            </span>
                            <div className="mt-1 sm:mt-0">
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
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
                        <Form replace method="post">
                          <input
                            type="hidden"
                            name="status"
                            value={destinationStatus}
                          />
                          <button
                            type="submit"
                            aria-label="Verifikasi"
                            className={classNames(
                              'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500',
                              destinationStatus === TRANSACTION_STATUS.VERIFIED
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-red-600 hover:bg-red-700'
                            )}
                          >
                            {destinationStatus === TRANSACTION_STATUS.VERIFIED
                              ? 'Verifikasi'
                              : 'Tolak'}
                          </button>
                        </Form>
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
  )
}
