/**
 * Site branding configuration
 * Reads from environment variables with Rumah Berbagi defaults
 */

export interface BrandingConfig {
  siteName: string
  siteNameFull: string
  siteDomain: string
  siteUrl: string
  emailFrom: string
  logoPath: string
  logoTextPath: string
  faviconPath: string
  whatsappDefault: string
  copyrightHolder: string
  parentSiteUrl: string
}

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

export function getBranding(): BrandingConfig {
  const siteName = getEnv('SITE_NAME', 'Rumah Berbagi')
  const siteDomain = getEnv('SITE_DOMAIN', 'kelas.rumahberbagi.com')

  return {
    siteName,
    siteNameFull: `Kelas ${siteName}`,
    siteDomain,
    siteUrl: getEnv('SITE_URL', `https://${siteDomain}`),
    emailFrom: getEnv('EMAIL_FROM', `${siteName} <admin@rumahberbagi.com>`),
    logoPath: getEnv('LOGO_PATH', '/rumah-berbagi.jpeg'),
    logoTextPath: getEnv('LOGO_TEXT_PATH', '/teks-rumah-berbagi.png'),
    faviconPath: getEnv('FAVICON_PATH', '/rumah-berbagi.jpeg'),
    whatsappDefault: getEnv('WHATSAPP_DEFAULT', ''),
    copyrightHolder: siteName,
    parentSiteUrl: getEnv('PARENT_SITE_URL', 'https://rumahberbagi.com'),
  }
}

// Export a singleton for server-side use
export const branding = getBranding()
