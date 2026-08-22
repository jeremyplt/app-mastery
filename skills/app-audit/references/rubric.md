# Rubric d'audit d'app , méthodologie de Jeremy

Extrait de ses audits réels (AXIOM, DogGenius, VocabRecall, DressCode) et de sa checklist template. Parcourir l'app dans l'ordre du parcours utilisateur. Les `lessons.md` priment sur ce fichier en cas de conflit.

Vocabulaire métier récurrent : effet wow, la douleur de l'utilisateur, le Paradis, se projeter, dark pattern, mini-goal, immersion totale, friction, portes de sortie, mots transparents, débrancher son cerveau, mindset startup, 20/80, MVP, keyword density, ranker.

Invariants (à vérifier quelle que soit l'app) : ASO orienté bénéfices, carrousel de bénéfices, prénom + personnalisation, phase Paradis, cohérence tutoiement/vouvoiement, paywall clair sans distraction avec libellés "X mois", ATT tôt, notifications reliées à l'objectif, immersion sur la feature principale, patterns/icônes standards, découpage en mini-goals, chasse aux dark patterns et fautes, test réinstall, data/funnel à vérifier.

---

## 1. ASO (page store)

- **Titre** : contient des mots-clés réellement recherchés, 30 caractères max bien exploités. Mauvais = mot-clé du titre pas recherché. Indiquer le compteur (ex. "Titre (29/30 caractères)").
- **Sous-titre** : existe, optimisé, 30 caractères, sans répéter les mots du titre. Sous-titre vide = un tiers de la surface de référencement perdue.
- **Keywords** : champ de 100 caractères rempli, sans répéter titre/sous-titre.
- **Densité de mots-clés de la description** : orientée vers les requêtes qui font ranker (vérifier avec un keyword density, ex. AppFigures). Mauvais = les termes les plus denses sont des mots vides (ton, la, et, à, de) → "écrite pour être lue et pas pour être indexée". Retravailler avec Claude/ChatGPT pour intégrer les mots cibles.
- **Popularité vs compétitivité des mots-clés** : chiffrer (ex. "ai stylist : popularité 18, compétitivité 66" vs "outfit planner : popularité 47"). Mettre le mot-clé à plus forte popularité en principal.
- **Screenshots** : vérifier sur mobile ET iPad. Doivent parler de **bénéfices, pas de fonctionnalités** ("Ajoute tout en un clic" → "Habille-toi en 1 clic"), avec du zoom. "Trois visuels soignés convertissent mieux que six visuels moyens."
- **Langues** selon les marchés visés.
- **Disponibilité tablette** : app bien dispo sur iPad + screenshots iPad dédiés (les stores poussent les apps bien adaptées au device).
- **Prix hors description** : enlever le prix de l'abonnement de la description (friction, maintenance, zéro apport SEO).

Si l'app n'est pas encore publiée : reporter l'ASO à plus tard (une fois publiée) et le noter.

## 2. Onboarding (structure et copywriting) , la section la plus dense

- **Premier écran / carrousel** : axé **proposition de valeur et bénéfices**, pas le process ni le nom de l'app. Reco par défaut = remplacer une landing pauvre par un **carrousel de 3 ou 4 slides**, une slide par bénéfice, racontant une progression. Fournir titres + copy + illustration slide par slide.
- **Animation** : slides animées (2-3 s en boucle), montrer les interactions automatiquement (drag and drop) pour l'effet wow et faire comprendre un concept sans lire.
- **Démontrer, ne pas mettre l'app dans l'app** : bannir les mockups de téléphone en in-app (ça relève du marketing store).
- **Ordre des questions logique**, récolte toutes les infos nécessaires.
- **Prénom demandé tôt** puis réutilisé ("Quel est ton objectif, Livio ?"). Pas de prénom = trop froid.
- **Questions sur le pourquoi / l'objectif et la douleur** (pas seulement sur le produit-objet ; ex. DogGenius posait plein de questions sur le chien, aucune sur le maître). Faire **verbaliser le besoin** et récupérer la data.
- **Écran d'affirmation / réaffirmation** adapté à la réponse juste donnée (ex. "Trop dur pour moi" → "si tu trouves ça trop dur, c'est qu'on ne te l'a pas bien expliqué").
- **Phase "Paradis"** : écran avant le paywall montrant les résultats futurs (avec vs sans l'app), **personnalisé selon l'objectif et les réponses**. Erreur = Paradis trop tôt (avant de connaître l'objectif et d'avoir appuyé sur la douleur) → il perd son effet.
- **Preuve scientifique** : APRÈS les objectifs, au moment d'annoncer le progrès potentiel (pour rassurer), jamais avant (erreur VocabRecall = "loi de Zipf" trop tôt).
- **Cohérence tutoiement / vouvoiement** sur TOUS les écrans (jamais mélangés). Le choix dépend de la niche (tutoiement pour hommes 18-35, enfants/lycéens).
- **Retour en arrière possible** pour corriger une erreur (le forcing vers l'avant frustre et fait abandonner).
- **Écrans d'éducation** : 1 titre + 1 phrase + 1 illustration max, lisibles en moins de 10 secondes. Trop de texte = personne ne lit.
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

- Consentement ATT demandé **le plus tôt possible**, idéalement dès la première ouverture. Sans IDFA, pas d'attribution des events (TikTok, etc.), donc pubs mal optimisées.
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
- **Reprendre l'objectif choisi** par l'utilisateur dans l'accroche du paywall.

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
