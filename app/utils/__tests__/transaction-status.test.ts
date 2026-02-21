import { canUpdateTransactionStatus } from '../transaction-status'
import { TRANSACTION_STATUS } from '~/models/enum'

describe('canUpdateTransactionStatus', () => {
  it('allows submitted to verified', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.SUBMITTED,
        TRANSACTION_STATUS.VERIFIED
      )
    ).toBe(true)
  })

  it('allows submitted to rejected', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.SUBMITTED,
        TRANSACTION_STATUS.REJECTED
      )
    ).toBe(true)
  })

  it('prevents verified from being rejected', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.VERIFIED,
        TRANSACTION_STATUS.REJECTED
      )
    ).toBe(false)
  })

  it('allows verified to remain verified', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.VERIFIED,
        TRANSACTION_STATUS.VERIFIED
      )
    ).toBe(true)
  })

  it('allows rejected to be re-verified', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.REJECTED,
        TRANSACTION_STATUS.VERIFIED
      )
    ).toBe(true)
  })

  it('allows rejected to remain rejected', () => {
    expect(
      canUpdateTransactionStatus(
        TRANSACTION_STATUS.REJECTED,
        TRANSACTION_STATUS.REJECTED
      )
    ).toBe(true)
  })
})
