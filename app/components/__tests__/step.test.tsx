import { screen } from '@testing-library/react'
import { render } from '#test/test-utils'
import { Step } from '~/components/step'
import { STEPS } from '~/utils/constants'

describe('Step', () => {
  it('renders the link correctly', () => {
    render(<Step step={STEPS[0]} isLastStep status="upcoming" />)

    const link = screen.getByRole('link', {
      name: /instruksi pembayaran.*tranfer biaya ke rekening yang ditentukan/i,
    })
    expect(link).toHaveAttribute('href', STEPS[0].pathname)
    expect(link).not.toHaveAttribute('aria-current', 'step')
  })

  it('renders a current step correctly', () => {
    render(<Step step={STEPS[0]} isLastStep={false} status="current" />)

    expect(
      screen.getByRole('link', {
        name: /instruksi pembayaran.*tranfer biaya ke rekening yang ditentukan/i,
      })
    ).toHaveAttribute('aria-current', 'step')
  })

  it('renders a completed last step correctly', () => {
    const { container } = render(
      <Step step={STEPS[0]} isLastStep status="completed" />
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          aria-hidden="true"
          class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-indigo-600"
        />
        <a
          class="relative flex items-start group"
          data-discover="true"
          href="/dashboard/purchase/"
        >
          <span
            class="h-9 flex items-center"
          >
            <span
              class="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fill-rule="evenodd"
                />
              </svg>
            </span>
          </span>
          <span
            class="ml-4 min-w-0 flex flex-col"
          >
            <span
              class="text-xs font-semibold tracking-wide uppercase"
            >
              Instruksi Pembayaran
            </span>
            <span
              class="text-sm text-gray-500"
            >
              Tranfer biaya ke rekening yang ditentukan
            </span>
          </span>
        </a>
      </div>
    `)
  })

  it('renders a completed non-last step correctly', () => {
    const { container } = render(
      <Step step={STEPS[0]} isLastStep={false} status="completed" />
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="relative flex items-start group"
          data-discover="true"
          href="/dashboard/purchase/"
        >
          <span
            class="h-9 flex items-center"
          >
            <span
              class="relative w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clip-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  fill-rule="evenodd"
                />
              </svg>
            </span>
          </span>
          <span
            class="ml-4 min-w-0 flex flex-col"
          >
            <span
              class="text-xs font-semibold tracking-wide uppercase"
            >
              Instruksi Pembayaran
            </span>
            <span
              class="text-sm text-gray-500"
            >
              Tranfer biaya ke rekening yang ditentukan
            </span>
          </span>
        </a>
      </div>
    `)
  })
})
