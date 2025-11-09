# VPS Deployment Guide - Hetzner Cloud with SQLite

This guide covers deploying the Kelas Rumah Berbagi Next.js/Remix application to
a Hetzner Cloud VPS with automated CI/CD using GitHub Actions.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Hetzner Cloud Setup](#hetzner-cloud-setup)
5. [Initial Server Configuration](#initial-server-configuration)
6. [Configuration Files](#configuration-files)
7. [GitHub Actions Setup](#github-actions-setup)
8. [Deployment Process](#deployment-process)
9. [Database & Backups](#database--backups)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Troubleshooting](#troubleshooting)
12. [Cost Summary](#cost-summary)

---

## Overview

This deployment uses:

- **VPS Provider**: Hetzner Cloud (€4.51/month)
- **OS**: Ubuntu 20.04 LTS (or later)
- **Application Server**: Node.js 18.x with Express
- **Process Manager**: PM2 (clustering, auto-restart, zero-downtime reload)
- **Reverse Proxy**: nginx (SSL termination, static file serving)
- **Database**: SQLite with WAL mode
- **SSL**: Let's Encrypt (free, auto-renewing)
- **CI/CD**: GitHub Actions (automated deployment on push)

### Architecture Diagram

```
GitHub Repository (main branch)
           ↓
    GitHub Actions (CI/CD)
           ↓
  Hetzner Cloud VPS (SSH Deploy)
           ↓
  ┌─────────────────────────┐
  │   Ubuntu 20.04 LTS      │
  │  ┌─────────────────┐    │
  │  │ nginx (port 443)│◄───┼──── HTTPS Requests
  │  │  + SSL/TLS      │    │
  │  └────────┬────────┘    │
  │           ↓             │
  │  ┌─────────────────┐    │
  │  │  PM2 Cluster    │    │
  │  │ (Node.js x N)   │    │
  │  └────────┬────────┘    │
  │           ↓             │
  │  ┌─────────────────┐    │
  │  │ SQLite Database │    │
  │  │  (prod.db)      │    │
  │  └─────────────────┘    │
  └─────────────────────────┘
```

### Key Benefits

- **Cost**: ~€4.50/month vs Vercel Pro €20/month
- **Control**: Full server access for customization
- **Performance**: No serverless cold starts
- **Simplicity**: PM2 + nginx (no Docker overhead)
- **Reliability**: Automated backups and monitoring
- **Updates**: Zero-downtime deployments

---

## Prerequisites

Before starting, ensure you have:

1. **Domain & DNS**

   - Domain: `kelas.rumahberbagi.com` owned and accessible
   - DNS: Can update DNS records to point to VPS IP
   - Current Status: ✅ Ready

2. **Mailgun**

   - API key configured and working
   - Domain verified for sending
   - Current Status: ✅ Ready

3. **GitHub Repository**

   - Access to push to main branch
   - Can create repository secrets
   - Current Status: ✅ Ready

4. **SSH Key Pair**

   - Already have or will generate during VPS creation
   - Can use for GitHub Actions secrets

5. **Development Environment**
   - Local git setup and terminal access
   - SSH client available

---

## Architecture

### Technology Stack

| Component       | Technology     | Version    | Purpose                         |
| --------------- | -------------- | ---------- | ------------------------------- |
| Framework       | Remix          | 1.2.2      | Web application                 |
| Runtime         | Node.js        | 18.x LTS   | JavaScript runtime              |
| Database        | SQLite         | 3.x        | Data storage                    |
| Server          | Express        | 4.x        | HTTP server                     |
| Process Manager | PM2            | 5.x        | Process management & clustering |
| Reverse Proxy   | nginx          | 1.x        | SSL termination, load balancing |
| SSL             | Let's Encrypt  | (auto)     | HTTPS certificates              |
| Deployment      | GitHub Actions | (built-in) | CI/CD pipeline                  |

### Data Flow

```
User Request (HTTPS)
    ↓
nginx (SSL termination, static files)
    ↓
PM2 Cluster (load balanced across cores)
    ↓
Express + Remix (request handling)
    ↓
Prisma ORM (query building)
    ↓
SQLite (data storage with WAL mode)
```

### File Locations

```
/var/www/app/
├── app/                          # Remix application source
├── build/                        # Built application (generated)
├── public/                       # Static files (courses, PDFs, etc)
├── prisma/
│   ├── prod.db                  # Production SQLite database
│   ├── prod.db-wal              # WAL checkpoint file
│   ├── prod.db-shm              # Shared memory file
│   └── schema.sqlite.prisma     # Database schema
├── server.vps.js                # Node.js entry point
├── ecosystem.config.js          # PM2 configuration
├── package.json
├── remix.config.vps.js          # Remix configuration
├── .env.production              # Production secrets (not in git)
└── logs/                        # PM2 logs

/etc/nginx/sites-available/
└── kelas.rumahberbagi.com       # nginx site configuration

/var/backups/kelas-db/           # Database backups
└── prod-YYYYMMDD.db

/etc/letsencrypt/
└── live/kelas.rumahberbagi.com/ # SSL certificates
```

---

## Hetzner Cloud Setup

### Step 1: Create Hetzner Account

1. Go to https://console.hetzner.cloud
2. Sign up or log in
3. Create a new project (e.g., "Kelas Rumah Berbagi")

### Step 2: Create VPS (Cloud Server)

1. **Click "Create Server"** in the Hetzner console
2. **Choose OS**: Ubuntu 20.04 LTS
3. **Choose Type**: CPX11 (1 vCPU, 2GB RAM, 40GB SSD) - €4.51/month recommended
   - Sufficient for your current data size (220 users)
   - Can scale to CPX21 if needed later
4. **Choose Location**: Choose closest to your users or primary location
5. **SSH Key**:
   - Option A: Create new key pair (Hetzner generates and downloads)
   - Option B: Add existing public key
   - ⚠️ **Important**: Save the SSH key securely on your local machine
6. **Server Name**: `kelas-rumahberbagi-01`
7. **Add Labels**: `app=kelas`, `environment=production` (optional but helpful)
8. **Click "Create & Buy Now"**

### Step 3: Access Your VPS

Once the server is created:

1. **Get Server IP**: Note the IP address from the console (e.g., `12.34.56.78`)
2. **SSH Connection**:
   ```bash
   # Using the downloaded key from Hetzner
   chmod 600 /path/to/hetzner-key
   ssh -i /path/to/hetzner-key root@12.34.56.78
   ```
3. **First Login**: You should now have shell access as root

### Step 4: Update DNS Records

1. **Get Server IP**: From Hetzner console
2. **Update DNS**: In your domain registrar:
   - **A record**: `kelas.rumahberbagi.com` → `12.34.56.78`
   - **CNAME record**: `www.kelas.rumahberbagi.com` → `kelas.rumahberbagi.com`
     (optional)
3. **Wait**: DNS propagation can take 5-30 minutes
4. **Test**: `ping kelas.rumahberbagi.com` should resolve to your VPS IP

---

## Initial Server Configuration

Run this on your Hetzner VPS to set up the environment.

### Step 1: System Updates

```bash
# Login as root and update system
ssh -i /path/to/hetzner-key root@your-vps-ip

# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y curl wget git vim htop

# Set timezone (if needed)
timedatectl set-timezone Asia/Jakarta
```

### Step 2: Install Node.js

```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should be v18.x.x
npm --version
```

### Step 3: Install System Dependencies

```bash
# Install nginx, SQLite, Certbot
apt install -y nginx sqlite3 certbot python3-certbot-nginx

# Verify sqlite3
sqlite3 --version

# Verify nginx
nginx -v
```

### Step 4: Install PM2 Globally

```bash
# Install PM2
npm install -g pm2

# Configure PM2 startup script
pm2 startup systemd -u root --hp /root
# This outputs a command - run it!

# Example output command (RUN THIS):
# sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root
```

### Step 5: Create Application User

```bash
# Create dedicated application user (security best practice)
useradd --system --home /var/www/app --shell /usr/sbin/nologin appuser

# Create app directory
mkdir -p /var/www/app
chown -R appuser:appuser /var/www/app
chmod 755 /var/www/app

# Create logs directory
mkdir -p /var/www/app/logs
chown -R appuser:appuser /var/www/app/logs
chmod 755 /var/www/app/logs

# Create backups directory
mkdir -p /var/backups/kelas-db
chown appuser:appuser /var/backups/kelas-db
chmod 755 /var/backups/kelas-db
```

### Step 6: Create Swap (Optional but Recommended)

For VPS with limited RAM, create swap:

```bash
# Create 2GB swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Configuration Files

These files need to be created/modified in your repository and deployed.

### File 1: `server.vps.js`

Replace the Vercel adapter with a standard Node.js server.

```javascript
import { createRequestHandler } from '@remix-run/node'
import { installGlobals } from '@remix-run/node'
import express from 'express'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'

// Install fetch, Request, Response etc on globalThis
installGlobals()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MODE = process.env.NODE_ENV || 'production'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(compression())

// Trust proxy (nginx is the reverse proxy)
app.set('trust proxy', 1)

// Static assets
// Serve static files with long cache headers
app.use(
  express.static(path.join(__dirname, 'public/build'), {
    maxAge: '1y',
    immutable: true,
  })
)

// Serve other public files with shorter cache
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }))

// Health check endpoint (useful for monitoring)
app.get('/_health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Remix request handler
import Build from './build/index.js'

const requestHandler = createRequestHandler({
  build: Build,
  mode: MODE,
})

app.all('*', requestHandler)

const server = app.listen(PORT, () => {
  console.log(`✅ App listening on http://localhost:${PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
```

### File 2: `remix.config.vps.js`

Remix configuration for Node.js server.

```javascript
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverBuildTarget: 'node-cjs',
  server: './server.vps.js',
  ignoredRouteFiles: ['.*'],
  serverModuleFormat: 'cjs',
  watchPaths: ['./tailwind.config.js'],
  future: {
    // Opt into all Remix v2 future features that don't break compatibility
    unstable_dev: false,
  },
}
```

### File 3: `ecosystem.config.js`

PM2 configuration for process management and clustering.

```javascript
module.exports = {
  apps: [
    {
      name: 'kelas-rumahberbagi',
      script: './server.vps.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart settings
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      // Grace period for shutdown
      kill_timeout: 5000,
      wait_ready: false,
      // Watch for changes (disable in production)
      watch: process.env.NODE_ENV !== 'production' ? ['app'] : false,
      ignore_watch: [
        'node_modules',
        'build',
        'logs',
        '.git',
        'public',
        '*.sqlite',
      ],
    },
  ],
}
```

### File 4: `nginx-site.conf`

Nginx configuration template (customize the domain).

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name kelas.rumahberbagi.com www.kelas.rumahberbagi.com;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name kelas.rumahberbagi.com www.kelas.rumahberbagi.com;

    # SSL Configuration (added by Certbot)
    ssl_certificate /etc/letsencrypt/live/kelas.rumahberbagi.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kelas.rumahberbagi.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/json application/javascript application/xml;
    gzip_min_length 1000;
    gzip_disable "msie6";

    # Static files with long cache
    location /build/ {
        alias /var/www/app/public/build/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Public assets with shorter cache
    location /files/ {
        alias /var/www/app/public/files/;
        expires 1y;
    }

    location /images/ {
        alias /var/www/app/public/images/;
        expires 1y;
    }

    # Health check endpoint (no logging)
    location = /_health {
        access_log off;
        proxy_pass http://localhost:3000;
    }

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}

# Redirect www to non-www (optional)
# server {
#     listen 443 ssl http2;
#     server_name www.kelas.rumahberbagi.com;
#     ssl_certificate /etc/letsencrypt/live/kelas.rumahberbagi.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/kelas.rumahberbagi.com/privkey.pem;
#     return 301 https://kelas.rumahberbagi.com$request_uri;
# }
```

### File 5: `.env.production.example`

Environment variables template (copy to `.env.production` on server).

```bash
# Node Environment
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="file:./prisma/prod.db"

# Session Secrets (generate with: openssl rand -base64 32)
SESSION_SECRET="your-secret-here-min-32-chars"
MAGIC_LINK_SECRET="another-secret-here-min-32-chars"

# Mailgun Configuration
MAILGUN_SENDING_KEY="key-xxxxxxxxxxxxxxxxxxxx"
MAILGUN_DOMAIN="mg.yourdomain.com"

# Application URL
APP_URL="https://kelas.rumahberbagi.com"
```

---

## GitHub Actions Setup

### Step 1: Prepare VPS SSH Key

On your local machine:

```bash
# If you have the Hetzner-generated key, skip this
# Otherwise, generate a new SSH key for GitHub Actions:
ssh-keygen -t ed25519 -C "github-actions@kelas" -f ~/.ssh/kelas-deploy -N ""

# You now have:
# ~/.ssh/kelas-deploy (private key)
# ~/.ssh/kelas-deploy.pub (public key)
```

### Step 2: Add SSH Key to VPS

```bash
# As root on the VPS:
mkdir -p /home/appuser/.ssh
cat >> /home/appuser/.ssh/authorized_keys <<EOF
# Copy the contents of ~/.ssh/kelas-deploy.pub here
EOF

# Set permissions
chmod 700 /home/appuser/.ssh
chmod 600 /home/appuser/.ssh/authorized_keys
chown -R appuser:appuser /home/appuser/.ssh
```

### Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

| Secret Name           | Value                                     |
| --------------------- | ----------------------------------------- |
| `VPS_HOST`            | Your Hetzner VPS IP (e.g., `12.34.56.78`) |
| `VPS_USER`            | `appuser`                                 |
| `VPS_SSH_KEY`         | Private key from `~/.ssh/kelas-deploy`    |
| `MAILGUN_SENDING_KEY` | Your Mailgun API key                      |
| `MAILGUN_DOMAIN`      | Your Mailgun domain                       |
| `SESSION_SECRET`      | Generated: `openssl rand -base64 32`      |
| `MAGIC_LINK_SECRET`   | Generated: `openssl rand -base64 32`      |

### Step 4: Create GitHub Actions Workflow

Create `.github/workflows/deploy-vps.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]
  workflow_dispatch: # Allow manual trigger

jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests (if any)
        run: npm run test:ci || true
        continue-on-error: true

      - name: Build application
        run: npm run build

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          script: |
            set -e
            cd /var/www/app

            echo "📥 Pulling latest code..."
            git fetch origin
            git checkout main
            git reset --hard origin/main

            echo "📦 Installing dependencies..."
            npm ci --production

            echo "🔨 Building application..."
            npm run build

            echo "⚙️  Generating Prisma client..."
            npx prisma generate --schema=./prisma/schema.sqlite.prisma

            echo "🔄 Reloading PM2..."
            pm2 reload ecosystem.config.js --env production

            echo "✅ Deployment complete!"
            pm2 logs --lines 20

      - name: Deployment successful
        if: success()
        run: echo "✅ Deployment to VPS successful"

      - name: Deployment failed
        if: failure()
        run: echo "❌ Deployment failed"
```

---

## Deployment Process

### Initial Deployment

This happens once, to set up everything.

#### Step 1: Deploy Application Code

```bash
# On your VPS (as appuser)
cd /var/www/app

# Clone repository (if not already cloned)
git clone https://github.com/zainfathoni/kelas.rumahberbagi.com.git .

# Or if already cloned:
git fetch origin
git checkout main
git reset --hard origin/main
```

#### Step 2: Install Dependencies

```bash
# Install production dependencies only
npm ci --production
```

#### Step 3: Build Application

```bash
# Build the application
npm run build

# This generates:
# - /build/ directory with server code
# - /public/build/ with client code
```

#### Step 4: Setup Database

```bash
# Create Prisma directory (if needed)
mkdir -p prisma

# Generate Prisma client
npx prisma generate --schema=./prisma/schema.sqlite.prisma

# Copy production database (first time only)
# If migrating from MySQL:
# 1. MySQL dumps are in prisma/dumps/main/
# 2. Convert them using the conversion script
# 3. Copy prod.db to the app directory

# For now, if you have prod.db from MySQL migration:
cp /path/to/prod.db prisma/prod.db

# Set permissions
chmod 644 prisma/prod.db
chmod 755 prisma/
```

#### Step 5: Create Environment File

```bash
# Create .env.production
cat > .env.production <<EOF
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./prisma/prod.db"
SESSION_SECRET="$(openssl rand -base64 32)"
MAGIC_LINK_SECRET="$(openssl rand -base64 32)"
MAILGUN_SENDING_KEY="your-key-here"
MAILGUN_DOMAIN="mg.yourdomain.com"
EOF

# Set secure permissions (only appuser can read)
chmod 600 .env.production
```

#### Step 6: Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Verify it's running
pm2 status
pm2 logs --lines 50
```

#### Step 7: Configure nginx

On the VPS (as root):

```bash
# Copy nginx configuration
sudo cp nginx-site.conf /etc/nginx/sites-available/kelas.rumahberbagi.com

# Enable site
sudo ln -s /etc/nginx/sites-available/kelas.rumahberbagi.com \
           /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### Step 8: Setup SSL Certificate

```bash
# Get SSL certificate from Let's Encrypt
sudo certbot --nginx -d kelas.rumahberbagi.com -d www.kelas.rumahberbagi.com

# Test auto-renewal
sudo certbot renew --dry-run

# Certbot automatically modifies nginx config for you
```

#### Step 9: Verify Deployment

```bash
# Check application is running
pm2 status

# Check nginx is working
sudo systemctl status nginx

# Test application health
curl https://kelas.rumahberbagi.com/_health

# View logs
pm2 logs --lines 100
```

### Subsequent Deployments (via GitHub Actions)

After initial setup, GitHub Actions automatically:

1. Builds the application on every push to `main`
2. Connects to your VPS via SSH
3. Pulls latest code
4. Installs dependencies
5. Builds application
6. Reloads PM2 (zero-downtime restart)
7. Updates running application

No manual intervention needed!

### Manual Deployment (if needed)

If you want to manually deploy without pushing to main:

```bash
# SSH to VPS
ssh -i ~/.ssh/kelas-deploy appuser@your-vps-ip

# Go to app directory
cd /var/www/app

# Pull latest code
git fetch origin && git reset --hard origin/main

# Rebuild and reload
npm ci --production && npm run build
npx prisma generate --schema=./prisma/schema.sqlite.prisma
pm2 reload ecosystem.config.js --env production

# View logs
pm2 logs
```

---

## Database & Backups

### SQLite Production Database

#### File Locations

```
/var/www/app/prisma/prod.db       # Main database file
/var/www/app/prisma/prod.db-wal   # Write-Ahead Log checkpoint
/var/www/app/prisma/prod.db-shm   # Shared memory file
```

#### WAL Mode (Write-Ahead Logging)

SQLite automatically uses WAL mode for better concurrency:

```bash
# Check WAL mode is enabled
sqlite3 /var/www/app/prisma/prod.db "PRAGMA journal_mode;"
# Should output: wal
```

#### Database Maintenance

```bash
# Check database integrity
sqlite3 /var/www/app/prisma/prod.db "PRAGMA integrity_check;"

# Optimize database (defragmentation)
sqlite3 /var/www/app/prisma/prod.db "VACUUM;"

# Get database statistics
sqlite3 /var/www/app/prisma/prod.db "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"
```

### Automated Backups

#### Setup Backup Cron Job

As `appuser` on VPS:

```bash
# Edit crontab
crontab -e

# Add this line (daily backup at 2 AM):
0 2 * * * sqlite3 /var/www/app/prisma/prod.db ".backup '/var/backups/kelas-db/prod-$(date +\%Y\%m\%d).db'"

# Verify cron job
crontab -l
```

#### Manual Backup

```bash
# Create manual backup
sqlite3 /var/www/app/prisma/prod.db ".backup '/var/backups/kelas-db/prod-manual-$(date +%Y%m%d-%H%M%S).db'"

# List all backups
ls -lh /var/backups/kelas-db/
```

#### Backup Retention Policy

```bash
# Keep only last 30 days of backups
find /var/backups/kelas-db/ -name "prod-*.db" -type f -mtime +30 -delete

# Add to crontab as well:
# 0 3 * * * find /var/backups/kelas-db/ -name "prod-*.db" -type f -mtime +30 -delete
```

### Restoring from Backup

```bash
# List available backups
ls /var/backups/kelas-db/

# Stop application
pm2 stop ecosystem.config.js

# Restore from backup (replace date with actual backup)
cp /var/backups/kelas-db/prod-20240115.db /var/www/app/prisma/prod.db

# Restart application
pm2 start ecosystem.config.js --env production
```

---

## Monitoring & Maintenance

### PM2 Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Process list with details
pm2 list

# Show all logs
pm2 logs

# Show logs for specific app
pm2 logs kelas-rumahberbagi

# Clear logs
pm2 flush

# Show process info
pm2 show kelas-rumahberbagi
```

### System Monitoring

```bash
# CPU, RAM, disk usage
htop

# Disk space
df -h

# Memory usage
free -h

# Process using most CPU/RAM
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
```

### Application Health Check

```bash
# Check application is responding
curl https://kelas.rumahberbagi.com/_health

# Monitor in real-time
watch -n 5 'curl -s https://kelas.rumahberbagi.com/_health'
```

### nginx Monitoring

```bash
# Check nginx status
sudo systemctl status nginx

# Test nginx configuration
sudo nginx -t

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Log Rotation

PM2 automatically rotates logs. To configure:

```bash
# Install pm2-logrotate module
pm2 install pm2-logrotate

# Configure rotation (max 10MB per file, keep 7 files)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Save PM2 config
pm2 save
```

### Performance Monitoring

```bash
# Monitor application memory over time
watch -n 5 'pm2 list'

# Check load average
uptime

# Monitor nginx connections
sudo netstat -tlnp | grep nginx
```

### Scheduled Maintenance Tasks

Create `/root/maintenance.sh`:

```bash
#!/bin/bash
# Daily maintenance tasks

# 1. Backup database (if cron not running)
sqlite3 /var/www/app/prisma/prod.db ".backup '/var/backups/kelas-db/prod-$(date +%Y%m%d).db'"

# 2. Cleanup old backups (keep 30 days)
find /var/backups/kelas-db/ -name "prod-*.db" -type f -mtime +30 -delete

# 3. Check database integrity
sqlite3 /var/www/app/prisma/prod.db "PRAGMA integrity_check;" | grep -v "ok" && echo "Database integrity check failed!"

# 4. Monitor disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
  echo "⚠️  Disk usage is above 80%"
fi

# 5. Check PM2 status
pm2 status

echo "✅ Maintenance completed at $(date)"
```

Make it executable and schedule:

```bash
chmod +x /root/maintenance.sh

# Add to root's crontab
sudo crontab -e
# Add: 0 3 * * * /root/maintenance.sh
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs kelas-rumahberbagi --err

# Check for errors
pm2 show kelas-rumahberbagi

# Restart in foreground to see errors
pm2 start server.vps.js --no-daemon

# Common issues:
# - PORT already in use: lsof -i :3000
# - Missing database file: ls -la prisma/prod.db
# - Bad .env file: source .env.production
```

### Database Lock Error

```
Error: database is locked
```

Solutions:

```bash
# 1. Check for locked processes
lsof /var/www/app/prisma/prod.db

# 2. Restart PM2 to release locks
pm2 restart ecosystem.config.js

# 3. Check database integrity
sqlite3 /var/www/app/prisma/prod.db "PRAGMA integrity_check;"

# 4. Reduce PM2 instances if it persists
# Edit ecosystem.config.js: instances: 2 (instead of "max")
pm2 reload ecosystem.config.js --env production
```

### nginx SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew

# Check SSL configuration
sudo openssl s_client -connect localhost:443

# Verify nginx can find cert
sudo ls -la /etc/letsencrypt/live/kelas.rumahberbagi.com/
```

### Database Connection Issues

```bash
# Test database connection
sqlite3 /var/www/app/prisma/prod.db "SELECT COUNT(*) FROM \"User\";"

# Check file permissions
ls -la /var/www/app/prisma/prod.db
ls -la /var/www/app/prisma/

# Should be owned by appuser with 644/755 permissions

# Fix permissions
sudo chown appuser:appuser /var/www/app/prisma/prod.db
sudo chmod 644 /var/www/app/prisma/prod.db
sudo chmod 755 /var/www/app/prisma/
```

### Slow Application Performance

```bash
# Check system resources
free -h  # RAM usage
df -h    # Disk usage
top      # CPU usage

# Check PM2 memory usage
pm2 monit

# Check database size
sqlite3 /var/www/app/prisma/prod.db "SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size();"

# Optimize database
sqlite3 /var/www/app/prisma/prod.db "VACUUM;"
sqlite3 /var/www/app/prisma/prod.db "ANALYZE;"
```

### GitHub Actions Deployment Fails

```bash
# Check GitHub Actions logs in your repo
# Repository → Actions → Latest workflow run → View logs

Common issues:
1. SSH key not set properly in GitHub secrets
2. VPS firewall blocking SSH (port 22)
3. appuser doesn't have write permissions
4. Application code has syntax errors

# SSH test from GitHub Actions (not possible directly)
# Instead, SSH to your VPS and check:
ssh appuser@your-vps-ip
cd /var/www/app
git status
npm run build  # Check for build errors
```

### Disk Space Running Out

```bash
# Check disk usage
df -h

# Find large files
du -sh /var/www/app/*

# Clean node_modules if needed
rm -rf /var/www/app/node_modules
npm ci --production

# Clean PM2 logs
pm2 flush

# Clean build artifacts (after confirming working version)
rm -rf /var/www/app/build/*
npm run build
```

### Rollback to Previous Version

```bash
# Check git log
git log --oneline -10

# Rollback to specific commit
git reset --hard <commit-hash>

# Rebuild and restart
npm run build
npx prisma generate --schema=./prisma/schema.sqlite.prisma
pm2 reload ecosystem.config.js --env production
```

---

## Cost Summary

### Monthly Operating Costs

| Service               | Provider      | Cost           | Notes              |
| --------------------- | ------------- | -------------- | ------------------ |
| VPS (2GB RAM, 1 vCPU) | Hetzner       | €4.51/month    | CPX11 server       |
| Domain                | Registrar     | $10-15/year    | Already owned      |
| SSL Certificate       | Let's Encrypt | Free           | Auto-renews        |
| Backups               | Included      | Free           | Local backups      |
| Email                 | Mailgun       | Free-€25/month | Already configured |
| **Total**             |               | **~€5/month**  | Minimal setup      |

### Comparison with Alternatives

| Platform        | Cost      | Notes                                |
| --------------- | --------- | ------------------------------------ |
| **Hetzner VPS** | €4.51     | ✅ Full control, no cold starts      |
| Vercel Pro      | €20/month | Serverless, automatic scaling        |
| AWS (small)     | $15-30    | Complex pricing, overkill for size   |
| DigitalOcean    | $6        | Slightly more expensive than Hetzner |

**Savings**: €180+ per year vs Vercel Pro

---

## Quick Reference Commands

### Deployment

```bash
# Manual deploy (when needed)
git push origin main  # GitHub Actions handles rest automatically

# Manual deployment without GitHub Actions
ssh -i ~/.ssh/kelas-deploy appuser@your-vps-ip
cd /var/www/app
git pull origin main
npm ci && npm run build
npx prisma generate --schema=./prisma/schema.sqlite.prisma
pm2 reload ecosystem.config.js --env production
```

### Monitoring

```bash
pm2 list                    # Show running processes
pm2 logs                    # Real-time application logs
pm2 monit                   # Real-time monitoring dashboard
pm2 show kelas-rumahberbagi # Process details
htop                        # System resources
```

### Maintenance

```bash
# Backup database
sqlite3 /var/www/app/prisma/prod.db ".backup '/var/backups/kelas-db/prod-$(date +%Y%m%d).db'"

# Check database integrity
sqlite3 /var/www/app/prisma/prod.db "PRAGMA integrity_check;"

# Optimize database
sqlite3 /var/www/app/prisma/prod.db "VACUUM;"

# Check disk space
df -h

# Check SSL certificate expiry
sudo certbot certificates
```

### Troubleshooting

```bash
# View PM2 error logs
pm2 logs --err

# Restart application
pm2 restart ecosystem.config.js

# Check nginx errors
sudo tail -f /var/log/nginx/error.log

# Verify database connection
sqlite3 /var/www/app/prisma/prod.db "SELECT COUNT(*) FROM \"User\";"
```

---

## Next Steps

1. **Create a Hetzner Account** and set up your VPS
2. **Configure DNS** to point to your VPS IP
3. **Run Initial Server Setup** using the commands above
4. **Prepare Configuration Files**:

   - `server.vps.js`
   - `remix.config.vps.js`
   - `ecosystem.config.js`
   - Create `.env.production` on the server

5. **Setup GitHub Actions**:

   - Add repository secrets
   - Create `.github/workflows/deploy-vps.yml`

6. **Initial Deployment**:

   - Follow the "Initial Deployment" section above
   - Test everything is working

7. **Monitor and Maintain**:
   - Set up automated backups
   - Monitor application health
   - Schedule regular maintenance

---

## Support & Resources

### Useful Links

- [Hetzner Cloud Documentation](https://docs.hetzner.cloud/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Let's Encrypt](https://letsencrypt.org/)
- [Remix Documentation](https://remix.run/docs)
- [Prisma SQLite](https://www.prisma.io/docs/reference/database-reference/supported-databases#sqlite)

### Common Issues & Solutions

See the [Troubleshooting](#troubleshooting) section above for common problems
and solutions.

### Need Help?

1. Check the troubleshooting section
2. Review nginx/PM2 error logs
3. Check GitHub Actions workflow logs
4. SSH to VPS and manually debug
5. Review application logs: `pm2 logs`
