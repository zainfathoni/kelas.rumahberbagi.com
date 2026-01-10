#!/bin/bash
# Database sync script for Kelas Rumah Berbagi Staging
# Copies production database to staging environment
#
# Usage: ./scripts/sync-staging-db.sh
# Run on VPS to refresh staging with production data

set -euo pipefail

# Configuration
PROD_DB_PATH="/data/kelas/db/prod.db"
STAGING_DB_PATH="/data/kelas-staging/db/staging.db"
STAGING_BACKUP_DIR="/var/backups/kelas-staging-db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Ensure backup directory exists
mkdir -p "${STAGING_BACKUP_DIR}"

# Check if production database exists
if [ ! -f "${PROD_DB_PATH}" ]; then
    echo "ERROR: Production database not found at ${PROD_DB_PATH}"
    exit 1
fi

# Stop staging container to prevent writes during sync
echo "Stopping staging container..."
STAGING_CONTAINER=$(docker ps --format '{{.Names}}' | grep "kelas-staging-web" || true)
if [ -n "${STAGING_CONTAINER}" ]; then
    docker stop "${STAGING_CONTAINER}" || true
fi

# Backup current staging database if it exists
if [ -f "${STAGING_DB_PATH}" ]; then
    BACKUP_FILE="${STAGING_BACKUP_DIR}/staging_presync_${TIMESTAMP}.db"
    echo "Backing up current staging database to ${BACKUP_FILE}..."
    cp "${STAGING_DB_PATH}" "${BACKUP_FILE}"
fi

# Copy production to staging using sqlite3 backup (safe for running database)
echo "Syncing production database to staging..."
if command -v sqlite3 &> /dev/null; then
    sqlite3 "${PROD_DB_PATH}" ".backup '${STAGING_DB_PATH}'"
else
    cp "${PROD_DB_PATH}" "${STAGING_DB_PATH}"
fi

# Verify sync was successful
if [ ! -f "${STAGING_DB_PATH}" ]; then
    echo "ERROR: Staging database was not created"
    exit 1
fi

STAGING_SIZE=$(du -h "${STAGING_DB_PATH}" | cut -f1)
echo "Staging database synced: ${STAGING_DB_PATH} (${STAGING_SIZE})"

# Restart staging container
echo "Starting staging container..."
if [ -n "${STAGING_CONTAINER}" ]; then
    docker start "${STAGING_CONTAINER}" || true
fi

echo "Sync completed successfully"
