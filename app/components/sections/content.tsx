import { CheckIcon } from '@heroicons/react/outline'

type ItemProps = {
  children: React.ReactNode
}
const Item = ({ children }: ItemProps): JSX.Element => (
  <div className="relative">
    <CheckIcon aria-hidden="true" className="absolute h-6 w-6 text-green-500" />
    <p className="ml-9 text-lg leading-6 font-medium text-gray-900">
      {children}
    </p>
  </div>
)

type ContentProps = {
  title: string
  children: React.ReactNode // TODO: Allow Description and Included types only
}
export const Content = ({ title, children }: ContentProps): JSX.Element => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
        </div>
        <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
          {children}
        </dl>
      </div>
    </div>
  )
}

Content.Item = Item
