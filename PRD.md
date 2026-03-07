# PRD - Landing Page "App Secrets"

## Objectif

Creer une landing page long-form optimisee pour la conversion d'un produit high-ticket ($997) : la formation "App Secrets" qui enseigne comment creer, lancer et monetiser une application mobile rentable grace au vibecoding (Claude Code + IA).

**KPI principal** : Taux de conversion visiteur -> achat
**Cible** : Debutants et developpeurs intermediaires qui veulent creer une app mobile rentable sans etre dev senior

---

## Stack Technique

- **Framework** : Next.js (deja en place)
- **Styling** : Tailwind CSS + CSS custom pour le glassmorphism
- **Animations** : Framer Motion (scroll reveal, hover, parallax)
- **Icons** : Lucide React
- **Font** : Inter (fallback web pour SF Pro)
- **Analytics** : a definir

---

## Structure de la Page (Sections en ordre)

La page suit un flow psychologique precis : **Attention -> Interet -> Desir -> Confiance -> Action**

---

### S01 - Navigation Fixe (Sticky)
**But** : Navigation rapide + CTA toujours visible

- Logo "App Secrets" a gauche
- Liens ancres : Programme, Temoignages, Prix
- Bouton CTA "Rejoindre" a droite (style glass avec accent)
- Style : `glass-nav` avec blur
- Apparait apres scroll de 100px

---

### S02 - Barre d'Urgence (Top Bar)
**But** : Creer l'urgence immediatement (FOMO)
**Levier psychologique** : Rarete + Urgence

- Bandeau fixe en haut de page
- **Pricing progressif** (inspire de Codelynx OpenClawPro) : "Prix Fondateur : 997$ - Prochain palier : 1 197$ (dans X places)"
- Jauge de progression visuelle montrant le remplissage du palier actuel
- Background : leger gradient violet/bleu subtil sur glass
- Se ferme avec un X
- **Pourquoi progressif plutot que countdown** : Plus credible pour un produit evergreen, cree une urgence reelle basee sur la rarete des places au prix actuel

---

### S03 - Hero Section
**But** : Capter l'attention en < 3 secondes, communiquer la promesse principale
**Levier psychologique** : Curiosite + Promesse de transformation

**Layout** : 2 colonnes (texte gauche, mockup phone droite)

**Contenu gauche :**
- Badge glass : "Formation #1 en francophone"
- Titre H1 (gradient text) : "Cree, Lance et Monetise ton App Mobile en 28 Jours"
- Sous-titre : "Meme sans experience en programmation. Grace a l'IA et au vibecoding, transforme ton idee en application rentable sur l'App Store et Google Play."
- 3 bullet points avec icones :
  - "14 modules de A a Z"
  - "De l'idee a la publication sur les stores"
  - "Communaute privee + support"
- CTA principal : "Commencer Maintenant - 997$" (bouton gradient)
- CTA secondaire : "ou 4x 297$" (lien sous le bouton, paiement fractionne obligatoire a ce prix)
- Micro social proof sous le CTA : "Rejoint par 500+ eleves" + avatars empiles + etoiles

**Contenu droite :**
- Mockup iPhone avec screenshot d'une app en cours de dev
- Glow violet/cyan derriere le phone
- Leger effet de flottement (animation)

---

### S04 - Barre de Social Proof
**But** : Etablir la credibilite instantanement
**Levier psychologique** : Preuve sociale + Autorite

- Bandeau horizontal full-width
- Style : glass subtil avec bordures top/bottom
- Contenu : logos ou stats en ligne
  - "500+ eleves" | "14 modules" | "90+ lecons" | "4.9/5 satisfaction"
- Animation : leger defilement ou fade-in au scroll

---

### S05 - Section Probleme / Douleur
**But** : Creer l'identification, montrer qu'on comprend le prospect
**Levier psychologique** : Empathie + Agitation du probleme

- Titre : "Tu veux creer une app mais..."
- Liste de pain points dans des cartes glass :
  - "Tu ne sais pas coder (ou pas assez)"
  - "Tu as peur de te perdre dans la technique"
  - "Tu ne sais pas comment monetiser"
  - "Tu as essaye des tutos YouTube sans resultat concret"
  - "Tu ne sais pas par ou commencer"
  - "Tu as l'impression que c'est reserve aux devs seniors"
- Chaque carte a une icone rouge/orange
- Transition : "Et si je te disais que tout ca, c'est du passe ?"

---

