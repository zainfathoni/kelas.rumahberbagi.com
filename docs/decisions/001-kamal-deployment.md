# ADR 001: Use Kamal for Production Deployment

## Status

Accepted

## Date

2026-01-01

## Context

The production site has been down since PlanetScale (MySQL) shutdown. We need to
deploy the application with the migrated SQLite database. The original plan was
to use a traditional VPS deployment with PM2 + nginx (documented in
`docs/vps-deployment.md`).

However, we have additional requirements:

1. **Multi-app hosting**: Want to host multiple applications on the same VPS
2. **High availability**: Future-proof for HA setup with multiple servers
3. **Consistent environments**: Avoid "works on my machine" issues
4. **Zero-downtime deployments**: Rolling deploys without manual intervention

## Decision

Use **Kamal** (formerly MRSK) for deployment instead of bare PM2 + nginx.

Kamal is a Docker-based deployment tool by 37signals (Basecamp/Hey.com) that:

- Orchestrates Docker containers across servers
- Manages Traefik as reverse proxy with automatic SSL
- Provides zero-downtime rolling deployments
- Supports multi-app hosting natively
- Makes HA setup straightforward (just add more servers)

## Alternatives Considered

### 1. PM2 + nginx (Original Plan)

**Pros:**

- Simple, well-understood
- Lower resource overhead (no Docker)
- Documented in `docs/vps-deployment.md`

**Cons:**

- Manual nginx configuration per app
- Complex HA setup
- Environment drift between dev and prod
- Manual SSL certificate management

### 2. Docker Compose

**Pros:**

- Container consistency
- Simple for single-server setups

**Cons:**

- No built-in deployment orchestration
- Manual SSL setup
- Limited multi-server support

### 3. Kubernetes

**Pros:**

- Industry standard for container orchestration
- Excellent HA and scaling

**Cons:**

- Massive overkill for this project size
- Significant operational complexity
- Higher resource requirements

## Consequences

### Positive

- **Future-proof**: Easy path to HA by adding servers to config
- **Consistent**: Same Docker image runs everywhere
- **Simple SSL**: Traefik handles Let's Encrypt automatically
- **Multi-app ready**: Each app gets its own `config/deploy.yml`
- **Zero-downtime**: Built-in rolling deployments

### Negative

- **Learning curve**: Need to learn Docker and Kamal basics
- **Ruby dependency**: Kamal requires Ruby to be installed locally
- **Resource overhead**: Docker adds ~100-200MB RAM overhead
- **Build time**: Multi-stage Docker builds take longer than direct deploys

### Neutral

- Obsoletes `docs/vps-deployment.md` (will be deleted)
- Need to create new documentation for Kamal workflow

## Implementation

1. Create `Dockerfile` with multi-stage build (Node 24)
2. Create `config/deploy.yml` for Kamal configuration
3. Set up Traefik for SSL/HTTPS
4. Use Docker volumes for SQLite persistence
5. Document in `docs/kamal-deployment.md`

## Future Work

- Add Litestream for SQLite replication (separate epic for HA)
- Add additional servers for redundancy
- Set up GitHub Actions for CI/CD with Kamal

## References

- [Kamal Documentation](https://kamal-deploy.org/)
- [37signals Kamal Announcement](https://world.hey.com/dhh/introducing-kamal-9330a267)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
