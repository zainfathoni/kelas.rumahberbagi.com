# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Kelas Rumah Berbagi is an online course platform for Rumah Berbagi, built with
Remix framework. The project enables users to purchase and access online courses
with features for authentication, course management, and transactions.

## Key Commands

### Development

```bash
npm run dev                 # Start development server (uses dev.db)
npm run prod               # Start dev server with prod.db
npm run build              # Build for production
npm run start              # Start production server
```

The development server runs on <http://localhost:3000>

### Testing

```bash
# Unit tests (Jest)
npm test                   # Run tests (coverage in CI, standard run locally)
npm run test:coverage      # Run tests with coverage report
npm run test:watch         # Run tests in watch mode
npm run test:debug         # Debug tests with Node inspector

# E2E tests (Playwright)
npm run test:e2e          # Run Playwright tests (requires server)
npm run test:e2e:run      # Build, start server, and run E2E tests
npm run test:e2e:dev      # Run E2E tests against dev server
```

Playwright runs tests across multiple browsers/devices: Pixel 4 (Chromium),
iPhone 11 (WebKit), Desktop Firefox, Desktop Safari, and Desktop Chrome with JS
disabled.

### Code Quality

```bash
npm run lint               # Lint JS/TS/YAML files with ESLint
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format code with Prettier
npm run type-check        # TypeScript type checking
```

### Database Operations

The project uses **two Prisma schemas**:

- `prisma/schema.prisma` - MySQL schema (original)
- `prisma/schema.sqlite.prisma` - SQLite schema (current)

**Always specify `--schema=./prisma/schema.sqlite.prisma`** for local
development.

```bash
# Development database (dev.db)
npm run dev                                      # Auto-generates Prisma client for dev.db

# Production database (prod.db) - from MySQL dumps
npm run prod                                     # Auto-generates Prisma client for prod.db

# Database management
npx prisma studio --schema=./prisma/schema.sqlite.prisma                    # Open Prisma Studio
npx prisma db push --schema=./prisma/schema.sqlite.prisma                   # Push schema changes
npx prisma migrate dev --name <name> --schema=./prisma/schema.sqlite.prisma # Create migration
npx prisma migrate reset --force --schema=./prisma/schema.sqlite.prisma     # Reset DB and run seed
npx prisma generate --schema=./prisma/schema.sqlite.prisma                  # Generate Prisma Client
```

**Three SQLite databases**:

- `prisma/dev.db` - Development database (auto-generated)
- `prisma/test.db` - Testing database (E2E tests)
- `prisma/prod.db` - Production data migrated from MySQL dumps

### Initial Setup

```bash
npm run setup              # Install deps, reset DB, run E2E tests
npm run presetup          # Install Playwright browser dependencies
```

## Architecture

### Tech Stack

- **Framework**: Remix v1.2.2 (React 17, TypeScript)
- **Styling**: Tailwind CSS v3 with Headless UI components
- **Database**: SQLite with Prisma ORM v3.10.0
- **Authentication**: remix-auth with email magic link (remix-auth-email-link)
- **Testing**: Jest (unit), Playwright (E2E), MSW (API mocking)
- **Deployment**: Vercel (configured with `remix.config.js`)

### Database Schema

The data model follows this hierarchy:

```txt
User (email-based auth, roles)
├── Course[] (as author)
│   ├── Chapter[]
│   │   └── Lesson[]
│   │       └── Attachment[]
│   ├── Subscription[]
│   └── Transaction[]
├── Subscription[] (as subscriber)
└── Transaction[] (as purchaser)
```

**Key models**:

- **User**: Email, name, contact info (phone/telegram/instagram), role
- **Course**: Name, description, price, image, category (belongs to User author)
- **Chapter**: Name, order (belongs to Course)
- **Lesson**: Name, description, videoId, order (belongs to Chapter, has
  Attachments)
- **Subscription**: Links User to Course with status (approved author can see
  subscriber)
- **Transaction**: Payment tracking (bankName, bankAccountNumber, amount,
  datetime, status, notes)

All models use UUID primary keys and have createdAt/updatedAt timestamps.

### Directory Structure

