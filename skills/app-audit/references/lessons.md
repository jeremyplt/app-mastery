# Lessons , corrections accumulées de Jeremy

Ce fichier grossit à chaque fois que Jeremy corrige un audit rendu. Les leçons ici **priment sur le rubric** en cas de conflit. C'est la mémoire de l'outil d'audit qui s'améliore.

Format d'une entrée :

```
## 2026-10-27 , Vintapp : captures cliquables
- **Contexte :** premier jet ASO de Vintapp (Ayoub) en page HTML.
- **Ce qui était faux :** les screenshots n'étaient pas cliquables, impossible de les voir en grand.
- **Règle à appliquer désormais :** sur TOUS les audits HTML, chaque capture s'ouvre en grand au clic (lightbox, voir `report-template.md` § Version HTML partageable).
- **Pas de section « Texte promotionnel »** dans l'ASO : Jeremy la juge inutile (non indexé, aucun levier pour l'élève). Ne pas en faire une section.
- **La synthèse couvre TOUT l'audit.** Quand on ajoute des sections (onboarding, paywall, in-app, chiffres) à un audit commencé par l'ASO, réécrire le paragraphe d'intro de la synthèse pour qu'il parle de toute l'app, et ranger les points dans l'ordre du parcours (ASO, onboarding, paywall, in-app, chiffres). Jeremy a trouvé « trop bizarre » une synthèse dont l'intro ne parlait que de l'ASO.
- **Écrans encombrés ≠ trop montrer.** Ne pas écrire qu'un onboarding « en montre trop » : montrer beaucoup de choses sur l'app, c'est bien. Le problème, c'est l'encombrement de chaque écran (trop d'éléments, trop de texte, tout en petit). Formuler « écrans trop encombrés ».
- **Maquettes de démonstration : montrer le produit en action, en grand.** Un simple fondu entre deux photos ne suffit pas : animer la vraie séquence (scan de la photo, photo pro, puis titre, prix et description qui apparaissent). Les photos d'une comparaison doivent être grandes et lisibles, avec le prix posé dessus. Proposer 2 versions quand c'est pertinent (photos en grand, ou graphique en barres). La preuve sociale (note, nombre d'annonces) se met en avant en gros, avec des lauriers, pas en petit texte gris.
- **Une démo animée doit se comprendre même à l'arrêt.** L'état final montre la transformation (photo d'origine en vignette, flèche, résultat, annonce prête). Ne pas couper l'animation des maquettes avec `prefers-reduced-motion` : Jeremy l'a vue figée et n'a « rien compris ». Vérifier chaque étape en rendu (le Chrome headless est en mouvement réduit : neutraliser la règle pour tester).
- **Photos nettes pour les maquettes : générer avec l'API OpenAI** (clé `OPENAI_API_KEY` dans `~/Projects/shinobi-admin/.env.local`, modèle `gpt-image-2`, ne jamais afficher la clé). Pour un avant/après cohérent : générer l'« avant », puis l'« après » via `/v1/images/edits` à partir de l'avant (même article). Les recadrages de vidéo sont trop flous en grand.
- **Bouton d'action principal à cheval sur la barre d'onglets** (Vintapp, 27/10) : Jeremy le veut plus gros et qui dépasse en haut de la barre pour le mettre en valeur, centré, avec les libellés des autres onglets bien alignés. Ça précise la leçon Binôme : ce qui gênait, c'était un bouton mal placé, pas le fait qu'il dépasse.
- **Garder les infos importantes de l'écran d'origine dans la maquette** (ex. « 100 scans left » sur l'accueil). Simplifier, ce n'est pas tout enlever.
- **Préfixer aussi les classes d'icônes des maquettes** : une icône `.chart` a hérité du style du graphique `.chart`, et une icône `.tag` du badge `.tag` du paywall (icône invisible). Vérifier en rendu que chaque icône s'affiche.
- **Achats lancés mais pas aboutis : pas un problème à remonter.** Que plus de la moitié des gens qui appuient sur « S'abonner » abandonnent sur la fenêtre de paiement Apple ne choque pas Jeremy (195 lancés, 87 aboutis chez Vintapp). Ne pas en faire un point d'audit.
- **Une feuille (bottom sheet) s'affiche par-dessus le vrai écran** : mettre l'écran d'origine complet, assombri, en arrière-plan, jamais un fond vide.

## AAAA-MM-JJ , <titre court>
- **Contexte :** (quelle app, quelle section)
- **Ce qui était faux / manquant :**
- **Règle à appliquer désormais :**
```

