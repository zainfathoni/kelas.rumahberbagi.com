# Testing Principles and Methodologies

This document outlines the testing approach, principles, and best practices for
the Kelas Rumah Berbagi project.

## Testing Philosophy

We follow a practical testing approach that balances confidence with development
velocity:

1. **Test behavior, not implementation** - Focus on what the code does, not how
   it does it
2. **Write tests that give confidence** - Prioritize tests that catch real bugs
3. **Keep tests maintainable** - Tests should be easy to read, write, and update
4. **Test at the right level** - Use the testing pyramid as a guide

## Testing Stack

| Tool            | Purpose              | Location            |
| --------------- | -------------------- | ------------------- |
| Vitest          | Unit testing         | `app/**/__tests__/` |
| Testing Library | Component testing    | `app/**/__tests__/` |
| Playwright      | End-to-end testing   | `e2e/`              |
| MSW             | API mocking          | `mocks/`            |
| test-data-bot   | Test data generation | `e2e/fixtures/`     |

## Unit Testing with Vitest

### Configuration

Vitest is configured in `vitest.config.ts` with:

- JSDOM environment for browser-like testing
- Global test utilities (no imports needed for `describe`, `it`, `expect`)
- Path aliases (`~` for app, `#test` for test utilities)
- Coverage thresholds for code quality enforcement

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Writing Unit Tests

#### File Organization

Place tests in `__tests__` directories adjacent to the code being tested:

```
app/
  components/
    alerts.tsx
    __tests__/
      alert.test.tsx
  utils/
    whatsapp.ts
    __tests__/
      whatsapp.test.ts
```

#### Test Structure

Follow the Arrange-Act-Assert pattern:

```typescript
import { render, screen } from '@testing-library/react'
import { Alert } from '~/components/alerts'

describe('Alert', () => {
  it('renders the alert content correctly', () => {
    // Arrange
    render(<Alert>Link telah dikirim ke alamat email Anda</Alert>)

    // Act (often implicit for render tests)

    // Assert
    expect(
      screen.getByText('Link telah dikirim ke alamat email Anda')
    ).toBeVisible()
  })
})
```

#### Best Practices

1. **Use descriptive test names** - Test names should describe the expected
   behavior
2. **One assertion per test** (when practical) - Makes failures easier to
   diagnose
3. **Avoid testing implementation details** - Test the public API, not internal
   state
4. **Use Testing Library queries** - Prefer `getByRole`, `getByLabelText` over
   `getByTestId`

## Component Testing with Testing Library

### Query Priority

Use queries that resemble how users interact with your app:

1. `getByRole` - Accessible elements (buttons, headings, etc.)
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - When label is not available
4. `getByText` - Non-interactive elements
5. `getByTestId` - Last resort

### Example

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('LoginForm', () => {
  it('submits form with email', async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockSubmit} />)

    // Query by role (preferred)
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const submitButton = screen.getByRole('button', { name: /kirim/i })

    // Simulate user interaction
    await user.type(emailField, 'test@example.com')
    await user.click(submitButton)

    expect(mockSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })
})
```

## End-to-End Testing with Playwright

### Configuration

Playwright is configured in `playwright.config.ts` with multiple browser
profiles:

| Project   | Browser  | Device  | Purpose                     |
| --------- | -------- | ------- | --------------------------- |
| Pixel 4   | Chromium | Mobile  | Mobile Chrome experience    |
| iPhone 11 | WebKit   | Mobile  | iOS Safari experience       |
| firefox   | Firefox  | Desktop | Desktop Firefox             |
| webkit    | WebKit   | Desktop | Desktop Safari              |
| noscript  | Chromium | Desktop | JavaScript disabled testing |

### Running E2E Tests

```bash
# Run E2E tests (requires server running)
npm run test:e2e

# Build, start server, and run tests
npm run test:e2e:run

