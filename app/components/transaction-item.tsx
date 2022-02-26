import {
  CheckCircleIcon,
  ChevronRightIcon,
  LibraryIcon,
} from '@heroicons/react/solid'
import { Link } from 'remix'
import { isNotEmpty } from '~/utils/assertions'
import { printLocaleDateTimeString } from '~/utils/format'

export type TransactionItemProps = {
  transactionId: string
  bankAccountName: string
  bankName: string
  dateTime: Date | null
  bankAccountNumber: string
}

export function TransactionItem({
  transactionId,
  bankAccountName,
  bankName,
  dateTime,
  bankAccountNumber,
}: TransactionItemProps) {
  return (
    <li>
      <Link to={transactionId}>
        <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
              <div>
                <p
                  className="text-sm font-medium text-purple-600 truncate"
                  aria-label="Nama Rekening"
                >
                  {isNotEmpty(bankAccountName) ? bankAccountName : '-'}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <LibraryIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate" aria-label="Nama Bank">
                    {isNotEmpty(bankName) ? bankName : '-'}
                  </span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p
                    className="text-sm text-gray-900"
                    aria-label="Waktu Transaksi"
                  >
                    {!dateTime ? (
                      '-'
                    ) : (
                      <time>{printLocaleDateTimeString(dateTime)}</time>
                    )}
                  </p>
                  <p
                    className="mt-2 flex items-center text-sm text-gray-500"
                    aria-label="Nomor Rekening"
                  >
                    <CheckCircleIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                    {isNotEmpty(bankAccountNumber) ? bankAccountNumber : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <ChevronRightIcon
              className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
              aria-hidden="true"
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
