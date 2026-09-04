# Lessons , corrections accumulées de Jeremy

Ce fichier grossit à chaque fois que Jeremy corrige un audit rendu. Les leçons ici **priment sur le rubric** en cas de conflit. C'est la mémoire de l'outil d'audit qui s'améliore.

Format d'une entrée :

```
## AAAA-MM-JJ , <titre court>
- **Contexte :** (quelle app, quelle section)
- **Ce qui était faux / manquant :**
- **Règle à appliquer désormais :**
```

Quand une leçon se généralise (elle vaut pour toutes les apps, pas juste un cas), la remonter aussi dans `rubric.md`.

---

## 2026-08-26 , In-app Whyme : verdicts vidéo 2 + erreur "feature saluée sans test"
- **Contexte :** audit in-app Whyme (compte membre). Ma version saluait "l'audio est déjà là" (TTS + micro visibles). La vidéo de Jeremy montre que NI la lecture vocale NI la dictée ne fonctionnent.
- **Règle :** ne JAMAIS mettre un point en positif sans l'avoir testé soi-même. Un bouton visible n'est pas une feature qui marche. Tester chaque interaction citée dans le rapport (cliquer, écouter, dicter).
- **Règles généralisables (remontées au rubric) :** navigation mobile TOUJOURS en bas (jamais de hamburger, 1 clic par section) ; l'action principale de l'app (ex. "Nouvelle séance") toujours accessible ; "Faire un retour" proéminent au premier niveau à ce stade d'un produit ; tout texte généré qui s'adresse à l'utilisateur parle en "tu/on/nous", jamais "le client / le mentor" en 3e personne ; chasser les clés i18n brutes (textes type "xxx.yyy") dans chaque langue ; la mécanique de rétention (exercice du jour) se met en avant en pop-up à l'arrivée, pas dans un bandeau discret.
- **Ton du verdict :** quand l'in-app n'est pas au niveau, Jeremy le dit franchement ("il faut tout revoir", "un chat qui marche moins bien que ChatGPT") tout en pointant que c'est corrigeable. Le rapport doit porter ce verdict, sans l'édulcorer, formulé pro pour l'élève. Renvoyer vers "mes vidéos sur comment construire une application mobile" (jamais le mot "formation").

## 2026-08-25 , Proto web (Whyme) : verdicts de la vidéo Loom qui corrigent mon audit visuel
- **Contexte :** audit Whyme fait d'abord en pilotant le proto web dans Chrome, PUIS Jeremy a envoyé sa vidéo Loom d'analyse. Sa narration a contredit plusieurs de mes verdicts.
- **Ce qui était faux :** (1) j'avais dit "déplacer et nettoyer" l'écran marquee des mentors → Jeremy le SUPPRIME (animation type Shinobi sans valeur ici : la proposition de valeur = la conversation, pas des images). (2) J'avais validé "prénom demandé tôt" → faux, il doit venir EN PREMIER, demandé par la mascotte qui se présente ("Salut, moi c'est... Et toi ?"). (3) J'avais présenté "chat gratuit puis paywall à la fermeture" comme un choix à tester → Jeremy tranche : mauvaise chose (tokens consommés + valeur donnée avant de vendre), gate la conversation derrière un hard paywall au pic de motivation. (4) J'avais critiqué le "cadrage négatif" du downsell → son vrai point = la FORME trop textuelle (barrer/croix/griser les pertes), pas le cadrage. (5) J'avais salué l'écran de sortie doux → non : si refus, on RESTE sur le paywall.
- **Règles à appliquer désormais (généralisables, remontées au rubric) :** sélecteur de langue inutile (langue du téléphone auto, anglais par défaut) ; CTA pleine largeur alignés en bas sur TOUS les écrans ; logo/nom de l'app à enlever des écrans d'onboarding ; annoncer le test de perso avant de le commencer ; un SEUL chemin par écran d'onboarding (pas de lien secondaire type "See full analysis") ; écrans d'affirmation intercalés dans les questionnaires (social proof, autorité, en visuel) ; accroche paywall = résultat, jamais un mot d'argent ("Invest in yourself" interdit) ; app mobile = viser sous 100 €/an (~5 €/mois en annuel) ; % de réduction downsell calculé vs le mensuel ANNUALISÉ (et gonflé en conséquence) ; paiement immédiat au clic paywall, création de compte APRÈS ; valeur ajoutée d'un chat IA = widgets in-conversation (ex. respiration : bulle qui grossit/diminue + timer), sinon aucun avantage vs ChatGPT ; le premier message du mentor reprend les éléments de l'onboarding ; un bon design se comprend sans lire la langue.
- **Process proto web :** si Jeremy fournit une vidéo Loom d'analyse, la récupérer (yt-dlp) et la transcrire (whisper-cli local) AVANT de finaliser : sa narration prime sur mon audit visuel. La vidéo est une SOURCE pour l'audit, comme le screen recording : ne JAMAIS mettre le lien vidéo dans l'artifact/le rapport destiné à l'élève.
- **Pas de remarque sur le nom de l'app** sauf si Jeremy en fait une. J'avais critiqué "Whyme" (connotation "pourquoi moi") : Jeremy trouve le nom très bien. Le branding/nom n'est pas mon terrain d'initiative.
- **Écrire au bon temps** : ce qui est reporté à plus tard s'écrit au futur ("on fera l'ASO une fois publiée"), pas au présent.
- **Un claim ne doit jamais être démenti par le screenshot placé à côté.** La narration de Jeremy peut porter sur un autre parcours que ma capture (ex. il a testé Mentor Crisis avec un long premier message, ma capture montre Mentor Confident avec un message court). Avant d'embarquer un claim, vérifier que la capture choisie le montre ; sinon adapter le claim ou la capture.

