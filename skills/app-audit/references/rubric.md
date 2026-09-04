# Rubric d'audit d'app , méthodologie de Jeremy

Extrait de ses audits réels (AXIOM, DogGenius, VocabRecall, DressCode) et de sa checklist template. Parcourir l'app dans l'ordre du parcours utilisateur. Les `lessons.md` priment sur ce fichier en cas de conflit.

Vocabulaire métier récurrent : effet wow, la douleur de l'utilisateur, le Paradis, se projeter, dark pattern, mini-goal, immersion totale, friction, portes de sortie, mots transparents, débrancher son cerveau, mindset startup, 20/80, MVP, keyword density, ranker.

Invariants (à vérifier quelle que soit l'app) : ASO orienté bénéfices, carrousel de bénéfices, prénom + personnalisation, phase Paradis, cohérence tutoiement/vouvoiement, paywall clair sans distraction avec libellés "X mois", ATT tôt, notifications reliées à l'objectif, immersion sur la feature principale, patterns/icônes standards, découpage en mini-goals, chasse aux dark patterns et fautes, test réinstall, data/funnel à vérifier.

---

## 1. ASO (page store)

- **Titre** : contient des mots-clés réellement recherchés, 30 caractères max bien exploités. Mauvais = mot-clé du titre pas recherché. Indiquer le compteur (ex. "Titre (29/30 caractères)").
- **Sous-titre** : existe, optimisé, 30 caractères, sans répéter les mots du titre. Sous-titre vide = un tiers de la surface de référencement perdue.
- **Keywords** : champ de 100 caractères rempli, sans répéter titre/sous-titre.
- **Densité de mots-clés de la description** : la mesurer avec l'outil **Keyword Density Analyzer d'AppFigures** (menu Tools → coller la description), PAS un calcul maison. Mettre un screenshot du rapport comme source. Orientée vers les requêtes qui font ranker. Rappel (Jeremy) : **personne ne lit la description** ; ce qui convainc l'utilisateur, c'est les **screenshots**. La description ne sert QU'à l'indexation. Elle doit donc être remplie de mots recherchés, pas écrite comme une histoire. Mauvais = les termes les plus denses sont des mots vides ou de marque.
- **Popularité vs compétitivité des mots-clés** : chiffrer (ex. "ai stylist : popularité 18, compétitivité 66" vs "outfit planner : popularité 47"). Mettre le mot-clé à plus forte popularité en principal.
- **Screenshots** : vérifier sur mobile ET iPad. Doivent parler de **bénéfices, pas de fonctionnalités** ("Ajoute tout en un clic" → "Habille-toi en 1 clic"), avec du zoom. "Trois visuels soignés convertissent mieux que six visuels moyens."
- **Langues** selon les marchés visés.
- **Disponibilité tablette** : app bien dispo sur iPad + screenshots iPad dédiés (les stores poussent les apps bien adaptées au device).
- **Prix hors description** : enlever le prix de l'abonnement de la description (friction, maintenance, zéro apport SEO).

Si l'app n'est pas encore publiée : reporter l'ASO à plus tard (une fois publiée) et le noter.

## 1 bis. Invariants UI mobile (tous les écrans)

- **CTA pleine largeur, aligné en bas** sur TOUS les écrans (onboarding, paywall) : cliquable d'une main, droitier ou gaucher. Jamais un bouton au milieu de l'écran.
- **Sélecteur de langue banni** : récupérer la langue du téléphone dans le code, anglais par défaut si non supportée.
- **Logo / nom de l'app à enlever des écrans d'onboarding** : prend de la place et distrait le regard.
- **Un SEUL chemin par écran d'onboarding** : jamais deux liens/boutons concurrents (pas de "Voir l'analyse complète" à côté de "Continuer"). L'utilisateur ne doit pas réfléchir.
- **Un bon design se comprend sans lire la langue** : si quelqu'un qui ne lit pas l'anglais comprend l'écran (éléments barrés, croix, grisés, icônes), le design est bon.
- **Navigation mobile TOUJOURS en bas, jamais de hamburger** : le menu hamburger est un pattern web ; sur une app native on navigue entre les sections en 1 clic via une barre en bas.
- **L'action principale de l'app toujours accessible** (ex. "Nouvelle séance" sur une app de conversation) : l'utilisateur ne doit jamais être bloqué sans pouvoir relancer le coeur de l'app.
- **Textes générés adressés à l'utilisateur en "tu/on/nous"**, jamais "le client" / "le mentor" en 3e personne (sinon on dirait un outil pour thérapeutes/pros, pas pour l'utilisateur final).
- **Chasser les clés i18n brutes** ("session.summary_close") : parcourir l'app dans chaque langue et chercher les textes en "xxx.yyy".
- **Tester soi-même chaque feature avant de la citer** (vocal, TTS, boutons) : un contrôle visible n'est pas une feature qui marche.

