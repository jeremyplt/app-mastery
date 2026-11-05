#!/usr/bin/env bash
# Lance la commande de facturation sur le serveur. Un seul passage à la fois. Les
# secrets restent dans le coffre et ne sont donnés qu'à ce processus, jamais à la
# session Claude qui l'appelle.
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/factures.lock
if ! flock -w 300 9; then
  echo "Un autre passage est en cours, rien à faire." >&2
  exit 0
fi

export ODOO_URL=https://pitault-media.odoo.com ODOO_DB=pitault-media ODOO_LOGIN=jeremypltpro@gmail.com
export FACTURES_PDF_DIR=/root/factures-pdf
for name in ODOO_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY BREVO_API_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done

exec node_modules/.bin/tsx scripts/facturation/cli.ts "$@"
