#!/usr/bin/env bash
# Mises de côté TVA et Closers sur le serveur Harness. Un seul passage à la fois.
# Les secrets restent dans le coffre et ne sont donnés qu'à ce processus. La clé
# de virement Revolut (REVOLUT_TRANSFER_*) n'existe pas encore : sans elle, et
# tant que set_asides_mode n'est pas sur « auto », rien ne part.
#   scripts/revolut/mises-de-cote.sh virer | apercu <clé> | etat
set -euo pipefail
cd "$(dirname "$0")/../.."

exec 9>/run/lock/mises-de-cote.lock
if ! flock -w 300 9; then
  echo "Un autre passage est en cours, rien à faire." >&2
  exit 0
fi

for name in NEXT_PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  value=$(maxxing keys get "$name")
  export "$name=$value"
done
for name in BREVO_API_KEY REVOLUT_TRANSFER_API_KEY REVOLUT_TRANSFER_SIGNING_KEY; do
  if value=$(maxxing keys get "$name" 2>/dev/null); then export "$name=$value"; fi
done

exec node_modules/.bin/tsx scripts/revolut/mises-de-cote.ts "$@"
