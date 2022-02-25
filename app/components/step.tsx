import { CheckIcon } from '@heroicons/react/solid'
import { Link } from 'remix'
import { classNames } from '~/utils/class-names'

interface Step {
  name: string
  description: string
  pathname: string
}
export type StepProps = {
  step: Step
  status: 'upcoming' | 'current' | 'completed'
  isLastStep: boolean
}

export const Step = ({ status, step, isLastStep }: StepProps) => {
  let item
  switch (status) {
    case 'completed':
      item = (
        <>
          <span className="h-9 flex items-center">
            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
              <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
            </span>
          </span>
          <span className="ml-4 min-w-0 flex flex-col">
            <span className="text-xs font-semibold tracking-wide uppercase">
              {step.name}
            </span>
            <span className="text-sm text-gray-500">{step.description}</span>
          </span>
        </>
      )
      break
    case 'current':
      item = (
        <>
          <span className="h-9 flex items-center" aria-hidden="true">
            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full">
              <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
            </span>
          </span>
          <span className="ml-4 min-w-0 flex flex-col">
            <span className="text-xs font-semibold tracking-wide uppercase text-indigo-600">
              {step.name}
            </span>
            <span className="text-sm text-gray-500">{step.description}</span>
          </span>
        </>
      )
      break
    default:
      item = (
        <>
          <span className="h-9 flex items-center" aria-hidden="true">
            <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
              <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
            </span>
          </span>
          <span className="ml-4 min-w-0 flex flex-col">
            <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
              {step.name}
            </span>
            <span className="text-sm text-gray-500">{step.description}</span>
          </span>
        </>
      )
  }
  return (
    <>
      {isLastStep ? (
        <div
          className={classNames(
            '-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full',
            status === 'completed' ? 'bg-indigo-600' : 'bg-gray-300'
          )}
          aria-hidden="true"
        />
      ) : null}
      <Link
        to={step.pathname}
        className="relative flex items-start group"
        aria-current={status === 'current' ? 'step' : undefined}
      >
        {item}
      </Link>
    </>
  )
}
