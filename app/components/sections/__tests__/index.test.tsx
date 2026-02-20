import { describe, it, expect } from 'vitest'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { json } from '@remix-run/node'
import HomePage from '~/routes/_index'

const loaderData = {
  siteName: 'Rumah Berbagi',
  siteNameFull: 'Kelas Rumah Berbagi',
  courseTitle: 'Tahun Prasekolahku',
  courseSubtitle: 'Membangun fondasi pendidikan prasekolah',
  courseDescription: 'Kelas untuk orang tua',
  courseVideoUrl: null,
  courseVideoPreviewImage: null,
  ctaText: 'Gabung Kelas',
  ctaUrl: '/login',
}

describe('Home Page', () => {
  it('renders the Home Page without error', async () => {
    const RemixStub = createRemixStub([
      {
        path: '/',
        Component: HomePage,
        loader: () => json(loaderData),
      },
    ])

    render(<RemixStub initialEntries={['/']} />)

    await waitFor(() => {
      expect(screen.getAllByText('Tahun Prasekolahku').length).toBeGreaterThan(
        0
      )
    })
  })
})
