import { render, screen } from '@testing-library/react'
import { Alert } from '~/components/alerts'

describe('Alert', () => {
  it('renders the Alert content correctly', () => {
    render(<Alert>Link telah dikirim ke alamat email Anda</Alert>)

    expect(
      screen.getByText('Link telah dikirim ke alamat email Anda')
    ).toBeVisible()
  })
})
