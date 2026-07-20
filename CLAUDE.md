# CLAUDE.md

## Project Overview

Kelas Rumah Berbagi - an online course platform built with Remix. Users purchase
and access courses with email magic link authentication.

## Commands

```bash
# Development
npm run dev              # Dev server with dev.db (localhost:3000)
npm run prod             # Dev server with prod.db
npm run build            # Production build

# Testing
npm test                 # Vitest unit tests
npm run test:e2e:run     # Playwright E2E tests
npm run test:e2e:staging # E2E tests against staging (requires auth fixtures)

# Code Quality
npm run lint             # ESLint
npm run type-check       # TypeScript check
npm run format           # Prettier

# Database
npx prisma studio        # Browse database
npx prisma migrate dev --name <name>  # Create migration
```

## Tech Stack

- **Framework**: Remix v2 (React 18, TypeScript)
- **Styling**: Tailwind CSS v3, Headless UI
- **Database**: SQLite with Prisma v5
- **Auth**: remix-auth with email magic link
- **Testing**: Vitest (unit), Playwright (E2E)
- **Deployment**: Kamal 2.0 with Docker to VPS
- **Node**: v24+ (Volta managed)

## Database

Schema at `prisma/schema.prisma`. Three SQLite databases:

- `prisma/dev.db` - Development
- `prisma/test.db` - E2E tests
- `prisma/prod.db` - Production data

Key models: User → Course → Chapter → Lesson → Attachment, plus Subscription,
Transaction, Content, Consumption, AuditLog.

## Routes

- `/` - Homepage
- `/login` → `/magic` - Email magic link auth
- `/dashboard/*` - Protected course management

## Testing Gotchas

### Mock emails must not use burner domains

The `burner-email-providers` package blocks domains like `@example.com` during
login. Mock/seed data must use a non-burner domain (e.g. `@rumahberbagi.test`).
If e2e login tests fail silently (no magic link sent, no error logged), check
the email domain first.

### MSW and Remix bundling

MSW v2 interceptors break when bundled by Remix's esbuild. Instead of relying on
MSW to intercept API calls in e2e mode, the app writes the magic link fixture
directly when `RUNNING_E2E=true` (see `email.server.tsx`).

## Commit Convention

Conventional Commits: `<type>[scope]: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
