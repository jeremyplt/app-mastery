import type { VideoScript } from "./types";

// Fichier lu seulement par page.tsx (composant serveur) : ne jamais l'importer
// dans un composant client, sinon les scripts partent dans le bundle public.
//
// Scripts YouTube prêts à tourner. Sources des chiffres : RevenueCat des élèves
// (déjà publiés sur /temoignages), conversations WhatsApp du CRM, base de
// conseils validés (whatsapp_conseils) et dossier YouTube du 12 nov. 2026.

const UTM_A = "utm_source=youtube&utm_medium=video&utm_campaign=premieres-ventes-triche";

const SCRIPT_A: VideoScript = {
  slug: "premieres-ventes-triche",
  label: "Vidéo A · Triche",
  status: "Prêt à tourner",
  updatedAt: "12 nov. 2026",
  title: "Comment faire tes premières ventes sur ton app si vite que ça ressemble à de la triche",
  why: `Le marketing est le blocage n°1 de tes acheteurs et la question n°1 de tes élèves (« combien de comptes, à quel rythme », 26 fois chez 7 élèves). La vidéo garde ce qui a le mieux vendu (la preuve d'élèves qui gagnent de l'argent sans pub) et la construit sur Florian et Elouan, pas sur Wassim.`,
  facts: [
    { label: "Durée", value: "13 à 15 min" },
    { label: "Style", value: "Semi-scripté : ouverture et transitions mot à mot, exemples racontés librement" },
    { label: "Format", value: "« Comment obtenir X si vite que ça ressemble à de la triche » : méthode en 5 étapes, résultat montré à l'écran" },
    { label: "Demande", value: "8 vidéos à plus de 50 000 vues sur « faire connaître son app » (plancher 50 à 80 k, plafond environ 300 k), aucune en français. Le format « triche » : de 468 000 à 7,4 M de vues selon les niches, 551 000 en français." },
    { label: "Captures", value: "3 au maximum : RevenueCat de Florian, d'Elouan, de Shinobi (octobre)" },
    { label: "UTM", value: "premieres-ventes-triche" },
  ],
  altTitles: [
    {
      title: "Comment faire tes premières ventes sur ton app si vite que ça ressemble à de la triche",
      why: "Recommandé. Ton public croit qu'une app met six mois à un an à rapporter et qu'il faut un budget pub. « Triche » promet un raccourci légitime, « ventes » met l'argent en premier.",
    },
    {
      title: "1 793 $ en 28 jours sans pub : la méthode pour faire connaître ton app",
      why: "Plus sobre, format « argent révélé ». Il répète la miniature, donc à garder pour un test A/B.",
    },
    {
      title: "Si je devais faire vendre une app en partant de zéro, je ferais exactement ça",
      why: "Raccourci d'expert. Plus faible sur l'argent, donc en troisième.",
    },
  ],
  thumbnail: {
    text: "0 € DE PUB",
    layout: `Bloc jaune en haut à gauche avec « 0 € DE PUB » en noir, très gros. En dessous, un iPhone tenu en main qui affiche la vraie tuile RevenueCat « Revenue $1,793 » de Florian (public/emails/florian-revenuecat-1793-v2.jpg, recadrée sur la tuile). Une flèche rouge part du bloc jaune vers le chiffre. Toi en gros plan à droite (40 à 50 % de la hauteur), grand sourire avec les dents, regard caméra. Bureau en bois sombre flou, lampe, bokeh. Jamais de fond uni ni violet.`,
    variant: "Variante B : même composition avec la tuile « Revenue $1,384 » d'Elouan (public/emails/elouan-dashboard-1384-v1.jpg).",
    prompt: `Image 1 is a YouTube thumbnail: recreate this thumbnail with the exact same layout and composition.
Images 2 and 3 are photos of me: use my exact face, head shape, hairline, skin texture and proportions. Do not beautify, stylize or change my face.
Image 4 is a real RevenueCat dashboard screenshot: place it, unchanged, as the screen of the iPhone.
Image 5 is one of my validated thumbnails: copy its background and lighting style.

Layout: 16:9 YouTube thumbnail, 1920x1088.
Top left: a bright yellow rectangular block with huge bold black sans-serif text "0 € DE PUB", perfectly legible, nothing else written.
Left center, below the yellow block: an iPhone held in a hand, screen facing camera, showing the "Revenue $1,793" tile from image 4, sharp and readable. A thick red curved arrow goes from the yellow block to the revenue number.
Right side: me, close-up from mid-chest up, head and shoulders filling about 45% of the frame height, big genuine smile showing teeth, looking straight at the camera, dark t-shirt.
Background: a real blurred office, dark wood desk, warm lamp, plants, soft bokeh, like image 5. No flat or gradient background, no purple.
Lighting: soft key light on my face, subtle warm rim light on hair and shoulders, realistic shadows, slight vignette.
Keep 60 px safe margins. No other text, no logos, no extra numbers.
Negative: distorted face, changed identity, extra fingers, warped phone, unreadable numbers, cluttered layout, fake UI, cartoon style.`,
  },
  gift: {
    name: "Le prompt contenu viral (existant)",
    url: `https://www.jeremypitault.com/guide/prompt-contenu-viral?${UTM_A}`,
    note: "Il colle à l'étape 2 (refaire une vidéo qui a déjà marché pour ton app) et a déjà amené un client. Placé juste après l'étape 2, rappelé dans le récap. Le RDV n'arrive qu'à la fin.",
  },
  plan: [
    "Le spectateur sait quoi montrer pour que ses vidéos vendent au lieu de faire des vues : l'app est la solution de l'histoire.",
    "Il sait où trouver des vidéos qui ont déjà marché et comment les refaire pour son app en quelques minutes (la partie « triche »).",
    "Il sait où placer l'appel à l'action et comment donner le nom de l'app.",
    "Il connaît le volume (comptes, vidéos par jour, plateformes), comment ne pas se faire bloquer, et quand juger un format.",
    "Il sait vérifier que son audience peut payer (âge, pays, plateforme, langue) et corriger le contenu si ce n'est pas le cas.",
    "Il voit les résultats à l'écran et la chronologie honnête : sept semaines pour Florian, un mois pour Elouan.",
    "Il repart avec les quatre chiffres qui disent où ça casse.",
  ],
  sections: [
    {
      time: "0:00",
      title: "Ouverture : promesse, preuve, plan, public",
      beats: [
        { show: "Face caméra, plan serré, pas de musique pendant les 10 premières secondes." },
        {
          say: `Fin mai, Florian, 20 ans, postait deux à trois carrousels par jour pour son app. Ils faisaient entre 700 et 1 000 vues chacun, et son app faisait entre deux et cinq téléchargements par jour.`,
        },
        {
          say: `Mi-juillet, il était à 1 793 dollars sur les 28 derniers jours. Sans un euro de pub, uniquement avec du contenu posté depuis son téléphone.`,
          show: `Capture RevenueCat de Florian, zoom lent sur « Revenue $1,793 », 3 secondes.`,
        },
        {
          say: `Elouan, lui, était à zéro dollar de revenus fin septembre. Un mois de marketing plus tard, il était à 1 384 dollars sur 28 jours, avec plus de 1 000 dollars de revenus qui reviennent chaque mois. Lui non plus n'a pas mis un euro en pub.`,
          show: `Capture RevenueCat d'Elouan, nom de l'app flouté, 3 secondes.`,
        },
        {
          say: `Et quand on regarde ce qu'ils ont fait, ça ressemble presque à de la triche : ils n'ont rien inventé. Ils ont pris des vidéos qui avaient déjà marché pour d'autres apps, et ils les ont refaites pour la leur. Cette méthode, je te la donne dans cette vidéo, étape par étape, pour que tu fasses tes premières ventes beaucoup plus vite que ce qu'on t'a dit.`,
        },
        {
          say: `Pour que tu saches à qui tu as affaire : je m'appelle Jeremy, mon app de japonais, Shinobi, a fait plus de 40 000 dollars de revenus en octobre, et avec mon équipe, on accompagne des créateurs d'apps comme Florian et Elouan. C'est exactement ce qu'on leur fait appliquer.`,
          show: `Capture RevenueCat de Shinobi, octobre 2026, 2 secondes.`,
        },
        {
          say: `On va voir cinq étapes. La première, c'est ce que tu dois montrer dans tes vidéos pour qu'elles vendent au lieu de juste faire des vues. La deuxième, c'est où trouver des vidéos qui ont déjà marché et comment les refaire pour ton app : c'est la partie qui ressemble vraiment à de la triche. La troisième, c'est où mettre ton appel à l'action et le nom de ton app. La quatrième répond à la question qu'on me pose le plus : combien de comptes et combien de vidéos par jour, sans te faire bloquer. Et la cinquième, c'est comment vérifier que les gens qui te regardent peuvent payer.`,
          show: `Texte à l'écran : les 5 étapes, une ligne chacune, qui restent en sommaire dans un coin pendant la vidéo.`,
        },
        {
          say: `Je te préviens tout de suite : ce n'est pas magique. Il faut publier tous les jours pendant des semaines, et la plupart de tes vidéos feront peu de vues. Ce qui ressemble à de la triche, c'est que tu n'as plus à deviner ce qui marche.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou si tu es en train d'en créer une avec l'IA, et que ton vrai problème, c'est que personne ne la connaît. Tu n'as pas besoin d'être marketeur, et tu n'as même pas besoin de montrer ton visage.`,
        },
      ],
    },
    {
      time: "1:30",
      title: "Étape 1 : ton app doit être la solution de l'histoire",
      beats: [
        { say: `La première erreur, je la vois chez presque tous les créateurs d'apps : faire du contenu pour faire des vues.` },
        {
          say: `Une vidéo de conseils sur ta niche peut faire beaucoup de vues. Mais si ton app n'y est qu'un détail cité à la fin, presque personne ne la télécharge. Les vues, les likes et les commentaires ne paient pas tes factures. Ce que tu veux, ce sont des ventes.`,
        },
        {
          say: `Ton app doit être la solution de l'histoire. Je galérais avec ce problème, j'ai trouvé cette app, et voilà le résultat. Celui qui regarde doit comprendre en quelques secondes que c'est l'app qui a tout changé.`,
        },
        {
          say: `Florian l'a vécu. Ses carrousels faisaient des vues, mais pas assez de téléchargements. Alors il a testé des formats où l'app est la raison d'être de la vidéo. Par exemple, il se filme en train de réagir, choqué, du genre « je savais pas qu'une app pouvait faire ça », et juste après, on voit l'app marcher. Mi-juin, il faisait des journées à plus de 100 téléchargements, presque 200.`,
          show: `Écran : un exemple de réaction face caméra suivie de la démo d'une app, pris dans la banque de contenus (pas une vidéo d'élève).`,
        },
        {
          say: `Pour montrer ton app, montre la fonctionnalité qui impressionne et ce qu'elle change concrètement, au moment où la musique monte. Filme une main qui utilise l'app avec un deuxième téléphone, accélère les menus, et grossis le texte pour qu'il reste lisible. L'enregistrement d'écran marche aussi très bien sur certains contenus.`,
        },
        { say: `Et si tu ne veux pas te montrer, c'est très bien. Des mains, l'écran, du texte et une voix off suffisent.` },
        {
          say: `Retiens ça : 5 000 vues qui font télécharger valent plus qu'une vidéo virale qui ne fait rien. Fais l'exercice ce soir. Reprends tes cinq dernières vidéos et regarde-les comme quelqu'un qui ne te connaît pas. Si on ne comprend pas ce que fait ton app, tu fais des vues, pas des ventes.`,
        },
      ],
    },
    {
      time: "3:30",
      title: "Étape 2 : tu n'inventes rien, tu refais ce qui a déjà marché",
      beats: [
        { say: `La deuxième étape, c'est celle qui ressemble vraiment à de la triche : tu n'inventes rien.` },
        {
          say: `Tu fais du marketing, pas de l'influence. Tu n'as pas besoin d'avoir des idées géniales. Tu prends une vidéo qui a déjà marché pour une app de ta niche, ou d'une niche voisine, et tu la refais de A à Z pour la tienne.`,
        },
        {
          say: `Elouan a trouvé un carrousel en anglais qui avait déjà fait 25 000 likes, et il l'a refait avec ses propres images, pour son app. Un autre, il l'a carrément copié à cent pour cent. Aujourd'hui, sa méthode tient en une phrase : il prend le même texte qu'un compte américain qui fait la promo d'une app du même genre que la sienne, et il change juste les photos.`,
          show: `Écran : le carrousel d'origine et la version d'Elouan côte à côte, nom de son app flouté.`,
        },
        {
          say: `Le jour où il a commencé à poster sur son nouveau compte, après l'avoir chauffé, ses trois premiers posts ont fait 10 000 vues au total. Fin septembre, il cumulait plus d'un million de vues sur TikTok. Et le plus drôle, c'est que depuis, d'autres ont copié son format à lui. C'est devenu une tendance.`,
        },
        {
          say: `Ça marche parce qu'une vidéo qui a déjà fait des centaines de milliers de vues pour une autre app, c'est un format que l'algorithme et le public ont déjà validé. Toi, tu changes juste le produit.`,
        },
        {
          say: `Mais attention, tu copies le format, pas la vidéo. Tu gardes la même douleur, la même durée d'accroche, la même musique et les mêmes plans. Ce qu'on voit à l'écran, ce sont tes images et ton app. Et ne reprends jamais des extraits des vidéos d'autres créateurs : tu t'exposes à un signalement.`,
        },
        {
          say: `Pour trouver ces vidéos, cherche sur TikTok les apps de ta niche et des niches voisines. Garde seulement celles où l'app se voit vraiment à l'écran, et qui ont fait au moins 10 000 vues. Avec mon équipe, on en a déjà rangé des centaines par niche pour nos élèves, et je te montrerai ce qu'on en a appris dans une autre vidéo.`,
        },
        {
          say: `Une fois que tu as ta vidéo d'inspiration, tu donnes son texte, son texte à l'écran et sa légende à ton IA, et elle te rend la même chose pour ton app. Tu filmes, tu postes, et c'est fini.`,
        },
      ],
    },
    {
      time: "5:30",
      title: "Le cadeau",
      beats: [
        {
          say: `Pour cette partie, j'ai écrit un prompt que tu peux utiliser dès ce soir. Tu lui envoies un post qui a déjà cartonné sur TikTok ou Instagram, et ton IA te rend le même pour ton app : le texte à l'écran, le rythme du montage, la légende et le commentaire à épingler. Il est gratuit, et le lien est en premier dans la description.`,
          show: `Texte à l'écran : « Le prompt contenu viral, lien en description », 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "6:00",
      title: "Étape 3 : l'appel à l'action tôt, et le nom de l'app partout",
      beats: [
        {
          say: `Troisième étape : l'appel à l'action. L'erreur classique, c'est de le mettre à la toute fin. Sauf que la plupart des gens ne vont jamais jusqu'à la fin d'une vidéo, ni jusqu'à la dernière image d'un carrousel.`,
        },
        {
          say: `Mets-le tôt, dans la première moitié de la vidéo, ou vers la troisième ou la quatrième image d'un carrousel. Ensuite, tu continues ton contenu comme si de rien n'était. À la fin, ça ne passe que si la vidéo est très courte.`,
          show: `Animation : un carrousel de 10 images, l'appel à l'action passe de la 10e à la 4e.`,
        },
        {
          say: `Et il ne doit pas sonner comme une pub. Parle de ton app comme si tu la recommandais à un repas de famille : si tu veux la même chose pour toi, c'est dans cette app.`,
        },
        {
          say: `Donne aussi le nom de ton app, dans la vidéo, dans ta bio ou en commentaire épinglé. Ceux qui le tapent ensuite sur l'App Store font monter ton app dans les recherches. Tu peux aussi demander aux gens de commenter un mot pour recevoir le nom en message privé. Florian a mis une automatisation : chaque personne qui commente reçoit directement le lien de l'app. En plus, ça fait monter l'engagement de la vidéo.`,
        },
      ],
    },
    {
      time: "8:00",
      title: "Étape 4 : le volume, sans te faire bloquer",
      beats: [
        { say: `Quatrième étape, et c'est la question qu'on me pose le plus : combien de comptes et combien de vidéos.` },
        {
          say: `Commence avec un seul compte par plateforme. Chauffe-le quelques jours : tu likes, tu commentes, tu regardes des vidéos de ta niche. Ensuite, poste une vidéo par jour, puis deux. Deux par jour et par compte, c'est le maximum. Mieux vaut deux vidéos soignées que quinze bâclées.`,
          show: `Écran : « 1 compte par plateforme, chauffé quelques jours, 1 puis 2 vidéos par jour, 3 comptes au maximum par téléphone, jamais de VPN ».`,
        },
        {
          say: `Quand ça tourne, tu peux monter jusqu'à trois comptes par plateforme et par téléphone, pas plus, et jamais avec un VPN. Florian l'a appris à ses dépens. Quand il était en Asie, il postait avec un VPN et il multipliait les comptes. Début juin, ses vues sont tombées à 10, 11, 30 par vidéo. Il a dû recréer des comptes propres et les chauffer avant de repartir.`,
        },
        {
          say: `Ensuite, poste partout : TikTok, Instagram, YouTube Shorts. Tu ne sais jamais où ça va prendre. Fin septembre, Elouan cumulait plus d'un million de vues sur TikTok, et à peine 500 sur Instagram avec le même genre de contenu. Florian, lui, a fait un million de vues sur Instagram en un mois.`,
        },
        {
          say: `Pour juger un format, poste-le au moins dix fois, parce que l'algorithme peut simplement ne pas l'avoir pris. Après deux semaines de posts tous les jours, si tu es à 10 vues par vidéo, il y a un problème. Si tu es à 300 ou 400 vues avec des pics à 2 000, tu es sur la bonne voie. Il faut souvent des semaines à 200 vues avant qu'un format parte, et ça se débloque souvent d'un coup, parfois grâce à une seule vidéo.`,
        },
        {
          say: `Et quand un format perce, tu le bombardes. Tu le refais avec une autre accroche, un autre personnage, une autre situation. Les gens qui scrollent ne voient pas la répétition. C'est ce qu'a fait Florian : dès qu'un format a marché, il en a sorti un ou deux par jour, et il l'a aussi posté sur YouTube Shorts.`,
        },
        {
          say: `Pour tenir ce rythme, filme des dizaines de plans d'un coup, en une ou deux heures, puis monte tes vidéos à partir de tes vidéos d'inspiration. Et fais ton marketing en premier dans la journée. Sinon, à 22 heures, tu feras un carrousel vite fait en croyant avoir travaillé.`,
        },
      ],
    },
    {
      time: "10:30",
      title: "Étape 5 : vérifie que ceux qui te regardent peuvent payer",
      beats: [
        { say: `Cinquième étape, celle que presque personne ne fait : vérifier que les gens qui te regardent peuvent payer.` },
        {
          say: `Une vue n'est pas égale à une autre vue. Chez un de nos élèves, la moitié des utilisateurs avaient moins de 17 ans. À cet âge-là, environ 2 % prenaient l'essai gratuit, contre à peu près dix fois plus chez les 25-34 ans. Son app n'avait aucun problème. C'est son contenu qui attirait des ados, et un ado de 15 ans ne peut pas payer un abonnement. Il a changé de contenu pour parler à des adultes, et c'est là que ses ventes ont décollé.`,
          show: `Animation : deux silhouettes, « moins de 17 ans » et « 25-34 ans », avec leurs barres d'essai côte à côte. Aucun nom, aucune capture.`,
        },
        {
          say: `Donc pose la question de l'âge dans ton onboarding, par tranches. Si tu ne peux pas, regarde l'âge de ton audience dans les statistiques de ton compte pro TikTok ou Instagram.`,
        },
        {
          say: `Regarde aussi le pays et la plateforme. Dans les pays où le pouvoir d'achat est faible, presque personne ne paie, et l'iPhone convertit mieux qu'Android. TikTok montre tes vidéos aux gens du pays de ta carte SIM, Instagram aux gens qui parlent ta langue. Si tu veux toucher les Américains, qui paient mieux, ouvre un compte séparé en anglais.`,
        },
        {
          say: `Et regarde qui achète vraiment les apps comme la tienne. Elouan a vu que 80 à 90 % des utilisateurs des apps de sa niche sont des femmes. Alors il fait ses vidéos pour elles, pas pour lui.`,
        },
        {
          say: `Si ce n'est pas la bonne audience, ne touche pas à ton app : change ton contenu. D'autres sujets, un autre ton, des personnages plus âgés.`,
        },
      ],
    },
    {
      time: "12:30",
      title: "Récap : les quatre chiffres qui te disent où ça casse",
      beats: [
        {
          say: `Si je résume : ton app est la solution de l'histoire, tu refais des vidéos qui ont déjà marché, tu mets ton appel à l'action tôt, tu publies tous les jours sur plusieurs plateformes, et tu vérifies que les gens qui te regardent peuvent payer. Le prompt pour refaire une vidéo qui a marché est toujours en premier dans la description.`,
        },
        {
          say: `Pour savoir laquelle de ces étapes travailler, regarde chaque semaine quatre chiffres : tes vues, tes téléchargements, tes essais et tes ventes.`,
          show: `Animation : la chaîne vues, téléchargements, essais, ventes ; chaque flèche s'allume quand elle est citée.`,
        },
        {
          say: `Si tu as peu de vues, c'est le volume et les formats, donc les étapes deux et quatre. Si une vidéo perce mais que tes téléchargements ne font pas de pic, elle ne convertit pas : ton app n'est pas assez au centre ou ton appel à l'action est mal placé, ce sont les étapes un et trois. Et si tu as des téléchargements mais que personne ne lance l'essai, regarde d'abord qui te regarde, c'est l'étape cinq, avant de toucher à ton app.`,
        },
        { say: `Une journée à zéro ne veut rien dire. Juge la tendance sur quatre ou cinq jours.` },
        {
          say: `Florian a mis environ sept semaines pour passer de deux à cinq téléchargements par jour à 1 793 dollars sur 28 jours. Elouan, un mois. Ce n'est pas six mois, et ce n'est pas un an. C'est quelques semaines à publier tous les jours, avec la bonne méthode.`,
        },
      ],
    },
    {
      time: "14:00",
      title: "Fin",
      beats: [
        {
          say: `Florian et Elouan ont fait le travail eux-mêmes, mais ils n'étaient pas seuls : chaque fois que quelque chose bloquait, on cherchait ensemble où ça cassait. Si tu veux qu'on fasse la même chose avec ton app, réserve un appel avec mon équipe, le lien est dans la description.`,
        },
        {
          say: `Et dis-moi en commentaire combien de vidéos tu publies par semaine pour ton app en ce moment. Si cette vidéo t'a servi, abonne-toi : je montre tout ce qu'on fait sur nos apps, chiffres compris.`,
        },
      ],
    },
  ],
  description: `🎁 Le prompt GRATUIT qui transforme un post viral en post pour ton app (reels, carrousels, légende et commentaire à épingler) : https://www.jeremypitault.com/guide/prompt-contenu-viral?${UTM_A}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_A}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_A}

Florian est passé de 2 à 5 téléchargements par jour à 1 793 $ en 28 jours. Elouan, de 0 $ à 1 384 $ en un mois de marketing. Aucun des deux n'a mis un euro en pub. Je te montre les 5 étapes de leur méthode : quoi montrer, quelles vidéos refaire, où placer l'appel à l'action, combien publier sans te faire bloquer, et comment vérifier que ton audience peut payer.

👉 Dis-moi en commentaire combien de vidéos tu publies par semaine pour ton app.

0:00 Introduction
1:30 Ton app doit être la solution
3:30 Refaire ce qui a déjà marché
6:00 L'appel à l'action au bon endroit
8:00 Combien de comptes et de vidéos
10:30 L'audience qui peut payer
12:30 Les 4 chiffres qui disent où ça casse
14:00 La suite

#applicationmobile #marketingapp #tiktokmarketing #créeruneapp #appmobile #contenuorganique #entrepreneur`,
  shorts: [
    "« Ton appel à l'action est au mauvais endroit » (étape 3, 40 s).",
    "« Il copie le texte d'un compte américain et change juste les photos » (étape 2, 45 s).",
    "« Pourquoi tes vidéos font 10 vues : le VPN et trop de comptes » (étape 4, 40 s).",
  ],
  prepare: [
    "Demander à Elouan le carrousel d'origine (25 000 likes) et sa version, pour l'écran de l'étape 2.",
    "Prévenir Florian et Elouan : leurs prénoms et leurs chiffres sont déjà publics sur /temoignages, leurs apps restent non nommées et floutées.",
    "L'exemple des moins de 17 ans (étape 5) vient du cas de Wassim, sans nom ni capture. Il se coupe sans rien casser si tu ne veux pas du tout de lui.",
    "Choisir dans la banque de contenus un exemple « réaction puis démo » pour l'étape 1.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs", state: "OK" },
    { point: "3 vidéos à plus de 50 000 vues sur le sujet", state: "OK (8 relevées, dont 2 de moins de 2 mois)" },
    { point: "Argent dans le titre, format prouvé, psychologie écrite", state: "OK" },
    { point: "Pas une 2e vidéo construite sur Wassim", state: "OK (Florian et Elouan au centre)" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "3 captures au maximum, RDV en 1 ou 2 phrases, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "OK (prompt contenu viral)" },
    { point: "Miniature : 4 mots, preuve visible, visage à droite", state: "OK" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

// Vidéo B : tirée de l'analyse de la GIGA BANQUE DE CONTENU du 12 nov. 2026.
// Vues TikTok relues avec yt-dlp le 12/11 ; vues Instagram reprises de la
// banque (yt-dlp ne donne que les likes). Aucun élève ni app d'élève cité.
const UTM_B = "utm_source=youtube&utm_medium=video&utm_campaign=analyse-1633-videos";

const lesson = (n: number, title: string, say: string, show: string) => ({
  time: `Leçon ${n}`,
  title,
  beats: [{ say: `${title}. ${say}`, show: `Bandeau « LEÇON ${n} », compteur « ${n} / 32 ». ${show}` }],
});

const partCard = (label: string) => ({ show: `Carte plein écran noire : « ${label} ».` });

const SCRIPT_B: VideoScript = {
  slug: "analyse-1633-videos",
  label: "Vidéo B · 1 633 vidéos",
  status: "Prêt à tourner",
  updatedAt: "12 nov. 2026",
  title: "J'ai analysé 1 633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)",
  why: `Même format que « J'ai analysé 300 apps », ta vidéo qui a fait le plus de leads (49) et la meilleure rétention en %. Elle répond à la question que tes élèves posent le plus (« quel contenu faire ? ») avec une matière que personne d'autre n'a : la GIGA BANQUE, analysée vidéo par vidéo.`,
  facts: [
    { label: "Durée", value: "17 à 20 min" },
    { label: "Style", value: "Semi-scripté : ouverture, transitions et titres des leçons mot à mot, exemples racontés librement" },
    { label: "Format", value: "« J'ai analysé N X et j'ai appris ça » : 32 leçons numérotées, un exemple à l'écran par leçon" },
    { label: "Matière", value: "1 633 vidéos qui montrent une app (1 144 TikTok, 489 Instagram) dans 18 niches, gardées parmi environ 12 500 passées au crible. Plus d'un milliard de vues cumulées pour celles dont on connaît les vues." },
    { label: "Demande", value: "Superwall « 1,000 Hours of Studying The Most Profitable Apps » : 138 000 vues en 7 semaines. Jason Lee, 172 000. Ta vidéo « 300 apps » : 49 leads." },
    { label: "Chiffres", value: "Vues TikTok revérifiées le 12/11. Vues Instagram reprises de la banque (début novembre), likes revérifiés." },
    { label: "Captures", value: "2 : RevenueCat d'Elouan, RevenueCat de Shinobi (octobre)" },
    { label: "UTM", value: "analyse-1633-videos" },
  ],
  altTitles: [
    {
      title: "J'ai analysé 1 633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)",
      why: "Recommandé. Format prouvé (expérience condensée), qui a déjà marché sur ta chaîne avec « 300 apps ». Le chiffre exact rend la promesse crédible, et « télécharger » dit le résultat sans promettre des ventes que la banque ne mesure pas.",
    },
    {
      title: "Plus d'un milliard de vues : ce que font les vidéos qui font télécharger des apps",
      why: "Plus spectaculaire, mais il perd le format « j'ai analysé N » qui a fait tes meilleurs leads.",
    },
    {
      title: "Les 32 règles des vidéos qui font télécharger des apps (1 633 vidéos analysées)",
      why: "Plus sobre, proche de la checklist « 27 règles ». À garder pour un test A/B.",
    },
  ],
  thumbnail: {
    text: "63 M DE VUES",
    layout: `Bloc jaune en haut à gauche avec « 63 M DE VUES » en noir, très gros. En dessous, un iPhone tenu en main qui affiche une vidéo verticale d'app (un téléphone filmé par un autre téléphone sur un bureau) avec un compteur de vues « 63,4 M » et un badge « 0:10 ». Une flèche rouge du bloc vers le compteur. Toi à droite, en gros plan, l'air sincèrement étonné ou grand sourire. Bureau sombre flou. La miniature pose la question (comment une vidéo de 10 secondes fait 63 millions de vues pour une app), le titre y répond juste assez (j'en ai analysé 1 633).`,
    variant: "Variante B : bloc jaune « 1 MILLIARD DE VUES », derrière toi un mur flou d'une trentaine de vignettes de vidéos verticales.",
    prompt: `Images 1 and 2 are photos of me: use my exact face, head shape, hairline, skin texture and proportions. Do not beautify, stylize or change my face.
Image 3 is one of my validated thumbnails: copy its background and lighting style.

Layout: 16:9 YouTube thumbnail, 1920x1088.
Top left: a bright yellow rectangular block with huge bold black sans-serif text "63 M DE VUES", perfectly legible, nothing else written.
Left center, below the yellow block: an iPhone held in a hand, screen facing camera, showing a vertical short video: another phone lying on a wooden desk with a finger tapping a clean, generic app screen. On the right edge of that video, a view counter "63,4 M" with an eye icon, and a small duration badge "0:10" at the bottom. No real app logo, no brand name. A thick red curved arrow goes from the yellow block to the view counter.
Right side: me, close-up from mid-chest up, head and shoulders filling about 45% of the frame height, genuinely amazed expression with a big smile, looking straight at the camera, dark t-shirt.
Background: a real blurred office, dark wood desk, warm lamp, plants, soft bokeh, like image 3. No flat or gradient background, no purple.
Lighting: soft key light on my face, subtle warm rim light, realistic shadows, slight vignette.
Keep 60 px safe margins. No other text, no logos, no extra numbers.
Negative: distorted face, changed identity, extra fingers, warped phone, unreadable numbers, cluttered layout, fake brand logos, cartoon style.`,
  },
  gift: {
    name: "La checklist des 32 leçons, avec une vraie vidéo d'exemple par leçon (à créer)",
    url: `https://www.jeremypitault.com/guide/32-lecons-videos?${UTM_B}`,
    note: "Même logique que la checklist « 27 règles » de la vidéo « 300 apps ». La page n'existe pas encore : à créer avant la publication, sinon remplacer la 1re ligne de la description par le prompt contenu viral (/guide/prompt-contenu-viral). Placée après la partie 2 (les accroches), rappelée dans le récap.",
  },
  plan: [
    "Le spectateur sait comment filmer son app pour qu'elle ait l'air recommandée et pas vendue (deuxième téléphone, sans visage, app dans le premier tiers, court).",
    "Il a une liste d'accroches qui ont fait des millions et sait pourquoi elles marchent.",
    "Il connaît une dizaine de formats concrets à refaire pour son app, avec un exemple pour chacun.",
    "Il sait comment donner le nom de l'app et faire passer le spectateur au téléchargement.",
    "Il comprend le rôle du volume et de la répétition (même script, résultats de 1 701 à 428 500 vues).",
    "Il sait quelles niches portent le plus, et que des vues sans app à l'écran ne font pas forcément télécharger.",
    "Il repart avec la checklist des 32 leçons et un exemple vidéo par leçon.",
  ],
  sections: [
    {
      time: "0:00",
      title: "Ouverture : promesse, preuve, plan, public",
      beats: [
        { show: "Face caméra, plan serré. Derrière toi, à l'écran, le défilement rapide de la banque (titres de sections et liens)." },
        {
          say: `Une vidéo de dix secondes, une fille qui sort de son lit, une app à l'écran : 63 millions de vues. Je voulais comprendre ce que font ces vidéos qui font télécharger des apps. Alors avec mon équipe, on a passé au crible environ 12 500 vidéos TikTok et Instagram, et on en a gardé 1 633 qui mettent vraiment une app en avant. À elles seules, celles dont on connaît les vues dépassent le milliard de vues.`,
          show: `La vidéo Finch (10 s, 63,4 M de vues) en incrustation 3 secondes, avec le nom du compte, puis un compteur qui monte jusqu'à 1 633.`,
        },
        {
          say: `Dans cette vidéo, je te donne les 32 choses que j'ai apprises, avec un exemple réel pour chacune, pour que tu puisses les refaire pour ton app dès demain.`,
        },
        {
          say: `Je m'appelle Jeremy, mon app de japonais, Shinobi, a fait plus de 40 000 dollars de revenus en octobre, et c'est dans cette banque que mes élèves vont chercher leurs formats. Elouan, par exemple, est passé de zéro à 1 384 dollars sur 28 jours en un mois de marketing, sans pub, en refaisant des formats qui avaient déjà marché.`,
          show: `Capture RevenueCat de Shinobi (octobre, 2 s), puis celle d'Elouan, nom de l'app flouté (2 s).`,
        },
        {
          say: `On va voir 32 leçons en sept parties : comment filmer ton app, les accroches, les formats, le nom de l'app, les comptes, les niches, et les détails qui changent tout.`,
          show: `Texte à l'écran : les 7 parties, qui restent en sommaire dans un coin.`,
        },
        {
          say: `Une précision honnête avant de commencer : de ces vidéos, on connaît les vues, pas les téléchargements. Une vidéo à des millions de vues ne fait pas forcément télécharger, et je te montrerai pourquoi dans la leçon 29.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou si tu en crées une avec l'IA, et que tu ne sais pas quoi poster pour la faire connaître. Tu n'as pas besoin d'être créateur de contenu, ni de montrer ton visage.`,
        },
      ],
    },
    {
      time: "1:30",
      title: "Partie 1 : comment filmer ton app",
      beats: [partCard("PARTIE 1 · COMMENT FILMER TON APP"), { say: `Première partie : comment filmer ton app. Ce sont les cinq leçons les plus simples à appliquer, et celles qui changent le plus la façon dont on perçoit ta vidéo.` }],
    },
    lesson(
      1,
      "Filme ton téléphone avec un deuxième téléphone, la main dans le cadre",
      `Sur les 24 plus grosses vidéos qu'on a regardées image par image, 16 filment l'app sur un vrai téléphone posé sur un bureau ou tenu en main, avec un doigt qui tape dessus. Une seule est un pur enregistrement d'écran. Ça donne l'impression que quelqu'un te montre un truc, pas qu'on te vend quelque chose. Soundscape, une app de concentration, a fait 40,8 millions de vues en 20 secondes avec un iPhone posé sur un bureau en bois et une main qui lance l'app. L'enregistrement d'écran peut quand même marcher : l'app française Nomad Education a fait 6,5 millions de vues comme ça.`,
      `Soundscape (@soundscape.study, 40,8 M) puis Nomad Education (@nomad_education, 6,5 M), 3 s chacune.`
    ),
    lesson(
      2,
      "Tu n'as pas besoin de montrer ton visage",
      `14 des 24 grosses vidéos ne montrent jamais le visage de la personne qui filme. La plus vue de toute la banque, une app de prise de notes, a fait 66 millions de vues sur Instagram : on est dans un amphi, un ordinateur sur les genoux, on tape une adresse, et l'IA prend les notes du cours. Pas un seul visage. Si te montrer te bloque, ce n'est plus une excuse.`,
      `Unstuck AI (@quizard.ai, Instagram, 66,1 M).`
    ),
    lesson(
      3,
      "Ton app doit apparaître dans le premier tiers de la vidéo",
      `Dans 16 des 24 grosses vidéos, l'app est à l'écran dès la deuxième ou la troisième seconde, juste après l'accroche. Stronger, une app de musculation, a fait 15 millions de vues en 11 secondes : une fille se tient le front, avec écrit « quatre ans de salle et je découvre ça maintenant », et dès la quatrième seconde, on voit l'app créer son programme.`,
      `Stronger (@kailyn.lifts, 15,3 M).`
    ),
    lesson(
      4,
      "La plupart des vidéos qui marchent durent moins de 20 secondes",
      `Sur les 75 vidéos TikTok qu'on a vérifiées une par une, la durée médiane est de 18 secondes. La vidéo TikTok la plus vue de la banque, celle de l'app Finch, fait 63 millions de vues et dure 10 secondes : une accroche, l'app, un résultat. Attention, les petites vidéos sont courtes aussi. La durée ne fait pas les vues, elle évite juste de les perdre.`,
      `Finch (@finchcare, 63,4 M, 10 s) avec un chronomètre à l'écran.`
    ),
    lesson(
      5,
      "L'exception, c'est le long face caméra qui explique vraiment l'app",
      `6 des 75 vidéos vérifiées dépassent une minute, et deux d'entre elles ont fait plus de 5 millions de vues. Une créatrice qui parle de TDAH montre pendant deux minutes un outil qui découpe une tâche en petites étapes : 10,8 millions de vues. Ça marche quand tu parles à un public très précis, qui a besoin de comprendre. Pour tout le reste, fais court.`,
      `Goblin Tools (@thatadhdlife, 10,8 M, 1 min 52).`
    ),
    {
      time: "4:30",
      title: "Partie 2 : les accroches",
      beats: [partCard("PARTIE 2 · LES ACCROCHES"), { say: `Deuxième partie, les accroches. Les six qui reviennent le plus dans les vidéos à plusieurs millions de vues.` }],
    },
    lesson(
      6,
      "L'accroche la plus copiée, c'est « pourquoi je découvre ça seulement maintenant »",
      `On la trouve dans une trentaine de vidéos de la banque, dans des niches qui n'ont rien à voir entre elles. « Trois ans d'études et je trouve ça seulement maintenant » : 66 millions de vues. « Quatre ans de salle et je découvre ça » : 15 millions. Elle dit au spectateur qu'il est en train de rater quelque chose, et personne n'aime rater quelque chose.`,
      `Les deux accroches côte à côte (Unstuck AI, Stronger).`
    ),
    lesson(
      7,
      "Fais dire par quelqu'un d'autre que l'app est géniale",
      `« Ma mère m'a montré », « ma sœur m'a montré ce qu'elle utilise pour réviser ». Trois des 18 vidéos les plus vues commencent comme ça. Coconote, une app qui enregistre les cours, a fait 26 millions de vues avec « ma mère m'a montré à quel point la fac peut être facile », puis l'iPhone qui enregistre le cours. Ta pub devient du bouche-à-oreille.`,
      `Coconote (@coconote.app, Instagram, 26 M) puis StudyFetch (Instagram, 11,9 M).`
    ),
    lesson(
      8,
      "Les mots « secret » et « ça paraît illégal » donnent envie de savoir",
      `Présente ton app comme un avantage caché. « Mon secret pour avoir A+ tout le semestre » a fait 3,3 millions de vues pour une app de révision. Dans la finance, « cette app paraît illégale » revient souvent. Reste honnête : l'avantage doit être vrai.`,
      `Yolk AI (@studyv.tok, 3,3 M).`
    ),
    lesson(
      9,
      "Commence par le problème, finis par l'app",
      `Le spectateur doit se reconnaître dès la première seconde. Dans la vidéo Finch à 63 millions de vues, une fille est au lit, avec écrit « fini de traîner au lit, grâce à cette app », elle se lève, et l'app arrive. Jotbot a fait 47 millions de vues sur Instagram avec « je n'ai pas 1 heure 38 pour regarder ce cours » : on colle le lien, et les notes sortent.`,
      `Finch (63,4 M) puis Jotbot AI (@myjotbot, Instagram, 47,7 M).`
    ),
    lesson(
      10,
      "Le POV met le spectateur dans la scène en une phrase",
      `Le POV décrit sa situation à lui, pas la tienne. « POV : dans deux mois, c'est le bac et t'as toujours pas fait tes fiches » a fait 347 000 vues en français, puis on voit l'app générer les fiches à partir des cours. La banque en contient une trentaine.`,
      `Parkeur (@studywchimene, 346 900 vues).`
    ),
    lesson(
      11,
      "La réaction choquée dure une seconde, puis on passe à l'app",
      `Main sur le front, bouche ouverte, regard caméra : c'est un hook visuel, pas un sketch. Dès la deuxième ou la troisième seconde, l'écran prend le relais. Et c'est ta réaction à toi, jamais celle d'un autre créateur, sinon tu t'exposes à un signalement.`,
      `Stronger : les 2 secondes de réaction, puis la coupe sur l'app.`
    ),
    {
      time: "7:30",
      title: "Le cadeau",
      beats: [
        {
          say: `Petite pause. Pour que tu puisses refaire tout ça, j'ai mis les 32 leçons dans une checklist, avec pour chacune le lien vers une vraie vidéo d'exemple. Elle est gratuite, et le lien est en premier dans la description.`,
          show: `Texte à l'écran : « La checklist des 32 leçons, lien en description », 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "7:45",
      title: "Partie 3 : les formats",
      beats: [partCard("PARTIE 3 · LES FORMATS"), { say: `Troisième partie, la plus longue : les formats. Neuf façons concrètes de montrer ton app, que tu peux refaire telles quelles.` }],
    },
    lesson(
      12,
      "Le format roi, c'est « je mets ça dedans, regarde ce qui sort »",
      `On voit l'entrée, un cours, une photo, un lien, on la donne à l'app, et le résultat apparaît. Pas besoin d'expliquer, la transformation se comprend toute seule. Environ 150 vidéos de la banque suivent ce schéma. Un cours qu'on dépose et qui devient des flashcards et un quiz : 4,7 millions de vues.`,
      `@studywithtay2 (4,7 M).`
    ),
    lesson(
      13,
      "Deux assiettes, un scan, pas un mot",
      `Deux plats avec le même nombre de calories, des mains gantées qui les préparent, un téléphone qui scanne, et la note s'affiche. Ni voix, ni visage. L'app CalScan a fait 16,5 millions et 12,6 millions de vues avec ce format. Le spectateur joue avec toi : il choisit son assiette avant de voir le résultat.`,
      `CalScan (@calscanapp, 16,5 M).`
    ),
    lesson(
      14,
      "L'avant-après marche aussi pour une app",
      `Une femme décroche le calendrier papier du frigo, le jette, et accroche à la place l'écran familial Hearth, relié à son app : 30 millions de vues en 10 secondes. Ou trois étudiantes, trois façons de réviser, trois notes : 17 millions. L'app, c'est toujours le côté « après ».`,
      `Hearth (Instagram, 29,9 M) puis Oreate AI (Instagram, 17,1 M).`
    ),
    lesson(
      15,
      "La liste des « 3 apps que tout le monde devrait avoir » permet de glisser la tienne",
      `Les gens enregistrent ce genre de vidéo pour plus tard, et ton app profite de la crédibilité des apps connues autour d'elle. « Top 3 des meilleures IA pour tes études » a fait 1,6 million de vues en français. La recette : plusieurs apps connues, et la tienne au milieu.`,
      `Être Étudiant (@etreetudiant, 1,6 M).`
    ),
    lesson(
      16,
      "Les carrousels font des millions sur TikTok, sans visage et sans montage",
      `Des photos et des captures qu'on fait défiler : c'est le format le plus simple à produire. Yuka a fait 2 millions de vues avec un carrousel qui choque sur l'aspartame. La banque en contient plus de 80. Mets ton appel à l'action vers la troisième ou la quatrième image.`,
      `Carrousel Yuka (@yuka_app, 2 M), on fait défiler les images.`
    ),
    lesson(
      17,
      "Une mascotte ou un animal à faire grandir rend ton app mémorable",
      `L'oiseau de Finch : 63 et 33 millions de vues. Un chat animé qui explique comment perdre du poids : 5 millions. Un personnage donne un visage à ton app sans montrer le tien, et on a envie de s'en occuper.`,
      `Finch (33,2 M) puis Jurney (@kittyweight, 5,1 M).`
    ),
    lesson(
      18,
      "Montre le moment où la récompense tombe",
      `Un rang après un développé couché, un gobelin battu à coups de pompes, un arbre qui pousse pendant qu'on travaille. Push Up Arena a fait 3,4 millions de vues avec 16 secondes de pompes face à un gobelin. Si ton app transforme l'effort en jeu, filme la victoire.`,
      `Push Up Arena (@pushuparena.app, 3,4 M).`
    ),
    lesson(
      19,
      "L'ambiance vend l'app sans un mot",
      `Un iPad filmé de nuit, on choisit son siège, la carte d'un vol Tokyo-Séoul s'affiche, et on commence à réviser. FocusFlight a fait 12,2 millions de vues sans une seule explication. Tu montres le rituel, pas les fonctionnalités.`,
      `FocusFlight (@idkjustrant, 12,2 M).`
    ),
    lesson(
      20,
      "Raconte pourquoi tu as créé ton app",
      `Une phrase sur ta raison personnelle suffit. « J'ai créé cette app parce que trop de femmes se voient à travers le regard des autres » : 1,6 million de vues en 7 secondes. Le compte d'une app de Pilates a posté huit vidéos avant même sa sortie, dont une à 9 millions de vues. Tu peux commencer avant le lancement.`,
      `Storia (@storiaworld, 1,6 M) puis Forméa (@formea.pilates, 9,2 M).`
    ),
    {
      time: "12:00",
      title: "Partie 4 : le nom de l'app",
      beats: [partCard("PARTIE 4 · LE NOM DE L'APP"), { say: `Quatrième partie : comment faire passer le spectateur de la vidéo à ton app.` }],
    },
    lesson(
      21,
      "Donne le nom de l'app comme une évidence",
      `« Au fait, l'app s'appelle FocusFlight » : 7,1 millions de vues. Le nom arrive en passant, à la fin ou dans la légende, et ça sonne comme une recommandation, pas comme une pub. En plus, quand les gens tapent ce nom sur l'App Store, ton app remonte dans les recherches.`,
      `FocusFlight (@lily6021023, 7,1 M), la légende en gros.`
    ),
    lesson(
      22,
      "Sur Instagram, « commente un mot et je t'envoie l'app » est devenu la norme",
      `29 des 32 vidéos de la banque qui font ça sont sur Instagram. Eclipta a fait 13 millions de vues avec « commente Eclipta pour recevoir l'app ». Ça fait monter les commentaires, donc la portée. Sur TikTok, c'est presque absent.`,
      `Eclipta (Instagram, 13 M), la légende en gros.`
    ),
    {
      time: "13:00",
      title: "Partie 5 : les comptes",
      beats: [partCard("PARTIE 5 · LES COMPTES"), { say: `Cinquième partie, et on passe la barre des deux tiers : qui poste, et combien de fois.` }],
    },
    lesson(
      23,
      "Le compte officiel de ton app peut faire aussi bien que n'importe quel créateur",
      `8 des 15 vidéos TikTok les plus vues de la banque sont postées par le compte de l'app lui-même. Turbo AI, une app de révision, a fait 9,3 millions de vues avec un micro-trottoir sur un campus : on demande leur moyenne aux étudiants, puis avec quoi ils révisent. Tu n'as pas besoin d'influenceurs pour commencer.`,
      `Turbo AI (@getturboai, 9,3 M).`
    ),
    lesson(
      24,
      "Les grosses apps paient des dizaines de créatrices pour poster tous les jours",
      `Rien que pour StudyFetch, on a trouvé treize comptes différents avec le nom de l'app dans leur pseudo. Quand tu vois une app partout, ce n'est pas de la chance, c'est du volume. Au début, ce volume, c'est toi qui le fais.`,
      `Grille des 13 comptes « studyfetch ».`
    ),
    lesson(
      25,
      "Le même script, tourné par quatre créateurs, a fait de 1 701 à 428 500 vues",
      `Même phrase, même son, même durée, pour une app d'investissement. Une version a fait 428 500 vues, une autre 1 701. Le contenu n'explique pas tout. C'est pour ça qu'il faut poster un format au moins dix fois avant de le juger.`,
      `Les 4 vidéos Bloom côte à côte avec leurs vues (428 500, 229 100, 165 600, 1 701).`
    ),
    lesson(
      26,
      "Un compte qui répète le même format décroche un gros chiffre de temps en temps",
      `Une app de scan, Tallow, a posté huit vidéos au même format : 2,9 millions, 2,6 millions, 1,7 million, puis entre 69 000 et 89 000 vues. SideMe ne change que l'accroche et garde toujours les mêmes plans. Tu ne cherches pas une idée par jour, tu déclines le format qui marche.`,
      `Les 8 vidéos Tallow en grille avec leurs vues.`
    ),
    {
      time: "15:00",
      title: "Partie 6 : les niches",
      beats: [partCard("PARTIE 6 · LES NICHES"), { say: `Sixième partie : les niches, et une mise en garde.` }],
    },
    lesson(
      27,
      "Les étudiants sont la niche qui fait le plus de vues",
      `La révision et la concentration, c'est 28 % des vidéos de la banque, mais la moitié de celles qui dépassent un million de vues. Ce public vit sur TikTok et adore l'astuce que personne ne connaît. Si ton app aide à réviser, tu es sur le terrain le plus porteur.`,
      `Animation : 28 % des vidéos, 50 % des vidéos à plus d'un million.`
    ),
    lesson(
      28,
      "Les parents font des millions, à condition de parler de leur fatigue",
      `Les vidéos pour parents qui explosent ne parlent pas de l'enfant, mais du parent. « Comment je couche mes enfants en 15 minutes » a fait 13,3 millions de vues pour l'app Moshi. Les apps de tâches pour enfants, elles, restent souvent entre 10 000 et 100 000 vues.`,
      `Moshi (@playmoshikids, 13,3 M).`
    ),
    lesson(
      29,
      "Des millions de vues sans l'app à l'écran ne font pas forcément télécharger",
      `Une vidéo de 6 secondes, une fille filmée du cou aux pieds, « 60 kg » écrit à l'écran : 11,8 millions de vues, et l'app n'est que dans la légende. On ne sait pas si elle a fait télécharger. Dans la banque, 28 vidéos sont notées « bonne vidéo, mais il manque l'appel à l'action ». Retiens ça : 5 000 vues qui font télécharger valent plus qu'un million de vues qui ne font rien.`,
      `Tone AI (@movewmil, 11,8 M), puis la légende entourée.`
    ),
    {
      time: "16:30",
      title: "Partie 7 : les détails qui changent tout",
      beats: [partCard("PARTIE 7 · LES DÉTAILS"), { say: `Dernière partie : trois détails qui font la différence entre une copie qui marche et une copie qui ne marche pas.` }],
    },
    lesson(
      30,
      "Quand tu copies un format, garde exactement le même son",
      `Deux apps de musculation concurrentes ont explosé avec le même son : 15 millions et 4 millions de vues. Le son fait partie du format. Si tu le changes, tu ne copies plus vraiment ce qui a marché.`,
      `Stronger (15,3 M) et Lyfta (@lyft.withnicole, 4,2 M) côte à côte, même son.`
    ),
    lesson(
      31,
      "Écris ton accroche à l'écran, en gros, dès la première image",
      `21 des 24 grosses vidéos ont une phrase écrite dès le début. Beaucoup n'ont ni voix ni visage : le texte fait tout le travail, et il se lit même le son coupé. CalScan n'écrit que deux mots, « 800 kcal » au-dessus de chaque assiette, et tout le monde comprend.`,
      `Première image de 6 grosses vidéos en mosaïque, le texte entouré.`
    ),
    lesson(
      32,
      "Le français a de la place, mais les plus gros chiffres sont en anglais",
      `Aucune des 18 vidéos les plus vues de la banque n'est en français. La plus vue en français fait quand même 7,2 millions de vues, pour une app de révision. Commence dans ta langue si tu veux, mais ouvre aussi un compte en anglais : c'est là que l'audience est la plus grande, et les Américains paient mieux.`,
      `Nomad Education (@priel.study, 7,2 M).`
    ),
    {
      time: "18:00",
      title: "Récap et fin",
      beats: [
        {
          say: `Si tu ne retiens que cinq choses : filme ton app avec un deuxième téléphone, montre-la dans les trois premières secondes, commence par le problème de ton public, copie un format qui a déjà marché avec le même son, et poste-le au moins dix fois avant de le juger. Les 32 leçons sont dans la checklist en description, avec un exemple pour chacune.`,
          show: `Les 5 points à l'écran, un par un.`,
        },
        {
          say: `Et garde en tête que ce qui compte pour toi, ce n'est pas le nombre de vues, c'est le pic de téléchargements après une vidéo. Si une vidéo perce et que tes téléchargements ne bougent pas, elle ne convertit pas.`,
        },
        {
          say: `Si tu veux qu'on t'accompagne pour trouver les formats qui font vendre ton app, réserve un appel avec mon équipe, le lien est dans la description.`,
        },
        {
          say: `Et dis-moi en commentaire laquelle de ces 32 leçons tu vas tester en premier. Si la vidéo t'a servi, abonne-toi : je montre tout ce qu'on fait sur nos apps, chiffres compris.`,
        },
      ],
    },
  ],
  description: `🎁 La checklist GRATUITE des 32 leçons, avec une vraie vidéo d'exemple pour chacune : https://www.jeremypitault.com/guide/32-lecons-videos?${UTM_B}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_B}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_B}

On a passé au crible environ 12 500 vidéos TikTok et Instagram pour en garder 1 633 qui montrent une app, et plus d'un milliard de vues au total. Je te donne les 32 leçons qu'on en a tirées : comment filmer ton app, les accroches qui font des millions, les formats à refaire, comment donner le nom de l'app, le volume et les niches qui portent le plus.

👉 Dis-moi en commentaire laquelle de ces 32 leçons tu vas tester en premier.

0:00 Introduction
1:30 Comment filmer ton app
4:30 Les accroches
7:45 Les formats
12:00 Le nom de l'app
13:00 Les comptes
15:00 Les niches
16:30 Les détails qui changent tout
18:00 Ce qu'il faut retenir

#applicationmobile #marketingapp #tiktokmarketing #créeruneapp #appmobile #contenuorganique #entrepreneur`,
  shorts: [
    "« Deux assiettes, un scan, 16 millions de vues » (leçon 13, 30 s).",
    "« Le même script : 428 500 vues chez l'un, 1 701 chez l'autre » (leçon 25, 35 s).",
    "« 63 millions de vues en 10 secondes pour une app » (leçon 4, 30 s).",
  ],
  prepare: [
    "Créer le cadeau : la page /guide/32-lecons-videos (checklist PDF des 32 leçons, un lien d'exemple par leçon), sur le modèle de « 27 règles ». Sinon, 1re ligne de la description remplacée par le prompt contenu viral.",
    "Captures d'écran des exemples : chaque vidéo citée 2 à 3 secondes, avec le nom du compte visible. Tous les liens sont dans l'analyse de la banque.",
    "Montage du format « j'ai analysé N » : bandeau « LEÇON N » et titre à chaque leçon, compteur « N / 32 » permanent, carte noire à chaque partie. À l'oral, ne pas dire « leçon numéro N » à chaque point.",
    "Les vues Instagram (Unstuck AI, Jotbot, Hearth, Coconote, Oreate AI, StudyFetch, Eclipta) viennent de la banque, relevées début novembre : les relire à l'écran le jour du tournage.",
    "Aucun élève ni app d'élève n'apparaît dans les exemples. Elouan n'est cité que dans l'ouverture, comme sur /temoignages.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs", state: "OK" },
    { point: "Demande prouvée et format déjà gagnant sur ta chaîne", state: "OK (Superwall 138 k, Jason Lee 172 k, ta vidéo « 300 apps »)" },
    { point: "Format « j'ai analysé N » : 20 à 40 points", state: "OK (32 leçons, un exemple réel chacune)" },
    { point: "Chiffres vérifiés à la source", state: "OK (TikTok relus le 12/11)" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "2 captures, RDV en 1 ou 2 phrases, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "À créer (checklist des 32 leçons)" },
    { point: "Miniature : 4 mots, preuve visible, visage à droite", state: "OK" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

export const SCRIPTS: VideoScript[] = [SCRIPT_A, SCRIPT_B];
