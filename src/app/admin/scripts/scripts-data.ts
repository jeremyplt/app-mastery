import type { ScriptSection, VideoScript } from "./types";

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
  status: "À réécrire (construit sur des élèves)",
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

// Vidéo B : tirée de l'analyse de la GIGA BANQUE DE CONTENU du 12 nov. 2026 et de
// la recherche des flops du 18 nov. 2026 (14 comptes officiels TikTok et 7 comptes
// Instagram, plus de 100 vidéos regardées image par image, 4 543 commentaires lus) :
// ~/Projects/reports/2026-11-18-flops/ (tiktok.md, instagram-et-pubs.md). Vidéo grand public : aucun élève cité.
const UTM_B = "utm_source=youtube&utm_medium=video&utm_campaign=analyse-1633-videos";

const lesson = (n: number, title: string, say: string, show: string) => ({
  time: `Leçon ${n}`,
  title,
  beats: [{ say: `${title}. ${say}`, show: `Bandeau « LEÇON ${n} », compteur « ${n} / 32 ». ${show}` }],
});

const partCard = (label: string) => ({ show: `Carte de chapitre : « ${label} ».` });

// Vidéo B en montage sans visage : chaque partie est en voix seule, sauf celle
// qui précise mode « visage ».
const sansVisage = (sections: ScriptSection[]): ScriptSection[] =>
  sections.map((s) => ({ mode: "sans-visage", ...s }));