# Run against dev server (for development)
npm run test:e2e:dev
```

### Writing E2E Tests

#### Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Public pages', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Rumah Berbagi/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Masuk ke akun Anda')).toBeVisible()
  })
})
```

#### Using Testing Library with Playwright

For enhanced queries, use the `@playwright-testing-library/test` integration:

```typescript
import { test } from './base-test'

test('login flow', async ({ page, queries: { getByRole } }) => {
  await page.goto('/login')

  const emailField = await getByRole('textbox', { name: /alamat email/i })
  await emailField.fill('user@example.com')
})
```

#### Authentication States

Store authentication states in `e2e/fixtures/auth/`:

```typescript
// Use public state (not logged in)
test.use({
  storageState: 'e2e/fixtures/auth/public.json',
})

// Use authenticated state
test.use({
  storageState: 'e2e/fixtures/auth/member.json',
})
```

### Best Practices

1. **Test user journeys** - Focus on complete user flows
2. **Use locators that resist change** - Prefer roles and labels over selectors
3. **Wait for elements properly** - Use Playwright's built-in waiting
4. **Test across browsers** - The multi-browser config ensures compatibility
5. **Include noscript tests** - Verify progressive enhancement works

## Test Data Generation

### Using test-data-bot

For generating consistent test data, use `@jackfranklin/test-data-bot`:

```typescript
import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { generateId } from '~/utils/nanoid'

const userBuilder = build('User', {
  fields: {
    id: perBuild(() => generateId()),
    email: fake((f) => f.internet.email()),
    name: fake((f) => f.name.fullName()),
  },
})

// In tests
const user = userBuilder()
const specificUser = userBuilder({ overrides: { email: 'specific@test.com' } })
```

### Fixture Files

For E2E tests, use JSON fixture files in `e2e/fixtures/`:

```
e2e/fixtures/
  auth/
    public.json        # Unauthenticated state
    member.json        # Authenticated member state
  users/
    member.local.json  # Test user data
```

## Mocking Strategies

### MSW for API Mocking

Mock Service Worker (MSW) intercepts network requests for isolated testing:

```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('/api/login', (req, res, ctx) => {
    return res(ctx.json({ user: { id: '1', email: 'test@example.com' } }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Module Mocking

For mocking modules in Vitest:

```typescript
import { vi } from 'vitest'

// Mock a module
vi.mock('~/services/email.server', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}))
```

## Coverage Requirements

The project enforces minimum coverage thresholds:

| Metric     | Minimum |
| ---------- | ------- |
| Statements | 17%     |
| Branches   | 9%      |
| Functions  | 22%     |
| Lines      | 17%     |

Coverage is checked automatically in CI. Run locally with:

```bash
npm run test:coverage
```

## Pre-commit Hooks

Tests run automatically on commit via Husky and lint-staged:

- **Related tests** - Only tests affected by changed files run
- **ESLint** - Linting with auto-fix
- **Prettier** - Code formatting

This ensures code quality without slowing down development.

## CI/CD Integration

Tests run in the CI pipeline with:

1. **Unit tests** - Run with coverage reporting
2. **E2E tests** - Run against test database with full browser matrix
3. **Type checking** - TypeScript compilation check
4. **Linting** - ESLint verification

## Troubleshooting

### Common Issues

**Tests fail with "element not found"**

- Use `await` with async queries
- Check if element is conditionally rendered
- Use `waitFor` or `findBy` queries for async content

**Flaky E2E tests**

- Add proper waits for network requests
- Use `waitForLoadState` after navigation
- Avoid hardcoded timeouts

**Coverage thresholds not met**

- Focus on testing critical paths
- Add tests for untested error handling
- Check coverage report for gaps

### Debugging

```bash
# Debug unit tests
npm run test:debug

# Run Playwright with UI for debugging
npx playwright test --ui

# Generate trace for failed tests
npx playwright test --trace on
```

## References

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/)
- [test-data-bot](https://github.com/jackfranklin/test-data-bot)
