# ADR 002: Multi-Brand Architecture

## Status

Proposed

## Date

2026-01-11

## Context

The current codebase powers `kelas.rumahberbagi.com`, an online course platform
for parenting and homeschooling content. We want to reuse the same codebase for
additional brands with different content verticals (e.g., programming, Bitcoin
education).

Key requirements:

1. **Data isolation**: Each brand should have its own database (users, courses,
   transactions are brand-specific)
2. **Brand identity**: Each site needs its own logo, colors, copy, and email
   templates
3. **Shared codebase**: Minimize duplication; one repository for all brands
4. **Independent deployment**: Brands can be deployed/scaled independently
5. **Simple operations**: Easy to add new brands without major refactoring

## Decision

Use **separate deployments with environment-based brand configuration**.

Each brand runs as an independent Kamal deployment with:

- Its own SQLite database
- Brand-specific environment variables
- Separate domain and SSL certificate

```
┌─────────────────────────────────────────────────────────────────┐
│                    Shared Git Repository                         │
│                                                                   │
│  app/config/brand.ts ← reads from environment variables          │
│                                                                   │
├───────────────────────────┬───────────────────────────────────────┤
│  Kamal Deploy A           │  Kamal Deploy B                       │
│  kelas.rumahberbagi.com   │  kelas.bitcoinschool.com              │
│                           │                                       │
│  config/deploy.yml        │  config/deploy.bitcoinschool.yml      │
│  /data/kelas/db/prod.db   │  /data/bitcoinschool/db/prod.db       │
│                           │                                       │
│  BRAND_ID=rumahberbagi    │  BRAND_ID=bitcoinschool               │
│  BRAND_NAME=Rumah Berbagi │  BRAND_NAME=Bitcoin School            │
│  BRAND_PRIMARY_COLOR=...  │  BRAND_PRIMARY_COLOR=...              │
└───────────────────────────┴───────────────────────────────────────┘
```

## Alternatives Considered

### 1. Single Database with Tenant Column

Add a `brandId` column to all relevant tables:

```prisma
model Course {
  brandId String  // "rumahberbagi" | "bitcoinschool"
  // ... existing fields
}
```

**Pros:**

- Single deployment to manage
- Users could access multiple brands with one account
- Simpler infrastructure

**Cons:**

- Must add `where: { brandId }` to every query (easy to forget → data leakage)
- Harder to scale brands independently
- Mixing unrelated business data complicates backups/compliance
- More complex authorization logic
- Schema migrations affect all brands simultaneously

### 2. Monorepo with Separate Apps

```
/packages
  /core          # shared models, utils, components
  /ui            # shared UI components
/apps
  /rumahberbagi  # brand-specific app
  /bitcoinschool # brand-specific app
```

**Pros:**

- Maximum flexibility per brand
- Can diverge features significantly
- Clear separation of brand-specific code

**Cons:**

- Most complex setup (Turborepo/Nx overhead)
- More maintenance overhead
- Overkill if brands stay similar
- Duplicated deployment configurations

### 3. Git Branches per Brand

Each brand maintained in a separate long-lived branch.

**Pros:**

- Simple mental model
- Complete independence

**Cons:**

- Merge conflicts nightmare
- Bug fixes must be cherry-picked to all branches
- Divergence over time makes merging impossible
- Not recommended for any serious project

## Implementation Plan

### Phase 1: Extract Brand Configuration

Create a centralized brand configuration module:

```typescript
// app/config/brand.server.ts
export interface BrandConfig {
  id: string
  name: string
  tagline: string
  domain: string
  logo: {
    src: string
    alt: string
  }
  logoText?: {
    src: string
    alt: string
  }
  colors: {
    primary: string // Tailwind color name, e.g., "indigo"
    accent: string
  }
  email: {
    from: string
    loginSubject: string
  }
  social: {
    instagram?: string
    telegram?: string
    whatsapp?: string
  }
  content: {
    heroTitle: string
    heroSubtitle: string
    heroDescription: string
  }
}

function getBrandConfig(): BrandConfig {
  const brandId = process.env.BRAND_ID || 'rumahberbagi'

  // Could also load from JSON files: brands/rumahberbagi.json
  const brands: Record<string, BrandConfig> = {
    rumahberbagi: {
      id: 'rumahberbagi',
      name: 'Rumah Berbagi',
      tagline: 'Kelas Rumah Berbagi',
      domain: 'kelas.rumahberbagi.com',
      logo: {
        src: '/rumah-berbagi.svg',
        alt: 'Logo Rumah Berbagi',
      },
      logoText: {
        src: '/rumah-berbagi-text.svg',
        alt: 'Teks Rumah Berbagi',
      },
      colors: {
        primary: 'indigo',
        accent: 'purple',
      },
      email: {
        from: 'Rumah Berbagi <admin@rumahberbagi.com>',
        loginSubject: 'Link login untuk Kelas Rumah Berbagi',
      },
      social: {
        instagram: 'rumahberbagi',
      },
      content: {
        heroTitle: 'Tahun Prasekolahku',
        heroSubtitle: 'Kelas Rumah Berbagi',
        heroDescription:
          'Membangun fondasi pendidikan prasekolah (0-6 tahun), menguatkan akar masa depan.',
      },
    },
    bitcoinschool: {
      id: 'bitcoinschool',
      name: 'Bitcoin School',
      tagline: 'Learn Bitcoin',
      domain: 'kelas.bitcoinschool.com',
      logo: {
        src: '/bitcoin-school.svg',
        alt: 'Bitcoin School Logo',
      },
      colors: {
        primary: 'orange',
        accent: 'amber',
      },
      email: {
        from: 'Bitcoin School <admin@bitcoinschool.com>',
        loginSubject: 'Login link for Bitcoin School',
      },
      social: {
        telegram: 'bitcoinschool',
      },
      content: {
        heroTitle: 'Master Bitcoin',
        heroSubtitle: 'Bitcoin School',
        heroDescription:
          'From zero to Bitcoin developer. Learn the technology that is changing the world.',
      },
    },
  }

  return brands[brandId] || brands.rumahberbagi
}

export const brand = getBrandConfig()
```

