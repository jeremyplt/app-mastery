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
// Instagram, plus de 100 vidéos regardées image par image, plus de 4 500 commentaires lus) :
// ~/Projects/reports/2026-11-18-flops/ (tiktok.md, instagram-et-pubs.md). Vidéo grand public : aucun élève cité.
const UTM_B = "utm_source=youtube&utm_medium=video&utm_campaign=analyse-1633-videos";

// Chaque leçon finit par sa morale : lue en dernier, et posée à l'écran au montage.
const lesson = (n: number, title: string, say: string, moral: string, show: string, links: [string, string][]) => ({
  time: `Leçon ${n}`,
  title,
  links: links.map(([label, url]) => ({ label, url })),
  beats: [
    { say: `Leçon numéro ${n} : ${title.charAt(0).toLowerCase()}${title.slice(1)}. ${say}`, show: `Bandeau « LEÇON ${n} », compteur « ${n} / 32 ». ${show}` },
    { say: moral, show: "Carte « À retenir » avec cette phrase, le temps de la dire." },
  ],
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
    { label: "Durée", value: "31 à 34 min de voix (environ 5 400 mots, sans compter les phrases en anglais entre parenthèses). Les 32 leçons restent, la durée n'est pas un souci (Jeremy, 18 nov.)" },
    { label: "Montage", value: "Sans visage, sauf deux moments face caméra : « qui je suis » juste après l'intro (45 secondes) et l'annonce du cadeau. Tout le reste en voix seule sur les vidéos à l'écran (direction C)" },
    { label: "Style", value: "Voix seule lue mot à mot. Seules les deux parties face caméra se disent en regardant l'objectif" },
    { label: "Format", value: "« J'ai analysé N X et j'ai appris ça » : 32 leçons en 7 parties, et pour la plupart une vidéo qui a percé face à une vidéo qui a floppé" },
    { label: "Matière", value: "1 633 vidéos qui montrent une app (GIGA BANQUE), plus la recherche des flops du 18 nov. : 14 comptes officiels d'apps sur TikTok (leurs 200 dernières vidéos) et 7 comptes Instagram, plus de 100 vidéos regardées image par image, plus de 4 500 commentaires lus" },
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
    name: "Le PDF des 100 contenus viraux à copier, qui peuvent marcher pour n'importe quelle app",
    url: `https://www.jeremypitault.com/guide/100-contenus-a-copier?${UTM_B}`,
    note: "Idée de Jeremy (18 nov.) : pas un résumé de la vidéo, mais un PDF de 100 contenus viraux à copier tout de suite, choisis pour pouvoir marcher avec n'importe quelle app. Ils viennent de la GIGA BANQUE (les plus vus, pas toute la banque), mais la vidéo ne parle pas de la banque. Pour chacun : le lien, les vues, la phrase d'ouverture et ce qu'il faut copier. Page à créer avant de publier. Annoncé face caméra après la partie 2, rappelé dans le récap.",
  },
  plan: [
    "Le spectateur sait reconnaître une vidéo qui ressemble à une pub, et sait qu'elle floppe, chiffres à l'appui.",
    "Il sait ouvrir sur la personne qui regarde (sa fatigue, ses examens, son poids) au lieu d'ouvrir sur son app.",
    "Il sait où mettre son app : comme la solution de l'histoire ou comme le spectacle, sans se présenter, et il sait que les gens demandent le nom quand la vidéo les intéresse.",
    "Il sait filmer son app pour qu'elle se comprenne en une seconde.",
    "Il connaît sept formats concrets à refaire, avec un exemple pour chacun.",
    "Il a compris que la même vidéo peut faire 963 300 vues ou 5 400, et qu'un format se juge sur des dizaines de vidéos, pas sur une.",
    "Il repart avec un PDF de 100 contenus viraux à copier, pour avoir tout de suite des formats à refaire.",
  ],
  sections: sansVisage([
    {
      time: "0:00",
      title: "Intro en montage : la promesse",
      links: [
        { label: "Quizard, l'amphi (28,5 M)", url: "https://www.tiktok.com/@quizard.ai/video/7411341221949426974" },
        { label: "Quizard, le créateur qui explique son app (2 268)", url: "https://www.tiktok.com/@quizard.ai/video/7392362266370379039" },
        { label: "Quizard, « the F students are inventors » (963 300)", url: "https://www.tiktok.com/@quizard.ai/video/7502540387144289567" },
        { label: "Quizard, la même vidéo 3 jours après (5 400)", url: "https://www.tiktok.com/@quizard.ai/video/7503593343650254111" },
      ],
      beats: [
        {
          show: "Écran noir, puis deux fenêtres côte à côte sur le fond studio. À gauche, la vidéo Quizard dans l'amphi (« 3 years of studying and I just found this… BRUH »), son compteur monte jusqu'à 28,5 M. À droite, le fondateur face caméra (« I made a website called »), son compteur s'arrête à 2 268, en rouge.",
          say: `Ces deux vidéos ont été postées par la même app, Quizard, sur le même compte. Celle de gauche a fait 28 millions et demi de vues, et celle de droite, 2 268.`,
        },
        {
          show: "Les deux fenêtres se ferment. Deux autres vidéos identiques s'ouvrent (Quizard, « the F students are inventors »), compteurs 963 300 et 5 400.",
          say: `Et ces deux-là sont exactement la même vidéo, republiée trois jours plus tard. L'une a fait 963 300 vues, l'autre 5 400.`,
        },
        {
          show: "Un mur de vraies vidéos de la banque se remplit, les vues affichées sur chacune. Un compteur passe de 12 500 à 1 633 pendant que les vidéos écartées s'éteignent, puis une colonne rouge « FLOPS » se remplit à côté.",
          say: `Je voulais comprendre ce qui fait qu'une vidéo d'app explose et qu'une autre ne décolle pas. Alors avec mon équipe, on a passé au crible environ 12 500 vidéos TikTok et Instagram, on a gardé les 1 633 qui mettent vraiment une app en avant. Puis on est allés sur les comptes de ces apps pour trouver aussi les vidéos qui ont floppé.`,
        },
        {
          show: "« 32 LEÇONS » se construit au centre, avec deux colonnes : « CE QUI MARCHE » en vert, « CE QUI FLOPPE » en rouge.",
          say: `J'en ai tiré 32 leçons : ce qui marche, ce qui ne marche pas, et ce qui fait la différence entre les deux, avec à chaque fois de vraies vidéos.`,
        },
        {
          show: "Les mots « UGC » et « PUB » s'effacent l'un après l'autre, il ne reste au centre que « LE CONTENU ».",
          say: `Avec elles, tu vas voir comment rendre une vidéo organique virale, pour attirer des utilisateurs gratuitement. Je ne vais parler ni d'UGC ni de publicité : on va se concentrer sur l'essence de la viralité, le contenu lui-même.`,
        },
      ],
    },
    {
      time: "0:45",
      title: "Face caméra : qui je suis",
      mode: "visage",
      beats: [
        { show: "Coupe nette sur toi, face caméra, plan poitrine, regard dans l'objectif. Bandeau nom « Jeremy Pitault, créateur de Shinobi ». C'est la seule partie où on te voit." },
        {
          say: `Moi, c'est Jeremy. J'ai créé Shinobi, une app pour apprendre le japonais. Aujourd'hui, avec l'IA, créer une app est devenu facile. Le plus dur, c'est de la faire découvrir.`,
        },
        {
          say: `Une précision honnête avant de commencer : de ces vidéos, on connaît les vues et les commentaires, pas les téléchargements. Une vidéo à des millions de vues ne fait pas forcément télécharger, et je te montrerai pourquoi.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou une idée d'app, et que tu ne sais pas quoi poster pour la faire connaître. Tu n'as pas besoin d'être créateur de contenu, ni de montrer ton visage.`,
        },
      ],
    },
    {
      time: "1:20",
      title: "Le plan",
      beats: [
        {
          show: "Retour au studio. Terminal de chapitre : les 7 parties s'écrivent une par une, puis se rangent en sommaire dans un coin pour toute la vidéo.",
          say: `On va voir les 32 leçons en sept parties : ce qui floppe, ce qui marche à la place, où mettre ton app, comment la filmer, les formats à refaire, pourquoi la même vidéo peut marcher une fois et pas l'autre, et les détails qui font la différence.`,
        },
      ],
    },
    {
      time: "1:35",
      title: "Partie 1 : ce qui floppe, tout ce qui ressemble à une pub",
      beats: [
        partCard("PARTIE 1 · CE QUI FLOPPE"),
        {
          say: `Première partie, et on commence par ce qui ne marche pas : un contenu qui ressemble à une pub, c'est-à-dire qui parle trop directement de l'application. Pour comprendre pourquoi, il faut voir la différence entre la pub et l'organique.`,
        },
        {
          show: "Écran coupé en deux. À gauche « PUB » : des billets qui deviennent des vues, une barre « l'app à l'écran » pleine du début à la fin. À droite « ORGANIQUE » : une courbe de rétention qui reste haute, et l'algorithme qui envoie la vidéo à de plus en plus de monde.",
          say: `Une publicité n'a pas besoin de devenir virale, puisque ses vues sont payées. Son accroche sert juste à attirer l'attention sur l'app, et ce qui compte, c'est que chaque seconde payée parle de l'app. En organique, c'est l'inverse. Les vues sont gratuites, mais c'est l'algorithme qui les distribue, et il ne montre une vidéo à plus de monde que si les gens restent dessus. Tout se joue sur la rétention : il faut séduire le spectateur naturellement, pas lui vendre quelque chose.`,
        },
        {
          show: "Un curseur entre « PARLER DE L'APP » et « DONNER ENVIE DE RESTER », qui se cale au milieu.",
          say: `Mais il faut quand même parler de l'app, parce qu'une vidéo qui devient virale sans elle ne fera pas de téléchargements. Tout l'enjeu de l'organique, c'est ce juste milieu : parler de ton app, dans un contenu agréable à regarder, qui donne envie de rester jusqu'au bout.`,
        },
      ],
    },
    lesson(
      1,
      "Une vidéo qui ne fait que décrire ton app ne marche pas",
      `Tu sais, ce genre de vidéo : « Cette nouvelle app te permet de faire ci, de faire ça, et encore ça. » Sur les comptes des apps qu'on a étudiées, on a trouvé quinze vidéos comme ça : une annonce, une nouveauté, un partenariat, une présentation de l'app. Et quatorze sur quinze font moins que ce que fait habituellement le compte. Par exemple, Yuka, l'app qui scanne ce que tu manges, a fait 2 millions de vues avec un carrousel sur les dangers de l'aspartame, mais seulement 8 282 avec « Yuka arrive dans huit nouveaux pays » (« Yuka launches in 8 new places »). Tiimo, une app de planning, a présenté ses fondatrices et sa mission : 2 485 vues. Sur le même compte, une utilisatrice qui raconte comment elle a découvert l'app après son diagnostic d'autisme : 808 000 vues. Pourquoi ? Parce qu'elle part de ce qu'elle vivait, et l'app arrive comme la solution. Une vidéo qui décrit l'app, c'est une pub, et personne ne reste devant une pub s'il n'y est pas obligé. Il y a quand même deux exceptions. Sur un format très court, tu peux parler directement de ton app. Et si ton app a une fonction avec un énorme effet waouh, cette fonction peut suffire à accrocher, on en verra des exemples. Mais ce n'est pas le cas de la plupart des apps.`,
      `Retiens ça : pars de la douleur de celui qui regarde, et fais arriver ton app comme la solution.`,
      `La phrase « Cette nouvelle app te permet de… » s'écrit et se remplit de fonctions jusqu'à déborder. Puis écran partagé : le carrousel Yuka « The Dangers of Aspartame » (2 M) face à « Yuka launches in 8 new places » (8 282), puis Tiimo « Meet our founders » (2 485) face au témoignage « Since getting my autism diagnosis… » (808 000). Le tableau des 15 vidéos « pub » défile, 14 lignes passent en rouge. Deux étiquettes : « FORMAT TRÈS COURT » et « EFFET WAOUH ».`,
      [
        ["Yuka, carrousel sur l'aspartame (2 M)", "https://www.tiktok.com/@yuka_app/video/7468423289392647467"],
        ["Yuka, « Yuka launches in 8 new places » (8 282)", "https://www.tiktok.com/@yuka_app/video/7623780864165416206"],
        ["Tiimo, « Meet our founders » (2 485)", "https://www.tiktok.com/@tiimoapp/video/6887762237805694209"],
        ["Tiimo, témoignage après un diagnostic d'autisme (808 000)", "https://www.tiktok.com/@tiimoapp/video/7141113416701218053"],
      ]
    ),
    lesson(
      2,
      "Présenter ton app face caméra, ça fait très peu de vues",
      `JotBot, une app qui aide à écrire et à prendre des notes, a posté trois vidéos la même semaine. Dans la première, on peut voir un cours YouTube d'une heure trente-huit, avec la phrase « je n'ai pas une heure trente-huit » (« i don't have 1hr and 38 minutes »). On colle le lien dans l'app, et les notes sortent. Il n'y a ni visage ni voix, et cette vidéo a fait 47,7 millions de vues. Dans les deux autres, c'est le créateur de l'app qui la présente face caméra : 2 655 et 1 578 vues. Chez Quizard, c'est la même chose avec la vidéo du début : quand le créateur explique son app, 2 268 vues. Pourquoi ? Parce que dans la première, on voit tout de suite ce que l'app fait pour nous. Dans les autres, quelqu'un qu'on ne connaît pas nous explique son produit, et on passe à la vidéo suivante.`,
      `La leçon : ne présente pas ton app, montre ce qu'elle fait pour la personne qui regarde.`,
      `JotBot « i don't have 1hr and 38 minutes 😭 » (Instagram, 47,7 M) face au créateur « I was cooking up something special » (2 655) et « hey my name is Derrick » (1 578). Rappel en petit du créateur de Quizard (2 268).`,
      [
        ["JotBot, « i don't have 1hr and 38 minutes » (47,7 M)", "https://www.instagram.com/reel/C0cXF11POqH/"],
        ["JotBot, le créateur face caméra (2 655)", "https://www.instagram.com/reel/C0Zfn04Rnue/"],
        ["JotBot, « hey my name is Derrick » (1 578)", "https://www.instagram.com/reel/C0S4I8uLZeE/"],
        ["Quizard, le créateur qui explique son app (2 268)", "https://www.tiktok.com/@quizard.ai/video/7392362266370379039"],
      ]
    ),
    lesson(
      3,
      "Une belle vidéo bien travaillée ne fait pas plus de vues qu'une vidéo simple",
      `SideMe, une app pour apprendre à coder, a posté une vidéo en 3D. On peut y voir un manchot qui fait du snowboard, le slogan « Code anywhere. Anytime. », et le bouton de l'App Store à la fin : 15 700 vues. Dix jours plus tard, le même compte poste un simple enregistrement de l'écran : un exercice de code, sans voix ni visage. Celle-là a fait 9,8 millions de vues. Même chose chez BeThere, une petite app slovène : 321 vues quand elle montre ses fonctions une par une, et 63 100 avec un sketch sur les pubs à la télé, où l'app n'arrive qu'à la fin, comme la chute de la blague. Pourquoi ? Parce que la vidéo en 3D et le tour des fonctions ressemblent à des pubs. L'exercice de code, on a envie de le résoudre, et le sketch, on a envie de connaître la chute. Dans les deux cas, on reste jusqu'au bout.`,
      `La leçon : ce qui fait des vues, ce n'est pas une belle production, c'est une vidéo qu'on a envie de regarder jusqu'au bout.`,
      `SideMe, le manchot en 3D (15 700) face à l'exercice « 30 Days to learn Python » (9,8 M). Puis BeThere « Snap it. Post it. » (321) face au sketch de la télé de 2035 (63 100).`,
      [
        ["SideMe, le manchot en 3D (15 700)", "https://www.tiktok.com/@sideme.ai/video/7604542405416897795"],
        ["SideMe, l'exercice de code (9,8 M)", "https://www.tiktok.com/@sideme.ai/video/7608291686581554454"],
        ["BeThere, le tour des fonctions (321)", "https://www.tiktok.com/@try_bethere/video/7701062504679607574"],
        ["BeThere, le sketch de la télé (63 100)", "https://www.tiktok.com/@try_bethere/video/7678755534769622294"],
      ]
    ),
    lesson(
      4,
      "Ne parle pas comme dans une pub à la télé",
      `Écoute ces trois phrases. « Est-ce que c'est bizarre d'être jaloux d'un calendrier ? La magie, c'est la nouvelle fonction routines. » (« Is it weird to be jealous of a calendar? The magic resides in Skylight Calendar's new routines feature. ») « Voilà le meilleur cadeau que j'ai jamais reçu en tant que papa. » (« This right here is the best gift I've ever received as a dad. ») « Laisse-moi te montrer les avantages du compte premium. » (« Let me show you the perks of having a premium account. ») Elles viennent de vidéos postées par les comptes de Skylight, un calendrier familial, et de Yuka, et les trois font moins que ce que fait habituellement leur compte. Autre exemple : Hearth, un écran pour organiser la famille, a fait 30 millions de vues avec une vidéo de dix secondes où personne ne parle. Sur le même compte, une créatrice qui parle une minute et demie et finit par « utilise mon code pour avoir 20 % de réduction » (« Use my code Kellie20 for 20% off Hearth ») : 1 274 vues. Pourquoi ? Parce que dès qu'on entend une voix de vendeur, on sait qu'on regarde une pub, et on passe à la vidéo suivante.`,
      `La leçon : si tu mets une voix, parle comme tu parlerais à un ami, pas comme un vendeur.`,
      `Skylight « routines feature » (30 000), Skylight « best gift I've ever received as a dad » (39 100), Yuka premium (4 976), une phrase de chaque en sous-titre. Puis Hearth « Out with the OLD » (Instagram, 29,9 M) face au code promo « Kellie20 » (1 274).`,
      [
        ["Skylight, « jealous of a calendar » (30 000)", "https://www.tiktok.com/@myskylight/video/7512239151358545183"],
        ["Skylight, « best gift I've ever received as a dad » (39 100)", "https://www.tiktok.com/@myskylight/video/7515600804930260255"],
        ["Yuka, le compte premium (4 976)", "https://www.tiktok.com/@yuka_app/video/7382974040534699306"],
        ["Hearth, « Out with the OLD » (29,9 M)", "https://www.instagram.com/reel/DESc1ZGOzxU/"],
        ["Hearth, le code promo Kellie20 (1 274)", "https://www.instagram.com/reel/Dba9i4Gv4T2/"],
      ]
    ),
    lesson(
      5,
      "Avant de copier une vidéo, regarde ses likes, pas seulement ses vues",
      `Skylight, le calendrier familial dont je viens de parler, a une vidéo à 5 millions de vues, mais seulement 2 849 likes. À côté, une app pour perdre du poids a fait autant de vues, 5,2 millions, avec 555 700 likes. Pourquoi un tel écart ? Parce que quand une vidéo a des millions de vues et presque pas de likes, soit elle n'a pas plu, soit ses vues ont été payées. Dans les deux cas, ce n'est pas un modèle à copier.`,
      `La leçon : copie les vidéos qui ont beaucoup de vues et beaucoup de likes.`,
      `Skylight (5 M de vues, 2 849 likes) face à Jurney (5,2 M, 555 700 likes), les deux compteurs de likes côte à côte.`,
      [
        ["Skylight, 5 M de vues et 2 849 likes", "https://www.tiktok.com/@myskylight/video/7528133220450290975"],
        ["Jurney, 5,2 M de vues et 555 700 likes", "https://www.tiktok.com/@kittyweight/video/7567016921816714526"],
      ]
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
      "La première phrase de ta vidéo doit parler de la personne qui regarde, pas de toi",
      `Turbo AI, une app de prise de notes, a posté le même jour deux vidéos de deux créatrices, avec la même légende et la même fin. La première commence par « si tu passes cette vidéo, tu rates tes examens » (« if you skip this video you're FAILING your finals ») : 6,8 millions de vues. La deuxième commence par « l'anglais, c'est trop dur » (« English is so hard vro »), et la créatrice parle d'elle : 6 725 vues. Pourquoi ? Parce que la première phrase touche directement une peur de celui qui regarde : rater ses examens. La deuxième parle de quelqu'un qu'il ne connaît pas. Et ce n'est pas un cas isolé. Sur les comptes des apps qu'on a étudiées, on a regardé de près 25 vidéos qui ont percé, et 15 commencent par un problème, une envie ou une peur de celui qui regarde.`,
      `La leçon : dès les premiers mots, parle de sa peur, de son problème ou de son envie.`,
      `Turbo AI « if you skip this video you're FAILING your finals » (6,8 M) face à « English is so hard vro » (6 725). La légende et la fin identiques entourées sur les deux.`,
      [
        ["Turbo AI, « if you skip this video you're FAILING your finals » (6,8 M)", "https://www.tiktok.com/@getturboai/video/7550714243683798327"],
        ["Turbo AI, « English is so hard vro » (6 725)", "https://www.tiktok.com/@getturboai/video/7550714786149829902"],
      ]
    ),
    lesson(
      7,
      "Ta première phrase compte autant que tout le reste de la vidéo",
      `Soundscape, une app pour mieux dormir et se concentrer, a posté deux vidéos à deux jours d'écart. Dans les deux, on peut voir presque la même chose : on lance une session, l'app bloque les applis qui distraient, et on dort mieux. La vraie différence, c'est la première phrase. La première vidéo commence par « moi quand je dors chaque nuit » (« Me when sleeping every night »), avec un garçon qui bâille : 333 800 vues. La deuxième commence par « ce mec est un génie » (« Bro is a GENIUS »), sur un écran d'ordinateur : 1 310 vues. Pourquoi ? Parce que la première parle de ta fatigue, et tu te reconnais tout de suite. La deuxième parle d'un inconnu, et tu ne sais même pas de quoi il s'agit.`,
      `La leçon : soigne ta première phrase autant que tes images.`,
      `Soundscape « Me when sleeping every night: » (333 800) face à « Bro is a GENIUS » (1 310), la suite des deux en parallèle pour montrer qu'elle se ressemble.`,
      [
        ["Soundscape, « Me when sleeping every night » (333 800)", "https://www.tiktok.com/@soundscape.study/video/7502671384787635478"],
        ["Soundscape, « Bro is a GENIUS » (1 310)", "https://www.tiktok.com/@soundscape.study/video/7503450888179174678"],
      ]
    ),
    lesson(
      8,
      "Choisis des mots qui parlent de la personne qui regarde",
      `Une app pour perdre du poids explique avec des chats comment maigrir. Sa vidéo « La façon paresseuse de perdre du poids » (« The lazy way to lose weight ») a fait 5,2 millions de vues. Treize jours plus tard, elle poste une vidéo avec les mêmes chats, la même musique et les mêmes étapes, mais cette fois « la façon la plus facile de perdre du poids » (« The easiest way to lose weight ») : 11 800 vues. Pourquoi ? Parce que « paresseuse », ça parle de toi. D'ailleurs, sous la première vidéo, le commentaire le plus liké, c'est : « donc depuis tout ce temps, c'était parce que je saute le petit-déjeuner » (« So all this time it was because I skip breakfast? »). Les gens se sont reconnus. « Facile », par contre, c'est une promesse qu'on entend partout. Il faut quand même être honnête : la deuxième vidéo arrivait après la première, sur le même compte, donc le mot n'explique peut-être pas tout.`,
      `La leçon : choisis des mots dans lesquels les gens se reconnaissent, même un de leurs défauts, plutôt que des mots qui vantent ta solution.`,
      `Jurney « THE LAZY » (5,2 M) face à « THE » easiest (11 800), le mot « LAZY » en rouge, puis le commentaire « So all this time it was because I skip breakfast? » (25 945 likes).`,
      [
        ["Jurney, « The lazy way to lose weight » (5,2 M)", "https://www.tiktok.com/@kittyweight/video/7567016921816714526"],
        ["Jurney, « The easiest way to lose weight » (11 800)", "https://www.tiktok.com/@kittyweight/video/7571891209002552607"],
      ]
    ),
    lesson(
      9,
      "Utilise la phrase « pourquoi je découvre ça seulement maintenant »",
      `On retrouve cette phrase dans une trentaine des 1 633 vidéos, dans des niches qui n'ont rien à voir entre elles. « Trois ans d'études et je découvre ça seulement maintenant » (« 3 years of studying and I just found this… BRUH ») : 66 millions de vues sur Instagram, et 28,5 millions sur TikTok avec la vidéo de Quizard du début. « Quatre ans de salle et je découvre ça maintenant » (« 4 years at the gym and NOW I find this?! ») : 15 millions. Pourquoi elle marche aussi bien ? Parce qu'elle dit à celui qui regarde qu'il est passé à côté de quelque chose. Il a envie de savoir quoi, alors il reste, et juste après, on lui montre ce qu'il a raté.`,
      `La leçon : si ton app règle un problème que les gens subissent depuis longtemps, cette phrase est faite pour toi.`,
      `Unstuck AI (Instagram, 66,1 M), Quizard (TikTok, 28,5 M), Stronger (15,3 M), les trois premières images côte à côte.`,
      [
        ["Unstuck AI, « 3 years of studying and I just found this » (Instagram, 66 M)", "https://www.instagram.com/reel/C_jtibrRhzI/"],
        ["Quizard, la même phrase sur TikTok (28,5 M)", "https://www.tiktok.com/@quizard.ai/video/7411341221949426974"],
        ["Stronger, « quatre ans de salle » (15,3 M)", "https://www.tiktok.com/@kailyn.lifts/video/7626442321860644127"],
      ]
    ),
    lesson(
      10,
      "Montre ton app comme si quelqu'un te l'avait conseillée",
      `Une créatrice qui poste pour StudyFetch, un outil de révision, a publié deux vidéos le même jour. Dans la première, on peut la voir étonnée pendant une seconde, avec la phrase « ma sœur vient de me montrer ce qu'elle utilise pour réviser » (« my sister just showed me what she uses to study »), puis un jeu qui transforme les cours en jeu vidéo : 11,9 millions de vues. Dans la deuxième, elle explique face caméra toutes les fonctions de l'app, et le même jeu n'arrive qu'à la fin : 5 316 vues. Même chose pour Coconote, une app qui prend des notes pendant les cours : « Ma mère m'a montré à quel point la fac peut être facile » (« my mom showed me how easy college can be ») a fait 26 millions de vues. Pourquoi ? Parce que quand quelqu'un d'autre te montre l'app, ce n'est plus une pub, c'est un conseil. Et on écoute un conseil beaucoup plus volontiers qu'une pub.`,
      `La leçon : « on m'a montré ça », ça sonne comme un conseil entre amis. « Voici mon app », ça sonne comme une pub.`,
      `StudyFetch « my sister just showed me what she uses to study 😭😭😭 » (Instagram, 11,9 M) face à « Level up your SELF Study with this hack » (5 316), même jour. Puis Coconote « my mom showed me how easy college can be » (Instagram, 26 M).`,
      [
        ["StudyFetch, « my sister just showed me » (11,9 M)", "https://www.instagram.com/reel/DH7MA6ZT20U/"],
        ["StudyFetch, le même jour, les fonctions face caméra (5 316)", "https://www.instagram.com/reel/DH7k8aZzCZ3/"],
        ["Coconote, « my mom showed me how easy college can be » (26 M)", "https://www.instagram.com/reel/C9hepDsMoYQ/"],
      ]
    ),
    {
      time: "8:30",
      title: "Le cadeau",
      mode: "visage",
      beats: [
        {
          say: `Petite pause. J'ai préparé un PDF avec 100 contenus viraux que tu peux copier dès maintenant, et qui peuvent marcher pour n'importe quelle app. Le lien est en description. On reprend.`,
          show: `Face caméra. Texte à l'écran : « 100 contenus viraux à copier · lien en description », 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "8:45",
      title: "Partie 3 : où mettre ton app",
      beats: [
        partCard("PARTIE 3 · OÙ METTRE TON APP"),
        { say: `Troisième partie : à quel moment montrer ton app. Pas au début pour la présenter, mais au moment où celui qui regarde attend une solution, ou tout de suite si elle fait quelque chose d'impressionnant.` },
      ],
    },
    lesson(
      11,
      "Si ton app fait quelque chose d'impressionnant, montre-la en action dès le début",
      `C'est l'exception dont je t'ai parlé à la leçon 1. Parmi les 25 vidéos qui ont percé de la leçon 6, dix ne commencent pas par un problème : elles montrent directement l'app en train de faire quelque chose qu'on a envie de regarder. Dans l'une, on peut voir un exercice de code où l'on glisse les bonnes pièces, sans voix ni visage : 9,8 millions de vues. Dans une autre, un garçon fait des pompes pour battre un monstre dans un jeu : 4,2 millions. Et Mello, une app créée par des étudiants, a fait 981 100 vues avec son annonce de sortie, où l'on voit simplement des cartes de profil se personnaliser. Pourquoi ça marche ? Parce que ce qu'on voit est assez surprenant pour qu'on ait envie de voir la suite. Mais attention, la plupart des apps n'ont pas ce genre de fonction.`,
      `La leçon : si ton app a un vrai effet waouh, montre-le dès la première seconde. Sinon, pars de la douleur.`,
      `SideMe « 30 Days to learn Python » (9,8 M), puis Push Up Arena « Skill vs spam… » (4,2 M), puis Mello « We Built… Are You Ready? » (981 100).`,
      [
        ["SideMe, l'exercice de code (9,8 M)", "https://www.tiktok.com/@sideme.ai/video/7608291686581554454"],
        ["Push Up Arena, « Skill vs spam » (4,2 M)", "https://www.tiktok.com/@pushuparena.app/video/7680736764771765535"],
        ["Mello, « We Built… Are You Ready? » (981 100)", "https://www.tiktok.com/@mello.hq/video/7694823112851868980"],
      ]
    ),
    lesson(
      12,
      "Pas besoin de dire le nom de ton app : si la vidéo plaît, les gens le demandent",
      `On a lu plus de 4 500 commentaires sous seize vidéos qui ont percé. Quand le nom de l'app n'apparaît nulle part dans la vidéo, entre 5 et 17 % des commentaires le demandent : « c'est quelle app ? » (« what app? »), « le lien, s'il te plaît » (« link please »). Un seul de ces commentaires a même fait 5 475 likes. Et quand le nom est écrit à l'écran, presque personne ne le demande, mais les gens taguent un ami à la place : chez Coconote, c'est 46 % des commentaires. Pourquoi c'est important ? Parce que chaque commentaire et chaque ami tagué montrent à l'algorithme que la vidéo intéresse, et il la montre à plus de monde.`,
      `La leçon : si personne ne demande le nom ni ne tague un ami, c'est que la vidéo n'a pas intéressé.`,
      `Les commentaires qui défilent : « Welche App ist das? » (5 475 likes), « Link please », « What is the name of the application? », « App name ». Puis le tableau : Hearth 17 %, Push Up Arena 15,9 %, SideMe 8,1 %, Quizard 4,7 % quand le nom est caché, contre 0 à 1,4 % quand il est donné. Puis les tags d'amis sous Coconote (46 %).`,
      [
        ["Quizard, « college literally isn't real anymore » et le commentaire « Welche App ist das? » (29,5 M)", "https://www.tiktok.com/@quizard.ai/video/7443184838179294495"],
        ["Push Up Arena, 15,9 % de demandes du nom (4,2 M)", "https://www.tiktok.com/@pushuparena.app/video/7680736764771765535"],
        ["SideMe, 8,1 % de demandes du nom (9,8 M)", "https://www.tiktok.com/@sideme.ai/video/7608291686581554454"],
        ["Hearth, « Link please » (29,9 M)", "https://www.instagram.com/reel/DESc1ZGOzxU/"],
        ["Coconote, 46 % de tags d'amis (26 M)", "https://www.instagram.com/reel/C9hepDsMoYQ/"],
      ]
    ),
    lesson(
      13,
      "Tu peux dire « télécharge », mais seulement à la fin, après l'histoire",
      `Sur le compte de Moshi, une app d'histoires pour enfants, la vidéo « Comment je couche mes enfants en quinze minutes » (« How I get my kids to bed in 15 minutes or less! ») a fait 13,3 millions de vues. Et pourtant, elle finit par « télécharge l'app Moshi, le lien est dans mon profil » (« Download the FREE Moshi Sleep app at the link in my profile! »). Chez Turbo AI, c'est pareil : les vidéos qui ont marché et celles qui n'ont pas marché finissaient toutes par le même bouton de l'App Store. Pourquoi ? Parce qu'à la fin, les gens ont déjà regardé toute la vidéo. Le « télécharge » ne les fait pas partir, il leur dit juste quoi faire ensuite.`,
      `La leçon : le « télécharge » ne fait pas flopper une vidéo. Ce qui la fait flopper, c'est quand il n'y a que ça.`,
      `Moshi « How I get my kids to bed in 15 minutes or less! » (13,3 M), sa dernière phrase en sous-titre. Puis les fins Turbo AI identiques sous 6,8 M et sous 6 725.`,
      [
        ["Moshi, « How I get my kids to bed in 15 minutes or less! » (13,3 M)", "https://www.tiktok.com/@playmoshikids/video/6882642977194249474"],
        ["Turbo AI, la fin avec le bouton de l'App Store (6,8 M)", "https://www.tiktok.com/@getturboai/video/7550714243683798327"],
        ["Turbo AI, la même fin (6 725)", "https://www.tiktok.com/@getturboai/video/7550714786149829902"],
      ]
    ),
    lesson(
      14,
      "Si ton app n'est pas dans la vidéo, les vues ne feront pas télécharger",
      `Une app de Pilates a fait 9,4 millions de vues avec une vidéo de cinq secondes, où l'on peut voir un ventre plat et le mot « Pilates ». L'app n'apparaît pas, et sur 203 commentaires lus, pas un seul ne la demande. Une autre app a fait 11,8 millions de vues avec une fille filmée du cou aux pieds, et l'app seulement dans la légende. Pourquoi c'est un problème ? Parce que les gens ont regardé la vidéo, mais ils ne savent même pas qu'il y a une app derrière.`,
      `La leçon : ton app doit faire partie de l'histoire. 5 000 vues qui font télécharger valent plus qu'un million qui ne fait rien.`,
      `Forméa « Pilates >>> » (9,4 M), compteur « 0 / 203 commentaires demandent l'app ». Puis Tone AI (11,8 M), la légende entourée.`,
      [
        ["Forméa, « Pilates >>> » (9,4 M)", "https://www.tiktok.com/@formea.pilates/video/7678283526629903638"],
        ["Tone AI, « 60kg » (11,8 M)", "https://www.tiktok.com/@movewmil/video/7562274640857632002"],
      ]
    ),
    {
      time: "11:30",
      title: "Partie 4 : comment filmer ton app",
      beats: [
        partCard("PARTIE 4 · COMMENT FILMER"),
        { say: `Quatrième partie : comment filmer ton application pour qu'on la comprenne en une seconde.` },
      ],
    },
    lesson(
      15,
      "Filme ton téléphone avec un deuxième téléphone, la main dans l'image",
      `Parmi les 1 633 vidéos, on a regardé image par image 24 des plus grosses, entre 6,5 et 66 millions de vues. 16 d'entre elles filment l'app sur un vrai téléphone, posé sur un bureau ou tenu en main, avec un doigt qui tape dessus. Une seule est un simple enregistrement d'écran. Par exemple, Soundscape a fait 40,8 millions de vues avec une vidéo de 20 secondes, où l'on peut voir un iPhone posé sur un bureau en bois et une main qui lance l'app. Pourquoi ça marche ? Parce que filmé comme ça, on a l'impression que quelqu'un nous montre un truc, pas qu'on nous vend quelque chose.`,
      `La leçon : une vraie main sur un vrai téléphone, ça fait recommandation. Un enregistrement d'écran, ça fait démo.`,
      `Soundscape (@soundscape.study, 40,8 M).`,
      [
        ["Soundscape, l'iPhone sur le bureau (40,8 M)", "https://www.tiktok.com/@soundscape.study/video/7485770482667588866"],
      ]
    ),
    lesson(
      16,
      "Tu n'as pas besoin de montrer ton visage",
      `14 de ces 24 grosses vidéos ne montrent jamais le visage de la personne qui filme. Et ça inclut la plus vue des 1 633 : 66 millions de vues, avec juste un ordinateur sur les genoux dans un amphi. Pourquoi ça marche quand même ? Parce que ce qui retient les gens, c'est ce qui se passe à l'écran, pas la personne qui filme.`,
      `La leçon : si te montrer te bloque, ce n'est pas une raison pour ne pas poster.`,
      `Unstuck AI (@quizard.ai, Instagram, 66,1 M).`,
      [
        ["Unstuck AI, l'amphi sans visage (Instagram, 66 M)", "https://www.instagram.com/reel/C_jtibrRhzI/"],
      ]
    ),
    lesson(
      17,
      "Filme de près, pour qu'on comprenne tout de suite ce qui se passe",
      `Sur le compte de Quizard, deux vidéos ont presque la même phrase : « la fac, ce n'est plus vraiment la fac » (« college literally isn't real anymore »). Dans celle qui a fait 29,5 millions de vues, on peut voir un étudiant affalé, et en gros plan son téléphone qui enregistre le cours. Dans celle qui a fait 2 702 vues, on voit l'amphi filmé de loin, puis un quiz sur un ordinateur qu'on a du mal à lire. Pourquoi un tel écart ? Parce que dans la première, on comprend en une seconde ce que fait l'app. Dans la deuxième, on ne comprend pas, alors on passe à la suite. D'ailleurs, dans 16 de ces 24 grosses vidéos, l'app est à l'écran dès la deuxième ou la troisième seconde.`,
      `La leçon : ton app doit être à l'écran dans les trois premières secondes, assez près pour qu'on voie ce qu'elle fait.`,
      `Quizard « college literally isn't real anymore » (29,5 M) face à « college literally isn't real life » (2 702), le téléphone entouré dans la première.`,
      [
        ["Quizard, l'étudiant et son téléphone en gros plan (29,5 M)", "https://www.tiktok.com/@quizard.ai/video/7443184838179294495"],
        ["Quizard, l'amphi filmé de loin (2 702)", "https://www.tiktok.com/@quizard.ai/video/7435854245422763295"],
      ]
    ),
    lesson(
      18,
      "Fais court, et écris ta première phrase en gros",
      `On a mesuré la durée de 75 vidéos TikTok parmi les plus vues : la moitié dure moins de 18 secondes. Et 21 de ces 24 grosses vidéos ont une phrase écrite dès la première image. Un exemple : Tallow, une app qui scanne les ingrédients, a parlé deux jours de suite du cacao de laboratoire. Le premier jour, on peut voir la phrase écrite en gros, « des marques de chocolat commencent à utiliser du cacao de labo » (« Chocolate brands starting to use lab grown cocoa »), puis six marques que tout le monde mange : 1,7 million de vues. Le lendemain, le titre est à moitié caché par la tête de la présentatrice, et il n'y a que deux marques : 16 000 vues. Pourquoi ? Parce que si on ne comprend pas la première phrase tout de suite, on passe à la vidéo suivante. Et avec six marques, chacun attend de voir si la sienne est dans la liste.`,
      `La leçon : vise moins de 20 secondes, et une première phrase qu'on lit en entier, même sans le son.`,
      `Tallow « Chocolate brands starting to use lab grown cocoa » (1,7 M) face à « CADBURY » au titre caché (16 000), la première image de chaque en grand.`,
      [
        ["Tallow, « Chocolate brands starting to use lab grown cocoa » (1,7 M)", "https://www.tiktok.com/@tallowapp/video/7650879158695873823"],
        ["Tallow, le titre caché (16 000)", "https://www.tiktok.com/@tallowapp/video/7651259485486402847"],
      ]
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
      "Montre ce que tu donnes à l'app, puis ce qu'elle en fait",
      `Dans ce genre de vidéo, on peut voir ce qu'on donne à l'app, un cours, une photo ou un lien, puis le résultat qui apparaît. Environ 150 des 1 633 vidéos suivent ce schéma. Par exemple, un cours qu'on dépose dans l'app et qui devient des fiches et un quiz : 4,7 millions de vues. Pourquoi ça marche ? Parce que la transformation se comprend toute seule, et on a envie de voir le résultat.`,
      `La leçon : la transformation se comprend toute seule, pas besoin de l'expliquer.`,
      `@studywithtay2 (4,7 M).`,
      [
        ["@studywithtay2, un cours qui devient des fiches (4,7 M)", "https://www.tiktok.com/@studywithtay2/video/7525296604312554766"],
      ]
    ),
    lesson(
      20,
      "Fais deviner le résultat avant de le montrer",
      `Dans cette vidéo, on peut voir deux assiettes avec le même nombre de calories, et des mains gantées qui sont en train de les remplir. Ensuite, un téléphone scanne, et la note s'affiche. Il n'y a pas de voix, il n'y a pas de visage, et CalScan a fait 18 millions et 16,5 millions de vues avec ce format. Pourquoi ? Eh bien, parce que celui qui regarde essaie de deviner ce qu'il va y avoir dans chaque assiette. Ça crée de l'anticipation : on se demande combien d'aliments on va pouvoir mettre dans cette assiette pour atteindre ce nombre de calories.`,
      `La leçon : faire deviner crée de l'anticipation, et l'anticipation augmente la rétention, donc la viralité.`,
      `CalScan « 580kcal │ 580kcal » (18 M) puis « 800kcal » (16,5 M).`,
      [
        ["CalScan, « 580kcal » (18 M)", "https://www.tiktok.com/@calscanapp/video/7536803368493206839"],
        ["CalScan, « 800kcal » (16,5 M)", "https://www.tiktok.com/@calscanapp/video/7508465001674624302"],
      ]
    ),
    lesson(
      21,
      "Fais une comparaison dans laquelle les gens peuvent se reconnaître",
      `Yuka a posté une vidéo où l'on peut voir le même thé glacé vendu aux États-Unis et en Europe, avec la liste des additifs de chaque côté : 892 500 vues. Une autre vidéo montre trois étudiantes, trois façons de réviser et trois notes, A, B et C : 17 millions de vues. Pourquoi ça marche ? Parce que chacun se demande de quel côté il est. Sous la vidéo des trois étudiantes, 40 % des commentaires donnent d'ailleurs leur propre note.`,
      `La leçon : ton app doit toujours être du bon côté de la comparaison.`,
      `Yuka « United States │ Europe » (892 500), puis Oreate AI « 95% Student (A+) / 80% Student (B+) / 60% Student (C+) » (Instagram, 17,1 M) et ses commentaires « I am C+😢 ».`,
      [
        ["Yuka, « United States │ Europe » (892 500)", "https://www.tiktok.com/@yuka_app/video/7647995838857268511"],
        ["Oreate AI, « 95% Student / 80% Student / 60% Student » (Instagram, 17,1 M)", "https://www.instagram.com/reel/DU_DxeJiH8c/"],
      ]
    ),
    lesson(
      22,
      "Mets ton app dans une liste de « 3 apps à avoir »",
      `Une vidéo en français, « Top 3 des meilleures IA pour tes études », a fait 1,6 million de vues. Dans ce genre de vidéo, tu peux glisser ton app au milieu d'apps que tout le monde connaît déjà. Pourquoi ça marche ? Parce que ça ne ressemble pas à une pub, c'est une liste de conseils, et ton app profite de la confiance qu'on a déjà dans les autres.`,
      `La leçon : au milieu d'apps connues, ton app passe pour un conseil, pas pour une pub.`,
      `Être Étudiant (@etreetudiant, 1,6 M).`,
      [
        ["Être Étudiant, « Top 3 des meilleures IA pour tes études » (1,6 M)", "https://www.tiktok.com/@etreetudiant/video/7584398508120100118"],
      ]
    ),
    lesson(
      23,
      "Si tu n'as pas le temps de filmer, fais des carrousels",
      `Un carrousel, ce sont des photos ou des captures qu'on fait défiler. C'est le format le plus simple à faire, et il y en a plus de 80 parmi les 1 633 vidéos. Yuka, par exemple, a fait 2 millions de vues avec un carrousel sur l'aspartame. Pourquoi ça marche ? Parce que chaque image donne envie de voir la suivante, et les gens font défiler jusqu'au bout.`,
      `La leçon : pas de tournage, pas de montage, et ça peut quand même faire des millions de vues.`,
      `Carrousel Yuka (@yuka_app, 2 M), on fait défiler les images.`,
      [
        ["Yuka, carrousel sur l'aspartame (2 M)", "https://www.tiktok.com/@yuka_app/video/7468423289392647467"],
      ]
    ),
    lesson(
      24,
      "Donne à ton app une mascotte ou un petit jeu",
      `Finch, une app de bien-être avec un petit oiseau à faire grandir, a fait 63 et 33 millions de vues. Les chats de l'app pour perdre du poids : 5,2 millions. Le garçon qui bat un monstre à coups de pompes : 3,4 millions. Pourquoi ça marche ? Parce qu'un personnage ou un jeu, on a envie de le suivre et de voir ce qui va lui arriver. C'est beaucoup plus engageant qu'un écran d'app.`,
      `La leçon : un personnage ou un jeu donne un visage à ton app, sans que tu aies à montrer le tien.`,
      `Finch (33,2 M), Jurney (5,2 M), Push Up Arena « what is this app bro » (3,4 M).`,
      [
        ["Finch (63,4 M)", "https://www.tiktok.com/@finchcare/video/7457035886274907438"],
        ["Finch (33,2 M)", "https://www.tiktok.com/@finchcare/video/7368551995138968875"],
        ["Jurney, les chats (5,2 M)", "https://www.tiktok.com/@kittyweight/video/7567016921816714526"],
        ["Push Up Arena, « what is this app bro » (3,4 M)", "https://www.tiktok.com/@pushuparena.app/video/7637686723069185311"],
      ]
    ),
    lesson(
      25,
      "Parle d'une info qui touche tout le monde, et finis par ton app",
      `Tallow a fait 2,9 millions de vues avec une vidéo façon journal télévisé sur les œufs d'une chaîne de fast-food, et 1,7 million avec le cacao de labo. Dans ces vidéos, on peut voir quelqu'un qui parle pendant 40 secondes de ce que les gens mangent, et l'app n'arrive qu'à la fin, comme le moyen de vérifier. Pourquoi ça marche ? Parce que l'info concerne directement celui qui regarde : c'est ce qu'il mange. D'ailleurs, les commentaires parlent des marques, pas de l'app, et c'est bon signe : la vidéo a intéressé.`,
      `La leçon : parle de ce qui intéresse les gens, et fais arriver ton app comme le moyen d'agir.`,
      `Tallow « DUNKIN » (2,9 M), puis le commentaire « why is it so expensive if it's fake » (41 767 likes).`,
      [
        ["Tallow, Dunkin' (2,9 M)", "https://www.tiktok.com/@tallowapp/video/7655431387650395423"],
        ["Tallow, le cacao de labo (1,7 M)", "https://www.tiktok.com/@tallowapp/video/7650879158695873823"],
      ]
    ),
    {
      time: "17:00",
      title: "Partie 6 : la même vidéo, des résultats opposés",
      beats: [
        partCard("PARTIE 6 · LA MÊME VIDÉO"),
        { say: `Sixième partie : la même vidéo peut exploser une fois et faire un flop la fois suivante.` },
      ],
    },
    lesson(
      26,
      "Ne republie jamais la même vidéo",
      `Quizard a posté une vidéo où l'on peut voir un étudiant au fond de la classe, avec l'IA qui répond au quiz sur son ordinateur : 963 300 vues. Trois jours plus tard, le compte a republié exactement la même vidéo, même film, même son, même texte. Seul l'émoji change. Résultat : 5 400 vues, 178 fois moins. Sur Instagram, Quizard a refait presque mot pour mot une vidéo à 23,3 millions de vues, quatre jours plus tard : 40 500 vues. Pourquoi ? On ne peut pas le savoir avec certitude, mais une vidéo qu'on a déjà vue n'a aucune raison de nous retenir une deuxième fois.`,
      `La leçon : chaque vidéo doit être une nouvelle vidéo.`,
      `Les deux Quizard « the F students are inventors » côte à côte, en même temps, puis le zoom sur l'émoji 🥀 contre 💔. Puis les deux post-it Instagram (23,3 M et 40,5 K).`,
      [
        ["Quizard, « the F students are inventors » (963 300)", "https://www.tiktok.com/@quizard.ai/video/7502540387144289567"],
        ["Quizard, la même vidéo 3 jours après (5 400)", "https://www.tiktok.com/@quizard.ai/video/7503593343650254111"],
        ["Quizard, le post-it sur Instagram (23,3 M)", "https://www.instagram.com/reel/C_Bl2y2RJni/"],
        ["Quizard, le même post-it 4 jours après (40,5 K)", "https://www.instagram.com/reel/C_L4NvYS0G3/"],
      ]
    ),
    lesson(
      27,
      "Une vidéo qui a marché ne garantit pas que la suivante marchera",
      `CalScan a refait sa vidéo des deux assiettes six jours après celle à 18 millions de vues, avec d'autres plats : 36 700 vues. Sept mois plus tard, le même format faisait 560 vues, mais à ce moment-là, tout le compte faisait moins de 1 000 vues par vidéo. Pourquoi ? Parce qu'un format qui a marché te donne de bonnes chances, pas une garantie. Chaque vidéo repart de zéro.`,
      `La leçon : une vidéo qui a marché te dit quoi refaire, pas combien de vues tu vas faire.`,
      `CalScan 580kcal (18 M), 340kcal (36 700), 1000Kcal (560), en ligne, avec la courbe des vues du compte qui descend.`,
      [
        ["CalScan, « 580kcal » (18 M)", "https://www.tiktok.com/@calscanapp/video/7536803368493206839"],
        ["CalScan, 6 jours après (36 700)", "https://www.tiktok.com/@calscanapp/video/7539219212334583053"],
        ["CalScan, 7 mois après (560)", "https://www.tiktok.com/@calscanapp/video/7620108340995034382"],
      ]
    ),
    lesson(
      28,
      "Une part des vues, c'est de la chance, alors poste souvent",
      `Pour une app d'investissement, on a trouvé la même vidéo sur trois comptes différents : même phrase, même son, même durée. Une version a fait 428 600 vues, une autre 165 600, et la dernière 1 701. Pourquoi des écarts pareils avec la même vidéo ? Parce que tout ne dépend pas du contenu. Le compte, le moment et les premières personnes qui la voient jouent aussi.`,
      `La leçon : tu ne contrôles pas la chance, mais tu contrôles le nombre de vidéos que tu postes.`,
      `Les 3 vidéos Bloom côte à côte avec leurs vues (428 600, 165 600, 1 701).`,
      [
        ["Bloom chez @savingwithselma (428 600)", "https://www.tiktok.com/@savingwithselma/video/7611325663475223839"],
        ["Bloom chez @drmspam (165 600)", "https://www.tiktok.com/@drmspam/video/7610690060140170526"],
        ["Bloom chez @treylovesinvesting (1 701)", "https://www.tiktok.com/@treylovesinvesting/video/7619835357634252054"],
      ]
    ),
    lesson(
      29,
      "Garde le format qui a marché, mais change de sujet à chaque vidéo",
      `Puisque republier ne marche pas, il faut garder ce qui a marché et changer ce qu'on raconte. Tallow, par exemple, garde toujours la même forme, une présentation façon journal avec un titre, et change de sujet à chaque vidéo : les œufs d'une chaîne de fast-food, le chocolat, le poisson. Pourquoi ? Parce que le format, les gens l'ont déjà aimé, et le nouveau sujet leur donne une raison de regarder encore.`,
      `La leçon : même format, autre sujet, autre première image, et tu as une nouvelle vidéo.`,
      `Grille de 6 vidéos Tallow au même format, sujets différents, avec leurs vues.`,
      [
        ["Tallow, Dunkin' (2,9 M)", "https://www.tiktok.com/@tallowapp/video/7655431387650395423"],
        ["Tallow, le chocolat (1,7 M)", "https://www.tiktok.com/@tallowapp/video/7650879158695873823"],
        ["Tallow, le poisson (380)", "https://www.tiktok.com/@tallowapp/video/7668063263300586783"],
        ["Le compte Tallow", "https://www.tiktok.com/@tallowapp"],
      ]
    ),
    lesson(
      30,
      "Poste un format au moins dix fois avant de dire qu'il ne marche pas",
      `Quizard a posté au moins 25 vidéos avec la même légende, et elles ont fait entre 2 683 et 29,5 millions de vues. Le créateur de l'app Eclipta a fait entre 100 et 500 vues par vidéo pendant trois mois, avant d'en faire une à 13 millions en mai. Pourquoi c'est important ? Parce que si tu arrêtes un format après deux ou trois vidéos, tu ne sauras jamais s'il pouvait exploser.`,
      `La leçon : un format qui fait peu de vues au début peut exploser plus tard, laisse-lui sa chance.`,
      `Grille des 25 vidéos Quizard « bruh » avec leurs vues, la 29,5 M qui s'allume. Puis la grille d'Eclipta : trois mois de vignettes entre 100 et 500 vues, et la 13 M.`,
      [
        ["Le compte Quizard sur TikTok (les vidéos « bruh »)", "https://www.tiktok.com/@quizard.ai"],
        ["Le créateur d'Eclipta, la vidéo à 13 M", "https://www.instagram.com/reel/DYfnXHqOo27/"],
        ["Son compte Instagram", "https://www.instagram.com/journal.bingen/"],
      ]
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
      "Quand tu refais un format, garde le même son",
      `Push Up Arena a posté deux fois la même partie, avec le même garçon et le même monstre, à trois jours d'écart. Avec un extrait d'anime en fond : 1,7 million de vues. Avec la voix du garçon à la place : 8 079. Le texte changeait un peu aussi, donc le son n'explique pas tout. Mais deux apps de musculation concurrentes ont aussi explosé avec le même son : 15 millions et 4 millions de vues. Pourquoi ? Parce que le son fait partie de ce qui donne envie de regarder. Si tu le changes, tu ne refais plus vraiment le format qui a marché.`,
      `La leçon : le son fait partie du format, autant que les images.`,
      `Push Up Arena « POV you play Solo Leveling IRL » (1,7 M) face à « Bro what is ts » (8 079), puis Stronger (15,3 M) et Lyfta (4,2 M), même son.`,
      [
        ["Push Up Arena, avec l'extrait d'anime (1,7 M)", "https://www.tiktok.com/@pushuparena.app/video/7650668508505705758"],
        ["Push Up Arena, avec la voix du garçon (8 079)", "https://www.tiktok.com/@pushuparena.app/video/7651809418950036766"],
        ["Stronger (15,3 M)", "https://www.tiktok.com/@kailyn.lifts/video/7626442321860644127"],
        ["Lyfta, même son (4,2 M)", "https://www.tiktok.com/@lyft.withnicole/video/7588999110909283592"],
      ]
    ),
    lesson(
      32,
      "Poste aussi en anglais, c'est là qu'il y a le plus de vues",
      `Aucune des 18 vidéos les plus vues parmi les 1 633 n'est en français. La plus vue en français fait quand même 7,2 millions de vues, pour une app de révision. Pourquoi ? Parce que le public qui parle anglais est beaucoup plus grand : la même vidéo peut toucher bien plus de monde.`,
      `La leçon : commence dans ta langue si tu veux, mais ouvre aussi un compte en anglais.`,
      `Nomad Education (@priel.study, 7,2 M).`,
      [
        ["Nomad Education chez @priel.study (7,2 M)", "https://www.tiktok.com/@priel.study/video/7290614054438079777"],
      ]
    ),
    {
      time: "21:00",
      title: "Récap et fin",
      beats: [
        {
          say: `Si tu ne retiens que cinq choses : ne parle pas de ton app comme dans une pub, commence par la personne qui regarde, montre ton app au moment où celui qui regarde attend une solution, sans la présenter, filme-la pour qu'on la comprenne en une seconde, et poste chaque format des dizaines de fois en changeant d'histoire. Et pour trouver ton premier format, le PDF des 100 contenus viraux à copier est en lien dans la description.`,
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
  description: `🎁 GRATUIT : le PDF des 100 contenus viraux à copier dès maintenant, qui peuvent marcher pour n'importe quelle app : https://www.jeremypitault.com/guide/100-contenus-a-copier?${UTM_B}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_B}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_B}

On a passé au crible environ 12 500 vidéos TikTok et Instagram pour en garder 1 633 qui montrent une app, puis on est allés chercher celles qui ont floppé sur les mêmes comptes. Résultat : 32 leçons sur ce qui marche, ce qui floppe et ce qui fait la différence. Pourquoi tout ce qui ressemble à une pub floppe, comment ouvrir sur la personne qui regarde, où mettre ton app, comment la filmer, les formats à refaire, et pourquoi la même vidéo peut faire 963 300 vues puis 5 400.

👉 Dis-moi en commentaire laquelle de ces 32 leçons tu vas tester en premier.

0:00 Introduction
1:35 Ce qui floppe
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
    "Tournage, parties face caméra : la caméra ne sert que pour « Face caméra : qui je suis » et « Le cadeau ». Fais chacune 2 ou 3 fois en entier, en 4K, mise au point et exposition verrouillées.",
    "Tournage, tout le reste : ta voix seule au micro, à 20 ou 30 cm, en lisant le script. Un fichier par partie, dis le nom de la partie au début et laisse 10 secondes de silence. Si tu te trompes, tais-toi 2 secondes et reprends la phrase depuis son début.",
    "Rushs dans ~/Movies/Rushs/2026-11-1633-videos/ (hors iCloud), fichiers d'origine.",
    "Vidéos des exemples : déjà téléchargées dans broll/ (percées de la banque), flops/ (comptes TikTok, une planche par compte) et flops-insta/ (Instagram et pubs). Rapports : ~/Projects/reports/2026-11-18-flops/.",
    "Avant de publier : créer le cadeau /guide/100-contenus-a-copier (PDF de 100 contenus viraux qui marchent pour n'importe quelle app), avec son email de livraison.",
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
// Vidéo D (23 nov. 2026) : les apps ennuyeuses qui rapportent des millions.
// Sources : classement d'Apple des apps qui rapportent le plus aux États-Unis
// (flux RSS « top grossing », 13 catégories, 100 apps chacune, relevé le 23/11/2026),
// recherche App Store de 18 niches (nombre d'avis), prix relevés sur les pages
// App Store le 23/11, chiffres publics : TalkingParents (Practical Founders, août 2025),
// Trucker Path (FreightWaves, oct. 2020), Appfigures (télécommandes et
// identification 2025), SnoreLab (son site). Données et planches de captures :
// ~/Projects/reports/2026-11-23-apps-ennuyeuses/. Pure valeur, aucun élève.
const UTM_D = "utm_source=youtube&utm_medium=video&utm_campaign=apps-ennuyeuses";

const SCRIPT_D: VideoScript = {
  slug: "apps-ennuyeuses",
  label: "Vidéo D · Apps ennuyeuses",
  status: "Prêt à tourner",
  updatedAt: "23 nov. 2026",
  title: "Ces apps ennuyeuses rapportent des millions (et personne n'en parle)",
  why: `Une piste en plus, pas à la place des autres : les apps dont tout le monde parle peuvent très bien rapporter (c'est le cas de Shinobi et de la plupart des apps que tu accompagnes), mais il y a aussi des niches auxquelles personne ne pense. Le format « ce truc ennuyeux rapporte des millions » fait jusqu'à 984 000 vues pour les sites et les SaaS, et presque personne ne l'a fait pour les apps, encore moins en français. Toutes les preuves viennent du classement d'Apple des apps qui rapportent le plus aux États-Unis, relevé le 23 novembre. La vidéo montre aussi ce qui floppe : dans chaque niche, des dizaines d'apps n'ont presque aucun avis.`,
  facts: [
    { label: "Durée", value: "15 à 17 min (environ 2 400 mots de voix)" },
    { label: "Montage", value: "Sans visage (direction C), sauf trois moments face caméra : « qui je suis » juste après l'intro, le cadeau suivi de l'appel avec ton équipe, et la fin. Tout le reste en voix seule sur les classements, les pages App Store et les captures des apps" },
    { label: "Style", value: "Voix lue mot à mot. Les classements et les chiffres sont posés à l'écran par le montage, jamais lus en entier" },
    { label: "Format", value: "« Ce [truc] ennuyeux rapporte des millions » : trois familles d'apps (métiers, passions, galères), puis ce qui floppe dans les mêmes niches, puis comment trouver la sienne" },
    { label: "Demande", value: "Jonathan's Jam « This Boring Website Earns $6M/Year » 984 000 vues, Niche Pursuits « How This \"BORING\" Website Makes $35,000/Month! » 425 800, Starter Story « I Make $60K/Month From the Most Boring SaaS on the Internet » 319 100, Kimberly Mitchell 245 100. Le format marche pour les sites et les SaaS, presque rien sur les apps, rien en français" },
    { label: "Matière", value: "Classement d'Apple des apps qui rapportent le plus aux États-Unis dans 13 catégories, relevé le 23 nov. 2026 (100 apps par catégorie). Recherche App Store de 18 niches avec le nombre d'avis de chaque app. Prix des abonnements relevés sur les pages App Store le 23/11" },
    { label: "Chiffres", value: "En dollars, uniquement des chiffres publics avec leur source, dite à l'oral : TalkingParents (son fondateur, août 2025), Trucker Path (FreightWaves, 2020), apps de télécommande et de reconnaissance de pièces (estimations Appfigures). Le reste, ce sont des rangs, des avis et des prix, que tout le monde peut vérifier" },
    { label: "Captures", value: "Aucune capture de revenus" },
    { label: "UTM", value: "apps-ennuyeuses" },
  ],
  altTitles: [
    {
      title: "Ces apps ennuyeuses rapportent des millions (et personne n'en parle)",
      why: "Recommandé. Le format « ennuyeux mais riche » des vidéos à 300 000 à 984 000 vues, appliqué aux apps. L'argent est dans le titre, et « personne n'en parle » donne l'impression d'un secret.",
    },
    {
      title: "J'ai fouillé les classements de l'App Store : les apps les plus ennuyeuses rapportent des millions",
      why: "Ajoute l'enquête, plus proche de ton format « j'ai analysé » qui fait des leads. Plus long.",
    },
    {
      title: "Les apps auxquelles personne ne pense rapportent des millions",
      why: "Plus doux, sans le mot « ennuyeuses ». À garder pour un test A/B.",
    },
  ],
  thumbnail: {
    text: "290 PIQUETS",
    layout: `Bloc jaune en haut à gauche avec « 290 PIQUETS » en noir, très gros. En dessous, un iPhone tenu en main qui affiche la vraie capture d'AreaMap : un terrain vu du ciel avec son contour bleu et la bulle « T-posts 290 ». Une flèche rouge du bloc vers la bulle. Toi à droite en gros plan, l'air intrigué, un sourcil levé. Bureau sombre flou. La miniature pose la question (une app qui compte des piquets ?), le titre y répond (les apps ennuyeuses rapportent des millions) sans la répéter.`,
    variant: "Variante B, une image vraiment différente pour le test A/B : bloc jaune « DEVANT BADOO », le téléphone affiche la vraie capture de YarnPal (le dinosaure rose en crochet). Toi à droite, l'air amusé.",
    prompt: `Images 1 and 2 are photos of me: use my exact face, head shape, hairline, skin texture and proportions. Do not beautify, stylize or change my face.
Image 3 is a real screenshot of the app AreaMap (aerial view of a field with a blue outline and a "T-posts 290" bubble): place its phone screen, unchanged, as the screen of the iPhone.
Image 4 is one of my validated thumbnails: copy its background and lighting style.

Layout: 16:9 YouTube thumbnail, 1920x1088.
Top left: a bright yellow rectangular block with huge bold black sans-serif text "290 PIQUETS", perfectly legible, nothing else written.
Left center, below the yellow block: an iPhone held in a hand, screen facing camera, showing image 3, sharp and readable. A thick red curved arrow goes from the yellow block to the "T-posts 290" bubble on the screen.
Right side: me, close-up from mid-chest up, head and shoulders filling about 45% of the frame height, intrigued expression with one eyebrow raised, looking straight at the camera, dark t-shirt.
Background: a real blurred office, dark wood desk, warm lamp, plants, soft bokeh, like image 4. No flat or gradient background, no purple.
Lighting: soft key light on my face, subtle warm rim light, realistic shadows, slight vignette.
Keep 60 px safe margins. No other text, no logos, no extra numbers.
Negative: distorted face, changed identity, extra fingers, warped phone, unreadable text, cluttered layout, fake brand logos, cartoon style.`,
  },
  gift: {
    name: "Les 50 niches ennuyeuses qui rapportent : pour chacune, l'app qui domine, son prix, son nombre d'avis, combien d'apps de la niche n'ont presque rien, et ce que ses utilisateurs lui reprochent",
    url: `https://www.jeremypitault.com/guide/niches-ennuyeuses?${UTM_D}`,
    note: "Page à créer avant de publier, à partir des classements du 23 nov. (~/Projects/reports/2026-11-23-apps-ennuyeuses/charts) : garder les apps de métier, de passion et de galère, enlever les grandes marques, faire la recherche App Store de chaque niche (nombre d'apps, combien sous 20 avis), relever les prix et les avis à 1 et 2 étoiles de l'app qui domine. Annoncé face caméra après la partie 3 (la première grosse valeur), juste avant l'appel avec l'équipe, rappelé à la fin.",
  },
  plan: [
    "Le spectateur a vu, preuves à l'appui, que des apps pour camionneurs, chasseurs, crocheteuses, parents séparés ou gens qui attendent leur carte verte sont parmi celles qui rapportent le plus aux États-Unis.",
    "Il a compris que c'est une piste en plus, pas à la place des apps dont tout le monde parle, qui peuvent très bien rapporter (Shinobi en est une).",
    "Il sait pourquoi elles rapportent : un métier (l'app fait gagner de l'argent), une passion (on dépense déjà pour elle), une galère (on paie pour qu'elle s'arrête).",
    "Il a vu des chiffres en dollars qui tiennent debout, avec leur source : plus de 10 millions par an pour TalkingParents, 3 millions pour Trucker Path dès 2019, 11 millions par mois pour les apps de télécommande.",
    "Il comprend pourquoi personne n'en parle.",
    "Il sait que la niche ne suffit pas : dans chaque niche, des dizaines d'apps n'ont presque aucun avis.",
    "Il a vu ce qui fait gagner : répondre à la vraie question (« combien de piquets », pas « mesurer un terrain ») et apporter quelque chose de plus que les copies, pas un plus beau design.",
    "Il sait trouver sa propre niche en six étapes, et repart avec la liste des 50 niches.",
  ],
  sections: sansVisage([
    {
      time: "0:00",
      title: "Intro en montage : la promesse",
      links: [
        { label: "Classement Navigation, flux d'Apple (23/11)", url: "https://itunes.apple.com/us/rss/topgrossingapplications/limit=100/genre=6010/json" },
        { label: "YarnPal sur l'App Store", url: "https://apps.apple.com/us/app/yarnpal-crochet-patterns/id6738537088" },
        { label: "AreaMap sur l'App Store", url: "https://apps.apple.com/us/app/areamap-measure-land-acres/id6816359797" },
      ],
      beats: [
        {
          show: `Écran noir. Le classement « Navigation · les apps qui rapportent le plus · États-Unis · 23 nov. 2026 » se remplit de bas en haut, puis les trois premières lignes s'allument une par une avec leur icône : onX Hunt, Trucker Path, LandGlide.`,
          say: `Voici le classement des apps qui rapportent le plus aux États-Unis, dans la catégorie Navigation. Numéro un : une carte pour les chasseurs. Numéro deux : un GPS pour les camionneurs. Numéro trois : une app qui te montre à qui appartient chaque terrain.`,
        },
        {
          show: `Le classement Lifestyle, lignes 30 à 34. YarnPal (32e) s'allume en vert, Badoo (33e) juste en dessous.`,
          say: `Dans la catégorie Lifestyle, en 32e position, juste devant Badoo, il y a une app de crochet.`,
        },
        {
          show: `Le classement des utilitaires : Case Tracker (25e) s'allume, puis AreaMap (53e). À côté d'AreaMap, deux étiquettes : « sortie le 29 sept. 2026 » et « publiée par une seule personne ».`,
          say: `Chez les utilitaires, il y a une app pour suivre son dossier d'immigration. Et une app qui calcule combien de piquets il faut pour une clôture. Elle est sortie il y a huit semaines, et elle est publiée au nom d'une seule personne.`,
        },
        {
          show: `D'abord les apps auxquelles tout le monde pense, avec leurs vraies icônes, prises dans les mêmes classements : Cal AI (calories), Opal (blocage des réseaux), I Am Sober (addiction), Summary (productivité), I am (affirmations), une app de langues. Elles glissent sur le côté, puis un mur d'icônes se remplit : une vingtaine d'apps ennuyeuses des classements (camion, cerf, pelote de laine, calculatrice de chantier, télécommande, puits de pétrole). Au centre : « PERSONNE N'EN PARLE ».`,
          say: `On pense tous aux mêmes apps : les compteurs de calories, les apps qui bloquent les réseaux sociaux, celles pour arrêter une addiction, les apps de productivité, d'affirmations, de sport, de langues ou de rencontres. Elles peuvent très bien rapporter, mais elles ne sont pas les seules. Ces apps ennuyeuses rapportent des millions, et personne n'en parle. Dans cette vidéo, je vais te montrer lesquelles, pourquoi elles marchent, pourquoi la plupart des apps de la même niche n'ont presque aucun avis, et comment trouver la tienne.`,
        },
      ],
    },
    {
      time: "0:55",
      title: "Face caméra : qui je suis",
      mode: "visage",
      beats: [
        { show: "Coupe nette sur toi, face caméra, plan poitrine, regard dans l'objectif. Bandeau nom « Jeremy Pitault, créateur de Shinobi »." },
        {
          say: `Moi, c'est Jeremy. J'ai créé Shinobi, une app pour apprendre le japonais, qui fait autour de 400 000 dollars par an. Les langues, c'est une catégorie dont tout le monde parle, et ça marche très bien. Mais en fouillant les classements de l'App Store, je suis tombé sur des apps auxquelles je n'aurais jamais pensé, et qui rapportent énormément.`,
        },
        {
          say: `Une précision honnête avant de commencer. Le classement que je vais te montrer, c'est celui de l'App Store américain, relevé le 23 novembre. Il dit quelles apps rapportent le plus, mais pas combien. Alors les chiffres en dollars, je ne te les donne que quand le créateur les a dits publiquement, ou quand un site sérieux les a estimés, et je te dis à chaque fois d'où ils viennent.`,
        },
        {
          say: `Cette vidéo est pour toi si tu veux créer une app qui rapporte, et que tu cherches des idées auxquelles tu n'aurais pas pensé.`,
        },
      ],
    },
    {
      time: "1:50",
      title: "Le plan",
      beats: [
        {
          show: `Retour au studio. Les 5 parties s'écrivent une par une, puis se rangent en sommaire dans un coin pour toute la vidéo : « Métiers », « Passions », « Galères », « Ce qui floppe », « Trouver la tienne ».`,
          say: `On va voir trois familles d'apps ennuyeuses : celles des métiers, celles des passions et celles des galères. Ensuite, ce qui fait que dans une même niche, une app rapporte pendant que des dizaines d'autres n'ont rien. Et pour finir, comment trouver ta niche à toi.`,
        },
      ],
    },
    {
      time: "2:05",
      title: "Partie 1 : les apps des métiers",
      links: [
        { label: "Trucker Path sur l'App Store", url: "https://apps.apple.com/us/app/trucker-path-truck-gps-fuel/id782746890" },
        { label: "FreightWaves, oct. 2020 (3 M$ de revenus en 2019)", url: "https://www.freightwaves.com/news/seeking-more-sustainable-business-model-trucker-path-monetizes-community-adds-predictive-analytics" },
        { label: "Wellsite Navigator sur l'App Store", url: "https://apps.apple.com/us/app/wellsite-navigator/id594298510" },
        { label: "Construction Master Pro sur l'App Store", url: "https://apps.apple.com/us/app/construction-master-pro-calc/id370406446" },
        { label: "Calculated Industries (la calculatrice de 1985)", url: "https://en.wikipedia.org/wiki/Calculated_Industries" },
      ],
      beats: [
        partCard("PARTIE 1 · LES MÉTIERS"),
        { say: `Première famille : les apps faites pour un métier.` },
        {
          show: `La fiche App Store de Trucker Path : « 2e · Navigation », « 158 460 avis », 4,8 étoiles. Puis ses écrans : la carte des parkings pour camions, les prix du gazole, les stations de pesée.`,
          say: `Trucker Path, c'est l'app des camionneurs américains. Plus d'un million de chauffeurs l'utilisent pour trouver une place où garer leur camion pour la nuit, la station la moins chère pour le gazole, et savoir quelles stations de pesée sont ouvertes.`,
        },
        {
          show: `Zoom sur le prix : « Diamond · 29,99 $ par mois ». Puis l'article de FreightWaves, la phrase surlignée « $3 million in revenue ».`,
          say: `Leur abonnement le plus complet coûte 30 dollars par mois. Et d'après FreightWaves, un média spécialisé dans le transport, l'app faisait déjà 3 millions de dollars de revenus en 2019.`,
        },
        {
          show: `La fiche de Wellsite Navigator : « 18e · Navigation ». Puis le prix : « 199,99 $ par an ».`,
          say: `Encore plus précis : Wellsite Navigator. C'est un GPS pour trouver des puits de pétrole. Les ouvriers des champs pétroliers doivent rejoindre des puits perdus au milieu de nulle part, sur des chemins qui n'ont pas de nom. L'abonnement coûte 20 dollars par mois, ou 200 dollars par an.`,
        },
        {
          show: `Le compteur d'avis de Wellsite Navigator qui s'arrête à « 459 », à côté de son rang « 18e ».`,
          say: `Et regarde le nombre d'avis : 459. Pourtant, elle est 18e des apps de navigation qui rapportent le plus aux États-Unis. Tu n'as pas besoin de millions d'utilisateurs quand chacun paie 200 dollars par an. Et l'app vend aussi des comptes pour des équipes entières : là, c'est l'entreprise qui paie.`,
        },
        {
          show: `Construction Master Pro : « 36e · Utilitaires », son clavier de calculatrice, puis une photo de la calculatrice physique Construction Master.`,
          say: `Et mon préféré : Construction Master Pro, 36e des utilitaires. C'est une calculatrice pour les charpentiers, les couvreurs et les maçons. Elle calcule en pieds, en pouces et en fractions, les escaliers, les toitures, le béton. À l'origine, c'est une calculatrice physique, vendue depuis 1985. L'entreprise l'a simplement mise dans un téléphone.`,
        },
        {
          show: `Retour sur le vrai écran de Trucker Path : la carte des parkings, une place libre qui s'allume, et à côté le prix « 29,99 $ » du Diamond.`,
          say: `La leçon : quand ton app fait gagner du temps ou de l'argent à quelqu'un dans son travail, le prix ne lui fait pas peur. Un camionneur qui trouve sa place en cinq minutes au lieu de tourner pendant une heure ne se demande pas si 30 dollars par mois, c'est cher.`,
        },
      ],
    },
    {
      time: "4:30",
      title: "Partie 2 : les apps des passions",
      links: [
        { label: "DeerCast sur l'App Store", url: "https://apps.apple.com/us/app/deercast-prep-predict-pursue/id1425879996" },
        { label: "HuntStand sur l'App Store (même éditeur)", url: "https://apps.apple.com/us/app/huntstand-gps-maps-tools/id778772892" },
        { label: "YarnPal sur l'App Store", url: "https://apps.apple.com/us/app/yarnpal-crochet-patterns/id6738537088" },
        { label: "Sewpal sur l'App Store (même éditeur)", url: "https://apps.apple.com/us/app/sewpal-sewing-pattern-guide/id6754315885" },
        { label: "CoinSnap sur l'App Store", url: "https://apps.apple.com/us/app/coinsnap-coin-identifier/id1634551626" },
        { label: "WoodSense sur l'App Store (même éditeur)", url: "https://apps.apple.com/us/app/woodsense-wood-plans-guides/id6754165620" },
        { label: "Appfigures, mai 2025 (apps d'identification, 3,5 M$/mois pour les pièces)", url: "https://appfigures.com/resources/this-week-in-apps/20250509" },
      ],
      beats: [
        partCard("PARTIE 2 · LES PASSIONS"),
        { say: `Deuxième famille : les passions. Et là, ça devient encore plus étonnant.` },
        {
          show: `Le classement Météo, lignes 1 à 7 : The Weather Channel, Clime, AccuWeather, Surfline, puis DeerCast (5e) s'allume, devant Windy et MyRadar.`,
          say: `Voici le classement des apps de météo qui rapportent le plus aux États-Unis. Les géants de la météo, une app de surf, et en cinquième position, devant des apps de météo connues dans le monde entier : DeerCast, la météo des chasseurs de cerfs.`,
        },
        {
          show: `Les écrans de DeerCast : la prévision des déplacements des cerfs, heure par heure. Puis l'icône de HuntStand avec « 5e · Sport ».`,
          say: `Elle ne te dit pas s'il va pleuvoir. Elle te dit à quelle heure les cerfs vont bouger, d'après la météo de ton coin. Son abonnement le plus cher coûte 75 dollars. Et le même éditeur a une autre app de chasse, HuntStand, qui est 5e des apps de sport.`,
        },
        {
          show: `Le classement Lifestyle, lignes 30 à 40 : YarnPal (32e) en vert, Badoo (33e), Coffee Meets Bagel (39e).`,
          say: `Maintenant, le crochet. YarnPal est 32e des apps Lifestyle qui rapportent le plus aux États-Unis. Devant Badoo, et devant Coffee Meets Bagel, deux apps de rencontre connues dans le monde entier.`,
        },
        {
          show: `Les écrans de YarnPal : le dinosaure rose en crochet, « 500+ Patterns For All Level », « 10 mins Patterns for Beginners ». Puis l'icône de Sewpal avec « 55e ».`,
          say: `L'app te donne plus de 500 modèles de crochet, classés par niveau, avec des modèles de dix minutes pour les débutants. Elle est sortie en décembre 2024, et elle a déjà plus de 35 000 avis. Un an plus tard, le même éditeur a sorti la même app pour la couture, Sewpal, qui est déjà 55e de sa catégorie.`,
        },
        {
          show: `Quatre icônes du même éditeur côte à côte, chacune avec son rang : CoinSnap (pièces de monnaie), Rock Identifier (pierres), WoodSense (travail du bois), ToyWorth (jouets). Puis le tableau d'Appfigures sur les apps d'identification.`,
          say: `D'autres éditeurs font exactement pareil. Un seul éditeur a une app pour reconnaître les pièces de monnaie en photo, une pour les pierres, une pour le travail du bois et une pour estimer la valeur des jouets, et elles sont toutes dans les classements. D'après Appfigures, en mai 2025, les apps qui reconnaissent les pièces de monnaie faisaient à elles seules environ 3,5 millions de dollars par mois.`,
        },
        {
          show: `Les vrais écrans côte à côte, chacun avec son rang : la prévision des cerfs de DeerCast, le dinosaure en crochet de YarnPal, une pièce reconnue par CoinSnap.`,
          say: `La leçon : une app ennuyeuse, c'est une app qui ne t'intéresse pas, toi. Pour quelqu'un qui chasse tous les week-ends ou qui fait du crochet tous les soirs, elle n'a rien d'ennuyeux. Et quelqu'un qui dépense déjà de l'argent pour sa passion ne trouve pas qu'un abonnement de plus soit cher.`,
        },
      ],
    },
    {
      time: "6:50",
      title: "Partie 3 : les apps des galères",
      links: [
        { label: "TalkingParents sur l'App Store", url: "https://apps.apple.com/us/app/talkingparents-co-parent-app/id1092220726" },
        { label: "Le fondateur de TalkingParents, Practical Founders Podcast (août 2025)", url: "https://practicalfounders.com/podcast/co-parenting-app-reaches-10m-arr-pure-bootstrap-growth-vince-mayfield/" },
        { label: "Case Tracker sur l'App Store", url: "https://apps.apple.com/us/app/case-tracker-for-uscis-nvc/id921827126" },
        { label: "SnoreLab, page presse (15 millions de téléchargements)", url: "https://www.snorelab.com/press-and-media/" },
        { label: "Appfigures, juin 2025 (télécommandes, 11 M$/mois)", url: "https://appfigures.com/resources/insights/20250613" },
        { label: "TV Remote sur l'App Store (abonnement à la semaine)", url: "https://apps.apple.com/us/app/tv-remote-universal-control/id1539090879" },
      ],
      beats: [
        partCard("PARTIE 3 · LES GALÈRES"),
        { say: `Troisième famille, et c'est peut-être la plus puissante : les galères. Des problèmes que personne ne choisit d'avoir.` },
        {
          show: `La fiche de TalkingParents : « 25e · Productivité ». Ses écrans : la messagerie, le calendrier de garde, l'export des échanges.`,
          say: `TalkingParents, c'est une messagerie pour les parents séparés. Tous les messages sont enregistrés, ils ne peuvent être ni modifiés ni supprimés, et on peut les présenter devant un juge. Aux États-Unis, certains juges demandent même aux parents de passer par une app comme celle-là.`,
        },
        {
          show: `La phrase du fondateur à l'écran, avec la source « Practical Founders Podcast, août 2025 » : « plus de 10 millions de dollars par an · 100 000 clients qui paient · aucun investisseur ».`,
          say: `Son fondateur l'a dit publiquement en 2025 : plus de 10 millions de dollars de revenus par an, 100 000 clients qui paient, et ils n'ont jamais levé d'argent auprès d'investisseurs.`,
        },
        {
          show: `La fiche de Case Tracker for USCIS & NVC : « 25e · Utilitaires », « 322 227 avis ».`,
          say: `Case Tracker sert à suivre son dossier d'immigration américain : la carte verte, le visa, la nationalité. Quand toute ta vie dépend d'un dossier, tu regardes où il en est tous les jours. L'app dit avoir plus de 2 millions d'utilisateurs.`,
        },
        {
          show: `SnoreLab : « 4e · Médical », l'enregistrement d'une nuit avec les pics de ronflement.`,
          say: `SnoreLab, elle, enregistre tes ronflements pendant la nuit et te montre à quels moments tu ronfles. Elle a été créée par un développeur qui avait appris à coder tout seul. Elle est 4e des apps médicales qui rapportent le plus aux États-Unis, et elle a dépassé les 15 millions de téléchargements.`,
        },
        {
          show: `Le classement des utilitaires : TV Remote (3e), puis huit apps de télécommande qui s'allument dans le top 50. Puis le tableau d'Appfigures.`,
          say: `Et la galère la plus bête de toutes : la télécommande perdue. Une app de télécommande pour la télé est 3e des utilitaires, et il y en a huit dans le top 50. D'après Appfigures, en juin 2025, ces apps faisaient 11 millions de dollars par mois, et 21 d'entre elles avaient dépassé le million sur un an.`,
        },
        {
          show: `Zoom sur le prix de TV Remote : « Weekly Premium · 6,99 $ ».`,
          say: `Attention quand même : beaucoup de ces apps vivent d'abonnements à la semaine. Celle-là coûte jusqu'à 7 dollars par semaine pour une télécommande. Je ne te conseille pas de copier ça : les gens se sentent piégés, ils annulent et ils laissent une mauvaise note. Copie la galère, pas le piège.`,
        },
        {
          show: `Les quatre fiches des galères empilées, chacune avec son rang : TalkingParents, Case Tracker, SnoreLab, TV Remote.`,
          say: `La leçon : quand un problème te fait peur, t'empêche de dormir ou bloque ta vie, tu ne compares pas les prix. Tu paies pour qu'il disparaisse.`,
        },
      ],
    },
    {
      time: "9:10",
      title: "Le cadeau, et l'appel avec ton équipe",
      mode: "visage",
      beats: [
        {
          say: `J'ai relevé ces classements catégorie par catégorie, et j'en ai sorti les 50 niches ennuyeuses qui rapportent. Pour chacune : l'app qui domine, ce qu'elle coûte, son nombre d'avis, combien d'apps de la même niche n'ont presque rien, et ce que ses utilisateurs lui reprochent. C'est gratuit, le lien est en premier dans la description.`,
          show: `À côté de toi, la couverture du guide des 50 niches, et en dessous « lien en description », 4 secondes, sans couper la parole.`,
        },
        {
          say: `Et d'ailleurs, avec mon équipe, on accompagne des gens qui créent leur app. Si tu en as déjà une, ou si tu aimerais qu'on t'aide à trouver ton idée, il y a aussi un lien dans la description pour réserver un appel avec nous. On regarde ensemble où tu en es, comment on peut t'aider, et si ton profil correspond aux personnes qu'on accompagne.`,
          show: `Dans le même plan, la vraie page de réservation (jeremypitault.com/rdv) glisse à côté de toi, 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "10:00",
      title: "Pourquoi personne n'en parle",
      beats: [
        { say: `Tu te demandes peut-être pourquoi personne n'en parle. Il y a trois raisons.` },
        {
          show: `Le mur d'icônes de l'intro revient, un chiffre « 1 », « 2 », « 3 » en pastille bleue à chaque raison. Au « trois », le mot « snore » se tape dans la recherche de l'App Store et SnoreLab apparaît en tête des résultats.`,
          say: `Un : leurs créateurs n'ont aucun intérêt à le dire. Chaque vidéo sur leur app ferait venir des concurrents. Deux : elles ne font pas rêver. Une calculatrice pour charpentiers, ça ne fait pas de vues sur YouTube. Trois : elles n'ont pas besoin qu'on parle d'elles. Quand quelqu'un te dit que tu ronfles, tu ne cherches pas une vidéo : tu tapes ton problème dans l'App Store, et tu télécharges une des premières apps qui sortent.`,
        },
      ],
    },
    {
      time: "10:40",
      title: "Partie 4 : ce qui floppe, la niche ne suffit pas",
      links: [
        { label: "AreaMap sur l'App Store (261 avis, 53e)", url: "https://apps.apple.com/us/app/areamap-measure-land-acres/id6816359797" },
        { label: "GPS Fields Area Measure (13 258 avis, hors classement)", url: "https://apps.apple.com/us/app/id1123033235" },
        { label: "FieldCalc (10 262 avis, hors classement)", url: "https://apps.apple.com/us/app/id1238984272" },
        { label: "rackline.ai sur l'App Store", url: "https://apps.apple.com/us/app/rackline-ai-ai-deer-scoring/id6751832231" },
        { label: "GreenScore (78e)", url: "https://apps.apple.com/us/app/id6790125863" },
        { label: "Mainbeam (1 avis)", url: "https://apps.apple.com/us/app/id6813911478" },
      ],
      beats: [
        partCard("PARTIE 4 · CE QUI FLOPPE"),
        { say: `Maintenant, attention. Si tu te dis « parfait, je fais une app de crochet », tu vas probablement te planter.` },
        {
          show: `La recherche « crochet » sur l'App Store américain : la liste défile, chaque app avec son nombre d'avis. Compteur « 84 apps », puis « 49 avec moins de 20 avis » en rouge. YarnPal reste en vert en haut : « 35 571 avis ».`,
          say: `J'ai tapé « crochet » dans l'App Store américain. Il y a 84 apps qui ont « crochet » dans leur nom. YarnPal a plus de 35 000 avis. Et 49 d'entre elles en ont moins de 20.`,
        },
        {
          show: `Même chose, en deux lignes : « pièces de monnaie · 91 apps · 44 sous 20 avis », « mesurer un terrain · 93 apps · 66 sous 20 avis ».`,
          say: `C'est pareil partout. Pour reconnaître des pièces de monnaie, 44 apps sur 91 ont moins de 20 avis. Pour mesurer un terrain, 66 sur 93. Dans chaque niche ennuyeuse, il y a une poignée d'apps qui prennent presque tout, et des dizaines qui n'ont presque rien.`,
        },
        {
          show: `Les captures des apps de mesure les plus anciennes, côte à côte : « GPS Field Area », « Measure Routes », « Pro mode: cut hole », « Flexible Export Formats ». Leurs avis : 13 258 et 10 262.`,
          say: `Ce qui fait la différence se voit très bien sur ces apps pour mesurer un terrain. Les deux plus anciennes ont plus de 10 000 avis chacune. Sur leurs captures d'écran, elles disent toutes la même chose : mesure la surface de ton champ, mesure des distances, exporte tes mesures.`,
        },
        {
          show: `Les quatre captures d'AreaMap, une par une : « How many T-posts? 290 », « How much wire? 11 rolls », « How many tons? 36 tons », « How much mulch? ». La traduction en bas de l'écran.`,
          say: `Et voici les captures d'AreaMap, l'app sortie il y a huit semaines. « Combien de piquets ? 290. » « Combien de fil ? 11 rouleaux. » « Combien de tonnes de gravier ? 36. » « Combien de paillis ? »`,
        },
        {
          say: `Personne ne veut mesurer un terrain. On mesure un terrain parce qu'on va poser une clôture, et qu'on doit savoir combien de piquets acheter. Les autres apps vendent ce qu'elles font. AreaMap répond à la question que la personne se pose vraiment : elle transforme un terrain en liste de courses. Et elle dit à qui elle s'adresse : les clôturiers, les paysagistes, les entreprises de béton, les agriculteurs.`,
        },
        {
          show: `La fiche d'AreaMap : « 53e · Utilitaires », « sortie le 29 sept. 2026 », « Nathan La Mar Burnett », « 261 avis », « 69,99 $ par an ». À côté, les deux plus anciennes avec « absente des classements » en gris.`,
          say: `Résultat : avec seulement 261 avis, AreaMap est déjà 53e des utilitaires qui rapportent le plus aux États-Unis. Les deux plus anciennes, avec leurs 10 000 avis, ne sont dans aucun des classements que j'ai relevés. Et AreaMap est publiée au nom d'une seule personne.`,
        },
        {
          show: `Côte à côte : à gauche les captures des anciennes (« Measure Routes », « Flexible Export Formats »), à droite celles d'AreaMap (« How many T-posts? 290 »).`,
          say: `La leçon : ne vends pas ce que fait ton app. Vends la réponse à la question que ton utilisateur se pose.`,
        },
        {
          show: `Les captures de rackline.ai : « Score any buck in seconds », la photo du cerf et le score. Sa fiche : « 54e · Sport », « sortie en sept. 2025 », « Nathan Jewell ».`,
          say: `Deuxième exemple, et il montre un autre piège. Aux États-Unis, les chasseurs donnent un score aux bois des cerfs, en les mesurant. rackline.ai le fait avec l'IA, à partir d'une simple photo. Elle est sortie en septembre 2025, publiée au nom d'une seule personne, et elle est 54e des apps de sport qui rapportent le plus aux États-Unis.`,
        },
        {
          show: `Ses deux prix côte à côte : « Chasseurs · 49,99 $ par an », « Guides de chasse · 499,99 $ par an ».`,
          say: `Elle a même deux sortes de clients : les chasseurs, à 50 dollars par an, et les guides de chasse, qui paient 500 dollars par an pour apparaître dans l'app.`,
        },
        {
          show: `La liste des apps de score de cerf sorties depuis, avec leurs avis : GreenScore 33 (78e, en vert), puis en rouge UrScore 11, Rackscore 8, Mainbeam 1, First Light 0, Bucksign 0.`,
          say: `Évidemment, les copies sont arrivées. GreenScore est sortie en juillet avec quelque chose en plus, les meilleures heures pour chasser chaque jour, et elle est 78e. Mais regarde les suivantes. UrScore, 11 avis. Rackscore, 8. Mainbeam, 1 seul avis, alors que c'est la plus belle de toutes. First Light, zéro. Et Bucksign, zéro, sortie le 18 novembre.`,
        },
        {
          show: `Les captures de Mainbeam en grand, très soignées, et le compteur « 1 avis ».`,
          say: `La leçon : une niche qui marche attire des copies, et la plupart ne décollent jamais. Une app plus jolie ne suffit pas. Si quelqu'un est déjà installé dans ta niche, il te faut une meilleure réponse que la sienne, pas la même app avec un plus beau design.`,
        },
      ],
    },
    {
      time: "14:00",
      title: "Partie 5 : trouver ta niche ennuyeuse",
      beats: [
        partCard("PARTIE 5 · TROUVER LA TIENNE"),
        { say: `Dernière partie : comment trouver ta niche ennuyeuse. Voici ce que je ferais, dans l'ordre.` },
        {
          show: `Le classement des utilitaires qui défile vers le bas, les grandes marques grisées, les apps étonnantes entourées.`,
          say: `Un : ouvre le classement des apps qui rapportent le plus, catégorie par catégorie. L'App Store de ton iPhone ne le montre pas, mais des sites comme Appfigures l'affichent. Ne regarde pas le haut du classement, il est plein de grandes marques. Descends, et note toutes les apps qui te font dire « ah bon, ça existe ? ».`,
        },
        {
          say: `Deux : pense aux métiers, aux passions et aux galères autour de toi. Le métier de tes parents, la passion de ton oncle, la galère administrative que tu as vécue l'an dernier.`,
        },
        {
          show: `La recherche « tape measure » sur l'App Store : en haut, des apps à 90 000 avis, en dessous, des dizaines à moins de 20.`,
          say: `Trois : tape ta niche dans la recherche de l'App Store, et vérifie deux choses. Il faut au moins une app avec des milliers d'avis : ça prouve que des gens la téléchargent. Et regarde les captures de toutes les autres : si elles vendent toutes la même fonction, comme les apps de mesure de terrain, il y a de la place pour la bonne réponse.`,
        },
        {
          say: `Quatre : lis les avis à une et deux étoiles de l'app qui domine. Chaque reproche, c'est une chose que ton app peut faire mieux.`,
        },
        {
          say: `Cinq : trouve la question que ton utilisateur se pose vraiment. Pas « mesurer un terrain », mais « combien de piquets acheter ». C'est cette phrase qui va sur ta première capture d'écran, et dans ton onboarding.`,
        },
        {
          say: `Et six : va là où ces gens passent leur temps. Les chasseurs, les camionneurs, les gens qui font du crochet ont tous leurs comptes préférés sur TikTok et Instagram. Une vidéo qui parle de leur galère à eux, avec leurs mots, peut faire connaître ton app sans payer de pub.`,
        },
      ],
    },
    {
      time: "16:10",
      title: "Récap et fin",
      mode: "visage",
      beats: [
        {
          say: `Si tu ne retiens qu'une chose : les apps dont tout le monde parle peuvent très bien rapporter, la mienne en est une, mais ce ne sont pas les seules. Il y a aussi des apps pour un métier, une passion ou une galère, qui répondent à une question précise, pour des gens qui paient déjà pour leur problème. Et dans chaque niche, celle qui gagne n'est pas la plus belle : c'est celle qui répond le mieux à cette question.`,
        },
        {
          say: `La liste des 50 niches ennuyeuses est en premier dans la description. Et si tu veux qu'on regarde ensemble ton idée d'app, tu peux réserver un appel avec mon équipe, le lien est aussi dans la description.`,
        },
        {
          say: `Dis-moi en commentaire l'app la plus ennuyeuse pour laquelle tu paies. Et si cette vidéo t'a servi, abonne-toi.`,
        },
      ],
    },
  ]),
  description: `🎁 GRATUIT : les 50 niches ennuyeuses qui rapportent (l'app qui domine, son prix, son nombre d'avis, et ce que ses utilisateurs lui reprochent) : https://www.jeremypitault.com/guide/niches-ennuyeuses?${UTM_D}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_D}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_D}

Un GPS pour camionneurs, une météo pour chasseurs de cerfs, une app de crochet classée devant Badoo, une messagerie pour parents séparés à plus de 10 millions de dollars par an, et des apps de télécommande qui font 11 millions de dollars par mois. J'ai relevé le classement des apps qui rapportent le plus aux États-Unis, catégorie par catégorie : les plus ennuyeuses sont parmi celles qui rapportent le plus. Je te montre pourquoi elles marchent, pourquoi la plupart des apps de la même niche n'ont presque aucun avis, et comment trouver la tienne.

👉 Dis-moi en commentaire l'app la plus ennuyeuse pour laquelle tu paies.

0:00 Introduction
2:05 Les apps des métiers
4:30 Les apps des passions
6:50 Les apps des galères
10:00 Pourquoi personne n'en parle
10:40 Ce qui floppe
14:00 Trouver ta niche
16:10 Récap

Sources : classement des apps qui rapportent le plus sur l'App Store américain, relevé le 23/11/2026 ; TalkingParents (Practical Founders Podcast, août 2025) ; Trucker Path (FreightWaves, oct. 2020) ; apps de télécommande et de reconnaissance de pièces (estimations Appfigures, 2025).

#applicationmobile #idéeapp #créeruneapp #appmobile #appstore #entrepreneur #businessenligne`,
  shorts: [
    "« Une app de crochet classée devant Badoo » (partie 2, 30 s).",
    "« Personne ne veut mesurer un terrain » : les captures d'AreaMap contre les autres (partie 4, 45 s).",
    "« Une messagerie pour parents séparés : plus de 10 millions de dollars par an » (partie 3, 30 s).",
    "« La plus belle des copies : 1 seul avis » (partie 4, 35 s).",
  ],
  prepare: [
    "Tournage, parties face caméra : « qui je suis », « le cadeau » et « récap et fin ». Fais chacune 2 ou 3 fois en entier, en 4K, mise au point et exposition verrouillées.",
    "Tournage, tout le reste : ta voix seule au micro, à 20 ou 30 cm, en lisant le script. Un fichier par partie, dis le nom de la partie au début et laisse 10 secondes de silence. Si tu te trompes, tais-toi 2 secondes et reprends la phrase depuis son début.",
    "Rushs dans ~/Movies/Rushs/2026-11-apps-ennuyeuses/ (hors iCloud), fichiers d'origine.",
    "Matière pour le montage dans ~/Projects/reports/2026-11-23-apps-ennuyeuses/ : les classements du 23/11 (charts/, un JSON par catégorie), les fiches des apps (candidats.json), la recherche des 18 niches (niches.json) et les planches de captures (shots/ : cerf, terrain, crochet). Les classements sont refaits en cartes animées datées « 23 nov. 2026 », pas en captures de site : les rangs bougent chaque jour.",
    "À vérifier avant de tourner : qu'Appfigures affiche bien gratuitement le classement des apps qui rapportent le plus (partie 5). Sinon, dire « des sites spécialisés ».",
    "Photo de la calculatrice physique Construction Master (site de Calculated Industries) pour la partie 1.",
    "Avant de publier : créer le cadeau /guide/niches-ennuyeuses (les 50 niches) et son email de livraison.",
    "Aucun élève, aucune capture de revenus de Shinobi : c'est une vidéo grand public.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs", state: "OK" },
    { point: "3 vidéos à plus de 50 000 vues sur le format", state: "OK (984 000, 425 800, 319 100), aucune sur les apps en français" },
    { point: "Argent dans le titre, format prouvé, psychologie écrite", state: "OK" },
    { point: "Sujet différent des vidéos A, B et C (quelle app créer, pas comment la vendre)", state: "OK" },
    { point: "Pure valeur : aucun élève, rien qui ressemble à une page de vente", state: "OK" },
    { point: "Ce qui marche ET ce qui floppe", state: "OK (AreaMap contre les anciennes, rackline contre ses copies, des niches à moitié vides)" },
    { point: "Chaque chiffre en dollars a sa source, dite à l'oral", state: "OK (vérifiés le 23/11)" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "Appel avec l'équipe au milieu, juste après le cadeau (demandé par Jeremy le 23/11), rappelé en 1 phrase à la fin, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "À créer (les 50 niches)" },
    { point: "Miniature : 3 ou 4 mots, preuve visible, visage à droite, ne répète pas le titre", state: "OK" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

// D en premier : la vidéo de jeudi 26 nov. 2026.
export const SCRIPTS: VideoScript[] = [SCRIPT_D, SCRIPT_B, SCRIPT_A];
