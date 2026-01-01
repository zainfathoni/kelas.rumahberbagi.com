import {
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationIcon,
  LibraryIcon,
  PencilAltIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { Link } from '@remix-run/react'
import { TransactionStatus, TRANSACTION_STATUS } from '~/models/enum'
import { isNotEmpty } from '~/utils/assertions'
import { classNames } from '~/utils/class-names'
import { printLocaleDateTimeString } from '~/utils/format'

export type TransactionItemProps = {
  to: string
  bankAccountName: string
  bankName: string
  updatedAt: Date | null
  bankAccountNumber: string
  notes: string | null
  status: TransactionStatus
}

export function TransactionIcon({
  status,
  notes,
  className,
}: {
  status: TransactionStatus
  notes: string | null
  className?: string
}) {
  switch (status as TransactionStatus) {
    case TRANSACTION_STATUS.VERIFIED:
      if (notes) {
        return (
          <ShieldExclamationIcon
            className={classNames(
              'flex-shrink-0 mr-1.5 h-5 w-5 text-orange-400',
              className ?? ''
            )}
            aria-hidden="true"
          />
        )
      } else {
        return (
          <ShieldCheckIcon
            className={classNames(
              'flex-shrink-0 mr-1.5 h-5 w-5 text-green-400',
              className ?? ''
            )}
            aria-hidden="true"
          />
        )
      }
    case TRANSACTION_STATUS.REJECTED:
      if (notes) {
        return (
          <ExclamationCircleIcon
            className={classNames(
              'flex-shrink-0 mr-1.5 h-5 w-5 text-pink-400',
              className ?? ''
            )}
            aria-hidden="true"
          />
        )
      } else {
        return (
          <XCircleIcon
            className={classNames(
              'flex-shrink-0 mr-1.5 h-5 w-5 text-red-400',
              className ?? ''
            )}
            aria-hidden="true"
          />
        )
      }
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
  to,
  bankAccountName,
  bankName,
  updatedAt,
  bankAccountNumber,
  status,
  notes,
}: TransactionItemProps) {
  return (
    <li>
      <Link to={to}>
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
                  <TransactionIcon
                    status={status}
                    notes={notes}
                    className="sm:hidden"
                  />
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
                    {!updatedAt ? (
                      '-'
                    ) : (
                      <time>{printLocaleDateTimeString(updatedAt)}</time>
                    )}
                  </p>
                  <p
                    className="mt-2 flex items-center text-sm text-gray-500"
                    aria-label="Nomor Rekening"
                  >
                    <TransactionIcon status={status} notes={notes} />
                    {isNotEmpty(bankAccountNumber) ? bankAccountNumber : '-'}
                  </p>
                </div>
              </div>
              {notes ? (
                <p className="sm:col-span-2 mt-2 flex items-center text-sm text-gray-500">
                  <PencilAltIcon className="inline-block flex-shrink-0 mr-1.5 h-5 w-5 text-orange-400" />
                  <span className="truncate" aria-label="Catatan">
                    {notes}
                  </span>
                </p>
              ) : null}
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