### Phase 2: Update Components

Replace hardcoded brand references with config values:

| File                                 | Current                             | After                         |
| ------------------------------------ | ----------------------------------- | ----------------------------- |
| `app/components/logo.tsx`            | Hardcoded image paths               | `brand.logo.src`              |
| `app/components/header.tsx`          | "Rumah Berbagi" text                | `brand.name`                  |
| `app/components/footer.tsx`          | Hardcoded social links              | `brand.social.*`              |
| `app/components/sections/hero.tsx`   | Hardcoded titles                    | `brand.content.*`             |
| `app/services/email.server.tsx`      | Hardcoded email subject/from        | `brand.email.*`               |
| `app/root.tsx`                       | Hardcoded meta tags                 | `brand.name`, `brand.tagline` |

### Phase 3: Create Brand-Specific Kamal Configs

```yaml
# config/deploy.bitcoinschool.yml
service: bitcoinschool

image: zainfathoni/kelas-bitcoinschool

servers:
  web:
    hosts:
      - 103.235.75.227 # Same or different VPS
    options:
      volume:
        - /data/bitcoinschool/db:/app/prisma

proxy:
  ssl: true
  host: kelas.bitcoinschool.com
  app_port: 3000

env:
  clear:
    NODE_ENV: production
    PORT: '3000'
    DATABASE_URL: file:/app/prisma/prod.db
    BRAND_ID: bitcoinschool
  secret:
    - SESSION_SECRET
    - MAGIC_LINK_SECRET
    - MAILGUN_SENDING_KEY
    - MAILGUN_DOMAIN
```

### Phase 4: CI/CD Updates

Add workflow triggers for each brand:

```yaml
# .github/workflows/deploy-bitcoinschool.yml
on:
  push:
    branches: [main]
    paths:
      - 'app/**'
      - 'config/deploy.bitcoinschool.yml'

jobs:
  deploy:
    steps:
      - run: kamal deploy -c config/deploy.bitcoinschool.yml
```

## Files Requiring Updates

Based on grep for "Rumah Berbagi" and "rumahberbagi":

### High Priority (User-Facing)

- `app/components/logo.tsx` - Logo images
- `app/components/header.tsx` - Site name
- `app/components/footer.tsx` - Footer text, social links
- `app/components/sections/hero.tsx` - Hero content
- `app/components/sections/pricing.tsx` - Pricing section
- `app/components/sections/timeline.tsx` - Timeline content
- `app/services/email.server.tsx` - Email sender, subject
- `app/routes/_index.tsx` - Homepage meta
- `app/routes/login.tsx` - Login page text

### Low Priority (Can Keep As-Is Initially)

- `app/utils/whatsapp.ts` - WhatsApp link generation
- `README.md`, `CLAUDE.md` - Documentation
- Test files, snapshots

## Consequences

### Positive

- **Complete data isolation**: Each brand has its own database, no risk of data
  leakage
- **Independent scaling**: Brands can be deployed to different servers as needed
- **Simple mental model**: One deployment = one brand = one database
- **Leverages existing Kamal setup**: ADR-001 already supports multi-app on same
  VPS
- **Minimal code changes**: Only need to extract ~15-20 files worth of brand
  references
- **Future-proof**: Easy to add more brands by adding config + deploy file

### Negative

- **No shared accounts**: Users must register separately for each brand (usually
  fine for different businesses)
- **Multiple deployments to manage**: Each brand is a separate Kamal deployment
- **Config duplication**: Some Kamal config is duplicated per brand (mitigated
  by YAML anchors or shared secrets)

### Neutral

- Schema migrations run separately per brand (actually positive for isolation)
- Each brand can have different feature flags if needed

## Migration Path

For existing `kelas.rumahberbagi.com`:

1. Implement brand config with `rumahberbagi` as default
2. Replace hardcoded values with config references
3. Test thoroughly - existing behavior should be unchanged
4. Deploy to production
5. For new brand: add brand config, create deploy file, deploy

## Open Questions

1. **Shared assets**: Should brand logos be in `public/brands/{brandId}/` or
   configured via CDN URLs?
2. **Localization**: If brands need different languages, should we use i18n
   library or keep it simple with config strings?
3. **Feature flags**: Do different brands need different features enabled? If
   so, add `features: { courseComments: true }` to config.

## References

- [ADR 001: Kamal Deployment](001-kamal-deployment.md)
- [Kamal Multi-App Setup](https://kamal-deploy.org/docs/configuration/multiple-apps/)
- [12-Factor App: Config](https://12factor.net/config)
