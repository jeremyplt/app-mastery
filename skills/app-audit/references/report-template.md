# Template de rapport d'audit

Reproduit la structure, le format de finding et le ton des audits de Jeremy. Adapter les sections à l'app (certaines sautent, ex. Branding, ou ASO si pas encore publiée).

## Règle absolue : une preuve visuelle par information

Chaque information ou donnée chiffrée doit avoir son **screenshot source juste à côté**, dans la même section (jamais regroupés dans une section "Captures" en bas). Si je l'affirme, je le montre.
- Fiche store → screenshot de la fiche App Store dans la section Fiche store.
- Densité de mots-clés → screenshot de la description (la source des mots) sur l'App Store.
- Chaque mot-clé → un screenshot AppFigures de CE terme (panneau Insights, le terme visible dans la barre de recherche). Une liste "related keywords" ne suffit pas : certains termes (ex. "focus") n'y figurent pas.
Une donnée sans preuve visuelle ne va pas dans le rapport.

## Écrire comme Jeremy, pas comme une IA

Le rapport doit sembler écrit par Jeremy, pour son élève. Pas de mentions méta qui trahissent l'IA ou les coulisses : ne pas écrire "à partir du screen recording" (c'est l'outil d'audit, pas pour l'élève), ni "AppFigures gratuit/payant", ni "données verrouillées", ni ce qui "suivra". Ton direct, tutoiement, voix de Jeremy. Le screen recording sert à faire l'audit, il n'est jamais mentionné ni envoyé à l'élève.

**Ton pour l'élève : direct mais posé, un peu plus de pincettes.** Le ton que Jeremy emploie avec moi (dans le chat) est très cash ("on s'en fout", "c'est nul", "cette merde") ; l'audit pour l'élève doit rester pro et respectueux, sans ces formulations. Direct oui, blessant/vulgaire non. Et français correct : "rends les chiffres plus gros" (pas "fais les chiffres plus gros").

## Version HTML partageable (artifact)

Quand on livre l'audit comme page/lien partageable, utiliser le **design system macOS d'App Mastery** (tokens dans `src/app/globals.css`) : fonts SF système (`-apple-system, "SF Pro Text"...`), fond `#eceef2` clair / `#09090b` sombre, accent bleu Apple `#007aff` / `#0a84ff`, cartes glass (`.5px` border, radius 14-16px), fond `dot-pattern`, eyebrow bleu à pastille, icônes carrées en dégradé, badges (orange = Maintenant, vert = Ferme), barres popularité verte / compétitivité orange. Supporter clair + sombre. Chaque donnée garde son screenshot source à côté.

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

Chaque point suit : **problème observé → pourquoi ça compte (mécanisme UX ou business) → correction concrète (avec un exemple de wording quand pertinent)**. Citer une **app de référence** quand c'est parlant.

**Pas de tags "Maintenant / Ferme / À tester"** dans le rapport (Jeremy les trouve inutiles). Ne pas mettre de badges de temporalité/confiance. **Règle élargie (2026-08-25, Whyme) : AUCUN tag/badge/pill nulle part** : ni pastilles descriptives dans le hero ("App de soutien émotionnel", "Prototype non publié"...), ni badges sur les findings ("À revoir", "À garder", "Priorité"). Seule exception : les marqueurs "existe / à ajouter" dans la Proposition d'onboarding (information réelle, demandée).

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
