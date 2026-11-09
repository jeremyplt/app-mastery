#!/usr/bin/env bash
# Lancé toutes les 5 minutes par Harness Maxxing : lit le WhatsApp pro via Kapso,
# transcrit les vocaux et prépare résumés et brouillons pour /admin/whatsapp.
# Rien n'est jamais envoyé sur WhatsApp. Les clés restent dans le coffre et ne
# sont données qu'à ce processus ; Claude ne reçoit que son propre accès.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/whatsapp.lock
flock -n 9 || exit 0

export PATH="/root/.local/bin:/usr/local/bin:$PATH"
# Numéro pro +33 7 56 82 39 21 chez Kapso (identifiant, pas un secret).
export KAPSO_PHONE_NUMBER_ID=907146935806981
for name in KAPSO_API_KEY NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/whatsapp/cli.ts "${1:-run}" "${@:2}"
