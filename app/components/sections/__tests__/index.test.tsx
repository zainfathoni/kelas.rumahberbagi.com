import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '~/routes'

describe('Home Page', () => {
  it('renders the Home Page without error', () => {
    const { container } = render(<HomePage />, { wrapper: MemoryRouter })

    expect(container).toMatchSnapshot()
  })
})
