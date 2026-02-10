import { build, perBuild } from '@jackfranklin/test-data-bot'
import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import type { FooterProps } from '~/components/footer'
import { Footer } from '~/components/footer'

const footerBuilder = build<FooterProps>('Footer', {
  fields: {
    instagramUrl: perBuild(() => faker.internet.url()),
  },
})

describe('Footer', () => {
  it('renders the Copyright statement correctly', () => {
    const { instagramUrl } = footerBuilder()

    render(<Footer instagramUrl={instagramUrl} />)

    expect(
      screen.getByText(/Rumah Berbagi\. All rights reserved\./)
    ).toBeVisible()
  })

  it('renders the Instagram URL correctly', () => {
    const { instagramUrl } = footerBuilder()

    render(<Footer instagramUrl={instagramUrl} />)

    expect(
      screen.getByRole('link', {
        name: /instagram link/i,
      })
    ).toHaveAttribute('href', instagramUrl)
  })
})