```txt
app/
├── components/         # React components (organized by feature)
├── contexts/          # React contexts
├── models/            # Prisma model utilities and queries
├── routes/            # Remix file-based routing
│   ├── index.tsx     # Homepage
│   ├── login.tsx     # Email login
│   ├── magic.tsx     # Magic link handler
│   ├── logout.tsx    # Logout
│   └── dashboard/    # Protected dashboard routes
├── services/          # Business logic (auth, email, session, verifier)
├── utils/            # Utility functions
└── root.tsx          # Root layout

prisma/
├── schema.prisma           # MySQL schema (original)
├── schema.sqlite.prisma    # SQLite schema (current)
├── migrations/             # Migration files
├── seed.ts                # Seed data script
├── dumps/                 # Database dumps (gitignored)
│   ├── main/             # Original MySQL dumps
│   └── prod/             # Converted SQLite dumps
├── dev.db                # Development database
├── test.db               # Testing database
└── prod.db               # Production database

e2e/                    # Playwright E2E tests
├── fixtures/          # Test fixtures and data builders
└── *.spec.ts         # Test specs

scripts/                # Utility scripts
└── convert-mysql-dumps.js  # MySQL to SQLite dump converter
```

### Authentication System

Uses `remix-auth` with email magic link strategy:

1. User enters email on `/login`
2. System sends magic link via email
3. User clicks link, redirected to `/magic?code=...`
4. System verifies code and creates session
5. User redirected to `/dashboard`

Session managed via cookies (see `app/services/session.server.ts`).

### Routes Structure

- `/` - Public homepage
- `/login` - Email authentication
- `/magic` - Magic link verification
- `/logout` - Session termination
- `/dashboard` - Protected area (requires auth)
  - Nested routes for course management, profile, transactions, etc.

### Database Migration (MySQL → SQLite)

The project recently migrated from MySQL to SQLite. The conversion process:

1. Export MySQL dumps to `prisma/dumps/main/`
2. Run `node scripts/convert-mysql-dumps.js` to convert syntax
3. Create SQLite schema with Prisma
4. Import converted dumps in dependency order

**Key conversions**:

- Backticks → double quotes
- DateTime format: `YYYY-MM-DD HH:MM:SS.mmm` → `YYYY-MM-DDTHH:MM:SS.mmmZ`
- Remove MySQL-specific syntax (ENGINE, CHARSET, COLLATE)
- Quote reserved keywords (`order`, `Transaction`)

See `docs/database-migration.md` for full details.

## Development Practices

### Commit Convention

This project uses Conventional Commits with commitlint. All commits MUST follow
this format:

```txt
<type>[optional scope]: <description>
```

**Types**: `build`, `chore`, `docs`, `feat`, `fix`, `perf`, `refactor`, `style`,
`test`

**Scopes**: `assets`, `ci`, `cms`, `components`, `cypress`, `deps`, `dx`, `e2e`,
`fetcher`, `pages`, `security`, `seo`, `ui`

Component scopes: `donasi`, `education`, `home`, `json-ld`, `kontak-darurat`,
`layout`, `telemedicine`

Use [commitlint.io](https://commitlint.io/) if needed for assistance.

### Pull Request Template

When creating PRs, follow `.github/pull_request_template.md`:

```markdown
Closes #<issue-number>

## Description

<!-- Implementation plan and approach -->

## Current Tasks

- [ ] Task 1
- [ ] Task 2
```

**Important**: Never add Claude co-authorship to commit messages per user's
global instructions.

### Testing Strategy

- **Unit tests**: Jest with Testing Library for components and utilities
- **E2E tests**: Playwright for user flows across multiple browsers
- **Fixtures**: Use `@jackfranklin/test-data-bot` for test data generation
- **Mocking**: MSW for API mocking (work in progress)

Pre-commit hooks run:

- Jest tests on related files
- ESLint with auto-fix
- Prettier formatting

### Code Style

- ESLint configured for TypeScript, React, JSX a11y, Playwright
- Prettier for formatting
- Tailwind CSS for styling (no CSS modules)

## Important Notes

- **Database schema**: Always use `schema.sqlite.prisma` with `--schema` flag
  for local work
- **Environment**: Copy `.env.example` to `.env` before starting
- **Node version**: Requires Node.js >= 14
- **Git hooks**: Husky manages pre-commit hooks for linting and testing
- **Deployment**: Configured for Vercel (see `remix.config.js` and
  `vercel.json`)
- **GitHub Projects**: Issues tracked on
  [rbagi.id/board](https://rbagi.id/board)
- **Language**: Use English for all issues and PRs

## References

- [Remix Docs](https://remix.run/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Playwright Docs](https://playwright.dev)
- [Tailwind CSS](https://tailwindcss.com/)
- [Project Values](docs/values.md)
- [UML Diagrams](docs/diagrams.md)

## Agent Instructions

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get
started.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

### Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT
complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs
   follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:

   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```

5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