Quand une leçon se généralise (elle vaut pour toutes les apps, pas juste un cas), la remonter aussi dans `rubric.md`.

---

## 2026-10-31 , Binôme V3 : que ce qu'il faut faire, rouge réservé au grave, étiquettes hors de la courbe
- **Contexte :** audit V3 de Binôme (Fatoumata), après une V2 dont la plupart des recos étaient appliquées.
- **Ce qui était faux :** (1) des cartes « à garder » / « très bien » (écran avec et sans, paywall et compte) et une intro qui listait tout ce qui était fait : Jeremy, « ça rajoute du bruit pour rien ». (2) Deux petits bugs (initiale « J » / « B », boutons de test) dans des cartes à bordure et titre rouges : « c'est pas très grave ». (3) L'étiquette « 99 % » posée sur la courbe du graphique.
- **Règles à appliquer désormais :**
  - L'audit ne parle QUE de ce qu'il faut faire. Pas de section, carte ou paragraphe sur ce qui est bien. Un compliment d'une phrase en intro suffit, sans lister ce qui a été fait.
  - Le style rouge (`.bug`) est réservé à ce qui casse vraiment l'app (crash, achat impossible, écran vide). Les petits bugs vont dans une carte normale, sans « Bug : » dans le titre.
  - **Une animation d'écriture (streaming, machine à écrire) se fait en JavaScript** : bulle vide, trois points, puis les mots ajoutés un par un, puis on recommence en boucle. Un fondu CSS mot par mot ne marche pas : Jeremy voyait déjà tout le texte (« c'est un peu bizarre »). Pour le PDF, un attribut `data-print` coupe le script et la réponse complète s'affiche.
  - Sur un graphique de maquette, aucune étiquette ne chevauche une courbe : la placer dans l'espace vide au-dessus et la relier au point avec une flèche. Vérifier en rendu zoomé.

