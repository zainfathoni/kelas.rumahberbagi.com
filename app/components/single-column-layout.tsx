import { useMatches, useSearchParams } from 'remix'
import { Breadcrumbs } from './breadcrumbs'

export function SingleColumnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const matches = useMatches()
  const [searchParams] = useSearchParams()

  return (
    <main className="flex-1 h-screen relative">
      <Breadcrumbs
        matches={matches}
        searchParams={searchParams}
        className="hidden lg:flex px-8 py-4 sticky top-0 z-20 bg-white"
      />
      <div className="mx-auto relative">{children}</div>
    </main>
  )
}
