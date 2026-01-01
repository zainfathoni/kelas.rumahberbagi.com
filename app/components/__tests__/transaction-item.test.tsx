import { build, fake, oneOf } from '@jackfranklin/test-data-bot'
import { screen } from '@testing-library/react'
import { TransactionItem, TransactionItemProps } from '../transaction-item'
import { render } from '#test/test-utils'
import { printLocaleDateTimeString } from '~/utils/format'
import { TRANSACTION_STATUS } from '~/models/enum'

const transactionItemBuilder = build<TransactionItemProps>('TransactionItem', {
  fields: {
    to: fake(
      (f) =>
        `${f.datatype.uuid()}?status=${oneOf(
          TRANSACTION_STATUS
        )}&page=${f.datatype.number()}`
    ),
    bankAccountName: fake((f) => f.finance.accountName()),
    bankAccountNumber: fake((f) => f.finance.account()),
    bankName: fake((f) => f.company.companyName()),
    updatedAt: fake((f) => f.date.past()),
    status: oneOf(TRANSACTION_STATUS),
    notes: fake((f) => f.lorem.sentence()),
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