## 2. Onboarding (structure et copywriting) , la section la plus dense

**Structure de départ (Jeremy, ~95% du temps) :** la landing = un **carrousel de 3 slides** (on ne demande rien avant, surtout pas le prénom). Juste **après le carrousel**, demander le **prénom** pour personnaliser le reste de l'onboarding (quand ça fait sens dans la niche).

**Principe niche temps d'écran :** plus d'écrans = mieux. Un onboarding court qui balance le paywall/l'avis/l'ATT trop tôt convertit mal. Enchaîner beaucoup de questions diagnostic pour faire investir l'utilisateur, puis réaffirmation + preuve + Paradis + engagement AVANT la conversion. Livrer une section **"Proposition d'onboarding"** (la liste complète des étapes, existe / à ajouter) à affiner avec l'analyse concurrents.


- **Premier écran / carrousel** : axé **proposition de valeur et bénéfices**, pas le process ni le nom de l'app. Reco par défaut = remplacer une landing pauvre par un **carrousel de 3 ou 4 slides**, une slide par bénéfice, racontant une progression. Fournir titres + copy + illustration slide par slide.
- **Animation** : slides animées (2-3 s en boucle), montrer les interactions automatiquement (drag and drop) pour l'effet wow et faire comprendre un concept sans lire.
- **Démontrer, ne pas mettre l'app dans l'app** : bannir les mockups de téléphone en in-app (ça relève du marketing store).
- **Ordre des questions logique**, récolte toutes les infos nécessaires.
- **Prénom demandé EN PREMIER** (avant toute question diagnostic) puis réutilisé ("Quel est ton objectif, Livio ?"). Pas de prénom = trop froid. Si l'app a une mascotte, c'est ELLE qui se présente et le demande ("Salut, moi c'est... Et toi, comment tu t'appelles ?") : la mascotte porte tout l'onboarding en format dialogue (Duolingo, Brilliant, Shinobi). Pas besoin de l'animer au début, des illustrations suffisent.
- **Annoncer un test/quiz avant de le commencer** ("On va te poser quelques questions pour définir ta personnalité, prêt ?") : donne l'objectif, permet ensuite "en fonction de ta personnalité, voici le plan recommandé".
- **Écrans d'affirmation intercalés dans les questionnaires longs** (sinon effet interrogatoire) : aérer, appuyer sur la douleur, rassurer, positionner l'app en source d'autorité. Social proof chiffré ("80 % des gens font face au même problème", "97 % l'ont résolu en une semaine"), en visuel (graphique, illustration), pas en pavé de texte.
- **Questions sur le pourquoi / l'objectif et la douleur** (pas seulement sur le produit-objet ; ex. DogGenius posait plein de questions sur le chien, aucune sur le maître). Faire **verbaliser le besoin** et récupérer la data.
- **Écran d'affirmation / réaffirmation** adapté à la réponse juste donnée (ex. "Trop dur pour moi" → "si tu trouves ça trop dur, c'est qu'on ne te l'a pas bien expliqué").
- **Phase "Paradis"** : écran avant le paywall montrant les résultats futurs (avec vs sans l'app), **personnalisé selon l'objectif et les réponses**. Erreur = Paradis trop tôt (avant de connaître l'objectif et d'avoir appuyé sur la douleur) → il perd son effet.
- **Preuve scientifique** : APRÈS les objectifs, au moment d'annoncer le progrès potentiel (pour rassurer), jamais avant (erreur VocabRecall = "loi de Zipf" trop tôt).
- **Cohérence tutoiement / vouvoiement** sur TOUS les écrans (jamais mélangés). Le choix dépend de la niche (tutoiement pour hommes 18-35, enfants/lycéens).
- **Retour en arrière possible** pour corriger une erreur (le forcing vers l'avant frustre et fait abandonner).
- **Écrans d'éducation** : 1 titre + 1 phrase + 1 illustration max, lisibles en moins de 10 secondes. Trop de texte = personne ne lit. Ne pas couper le message en 3 blocs de texte sur le même écran.
- **Phrases simples et directes, pas des énigmes.** Le copy doit aller droit au but, compréhensible du premier coup. Mauvais (Unfried) : "Unfried gives you something that gets fried first" = incompréhensible.
- **Lisibilité / accessibilité** : textes assez grands, contraste suffisant, bien aérés (pas resserrés/collés), et l'écran exploité (le contenu prend la place). Sur mobile natif : gros contenu, peu d'infos par écran, facile à lire et à cliquer. L'utilisateur vient des réseaux (TikTok/Insta), attention ultra-limitée, il ne lit QUE ce qui est en gras. Mettre l'essentiel en gras, virer le superflu. (Cf. règle produit : jamais de petit texte gris.)
- **Pas d'icônes/visuels dupliqués** sur un même écran (une icône doit être distinctive, sinon aucune).
- **Objectif abstrait en mini-goals** : jamais de chiffre total démoralisant ("1 347 mots pour passer en A2", "5700 mots") → promesse positive et atteignable ("A2 en 1 mois avec 5 min/jour !"). Rappel : l'utilisateur vient des réseaux, attention et motivation limitées, veut parler anglais sans faire d'effort.
- **Pas de dark patterns** : mots négatifs ("effort"), faux boutons (aspect bouton, même border-radius/drop-shadow, sans interaction réelle).
- **Zéro faute d'orthographe** (relire chaque écran ; relevés vus : "2 mins", "un peux d'effort").
- **CTA clair sur bouton cliquable** (pas de "tap l'écran" / "Appuyez pour continuer", jugé peu intuitif et non-standard).
- **Pas de formulaire / création de compte obligatoire pendant l'onboarding** : grosse friction, point de décrochage. Usage en anonyme, enregistrement plus tard. Le paywall vient AVANT la création de compte.
- **Test de niveau** doit mesurer le niveau RÉEL (retirer "voir la traduction" pendant le test ; test incrémental facile → difficile). Les interactions gadget "pour réveiller la mascotte" ne servent pas la conversion.
- **Landing sur petits écrans** (iPhone SE) : choix visibles clavier ouvert (réduire la mascotte, gradient au lieu de container...).
- **Écran de chargement pré-paywall** : ajouter/valider les éléments à l'écran (personnalisation qui s'enrichit), pas les enlever un par un.
- **Placement du paywall** : fin de l'onboarding, après avoir appuyé sur la douleur et positionné l'app comme la solution, et avant la création de compte.

## 3. ATT et tracking

- Consentement ATT demandé **dès le tout premier lancement, par-dessus le premier écran (le carrousel/landing)** , pas un écran séparé, pas plus tard. Sans IDFA, pas d'attribution des events (TikTok, etc.), donc pubs mal optimisées.
- ATT **jamais juste avant/pendant le paywall** (distraction au pire moment).

## 4. Notifications

- Demandées **pendant l'onboarding**, après que l'utilisateur s'est engagé à revenir (relié à SON objectif), idéalement après lui avoir demandé l'heure de son rappel quotidien.
- Permission justifiée par un bénéfice concret (ex. "on te préviendra avant la fin de l'essai").

## 5. Paywall / pricing

- **Prix visible** et bouton d'achat clair. L'utilisateur veut voir prix, avantages, promotion, un plan clairement plus intéressant. Le copy poétique ("Débloque ton potentiel") ne convertit pas.
- **Comparaison des prix claire et facile** ; offre long terme mise en valeur ; bon ratio long terme / court terme.
- **Libellés simples** : "3 mois" plutôt que "trimestriel", "1 mois" plutôt que "mensuel" (enlève l'aspect engagement/renouvellement).
- **Pas de mentions redondantes** ("/an", "/trimestre", "/mois") si le nom de l'offre est déjà clair.
- **CTA engageant, pas monotone** ("s'abonner" → "Continuer" quand un plan court est sélectionné).
- **Zéro distraction** : pas de popups, permissions, navigation visible → immersion totale, moins de portes de sortie.
- **Lisibilité petits écrans** ; **CTA sticky** ; status bar adaptée à la couleur de fond ; bouton de fermeture discret ; checkmark en position absolue en haut à droite pour aligner les prix à droite.
- **Structure d'offre** : mensuel volontairement plus cher (ex. 9,99 €) pour gonfler le % de réduction de l'annuel ; afficher l'économie ; envisager de retirer le trimestriel ; essai gratuit réservé au plan annuel ; **3 jours plutôt que 7** (72 h = annuler devient délibéré, et le livrable est déjà consommé).
- **Hard paywall** montré même avant usage de l'app (l'un des paywalls qui convertit le mieux), mais seulement si l'onboarding l'a bien préparé.
- **Paywall en 1 seul écran, l'utilisateur accepte direct.** La timeline "comment marche ton essai" (Aujourd'hui → Jour 5 rappel → Jour 7 débit annulable) + le plan annuel (essai 7 jours) + le prix ramené à la semaine ("X/an, soit ~Y/semaine") + un seul bouton "Start my free trial". Que l'annuel, pas d'autres plans, pas de lien "voir les autres plans". Essai 7 jours sur l'annuel UNIQUEMENT (seuls les gens engagés à l'année l'ont). Inspirations dans `references/inspirations/paywall-free-trial/`.
- **Essai gratuit AVEC carte requise (engagement).** Le but des 7 jours gratuits, c'est que l'utilisateur mette sa carte sans être débité tout de suite, puis soit débité à la fin (ou annule volontairement). Un essai "no card, no sign-up" = zéro engagement = l'utilisateur ne paiera jamais = le pire des deux mondes. Ne pas retirer la carte.
- **Hard paywall + essai gratuit, pas de freemium (app de blocage d'écran).** Quand la fonctionnalité principale est de bloquer les écrans, le freemium est trop compliqué à monétiser (si le blocage est gratuit, personne ne paie). Commencer par un hard paywall bien clair, avec toutes les infos et un essai gratuit qui pousse à l'engagement (carte requise).
- **Ne pas réinventer la roue.** Les gens ne veulent pas d'innovation sur le paywall : ils veulent du simple, du familier, ne pas réfléchir. Paywall classique : plans clairs, prix visible, un seul CTA fort, peu de texte, visuel. Profiter des habitudes (comme la nav en bas sur mobile), ne pas les combattre.
- **Engager au pic de motivation = pendant l'onboarding.** On croit devoir réduire la friction pendant l'onboarding, mais l'onboarding est justement le moment où l'utilisateur a le moins de friction et le plus de motivation : juste au téléchargement, il vient de télécharger parce qu'il veut changer. C'est là qu'il faut le faire s'engager (carte + abonnement), pas dans 7 jours (la motivation est retombée, il est parti). Le rôle de l'app ensuite = entretenir cette motivation.
- **Reprendre l'objectif choisi** par l'utilisateur dans l'accroche du paywall.
- **L'accroche parle du résultat, JAMAIS d'argent** : "Invest in yourself" est mauvais (implique une dépense). Dire "Deviens celui que tu veux être", "Finis-en avec les émotions qui te bouffent". Aucun mot lié au paiement dans le texte qui doit convaincre.
- **Proposition de valeur visible sur le paywall** : on doit savoir POURQUOI prendre le premium (petit tableau de comparaison par exemple).
- **App mobile = viser la masse, pas le ticket élevé** : passer sous la barre des 100 €/an ; de façon optimale ~5 €/mois sur le plan annuel (la personne s'engage, le prix doit être vraiment intéressant). À arbitrer selon les coûts (API IA...).
- **Paiement IMMÉDIAT au clic du paywall** : le CTA ("Continue", pas "Sign up + prix") ouvre directement la pop-up de paiement. Création de compte APRÈS le paiement, jamais avant.
- **Downsell : le % de réduction se calcule vs le mensuel ANNUALISÉ** (prix mensuel × 12 vs prix downsell annualisé) et doit être gonflé en conséquence (un "-50 %" qui est en fait -70 % te fait perdre ton meilleur argument). Pertes illustrées visuellement (barré, croix, grisé), pas une liste de texte. Si l'utilisateur refuse : on RESTE sur le paywall, pas d'écran de sortie.
- **Chat IA payant = jamais accessible gratuitement** : parler à l'IA est ce pour quoi on paie (et chaque message consomme des tokens). Gate la conversation derrière le hard paywall.
- **Valeur ajoutée d'un chat IA = widgets in-conversation** : sans eux, aucun avantage vs ChatGPT (un pré-prompt ne suffit pas). Ex. exercice de respiration → widget bulle qui grossit (inspirer) / diminue (expirer) + timer. Réponses courtes, pas des pavés. Le premier message reprend les éléments de l'onboarding ("J'ai compris que tu vivais X... tu m'en dis plus ?").

## 6. Rétention et engagement

- Demander l'heure du rappel quotidien (engagement + projection) ; notifications reliées à l'objectif.
- **Gamification expliquée** : streak, éclair, monnaie. L'utilisateur doit être éduqué sur chaque élément (sinon on ne sait pas ce que c'est).
- **Monnaie virtuelle réutilisable** / récompenses qui confèrent un avantage.
- **Le contenu ne doit pas être consommable puis emporté** : donner une raison de revenir. Mauvais = 15 jeux tous débloqués à l'achat → l'user récupère, résilie, désinstalle. Livrable fini (capsule) → prévoir des mécaniques de retour dès le départ : tenue du jour poussée en notif validable en un geste, historique/non-répétition, retour après usage, mode événement.
- **Découper en mini-objectifs** (sessions de 10/20/30) plutôt qu'un total ("xxxx/5691").

## 7. In-App / UX générale

- **Tout élément doit être utile et interactif** : pas d'élément inutile, non-interactif ou trompeur (drapeau non cliquable, header inutile, photo de profil non éditable).
- **Tailles minimales tactiles** respectées (icônes, textes).
- **Immersion totale pendant la feature principale** : navigation masquée, zéro distraction ; sortie avec modale de confirmation ("Es-tu sûr de vouloir quitter ? Tu vas perdre ta progression").
- **Patterns et icônes standards, jamais détournés** : ne jamais détourner l'usage d'une icône (ex. icône light/dark mode qui ouvre les paramètres = dark pattern ; croix réservée aux modales, sinon flèche/caret de retour). But : l'utilisateur peut débrancher son cerveau, navigation instinctive.
- **Conventions de navigation** : learning path de bas en haut (Duolingo/Brilliant), pas de haut en bas ; sélecteur de niveau accessible sans re-scroller.
- **Marquer explicitement les états** : jeu du jour complété = checkmark + CTA vert opacité réduite "Completed" + "Come back tomorrow". Toujours explicite, jamais de redirection surprise.
- **Mettre les features principales en avant** (pas cachées dans le profil : ex. test de QI DogGenius à mettre en haut de la home).
- **Composant premium qui se détache visuellement** du reste.
- **Homepage pas vide** : carrousel d'activités, "see more", CTA clair de progression (barre de progression, bouton flèche, "Next step" full width).
- **Contexte pédagogique** au démarrage d'une leçon (pourquoi j'apprends ça ; modèle intro courte façon Brilliant). Progression qui ne s'accélère pas trop vite ; un seul concept par écran.
- **Dropdowns bannis** pour listes incrémentales/ordonnées (utiliser un slider ; dropdown ok seulement pour longues listes hétérogènes type pays).
- **Système de feedback / bug report** présent pour récolter les retours.

