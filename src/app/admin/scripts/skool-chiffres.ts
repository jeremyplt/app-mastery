import type { VideoScript } from "./types";

// Fichier lu seulement par scripts-data.ts (côté serveur) : ne jamais l'importer
// dans un composant client.
//
// Grande vidéo Skool « Lire tes chiffres » (fiche de /admin/videos-skool, 10 élèves,
// 24 fois). Jeremy la lit lui-même : phrases complètes, ponctuation normale.
// Sources : sa note du 24 nov. 2026 (quand regarder ses chiffres), la fiche
// « chiffres » validée de la base de conseils (whatsapp_conseils) et les chiffres
// Shinobi relevés dans Metabase le 13 nov. 2026.
export const SCRIPT_SKOOL_CHIFFRES: VideoScript = {
  slug: "skool-chiffres",
  kind: "skool",
  label: "Skool · Chiffres",
  status: "Prêt à tourner",
  updatedAt: "25 nov. 2026",
  title: "Lire tes chiffres : trouver où ça casse, et savoir quand juger",
  why: `Dix élèves t'ont posé 24 fois la même question : qu'est-ce qui bloque dans mes chiffres, et quand est-ce que je peux juger. Les vidéos PostHog, Tenjin et Metabase montrent les outils, pas comment lire les chiffres. Celle-ci commence par ta règle : rien à lire avant 1 000 téléchargements en deux semaines, et avant ça, c'est le contenu qu'il faut travailler.`,
  facts: [
    { label: "Durée", value: "Environ 12 min 30 (1 870 mots)" },
    { label: "Style", value: "Tu lis le script avec ta vraie voix, les captures passent à l'écran pendant que tu parles" },
    { label: "Sources", value: "Ta note du 24 nov., ta fiche « Chiffres » validée de la base de conseils, les chiffres Shinobi relevés dans Metabase le 13 nov., le rapport annuel de RevenueCat" },
    { label: "Remplace", value: "La checklist « Des téléchargements mais pas d'abonnés : le diagnostic », prévue dans /admin/questions" },
  ],
  altTitles: [],
  plan: [],
  sections: [
    {
      time: "0:00",
      title: "Intro",
      beats: [
        {
          say: `Dans cette vidéo, je vais t'apprendre à lire les chiffres de ton app. On va voir quand les regarder, quels chiffres suivre, quels repères te disent si un chiffre est bon, et surtout comment trouver l'endroit exact où ton app perd de l'argent. Je vois beaucoup de gens changer leur onboarding, leur paywall ou leur prix à cause de chiffres qui ne veulent rien dire. À chaque fois, c'est du temps perdu, et parfois l'app marche même moins bien après. Donc on commence par la question la plus importante : à partir de quand tes chiffres veulent vraiment dire quelque chose.`,
        },
      ],
    },
    {
      time: "0:40",
      title: "Partie 1 · Quand regarder tes chiffres",
      beats: [
        {
          say: `Tu dois regarder les chiffres de ton app à partir du moment où tu as vraiment pas mal de téléchargements, et donc un contenu qui a percé. Tant que tu n'as pas ça, ça ne sert à rien.`,
        },
        {
          say: `Quand je dis pas mal de téléchargements, c'est au moins 1 000 téléchargements, et sur deux semaines maximum. Avec 50 ou 100 utilisateurs, il suffit que trois personnes de plus paient pour que ton taux double, donc tu ne peux rien en conclure. Et si tes 1 000 téléchargements sont étalés sur trois mois, tu mélanges plusieurs versions de ton app, plusieurs vidéos et plusieurs audiences, et tes chiffres ne décrivent plus rien de précis.`,
          show: `Animation : un compteur de téléchargements qui monte jusqu'à 1 000, avec « 2 semaines maximum » en dessous.`,
        },
        {
          say: `Tant que tu n'as pas ces 1 000 téléchargements, tu ne changes rien dans ton app à cause de tes statistiques, parce qu'elles ne sont pas significatives. Et surtout, si tu n'as pas de téléchargements, ça veut dire que le problème n'est pas dans ton app. Il est dans ton contenu, et c'est ton contenu qu'il faut améliorer. La seule modification de l'app qui a du sens à ce moment-là, c'est d'ajouter une fonctionnalité virale, c'est-à-dire une fonctionnalité qui donne envie de filmer l'app et qui te facilite la création de contenu. Par exemple, un scanner comme celui de Cal AI ou de Yuka : on pointe son téléphone sur un plat ou un produit, et le résultat se filme tout seul.`,
          show: `Une vraie vidéo TikTok du scanner de Cal AI ou de Yuka, au moment où le résultat s'affiche.`,
        },
        {
          say: `Par contre, attention : ne pas regarder tes chiffres ne veut pas dire ne pas les mesurer. Tout doit être branché dès le premier jour. Sinon, le jour où ta vidéo perce, tu as tes 1 000 téléchargements et rien à lire. Je te montre ce qu'il faut brancher à la fin de la vidéo.`,
        },
      ],
    },
    {
      time: "2:35",
      title: "Partie 2 · Les trois taux à suivre",
      beats: [
        {
          say: `Une fois que tu as tes 1 000 téléchargements, tu regardes trois taux.`,
        },
        {
          say: `Le premier, c'est le taux d'essai : sur 100 personnes qui téléchargent ton app, combien lancent l'essai gratuit. Tes téléchargements, tu les prends dans App Store Connect et dans la Google Play Console, pas dans RevenueCat ni dans PostHog. Tes essais, tu les prends dans RevenueCat.`,
          show: `Capture d'App Store Connect (téléchargements), puis de RevenueCat (essais lancés), avec le calcul posé à l'écran.`,
        },
        {
          say: `Le deuxième, c'est la conversion de l'essai : sur 100 personnes qui ont lancé l'essai, combien finissent par payer. Tu la lis dans RevenueCat, et pour celle-là, il faut attendre la fin des essais avant de juger. Sur Shinobi, environ 70 % des essais sont annulés, et la moitié de ces annulations arrive dans les deux premiers jours. Si tu regardes au bout de trois jours, ton chiffre est faux.`,
          show: `RevenueCat : conversion des essais en payants.`,
        },
        {
          say: `Le troisième, c'est ton taux de payants : sur 100 téléchargements, combien de personnes paient au final. C'est celui qui résume tout, parce qu'il combine les deux premiers.`,
        },
        {
          say: `Si ton app est en freemium, sans essai, c'est plus simple : tu regardes directement combien de téléchargements deviennent payants.`,
        },
      ],
    },
    {
      time: "3:45",
      title: "Partie 3 · Les repères pour savoir si un chiffre est bon",
      beats: [
        {
          say: `Maintenant, il faut savoir si tes chiffres sont bons. Voici les repères que j'utilise.`,
        },
        {
          say: `D'après le rapport annuel de RevenueCat, avec un hard paywall et un essai gratuit de 3 jours, environ 5,5 % des installations lancent l'essai en moyenne, et à 10 %, tu fais partie des meilleurs 25 %. Vise entre 8 et 10 %. Ensuite, environ 20 % des essais devraient devenir payants, et à 25 %, c'est excellent. Ça te donne à peu près 2 % de payants au début. À terme, avec les optimisations, vise une moyenne de 4 %, et ce n'est pas grave de ne pas y être tout de suite.`,
          show: `Les repères posés un par un : la moyenne, les meilleurs 25 %, ta cible.`,
        },
        {
          say: `En freemium, environ 2 % d'utilisateurs qui paient, c'est correct. En dessous de 1 %, il y a un problème.`,
        },
        {
          say: `Pour te donner un exemple concret : sur Shinobi, depuis qu'on est passés au hard paywall en septembre, 12,6 % des téléchargements lancent l'essai, 26 % des essais deviennent payants, et donc 4,4 % des téléchargements finissent par payer. Et regarde la différence entre les plateformes. Sur iOS, 16 % lancent l'essai et 30 % des essais paient. Sur Android, c'est 11 % et 23 %. Donc lis toujours tes chiffres en fonction de la part d'iPhone et d'Android dans tes utilisateurs.`,
          show: `Capture du Metabase de Shinobi (tableau « Audience & Conversion ») : 12,6 %, 26 %, 4,4 %, puis iOS contre Android.`,
        },
        {
          say: `Dernier repère, la rétention, que tu trouves dans App Store Connect et dans la Google Play Console. Perdre environ 80 % de tes utilisateurs dès le deuxième jour, c'est normal. Sur Shinobi, il en reste environ 7 % au septième jour et 3 % au trentième, et ce sont à peu près ceux qui paient. Ça veut dire que tout se joue à la première utilisation : si quelqu'un n'est pas convaincu le premier jour, il ne reviendra presque jamais.`,
          show: `Courbe de rétention d'App Store Connect, qui chute dès le deuxième jour.`,
        },
        {
          say: `Ce sont des repères, pas des règles. Ils servent à savoir si tu es dans la moyenne ou très loin.`,
        },
      ],
    },
    {
      time: "5:50",
      title: "Partie 4 · Qui télécharge ton app",
      beats: [
        {
          say: `Avant de toucher à quoi que ce soit dans ton app, regarde qui la télécharge. C'est l'erreur que je vois le plus souvent : on accuse l'onboarding ou le paywall, alors que le problème vient de l'audience.`,
        },
        {
          say: `Il y a le trafic qualifié, et il y a ce que j'appelle le trafic poubelle. Les moins de 18 ans et les pays où le pouvoir d'achat est faible téléchargent beaucoup, mais ne paient presque jamais. Android convertit aussi environ deux fois moins qu'iOS. Si ta vidéo a percé chez des ados ou dans un pays où personne ne paie, tu vas avoir des milliers de téléchargements et aucun abonné, avec une app qui n'a rien de cassé.`,
        },
        {
          say: `Pour le savoir, regarde le pays et la plateforme dans App Store Connect et dans RevenueCat. Pour l'âge, demande-le dans ton onboarding, par tranches. Si c'est l'audience qui pose problème, tu changes ton contenu, pas ton onboarding. De la même façon, si ta conversion baisse alors que tu n'as rien changé dans l'app, c'est presque toujours ton audience qui a changé.`,
          show: `RevenueCat filtré par pays, puis par plateforme.`,
        },
        {
          say: `Pense aussi à nettoyer tes chiffres. Tes comptes de test, ceux que tu crées pendant le développement et les robots de test de Google Play gonflent tes statistiques, donc filtre-les. Et méfie-toi des tout premiers chiffres, parce qu'ils sont souvent trop beaux : ce sont tes amis, ta famille et tes propres essais.`,
        },
      ],
    },
    {
      time: "7:25",
      title: "Partie 5 · Trouver l'étape qui fuit",
      beats: [
        {
          say: `Une fois que tu sais que ton audience est bonne, tu cherches l'étape où ton app perd les gens, et pour ça, tu compares tes taux.`,
        },
        {
          say: `Si peu de gens lancent l'essai, le problème est avant le paywall. Vérifie d'abord que ton contenu correspond vraiment à ce que fait ton app, puis ton onboarding, puis ton paywall. Regarde aussi si on t'a signalé un crash, dans les commentaires, par email, dans Sentry ou dans les avis du store.`,
        },
        {
          say: `Si beaucoup de gens lancent l'essai mais que peu paient, c'est l'inverse : ton onboarding a bien vendu, mais l'app déçoit pendant l'essai. Il faut la rendre utile dès le premier jour et donner une raison de revenir chaque jour.`,
        },
        {
          say: `Pour trouver l'écran exact, ouvre le tunnel de ton onboarding dans PostHog, en pourcentage des gens arrivés sur le premier écran. Perdre 10 % des gens sur le premier écran, c'est normal. Entre deux écrans classiques, tu dois en perdre moins de 1 %. Si un écran en perd 6 %, c'est qu'il demande quelque chose aux gens. Une étape d'effort, comme prendre une photo ou enregistrer sa voix, fait partir 15 à 20 % des gens : ajoute un bouton pour passer, ou place-la après le paywall. Et sur le paywall, regarde l'écart entre le clic sur le bouton et l'achat. S'il est gros, c'est qu'une information, souvent le prix, surprend les gens dans la fenêtre de paiement.`,
          show: `Tunnel d'onboarding dans PostHog, avec l'écran qui décroche surligné.`,
        },
        {
          say: `Ensuite, croise tes données avec Claude. Les réponses de ton onboarding, c'est le portrait de ton audience : leur âge, leur niveau, leur objectif. Exporte-les depuis PostHog avec les achats, donne-les à Claude, et demande-lui ce qui différencie ceux qui paient de ceux qui partent. Tu vas découvrir des choses que tu ne vois pas à l'œil nu, et c'est aussi de l'or pour ton contenu.`,
          show: `Claude qui lit l'export des réponses de l'onboarding et sort ce qui distingue les payants.`,
        },
      ],
    },
    {
      time: "9:25",
      title: "Partie 6 · Juger un changement",
      beats: [
        {
          say: `Quand tu as trouvé l'étape qui fuit, tu fais un seul changement à la fois. Si tu changes ton paywall et ton onboarding en même temps, tu ne sauras jamais lequel a marché.`,
        },
        {
          say: `Au début, oublie les tests A/B : pour qu'un test A/B soit fiable, il faut au moins 30 000 nouveaux utilisateurs pendant la durée du test. Fais plus simple. Note ta conversion moyenne et la date, fais ton changement, et attends au moins 7 jours, idéalement deux semaines. Jamais deux ou trois jours seulement, parce que la conversion peut énormément varier d'un jour à l'autre. Ensuite, si ça monte, tu gardes, et sinon, tu reviens en arrière. Pendant ce temps-là, tu ne touches ni à ton budget pub ni à tes offres, sinon tu ne sauras pas ce qui a fait bouger le chiffre.`,
          show: `Une courbe de conversion qui saute d'un jour à l'autre, puis la même lissée sur deux semaines.`,
        },
        {
          say: `C'est la même chose pour ton contenu. Une journée à zéro téléchargement ne veut rien dire, donc juge la tendance sur quatre ou cinq jours. Et quand une vidéo perce, regarde si tes téléchargements font un pic. S'ils ne bougent pas, ta vidéo fait des vues, mais elle ne convertit pas.`,
        },
      ],
    },
    {
      time: "10:40",
      title: "Partie 7 · Ce qu'il faut brancher avant ton premier euro",
      beats: [
        {
          say: `Dernier point, celui dont je parlais au début : tout ça n'est possible que si tu mesures dès le premier jour.`,
        },
        {
          say: `Dans PostHog, envoie un événement pour chaque écran de ton onboarding, pour chaque étape du paywall (quand il est vu, quand on clique sur le bouton, quand l'achat réussit ou échoue), et pour les actions importantes de ton app, avec en paramètre les choix de l'utilisateur. Pas chaque clic, seulement ce qui compte. Ensuite, teste chaque événement toi-même dans la vue en direct de PostHog. Ne crois pas Claude quand il te dit que c'est fait, parce qu'un événement cassé rend inutilisables tous les utilisateurs arrivés avant que tu le corriges.`,
          show: `La vue en direct de PostHog, avec les événements qui arrivent pendant qu'on fait l'onboarding.`,
        },
        {
          say: `Et si tu prévois de faire de la pub, branche le suivi avant de dépenser le premier euro : la demande de suivi d'Apple dès le premier lancement de l'app, le SDK de Meta, et les abonnements envoyés à Meta par RevenueCat. Sans ça, tu paies des pubs sans savoir lesquelles te rapportent de l'argent. La vidéo PostHog de l'étape 5 te montre comment tout installer.`,
        },
      ],
    },
    {
      time: "11:50",
      title: "Récap",
      beats: [
        {
          say: `Si je résume : tu ne regardes les chiffres de ton app qu'à partir de 1 000 téléchargements en deux semaines maximum, et avant ça, c'est ton contenu qu'il faut travailler. Ensuite, tu suis tes trois taux et tu les compares aux repères. Tu vérifies qui télécharge ton app avant d'accuser ton app, tu trouves l'écran qui fuit, et tu fais un seul changement à la fois pendant au moins une semaine. Et surtout, tu branches tout dès le premier jour, pour avoir quelque chose à lire le jour où ta vidéo perce.`,
        },
      ],
    },
  ],
  description: `Lire tes chiffres : trouver où ça casse, et savoir quand juger

🎯 Objectif de la vidéo
Savoir à partir de quand les chiffres de ton app veulent dire quelque chose, lesquels suivre, et comment trouver l'étape exacte où ton app perd de l'argent, sans changer ton app à cause de statistiques qui ne prouvent rien.

⏱️ Quand regarder tes chiffres
• Au moins 1 000 téléchargements, sur deux semaines maximum
• Avant ça, le problème est dans ton contenu, pas dans ton app
• La seule modification utile à ce stade : une fonctionnalité virale qui facilite la création de contenu
• Tout doit quand même être mesuré dès le premier jour

📊 Les trois taux à suivre
1. Le taux d'essai : les téléchargements (App Store Connect, Google Play Console) qui lancent l'essai (RevenueCat)
2. La conversion de l'essai : les essais qui deviennent payants (RevenueCat), à lire après la fin des essais
3. Le taux de payants : les téléchargements qui finissent par payer
En freemium, tu regardes directement les téléchargements qui deviennent payants.

📏 Les repères
• Hard paywall avec un essai de 3 jours (rapport RevenueCat) : 5,5 % des installations lancent l'essai en moyenne, 10 % te place dans les meilleurs 25 %, vise 8 à 10 %
• 20 % des essais qui paient, 25 % c'est excellent
• Environ 2 % de payants au début, 4 % à terme
• Freemium : 2 % de payants c'est correct, sous 1 % il y a un problème
• Shinobi : 12,6 % des téléchargements lancent l'essai, 26 % des essais paient, 4,4 % de payants
• Rétention : perdre 80 % des utilisateurs au deuxième jour est normal

👥 Qui télécharge ton app
• Les moins de 18 ans et les pays à faible pouvoir d'achat téléchargent beaucoup et ne paient presque jamais
• Android convertit environ deux fois moins qu'iOS
• Si c'est l'audience, change ton contenu, pas ton onboarding
• Filtre tes comptes de test et les robots de test de Google Play

🔍 Trouver l'étape qui fuit
• Peu d'essais : vérifie le contenu, puis l'onboarding, puis le paywall, puis les crashs
• Beaucoup d'essais mais peu de paiements : l'app déçoit pendant l'essai
• Tunnel PostHog : perdre 10 % au premier écran est normal, moins de 1 % entre deux écrans classiques
• Une étape d'effort (photo, voix) fait partir 15 à 20 % des gens
• Donne les réponses de ton onboarding et les achats à Claude pour voir ce qui différencie ceux qui paient

⚠️ Erreurs à éviter
• Changer ton app avant 1 000 téléchargements
• Juger la conversion de l'essai avant la fin des essais
• Faire un test A/B sans 30 000 nouveaux utilisateurs
• Changer plusieurs choses à la fois, ou toucher au budget pub et aux offres pendant un test
• Juger un changement sur deux ou trois jours
• Croire Claude quand il dit qu'un événement est branché

🔗 Outils utiles
• App Store Connect : https://appstoreconnect.apple.com/
• Google Play Console : https://play.google.com/console/
• RevenueCat : https://app.revenuecat.com/
• PostHog : https://posthog.com/
• Pour installer PostHog : la leçon « Installer les analytics: Posthog » de l'Étape 5

✅ À retenir
• 1 000 téléchargements en deux semaines maximum avant de juger ton app
• Vérifie ton audience avant d'accuser ton app
• Un seul changement à la fois, pendant au moins une semaine
• Tout est branché dès le premier jour`,
  prepare: [
    "Capture d'App Store Connect : les téléchargements, puis la courbe de rétention",
    "Captures de RevenueCat : les essais lancés, la conversion des essais, puis les filtres par pays et par plateforme",
    "Capture du Metabase de Shinobi (tableau « Audience & Conversion ») avec 12,6 %, 26 % et 4,4 %, puis iOS contre Android",
    "Capture du tunnel d'onboarding dans PostHog, avec un écran qui décroche",
    "La vue en direct de PostHog pendant qu'on fait l'onboarding",
    "Une vraie vidéo TikTok du scanner de Cal AI ou de Yuka",
  ],
  checklist: [
    { point: "Chiffres Shinobi relus juste avant de tourner (relevé du 13 nov.)", state: "À vérifier" },
    { point: "Repère RevenueCat mesuré sur des essais de 3 jours, alors que tu conseilles 7 jours", state: "À vérifier" },
    { point: "Ta fiche « Chiffres » dit encore « 200 à 300 utilisateurs donnent une idée », la vidéo dit 1 000 minimum", state: "À trancher" },
    { point: "Leçon « Installer les analytics: Posthog » de l'Étape 5 citée : c'est bien une vidéo", state: "OK" },
    { point: "Description collée sous la leçon Skool", state: "À faire" },
  ],
};
