import { build, perBuild } from '@jackfranklin/test-data-bot'
import { screen } from '@testing-library/react'
import { TransactionItem, TransactionItemProps } from '../transaction-item'
import { render } from '#test/test-utils'
import { printLocaleDateTimeString } from '~/utils/format'
import { TRANSACTION_STATUS } from '~/models/enum'
import { generateId } from '~/utils/nanoid'
import {
  mockBankAccountNumber,
  mockName,
  mockPastDate,
  mockSentence,
  pick,
  randomInt,
} from '~/models/__mocks__/mock-data'

const transactionStatuses = Object.values(TRANSACTION_STATUS)

const transactionItemBuilder = build<TransactionItemProps>('TransactionItem', {
  fields: {
    to: perBuild(
      () =>
        `${generateId()}?status=${pick(transactionStatuses)}&page=${randomInt(
          1,
          100
        )}`
    ),
    bankAccountName: perBuild(() => mockName('Account Holder')),
    bankAccountNumber: perBuild(mockBankAccountNumber),
    bankName: perBuild(() => mockName('Bank')),
    updatedAt: perBuild(mockPastDate),
    status: perBuild(() => pick(transactionStatuses)),
    notes: perBuild(() => mockSentence('Note')),
  },
})
describe('TransactionItem', () => {
  it('should display bankAccountName correctly', () => {
    const props = transactionItemBuilder({
      overrides: {
        status: TRANSACTION_STATUS.VERIFIED,
      },
    })

    render(<TransactionItem {...props} />)

    expect(screen.getByLabelText(/nama rekening/i)).toHaveTextContent(
      props.bankAccountName
    )
  })
  it('should display bankName correctly', () => {
    const props = transactionItemBuilder({
      overrides: {
        status: TRANSACTION_STATUS.REJECTED,
      },
    })

    render(<TransactionItem {...props} />)

    expect(screen.getByLabelText(/nama bank/i)).toHaveTextContent(
      props.bankName
    )
  })
  it('should display datetime correctly', () => {
    const props = transactionItemBuilder({
      overrides: {
        status: TRANSACTION_STATUS.SUBMITTED,
      },
    })

    render(<TransactionItem {...props} />)

    expect(screen.getByLabelText(/waktu transaksi/i)).toHaveTextContent(
      printLocaleDateTimeString(props.updatedAt ?? '')
    )
  })
  it('should display bankAccountNumber correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />)

    expect(screen.getByLabelText(/nomor rekening/i)).toHaveTextContent(
      props.bankAccountNumber
    )
  })
  it('should link to transaction details page correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />)

    expect(screen.getByRole('link')).toBeVisible()
    expect(screen.getByRole('link')).toHaveAttribute('href', `/${props.to}`)
  })
  it('should display notes correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />)

    expect(screen.getByLabelText(/catatan/i)).toHaveTextContent(
      props.notes ?? ''
    )
  })
})
