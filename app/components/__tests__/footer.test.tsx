import React from 'react' // FIXME: find a way to make the test pass without this
import { render, screen } from '@testing-library/react'
import { build, fake } from '@jackfranklin/test-data-bot'
import type { FooterProps } from '~/components/footer'
import { Footer } from '~/components/footer'

const footerBuilder = build<FooterProps>('Footer', {
  fields: {
    instagramUrl: fake((f) => f.internet.url()),
  },
})

describe('Footer', () => {
  it('renders the Copyright statement correctly', () => {
    const { instagramUrl } = footerBuilder()

    render(<Footer instagramUrl={instagramUrl} />)

    expect(
      screen.getByText(/2021 Rumah Berbagi\. All rights reserved\./)
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
