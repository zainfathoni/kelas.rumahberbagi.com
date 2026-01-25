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
 * auth fixtures exist, which are generated using Playwright codegen.
 *
 * To create auth fixtures for staging, use the npm scripts:
 *
 *   npm run test:e2e:staging:auth:member  # Login with: member@rumahberbagi.com
 *   npm run test:e2e:staging:auth:author  # Login with: vika@rumahberbagi.com
 *   npm run test:e2e:staging:auth:admin   # Login with: admin@rumahberbagi.com
 *
 * 1. Run the npm script for the role you need
 * 2. Login with the email shown above in the browser that opens
 * 3. Close the browser - storage state is saved automatically
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
    console.warn('\nGenerate with: npm run test:e2e:staging:auth:<role>\n')
    console.warn('Staging emails:')
    console.warn('  member: member@rumahberbagi.com')
    console.warn('  author: vika@rumahberbagi.com')
    console.warn('  admin:  admin@rumahberbagi.com\n')
  }

  console.log('✓ Staging global setup complete')
}

export default globalSetup
