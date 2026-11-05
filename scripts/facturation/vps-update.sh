#!/usr/bin/env bash
# Met le clone du serveur à jour avant chaque passage. Le code se change dans le
# dépôt, jamais sur le serveur.
set -euo pipefail
cd "$(dirname "$0")/../.."
branch=${FACTURES_BRANCH:-main}
before=$(git rev-parse HEAD:package-lock.json 2>/dev/null || echo none)
git fetch --quiet origin "$branch"
git checkout --quiet --force -B "$branch" "origin/$branch"
after=$(git rev-parse HEAD:package-lock.json)
if [ "$before" != "$after" ] || [ ! -x node_modules/.bin/tsx ]; then
  npm ci --no-audit --no-fund --silent
fi
echo "$branch $(git rev-parse --short HEAD)"