### S06 - Section Solution / Presentation
**But** : Introduire la formation comme LA solution
**Levier psychologique** : Soulagement + Vision de la transformation

- Titre : "Decouvre App Secrets"
- Sous-titre : "La formation complete pour creer une app mobile rentable de A a Z avec l'IA"
- Video de presentation (embed) dans un cadre glass
- 3 piliers en bento cards :
  1. "Idee -> Validation" : Trouve et valide une idee rentable
  2. "Developpement -> Publication" : Code et publie ton app grace au vibecoding
  3. "Marketing -> Revenus" : Lance et monetise ton app

---

### S07 - Section "Pour Qui"
**But** : Qualifier le prospect, lui faire dire "c'est pour moi"
**Levier psychologique** : Identification + Inclusion

- 2 colonnes : "C'est pour toi si..." / "Ce n'est PAS pour toi si..."
- Check verts / X rouges
- **Pour toi si :**
  - Tu veux creer ta propre app mobile
  - Tu es debutant ou intermediaire en code
  - Tu veux utiliser l'IA pour accelerer ton dev
  - Tu veux un business rentable autour d'une app
  - Tu es pret a investir 28 jours
- **Pas pour toi si :**
  - Tu cherches un schema pour devenir riche rapidement
  - Tu n'es pas pret a suivre un processus structure
  - Tu veux juste regarder sans appliquer

---

### S08 - Section Programme Complet
**But** : Montrer l'ampleur et la valeur du contenu
**Levier psychologique** : Valeur percue + Tangibilite

- Titre : "Le Programme Complet"
- Sous-titre : "14 modules, 90+ lecons, du debutant au lancement"
- Accordeons/modules expansibles :

  **Module 1** : Introduction
  - Presentation de la communaute et du parcours

  **Module 2** : Introduction au business d'apps
  - Creer une app rentable en 28 jours, comprendre le marche

  **Module 3** : Trouver & Valider une Idee
  - Trouver une idee, etude de marche, monetisation, nom viral, comptes dev

  **Module 4** : Branding & Tech Stack
  - Design system, logo, outils IA, onboarding, setup des outils

  **Module 5** : Developpement de l'App (le coeur)
  - PRD, implementation, Supabase, Expo, simulateurs, auth, abonnements, RevenueCat, push notifications, securite

  **Module 6** : Analytics & Publication
  - Tenjin, Posthog, Sentry, ASO, TestFlight, publication stores, Meta/TikTok Ads

  **Module 7** : Marketing
  - Promotions, 4 formats viraux (2M+ vues), publicite

  **Module 8** : Masterclass Claude Code
  - CLAUDE.md, contexte, commandes, hooks, MCPs, multi-agents, workflows

  **Module 9** : Intelligence Artificielle
  - Perplexity, Claude, ChatGPT, OpenRouter, comparatifs

  **Module 10** : Git/GitHub
  - De l'init au pull request, versioning complet

  **Module 11-14** : Bonus
  - Learn in Public, Case Study Shinobi Japanese, Tech News, Ressources

- Chaque module = carte glass accordeon avec numero, titre, description courte, nombre de lecons
- Badge "COEUR" sur les modules 3-7
- Badge "BONUS" sur les modules 8-14

---

### S09 - Section Stack Technique
**But** : Montrer la credibilite technique, rassurer sur les outils
**Levier psychologique** : Autorite + Tangibilite

- Titre : "Les Outils que tu Vas Maitriser"
- Bento grid avec les logos/icones :
  - Expo (React Native) | Supabase | Claude Code | RevenueCat
  - Posthog | Sentry | Tenjin | Meta Ads | TikTok Ads
- Chaque carte : logo + nom + description courte d'une ligne
- Style : glass cards avec icones colorees

---

### S10 - Section Resultats / Transformation
**But** : Projeter le prospect dans l'apres
**Levier psychologique** : Vision du futur + Desir

- Titre : "Dans 28 Jours, Tu Auras..."
- Timeline visuelle ou liste de resultats :
  - Une app publiee sur l'App Store ET Google Play
  - Un systeme d'abonnements qui genere des revenus
  - Un pipeline marketing pour acquerir des utilisateurs
  - La maitrise de Claude Code et du vibecoding
  - Un portfolio de competences recherchees
- Mockup : screenshot d'app sur les deux stores

---

### S11 - Temoignages (Premiere vague)
**But** : Preuve sociale massive
**Levier psychologique** : Preuve sociale + Identification

