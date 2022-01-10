import { build, fake } from '@jackfranklin/test-data-bot'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
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

    render(
      <MemoryRouter>
        <TransactionItem {...props} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('customer-name')).toBeVisible()
  })
  it('should display customer email correctly', () => {
    const props = transactionItemBuilder()

    render(
      <MemoryRouter>
        <TransactionItem {...props} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('customer-email')).toBeVisible()
  })
  it('should display transaction datetime correctly', () => {
    const props = transactionItemBuilder()

    render(
      <MemoryRouter>
        <TransactionItem {...props} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('transaction-datetime')).toBeVisible()
  })
  it('should display transaction bank name correctly', () => {
    const props = transactionItemBuilder()

    render(
      <MemoryRouter>
        <TransactionItem {...props} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('transaction-bankname')).toBeVisible()
  })
  it('should render transaction details link correctly', () => {
    const props = transactionItemBuilder()

    render(
      <MemoryRouter>
        <TransactionItem {...props} />
      </MemoryRouter>
    )

    expect(screen.getByRole('link')).toBeVisible()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `/${props.transactionId}`
    )
  })
})
