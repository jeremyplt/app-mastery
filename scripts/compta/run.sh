#!/usr/bin/env bash
# Comptabilité automatique de SDG STUDIO sur le serveur Harness. Un seul passage à
# la fois. Les secrets restent dans le coffre et ne sont donnés qu'à ce processus ;
# l'accès à Claude n'est transmis qu'au programme claude, lancé sans aucun outil.
#   scripts/compta/run.sh passage | apercu | etat | manquantes | joindre <dépense> <fichier>
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/compta.lock
if ! flock -w 300 9; then
  echo "Un autre passage est en cours, rien à faire." >&2
  exit 0
fi

export PATH="/root/.local/bin:/usr/local/bin:$PATH"
export ODOO_URL=https://pitault-media.odoo.com ODOO_DB=pitault-media ODOO_LOGIN=jeremypltpro@gmail.com
for name in ODOO_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY REVOLUT_API_KEY REVOLUT_SIGNING_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
# Lecture de Gmail : facultative tant que le script Google n'est pas déployé.
for name in COMPTA_GMAIL_URL COMPTA_GMAIL_SECRET; do
  if value=$(maxxing keys get "$name" 2>/dev/null); then export "$name=$value"; fi
done
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/compta/cli.ts "${1:-passage}" "${@:2}"
