# Séquence Email - Plan d'Action (Post Lead Magnet)

## Stratégie

Séquence de 7 emails sur 10 jours, déclenchée après l'inscription au Plan d'Action.

Objectif : apporter un maximum de valeur et amener le prospect à réserver un appel audit gratuit (Calendly).

Approche :
- Chaque email donne une vraie astuce ou stratégie actionnable
- On appuie sur les pain points (app qui ne génère pas de revenus, pas de téléchargements, pas de visibilité)
- CTA unique : réserver un appel audit gratuit
- Ton conversationnel, comme un message à un ami
- On collecte le prénom, donc on personnalise avec {{FIRSTNAME}}

## Calendrier d'envoi

| Email | Jour | Sujet | Angle |
|-------|------|-------|-------|
| E1 | J+0 | Livraison du Plan d'Action | Délivrer la vidéo, ouvrir la boucle |
| E2 | J+1 | Mon histoire | Connexion personnelle, crédibilité |
| E3 | J+2 | L'erreur n°1 (validation) | Valeur pure : comment valider une idée en 48h |
| E4 | J+4 | Le secret du marketing organique | Valeur pure : stratégie virale TikTok/Reels |
| E5 | J+6 | La monétisation (ce qui marche vraiment) | Valeur pure : modèles de pricing qui convertissent |
| E6 | J+8 | Pourquoi ton app ne décolle pas | Pain points + diagnostic |
| E7 | J+10 | Dernier email | Direct, dernier CTA audit |

## Configuration Brevo (Automation)

**Déclencheur** : Un contact est ajouté à la liste #17 (Plan d'Action)

| Étape | Action | Délai après |
|-------|--------|-------------|
| E1 | Livraison Plan d'Action | Immédiat (via transactional API) |
| Délai | | 1 jour |
| E2 | Mon histoire | - |
| Délai | | 1 jour |
| E3 | L'erreur n°1 | - |
| Délai | | 2 jours |
| E4 | Marketing organique | - |
| Délai | | 2 jours |
| E5 | Monétisation | - |
| Délai | | 2 jours |
| E6 | Pourquoi ton app ne décolle pas | - |
| Délai | | 2 jours |
| E7 | Dernier email | Fin |

## Notes

- Lien Calendly : https://calendly.com/jeremypltpro/30min
- Format : texte simple, pas de templates HTML lourds. Comme un vrai email perso.
- On collecte le prénom via le formulaire /plan-action
- Chaque email doit donner assez de valeur pour que le prospect se dise "si les emails gratuits sont aussi bons, qu'est-ce que ça donne en appel ?"
