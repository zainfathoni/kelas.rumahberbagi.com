/**
 * Fixture path helpers for E2E tests.
 * Automatically selects local or staging fixtures based on PLAYWRIGHT_BASE_URL or BASE_URL.
 *
 * The staging config sets PLAYWRIGHT_BASE_URL via the use.baseURL config.
 * We also check process.argv for --config=staging to detect staging runs.
 */

const isStaging =
  process.env.PLAYWRIGHT_BASE_URL?.includes('staging') ??
  process.env.BASE_URL?.includes('staging') ??
  process.argv.some((arg) => arg.includes('staging')) ??
  false

type AuthFixture =
  | 'member'
  | 'member-edit'
  | 'member-no-transaction'
  | 'author'
  | 'admin'
  | 'public'
  | 'nobody'

type DataFixture = 'users' | 'transactions'

/**
 * Get the auth fixture path for the current environment.
 * Falls back to 'member' for staging if the specific fixture doesn't exist.
 */
export function getAuthFixture(name: AuthFixture): string {
  if (isStaging) {
    const stagingFixtures = ['member', 'author', 'admin']
    const fixtureName = stagingFixtures.includes(name) ? name : 'member'
    return `e2e/fixtures/auth/staging/${fixtureName}.staging.json`
  }
  return `e2e/fixtures/auth/${name}.local.json`
}

/**
 * Get the data fixture path for the current environment.
 */
export function getDataFixturePath(type: DataFixture, name: string): string {
  const suffix = isStaging ? 'staging' : 'local'
  return `../../e2e/fixtures/${type}/${name}.${suffix}.json`
}

/**
 * Check if running against staging environment.
 * Can be used as a boolean or as a callback for test.skip()
 */
export const isStagingEnv = (): boolean => isStaging

/**
 * Auth fixture paths for direct use in test.use()
 */
export const authFixtures = {
  member: getAuthFixture('member'),
  memberEdit: getAuthFixture('member-edit'),
  memberNoTransaction: getAuthFixture('member-no-transaction'),
  author: getAuthFixture('author'),
  admin: getAuthFixture('admin'),
  public: isStaging
    ? 'e2e/fixtures/auth/public.json'
    : 'e2e/fixtures/auth/public.json',
  nobody: isStaging
    ? 'e2e/fixtures/auth/nobody.json'
    : 'e2e/fixtures/auth/nobody.json',
}
