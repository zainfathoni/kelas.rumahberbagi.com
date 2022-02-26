import { build, fake } from '@jackfranklin/test-data-bot'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TransactionItem, TransactionItemProps } from '../transaction-item'

const transactionItemBuilder = build<TransactionItemProps>('TransactionItem', {
  fields: {
    transactionId: fake((f) => f.datatype.uuid()),
    name: fake((f) => f.name.findName()),
    bankName: 'BRI',
    email: fake((f) => f.internet.email()),
    dateTime: fake((f) => f.date.past()),
  },
})
describe('TransactionItem', () => {
  it('should display customer name correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nama lengkap/i)).toHaveTextContent(props.name)
  })
  it('should display customer email correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/alamat email/i)).toHaveTextContent(
      props.email
    )
  })
  it('should display transaction datetime correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/waktu transaksi/i)).toBeVisible()
  })
  it('should display transaction bank name correctly', () => {
    const props = transactionItemBuilder()

    render(<TransactionItem {...props} />, { wrapper: MemoryRouter })

    expect(screen.getByLabelText(/nama bank/i)).toHaveTextContent(
      props.bankName
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
