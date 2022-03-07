import { createContext, ReactNode, useContext } from 'react'

const DirectoryContext = createContext<{ currentId?: string }>({})

function DirectoryProvider({
  children,
  currentId,
}: {
  children: ReactNode
  currentId: string | undefined
}) {
  return (
    <DirectoryContext.Provider value={{ currentId }}>
      {children}
    </DirectoryContext.Provider>
  )
}

function useDirectory() {
  const context = useContext(DirectoryContext)

  if (context === undefined) {
    throw new Error('useDirectory must be used within a DirectoryProvider')
  }
  return context
}

export { DirectoryProvider, useDirectory }
