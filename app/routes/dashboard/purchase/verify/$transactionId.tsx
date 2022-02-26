/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { useLoaderData, redirect } from 'remix'
import type { LoaderFunction } from 'remix'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { getTransactionDetails } from '~/models/transaction'
import { getUser } from '~/models/user'
import { stripLeadingPlus } from '~/utils/misc'

type LoaderData = {
  transactionId: string
  authorPhoneNumber: string
}

export const loader: LoaderFunction = async ({ params }) => {
  const { transactionId } = params

  if (!transactionId) {
    return redirect('/dashboard/purchase/confirm')
  }

  const transaction = await getTransactionDetails(transactionId)

  if (!transaction) {
    throw new Response('Transaction not found', {
      status: 404,
    })
  }

  const author = await getUser(transaction.authorId)

  if (!author) {
    throw new Response('Author not found', {
      status: 404,
    })
  }

  const data = {
    transactionId: transaction.id,
    authorPhoneNumber: author.phoneNumber,
  }

  return data
}

export default function Example() {
  const { transactionId, authorPhoneNumber } = useLoaderData<LoaderData>()
  const [open, setOpen] = useState(true)
  const normalizedAuthorPhoneNumber = stripLeadingPlus(authorPhoneNumber)

  const whatsappLink = `https://api.whatsapp.com/send?phone=${normalizedAuthorPhoneNumber}&text=%5BKelas%20Tahun%20Prasekolahku%5D%0A%0AKlik%20di%20sini%20untuk%20verifikasi%20pembayaran%0Ahttps%3A%2F%2Frbagi.id%2Fverify%2F${transactionId}%0A%0ABerikut%20terlampir%20foto%2Ffile%20bukti%20pembayaran%20saya%3A`

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckIcon
                    className="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Data transaksi tersimpan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Silakan klik tombol di bawah ini untuk mengirimkan pesan
                      WhatsApp kepada kami. Setelah itu, tolong lampirkan bukti
                      transfer berupa foto atau file PDF ke nomor WhatsApp
                      tersebut. Terima kasih.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Kirim Pesan WhatsApp
                  </a>
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
