import fs from 'node:fs'
import path from 'node:path'

const STAGING_AUTH_DIR = 'e2e/fixtures/auth/staging'
const REQUIRED_AUTH_FILES = [
  'member.staging.json',
  'author.staging.json',
  'admin.staging.json',
]

/**
 * Global setup for staging E2E tests.
 *
 * Unlike local tests, staging authentication cannot be automated via magic link
 * because emails are sent to real addresses. Instead, this setup validates that
 * manually-exported auth fixtures exist.
 *
 * To create auth fixtures for staging:
 * 1. Login to https://staging.kelas.rumahberbagi.com in your browser
 * 2. Open DevTools > Application > Storage > Cookies
 * 3. Export the cookies using browser extension or manually copy them
 * 4. Save to e2e/fixtures/auth/staging/<role>.staging.json in Playwright's
 *    storageState format:
 *    {
 *      "cookies": [{ "name": "...", "value": "...", "domain": "...", ... }],
 *      "origins": []
 *    }
 */
async function globalSetup() {
  if (!fs.existsSync(STAGING_AUTH_DIR)) {
    fs.mkdirSync(STAGING_AUTH_DIR, { recursive: true })
    console.log(`Created staging auth directory: ${STAGING_AUTH_DIR}`)
  }

  const missingFiles: string[] = []

  for (const file of REQUIRED_AUTH_FILES) {
    const filePath = path.join(STAGING_AUTH_DIR, file)
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file)
    }
  }

  if (missingFiles.length > 0) {
    console.warn('\n⚠️  Missing staging auth fixtures:')
    for (const file of missingFiles) {
      console.warn(`   - ${STAGING_AUTH_DIR}/${file}`)
    }
    console.warn(
      '\nSee playwright-staging-setup.ts for instructions on creating these files.\n'
    )
  }

  console.log('✓ Staging global setup complete')
}

export default globalSetup
