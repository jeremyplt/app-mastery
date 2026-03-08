# Séquence Email - App Mastery

## Stratégie

Séquence de 7 emails sur 10 jours, déclenchée après le visionnage du Plan d'Action (lead magnet vidéo).

Framework : Soap Opera Sequence (Russell Brunson)
- Chaque email se termine par un cliffhanger ou une transition vers le suivant
- Ton conversationnel, comme un message à un ami
- Un seul CTA par email (sauf E1 qui délivre le lead magnet)

## Calendrier d'envoi

| Email | Jour | Sujet | Objectif |
|-------|------|-------|----------|
| E1 | J+0 | Bienvenue + Plan d'Action | Délivrer le lead magnet, ouvrir la boucle |
| E2 | J+1 | Mon histoire (Epiphany Bridge) | Créer la connexion, montrer la transformation |
| E3 | J+2 | L'erreur fatale | Agiter le problème, détruire les fausses croyances |
| E4 | J+4 | La preuve par les chiffres | Social proof, revenus, reviews |
| E5 | J+6 | Objections détruites | Répondre aux objections courantes |
| E6 | J+8 | Le vrai coût de l'inaction | Urgence + calcul du coût d'opportunité |
| E7 | J+10 | Dernière chance | Scarcité, deadline, CTA final |

## Configuration Brevo (Automation)

**Déclencheur** : Un contact est ajouté à la liste #3 (Plan d'Action)

| Étape | Action | Délai après |
|-------|--------|-------------|
| E1 | Bienvenue + Plan d'Action | - |
| Délai | | 1 jour |
| E2 | Mon histoire | - |
| Délai | | 1 jour |
| E3 | L'erreur fatale | - |
| Délai | | 2 jours |
| E4 | La preuve par les chiffres | - |
| Délai | | 2 jours |
| E5 | Objections détruites | - |
| Délai | | 2 jours |
| E6 | Le coût de l'inaction | - |
| Délai | | 2 jours |
| E7 | Dernière chance | Fin |

## Notes

- Objet des emails : court, curieux, personnel (pas de majuscules partout, pas de spam)
- Preheader : toujours rempli, complément de l'objet
- Désabonnement : lien en bas de chaque email
- Format : texte simple, pas de templates HTML lourds. Comme un vrai email perso.
- On ne collecte pas le prénom, donc tous les emails commencent par "Salut," sans variable.
