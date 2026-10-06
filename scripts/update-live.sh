#!/usr/bin/env bash
#
# Pull latest code and redeploy the public/Cloudflare stack without wiping the DB.
# Run on the Linux server from the project root:
#   chmod +x scripts/update-live.sh && ./scripts/update-live.sh
#
set -euo pipefail
cd "$(dirname "$0")/.."

COMPOSE="docker compose --env-file .env.public -f docker-compose.public.yml"

if grep -qE '^RUN_DB_SEED=true' .env.public 2>/dev/null; then
  echo "WARNING: .env.public has RUN_DB_SEED=true — remove it to avoid catalog resets."
  echo "         Auto-seed on startup is no longer supported; use: $COMPOSE exec app npx prisma db seed"
  exit 1
fi

echo "[update-live] Pulling latest code..."
git pull

echo "[update-live] Rebuilding and starting (database volume is preserved)..."
$COMPOSE up -d --build

echo "[update-live] Verifying app startup (no auto-seed)..."
sleep 3
if $COMPOSE logs app --tail 40 2>&1 | grep -qi 'seeding database'; then
  echo "ERROR: App logs show database seeding on startup. Check scripts/docker-entrypoint.sh"
  exit 1
fi

if ! docker volume ls --format '{{.Name}}' | grep -qx 'sufi_postgres_data'; then
  echo "WARNING: sufi_postgres_data volume not found. Is this a fresh server?"
fi

echo "[update-live] Done. Safe restart anytime with:"
echo "  $COMPOSE restart"
