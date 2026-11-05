#!/usr/bin/env bash
# Lancé toutes les 5 minutes : fait relire par l'IA les justificatifs reçus. Sans
# justificatif en attente, Claude n'est pas appelé. L'accès à Claude n'est donné
# qu'à ce processus, qui le transmet seul au programme claude.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/factures-justificatifs.lock
flock -n 9 || exit 0

export ODOO_URL=https://pitault-media.odoo.com ODOO_DB=pitault-media ODOO_LOGIN=jeremypltpro@gmail.com
for name in ODOO_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY BREVO_API_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
CLAUDE_CODE_OAUTH_TOKEN=$(python3 -c 'import sys; sys.path.insert(0, "/opt/claude-maxxing/server"); from maxxing import config; print(config.get_secret("claude_oauth_token") or "")')
export CLAUDE_CODE_OAUTH_TOKEN

exec node_modules/.bin/tsx scripts/facturation/cli.ts "${1:-justificatifs}" "${@:2}"
