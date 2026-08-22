---
name: app-audit
description: Auditer l'application mobile d'un élève accompagné, à partir d'un lien App Store et d'un screen recording du parcours, en appliquant la méthodologie d'audit de Jeremy. Produit un rapport écrit structuré pour l'élève (problème → pourquoi → correction concrète), priorisé maintenant/second temps. Utiliser quand Jeremy demande d'auditer, analyser, faire l'audit d'une app d'élève, ou de reprendre/mettre à jour un audit. Inclut la boucle d'amélioration : quand Jeremy corrige un audit, mettre à jour rubric.md et lessons.md.
---

# App Audit

Automatise les audits d'app que Jeremy fait pour ses élèves en accompagnement. Reproduit sa méthodologie, son ton et son format à partir du `rubric.md` (extrait de ses vrais audits) et des `lessons.md` (corrections accumulées).

Deux modes :
- **AUDIT** : produire un audit d'app.
- **FEEDBACK** : Jeremy corrige un audit rendu → on améliore le rubric.

## Contraintes à connaître

- Les apps sont **publiées sur l'App Store**, la plupart du temps **sans code source** et **impossibles à mettre sur simulateur** (le binaire App Store n'a pas de tranche simulateur).
- Claude **ne pilote pas le téléphone physique** de Jeremy. L'audit se fait donc sur ce que Jeremy **filme** : un screen recording iOS du parcours.
- Si l'élève fournit un **repo Expo/React Native**, un audit plus profond est possible (lancer sur simulateur, lire le code) : voir la section "Bonus : app avec code source".

## Entrées attendues (intake)

Avant de commencer, réunir :

1. **Lien App Store** de l'app (obligatoire si publiée).
2. **Screen recording(s)** du parcours (chemin du `.mov`/`.mp4` local). Le protocole de capture est dans `references/capture-protocol.md` (à envoyer à l'élève ou à suivre soi-même).
3. **Contexte** (facultatif mais utile) : cible visée, prix actuels, plateforme (iOS/Android), ce que l'élève veut faire vérifier en priorité, chiffres connus (installs, conversion, revenue).

Si le screen recording manque, donner le `capture-protocol.md` et demander la vidéo. Ne pas inventer ce que la vidéo ne montre pas.

## Workflow AUDIT

1. **Extraire les frames de la vidéo.** Dans le scratchpad, pas dans le repo :
   ```
   mkdir -p <scratch>/frames
   ffmpeg -i "<video>" -vf "fps=1" -q:v 3 "<scratch>/frames/f_%04d.jpg"
   ```
   Ajuster `fps` (0.5 pour une vidéo longue et lente, 2 pour un onboarding rapide). Pour capturer les transitions, on peut aussi extraire sur changement de scène :
   `ffmpeg -i "<video>" -vf "select='gt(scene,0.3)',showinfo" -vsync vfr "<scratch>/frames/scene_%04d.jpg"`.
   Puis **Read** les frames dans l'ordre pour reconstituer le parcours écran par écran.

2. **Transcription (si Jeremy ou l'élève parle dans la vidéo).** Utiliser le setup Whisper/MacWhisper local (voir la skill `macwhisper-video-summary`). La narration donne le contexte des intentions.

3. **Récupérer la fiche App Store.** Depuis le lien, récupérer titre, sous-titre, description, screenshots, note, avis, disponibilité iPad. WebFetch sur l'URL `apps.apple.com`, ou Claude in Chrome si le contenu est rendu en JS. Sert la partie ASO.

4. **Appliquer le rubric.** Lire `references/rubric.md` ET `references/lessons.md` (les leçons priment en cas de conflit). Parcourir l'app **dans l'ordre où l'utilisateur la rencontre** : ASO → Onboarding → In-App / feature principale → Paywall → Rétention → Bugs/QA → recul stratégique (positionnement + data à instrumenter). Se mettre dans la peau de l'utilisateur, référencer les écrans vus.

5. **Rédiger le rapport** en suivant `references/report-template.md`. Chaque finding : **problème observé → pourquoi ça compte → correction concrète (avec un exemple de wording quand pertinent)**. Citer une **app de référence** (Duolingo, Brilliant, Dogo...) quand c'est parlant. Taguer chaque reco `[maintenant]` ou `[second temps]`, et `[ferme]` ou `[à tester]`. Respecter le ton de Jeremy (voir `report-template.md` § Ton).

6. **Sauvegarder** le rapport en `.md` dans le scratchpad, l'envoyer à Jeremy (SendUserFile). Jeremy relit, corrige, puis décide de l'envoyer à l'élève. **Ne jamais envoyer directement à l'élève.**

## Workflow FEEDBACK (boucle d'amélioration)

Quand Jeremy corrige un audit ("t'as raté X", "ce critère compte plus", "le verdict paywall est faux", "reformule comme ça") :

1. Identifier si la correction est **un nouveau critère / un critère à réviser** (→ `references/rubric.md`) ou **une leçon ponctuelle / nuance** (→ `references/lessons.md`).
2. Éditer le fichier concerné. Pour `lessons.md`, ajouter une entrée datée : contexte, ce qui était faux, la règle à appliquer désormais.
3. Résumer à Jeremy ce qui a changé.
4. Proposer un commit git (le versioning EST la mémoire de l'algo). Ne committer que si Jeremy le demande.

## Bonus : app avec code source (Expo/React Native)

Si l'élève fournit le repo :
- Lancer sur simulateur iOS (`expo run:ios` ou Expo Go), naviguer via XcodeBuildMCP (screenshots + UI automation) → audit autonome sans vidéo.
- Lire le code : config RevenueCat/paywall, analytics/events, gestion de la navigation stack, perf. Ajoute une section "Technique" au rapport.
- Voir les skills `qa-complete` et `debug` pour l'outillage simulateur.

## Règles

- Français correct, tous les accents. **Jamais de tiret cadratin.**
- Ne pas noter sur 100. Prioriser par temporalité (maintenant / second temps) et par impact, comme Jeremy.
- Distinguer les recos fermes des hypothèses à tester.
- Ne jamais envoyer le rapport à l'élève : Jeremy relit et décide.
