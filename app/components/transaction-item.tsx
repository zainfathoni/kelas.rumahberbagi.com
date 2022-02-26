import {
  CheckCircleIcon,
  ChevronRightIcon,
  MailIcon,
} from '@heroicons/react/solid'
import { Link } from 'remix'
import { isNotEmpty } from '~/utils/assertions'
import { printLocaleDateTimeString } from '~/utils/format'

export type TransactionItemProps = {
  transactionId: string
  name: string
  email: string
  dateTime: Date
  bankName: string
}

export function TransactionItem({
  transactionId,
  name,
  email,
  dateTime,
  bankName,
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
                  data-testid="customer-name"
                >
                  {isNotEmpty(name) ? name : '-'}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500">
                  <MailIcon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span className="truncate" data-testid="customer-email">
                    {isNotEmpty(email) ? email : '-'}
                  </span>
                </p>
              </div>
              <div className="hidden md:block">
                <div>
                  <p
                    className="text-sm text-gray-900"
                    data-testid="transaction-datetime"
                  >
                    {isNotEmpty(dateTime) ? (
                      '-'
                    ) : (
                      <time dateTime={dateTime.toISOString()}>
                        {printLocaleDateTimeString(dateTime)}
                      </time>
                    )}
                  </p>
                  <p
                    className="mt-2 flex items-center text-sm text-gray-500"
                    data-testid="transaction-bankname"
                  >
                    <CheckCircleIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400"
                      aria-hidden="true"
                    />
                    {isNotEmpty(bankName) ? bankName : '-'}
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
