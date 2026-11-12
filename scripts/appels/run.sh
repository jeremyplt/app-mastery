#!/usr/bin/env bash
# Lancé toutes les 5 minutes par Harness Maxxing : prépare les fiches d'appel
# des élèves (/admin/eleves/[id] et /admin/calendrier). Le matin, à partir de
# 6 h, les appels du jour sont préparés tout seuls. Aucune notification, rien
# n'est envoyé aux élèves. Les clés restent dans le coffre et ne sont données
# qu'à ce processus ; Claude ne reçoit que son propre accès.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/appels.lock
flock -n 9 || exit 0

export PATH="/root/.local/bin:/usr/local/bin:$PATH"
for name in NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
# Agenda Calendly (lecture seule) : facultatif. Sans lui, seuls les créneaux
# notés sur les fiches sont préparés le matin.
if value=$(maxxing keys get CALENDLY_PAT 2>/dev/null); then export "CALENDLY_PAT=$value"; fi
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/appels/cli.ts "${1:-run}" "${@:2}"
