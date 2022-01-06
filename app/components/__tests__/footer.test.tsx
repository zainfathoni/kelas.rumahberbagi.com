import { render, screen } from '@testing-library/react'
import { Footer } from '~/components/footer'

describe('Footer', () => {
  it('renders the Copyright statement correctly', () => {
    render(<Footer instagramUrl="https://instagram.com/vika.riandini" />)

    expect(
      screen.getByText(/2021 Rumah Berbagi\. All rights reserved\./)
    ).toBeVisible()
  })
})