- Titre : "Ce Qu'en Disent Nos Eleves"
- Grille/carousel de testimonial cards (glass)
- Chaque carte : photo, prenom, contexte ("debutant total"), quote, resultat obtenu, etoiles
- Mix de profils : debutants, reconversion, entrepreneurs, etudiants
- Si video dispos : embed video testimonials

---

### S12 - Section Formateur
**But** : Creer la connexion humaine, etablir l'autorite
**Levier psychologique** : Autorite + Sympathie + Confiance

- Photo du formateur
- Nom + titre
- Histoire courte (parcours, pourquoi cette formation, resultats personnels)
- Chiffres cles (apps publiees, revenus generes, eleves formes)
- Liens sociaux (YouTube, Twitter, etc.)
- Style : grande carte glass avec layout 2 colonnes (photo + texte)

---

### S13 - Section Bonus
**But** : Augmenter la valeur percue, depasser le "ca vaut le prix?"
**Levier psychologique** : Reciprocite + Valeur ajoutee + Ancrage de prix

- Titre : "Les Bonus Exclusifs (valeur: X$)"
- Liste de bonus dans des cartes glass avec valeur individuelle :
  1. **Masterclass Claude Code** (valeur: 297$) - Le guide le plus complet sur le meilleur agent IA
  2. **Module IA Complet** (valeur: 197$) - Maitriser tous les outils IA du marche
  3. **Formation Git/GitHub** (valeur: 147$) - Versionning de A a Z
  4. **Case Study Shinobi Japanese** (valeur: 197$) - Transparence totale sur une vraie app
  5. **Communaute Privee** (valeur: inestimable) - Acces a vie au groupe
  6. **Mises a jour a vie** (valeur: inestimable) - Tech News + nouveaux modules
- Total de la valeur affiche : "Valeur totale : 2,835$+"
- Transition vers le prix : "Aujourd'hui, tout ca pour..."

---

### S14 - Section Pricing
**But** : Presenter le prix de maniere irresistible
**Levier psychologique** : Ancrage + Contraste + Urgence

- Grande carte glass centree (style Nebula Pricing Card)
- Structure :
  - Badge : "ACCES A VIE"
  - Valeur totale barree : "~~2,835$~~"
  - Prix : "997$" en grand (gradient text) ou "3x 397$"
  - Liste des inclusions avec checkmarks :
    - 14 modules complets (90+ lecons)
    - Masterclass Claude Code
    - Module IA complet
    - Formation Git/GitHub
    - Case Study reel
    - Communaute privee a vie
    - Mises a jour a vie
    - Support prioritaire
  - CTA principal : "Rejoindre App Secrets Maintenant" (bouton gradient full-width)
  - Toggle paiement : "Paiement unique : 997$" / "4x 297$"
  - Sous le CTA : "Paiement securise | Acces instantane | Garantie 30 jours"
  - Badge garantie : "Resultat garanti ou rembourse - 30 jours"
  - Micro social proof : avatars + "500+ eleves nous font confiance"
- Glow violet autour de la carte

---

### S14B - Section Justification ROI
**But** : Demontrer que l'investissement est un no-brainer
**Levier psychologique** : Rationalisation post-emotionnelle + Cadrage de valeur

- Titre : "997$ ? Voici le Calcul"
- Tableau comparatif en cartes glass :
  - "Apprendre seul sur YouTube" : 6-12 mois, 0 structure, risque d'abandon 95%
  - "Embaucher un dev freelance" : 5 000-15 000$ minimum
  - "Bootcamp dev mobile" : 3 000-8 000$, 3-6 mois, pas focus IA
  - "App Secrets" : 28 jours, 997$, de A a Z avec l'IA, support inclus
- Calcul ROI : "Un seul abonnement a 4.99$/mois avec 200 utilisateurs = 997$/mois. Tu rentabilises des le premier mois."
- Style : cartes glass avec la ligne "App Secrets" mise en avant (bordure accent, glow)

---

### S15 - Section Garantie
**But** : Eliminer le risque percu
**Levier psychologique** : Inversion du risque + Confiance

- Titre : "Garantie 30 Jours - Resultat Garanti"
- Icone de bouclier/badge
- Texte : "Suis la formation pendant 30 jours. Si tu as suivi le programme et que tu n'as pas d'app fonctionnelle, je te rembourse integralement. Pas de questions, pas de justification. Le risque est 100% de mon cote."
- **Pourquoi 30 jours** : Aligne sur la promesse de 28 jours. Le prospect a le temps de suivre le programme complet ET d'evaluer les resultats.
- Style : carte glass avec bordure accent vert et glow vert subtil

