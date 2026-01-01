import { screen } from '@testing-library/react'
import { Pricing } from '../pricing'
import { render } from '#test/test-utils'

describe('Pricing', () => {
  it('renders the Pricing without error', () => {
    render(
      <Pricing
        title="Biaya kelas"
        description={
          <Pricing.Description>
            Biaya baru dibayarkan setelah Anda terkonfirmasi sebagai peserta
            kelas
          </Pricing.Description>
        }
        signupLink="/dashboard/purchase"
        isSubscribed
      >
        <Pricing.Included title="Biaya termasuk">
          <Pricing.Item>Handout berupa catatan bergambar</Pricing.Item>
          <Pricing.Item>Printable planner</Pricing.Item>
          <Pricing.Item>Akses kelas online melalui Zoom</Pricing.Item>
          <Pricing.Item>Video rekaman kelas</Pricing.Item>
        </Pricing.Included>
      </Pricing>
    )

    expect(
      screen.getByRole('link', {
        name: /akses kelas/i,
      })
    ).toHaveAttribute('href', '/dashboard/course')
  })
})
