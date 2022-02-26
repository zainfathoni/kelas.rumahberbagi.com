import { build, fake, oneOf } from '@jackfranklin/test-data-bot'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TransactionItem, TransactionItemProps } from '../transaction-item'
import { printLocaleDateTimeString } from '~/utils/format'
import { TRANSACTION_STATUS } from '~/models/enum'

const transactionItemBuilder = build<TransactionItemProps>('TransactionItem', {
  fields: {
    transactionId: fake((f) => f.datatype.uuid()),
    bankAccountName: fake((f) => f.finance.accountName()),
    bankAccountNumber: fake((f) => f.finance.account()),
    bankName: fake((f) => f.company.companyName()),
    dateTime: fake((f) => f.date.past()),
    status: oneOf(TRANSACTION_STATUS),
  },
})
describe('TransactionItem', () => {
  it('should display bankAccountName correctly', () => {
    const props = transactionItemBuilder({
      overrides: {
        status: TRANSACTION_STATUS.VERIFIED,
      },
    })

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

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

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

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

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/waktu transaksi/i)).toHaveTextContent(
      printLocaleDateTimeString(props.dateTime ?? '')
    )
  })
  it('should display bankAccountNumber correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nomor rekening/i)).toHaveTextContent(
      props.bankAccountNumber
    )
  })
  it('should link to transaction details page correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link')).toBeVisible()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/${props.transactionId}`
    )
  })
})
