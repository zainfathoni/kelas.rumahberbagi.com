import { TransactionStatus, TRANSACTION_STATUS } from '~/models/enum'

export function canUpdateTransactionStatus(
  currentStatus: TransactionStatus,
  destinationStatus: TransactionStatus
) {
  if (
    currentStatus === TRANSACTION_STATUS.VERIFIED &&
    destinationStatus === TRANSACTION_STATUS.REJECTED
  ) {
    return false
  }

  return true
}
