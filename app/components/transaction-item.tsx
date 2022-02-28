import {
  ChevronRightIcon,
  ExclamationIcon,
  LibraryIcon,
  ShieldCheckIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Link } from 'remix'
import { TransactionStatus, TRANSACTION_STATUS } from '~/models/enum'
import { isNotEmpty } from '~/utils/assertions'
import { classNames } from '~/utils/class-names'
import { printLocaleDateTimeString } from '~/utils/format'

export type TransactionItemProps = {
  transactionId: string
  bankAccountName: string
  bankName: string
  dateTime: Date | null
  bankAccountNumber: string
  status: TransactionStatus
}

function TransactionIcon({
  status,
  className,
}: {
  status: TransactionStatus
  className?: string
}) {
  switch (status as TransactionStatus) {
    case TRANSACTION_STATUS.VERIFIED:
      return (
        <ShieldCheckIcon
          className={classNames(
            'flex-shrink-0 mr-1.5 h-5 w-5 text-green-400',
            className ?? ''
          )}
          aria-hidden="true"
        />
      )
    case TRANSACTION_STATUS.REJECTED:
      return (
        <XCircleIcon
          className={classNames(
            'flex-shrink-0 mr-1.5 h-5 w-5 text-red-400',
            className ?? ''
          )}
          aria-hidden="true"
        />
      )
    default:
      return (
        <ExclamationIcon
          className={classNames(
            'flex-shrink-0 mr-1.5 h-5 w-5 text-orange-400',
            className ?? ''
          )}
          aria-hidden="true"
        />
      )
  }
}

export function TransactionItem({
  transactionId,
  bankAccountName,
  bankName,
  dateTime,
  bankAccountNumber,
  status,
}: TransactionItemProps) {
  return (
    <li>
      <Link to={transactionId}>
        <div className="flex items-center py-5 px-4 sm:py-6 sm:px-0">
          <div className="min-w-0 flex-1 flex items-center">
            <div className="min-w-0 flex-1 px-4 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <p
                  className="text-sm font-medium text-purple-600 truncate"
                  aria-label="Nama Rekening"
                >
                  {isNotEmpty(bankAccountName) ? bankAccountName : '-'}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <LibraryIcon
                    className="hidden sm:inline-block flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <TransactionIcon status={status} className="sm:hidden" />
                  <span className="truncate" aria-label="Nama Bank">
                    {isNotEmpty(bankName) ? bankName : '-'}
                  </span>
                </p>
              </div>
              <div className="hidden sm:block">
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
                    <TransactionIcon status={status} />
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
