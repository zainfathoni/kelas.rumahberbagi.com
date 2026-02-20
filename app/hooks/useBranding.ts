import { useRouteLoaderData } from '@remix-run/react'
import type { BrandingConfig } from '~/config/branding.server'

/**
 * Hook to access branding configuration from root loader
 * Falls back to defaults if not available (shouldn't happen in normal use)
 */
export function useBranding(): BrandingConfig {
  const rootData = useRouteLoaderData('root') as
    | { branding: BrandingConfig }
    | undefined

  // Fallback defaults (shouldn't be needed but TypeScript safety)
  return (
    rootData?.branding ?? {
      siteName: 'Rumah Berbagi',
      siteNameFull: 'Kelas Rumah Berbagi',
      siteDomain: 'kelas.rumahberbagi.com',
      siteUrl: 'https://kelas.rumahberbagi.com',
      emailFrom: 'Rumah Berbagi <admin@rumahberbagi.com>',
      logoPath: '/rumah-berbagi.jpeg',
      logoTextPath: '/teks-rumah-berbagi.png',
      faviconPath: '/rumah-berbagi.jpeg',
      whatsappDefault: '',
      copyrightHolder: 'Rumah Berbagi',
      parentSiteUrl: 'https://rumahberbagi.com',
    }
  )
}
