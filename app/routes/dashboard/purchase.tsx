import { CheckIcon } from '@heroicons/react/solid'
import type { LoaderFunction } from 'remix'
import { redirect, Link, Outlet } from 'remix'
import { getSubscriptionActiveByUserId } from '~/models/subscription'
import { auth } from '~/services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  // Get the subscription data from user where status is active
  const subscription = await getSubscriptionActiveByUserId(id)
  if (subscription) {
    return redirect('/dashboard')
  }
  return true
}

const steps = [
  {
    name: 'Pembayaran',
    description: 'Tranfer biaya ke rekening yang ditentukan',
    href: '#',
    status: 'current',
  },
  {
    name: 'Konfirmasi Pembayaran',
    description: 'Hubungi admin melalui whatsapp',
    href: '#',
    status: 'upcomming',
  },
  {
    name: 'Selesai',
    description: 'Periksa status pembayaran',
    href: '#',
    status: 'upcoming',
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Purchase() {
  return (
    <div className="py-4 px-4 sm:px-6 md:px-0">
      <div className="pb-4 md:pb-0 md:w-64 md:flex-col md:fixed">
        <nav aria-label="Progress">
          <ol className="overflow-hidden">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={classNames(
                  stepIdx !== steps.length - 1 ? 'pb-10' : '',
                  'relative'
                )}
              >
                {step.status === 'complete' ? (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-indigo-600"
                        aria-hidden="true"
                      />
                    ) : null}
                    <Link
                      to={step.href}
                      className="relative flex items-start group"
                    >
                      <span className="h-9 flex items-center">
                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                          <CheckIcon
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col">
                        <span className="text-xs font-semibold tracking-wide uppercase">
                          {step.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </Link>
                  </>
                ) : step.status === 'current' ? (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                        aria-hidden="true"
                      />
                    ) : null}
                    <Link
                      to={step.href}
                      className="relative flex items-start group"
                      aria-current="step"
                    >
                      <span
                        className="h-9 flex items-center"
                        aria-hidden="true"
                      >
                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full">
                          <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
                        </span>
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col">
                        <span className="text-xs font-semibold tracking-wide uppercase text-indigo-600">
                          {step.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </Link>
                  </>
                ) : (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                        aria-hidden="true"
                      />
                    ) : null}
                    <Link
                      to={step.href}
                      className="relative flex items-start group"
                    >
                      <span
                        className="h-9 flex items-center"
                        aria-hidden="true"
                      >
                        <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                          <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                        </span>
                      </span>
                      <span className="ml-4 min-w-0 flex flex-col">
                        <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">
                          {step.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </Link>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      <div className="md:pl-64">
        <Outlet />
      </div>
    </div>
  )
}
