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
 * To create auth fixtures for staging, use Playwright codegen with --save-storage:
 *
 *   npx playwright codegen https://staging.kelas.rumahberbagi.com \
 *     --save-storage=e2e/fixtures/auth/staging/member.staging.json
 *
 * 1. Run the codegen command above
 * 2. Login manually in the browser that opens
 * 3. Close the browser - storage state is saved automatically
 * 4. Repeat for each role (member, author, admin)
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
      '\nGenerate with: npx playwright codegen https://staging.kelas.rumahberbagi.com --save-storage=<path>\n'
    )
  }

  console.log('✓ Staging global setup complete')
}

export default globalSetup
