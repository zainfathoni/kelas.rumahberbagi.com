import { Link } from 'remix'

export function LogoWithText() {
  return (
    <Link to="/" className="shrink-0 px-4 flex items-center">
      <img
        className="h-8 w-auto -translate-x-1"
        src="/rumah-berbagi.svg"
        alt="Logo Rumah Berbagi"
      />
      <img
        className="h-8 w-auto pl-2 md:pl-1 translate-y-1"
        src="/rumah-berbagi-text.svg"
        alt="Teks Rumah Berbagi"
      />
    </Link>
  )
}
