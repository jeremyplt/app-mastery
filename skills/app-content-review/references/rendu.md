# Le document pour l'élève

Exemple complet (générateur et modèle de page) : `assets/exemple-family-quest/gen.py` et `tpl.html`, à copier dans le scratchpad et adapter. Les images n'y sont pas : il faut les refaire pour chaque élève. Résultat validé : https://claude.ai/artifact/4KANqAQC1GD5uPmdiznrZ8.

Le document est simple : une idée par paragraphe, beaucoup d'images, pas de jargon. Au « tu ». De vraies phrases, comme on parle, même dans les légendes des plans et la description des vidéos modèles : jamais de suite de fragments (« Phil' triste, une mission, les points qui montent »).

## Plan
1. **Une phrase d'intro** : « Voici ce qui ressort de l'analyse de tes 20 vidéos. Pour les améliorer, tout tient en une phrase : … » Pas dur, pas de prénom, pas de « on ».
2. **Ce que je changerais, dans l'ordre** : 5 lignes maximum.
3. **Ce qui est déjà bon** : ses vraies meilleures idées, avec images.
4. **Ce qui ralentit ses vidéos** : pour chaque point, le constat chiffré, les images de ses vidéos, puis un encadré « À faire ».
5. **Accroches réécrites** : tableau « Aujourd'hui / À la place », puis formats jeunes avec de vraies vidéos.
6. **Vidéos à copier** : les fiches (ci-dessous). Les 2 ou 3 prioritaires marquées « À faire en premier ».
7. **Autres formats à essayer**.
8. **Carrousels à copier**.
9. **Ton histoire de créateur** : carrousel et voix off, pour le compte principal.
10. **Bonus facultatif** : ce que l'élève n'a pas forcément envie de faire.
11. **Ta liste avant de publier une vidéo courte**.
12. **Ta semaine** : une heure de tournage, 6 vidéos en changeant la première phrase, une par jour, 2 carrousels, puis refaire celle qui amène le plus de téléchargements.

## Une fiche de format
1. **La vidéo qui marche** : 3 images de la vraie vidéo, ce qu'elle fait réellement, les liens avec vues et durée.
2. **Pour [App]** : pourquoi ça s'applique, en 2 ou 3 phrases.
3. **Les plans**, chacun avec une image et le texte en place, puis **dessous** : minutage et « À filmer : … » ou « À monter : … ».
4. Le texte à dire s'il y a une voix, et les déclinaisons possibles.

## Ce qui ne va pas dans le document
- Pas de paragraphe de sources ni de « fais relire par ton pharmacien » : les sources vont à Jeremy, dans la réponse.
- Pas de mise en garde hypothétique sur la vie de l'élève.
- Recompter les chiffres d'intro quand un format est retiré (« 9 vidéos sur 13 »).

## Fidélité aux inspirations (règle stricte)
- **Le texte est identique à l'inspiration** : police, taille, couleur, place, fond, boîtes, et aussi le type de phrase (voir `principes.md`, Transposer). Regarder l'original en grand, puis comparer côte à côte.
- **Jamais de consigne sur l'image.** « À filmer » va en dessous.
- **Le texte reste lisible** : garder le style, mais adapter la couleur, ajouter une ombre ou assombrir la photo si le fond est mauvais.
- Reproduire **toutes** les images du carrousel. Si j'en reprends moins, le dire.
- Durée des plans : 2 à 3 s.

## Images
- Des photos qui font vraies (Pinterest), pas de banque d'images. Chaque exemple vidéo et carrousel a des images.
- Les constats utilisent les vraies images des vidéos de l'élève.
- Les écrans sont ses vrais écrans filmés (ses rushs) quand ils existent.
- **Chaque image montre ce que dit sa légende, plan par plan :** un lit si la légende dit lit, des genoux si elle dit genoux, une vue du dessus et un doigt si elle dit doigt et vue du dessus. Une photo de téléphone par format, jamais la même d'un format à l'autre : on ne la garde que d'un plan à l'autre d'une même vidéo. Et une phrase différente quand le plan dit que la phrase change. Si aucune photo ne colle, corriger la légende ou chercher une autre photo, ne pas laisser l'écart.
- Pour trouver ces photos sur Pinterest, nommer la scène et ajouter « white blank screen mockup » (`hand holding phone in bed white blank screen mockup lifestyle`) : un écran blanc se remplace proprement et les doigts restent devant.
- Styles vus (voir `tpl.html`, classes `.ser`, `.le`, `.tip`, `.blk`, `.lb`, `.neon`, `.wd`, `.ttl`, `.rows`, `.duo`) : TikTok Sans, EB Garamond, Patrick Hand, Permanent Marker. Tailles en `cqw` pour qu'elles suivent l'image.

## Liste de contrôle pour une vidéo courte
- Son coupé, on comprend la situation en 2 secondes.
- Une seule scène suffit, sans explication, moins de 15 secondes.
- La première phrase parle du problème de celui qui paie, la réponse arrive avant la moitié.
- L'image change toutes les 2 à 3 secondes.
- Aucun humain généré par IA, et c'est la vraie app.
- La première phrase est naturelle.
- Aucun texte important dans le bas de l'image.
- Le nom de l'app est dit une fois et est en commentaire épinglé, sans « abonne-toi » ni « tape X sur l'App Store ».

## Publication
Artifact privé via `publish_files` (lire le `guide` avant la première publication de la session), avec le même slug pour les corrections, en nommant les images différemment si on les remplace. Prévisualiser avec une capture Chrome headless avant de publier.
