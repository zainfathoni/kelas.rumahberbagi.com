import { build, fake } from '@jackfranklin/test-data-bot'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TransactionItem, TransactionItemProps } from '../transaction-item'
import { printLocaleDateTimeString } from '~/utils/format'

const transactionItemBuilder = build<TransactionItemProps>('TransactionItem', {
  fields: {
    transactionId: fake((f) => f.datatype.uuid()),
    bankAccountName: fake((f) => f.finance.accountName()),
    bankAccountNumber: fake((f) => f.finance.account()),
    bankName: fake((f) => f.company.companyName()),
    dateTime: fake((f) => f.date.past()),
  },
})
describe('TransactionItem', () => {
  it('should display customer name correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nama rekening/i)).toHaveTextContent(
      props.bankAccountName
    )
  })
  it('should display customer email correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nama bank/i)).toHaveTextContent(
      props.bankName
    )
  })
  it('should display transaction datetime correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/waktu transaksi/i)).toHaveTextContent(
      printLocaleDateTimeString(props.dateTime ?? '')
    )
  })
  it('should display transaction bank name correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nomor rekening/i)).toHaveTextContent(
      props.bankAccountNumber
    )
  })
  it('should render transaction details link correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('link')).toBeVisible()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/${props.transactionId}`
    )
  })
})
