# Template de rapport d'audit

Reproduit la structure, le format de finding et le ton des audits de Jeremy. Adapter les sections à l'app (certaines sautent, ex. Branding, ou ASO si pas encore publiée).

## Structure du rapport

```
# Audit <NomApp>
*Revue <sections couvertes>, ex : ASO, onboarding, in-app, paywall, rétention et recommandations*

## Synthèse
Les 3 constats principaux, en tête. Désigner explicitement le plus important
("C'est le point le plus structurant de cet audit").
(Cette section est optionnelle mais recommandée pour les apps riches.)

## Branding            (seulement si pertinent : logo, palette)
## ASO                 (page store ; ou "À définir une fois l'app publiée")
## Onboarding          (la plus dense ; écran par écran, dans l'ordre du parcours)
## In-App              (sections spécifiques au produit : feature principale, home...)
## Paywall             (+ pricing)
## Rétention et engagement
## Bugs / QA
## Fonctionnalités     (idées "second temps", non prioritaires)
## Vision globale / Positionnement
## Data à vérifier     (funnel, events à instrumenter)
```

Naviguer **écran par écran, dans l'ordre où l'utilisateur les rencontre**, en référençant les captures ("Sur cet écran...", numéroter si besoin).

## Format d'un finding

Chaque point suit : **problème observé → pourquoi ça compte (mécanisme UX ou business) → correction concrète (avec un exemple de wording quand pertinent)**. Citer une **app de référence** quand c'est parlant. Taguer :
- temporalité : `[maintenant]` ou `[second temps]`
- confiance : `[ferme]` ou `[à tester]`

Exemple de mise en forme :

> **La landing parle du process, pas de l'objectif.** `[maintenant]` `[ferme]`
> "Tu veux apprendre de nouveaux mots en anglais ?" est axé sur le processus. Il faut TOUJOURS parler de l'objectif : le but de l'utilisateur n'est pas d'apprendre des mots pour les connaître, mais de regarder un film en VO sans sous-titres, lire en version originale, etc.
> **Correction :** remplacer par "Tu veux ENFIN comprendre l'anglais ?". Idéalement, un carrousel de 3 slides, une par bénéfice.
> Référence : Duolingo, Brilliant.

Pour la section Rétention, formaliser avec un **Pourquoi :** explicite sous chaque reco.

## Priorisation (pas de note chiffrée)

Jeremy ne note jamais sur 100. La priorisation est qualitative :
- Synthèse en tête qui hiérarchise et désigne le point le plus important.
- Tags temporels `[maintenant]` / `[second temps]` (les idées "second temps" vont dans la section Fonctionnalités).
- Grille 20/80 et MVP : le cœur (ce qui fait convertir) prime sur le périphérique.
- L'ordre = ordre du parcours utilisateur (l'onboarding et le paywall, là où se joue la conversion, reçoivent le plus d'attention).
- Distinguer recos fermes `[ferme]` et hypothèses `[à tester]`.

## Ton et style de Jeremy (à respecter)

- **Tutoiement de l'élève**, première personne, avis assumés : "je pense que", "je ne recommande pas", "honnêtement...".
- **Direct et franc, mais bienveillant** : commencer souvent par un compliment sincère avant de critiquer ("Dans l'ensemble, c'est une très belle application, bien structurée. En revanche...").
- **Pédagogue** : chaque critique justifiée par un mécanisme (pourquoi le cerveau / l'utilisateur / l'algo du store réagit ainsi), avec analogie concrète quand ça aide.
- **Empirique** : se mettre dans la peau de l'utilisateur, "j'ai fait l'onboarding et...", "quand on clique dessus...".
- **MAJUSCULES pour insister** : TOUJOURS, RÉEL, TOUS, AU MOINS. Répétition pour marteler.
- **Références concurrentes** comme étalon du "bien" : Duolingo, Brilliant, Dogo, Hundeo, Zalando/ASOS.
- Longueur proportionnelle à la richesse de l'app, pas de limite fixe.
- Français impeccable, tous les accents, **jamais de tiret cadratin**.

## Exemples de findings verbatim (style cible)

> "L'icône en haut à droite est une icône de light/dark mode, alors qu'elle redirige vers les paramètres. C'est un dark pattern. Il faut utiliser les icônes standards pour ne pas induire l'utilisateur en erreur : on ne détourne jamais l'usage d'une icône ou d'un pattern de design."

> "Écran de résultat, chiffré et concret : 'Ta garde-robe idéale : 14 pièces, 380 €, 24 tenues possibles', avec la première pièce visible et le reste flouté. C'est beaucoup plus fort qu'un simple 'tes tenues sont prêtes', et cela donne une raison bien plus claire de payer."

> "'Tu as juste besoin de 5700 mots' => c'est énorme et hyper démoralisant. La plupart des utilisateurs viennent des réseaux sociaux, leur attention et leur motivation sont limitées. Il faut abstraire l'effort total en mini-goal pour garder l'utilisateur motivé."

> "La tenue du jour, poussée et validable en un geste. Pourquoi : la douleur visée est 'je perds du temps chaque matin'. L'app doit donc être plus rapide que l'ouverture de l'armoire. Sinon l'habitude ne se créera pas."
