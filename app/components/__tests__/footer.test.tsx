import { render, screen } from '@testing-library/react'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import type { FooterProps } from '~/components/footer'
import { Footer } from '~/components/footer'
import { mockSlug } from '~/models/__mocks__/mock-data'

const footerBuilder = build<FooterProps>('Footer', {
  fields: {
    instagramUrl: perBuild(
      () => `https://instagram.com/${mockSlug('rumah-berbagi')}`
    ),
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
