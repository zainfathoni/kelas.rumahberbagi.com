#!/bin/bash
# Database restore script for Kelas Rumah Berbagi
# Restores SQLite database from backup
#
# Usage: ./scripts/restore-db.sh [backup_file]
#        If no backup file specified, uses the most recent backup

set -euo pipefail

# Configuration
DB_PATH="/data/kelas/db/prod.db"
BACKUP_DIR="/var/backups/kelas-db"

# Get backup file (from argument or most recent)
if [ $# -ge 1 ]; then
    BACKUP_FILE="$1"
else
    BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/prod_*.db 2>/dev/null | head -1)
    if [ -z "${BACKUP_FILE}" ]; then
        echo "ERROR: No backup files found in ${BACKUP_DIR}"
        exit 1
    fi
    echo "Using most recent backup: ${BACKUP_FILE}"
fi

# Verify backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

# Confirm restore
echo "WARNING: This will replace the current database!"
echo "  Source: ${BACKUP_FILE}"
echo "  Target: ${DB_PATH}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Stop the application container to prevent writes during restore
echo "Stopping application container..."
if docker ps --format '{{.Names}}' | grep -q "kelas-web"; then
    docker stop kelas-web || true
fi

# Create backup of current database before restore
if [ -f "${DB_PATH}" ]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    PRERESTORE_BACKUP="${BACKUP_DIR}/prod_prerestore_${TIMESTAMP}.db"
    echo "Backing up current database to ${PRERESTORE_BACKUP}..."
    cp "${DB_PATH}" "${PRERESTORE_BACKUP}"
fi

# Restore the backup
echo "Restoring database..."
cp "${BACKUP_FILE}" "${DB_PATH}"

# Restart the application
echo "Starting application container..."
docker start kelas-web || true

# Verify restore
if [ -f "${DB_PATH}" ]; then
    RESTORED_SIZE=$(du -h "${DB_PATH}" | cut -f1)
    echo "Database restored successfully (${RESTORED_SIZE})"
else
    echo "ERROR: Restore failed - database file not found"
    exit 1
fi

echo "Restore completed"
