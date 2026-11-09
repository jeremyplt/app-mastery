---
name: app-content-review
description: Analyser le contenu réseaux sociaux (TikTok, Instagram, Reels, carrousels) d'un élève qui a une app mobile, et produire ses recommandations avec la méthode de Jeremy : ce qui ralentit ses vidéos, ses accroches réécrites, des formats viraux à copier sans montrer sa tête, plan par plan. Utiliser quand Jeremy donne des vidéos ou un compte d'élève, demande un retour, une critique, de dynamiser le contenu, des idées de vidéos ou de carrousels, des accroches, ou des formats pour une app. Inclut la boucle d'amélioration : quand Jeremy corrige, mettre à jour references/lessons.md.
---

# Analyse du contenu d'un élève

Le but du contenu organique d'une app : **qu'une personne qui ne connaît pas le créateur découvre l'app, la télécharge et s'abonne.** Pas de fédérer une audience. Tout le reste en découle.

Deux modes :
- **ANALYSE** : produire le retour pour un élève.
- **FEEDBACK** : Jeremy corrige un retour → on met à jour le skill.

## Fichiers à lire

| Fichier | Quand |
|---|---|
| `references/principes.md` | Toujours. La grille d'analyse et ce qu'il ne faut PAS relever. |
| `references/lessons.md` | Toujours. Les corrections de Jeremy, elles priment en cas de conflit. |
| `references/formats-video.md` | Pour recommander des vidéos. |
| `references/formats-carrousel.md` | Pour recommander des carrousels. |
| `references/accroches.md` | Pour réécrire les accroches. |
| `references/recherche.md` | Pour trouver des exemples, télécharger et mesurer. |
| `references/rendu.md` | Pour écrire et illustrer le document élève. |

## Entrées

1. Les vidéos de l'élève (fichier, dossier, zip WhatsApp) ou son compte TikTok ou Instagram. Les chiffres si on les a : vues, téléchargements.
2. L'app : ce qu'elle fait, **qui paie et qui l'utilise**, l'artifact d'audit s'il existe (voir la mémoire `project_audit_*`).
3. Ce que l'élève accepte de faire : voix, visage, enfants, lieu de tournage. Ne rien supposer : ce qui n'est pas acquis va dans un bonus facultatif.
4. La recherche de contenu de sa niche, si elle existe : `~/Desktop/contenu-ugc-<niche>.md`.

Ne poser une question que si la réponse change le résultat.

## Workflow ANALYSE

1. **Tout regarder.** Dézipper, repérer les doublons, puis `scripts/mesurer_videos.sh <dossier> <scratchpad>`. Lire chaque planche d'images. Transcrire avec Whisper (`/Users/jeremy/.local/bin/whisper --model large-v3-turbo`). Une affirmation sur le son se vérifie, elle ne se déduit pas d'une transcription vide : une transcription vide peut être de la musique.
2. **Compter avant de juger.** Pour chaque vidéo, remplir la grille de `principes.md` (durée, première phrase, explique ou montre, moment où le résultat arrive, part d'image figée, IA, cadrage). Le retour cite des chiffres mesurés (« 19 vidéos sur 20 »), avec des images prises dans ses vidéos. Quand un chiffre est une appréciation, le dire à Jeremy.
3. **Partir du viral, pas de sa tête.** Ne jamais inventer un format ni l'explication de son succès. Prendre d'abord le catalogue, puis classer la recherche par vues et regarder les meilleures vidéos en entier (`recherche.md`). D'autres niches conviennent très bien pour un format.
4. **Transposer en vérifiant 4 choses** : la valeur pour le spectateur reste vraie pour cette app, la scène existe chez l'élève, il peut la tourner sans se montrer, et rien de faux n'est promis (`principes.md`, section Transposer).
5. **Écrire le document** selon `rendu.md` : au « tu », court, images réelles, texte identique à l'inspiration.
6. **Publier en artifact privé** et donner le lien à Jeremy. **Ne jamais envoyer à l'élève** : Jeremy relit et décide.
7. **À la fin de la réponse**, signaler ce que je n'ai pas vérifié : son, liens non rouverts, conseils venant de moi, phrases qui supposent la vie de l'élève.

## Workflow FEEDBACK

Quand Jeremy corrige :
1. Corriger le livrable.
2. Une règle générale va dans `principes.md`, un format dans `formats-*.md`, une nuance ou un rejet dans `lessons.md` (entrée datée : contexte, ce qui était faux, la règle).
3. Résumer le changement à Jeremy et proposer un commit. Ne committer que s'il le demande.

## Règles

- Français normal, tous les accents, **jamais de tiret cadratin**, zéro jargon. De vraies phrases comme on parle, jamais de suite de fragments.
- Ne pas commencer par le prénom de l'élève, pas de « on » : « Voici ce qui ressort de l'analyse de tes 20 vidéos ».
- Pas de note sur 100. Commencer par ce qui est bon, sans flatter.
- Jamais « un élève a fait… » ni le nom d'un autre élève.
- Les chiffres disent où un format a marché, pas qu'il marchera pareil pour cet élève.
- Le document reste privé. La GIGA BANQUE est partagée : aucun nom d'élève ni d'app d'élève, et on ne la modifie que sur demande.
