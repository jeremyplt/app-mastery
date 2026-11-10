#!/usr/bin/env bash
# Lancé par Harness Maxxing : contenus d'inspiration pour la niche d'un élève
# (recherche TikTok, vérification des vidéos, ajout à la GIGA BANQUE). Les clés
# restent dans le coffre et ne sont données qu'à ce processus.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/contenus.lock
flock -n 9 || exit 0

export PATH="/root/.local/bin:/usr/local/bin:$PATH"
for name in SCRAPECREATORS_API_KEY NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
# Script Google de la GIGA BANQUE : facultatif tant qu'il n'est pas déployé.
for name in GIGA_BANQUE_SCRIPT_URL GIGA_BANQUE_SCRIPT_SECRET; do
  if value=$(maxxing keys get "$name" 2>/dev/null); then export "$name=$value"; fi
done
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/contenus/cli.ts "${1:-run}" "${@:2}"
