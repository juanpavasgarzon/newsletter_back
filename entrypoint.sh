#!/bin/sh
set -e

mkdir -p /app/data
chown -R node:node /app/data

npm run migration:run

exec "$@"

