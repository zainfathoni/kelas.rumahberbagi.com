import { ReactNode } from 'react'
import { Link } from 'remix'
import { classNames } from '~/utils/class-names'

const buttonClassNames =
  'disabled:opacity-80 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:cursor-not-allowed text-center inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500'

function DisabledButton({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <button disabled className={classNames(buttonClassNames, className ?? '')}>
      {children}
    </button>
  )
}

type ButtonLinkProps = {
  to: string
  replace?: boolean
  children: ReactNode
  external?: boolean
  disabled?: boolean
  className?: string
}

export function ButtonLink({
  to,
  replace,
  children,
  external,
  disabled,
  className,
  ...props
}: ButtonLinkProps) {
  return disabled ? (
    <DisabledButton>{children}</DisabledButton>
  ) : external ? (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(buttonClassNames, className ?? '')}
    >
      {children}
    </a>
  ) : (
    <Link
      to={to}
      replace={replace}
      className={classNames(
        buttonClassNames,
        'w-full sm:w-auto',
        className ?? ''
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export function PrimaryButtonLink(props: ButtonLinkProps) {
  return (
    <ButtonLink
      className="border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-red-500"
      {...props}
    />
  )
}
export function SecondaryButtonLink(props: ButtonLinkProps) {
  return <ButtonLink className="text-gray-700" {...props} />
}
export function TertiaryButtonLink(props: ButtonLinkProps) {
  return (
    <ButtonLink
      className="border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 mr-auto"
      {...props}
    />
  )
}