## 2026-08-23 , Vérifier que le screenshot montre le BON écran (pas juste rendu)
- **Contexte :** in-app Unfried. J'avais mis une frame de l'écran "Hats" à la place de l'écran "Unfry" (les deux se suivent dans la vidéo, fond identique, le fry avec le même chapeau).
- **Règle :** avant d'embarquer une frame, la LIRE et confirmer qu'elle montre l'écran décrit par le finding (un élément-clé visible : ici le bouton STOP + "put on one song"), pas seulement qu'elle est complètement rendue. Deux écrans voisins avec le même décor se confondent vite. Extraire, monter en contact sheet, vérifier, PUIS injecter.
- **Transcription Whisper à recouper avec l'écran :** Whisper a écrit "son" pour "Song" (la copy parle d'une musique), et "un thé" pour un mot pas clair. Quand un mot transcrit paraît bizarre, le vérifier sur la frame de l'écran avant de le citer.

## 2026-08-23 , In-app Unfried : ne pas mal attribuer une cause, séparer contenu et bug d'affichage
- **Contexte :** audit in-app de Unfried, écran d'accueil. J'avais écrit "le message 50% OFF est répété par la frite à chaque ouverture".
- **Ce qui était faux :** deux choses mélangées. (1) La frite fait un petit message à chaque ouverture (dans une bulle) = c'est une BONNE chose, à garder. (2) Le "50% OFF" est un élément séparé. Le vrai problème, c'est que la bulle de la frite **chevauche/rentre en conflit** avec les éléments autour (dont le 50% OFF). Ce n'est pas la frite qui "répète" la promo.
- **Règle :** ne pas attribuer une cause que Jeremy n'a pas dite. Quand deux éléments d'UI se superposent, le finding est le **chevauchement** (bug d'affichage), pas le contenu. Séparer "l'élément est sympa/à garder" de "le layout déconne".
- **Règle (monétisation in-app) :** avec un hard paywall + premium par défaut à la sortie de l'onboarding, l'utilisateur qui voit l'app EST déjà premium. Donc enlever de l'in-app tout ce qui est promo/relance ("50% OFF", "Upgrade to Premium", "X days left", "Restore Purchases") : plus lieu d'être.

## 2026-08-23 , Ne pas hiérarchiser ni décider, parler plain comme Jeremy
- **Ne jamais décider ce qui est "le plus important", ne pas hiérarchiser, ne pas inventer de priorité ou de verdict que Jeremy n'a pas dit.** Si Jeremy ne le dit pas, ne pas le dire. Bannir "c'est le point le plus important de ce document", "problème structurel", "à corriger en priorité", et tout classement inventé.
- **Langage plain, comme Jeremy l'écrirait, pas d'IA.** Pas de formulations imagées : bannir "empilent exactement ces termes", "aucun n'y figure". Dire simplement : "Opal, one sec et ScreenZen utilisent ces mots-clés dans leur titre et leur sous-titre. Toi, tu n'en as aucun."
- **Ne pas suraffirmer.** Vérifier les claims mot par mot : ne pas dire "le titre ET le sous-titre ciblent des mots que personne ne recherche" si "Focus" (sous-titre) a du volume.
- **Ne jamais laisser MES corrections/erreurs dans l'audit.** Quand Jeremy me corrige (ex. "la frite brûle, elle ne fond pas"), c'est pour MOI, pas pour l'élève. Corriger silencieusement, sans écrire dans le rapport des notes du type "X, pas Y" qui rappellent mon erreur. L'audit ne contient que ce qui est utile à l'élève.

## 2026-08-22 , Une preuve visuelle par information
- **Contexte :** premier audit ASO (Unfried de Steven), version HTML partageable.
- **Ce qui était faux / manquant :** j'avais regroupé tous les screenshots dans une section "Captures" en bas. Jeremy veut voir la source de CHAQUE donnée juste à côté de la donnée.
- **Règle à appliquer désormais :** chaque information ou donnée chiffrée du rapport doit avoir son screenshot source directement à côté (dans la même section), pas regroupé ailleurs.
  - Fiche store → screenshot de la fiche App Store dans la section "Fiche store".
  - Densité de mots-clés → screenshot de la source (la description sur l'App Store).
  - Chaque mot-clé (popularité/compétitivité) → un screenshot AppFigures de CE mot-clé (panneau Insights avec le terme visible dans la barre de recherche). Ne pas se contenter d'une liste "related keywords" où certains termes (ex. "focus") n'apparaissent pas.
  - Règle générale : si je l'affirme, je le montre. Une donnée sans preuve visuelle ne va pas dans le rapport.

## 2026-08-22 , Transcrire la narration AVANT d'auditer (le verdict vient de Jeremy)
- **Contexte :** audit onboarding de Unfried. J'ai audité uniquement le visuel de la vidéo et conclu "très bon onboarding". Faux : dans la narration, Jeremy disait l'inverse (pas assez d'écrans, tout arrive trop tôt).
- **Ce qui était faux :** inférer le verdict à partir des écrans au lieu d'écouter ce que Jeremy dit dans la vidéo.
- **Règle :** quand la vidéo contient de la narration, la **transcrire d'abord** (Whisper/MacWhisper) et en faire la source de vérité du verdict. Ne jamais déduire l'avis de Jeremy des visuels seuls. Les captures servent de preuve, la narration donne le jugement.

## 2026-08-22 , Onboarding niche temps d'écran : plus d'écrans, progressif, rien trop tôt
- **Contexte :** Unfried. Jeremy veut BEAUCOUP plus d'écrans, un onboarding plus progressif.
- **Règle (niche temps d'écran / digital wellbeing / habitudes) :** plus d'écrans = mieux. Enchaîner beaucoup de questions diagnostic (temps perdu, moments, coût, émotions, déclencheurs) pour faire investir l'utilisateur avant de demander quoi que ce soit. Rien trop tôt : paywall en tout dernier, demande d'avis HORS onboarding (après un moment positif), ATT au 1er lancement. Réaffirmation + preuve + Paradis personnalisé + engagement (nom, contrat, heure de rappel) avant la conversion. L'investissement (réponses, nommer le fry, s'engager) fait monter la conversion.
- **Livrable :** chaque audit d'onboarding inclut une section **"Proposition d'onboarding"** = la liste complète de toutes les étapes, marquées existe / à ajouter. Section à affiner au fil du temps avec l'analyse des concurrents (Jeremy dira comment).

## 2026-08-22 , Toujours vérifier la lisibilité / accessibilité des textes
- **Contexte :** Unfried. Jeremy veut un finding transversal sur l'accessibilité.
- **Règle :** vérifier systématiquement la lisibilité des textes : pas trop petits, contraste suffisant, pas resserrés/collés, et l'écran exploité (le contenu prend la place). Sur mobile natif = gros contenu, peu d'infos par écran, facile à lire et cliquer. L'utilisateur vient de TikTok/Insta, attention ultra-limitée : il ne lit QUE le gras, le reste est inutile. Correction type : agrandir, contraster, aérer, un seul message fort par écran, l'essentiel en gras, virer le superflu.
- **Ordre des écrans : expliquer AVANT de demander.** Toujours introduire un concept avant de demander à l'utilisateur d'agir dessus (ex. Unfried : expliquer "Your fry is your screen time" AVANT de demander de nommer le fry, pas l'inverse). L'écran d'action doit être minimal ("Give a name to your fry"), pas surchargé de texte.
- **Écran de permission (Screen Time) :** le garder ultra simple. Éviter les doublons ("0 apps selected" + "no apps selected"), le cadenas/texte minuscule illisible, la phrase sous le bouton, deux boutons, mockup + carte redondants. Modèle : soit une liste de catégories claire + Continue (Opal), soit un écran épuré qui met en avant le dialogue système iOS avec une flèche + une phrase de réassurance ("tes données restent 100% sur ton téléphone").
- **Références concurrents :** quand Jeremy fournit des screenshots de concurrents (Opal, stoic, one sec...), les intégrer en références dans la section concernée du rapport (galerie), pour montrer le modèle à suivre. **Banque d'inspirations réutilisable dans `references/inspirations/`** (classée par type d'écran : paywall-free-trial, permission-screentime, social-comparison), voir son README. Y piocher pour les futurs audits et l'enrichir quand Jeremy en envoie d'autres.
- **Unfried : la frite BRÛLE quand tu scrolles, elle revit quand tu poses le tel.** Utiliser le verbe "brûler" (PAS "cramer", trop familier). Nom "Unfried" = ne plus être fried (brûlé). La mascotte (l'icône de l'app) doit être présente partout : carrousel centré sur le fry (pas de chiffres, gardés pour le moment personnalisé), même style.
- **Format dialogue mascotte (idée de Jeremy, validée) :** mascotte frite en haut à gauche + bulle à droite qui pose les questions (façon Shinobi/Duolingo) → attachement + onboarding vivant. Vers la fin, la frite parle en émotionnel : "Quand tu es sur ton téléphone, je brûle. Quand tu le poses, je revis. Ne me laisse pas mourir." L'écran de nommage : c'est la frite qui demande SON propre nom (première personne, ex. "Oh, by the way... what's my name?"), pas "nomme la frite".
- **Jamais d'émoji comme illustration.** Dans les recos (carrousel, etc.), ne pas mettre d'émoji. Décrire l'illustration ou l'animation avec un **prompt** (à générer avec Claude Code ou ChatGPT). La copy doit être axée résultat/objectif, très courte et simple à comprendre.
- **Screenshot seulement quand l'écran est complètement rendu.** Les écrans ont des animations d'affichage : extraire la frame trop tôt donne un écran à moitié affiché. Prendre la frame une fois l'écran stabilisé (choisir un timestamp un peu plus tard, ou vérifier la frame).
- **Écrans à animation longue = ne pas dédoubler.** Un même écran qui a une longue animation (loader qui se remplit puis révèle du contenu, etc.) ne doit pas devenir 2 cartes différentes dans l'audit. Vérifier si deux "écrans" successifs ne sont pas en fait le même écran à deux moments de son animation.
- **Appliquer la règle de contraste à MES propres rapports.** Ne pas utiliser le gris le plus pâle (token le plus clair) pour les sous-textes/légendes : ils deviennent illisibles. Utiliser un gris secondaire lisible. (Erreur faite dans l'artifact Unfried.)
- **Les exemples designés vont aux DEUX endroits :** dans l'analyse écran par écran ET dans les étapes de la "Proposition d'onboarding", pour que l'élève ait les instructions dans les deux sections.
- **Écrans tutoriel / mécanique :** l'animation doit être grosse et visuelle, pas juste un chiffre qui change (ex. Unfried : la santé passe de 100 à 0, trop discret). Montrer l'effet réel (ex. le temps d'écran qui monte pendant que la santé baisse), avec une hiérarchie de texte claire qui fait comprendre qu'il y a plusieurs étapes. Moins de texte, moins d'éléments.
- **Loader "Building your plan" :** pas de spinner statique. Étapes personnalisées (reprenant les réponses) cochées une par une + une seule barre de chargement plus grosse. Jamais deux barres de progression à l'écran (enlever la barre d'étapes d'onboarding sur ce dernier écran). À la fin du chargement → rediriger direct vers un écran de projection.
- **Comparaison sociale (pattern Blinkist/Cal AI) :** un écran avec 2 barres "Toi" vs "La plupart des gens", cadrage POSITIF/aspirationnel (ta barre basse = ton objectif, celle des autres haute → tu te sens en avance). Jamais l'inverse (te montrer haut = shame). À placer juste après le choix de l'objectif.
- **Projection / Paradis (niche temps d'écran) :** cadrer sur le GAIN, jamais la perte (un "il te reste 15 jours perdus" démotive même en utilisant l'app). Deux formes utiles : (a) un compteur qui monte de 0 à X "jours gagnés dans ta vie", minimal, juste après le choix de l'objectif ; (b) un graphique de projection sur 30 jours avec 2 courbes : avec l'app (baisse) vs sans (grise, en dents de scie).
- **Écrans de choix (exemple Unfried "Where would you like to get to") :** enlever les sous-textes que personne ne lit, chiffres gros, une seule unité (pas de mix minutes/heures à convertir), et remplacer les émojis par des icônes visuelles (ex. horloge qui se remplit) pour comprendre sans lire ni réfléchir. Attention à l'ordre : il dépend du sens (ici l'objectif le plus ambitieux 30 min est en bas, donc 90 → 30 est correct), ne pas imposer un ordre croissant par réflexe. Quand c'est pertinent, **designer un exemple visuel** (SVG/HTML) dans le rapport pour montrer la version corrigée.
