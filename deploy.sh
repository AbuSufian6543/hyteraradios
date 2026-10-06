#!/bin/sh
# Rebuild and restart the live site without touching the database volume.
#
#   git pull
#   ./deploy.sh --update
#
# This never runs docker compose down, never deletes sufi_postgres_data,
# and never seeds or resets Postgres. Startup applies pending Prisma
# migrations only. This release has no schema change, so an up-to-date
# database is left as it is.
set -eu
cd "$(dirname "$0")"

COMPOSE="docker compose --env-file .env.public -f docker-compose.public.yml"
VOLUME="sufi_postgres_data"

usage() {
  echo "Usage: ./deploy.sh --update"
  echo "Rebuilds the app and restarts it. The Postgres volume is kept."
}

if [ "${1:-}" != "--update" ] || [ "$#" -ne 1 ]; then
  usage
  exit 1
fi

if grep -qE '^RUN_DB_SEED=true' .env.public 2>/dev/null; then
  echo "ERROR: .env.public has RUN_DB_SEED=true."
  echo "Remove it. This update will not seed the database."
  exit 1
fi

if [ "${SEED_FORCE:-}" = "true" ]; then
  echo "ERROR: SEED_FORCE=true is set. Unset it before updating."
  echo "This update will not overwrite catalog data."
  exit 1
fi

if ! docker volume inspect "$VOLUME" >/dev/null 2>&1; then
  echo "ERROR: Docker volume ${VOLUME} does not exist."
  echo "Refusing to start, because that would create an empty database."
  echo "A first-time server can use ./deploy-public.sh instead."
  exit 1
fi

VOLUME_CREATED="$(docker volume inspect "$VOLUME" --format '{{.CreatedAt}}')"
echo "[deploy] Keeping database volume ${VOLUME} (created ${VOLUME_CREATED})."
echo "[deploy] No seed, no reset, and the volume will not be deleted."

echo "[deploy] Leaving the existing database container in place..."
$COMPOSE up -d --no-recreate db

echo "[deploy] Rebuilding the app only. The database container is not recreated..."
$COMPOSE up -d --build --force-recreate --no-deps app
app_id="$($COMPOSE ps -q app)"
if [ -z "$app_id" ]; then
  echo "ERROR: app container did not start. Database volume ${VOLUME} was not removed."
  exit 1
fi

echo "[deploy] Waiting for migrations to finish..."
i=0
ready=0
while [ "$i" -lt 45 ]; do
  logs="$(docker logs "$app_id" 2>&1 || true)"
  if printf '%s\n' "$logs" | grep -qi 'Seed completed\|SEED_FORCE=true\|seeding database'; then
    echo "ERROR: App logs show a database seed. The update was supposed to migrate only."
    exit 1
  fi
  if printf '%s\n' "$logs" | grep -q 'migrate deploy failed'; then
    echo "ERROR: prisma migrate deploy failed. The database volume was not removed."
    exit 1
  fi
  if printf '%s\n' "$logs" | grep -q 'Starting Next.js'; then
    ready=1
    break
  fi
  i=$((i + 1))
  sleep 2
done

VOLUME_AFTER="$(docker volume inspect "$VOLUME" --format '{{.CreatedAt}}')"
if [ "$VOLUME_CREATED" != "$VOLUME_AFTER" ]; then
  echo "ERROR: ${VOLUME} was replaced. Stop and inspect Docker before continuing."
  exit 1
fi

if [ "$ready" -ne 1 ]; then
  echo "ERROR: App did not report a clean startup. Database volume ${VOLUME} is still the original one."
  $COMPOSE logs app --tail 40 || true
  exit 1
fi

echo "[deploy] Done. Volume ${VOLUME} is unchanged. Existing orders, products, and accounts were not seeded or wiped."
