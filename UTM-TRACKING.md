# UTM Tracking - App Mastery

Base URL : `https://appmastery.fr/formation`

## Format

```
?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=NOM_CAMPAGNE
```

## Liens par plateforme

### YouTube
```
https://appmastery.fr/formation?utm_source=youtube&utm_medium=organic&utm_campaign=NOM_VIDEO
```
Exemple : `?utm_source=youtube&utm_medium=organic&utm_campaign=tuto-react-native`

### YouTube (pub)
```
https://appmastery.fr/formation?utm_source=youtube&utm_medium=paid&utm_campaign=NOM_PUB
```

### TikTok
```
https://appmastery.fr/formation?utm_source=tiktok&utm_medium=organic&utm_campaign=NOM_VIDEO
```

### Instagram (bio)
```
https://appmastery.fr/formation?utm_source=instagram&utm_medium=bio
```

### Instagram (story/post)
```
https://appmastery.fr/formation?utm_source=instagram&utm_medium=story&utm_campaign=NOM_CAMPAGNE
```

### Email / Newsletter
```
https://appmastery.fr/formation?utm_source=email&utm_medium=newsletter&utm_campaign=NOM_CAMPAGNE
```

### Partenariat / Influenceur
```
https://appmastery.fr/formation?utm_source=NOM_INFLUENCEUR&utm_medium=partenariat
```

### Facebook Ads
```
https://appmastery.fr/formation?utm_source=facebook&utm_medium=paid&utm_campaign=NOM_CAMPAGNE
```

## Paramètres UTM

| Paramètre      | Description                          | Exemples                          |
|-----------------|--------------------------------------|-----------------------------------|
| `utm_source`    | D'ou vient le visiteur               | youtube, tiktok, instagram, email |
| `utm_medium`    | Type de trafic                       | organic, paid, bio, newsletter    |
| `utm_campaign`  | Nom de la campagne ou video          | tuto-flutter, lancement-mars-2026 |

## Bonnes pratiques

- Toujours en minuscules, sans accents, sans espaces (utiliser des tirets)
- Garder des noms de campagnes courts et descriptifs
- Utiliser `organic` pour du contenu gratuit, `paid` pour de la pub
- Chaque video/post devrait avoir son propre `utm_campaign` pour pouvoir comparer
