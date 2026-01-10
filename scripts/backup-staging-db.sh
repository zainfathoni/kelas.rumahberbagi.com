#!/bin/bash
# Database backup script for Kelas Rumah Berbagi Staging
# Backs up SQLite database with 7-day retention (shorter than production)
#
# Usage: ./scripts/backup-staging-db.sh
# Setup: Run on VPS via cron for automated daily backups

set -euo pipefail

# Configuration
DB_PATH="/data/kelas-staging/db/staging.db"
BACKUP_DIR="/var/backups/kelas-staging-db"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/staging_${TIMESTAMP}.db"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Check if database exists
if [ ! -f "${DB_PATH}" ]; then
    echo "ERROR: Database not found at ${DB_PATH}"
    exit 1
fi

# Create backup using SQLite backup command (safe for running database)
if command -v sqlite3 &> /dev/null; then
    echo "Creating backup with sqlite3 .backup command..."
    sqlite3 "${DB_PATH}" ".backup '${BACKUP_FILE}'"
else
    echo "sqlite3 not found, using file copy..."
    cp "${DB_PATH}" "${BACKUP_FILE}"
fi

# Verify backup was created
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file was not created"
    exit 1
fi

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "Backup created: ${BACKUP_FILE} (${BACKUP_SIZE})"

# Remove backups older than retention period
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "staging_*.db" -type f -mtime +${RETENTION_DAYS} -delete

# List remaining backups
BACKUP_COUNT=$(find "${BACKUP_DIR}" -name "staging_*.db" -type f | wc -l)
echo "Total backups: ${BACKUP_COUNT}"

echo "Backup completed successfully"
