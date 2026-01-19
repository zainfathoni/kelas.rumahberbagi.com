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

## Commit Convention

Conventional Commits: `<type>[scope]: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Agent Instructions

Uses **bd** (beads) for issue tracking:

```bash
bd ready                           # Find available work
bd show <id>                       # View issue
bd update <id> --status in_progress  # Claim work
bd close <id>                      # Complete work
bd sync                            # Sync with git
```

### Session Completion

Work is NOT complete until `git push` succeeds:

1. Run quality gates if code changed
2. Commit changes
3. Update/close issues
4. **Push**: `git pull --rebase && bd sync && git push`

### Best Practices

- Check `bd ready` at session start to find available work
- Update status as you work (open → in_progress → closed)
- Create new issues with `bd create` when you discover tasks
  - Use descriptive titles and set appropriate priority/type
  - Link to parent issues using `--parent` flag when applicable
    - When not applicable, define `--id` explicitly with short semantic
      identifier
    - `--id` and `--parent` cannot be used together
  - Always add detailed descriptions using `--description` flag
- Always `bd sync` before ending session
