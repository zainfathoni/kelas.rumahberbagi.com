# Database Backup Setup

This document describes how to set up automated backups for the SQLite database.

## Overview

- **Database location**: `/data/kelas/db/prod.db` (Docker volume mount)
- **Backup location**: `/var/backups/kelas-db/`
- **Retention**: 30 days
- **Schedule**: Daily at 3:00 AM

## Setup Instructions (on VPS)

Get the VPS host from `config/deploy.yml` or set it:

```bash
VPS_HOST="root@$(grep -A2 'hosts:' config/deploy.yml | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')"
```

### 1. Copy scripts to server

```bash
scp scripts/backup-db.sh scripts/restore-db.sh ${VPS_HOST}:/usr/local/bin/
```

### 2. Make scripts executable

```bash
ssh ${VPS_HOST} "chmod +x /usr/local/bin/backup-db.sh /usr/local/bin/restore-db.sh"
```

### 3. Install sqlite3 (recommended for safe backups)

```bash
ssh ${VPS_HOST} "apt-get update && apt-get install -y sqlite3"
```

### 4. Set up cron job

```bash
ssh ${VPS_HOST} 'echo "0 3 * * * /usr/local/bin/backup-db.sh >> /var/log/kelas-backup.log 2>&1" | crontab -'
```

Or manually add to crontab:

```bash
ssh ${VPS_HOST} "crontab -e"
```

Add this line:

```
0 3 * * * /usr/local/bin/backup-db.sh >> /var/log/kelas-backup.log 2>&1
```

### 5. Create backup directory

```bash
ssh ${VPS_HOST} "mkdir -p /var/backups/kelas-db"
```

### 6. Test backup manually

```bash
ssh ${VPS_HOST} "/usr/local/bin/backup-db.sh"
```

## Manual Operations

### Create a backup now

```bash
ssh ${VPS_HOST} "/usr/local/bin/backup-db.sh"
```

### List backups

```bash
ssh ${VPS_HOST} "ls -lh /var/backups/kelas-db/"
```

### Restore from backup

```bash
# Restore most recent backup
ssh ${VPS_HOST} "/usr/local/bin/restore-db.sh"

# Restore specific backup
ssh ${VPS_HOST} "/usr/local/bin/restore-db.sh /var/backups/kelas-db/prod_20260110_030000.db"
```

### Check backup logs

```bash
ssh ${VPS_HOST} "tail -50 /var/log/kelas-backup.log"
```

## Future Improvements

- **Litestream**: Real-time replication to S3 (see epic rb-8xp)
- **Off-site backups**: rsync to secondary location
- **Monitoring**: Alert on backup failures
