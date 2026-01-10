# Deployment

This project uses [Kamal 2.0](https://kamal-deploy.org/) for production
deployment.

## Overview

- **Production URL**: <https://kelas.rumahberbagi.com>
- **VPS**: 103.235.75.227 (Jetorbit)
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **SSL**: Managed by kamal-proxy (Let's Encrypt)

## CI/CD Pipeline

Deployment is automated via GitHub Actions:

1. Push to `main` branch triggers the deploy workflow
2. All tests must pass (lint, type-check, unit tests, E2E tests)
3. Docker image is built with layer caching
4. Image is pushed to GitHub Container Registry
5. Kamal deploys to production VPS

## Required GitHub Secrets

Configure these secrets in your repository settings
(`Settings > Secrets and variables > Actions`):

| Secret                    | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `SSH_PRIVATE_KEY`         | SSH private key for accessing the VPS                    |
| `KAMAL_REGISTRY_PASSWORD` | GitHub Personal Access Token with `write:packages` scope |
| `SESSION_SECRET`          | Session encryption secret                                |
| `MAGIC_LINK_SECRET`       | Magic link email authentication secret                   |
| `MAILGUN_SENDING_KEY`     | Mailgun API key for sending emails                       |
| `MAILGUN_DOMAIN`          | Mailgun domain (e.g., `mg.rumahberbagi.com`)             |

### SSH Key Setup

1. Generate an SSH key pair (if not already done):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/kamal_deploy
   ```

2. Add the public key to the VPS:

   ```bash
   ssh-copy-id -i ~/.ssh/kamal_deploy.pub root@103.235.75.227
   ```

3. Add the private key content to GitHub secret `SSH_PRIVATE_KEY`

### GitHub Container Registry Token

1. Create a Personal Access Token at <https://github.com/settings/tokens>
2. Select scope: `write:packages`
3. Add the token to GitHub secret `KAMAL_REGISTRY_PASSWORD`

## Manual Deployment

Deploy manually from your local machine:

```bash
# Set up secrets in .kamal/secrets (see .kamal/secrets.example)
kamal deploy
```

## Configuration Files

- `config/deploy.yml` - Kamal deployment configuration
- `.github/workflows/deploy.yml` - CI/CD workflow
- `Dockerfile` - Multi-stage Docker build

## Rollback

To rollback to a previous version:

```bash
kamal rollback <version>
```

## Logs

View application logs:

```bash
kamal app logs
```

## Database Backups

See [backup-setup.md](backup-setup.md) for database backup configuration.