## 8. Bugs / QA

- **Désinstaller / réinstaller et refaire l'onboarding complet** (révèle des bugs : mascotte qui ne s'affiche plus).
- **Chaque bouton a un effet distinct** (pas deux boutons identiques).
- **Toutes les actions produisent un résultat visible** ("voir la traduction" qui n'affiche rien).
- **Pas d'overflow ni de textes coupés** (tester petits écrans).
- **Fautes d'orthographe dans l'app**.
- **Navigation stack** : pas d'empilement infini (retour qui re-navigue en avant → crashs mémoire Android).
- **TTS / contenu** : qualité de prononciation, contenu erroné ("To + -ing n'existe pas").

## 9. Data à instrumenter / vérifier (si applicable)

- Funnel d'onboarding : % de drop entre chaque étape.
- Taux de conversion (Trial et Paying).
- Usage de la feature principale.
- Churn rate.
- Rétention J1 / J7 / J30.
- Events custom selon l'app (calibration niveau, répartition par objectif, par effort, mots révisés/jour/utilisateur actif).

## 10. Positionnement / stratégie produit (recul en clôture)

- **Cible pas trop discriminante** : un onboarding qui disqualifie dès la 1re question fait exploser le rebond. Élargir la cible, laisser le marketing segmenter.
- **Marché solvable** : éviter les cibles sans argent / à forte friction d'achat (lycéen qui doit demander à ses parents).
- **La promesse va jusqu'au bout** : ne pas recommander sans permettre d'agir (recommander des vêtements sans dire où les acheter).
- **Mindset MVP / startup** : 20/80, itérer vite, sortir tôt, ajouter les features en observant la réaction. "Beaucoup de fonctionnalités = beaucoup de bugs = progression plus lente." Se concentrer sur le cœur (ce qui fait convertir), reporter le reste (multijoueur, partage) à un second temps.

---

## Critères spécifiques selon le type d'app

- **App-jeu / éducative gamifiée** : learning path, ligues, streak, déblocage de niveaux, qualité pédagogique des leçons, attention au MVP surchargé.
- **App langue** : répétition espacée / FSRS, test de niveau réel, "mots transparents" (piège français→anglais), TTS, calibration du niveau. Référence obligatoire à Duolingo ("TOUS tes utilisateurs sont déjà passés par Duolingo").
- **App animal / quiz** : hook type test de QI, questions sur le maître (pas seulement l'animal), monnaie virtuelle, rétention par contenu non-emportable.
- **App e-commerce / style** : positionnement produit (capsule vs dressing), catalogue curé à la main, affiliation (Awin/Rakuten, commissions 5-10 %), taille par marque, RGPD sur la photo corporelle, fraîcheur du catalogue, arbitrage abonnement vs affiliation.
- **Choix tutoiement/vouvoiement selon la niche.**
- **Structure de paywall selon le livrable** : livrable "fini" → essai court (3 j) + rétention obligatoire ; sinon abonnement classique.
