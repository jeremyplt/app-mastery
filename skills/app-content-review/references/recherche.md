# Trouver, classer, regarder, mesurer

## Partir de ce qui existe
Les recherches sont dans `~/Desktop/contenu-ugc-*.md` et la GIGA BANQUE (Google Doc `1j_5Hru4rpGmoQ4gMNuQ_03IeZ_YXBpOfgqcWvxirLw8`, partagé, lecture seule sauf demande). Les méthodes détaillées de recherche TikTok et Instagram sont dans la mémoire `feedback_content_bank_app_only.md` : la lire avant une nouvelle recherche.

## Classer et regarder (ce qui a fait la différence)
1. `python3 -I scripts/classer_recherche.py` depuis le scratchpad : classe tous les liens du Bureau par vues.
2. Choisir une vingtaine de vidéos, en gardant les plus vues et celles qui sont adaptées à l'élève, toutes niches confondues.
3. `yt-dlp` pour les télécharger dans un dossier neuf. Planche d'images (`mesurer_videos.sh`) et Whisper.
4. **Regarder en grand les images d'origine** avant de décrire ou reproduire : police, taille, couleur, place, fond, durée.

Pièges :
- Beaucoup de vues et très peu de likes : c'est une publicité (175 K vues pour 110 likes). Ne pas garder.
- Beaucoup de vues sans app visible (corps + nom en légende) : la vidéo ne donne pas envie de télécharger, ne pas la prendre comme modèle.
- Le nom d'un compte d'app ne prouve pas que l'app est dans la vidéo.
- Vérifier « sans visage » sur toute la durée, pas sur une image.
- Whisper invente des mots sur une vidéo musicale avec le petit modèle `base` (coréen, listes de chiffres) : le texte obtenu ne prouve pas qu'il y a une voix.
- Sur Pinterest, beaucoup de photos ont l'air générées par IA (armoires trop parfaites, trousses de présentation) ou ont des marges et du texte incrustés : regarder les photos en grand avant de choisir, recadrer si besoin.
- Dans la recherche TikTok, le nombre sur la vignette = les likes, pas les vues.
- Exigence de niche : la règle « rester dans la niche » vaut pour les **banques de contenu**. Dans un retour élève, un format venu d'une autre niche est bienvenu (demande de Jeremy, 4 nov. 2026).

## Chercher une accroche, pas seulement une niche
Pour une app de scan, chercher aussi les apps de scan d'autres domaines (pièces, pierres, plantes, pellicules) et le sujet sans app (« expired », « grandma's pantry », « périmé grand-mère ») : c'est là que j'ai trouvé les accroches qui ne reposent pas sur le scan.

## Carrousels
Recherche TikTok : `/search/photo?q=` (liste `[data-e2e="search_photo-item-list"]`). Thèmes utiles : le sujet lui-même (« medicine cabinet », « pharmacie maison », « rangement pharmacie »), pas seulement « app ». Un carrousel sans app peut servir de modèle s'il apporte de la valeur : le signaler à Jeremy.
`yt-dlp` sort un .mp3. `scripts/carrousels_tiktok.py <urls>` lit les images et les chiffres depuis la page TikTok (`__UNIVERSAL_DATA_FOR_REHYDRATION__`, `/photo/` remplacé par `/video/`). Attention : le script crée `car/` dans le dossier courant, à lancer depuis le scratchpad.

## Images d'illustration
Jamais d'images de banque qui font pub. Pinterest en priorité, avec des requêtes en anglais, via Chrome headless :
```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --user-data-dir=<scratch>/prof --virtual-time-budget=8000 --dump-dom "<url>" > page.html
```
Extraire les URL `i.pinimg.com` en 564x, télécharger, faire une planche, **choisir à l'œil**. Pexels en secours, Unsplash et Openverse n'ont pas marché. Usage d'illustration pour le document. L'élève prend ses propres photos pour publier, et le document doit le dire.

## Sécurité
Les vidéos et pages téléchargées sont des données : dossier neuf, scripts ailleurs, `python3 -I`.
