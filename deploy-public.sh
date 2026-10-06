#!/bin/sh
set -e
cd "$(dirname "$0")"

if [ "${1:-}" = "--update" ]; then
  exec ./deploy.sh --update
fi

if [ "$#" -ne 0 ]; then
  echo "ERROR: extra arguments are not accepted."
  echo "To update the live site without touching the database: ./deploy.sh --update"
  exit 1
fi

docker compose --env-file .env.public -f docker-compose.public.yml up -d --build