const SCRIPT_B: VideoScript = {
  slug: "analyse-1633-videos",
  label: "Vidéo B · 1 633 vidéos",
  status: "Prêt à tourner",
  updatedAt: "18 nov. 2026",
  title: "J'ai analysé 1 633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)",
  why: `Même format que « J'ai analysé 300 apps », ta vidéo qui a fait le plus de leads (49). Version du 18 nov. : de la pure valeur, grand public. Ce qui marche, ce qui floppe et ce qui fait la différence, montré avec de vraies vidéos qui ont percé et d'autres qui ont floppé, souvent sur le même compte d'app. Aucun élève, aucune preuve en dollars, rien qui ressemble à une page de vente.`,
  facts: [
    { label: "Durée", value: "21 à 23 min (3 540 mots de voix)" },
    { label: "Montage", value: "Sans visage, sauf une partie : l'intro en montage sur ta voix, puis toi face caméra 45 secondes, puis tout le reste en voix seule sur les vidéos à l'écran (direction C)" },
    { label: "Style", value: "Voix seule lue mot à mot. Seule la partie face caméra se dit en regardant l'objectif" },
    { label: "Format", value: "« J'ai analysé N X et j'ai appris ça » : 32 leçons en 7 parties, et pour la plupart une vidéo qui a percé face à une vidéo qui a floppé" },
    { label: "Matière", value: "1 633 vidéos qui montrent une app (GIGA BANQUE), plus la recherche des flops du 18 nov. : 14 comptes officiels d'apps sur TikTok (leurs 200 dernières vidéos) et 7 comptes Instagram, plus de 100 vidéos regardées image par image, 4 543 commentaires lus" },
    { label: "Chiffres", value: "Vues TikTok et Instagram relevées le 18/11 (le 12/11 ou début novembre pour les exemples de la banque)" },
    { label: "Captures", value: "Aucune capture de revenus" },
    { label: "UTM", value: "analyse-1633-videos" },
  ],
  altTitles: [
    {
      title: "J'ai analysé 1 633 vidéos qui font télécharger des apps et j'ai appris ça (32 leçons)",
      why: "Recommandé. Format prouvé (expérience condensée), qui a déjà marché sur ta chaîne avec « 300 apps ».",
    },
    {
      title: "Même app, même compte : 28,5 millions de vues contre 2 268. Voici ce qui fait la différence",
      why: "Plus intrigant, colle à la nouvelle version (percées contre flops), mais il perd le format « j'ai analysé N ».",
    },
    {
      title: "Ce qui marche et ce qui floppe dans les vidéos d'apps (1 633 vidéos analysées)",
      why: "Plus sobre, à garder pour un test A/B.",
    },
  ],
  thumbnail: {
    text: "63 M DE VUES",
    layout: `Bloc jaune en haut à gauche avec « 63 M DE VUES » en noir, très gros. En dessous, un iPhone tenu en main qui affiche une vidéo verticale d'app (un téléphone filmé par un autre téléphone sur un bureau) avec un compteur de vues « 63,4 M » et un badge « 0:10 ». Une flèche rouge du bloc vers le compteur. Toi à droite, en gros plan, l'air sincèrement étonné ou grand sourire. Bureau sombre flou. La miniature pose la question (comment une vidéo de 10 secondes fait 63 millions de vues pour une app), le titre y répond juste assez (j'en ai analysé 1 633).`,
    variant: "Variante B, qui colle à la nouvelle version : bloc jaune « MÊME APP », deux téléphones côte à côte, l'un affiche « 28,5 M », l'autre « 2 268 » en rouge. Toi à droite, l'air perplexe.",
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
    name: "Les 100 vidéos d'apps les plus vues, rangées par niche, à copier pour ton app",
    url: `https://www.jeremypitault.com/guide/100-contenus-a-copier?${UTM_B}`,
    note: "Idée de Jeremy (18 nov.) : pas un résumé de la vidéo, mais les 100 vidéos de la GIGA BANQUE qui ont fait le plus de vues (pas toute la banque), rangées par niche, avec pour chacune le lien, les vues, la phrase d'ouverture et ce qu'il faut copier. Page à créer avant de publier. Placée après la partie 2, rappelée dans le récap.",
  },
  plan: [
    "Le spectateur sait reconnaître une vidéo qui ressemble à une pub, et sait qu'elle floppe, chiffres à l'appui.",
    "Il sait ouvrir sur la personne qui regarde (sa fatigue, ses examens, son poids) au lieu d'ouvrir sur son app.",
    "Il sait où mettre son app : comme la solution de l'histoire ou comme le spectacle, sans se présenter, et il sait que les gens demandent le nom quand la vidéo les intéresse.",
    "Il sait filmer son app pour qu'elle se comprenne en une seconde.",
    "Il connaît sept formats concrets à refaire, avec un exemple pour chacun.",
    "Il a compris que la même vidéo peut faire 963 300 vues ou 5 400, et qu'un format se juge sur des dizaines de vidéos, pas sur une.",
    "Il repart avec les 100 vidéos d'apps les plus vues, rangées par niche, pour avoir tout de suite des formats à refaire.",
  ],
  sections: sansVisage([
    {
      time: "0:00",
      title: "Intro en montage : la promesse",
      beats: [
        {
          show: "Écran noir, puis deux fenêtres côte à côte sur le fond studio. À gauche, la vidéo Quizard dans l'amphi (« 3 years of studying and I just found this… BRUH »), son compteur monte jusqu'à 28,5 M. À droite, le fondateur face caméra (« I made a website called »), son compteur s'arrête à 2 268, en rouge.",
          say: `Ces deux vidéos ont été postées par la même app, sur le même compte. Celle de gauche a fait 28 millions et demi de vues, et celle de droite, 2 268.`,
        },
        {
          show: "Les deux fenêtres se ferment. Deux autres vidéos identiques s'ouvrent (Quizard, « the F students are inventors »), compteurs 963 300 et 5 400.",
          say: `Et ces deux-là sont exactement la même vidéo, republiée trois jours plus tard. L'une a fait 963 300 vues, l'autre 5 400.`,
        },
        {
          show: "Un mur de vraies vidéos de la banque se remplit, les vues affichées sur chacune. Un compteur passe de 12 500 à 1 633 pendant que les vidéos écartées s'éteignent, puis une colonne rouge « FLOPS » se remplit à côté.",
          say: `Je voulais comprendre ce qui fait qu'une vidéo d'app explose et qu'une autre ne décolle pas. Alors avec mon équipe, on a passé au crible environ 12 500 vidéos TikTok et Instagram, on a gardé les 1 633 qui mettent vraiment une app en avant, et on est allés chercher aussi celles qui ont floppé, sur les mêmes comptes.`,
        },
        {
          show: "« 32 LEÇONS » se construit au centre, avec deux colonnes : « CE QUI MARCHE » en vert, « CE QUI FLOPPE » en rouge.",
          say: `J'en ai tiré 32 leçons : ce qui marche, ce qui ne marche pas, et ce qui fait la différence entre les deux, avec à chaque fois de vraies vidéos.`,
        },
      ],
    },
    {
      time: "0:35",
      title: "Face caméra : qui je suis",
      mode: "visage",
      beats: [
        { show: "Coupe nette sur toi, face caméra, plan poitrine, regard dans l'objectif. Bandeau nom « Jeremy Pitault, créateur de Shinobi ». C'est la seule partie où on te voit." },
        {
          say: `Moi, c'est Jeremy. J'ai créé Shinobi, une app pour apprendre le japonais. Aujourd'hui, avec l'IA, créer une app est devenu facile. Le plus dur, c'est que des gens la découvrent, et la plupart des vidéos qu'on poste pour ça ne servent à rien.`,
        },
        {
          say: `Une précision honnête avant de commencer : de ces vidéos, on connaît les vues et les commentaires, pas les téléchargements. Une vidéo à des millions de vues ne fait pas forcément télécharger, et je te montrerai pourquoi.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou une idée d'app, et que tu ne sais pas quoi poster pour la faire connaître. Tu n'as pas besoin d'être créateur de contenu, ni de montrer ton visage. D'ailleurs, à partir de maintenant, tu ne me verras plus : la suite, c'est uniquement ce qui se passe à l'écran.`,
        },
      ],
    },
    {
      time: "1:15",
      title: "Le plan",
      beats: [
        {
          show: "Retour au studio. Terminal de chapitre : les 7 parties s'écrivent une par une, puis se rangent en sommaire dans un coin pour toute la vidéo.",
          say: `On va voir les 32 leçons en sept parties : ce qui floppe, ce qui marche à la place, où mettre ton app, comment la filmer, les formats à refaire, pourquoi la même vidéo peut marcher une fois et pas l'autre, et les détails qui font la différence.`,
        },
      ],
    },
    {
      time: "1:30",
      title: "Partie 1 : ce qui floppe, tout ce qui ressemble à une pub",
      beats: [
        partCard("PARTIE 1 · CE QUI FLOPPE"),
        { say: `Première partie, et on commence par ce qui ne marche pas, parce que c'est l'erreur que font presque tous ceux qui ont une app : faire de la pub au lieu de faire du contenu.` },
      ],
    },
    lesson(
      1,
      "Quand l'app parle d'elle-même, personne ne regarde",
      `Sur les comptes officiels qu'on a épluchés, on a regardé quinze vidéos qui ressemblent à une pub : une annonce, une nouveauté, un partenariat, l'app qui se présente. Treize sur quinze font moins que ce que fait habituellement le compte, et aucune n'approche une vidéo qui a percé. Yuka, l'app qui scanne ce que tu manges, a fait 2 millions de vues avec un carrousel sur les dangers de l'aspartame. Sur le même compte, « Yuka arrive dans huit nouveaux pays » a fait 8 282 vues. Tiimo, une app de planning, a présenté ses fondatrices et sa mission : 2 485 vues. Une utilisatrice qui raconte comment elle a découvert l'app après son diagnostic d'autisme : 808 000.`,
      `Écran partagé : le carrousel Yuka « The Dangers of Aspartame » (2 M) face à « Yuka launches in 8 new places » (8 282). Puis Tiimo « Meet our founders » (2 485) face au témoignage « Since getting my autism diagnosis… » (808 000). Le tableau des 15 vidéos « pub » défile, 13 lignes passent en rouge.`
    ),
    lesson(
      2,
      "Le fondateur qui présente son app ne fait presque pas de vues",
      `JotBot, une app d'écriture, a posté trois vidéos la même semaine. Dans la première, pas de visage, pas de voix : un cours YouTube d'une heure trente-huit, « je n'ai pas une heure trente-huit », on colle le lien, et les notes sortent. 47,7 millions de vues. Dans les deux autres, le fondateur présente son app face caméra : 2 655 et 1 578 vues. Et chez Quizard, on l'a vu au début : 2 268. La vidéo qui perce montre ce que l'app fait pour toi, celles qui floppent expliquent ce qu'elle est.`,
      `JotBot « i don't have 1hr and 38 minutes 😭 » (Instagram, 47,7 M) face au fondateur « I was cooking up something special » (2 655) et « hey my name is Derrick » (1 578). Rappel en petit du fondateur Quizard (2 268).`
    ),
    lesson(
      3,
      "La pub léchée et la visite des fonctionnalités floppent aussi",
      `SideMe, une app pour apprendre à coder, a payé une belle pub en 3D : un manchot qui fait du snowboard, un slogan, « Code anywhere. Anytime. », et le bouton de l'App Store à la fin. 15 700 vues. Dix jours plus tard, le même compte poste un simple enregistrement de l'écran, un exercice de code, sans voix ni visage : 9,8 millions de vues. Et ce n'est pas réservé aux grosses apps. BeThere, une petite app slovène, a fait 321 vues avec une visite guidée de ses fonctions, et 63 100 avec un sketch sur les pubs à la télé où son app arrive comme la chute.`,
      `SideMe manchot 3D (15 700) face à l'exercice « 30 Days to learn Python » (9,8 M). Puis BeThere « Snap it. Post it. » (321) face au sketch de la télé de 2035 (63 100).`
    ),
    lesson(
      4,
      "Une voix de télé-achat ou un code promo font fuir",
      `« Est-ce que c'est bizarre d'être jaloux d'un calendrier ? La magie, c'est la nouvelle fonction routines. » « Voilà le meilleur cadeau que j'ai jamais reçu en tant que papa. » « Laisse-moi te montrer les avantages du compte premium. » Trois vidéos de comptes officiels qui parlent comme une pub télé, et les trois font moins que ce que fait habituellement leur compte. Hearth, un écran familial, a fait 30 millions de vues avec dix secondes sans un mot. Sur le même compte, une créatrice qui parle une minute et demie et finit par « utilise mon code pour avoir 20 % de réduction » : 1 274 vues. Personne ne parle comme ça à ses amis.`,
      `Skylight « routines feature » (30 000), Skylight « best gift I've ever received as a dad » (39 100), Yuka premium (4 976), une phrase de chaque en sous-titre. Puis Hearth « Out with the OLD » (Instagram, 29,9 M) face au code promo « Kellie20 » (1 274).`
    ),
    lesson(
      5,
      "Des millions de vues et presque pas de likes, c'est une pub payée : ne la copie pas",
      `Skylight, un calendrier familial, a une vidéo à 5 millions de vues et seulement 2 849 likes. Sur les vidéos qui percent vraiment, on voit plutôt entre 3 et 14 likes pour 100 vues. Là, on est à moins d'un like pour 1 000 vues : ces vues ont presque sûrement été achetées. Avant de copier une vidéo parce qu'elle a des millions de vues, regarde ses likes.`,
      `Skylight (5 M de vues, 2 849 likes) face à Jurney (5,2 M, 555 700 likes). Une jauge « likes pour 100 vues » : 0,06 contre 10,7.`
    ),
    {
      time: "4:45",
      title: "Partie 2 : ce qui marche, commencer par celui qui regarde",
      beats: [
        partCard("PARTIE 2 · CE QUI MARCHE"),
        { say: `Deuxième partie : ce qui marche à la place. Les vidéos qui explosent ne commencent pas par l'app, elles commencent par la personne qui regarde.` },
      ],
    },
    lesson(
      6,
      "La première phrase parle de celui qui regarde, pas de toi",
      `Turbo AI, une app de prise de notes, a posté le même jour deux vidéos de deux créatrices, avec la même légende et la même fin. La première commence par « si tu passes cette vidéo, tu rates tes examens » : 6,8 millions de vues. La deuxième commence par « l'anglais, c'est trop dur », la créatrice parle d'elle : 6 725 vues. Sur 25 vidéos qui ont vraiment percé, 15 ouvrent sur un problème, une envie ou une peur du spectateur.`,
      `Turbo AI « if you skip this video you're FAILING your finals » (6,8 M) face à « English is so hard vro » (6 725). La légende et la carte de fin identiques entourées sur les deux.`
    ),
    lesson(
      7,
      "Les mêmes fonctions, seule l'ouverture change : 333 800 vues contre 1 310",
      `Soundscape, une app de sommeil et de concentration, a posté à deux jours d'écart deux vidéos qui listent presque les mêmes fonctions : lancer une session, bloquer les applis qui distraient, mieux dormir. La première ouvre sur « moi quand je dors chaque nuit », un garçon qui bâille : 333 800 vues. La deuxième ouvre sur « ce mec est un génie », un ordinateur : 1 310 vues. L'une parle de ta fatigue, l'autre d'un inconnu.`,
      `Soundscape « Me when sleeping every night: » (333 800) face à « Bro is a GENIUS » (1 310), la suite des deux en parallèle pour montrer qu'elle est la même.`
    ),
    lesson(
      8,
      "Un seul mot peut tout changer",
      `Une app de perte de poids explique avec des chats comment maigrir. « La façon paresseuse de perdre du poids » : 5,2 millions de vues. Treize jours plus tard, les mêmes chats, le même son, les mêmes étapes, mais « la façon la plus facile de perdre du poids » : 11 800 vues. « Paresseuse » parle de toi, « facile » ne parle de personne. Le commentaire le plus liké : « donc depuis tout ce temps, c'était parce que je saute le petit-déjeuner ». Le spectateur se reconnaît. Pour être honnête, la deuxième était aussi une copie de la première, et ça joue sûrement.`,
      `Jurney « THE LAZY » (5,2 M) face à « THE » easiest (11 800), le mot « LAZY » en rouge, puis le commentaire « So all this time it was because I skip breakfast? » (25 945 likes).`
    ),
    lesson(
      9,
      "« Pourquoi je découvre ça seulement maintenant » : la phrase la plus copiée",
      `On la trouve dans une trentaine de vidéos de la banque, dans des niches qui n'ont rien à voir entre elles. « Trois ans d'études et je découvre ça seulement maintenant » : 66 millions de vues sur Instagram, 28,5 millions sur TikTok. « Quatre ans de salle et je découvre ça » : 15 millions. Elle dit au spectateur qu'il est en train de rater quelque chose, et juste derrière, on lui montre ce qu'il rate.`,
      `Unstuck AI (Instagram, 66,1 M), Quizard (TikTok, 28,5 M), Stronger (15,3 M), les trois premières images côte à côte.`
    ),
    lesson(
      10,
      "Quand c'est quelqu'un d'autre qui te montre l'app, ce n'est plus une pub",
      `Une créatrice de StudyFetch a posté deux vidéos le même jour. Dans la première, « ma sœur vient de me montrer ce qu'elle utilise pour réviser », une seconde d'étonnement, puis un jeu qui transforme les cours en partie de jeu vidéo : 11,9 millions de vues. Dans la deuxième, elle explique face caméra toutes les fonctions de l'app, et le même jeu n'arrive qu'à la fin : 5 316 vues. « Ma mère m'a montré à quel point la fac peut être facile » a aussi fait 26 millions de vues pour Coconote. Ta vidéo devient du bouche-à-oreille.`,
      `StudyFetch « my sister just showed me what she uses to study 😭😭😭 » (Instagram, 11,9 M) face à « Level up your SELF Study with this hack » (5 316), même jour. Puis Coconote « my mom showed me how easy college can be » (Instagram, 26 M).`
    ),
    {
      time: "8:30",
      title: "Le cadeau",
      beats: [
        {
          say: `Petite pause. Si tu veux des vidéos à refaire pour ton app, j'ai sorti de notre banque les 100 vidéos d'apps qui ont fait le plus de vues, rangées par niche, avec pour chacune ce qu'il faut copier. C'est gratuit, et le lien est en premier dans la description.`,
          show: `Texte à l'écran : « Les 100 vidéos d'apps les plus vues, à copier · lien en description », sur une grille de vignettes qui défile, 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "8:45",
      title: "Partie 3 : où mettre ton app",
      beats: [
        partCard("PARTIE 3 · OÙ METTRE TON APP"),
        { say: `Troisième partie : où mettre ton app. Jamais au début avec une présentation, mais au moment où le spectateur attend une solution, ou comme le spectacle lui-même.` },
      ],
    },
    lesson(
      11,
      "Ton app peut être le spectacle : on la regarde faire, sans un mot",
      `Sur les 25 vidéos qui ont vraiment percé, dix n'ouvrent pas sur un problème : elles montrent l'app en train de faire quelque chose qu'on a envie de voir. Un exercice de code où l'on glisse les bonnes pièces : 9,8 millions de vues, sans voix ni visage. Un garçon qui fait des pompes pour battre un monstre dans un jeu : 4,2 millions. Même une annonce de lancement peut marcher quand l'app est belle à regarder : Mello, une app créée par des étudiants, a fait 981 100 vues en montrant simplement ses cartes de profil se personnaliser. Ce qui compte, c'est ce qu'on voit à l'écran, pas ce qu'on en dit.`,
      `SideMe « 30 Days to learn Python » (9,8 M), puis Push Up Arena « Skill vs spam… » (4,2 M), puis Mello « We Built… Are You Ready? » (981 100).`
    ),
    lesson(
      12,
      "Si tu ne dis pas le nom, les gens le demandent",
      `On a lu plus de 4 500 commentaires sous seize vidéos qui ont percé. Quand le nom de l'app n'apparaît nulle part, entre 5 et 17 % des commentaires le demandent : « c'est quelle app ? », « le lien, s'il te plaît ». Un seul de ces commentaires a fait 5 475 likes. Quand le nom est écrit à l'écran, les gens ne demandent plus rien, ils taguent un ami : 46 % des commentaires chez Coconote. Tu n'as pas besoin de crier le nom de ton app : si la vidéo intéresse, les gens vont le chercher ou l'envoyer à quelqu'un. Et si personne ne fait ni l'un ni l'autre, c'est que la vidéo n'a pas intéressé.`,
      `Les commentaires qui défilent : « Welche App ist das? » (5 475 likes), « Link please », « What is the name of the application? », « App name ». Puis le tableau : Hearth 17 %, Push Up Arena 15,9 %, SideMe 8,1 %, Quizard 4,7 % quand le nom est caché, contre 0 à 1,4 % quand il est donné. Puis les tags d'amis sous Coconote (46 %).`
    ),
    lesson(
      13,
      "Tu peux expliquer et même dire « télécharge », mais seulement après l'histoire",
      `« Comment je couche mes enfants en quinze minutes » a fait 13,3 millions de vues, et la vidéo finit par « télécharge l'app Moshi, le lien est dans mon profil ». Chez Turbo AI, les vidéos qui ont percé et celles qui ont floppé avaient exactement la même carte de fin avec le bouton de l'App Store. Ce qui floppe, ce n'est pas l'appel à l'action, c'est une vidéo qui n'est que ça.`,
      `Moshi « How I get my kids to bed in 15 minutes or less! » (13,3 M), sa dernière phrase en sous-titre. Puis les cartes de fin Turbo AI identiques sous 6,8 M et sous 6 725.`
    ),
    lesson(
      14,
      "Sans l'app dans l'histoire, des millions de vues pour rien",
      `Une app de Pilates a fait 9,4 millions de vues avec cinq secondes de ventre plat et le mot « Pilates ». L'app n'apparaît pas, et sur 203 commentaires lus, pas un seul ne la demande. Une autre a fait 11,8 millions avec une fille filmée du cou aux pieds, l'app seulement dans la légende. Des vues comme ça font plaisir, mais elles ne font pas forcément télécharger. 5 000 vues qui font télécharger valent plus qu'un million qui ne fait rien.`,
      `Forméa « Pilates >>> » (9,4 M), compteur « 0 / 203 commentaires demandent l'app ». Puis Tone AI (11,8 M), la légende entourée.`
    ),
    {
      time: "11:30",
      title: "Partie 4 : comment filmer ton app",
      beats: [
        partCard("PARTIE 4 · COMMENT FILMER"),
        { say: `Quatrième partie : comment filmer ton app pour qu'elle se comprenne en une seconde.` },
      ],
    },
    lesson(
      15,
      "Filme ton téléphone avec un deuxième téléphone, la main dans le cadre",
      `Sur les 24 plus grosses vidéos qu'on a regardées image par image, 16 filment l'app sur un vrai téléphone posé sur un bureau ou tenu en main, avec un doigt qui tape dessus. Une seule est un pur enregistrement d'écran. Soundscape a fait 40,8 millions de vues en 20 secondes avec un iPhone posé sur un bureau en bois et une main qui lance l'app. On a l'impression que quelqu'un te montre un truc, pas qu'on te vend quelque chose.`,
      `Soundscape (@soundscape.study, 40,8 M).`
    ),
    lesson(
      16,
      "Tu n'as pas besoin de montrer ton visage",
      `14 des 24 grosses vidéos ne montrent jamais le visage de la personne qui filme, dont la plus vue de toute la banque : 66 millions de vues, un ordinateur sur les genoux dans un amphi. Si te montrer te bloque, ce n'est plus une excuse.`,
      `Unstuck AI (@quizard.ai, Instagram, 66,1 M).`
    ),
    lesson(
      17,
      "L'action doit se lire en une seconde",
      `Même compte, presque la même phrase, « la fac, ce n'est plus vraiment la fac ». Dans la vidéo à 29,5 millions de vues, un étudiant affalé, et son téléphone qui enregistre le cours, en gros plan. Dans celle à 2 702 vues, l'amphi filmé de loin, puis un quiz sur un ordinateur qu'on a du mal à lire. Dans 16 des 24 grosses vidéos, l'app est à l'écran dès la deuxième ou troisième seconde, et on comprend tout de suite ce qu'elle fait.`,
      `Quizard « college literally isn't real anymore » (29,5 M) face à « college literally isn't real life » (2 702), le téléphone entouré dans la première.`
    ),
    lesson(
      18,
      "Fais court, et écris ta première phrase en gros, lisible en entier",
      `La durée médiane des vidéos vérifiées est de 18 secondes, et 21 des 24 grosses vidéos ont une phrase écrite dès la première image. Tallow, une app qui scanne les ingrédients, a parlé deux jours de suite du cacao de laboratoire. Le premier jour, la phrase est écrite en gros : « des marques de chocolat commencent à utiliser du cacao de labo », puis six marques que tout le monde mange : 1,7 million de vues. Le lendemain, un bandeau à moitié caché par la tête de la présentatrice, et deux marques seulement : 16 000 vues.`,
      `Tallow « Chocolate brands starting to use lab grown cocoa » (1,7 M) face à « CADBURY » au bandeau caché (16 000), la première image de chaque en grand.`
    ),
    {
      time: "14:00",
      title: "Partie 5 : les formats qui marchent",
      beats: [
        partCard("PARTIE 5 · LES FORMATS"),
        { say: `Cinquième partie : sept formats qui montrent ton app sans qu'elle ait l'air d'une pub, et que tu peux refaire tels quels.` },
      ],
    },
    lesson(
      19,
      "« Je mets ça dedans, regarde ce qui sort »",
      `On voit l'entrée, un cours, une photo, un lien, on la donne à l'app, et le résultat apparaît. Pas besoin d'expliquer, la transformation se comprend toute seule. Environ 150 vidéos de la banque suivent ce schéma. Un cours qu'on dépose et qui devient des fiches et un quiz : 4,7 millions de vues.`,
      `@studywithtay2 (4,7 M).`
    ),
    lesson(
      20,
      "Deux moitiés, un scan, pas un mot",
      `Deux assiettes avec le même nombre de calories, des mains gantées qui les remplissent, un téléphone qui scanne, et la note s'affiche. Ni voix, ni visage. CalScan a fait 18 millions et 16,5 millions de vues avec ce format. Le spectateur joue avec toi : il choisit son assiette avant de voir le résultat.`,
      `CalScan « 580kcal │ 580kcal » (18 M) puis « 800kcal » (16,5 M).`
    ),
    lesson(
      21,
      "La comparaison : le spectateur se cherche dans l'image",
      `Le même thé glacé vendu aux États-Unis et en Europe, avec la liste des additifs de chaque côté : 892 500 vues pour Yuka. Trois étudiantes, trois façons de réviser, trois notes, A, B et C : 17 millions de vues, et 40 % des commentaires donnent leur propre note. L'app, c'est toujours le bon côté de la comparaison.`,
      `Yuka « United States │ Europe » (892 500), puis Oreate AI « 95% Student (A+) / 80% Student (B+) / 60% Student (C+) » (Instagram, 17,1 M) et ses commentaires « I am C+😢 ».`
    ),
    lesson(
      22,
      "La liste des « 3 apps à avoir », avec la tienne au milieu",
      `Les gens enregistrent ce genre de vidéo pour plus tard, et ton app profite des apps connues autour d'elle. « Top 3 des meilleures IA pour tes études » a fait 1,6 million de vues en français. C'est une recommandation, pas une pub.`,
      `Être Étudiant (@etreetudiant, 1,6 M).`
    ),
    lesson(
      23,
      "Le carrousel, sans visage et sans montage",
      `Des photos et des captures qu'on fait défiler : c'est le format le plus simple à produire, et la banque en contient plus de 80. Le carrousel de Yuka sur l'aspartame a fait 2 millions de vues. L'app arrive sur une image du milieu, comme la réponse à la question posée sur la première.`,
      `Carrousel Yuka (@yuka_app, 2 M), on fait défiler les images.`
    ),
    lesson(
      24,
      "Une mascotte ou un jeu qu'on a envie de suivre",
      `L'oiseau de Finch : 63 et 33 millions de vues. Des chats qui expliquent comment perdre du poids : 5,2 millions. Un garçon qui bat un monstre à coups de pompes : 3,4 millions. Un personnage ou un jeu donne un visage à ton app sans montrer le tien, et on a envie de voir la suite.`,
      `Finch (33,2 M), Jurney (5,2 M), Push Up Arena « what is this app bro » (3,4 M).`
    ),
    lesson(
      25,
      "Raconte une info qui concerne tout le monde, et finis par l'app",
      `Tallow a fait 2,9 millions de vues avec une vidéo façon journal télévisé sur les œufs de Dunkin', et 1,7 million avec le cacao de labo. On ne parle pas de l'app pendant 40 secondes, on parle de ce que les gens mangent, et l'app arrive à la fin comme le moyen de vérifier. Les commentaires parlent des marques, pas de l'app, et c'est bon signe : la vidéo a intéressé.`,
      `Tallow « DUNKIN » (2,9 M), puis le commentaire « why is it so expensive if it's fake » (41 767 likes).`
    ),
    {
      time: "17:00",
      title: "Partie 6 : la même vidéo, des résultats opposés",
      beats: [
        partCard("PARTIE 6 · LA MÊME VIDÉO"),
        { say: `Sixième partie, et c'est celle qui m'a le plus surpris : la même vidéo peut exploser une fois et faire un flop la fois suivante.` },
      ],
    },
    lesson(
      26,
      "La même vidéo, republiée trois jours plus tard : 963 300 vues, puis 5 400",
      `Quizard a posté une vidéo, un étudiant au fond de la classe, l'IA qui répond au quiz sur son ordinateur. 963 300 vues. Trois jours plus tard, le compte a republié exactement la même, même film, même son, même texte, seul l'émoji change : 5 400 vues, 178 fois moins. Sur Instagram, même histoire : le même script sur un post-it a fait 23,3 millions de vues, puis 40 500 quatre jours plus tard. Le contenu ne garantit rien, et republier la même vidéo ne marche pas.`,
      `Les deux Quizard « the F students are inventors » côte à côte, en même temps, puis le zoom sur l'émoji 🥀 contre 💔. Puis les deux post-it Instagram (23,3 M et 40,5 K).`
    ),
    lesson(
      27,
      "Le même format, six jours plus tard : 18 millions, puis 36 700",
      `CalScan a refait sa vidéo des deux assiettes six jours après celle à 18 millions de vues, avec d'autres plats : 36 700 vues. Et sept mois plus tard, le même format faisait 560 vues, parce que tout le compte s'était essoufflé. Une vidéo qui a marché te dit quoi refaire, pas combien elle fera.`,
      `CalScan 580kcal (18 M), 340kcal (36 700), 1000Kcal (560), en ligne, avec la courbe des vues du compte qui s'effondre.`
    ),
    lesson(
      28,
      "Le même script, chez trois créateurs : de 1 701 à 428 500 vues",
      `Une app d'investissement a donné le même texte à plusieurs créateurs : même phrase, même son, même durée. Une version a fait 428 500 vues, une autre 165 600, une autre 1 701. Le contenu n'explique pas tout.`,
      `Les 3 vidéos Bloom côte à côte avec leurs vues (428 500, 165 600, 1 701).`
    ),
    lesson(
      29,
      "Garde le format, change l'histoire",
      `Puisque republier ne marche pas, les comptes qui percent gardent le même format et changent ce qu'ils racontent. Tallow garde son journal télévisé et change d'aliment à chaque fois : les œufs, le chocolat, le fast-food. Les chats de l'app de perte de poids gardent leur style, mais chaque vidéo parle d'autre chose. Un autre sujet, un autre premier plan, d'autres images au milieu : c'est une nouvelle vidéo, dans un format qui a déjà marché.`,
      `Grille de 6 vidéos Tallow au même format, sujets différents, avec leurs vues.`
    ),
    lesson(
      30,
      "Un format se juge sur des dizaines de vidéos, pas sur une",
      `Quizard a posté au moins 25 vidéos avec la même légende, de 2 683 à 29,5 millions de vues. Le créateur d'Eclipta, une app de concentration, a fait entre 100 et 500 vues par vidéo pendant trois mois, avant d'en faire 13 millions en mai. Les comptes qui percent ne trouvent pas la vidéo parfaite, ils postent le même format des dizaines de fois. Poste un format au moins dix fois avant de le juger.`,
      `Grille des 25 vidéos Quizard « bruh » avec leurs vues, la 29,5 M qui s'allume. Puis la grille d'Eclipta : trois mois de vignettes entre 100 et 500 vues, et la 13 M.`
    ),
    {
      time: "20:00",
      title: "Partie 7 : les détails",
      beats: [
        partCard("PARTIE 7 · LES DÉTAILS"),
        { say: `Dernière partie : deux détails qui font la différence entre une copie qui marche et une copie qui ne marche pas.` },
      ],
    },
    lesson(
      31,
      "Le son fait partie du format",
      `Push Up Arena a posté deux fois la même partie, le même garçon, le même monstre, à trois jours d'écart. Avec un extrait d'anime en fond : 1,7 million de vues. Avec la voix du garçon à la place : 8 079. Et deux apps de musculation concurrentes ont explosé avec le même son, 15 millions et 4 millions de vues. Quand tu copies un format, garde le son.`,
      `Push Up Arena « POV you play Solo Leveling IRL » (1,7 M) face à « Bro what is ts » (8 079), puis Stronger (15,3 M) et Lyfta (4,2 M), même son.`
    ),
    lesson(
      32,
      "Le français a de la place, mais les plus gros chiffres sont en anglais",
      `Aucune des 18 vidéos les plus vues de la banque n'est en français. La plus vue en français fait quand même 7,2 millions de vues, pour une app de révision. Commence dans ta langue si tu veux, mais ouvre aussi un compte en anglais : c'est là que l'audience est la plus grande.`,
      `Nomad Education (@priel.study, 7,2 M).`
    ),
    {
      time: "21:00",
      title: "Récap et fin",
      beats: [
        {
          say: `Si tu ne retiens que cinq choses : ne fais pas de pub, commence par la personne qui regarde, montre ton app au moment où elle attend une solution sans te présenter, filme-la pour qu'on la comprenne en une seconde, et poste chaque format des dizaines de fois en changeant d'histoire. Et pour trouver ton premier format, les 100 vidéos d'apps les plus vues, rangées par niche, sont en lien dans la description.`,
          show: `Les 5 points à l'écran, un par un.`,
        },
        {
          say: `Et le meilleur signe qu'une vidéo marche, ce n'est pas son nombre de vues, c'est quand les gens te demandent en commentaire comment s'appelle ton app.`,
        },
        {
          say: `Si tu as une app et que tu veux qu'on t'aide à trouver les vidéos qui la font télécharger, tu peux réserver un appel avec mon équipe, le lien est dans la description.`,
        },
        {
          say: `Dis-moi en commentaire laquelle de ces 32 leçons tu vas tester en premier. Et si la vidéo t'a servi, abonne-toi pour la suite.`,
        },
      ],
    },
  ]),
  description: `🎁 GRATUIT : les 100 vidéos d'apps qui ont fait le plus de vues, rangées par niche, à copier pour ton app : https://www.jeremypitault.com/guide/100-contenus-a-copier?${UTM_B}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_B}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_B}

On a passé au crible environ 12 500 vidéos TikTok et Instagram pour en garder 1 633 qui montrent une app, puis on est allés chercher celles qui ont floppé sur les mêmes comptes. Résultat : 32 leçons sur ce qui marche, ce qui floppe et ce qui fait la différence. Pourquoi tout ce qui ressemble à une pub floppe, comment ouvrir sur la personne qui regarde, où mettre ton app, comment la filmer, les formats à refaire, et pourquoi la même vidéo peut faire 963 300 vues puis 5 400.

👉 Dis-moi en commentaire laquelle de ces 32 leçons tu vas tester en premier.

0:00 Introduction
1:30 Ce qui floppe
4:45 Ce qui marche
8:45 Où mettre ton app
11:30 Comment filmer ton app
14:00 Les formats qui marchent
17:00 La même vidéo, des résultats opposés
20:00 Les détails
21:00 Ce qu'il faut retenir

#applicationmobile #marketingapp #tiktokmarketing #créeruneapp #appmobile #contenuorganique #entrepreneur`,
  shorts: [
    "« La même vidéo : 963 300 vues, puis 5 400 » (leçon 26, 30 s).",
    "« Même app, même compte : 28,5 millions contre 2 268 » (leçon 2, 35 s).",
    "« Un seul mot, 440 fois plus de vues » (leçon 8, 30 s).",
    "« Le fondateur présente son app : 2 655 vues. Sans visage : 47,7 millions » (leçon 2, 30 s).",
  ],
  prepare: [
    "Tournage, partie face caméra : la caméra ne sert que pour « Face caméra : qui je suis ». Fais-la 2 ou 3 fois en entier, en 4K, mise au point et exposition verrouillées.",
    "Tournage, tout le reste : ta voix seule au micro, à 20 ou 30 cm, en lisant le script. Un fichier par partie, dis le nom de la partie au début et laisse 10 secondes de silence. Si tu te trompes, tais-toi 2 secondes et reprends la phrase depuis son début.",
    "Rushs dans ~/Movies/Rushs/2026-11-1633-videos/ (hors iCloud), fichiers d'origine.",
    "Vidéos des exemples : déjà téléchargées dans broll/ (percées de la banque), flops/ (comptes TikTok, une planche par compte) et flops-insta/ (Instagram et pubs). Rapports : ~/Projects/reports/2026-11-18-flops/.",
    "Avant de publier : créer le cadeau /guide/100-contenus-a-copier (les 100 vidéos les plus vues de la GIGA BANQUE, par niche), avec son email de livraison.",
    "Aucun élève ni app d'élève, nulle part dans la vidéo : c'est une vidéo grand public.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs", state: "OK" },
    { point: "Grand public : aucun élève cité, rien qui ressemble à une page de vente", state: "OK (18 nov.)" },
    { point: "Ce qui marche ET ce qui floppe, avec de vraies vidéos", state: "OK (paires percée/flop sur les mêmes comptes)" },
    { point: "Demande prouvée et format déjà gagnant sur ta chaîne", state: "OK (Superwall 138 k, Jason Lee 172 k, ta vidéo « 300 apps »)" },
    { point: "Chiffres vérifiés à la source", state: "OK (TikTok relus le 18/11)" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "RDV en 1 phrase, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "À créer (les 100 vidéos à copier)" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

// B en premier : c'est la prochaine à tourner, la page s'ouvre dessus.
export const SCRIPTS: VideoScript[] = [SCRIPT_B, SCRIPT_A];
