#!/bin/bash
# Download staging database backups from VPS to local machine
#
# Usage: ./scripts/download-staging-backup.sh [latest|all|<filename>]
#   latest  - Download most recent backup (default)
#   all     - Download all backups
#   <file>  - Download specific backup file

set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
DEPLOY_CONFIG="${SCRIPT_DIR}/../config/deploy.staging.yml"

# Extract VPS IP from Kamal config
VPS_IP=$(grep -A2 'hosts:' "${DEPLOY_CONFIG}" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+')
VPS_HOST="root@${VPS_IP}"
REMOTE_BACKUP_DIR="/var/backups/kelas-staging-db"
LOCAL_BACKUP_DIR="$(dirname "$0")/../prisma/backups/staging"

# Ensure local backup directory exists
mkdir -p "${LOCAL_BACKUP_DIR}"

MODE="${1:-latest}"

case "${MODE}" in
    latest)
        echo "Fetching latest staging backup..."
        LATEST=$(ssh "${VPS_HOST}" "ls -t ${REMOTE_BACKUP_DIR}/staging_*.db 2>/dev/null | head -1")
        if [ -z "${LATEST}" ]; then
            echo "ERROR: No backups found on server"
            exit 1
        fi
        FILENAME=$(basename "${LATEST}")
        echo "Downloading ${FILENAME}..."
        scp "${VPS_HOST}:${LATEST}" "${LOCAL_BACKUP_DIR}/"
        echo "Downloaded to ${LOCAL_BACKUP_DIR}/${FILENAME}"
        ;;
    all)
        echo "Downloading all staging backups..."
        scp "${VPS_HOST}:${REMOTE_BACKUP_DIR}/staging_*.db" "${LOCAL_BACKUP_DIR}/"
        echo "Downloaded to ${LOCAL_BACKUP_DIR}/"
        ls -lh "${LOCAL_BACKUP_DIR}"
        ;;
    *)
        echo "Downloading ${MODE}..."
        scp "${VPS_HOST}:${REMOTE_BACKUP_DIR}/${MODE}" "${LOCAL_BACKUP_DIR}/"
        echo "Downloaded to ${LOCAL_BACKUP_DIR}/${MODE}"
        ;;
esac

echo "Done"
