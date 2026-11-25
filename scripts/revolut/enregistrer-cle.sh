#!/bin/bash
# Range la clé API Revolut (lecture seule) de SDG STUDIO sans l'afficher.
# 1. Dans la console API Revolut (developer.revolut.com/console › API keys), copie la clé « App Mastery lecture ».
# 2. Dans Claude Code : ! bash ~/Projects/app-mastery/scripts/revolut/enregistrer-cle.sh
# La clé va dans ~/.config/revolut/lecture-api-key (lisible par toi seul) et dans les variables Vercel du site
# App Mastery (production) : REVOLUT_API_KEY, et REVOLUT_SIGNING_KEY (clé privée Ed25519 de signature, en base64,
# générée le 17/11/2026 dans ~/.config/revolut/lecture-private.pem ; seule la clé publique a été déposée chez Revolut).
set -euo pipefail
DIR="$HOME/.config/revolut"
KEY=$(pbpaste | tr -d '[:space:]')
if [ ${#KEY} -lt 20 ] || [[ "$KEY" == *"BEGIN"* ]]; then
  echo "Le presse-papiers ne contient pas la clé API. Copie-la dans la console Revolut (API keys), puis relance."; exit 1
fi
[ -f "$DIR/lecture-private.pem" ] || { echo "Clé de signature introuvable dans $DIR."; exit 1; }
umask 077
printf '%s' "$KEY" > "$DIR/lecture-api-key"
cd "$HOME/Projects/app-mastery"
vercel env rm REVOLUT_API_KEY production --yes >/dev/null 2>&1 || true
vercel env rm REVOLUT_SIGNING_KEY production --yes >/dev/null 2>&1 || true
printf '%s' "$KEY" | vercel env add REVOLUT_API_KEY production >/dev/null
base64 < "$DIR/lecture-private.pem" | tr -d '\n' | vercel env add REVOLUT_SIGNING_KEY production >/dev/null
printf '' | pbcopy
echo "Clé Revolut rangée : fichier local et variables Vercel du site App Mastery. Presse-papiers vidé."
node "$HOME/Projects/app-mastery/scripts/revolut/verifier.mjs" || true
