# Séquence de relance — Qualifiés non bookés

Séquence Brevo pour les leads **qualifiés** (liste 20) qui n'ont pas encore
réservé leur appel. À créer dans l'éditeur d'automatisation Brevo (ces emails
ne sont PAS dans le code).

## Déclenchement & sortie (Brevo)

- **Déclencheur**: "Ajouté à une liste" → liste 20 (Appel, qualifiés) → instantané
- **Paramètres**: "Autoriser à entrer plusieurs fois" = NON
- **Condition de sortie globale**: `CALL_BOOKED` = Vrai
- **Si/Alors avant chaque email** (protection temps réel): si `CALL_BOOKED` = Vrai → Sortie

```
[Attendre 1j] → Si CALL_BOOKED=Vrai → Sortie ; sinon → Email 1
[Attendre 2j] → Si CALL_BOOKED=Vrai → Sortie ; sinon → Email 2
[Attendre 3j] → Si CALL_BOOKED=Vrai → Sortie ; sinon → Email 3
```

Merge tag prénom Brevo : `{{contact.FIRSTNAME}}`
Lien réservation : https://www.jeremypitault.com/appel/reserver

---

## Email 1 — J+1 · rappel simple

**Objet:** `{{contact.FIRSTNAME}}, on n'a pas encore calé ton appel`

```
Salut {{contact.FIRSTNAME}},

Tu as rempli le formulaire pour qu'on échange sur ton projet d'app, mais je ne vois pas encore de créneau réservé de ton côté.

C'est peut-être juste passé à la trappe (ça arrive). Voici le lien direct pour choisir ton moment, ça prend 30 secondes :

👉 https://www.jeremypitault.com/appel/reserver

On se cale 30 minutes, je regarde où tu en es, et je te dis concrètement comment générer des revenus avec ton app. Que tu bosses avec moi ensuite ou pas, tu repars avec un plan clair.

À très vite,
Jeremy
```

---

## Email 2 — J+3 · ce qu'on fait + lever l'objection

**Objet:** `Ce qu'on va vraiment faire pendant ton appel`

```
Salut {{contact.FIRSTNAME}},

Je préfère être transparent sur ce qui se passe pendant les 30 minutes, pour que tu saches à quoi t'attendre :

• On fait le point sur ton app et ta situation actuelle
• Je te dis honnêtement si ton projet a du potentiel de revenus, et lequel
• On définit les 2-3 prochaines actions concrètes pour avancer
• Si je peux t'accompagner, je t'explique comment. Sinon, tu repars quand même avec un plan.

Pas de blabla, pas de pitch de 1h. Juste ton projet, et comment le faire décoller.

Réserve ton créneau ici :
👉 https://www.jeremypitault.com/appel/reserver

Jeremy

PS : je génère des centaines de milliers d'euros par an avec mes apps. L'idée de l'appel, c'est de mettre cette expérience au service de ton projet à toi.
```

---

## Email 3 — J+6 · dernière relance

**Objet:** `Je libère ton créneau, {{contact.FIRSTNAME}}`

```
Salut {{contact.FIRSTNAME}},

Je t'ai proposé un appel il y a quelques jours et je n'ai pas eu de retour. Pas de souci, mais je préfère ne pas te relancer indéfiniment.

Si c'est le bon moment pour toi, c'est maintenant. Réserve ton créneau ici :
👉 https://www.jeremypitault.com/appel/reserver

Si je n'ai pas de nouvelles, je considère que ce n'est pas le moment et je ne t'embête plus avec ça. Tu pourras toujours revenir quand tu veux.

À bientôt j'espère,
Jeremy
```
