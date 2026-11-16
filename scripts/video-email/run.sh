#!/usr/bin/env bash
# Lancé toutes les 15 minutes par Harness Maxxing : à chaque nouvelle vidéo
# longue de la chaîne, prépare l'email des leads sans RDV et le crée en
# BROUILLON dans Brevo, puis prévient Jeremy dans le fil Harness. Rien n'est
# jamais envoyé. Les clés restent dans le coffre et ne sont données qu'à ce
# processus ; Claude ne reçoit que son propre accès.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/video-email.lock
flock -n 9 || exit 0

export PATH="/root/.local/bin:/usr/local/bin:$PATH"
for name in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY BREVO_API_KEY YOUTUBE_API_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/video-email/cli.ts "${1:-run}" "${@:2}"