---

### S16 - Temoignages (Deuxieme vague)
**But** : Renforcer apres le prix pour eliminer les derniers doutes
**Levier psychologique** : Preuve sociale repetee

- 3-4 temoignages supplementaires
- Focus sur les resultats concrets et le ROI
- Style different de la premiere vague (layout grille vs carousel)

---

### S17 - Section FAQ
**But** : Repondre aux objections restantes
**Levier psychologique** : Lever les freins

- Titre : "Questions Frequentes"
- Accordeons glass :
  1. "Faut-il savoir coder ?" -> Non, la formation part de zero et utilise l'IA
  2. "Combien de temps faut-il ?" -> 28 jours en suivant le programme
  3. "Quels outils sont necessaires ?" -> Un Mac, les outils sont gratuits ou inclus
  4. "L'acces est-il a vie ?" -> Oui, avec toutes les mises a jour futures
  5. "Et si ca ne marche pas pour moi ?" -> Garantie 14 jours, zero risque
  6. "Quelle est la difference avec des tutos gratuits ?" -> Parcours structure de A a Z vs fragments eparpilles
  7. "Est-ce que ca marche pour iOS ET Android ?" -> Oui, React Native = les deux plateformes
  8. "Y a-t-il un support ?" -> Oui, communaute privee + support
  9. "C'est quoi le vibecoding ?" -> Coder avec l'IA qui ecrit le code pour toi, tu guides
  10. "Faut-il un Mac ?" -> Fortement recommande pour le dev iOS

---

### S18 - CTA Final
**But** : Dernier push de conversion
**Levier psychologique** : Urgence + Recap de valeur + Peur du regret

- Titre : "Pret a Creer Ton App ?"
- Sous-titre : "Rejoins les 500+ eleves qui ont deja lance leur app mobile"
- Recap rapide : "14 modules | 90+ lecons | Communaute a vie | Garantie 14j"
- CTA : "Commencer Maintenant - 997$"
- CTA secondaire : "ou 4x 297$"
- Rappel du prix progressif : "Prix actuel : 997$ - Prochain palier dans X places"
- PS : "P.S. - Chaque jour que tu attends est un jour de revenus perdus. Le prix augmente a chaque palier de places remplies. Ne reviens pas sur cette page en regrettant d'avoir attendu."

---

### S19 - Footer
**But** : Elements legaux + derniere navigation

- Logo
- Liens : Mentions legales, CGV, Politique de confidentialite, Contact
- Liens sociaux
- Copyright
- Style : glass subtil

---

## Principes Psychologiques Utilises

| Principe | Ou | Comment |
|----------|-----|---------|
| **Urgence/FOMO** | S02, S14, S18 | Prix progressif par paliers, jauge de remplissage |
| **Preuve sociale** | S03, S04, S11, S16, S18 | Chiffres, temoignages, avatars |
| **Ancrage de prix** | S13, S14 | Valeur totale 2835$ -> prix 997$ |
| **Inversion du risque** | S14, S15 | Garantie 30 jours "resultat garanti ou rembourse" |
| **Reciprocite** | S13 | Bonus genereux offerts |
| **Autorite** | S04, S09, S12 | Formateur, stack tech, logos |
| **Identification** | S05, S07 | Pain points, "pour qui" |
| **Vision du futur** | S10, S18 | Transformation, resultats |
| **Rarete** | S02, S18 | Prix progressif (997 -> 1197 -> 1497), places par palier |
| **Justification ROI** | S14B | Comparatif alternatives + calcul rentabilite |
| **Engagement progressif** | Tout le flow | Micro-yes a chaque section avant le prix |

---

## Notes d'Implementation

1. **Performance** : Le glassmorphism est GPU-intensif. Limiter le nombre de layers avec backdrop-filter simultanes visibles. Utiliser `will-change: transform` pour les elements animes.

2. **SEO** : Balises H1/H2/H3 semantiques, meta description, OG tags pour le partage social, schema markup pour le cours.

3. **Tracking** : Events sur chaque CTA (scroll depth, clics, temps sur page), heatmap recommandee.

4. **A/B Testing prevu** : Headline hero, couleur CTA, prix affiche (997 vs 4x297 en premier), position de la garantie, nombre de paliers prix progressif.

5. **Mobile-first** : Le design mobile est prioritaire (majorite du trafic viendra des reseaux sociaux).

6. **Temps de chargement** : Images WebP/AVIF, lazy loading sur les sections below-the-fold, font-display: swap.