## 2026-10-29 , Family Quest : carrousel explicite et animé, écrans remplis
- **Contexte :** audit onboarding de Family Quest (app de tâches pour enfants, payée par le parent). Ma maquette de carrousel reprenait l'image du monde mise par l'élève, avec une phrase.
- **Ce qui était faux :** (1) l'image de l'élève « ne veut rien dire, ne montre rien » : une maquette de carrousel doit être explicite. (2) Pas assez de maquettes. (3) Des écrans à moitié vides.
- **Règles à appliquer désormais :**
  - **Carrousel = une slide par étape de la boucle de l'app, animée** : on MONTRE l'action en boucle (ex. le parent tape la tâche et l'envoie / l'enfant coche, la notif arrive, le parent valide / le héros prend un niveau, le dragon grandit). Animations propres, l'état final affiché au chargement (`animation-delay` négatif) pour qu'elle se comprenne à l'arrêt.
  - **Parler à celui qui paie.** Dans une app enfant, le carrousel parle d'abord au parent (créer les tâches, valider), le jeu vient après comme résultat.
  - **Écran rempli avec peu de choses** : jamais de grand vide en bas. Agrandir l'élément principal (illustration, monde, mascotte), ajouter le clavier ou le pavé numérique quand il y a une saisie, une carte récap au milieu, plutôt que d'ajouter des éléments.
  - **Une maquette pour chaque étape de la Proposition d'onboarding** (galerie dans l'ordre des étapes), en plus des maquettes sous chaque remarque.
  - **Une maquette sous chaque correction qui décrit un écran** (screenshots App Store, création de compte, première tâche, message de fin de temps, réglages…), pour que l'élève voie ce qu'il faut faire.
  - **Des maquettes qui racontent l'app, pas des listes génériques** (2e retour de Jeremy : « tu peux mieux faire ») :
    - les options montrent ce qu'elles font (avatars de la famille + « Ajouter », un code à 6 chiffres), pas des personnages décoratifs ;
    - l'accueil enfant montre la progression (niveau, XP, « encore 1 tâche pour le niveau 6 »), le temps gagné et l'état de chaque tâche (à faire, le parent doit valider, validée) ;
    - un écran de jeu montre où on en est (chemin du chapitre) et la mission du jour avec sa récompense ;
    - un réglage anticipe les questions du parent (plus ou moins d'heures avec − / +, « Pas de limite le week-end », « modifiable dans l'espace parent »).
  - **Questions sur la douleur, reprises jusqu'au paywall** (3e retour : « pas axé sur la douleur de l'utilisateur ») :
    - plusieurs questions qui appuient sur la douleur, avec un sous-titre émotionnel par réponse (« J'ai l'impression de parler dans le vide », « Cris, larmes, porte qui claque ») ;
    - un écran qui chiffre ce que ça coûte (« plus de 5 fois par jour = 1 800 fois par an »), puis « sans / avec l'app » ;
    - un chargement « On prépare le plan de X » qui reprend ses réponses, puis « Le plan de X est prêt » qui reprend chaque douleur avec la solution en face ;
    - le titre du paywall reprend la douleur en 3 mots (« Fini de répéter. »), pas une phrase jolie sur le produit ;
    - **presque pas de texte sur les maquettes** (4e retour : « trop de texte, tu sais bien que j'aime pas ça ») : un grand visuel (mascotte), un titre court, une timeline d'essai horizontale en un mot par étape (Gratuit / Rappel / prix), le prix, un bouton. Pas de liste de bénéfices en phrases ;
    - jamais de statistique inventée (« la réponse la plus fréquente des parents ») sans source.
  - **Jamais une image décorative à la place d'une preuve** (5e retour : « image vide de sens ») : sur le paywall, la mascotte seule ne dit rien. Montrer ce que le parent achète (les notifs « Quentin a rangé sa chambre ✓ » empilées). Écran de plan = un graphique avant/après (« fois où tu répètes » de 5+ à 0 en 2 semaines) + 3 tuiles chiffrées, pas des cartes de texte.
  - **Écrans validés par Jeremy pour une app enfant/parent** (après 3 propositions par écran sur une page à part) :
    - plan personnalisé = **une quête à signer ensemble** (parchemin avec les tâches tirées des réponses, minutes gagnées, récompense finale, deux lignes de signature enfant/parent, CTA « Signer la quête ensemble »). Rejetés : cartes de texte, graphique avant/après, calendrier 14 jours, boucle en 4 étapes ;
    - paywall = **l'écran verrouillé du parent ce soir** (heure en grand, notifs « Quentin a… ✓ » empilées) + feuille du bas avec la timeline d'essai horizontale (Gratuit / Rappel / prix), le prix à la semaine, un bouton.
  - **Quand Jeremy n'aime pas un écran deux fois de suite**, proposer 3 pistes vraiment différentes sur une page à part, plutôt que de retoucher la même idée.
  - **Après chaque publication, vérifier que toutes les images utilisées sont bien publiées** (`action: list, scope: files`) : `img/mk/egg.jpg` manquait et la carte Mission s'affichait vide.

## 2026-10-09 , Ember (Malika) : app pas encore sortie, screenshots, clarté
- **Contexte :** audit Ember (app de focus avec pauses actives), app pas encore publiée.
- **Ce qui était faux :** (1) section « Data à vérifier » alors que l'app n'est pas sortie. (2) Screenshot de la quête qui montrait l'accueil (frame prise pendant une transition, vérifiée seulement sur la planche de miniatures). (3) Liste en vrac « marche, yeux, nuque, hydratation » que Jeremy n'a pas comprise. (4) Le bug du bouton Zen (écran blanc sur l'écran The Shield) n'était pas illustré.
- **Règles à appliquer désormais :** app pas encore sortie = section « Data à mettre en place » (pas « à vérifier »). Toujours relire la frame finale extraite, jamais seulement la planche de miniatures. Jamais de liste de mots en vrac : des phrases complètes avec un exemple concret. Quand un bouton a un comportement différent selon l'écran (ou mène à un écran vide), montrer les captures avant / après côte à côte. Toujours recommander un système de feedback et de bug report dans les réglages.

## 2026-10-05 , Sentinelle : maquettes, objectif de conversion, comptes
- **Contexte :** premier jet d'audit Sentinelle (Julien) à partir des stats + maquettes V2, sans vidéo de Jeremy.
- **Ce qui était faux :** (1) j'ai critiqué des écrans de maquettes comme si c'étaient des bugs (5 notifications identiques, écran d'erreur 403 « l'utilisateur gratuit tombe sur une erreur », données de portefeuille incohérentes). (2) J'ai visé « 4 à 5 % » puis 5 % de conversion. (3) J'ai recommandé de sortir le bloc « Si vous aviez investi 1 000 $ » du petit texte et de mettre en avant les insiders qui performent : Jeremy n'est pas d'accord, retiré. (4) J'ai critiqué un carrousel de cartes de profils dans l'onboarding (« chiffres minuscules, un seul profil en grand ») : Jeremy n'est pas d'accord, un carrousel de cartes qui montre la richesse du contenu est un bon écran d'onboarding.
- **Règles à appliquer désormais :** des écrans fournis en zip/maquettes = des mises en situation (états, erreurs, contenus factices). Ne critiquer que le design et le wording des composants, jamais le contenu répété, les données affichées ou la présence d'un écran d'erreur. Objectif de conversion installation → payant à annoncer : **4 %**, pas plus. L'onboarding V2 peut être sur Superwall comme le paywall (Paywalls & Flows) : le chercher là. Pour l'ASO, l'analyse AppFigures (une capture par mot-clé, pays France + densité de description) est obligatoire même pour un premier jet. Claude ne crée pas de compte ni ne saisit de mot de passe : demander à Jeremy de se connecter (souvent « Sign in with Google »).

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

## 2026-10-19 , Soft paywall = pas d'essai gratuit, pas de timeline d'essai
- **Contexte :** Pharma Stock (pharmacie maison). J'avais recommandé un paywall façon Shinobi avec la timeline « comment marche ton essai » et laissé le choix freemium ou hard paywall.
- **Ce que Jeremy a tranché :** pour commencer, on reste sur un soft paywall, donc pas d'essai gratuit. L'essai gratuit va avec le hard paywall, jamais avec le freemium.
- **Règle :** si l'app reste en freemium / soft paywall : enlever l'essai gratuit des plans, pas de timeline d'essai, une croix pour continuer en gratuit, un tableau Gratuit / Premium qui montre ce qu'on gagne, l'annuel ramené au mois + le mensuel, un bouton « Continuer ». Les blocages dans l'app (fonctions premium) restent et ouvrent le même paywall. Inspirations : `references/inspirations/paywall-soft-sans-essai/` (cherchées sur Mobbin, Subscription & Paywall). La timeline d'essai (`paywall-free-trial/`) ne sert QUE pour un hard paywall.

## 2026-10-19 , Maquettes HTML : niveau vraie app, jamais un brouillon
- **Contexte :** Pharma Stock. Mes 2 maquettes d'accueil étaient des cartes plates : pas de cadre iPhone, « + » pas centré, 3 onglets texte sans icône, grands vides. Jeremy : « c'est dégueulasse ».
- **Règle :** toute maquette d'écran dans un audit doit ressembler à une vraie app iOS : cadre iPhone (Dynamic Island, barre d'état 9:41, barre d'accueil), grand titre iOS, cartes avec ombres légères, icônes SVG partout (jamais d'initiales type « Ib » ni d'émoji), textes sur une ligne (raccourcir plutôt que tronquer), pas de grand vide.
- **Barre de navigation :** nombre PAIR d'onglets, autant à gauche qu'à droite du « + », chacun avec icône + libellé, le « + » centré dans sa colonne (grille à 5 colonnes égales), plus gros et qui dépasse de la barre.
- **Vérifier avant de publier :** rendre la maquette en capture (Chrome headless) et la regarder, à la largeur bureau et téléphone.
- **Écrans vides (empty states) :** jamais une icône grise + deux lignes de petit texte. Même s'il n'y a encore rien, l'écran doit être vivant : un aperçu de ce qui va se remplir (ex. la semaine pour un historique), une phrase courte qui explique à quoi sert l'écran, et un **gros bouton** qui lance la première action (« Noter ma première prise »), plus éventuellement un lien secondaire. Mettre une maquette de l'écran vide corrigé dans l'audit. (Pharma Stock, écran « Usage log ».)
- **Une maquette pour CHAQUE remarque de design** (onboarding, paywall, in-app, notifications), pas seulement l'accueil. Placée sous la remarque, avec une légende d'une phrase.
- **Direction artistique unique, pas « app vibecodée ».** Éviter le look générique (cartes blanches arrondies + une couleur d'accent + police système partout). Partir de l'objet réel du sujet pour trouver 3 ou 4 signatures (Pharma Stock : papier crème du carton, une couleur par médicament comme le bandeau des boîtes, infos EXP/LOT en police mono, stock en plaquette de comprimés, « + » en croix de pharmacie). Polices avec du caractère (ex. Bricolage Grotesque + Instrument Sans + JetBrains Mono), pas d'excentricité.
- **Ne pas redemander ce qui existe déjà.** Avant d'écrire une correction, vérifier sur la capture que ce n'est pas déjà en place (Pharma Stock : l'orange et le rouge des stocks existaient déjà, j'avais demandé « un vrai code couleur »).
- **Typo française dans les maquettes :** espace insécable avant « ? » et « : », pour ne jamais avoir un « ? » seul en début de ligne.

## 2026-10-27 , Binôme V2 : maquettes « AI slop », échelle réelle, 3 directions artistiques
- **Contexte :** audit V2 de Binôme (Fatoumata). Jeremy : « full AI slop, très générique, pas neat », dimensions fausses, étiquette posée sur la courbe, éléments qui sortent du cadre, « + » qui sort de la barre d'onglets.
- **Ce qui était faux :** maquettes dessinées directement en petit (proportions fausses), étiquettes en police mono majuscules partout, pastilles et badges décoratifs, icônes sur chaque option, mascotte redessinée en SVG au lieu du vrai visuel de l'app, classes CSS en conflit avec la page (contenu qui déborde).
- **Règles à appliquer désormais :**
  - Dessiner chaque maquette à l'échelle réelle d'un iPhone (393 x 852 pt) puis la réduire avec `transform: scale()`. Métriques iOS : marges de 20 pt, bouton de 56 pt, options de 60 pt, grand titre de 34 pt.
  - Préfixer toutes les classes des maquettes (`.s ...`) pour éviter les conflits avec le CSS de la page, et vérifier en rendu qu'aucun élément ne sort du cadre.
  - Sobre et propre : une seule idée visuelle forte par écran, pas d'étiquette mono, pas de badge décoratif, pas d'icône sur les options de réponse.
  - Réutiliser les vrais visuels de l'app (mascotte découpée dans la vidéo), jamais un dessin de remplacement.
  - Les graphiques : légende hors de la courbe, dégradé sous la courbe principale, courbe « sans » en pointillé gris.
  - Quand le branding est à revoir, proposer 3 directions artistiques (polices + couleurs) avec un sélecteur en haut de la page qui change toutes les maquettes (variables CSS par thème).
- **Écrans d'affirmation (Jeremy) :** dans un onboarding de révision, ajouter un écran « Les élèves qui ont une bonne méthodologie et les bons outils réussissent leurs examens dans 99 % des cas » et un écran « Avec et sans [app] » avec deux barres.
