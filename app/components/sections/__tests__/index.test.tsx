import { render } from '#test/test-utils'
import HomePage from '~/routes'

describe('Home Page', () => {
  it('renders the Home Page without error', () => {
    const { container } = render(<HomePage />)

    expect(container).toMatchSnapshot()
  })
})
