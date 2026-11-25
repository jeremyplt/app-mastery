import type { ScriptSection, VideoScript } from "./types";

// Fichier lu seulement par page.tsx (composant serveur) : ne jamais l'importer
// dans un composant client, sinon les scripts partent dans le bundle public.
//
// Scripts YouTube prêts à tourner. Sources des chiffres : RevenueCat des élèves
// (déjà publiés sur /temoignages), conversations WhatsApp du CRM, base de
// conseils validés (whatsapp_conseils) et dossier YouTube du 12 nov. 2026.

const UTM_A = "utm_source=youtube&utm_medium=video&utm_campaign=premieres-ventes-triche";

// Vidéo A, réécrite le 23 nov. 2026 en pure valeur, comme la vidéo B : aucun élève,
// aucune capture de revenus. Chiffres : recherche des flops du 18 nov. 2026
// (~/Projects/reports/2026-11-18-flops/, tiktok.md et instagram-et-pubs.md).
// La vidéo B dit quoi poster ; celle-ci dit comment passer de zéro à tes premières
// ventes : qui viser, quoi copier, où mettre le nom, combien publier, quoi mesurer.
const SCRIPT_A: VideoScript = {
  slug: "premieres-ventes-triche",
  label: "Vidéo A · Triche",
  status: "Prêt à tourner",
  updatedAt: "23 nov. 2026",
  title: "Comment faire tes premières ventes sur ton app si vite que ça ressemble à de la triche",
  why: `Le marketing est le blocage n°1 de ceux qui ont une app, et « combien de comptes, à quel rythme » est la question qu'on te pose le plus. Version du 23 nov. : même esprit que la vidéo B, qui a eu de bons retours. De la pure valeur, aucun élève, aucune capture de revenus. La vidéo B disait quoi poster ; celle-ci donne la méthode complète, de la première vidéo à la première vente, montrée avec de vraies vidéos d'apps.`,
  facts: [
    { label: "Durée", value: "13 à 15 min (environ 2 100 mots de voix)" },
    { label: "Style", value: "Semi-scripté face caméra : ouverture, plan et transitions mot à mot, les exemples peuvent se raconter plus librement. Les vidéos citées passent en plein écran pendant que tu parles" },
    { label: "Format", value: "« Comment obtenir X si vite que ça ressemble à de la triche » : méthode en 6 étapes, chaque étape montrée avec une vraie vidéo d'app" },
    { label: "Demande", value: "8 vidéos à plus de 50 000 vues sur « faire connaître son app » (plancher 50 à 80 k, plafond environ 300 k), aucune en français. Le format « triche » : de 468 000 à 7,4 M de vues selon les niches, 551 000 en français." },
    { label: "Matière", value: "Recherche du 18 nov. : 14 comptes officiels d'apps sur TikTok et 7 sur Instagram, plus de 100 vidéos regardées image par image, plus de 4 500 commentaires lus. Vues relevées le 18/11" },
    { label: "Captures", value: "Aucune capture de revenus" },
    { label: "UTM", value: "premieres-ventes-triche" },
  ],
  altTitles: [
    {
      title: "Comment faire tes premières ventes sur ton app si vite que ça ressemble à de la triche",
      why: "Recommandé. Ton public croit qu'une app met six mois à un an à rapporter et qu'il faut un budget pub. « Triche » promet un raccourci légitime (copier ce qui a déjà marché), « ventes » met l'argent en premier.",
    },
    {
      title: "Si je devais faire vendre une app en partant de zéro, je ferais exactement ça",
      why: "Raccourci d'expert, colle bien à une vidéo sans preuve d'élèves. Plus faible sur l'argent, à garder pour un test A/B.",
    },
    {
      title: "Cette app n'était même pas sortie : 9,4 millions de vues. La méthode pour vendre la tienne",
      why: "Plus intrigant, construit sur l'ouverture Forméa. Il promet surtout des vues, donc en troisième.",
    },
  ],
  thumbnail: {
    text: "0 € DE PUB",
    layout: `Bloc jaune en haut à gauche avec « 0 € DE PUB » en noir, très gros. En dessous, un iPhone tenu en main qui affiche une vidéo verticale de pilates (un ventre plat, texte « Pilates >>> ») avec un compteur « 9,4 M » et un petit badge « APP PAS SORTIE ». Une flèche rouge du bloc vers le compteur. Toi à droite en gros plan, l'air sincèrement étonné, regard caméra. Bureau en bois sombre flou, lampe, bokeh. La miniature pose la question (comment une app pas encore sortie fait 9,4 millions de vues sans pub), le titre y répond (la méthode, jusqu'aux ventes).`,
    variant: "Variante B : bloc jaune « MÊME VIDÉO », deux téléphones côte à côte avec la même image, l'un affiche « 963 K », l'autre « 5 400 » en rouge. Toi à droite, l'air perplexe.",
    prompt: `Images 1 and 2 are photos of me: use my exact face, head shape, hairline, skin texture and proportions. Do not beautify, stylize or change my face.
Image 3 is one of my validated thumbnails: copy its background and lighting style.

Layout: 16:9 YouTube thumbnail, 1920x1088.
Top left: a bright yellow rectangular block with huge bold black sans-serif text "0 € DE PUB", perfectly legible, nothing else written.
Left center, below the yellow block: an iPhone held in a hand, screen facing camera, showing a vertical short video: a woman's toned stomach in workout clothes, filmed in a bright room, with the white on-screen text "Pilates >>>". On the right edge of that video, a view counter "9,4 M" with an eye icon. A small dark rounded badge at the top of the screen reads "APP PAS SORTIE". No real app logo, no brand name. A thick red curved arrow goes from the yellow block to the view counter.
Right side: me, close-up from mid-chest up, head and shoulders filling about 45% of the frame height, genuinely amazed expression, looking straight at the camera, dark t-shirt.
Background: a real blurred office, dark wood desk, warm lamp, plants, soft bokeh, like image 3. No flat or gradient background, no purple.
Lighting: soft key light on my face, subtle warm rim light, realistic shadows, slight vignette.
Keep 60 px safe margins. No other text, no logos, no extra numbers.
Negative: distorted face, changed identity, extra fingers, warped phone, unreadable numbers, cluttered layout, fake brand logos, nudity, cartoon style.`,
  },
  gift: {
    name: "Le prompt contenu viral (existant)",
    url: `https://www.jeremypitault.com/guide/prompt-contenu-viral?${UTM_A}`,
    note: "Il colle à l'étape 3 (refaire pour ton app une vidéo qui a déjà marché) et a déjà amené 45 leads et un client. Annoncé juste après l'étape 3, rappelé dans le récap. Le RDV n'arrive qu'à la fin, en deux phrases.",
  },
  plan: [
    "Le spectateur sait qu'une vue ne vaut pas une autre, et il choisit avant de poster un public qui peut payer (âge, pays, langue, plateforme).",
    "Il sait trouver des vidéos d'apps qui ont déjà marché, et reconnaître les fausses percées achetées.",
    "Il sait refaire une de ces vidéos pour son app en quelques minutes, en copiant le format et pas la vidéo (la partie « triche »).",
    "Il sait où mettre le nom de son app, et ce que change le fait de le cacher, de le dire ou de faire commenter un mot.",
    "Il connaît le volume (comptes, vidéos par jour, plateformes), comment ne pas se faire bloquer, et pourquoi il faut reposter ce qui a marché.",
    "Il repart avec les quatre chiffres qui disent où ça casse, de la vue à la vente.",
  ],
  sections: [
    {
      time: "0:00",
      title: "Ouverture : promesse, preuve, plan, public",
      links: [
        { label: "Forméa, « Pilates >>> » (9,4 M)", url: "https://www.tiktok.com/@formea.pilates/video/7678283526629903638" },
        { label: "Forméa, « My waist routine >>> » (18 500)", url: "https://www.tiktok.com/@formea.pilates/video/7700640872026623265" },
      ],
      beats: [
        { show: "Face caméra, plan serré, pas de musique pendant les 10 premières secondes." },
        {
          say: `Cette vidéo de cinq secondes a fait 9 millions 400 000 vues. Elle a été postée par une app de pilates, Forméa. Et le plus fou, c'est que l'app n'était même pas encore sortie.`,
          show: `Plein écran : la vidéo Forméa « Pilates >>> », le compteur monte jusqu'à 9,4 M. Petit badge « APP PAS ENCORE SORTIE ».`,
        },
        {
          say: `Un ventre, deux mots à l'écran, une musique. Pas de pub, pas d'influenceuse payée, pas de budget. Et dans la légende, un lien pour s'inscrire sur la liste d'attente.`,
        },
        {
          say: `Quand on regarde ce que font les apps qui décollent sans pub, ça ressemble presque à de la triche. Elles n'inventent rien. Elles prennent un format qui a déjà marché, elles le refont pour leur app, et elles le postent encore et encore. Cette méthode, je te la donne dans cette vidéo, étape par étape, jusqu'à tes premières ventes.`,
        },
        {
          say: `Moi, c'est Jeremy. J'ai créé Shinobi, une app pour apprendre le japonais. Pour préparer cette vidéo, on a épluché avec mon équipe les comptes de 21 apps sur TikTok et Instagram, plus de 100 vidéos regardées image par image et plus de 4 500 commentaires lus, pour voir ce qui fait vraiment la différence.`,
          show: `Bandeau nom « Jeremy Pitault, créateur de Shinobi ».`,
        },
        {
          say: `On va voir six étapes. Un : choisir qui tu vises, avant même de poster. Deux : trouver des vidéos qui ont déjà marché, et ne pas te faire avoir par les fausses. Trois : les refaire pour ton app, c'est la partie qui ressemble vraiment à de la triche. Quatre : où mettre le nom de ton app. Cinq : combien de comptes et combien de vidéos par jour, sans te faire bloquer. Et six : les quatre chiffres qui te disent où ça casse entre la vue et la vente.`,
          show: `Texte à l'écran : les 6 étapes, une ligne chacune, qui restent en sommaire dans un coin pendant la vidéo.`,
        },
        {
          say: `Je te préviens tout de suite : ce n'est pas magique. Sur le même compte, deux mois plus tard, Forméa a reposté le même ventre avec un autre texte. 18 500 vues. Il faut publier tous les jours pendant des semaines, et la plupart de tes vidéos feront peu de vues. Ce qui ressemble à de la triche, c'est que tu n'as plus à deviner ce qui marche.`,
          show: `Les deux vidéos Forméa côte à côte : 9,4 M en vert, 18 500 en rouge.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou si tu es en train d'en créer une avec l'IA, et que ton vrai problème, c'est que personne ne la connaît. Tu n'as pas besoin d'être marketeur, et tu n'as même pas besoin de montrer ton visage.`,
        },
      ],
    },
    {
      time: "1:45",
      title: "Étape 1 : choisis qui tu vises, avant de poster",
      beats: [
        {
          say: `La première étape, presque personne ne la fait, et c'est pour ça que beaucoup font des vues sans faire une seule vente : une vue n'est pas égale à une autre vue.`,
        },
        {
          say: `Un million de vues d'ados de 15 ans, ça ne paie pas un abonnement. Ils n'ont pas de carte bancaire. Pareil pour les pays où le pouvoir d'achat est faible : tu peux exploser en vues et ne rien vendre. Et sur la plupart des apps, l'iPhone paie mieux qu'Android.`,
          show: `Animation : deux compteurs de vues identiques, « 1 M ». Sous le premier, « 15 ans », sous le second, « 30 ans, États-Unis ». Seul le second fait tomber des pièces.`,
        },
        {
          say: `Donc avant ta première vidéo, décide qui tu vises : son âge, son pays, sa langue. Et regarde qui achète vraiment les apps comme la tienne. Dans certaines niches, l'immense majorité des utilisateurs sont des femmes. Si c'est ton cas, tu fais tes vidéos pour elles, pas pour toi.`,
        },
        {
          say: `Ensuite, sache comment chaque plateforme choisit à qui montrer tes vidéos. TikTok les montre surtout aux gens du pays de ta carte SIM. Instagram, aux gens qui parlent ta langue. Si tu veux toucher les Américains, qui paient le mieux, ouvre un compte séparé en anglais. Tu verras d'ailleurs que les plus gros chiffres sont presque tous en anglais.`,
          show: `Écran : « TikTok → pays de ta carte SIM », « Instagram → ta langue », « Américains → compte séparé en anglais ».`,
        },
        {
          say: `Et une fois que tu postes, vérifie. Pose la question de l'âge dans ton onboarding, par tranches, ou regarde l'âge et le pays de ton audience dans les statistiques de ton compte pro. Si ce n'est pas la bonne audience, ne touche pas à ton app : change ton contenu. D'autres sujets, un autre ton, des personnages plus âgés.`,
        },
      ],
    },
    {
      time: "3:30",
      title: "Étape 2 : trouve des vidéos qui ont déjà marché, pas des fausses",
      links: [
        { label: "Quizard, l'amphi (28,5 M)", url: "https://www.tiktok.com/@quizard.ai/video/7411341221949426974" },
        { label: "Jurney, « The lazy way to lose weight » (5,2 M)", url: "https://www.tiktok.com/@kittyweight/video/7567016921816714526" },
        { label: "Compte Skylight (vues très probablement payées)", url: "https://www.tiktok.com/@myskylight" },
      ],
      beats: [
        {
          say: `Deuxième étape : tu ne cherches pas une idée, tu cherches des vidéos qui ont déjà marché pour des apps comme la tienne.`,
        },
        {
          say: `Va sur TikTok et sur Instagram, tape le nom des grosses apps de ta niche et des niches voisines, et va sur leurs comptes officiels. Trie par vidéos les plus vues. Tu vas tomber sur des choses comme ça : une app de révisions filmée dans un amphi, 28 millions et demi de vues. Une app pour maigrir qui explique le régime avec des chats, 5 millions 200 000.`,
          show: `Enregistrement d'écran : un compte d'app trié par popularité, puis la vidéo Quizard dans l'amphi (28,5 M) et la vidéo Jurney avec les chats (5,2 M).`,
        },
        {
          say: `Garde seulement les vidéos où l'app se voit vraiment, ou au moins où on comprend ce qu'elle fait. Et pour chacune, note quatre choses : la phrase à l'écran sur la première image, la durée, le son, et à quel moment l'app apparaît. C'est ça que tu vas copier.`,
          show: `Tableau à l'écran qui se remplit : « Phrase 1re image · Durée · Son · Moment où l'app apparaît ».`,
        },
        {
          say: `Mais attention, il y a un piège : toutes les vidéos à des millions de vues ne sont pas des vraies percées. Certaines grosses apps paient pour pousser leurs vidéos. Sur le compte d'une app de calendrier familial, on a trouvé des vidéos à 5 millions de vues pour moins de 3 000 likes.`,
        },
        {
          say: `Le test est simple : divise les likes par les vues. Une vraie percée organique, c'est en général entre 3 et 14 % de likes. Une vidéo poussée avec de l'argent, c'est souvent moins de 0,1 %. Si tu tombes sur ce genre de chiffre, ne copie pas cette vidéo : ce n'est pas le contenu qui a fait les vues, c'est le budget.`,
          show: `Calcul à l'écran : « 2 849 likes ÷ 5 000 000 vues = 0,06 % ❌ », puis « 555 700 likes ÷ 5 200 000 vues = 10,7 % ✅ ».`,
        },
        {
          say: `Ton objectif pour cette étape : une liste de dix vidéos, toutes à au moins 10 000 vues, qui passent le test des likes. Si tu en veux déjà une centaine toutes prêtes, je les ai mises dans le PDF de ma vidéo précédente.`,
        },
      ],
    },
    {
      time: "5:30",
      title: "Étape 3 : refais-les pour ton app, en copiant le format, pas la vidéo",
      links: [
        { label: "Jurney, « The easiest way to lose weight » (11 800)", url: "https://www.tiktok.com/@kittyweight/video/7571891209002552607" },
        { label: "Turbo AI, la percée (6,8 M)", url: "https://www.tiktok.com/@getturboai/video/7550714243683798327" },
        { label: "Turbo AI, le flop du même jour (6 725)", url: "https://www.tiktok.com/@getturboai/video/7550714786149829902" },
      ],
      beats: [
        { say: `Troisième étape, celle qui ressemble vraiment à de la triche : tu prends une vidéo de ta liste, et tu la refais de A à Z pour ton app.` },
        {
          say: `Tu fais du marketing, pas de l'influence. Tu n'as pas besoin d'avoir des idées géniales. Une vidéo qui a déjà fait des centaines de milliers de vues, c'est un format que le public a déjà validé. Toi, tu changes juste le produit.`,
        },
        {
          say: `Mais tu copies le format, pas la vidéo. Tu gardes la même structure de phrase sur la première image, la même durée, le même son et le même genre de plans. Ce qu'on voit à l'écran, ce sont tes images et ton app. Et ne reprends jamais des extraits des vidéos des autres : tu t'exposes à un signalement.`,
        },
        {
          say: `Et la phrase de départ, tu la gardes au mot près, parce qu'un seul mot peut tout changer. Regarde : l'app aux chats a fait « la méthode des paresseux pour maigrir », 5 millions 200 000 vues. Deux semaines plus tard, même script, mêmes chats, même son, mais « la méthode la plus facile pour maigrir ». 11 800 vues. Un mot, 440 fois moins de vues.`,
          show: `Les deux vidéos Jurney côte à côte, le mot « LAZY » surligné en vert, « EASIEST » en rouge. 5,2 M contre 11 800.`,
        },
        {
          say: `Autre règle : ta première phrase parle à celui qui regarde, pas de toi. Une app de prise de notes a posté deux vidéos le même jour, avec la même légende. Celle qui dit « si tu passes cette vidéo, tu vas rater tes examens » a fait 6 millions 800 000 vues. Celle qui commence par la créatrice qui raconte sa journée : 6 725.`,
          show: `Les deux vidéos Turbo AI côte à côte : « if you skip this video you're FAILING your finals » (6,8 M) contre « English is so hard vro » (6 725).`,
        },
        {
          say: `Pour aller vite, tu donnes à ton IA le texte à l'écran, ce qui se dit et la légende de la vidéo d'origine, avec ce que fait ton app, et elle te rend la même chose pour toi. Tu filmes, tu postes. Une vidéo d'inspiration, c'est quinze minutes de travail, pas une journée.`,
        },
      ],
    },
    {
      time: "8:00",
      title: "Le cadeau",
      beats: [
        {
          say: `Pour cette étape, j'ai écrit un prompt que tu peux utiliser dès ce soir. Tu lui envoies un post qui a déjà cartonné sur TikTok ou Instagram, et ton IA te rend le même pour ton app : le texte à l'écran, le rythme du montage, la légende et le commentaire à épingler. Il est gratuit, et le lien est en premier dans la description.`,
          show: `Texte à l'écran : « Le prompt contenu viral, lien en description », 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "8:20",
      title: "Étape 4 : où mettre le nom de ton app",
      links: [
        { label: "Push Up Arena, nom caché (4,2 M, 16 % demandent le nom)", url: "https://www.tiktok.com/@pushuparena.app/video/7680736764771765535" },
        { label: "Coconote, nom donné (26 M, 46 % taguent un ami)", url: "https://www.instagram.com/reel/C9hepDsMoYQ/" },
        { label: "Eclipta, « commente Eclipta » (13 M)", url: "https://www.instagram.com/reel/DYfnXHqOo27/" },
      ],
      beats: [
        {
          say: `Quatrième étape : le nom de ton app. Une vidéo peut faire des millions de vues, si personne ne sait comment trouver ton app, tu ne vends rien. On a lu des milliers de commentaires pour voir ce qui se passe selon l'endroit où le nom apparaît.`,
        },
        {
          say: `Quand le nom est caché et que l'app se voit en action, les gens le demandent eux-mêmes. Sur une app de pompes en forme de jeu, 16 % des commentaires demandent « c'est quoi le nom ? ». Ça fait monter les commentaires, donc la vidéo.`,
          show: `Plein écran : Push Up Arena, puis des vrais commentaires qui défilent (« App name », « Name of the game? », « cómo se llama esa app »).`,
        },
        {
          say: `Quand le nom est dit ou écrit, presque personne ne le demande. Mais les gens font autre chose : ils taguent un ami. Sur une app de prise de notes qui dit son nom clairement, presque la moitié des commentaires sont des amis tagués. Ce sont des gens qui envoient ton app à quelqu'un d'autre.`,
          show: `Coconote : « The app is called Coconote 🥥 », puis des commentaires « @… » qui défilent. « 46 % taguent un ami ».`,
        },
        {
          say: `Et sur Instagram, il y a une troisième option qui est devenue la norme : « commente tel mot et je t'envoie l'app ». Sur une vidéo d'app à 13 millions de vues, la moitié des commentaires sont juste le mot demandé. Avec une automatisation, chaque personne qui commente reçoit le lien en message privé.`,
          show: `Eclipta : la légende « Comment "Eclipta" », puis le mot « Eclipta » répété dans les commentaires.`,
        },
        {
          say: `Ce que je ferais : sur TikTok, le nom en légende et en commentaire épinglé, et dans la vidéo si elle est courte. Sur Instagram, le « commente un mot » avec l'automatisation. Et donne toujours le vrai nom tel qu'on le tape sur l'App Store : les gens qui le cherchent font monter ton app dans les recherches.`,
        },
        {
          say: `Dernière chose : ton appel à l'action ne doit pas sonner comme une pub. Même sous une vidéo à 6 millions 800 000 vues, un commentaire à 248 likes disait : « à cause de cette pub, je ne la téléchargerai jamais ». Parle de ton app comme si tu la recommandais à un ami : si tu veux la même chose, c'est cette app.`,
        },
      ],
    },
    {
      time: "10:15",
      title: "Étape 5 : le volume, sans te faire bloquer",
      links: [
        { label: "Quizard, « the F students are inventors » (963 300)", url: "https://www.tiktok.com/@quizard.ai/video/7502540387144289567" },
        { label: "Quizard, la même vidéo 3 jours après (5 400)", url: "https://www.tiktok.com/@quizard.ai/video/7503593343650254111" },
      ],
      beats: [
        { say: `Cinquième étape, et c'est la question qu'on me pose le plus : combien de comptes et combien de vidéos.` },
        {
          say: `Commence avec un seul compte par plateforme. Chauffe-le quelques jours : tu likes, tu commentes, tu regardes des vidéos de ta niche, comme un vrai utilisateur. Ensuite, poste une vidéo par jour, puis deux. Deux par jour et par compte, c'est le maximum. Mieux vaut deux vidéos soignées que quinze bâclées.`,
          show: `Écran : « 1 compte par plateforme, chauffé quelques jours, 1 puis 2 vidéos par jour, 3 comptes au maximum par téléphone, jamais de VPN ».`,
        },
        {
          say: `Quand ça tourne, tu peux monter jusqu'à trois comptes par plateforme et par téléphone, pas plus, et jamais avec un VPN. C'est l'erreur qui fait tomber des comptes à 10 vues par vidéo du jour au lendemain, et là, il faut tout recréer et rechauffer.`,
        },
        {
          say: `Poste partout : TikTok, Instagram, YouTube Shorts. Tu ne sais jamais où ça va prendre. Le même contenu peut faire un million de vues sur une plateforme et 500 sur l'autre.`,
        },
        {
          say: `Et surtout, reposte ce qui a marché. Regarde ces deux vidéos d'une app de révisions. C'est exactement la même vidéo, même image, même son, même texte, republiée trois jours plus tard. La première a fait 963 300 vues, la deuxième 5 400.`,
          show: `Les deux vidéos Quizard côte à côte, identiques. 963 300 en vert, 5 400 en rouge.`,
        },
        {
          say: `Ça veut dire deux choses. Un : une bonne vidéo n'est pas une garantie, c'est un ticket. Ce compte a posté au moins 25 vidéos avec la même légende, et elles vont de 2 683 vues à 29 millions et demi. Deux : un format se juge sur au moins dix vidéos, jamais sur une. Après deux semaines tous les jours, si tu es à 10 vues par vidéo, il y a un problème de compte. Si tu es à quelques centaines avec des pics à quelques milliers, tu es sur la bonne voie.`,
        },
        {
          say: `Et quand un format perce, tu le bombardes : une autre accroche, une autre situation, un autre plan, tous les jours. Les gens qui scrollent ne voient pas la répétition. Pour tenir le rythme, filme des dizaines de plans d'un coup, en une ou deux heures, et fais ton marketing en premier dans la journée. Sinon, à 22 heures, tu feras une vidéo vite fait en croyant avoir travaillé.`,
        },
      ],
    },
    {
      time: "12:30",
      title: "Étape 6 : les quatre chiffres qui te disent où ça casse",
      beats: [
        {
          say: `Dernière étape. Une vue, ce n'est pas une vente. Pour savoir ce qui bloque, regarde chaque semaine quatre chiffres : tes vues, tes téléchargements, tes essais et tes ventes.`,
          show: `Animation : la chaîne vues, téléchargements, essais, ventes ; chaque flèche s'allume quand elle est citée.`,
        },
        {
          say: `Si tu as peu de vues, c'est le volume ou les formats : étapes deux, trois et cinq. Si une vidéo perce mais que tes téléchargements ne font pas de pic, elle ne convertit pas : on ne comprend pas ce que fait ton app, ou on ne sait pas comment la trouver, c'est l'étape quatre. Et si tu as des téléchargements mais que personne ne lance l'essai, regarde d'abord qui te regarde, c'est l'étape un, avant de toucher à ton app.`,
        },
        { say: `Une journée à zéro ne veut rien dire. Juge la tendance sur quatre ou cinq jours.` },
      ],
    },
    {
      time: "13:30",
      title: "Récap et fin",
      beats: [
        {
          say: `Si je résume : tu choisis un public qui peut payer, tu trouves des vidéos qui ont déjà marché et qui passent le test des likes, tu les refais pour ton app au mot près, tu donnes le nom au bon endroit, tu publies tous les jours sur plusieurs plateformes en reposant ce qui marche, et tu regardes tes quatre chiffres chaque semaine. Le prompt pour refaire une vidéo qui a marché est en premier dans la description.`,
        },
        {
          say: `Ce n'est pas six mois, et ce n'est pas un an. C'est quelques semaines à publier tous les jours, en copiant ce qui a déjà marché au lieu de deviner.`,
        },
        {
          say: `Et si tu veux qu'on regarde ensemble où ça casse pour ton app, tu peux réserver un appel avec mon équipe, le lien est dans la description.`,
        },
        {
          say: `Dis-moi en commentaire combien de vidéos tu publies par semaine pour ton app en ce moment. Et si cette vidéo t'a servi, abonne-toi : je partage tout ce qu'on apprend sur nos apps.`,
        },
      ],
    },
  ],
  description: `🎁 Le prompt GRATUIT qui transforme un post viral en post pour ton app (reels, carrousels, légende et commentaire à épingler) : https://www.jeremypitault.com/guide/prompt-contenu-viral?${UTM_A}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_A}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_A}

Une app de pilates qui n'était même pas sortie a fait 9,4 millions de vues avec une vidéo de 5 secondes, sans un euro de pub. Les apps qui décollent n'inventent rien : elles copient ce qui a déjà marché, et elles le postent encore et encore. Je te donne la méthode en 6 étapes, de la première vidéo à la première vente : qui viser, quelles vidéos copier (et comment repérer les fausses percées), comment les refaire pour ton app, où mettre son nom, combien publier sans te faire bloquer, et les 4 chiffres qui disent où ça casse.

👉 Dis-moi en commentaire combien de vidéos tu publies par semaine pour ton app.

0:00 Introduction
1:45 Choisir qui tu vises
3:30 Trouver des vidéos qui ont déjà marché
5:30 Les refaire pour ton app
8:20 Où mettre le nom de ton app
10:15 Combien de comptes et de vidéos
12:30 Les 4 chiffres qui disent où ça casse
13:30 Récap

#applicationmobile #marketingapp #tiktokmarketing #créeruneapp #appmobile #contenuorganique #entrepreneur`,
  shorts: [
    "« Un mot, 440 fois moins de vues » (Jurney, lazy contre easiest, étape 3, 35 s).",
    "« Comment repérer une vidéo aux vues achetées » (le test likes ÷ vues, étape 2, 40 s).",
    "« Même vidéo, 963 300 vues puis 5 400 : reposte » (Quizard, étape 5, 35 s).",
  ],
  prepare: [
    "Télécharger les vidéos citées dans ~/Movies/Rushs/ (la plupart sont déjà dans 2026-11-1633-videos/flops/).",
    "Faire l'enregistrement d'écran de l'étape 2 : un compte d'app trié par popularité.",
    "Ajouter une fiche YouTube vers la vidéo B au moment où tu cites « le PDF de ma vidéo précédente » (étape 2).",
    "Vérifier que la page du prompt contenu viral est en ligne avant de publier.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs", state: "OK" },
    { point: "3 vidéos à plus de 50 000 vues sur le sujet", state: "OK (8 relevées, dont 2 de moins de 2 mois)" },
    { point: "Argent dans le titre, format prouvé, psychologie écrite", state: "OK" },
    { point: "Pure valeur : aucun élève, aucune capture de revenus, phrase d'autorité courte", state: "OK" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "RDV en 1 ou 2 phrases, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "OK (prompt contenu viral, après l'étape 3)" },
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
// Vidéo C (23 nov. 2026) : l'onboarding et le paywall de Shinobi, écran par écran.
// Source : le code de Shinobi (~/Projects/shinobiapp, textes dans
// apps/mobile/src/i18n/locales/fr.json), l'historique des tests dans les commits
// (13/04, 15/06, 29/09, 06/10/2026) et RevenueCat vérifié le 11/11/2026.
// Pure valeur, aucun élève : ce qui marche et ce qui a perdu, sur l'app de Jeremy.
const UTM_C = "utm_source=youtube&utm_medium=video&utm_campaign=onboarding-shinobi";

const SCRIPT_C: VideoScript = {
  slug: "onboarding-shinobi",
  label: "Vidéo C · Onboarding",
  status: "Prêt à tourner",
  updatedAt: "23 nov. 2026",
  title: "400 000 $ par an : l'onboarding de mon app, écran par écran (je te montre tout)",
  why: `Rien à voir avec les deux dernières vidéos, qui parlaient de faire connaître ton app. Celle-ci parle de ce qui se passe après le téléchargement : comment une personne qui vient d'installer l'app finit par payer. Ton public a des téléchargements mais peu de ventes, et personne n'en parle en français. Tu montres ton propre onboarding, écran par écran, avec les tests que tu as gagnés et ceux que tu as perdus.`,
  facts: [
    { label: "Durée", value: "15 à 17 min (environ 2 500 mots de voix)" },
    { label: "Style", value: "Semi-scripté. Toi face caméra pour l'ouverture, la partie « ce qui a perdu » et la fin. Le reste en voix sur l'enregistrement d'écran de l'onboarding, sur un iPhone neuf ou après avoir supprimé l'app" },
    { label: "Format", value: "« L'onboarding de mon app à X $ (je te montre tout) » : visite écran par écran, avec pour chaque écran ce qu'il fait et pourquoi, puis les tests gagnés et perdus" },
    { label: "Demande", value: "« I Studied 1,460 Onboarding Flows » (Mobbin) 410 000 vues, « We Studied 2,995 Paywalls » (Mobbin) 205 000, « The Onboarding Behind My $40K/Month App » (Starter Story) 63 000, « How To Build an App Onboarding That PRINTS » 47 000. Aucune vidéo en français sur le sujet. Ton format « Comment j'ai monté une app à 100K ARR » est déjà ta meilleure vidéo dans la cible (31 000)" },
    { label: "Chiffres", value: "Un seul chiffre en dollars, dans le titre et une fois à la fin : octobre 2026, 42 845 $ de revenus, le meilleur mois des 12 derniers (RevenueCat, vérifié le 11/11). Le reste, ce sont les écrans et les tests" },
    { label: "Captures", value: "L'onboarding filmé en entier, une capture RevenueCat d'octobre (une seule, à la fin)" },
    { label: "UTM", value: "onboarding-shinobi" },
  ],
  altTitles: [
    {
      title: "400 000 $ par an : l'onboarding de mon app, écran par écran (je te montre tout)",
      why: "Recommandé. Argent d'abord, puis « je te montre tout » : on va voir l'intérieur d'une vraie app qui rapporte. Même promesse que la vidéo Starter Story à 63 000 vues, et c'est la seule en français.",
    },
    {
      title: "Pourquoi ton app a des téléchargements mais personne ne paie",
      why: "Part de la douleur de ton public. Plus large, moins de preuve dans le titre : à garder pour un test A/B.",
    },
    {
      title: "Les 20 écrans qui font payer mon app à 400 000 $ par an",
      why: "Plus précis et plus « liste ». Plus faible sur la curiosité.",
    },
  ],
  thumbnail: {
    text: "CET ÉCRAN PAIE",
    layout: `Bloc rouge en haut à gauche avec « CET ÉCRAN PAIE » en blanc, très gros. En dessous, un iPhone tenu en main qui affiche le paywall de Shinobi (la timeline « Aujourd'hui · Accès complet / Jour 6 · Rappel / Jour 7 · Fin de l'essai » et le bouton « Commencer mon essai gratuit »). Une flèche jaune du bloc vers le bouton. Toi à droite en gros plan, expression calme et sûre, regard caméra. Bureau en bois sombre flou. La miniature pose la question (quel écran, pourquoi il fait payer), le titre donne la preuve (400 000 $ par an) sans la répéter.`,
    variant: "Variante B : bloc jaune « 12 QUESTIONS », le téléphone affiche le ninja et la question « Quel âge as-tu ? ». Toi à droite.",
    prompt: `Images 1 and 2 are photos of me: use my exact face, head shape, hairline, skin texture and proportions. Do not beautify, stylize or change my face.
Image 3 is a real screenshot of my app's paywall: place it, unchanged, as the screen of the iPhone.
Image 4 is one of my validated thumbnails: copy its background and lighting style.

Layout: 16:9 YouTube thumbnail, 1920x1088.
Top left: a bright red rectangular block with huge bold white sans-serif text "CET ÉCRAN PAIE", perfectly legible, nothing else written.
Left center, below the red block: an iPhone held in a hand, screen facing camera, showing image 3, sharp and readable. A thick yellow curved arrow goes from the red block to the main button on the screen.
Right side: me, close-up from mid-chest up, head and shoulders filling about 45% of the frame height, calm confident expression with a slight smile, looking straight at the camera, dark t-shirt.
Background: a real blurred office, dark wood desk, warm lamp, plants, soft bokeh, like image 4. No flat or gradient background, no purple.
Lighting: soft key light on my face, subtle warm rim light, realistic shadows, slight vignette.
Keep 60 px safe margins. No other text, no logos, no extra numbers.
Negative: distorted face, changed identity, extra fingers, warped phone, unreadable text, cluttered layout, fake UI, cartoon style.`,
  },
  gift: {
    name: "Le modèle de l'onboarding de Shinobi : les 12 questions mot à mot, les écrans d'après et le paywall, avec le prompt pour l'adapter à ton app",
    url: `https://www.jeremypitault.com/guide/onboarding-shinobi?${UTM_C}`,
    note: "Page à créer avant de publier. Contenu : chaque écran (texte exact, à quoi il sert), le plan personnalisé, le paywall (timeline, prix à la semaine, offre de sortie), les tests perdus, et un prompt qui réécrit tout pour l'app du spectateur. Annoncé juste après la partie « le plan personnalisé » (la première grosse valeur), rappelé à la fin.",
  },
  plan: [
    "Le spectateur a compris que l'onboarding n'est pas un formulaire : c'est là que se fait la vente, avant même le paywall.",
    "Il a vu chaque écran d'un vrai onboarding qui rapporte, et il sait à quoi sert chacun (récolter, faire dire l'objectif, faire réussir, transformer des minutes en résultat).",
    "Il sait demander les notifications sans se prendre un refus, et montrer l'app avant de faire payer.",
    "Il sait construire l'écran « ton plan est prêt » qui donne envie de payer.",
    "Il connaît les choix du paywall : obligatoire ou pas, essai sur l'annuel seulement, prix à la semaine, timeline, rappel avant la fin de l'essai.",
    "Il sait ce qui a perdu (abonnement à la semaine, cacher le mensuel, essai de 3 jours), pour ne pas le refaire.",
    "Il sait quoi faire quand la personne ferme le paywall, et pourquoi l'inscription vient après le paiement.",
    "Il repart avec le modèle complet pour refaire l'onboarding de son app.",
  ],
  sections: [
    {
      time: "0:00",
      title: "Ouverture : promesse, preuve, plan, public",
      mode: "visage",
      beats: [
        { show: "Face caméra, plan serré, pas de musique pendant les 10 premières secondes. Le téléphone en main, écran éteint." },
        {
          say: `La plupart des apps perdent leurs ventes au même endroit. Pas dans le marketing, pas dans les fonctionnalités : dans les deux minutes qui suivent le téléchargement. La personne ouvre l'app, elle voit un écran d'inscription, puis un menu, et elle ne revient jamais.`,
        },
        {
          say: `Aujourd'hui, je te montre l'intérieur de mon app, écran par écran : tout ce que voit quelqu'un entre le moment où il l'ouvre pour la première fois et le moment où il paie. Et je te dis pourquoi chaque écran est là.`,
          show: `Le téléphone s'allume : l'écran d'accueil de Shinobi, « Commencer ».`,
        },
        {
          say: `Moi, c'est Jeremy. J'ai créé Shinobi, une app pour apprendre le japonais, qui fait aujourd'hui autour de 400 000 dollars par an. Cet onboarding, on l'a refait des dizaines de fois, et on a testé beaucoup de choses. Certaines ont gagné, d'autres ont perdu, et je vais te montrer les deux.`,
          show: `Bandeau nom « Jeremy Pitault, créateur de Shinobi ».`,
        },
        {
          say: `On va voir quatre parties. D'abord les douze questions, et ce que chacune fait vraiment. Ensuite, l'écran le plus important avant le paiement : le plan personnalisé. Puis le paywall, avec chaque choix qu'on a fait. Et enfin, ce qui a perdu dans nos tests, et ce qu'on fait quand quelqu'un ferme le paywall.`,
          show: `Texte à l'écran : les 4 parties, qui restent en sommaire dans un coin pendant la vidéo.`,
        },
        {
          say: `Une précision honnête : ce qui marche pour une app de japonais ne marchera pas à l'identique pour la tienne. Copie le principe de chaque écran, pas le texte.`,
        },
        {
          say: `Cette vidéo est pour toi si tu as une app, ou si tu es en train d'en créer une avec l'IA, et que tu veux qu'elle rapporte. Surtout si tu as déjà des téléchargements mais presque pas de ventes : le problème est probablement là.`,
        },
      ],
    },
    {
      time: "1:45",
      title: "L'idée de base : l'onboarding, c'est la vente",
      mode: "sans-visage",
      beats: [
        {
          say: `Avant le premier écran, retiens une idée. Un onboarding, ce n'est pas un formulaire pour remplir ton profil. C'est là que la personne doit se dire : « cette app est faite pour moi, et elle va m'amener là où je veux aller ». Si elle ne se dit pas ça avant le paywall, aucun prix ne sera assez bas.`,
          show: `Schéma simple : « téléchargement → onboarding → paywall → paiement ». La flèche entre onboarding et paywall s'épaissit.`,
        },
        {
          say: `Chez nous, entre l'ouverture de l'app et le paywall, il y a une vingtaine d'écrans. Ça paraît énorme. Mais aucun n'est là par hasard, et la personne ne s'ennuie pas, parce qu'à chaque écran, c'est d'elle qu'on parle.`,
        },
        {
          say: `Et il y a une chose qu'on ne demande pas au début : de créer un compte. Pas d'email, pas de mot de passe. On y revient à la fin.`,
          show: `L'écran d'accueil : le carrousel « Lis des histoires », « Du vrai japonais en immersion », « N'oublie jamais », puis le doigt appuie sur « Commencer ».`,
        },
      ],
    },
    {
      time: "2:45",
      title: "Partie 1 : les douze questions",
      mode: "sans-visage",
      beats: [
        { show: "Carte de chapitre : « 1. LES DOUZE QUESTIONS »." },
        {
          say: `Premier écran : un personnage. Notre ninja apparaît, il bouge, et il parle dans une bulle : « Salut ! Moi c'est Shinobi ! Comment tu t'appelles ? ». Un personnage, ça transforme un questionnaire en conversation. Et le prénom, on va le réutiliser partout : à partir de là, chaque question commence par ton prénom.`,
          show: `Enregistrement d'écran : le ninja animé, la bulle qui s'écrit, le prénom tapé.`,
        },
        {
          say: `Deuxième question : l'âge, par tranches. Ce n'est pas de la curiosité. Quelqu'un de moins de 18 ans paie rarement un abonnement. Avec cette réponse, on sait exactement quel contenu nous amène des gens qui peuvent payer, et lequel nous amène des ados.`,
          show: `L'écran « Enchanté, Jeremy ! Quel âge as-tu ? », les six tranches.`,
        },
        {
          say: `Troisième question : comment tu as connu l'app. Instagram, TikTok, YouTube, une IA, un ami. C'est la meilleure donnée marketing que tu auras, et elle est gratuite. Tu sauras quel réseau t'amène des gens qui paient, pas seulement des téléchargements.`,
          show: `L'écran « Comment as-tu connu Shinobi ? », avec la case « Une IA (ChatGPT…) ».`,
        },
        {
          say: `Quatrième question, la plus importante : pourquoi tu veux apprendre le japonais. Pour un voyage, pour tes études, pour t'installer au Japon, pour ta carrière. Ici, la personne te dit elle-même ce qu'elle veut acheter. Et le ninja lui répond tout de suite : « Génial ! Je vais te préparer pour ton voyage ! ». Elle se sent comprise, et on garde sa réponse pour plus tard.`,
          show: `L'écran « Jeremy, pourquoi veux-tu apprendre le japonais ? », le doigt choisit « Préparer un voyage », la réponse du ninja s'écrit.`,
        },
        {
          say: `Cinquième : les sujets qui lui plaisent. Anime, cuisine, voyage, business. Ça sert à personnaliser le contenu, mais surtout, la personne commence à imaginer ce qu'elle va lire.`,
        },
        {
          say: `Sixième, et c'est mon écran préféré : on lui montre des caractères japonais et on lui demande « tu peux lire ça ? ». Si elle répond « pas encore », le ninja la rassure : « Pas de souci ! Je vais t'apprendre pas à pas. », et la prononciation apparaît juste sous les caractères. En une seconde, elle a vu l'app lui apprendre quelque chose. Et on saute la question du niveau, puisqu'on la connaît déjà.`,
          show: `L'écran « Jeremy, tu peux lire ça ? », appui sur « Pas encore », le romaji apparaît sous les kana.`,
        },
        {
          say: `Retiens le principe : chaque fois que tu peux, remplace une question par une petite expérience. Quelqu'un qui réussit quelque chose dans ton app avant de payer est beaucoup plus près de payer.`,
        },
        {
          say: `Ensuite, on prépare sa routine. On lui demande combien de minutes par jour : 5, 10, 15 ou 20. Et juste après, on transforme ces minutes en résultat : « Ça représente 80 mots par semaine ! », avec une pluie de mots à l'écran. Personne ne veut acheter des minutes. Les gens veulent un résultat. Ton travail, c'est de traduire l'effort en résultat, avec leurs propres réponses.`,
          show: `L'écran objectif quotidien, puis « Ça représente {count} mots par semaine ! » avec la pluie de mots.`,
        },
        {
          say: `Les deux derniers écrans servent aux notifications. D'abord, on demande à quelle heure elle veut ses rappels. Puis on lui montre une fausse fenêtre de demande d'autorisation, avec le bouton « Autoriser » mis en avant, et seulement après, la vraie demande d'Apple.`,
          show: `L'écran « Jeremy, quand veux-tu tes encouragements ? », puis « Restons connectés ! » avec la fausse fenêtre, puis la vraie.`,
        },
        {
          say: `Pourquoi ? Parce que la vraie fenêtre d'Apple, tu n'as le droit de l'afficher qu'une fois. Si la personne refuse, c'est fini. Alors on lui explique d'abord pourquoi on va lui écrire, au moment où elle vient de choisir son heure de rappel. Et les notifications, ce sont elles qui la font revenir le lendemain.`,
        },
      ],
    },
    {
      time: "7:00",
      title: "Montrer l'app avant de faire payer",
      mode: "sans-visage",
      beats: [
        {
          say: `Avant le paywall, on fait encore une chose : on montre l'app. Un court tutoriel où le ninja explique comment ça marche, et surtout, une mini-histoire où la personne touche un vrai caractère japonais et voit comment il se lit.`,
          show: `Le tutoriel : « On y va ! Laisse-moi te montrer comment ça marche. », puis la mini-histoire « Tu vois ? Le kanji 猫 se lit ねこ. Appuie dessus ! », le doigt appuie.`,
        },
        {
          say: `Beaucoup d'apps demandent de payer pour un produit qu'on n'a jamais vu. Nous, on fait vivre le cœur de l'app pendant trente secondes avant de demander quoi que ce soit. C'est ce moment-là, « ah, c'est comme ça que ça marche », qu'on veut avant le prix.`,
        },
      ],
    },
    {
      time: "7:45",
      title: "Partie 2 : le plan personnalisé",
      mode: "sans-visage",
      beats: [
        { show: "Carte de chapitre : « 2. LE PLAN PERSONNALISÉ »." },
        {
          say: `Voici l'écran le plus important avant le paiement. D'abord, un écran d'attente de quelques secondes : « Je crée ton plan personnalisé ! », avec des coches qui apparaissent une par une. « Analyse de ton objectif », « Création d'un cours pour ton niveau », « Préparation de ta routine ».`,
          show: `L'écran « Je crée ton plan personnalisé ! », les coches qui apparaissent.`,
        },
        {
          say: `Ces quelques secondes ne sont pas une perte de temps. Quand on voit un travail se faire pour soi, on accorde plus de valeur au résultat. Et la personne vient de répondre à douze questions : elle attend son plan.`,
        },
        {
          say: `Puis le plan arrive : « Votre programme personnalisé est prêt ! », avec une date, et son objectif à elle. Si elle a choisi le voyage, c'est « Prêt pour ton voyage », d'ici telle date. En dessous, une courbe de progression, et une liste de ce qu'elle saura faire avec dix minutes par jour : des centaines de mots, des kanji maîtrisés.`,
          show: `L'écran « Votre programme personnalisé est prêt ! » : la date, « Prêt pour ton voyage », la courbe, la liste. Zoom lent sur l'objectif.`,
        },
        {
          say: `Tu vois ce qui se passe ? Tout ce qui est sur cet écran vient de ses propres réponses. Son objectif, son niveau, son temps par jour. Quand elle appuie sur « Continuer » et qu'elle arrive sur le paywall, elle ne paie pas une app de japonais. Elle paie son plan à elle, celui qui l'amène à son voyage.`,
        },
        {
          say: `Pour ton app, c'est pareil, quelle que soit ta niche. Une app de sport : « ton programme pour perdre 4 kilos d'ici mars ». Une app de budget : « ton plan pour mettre 300 euros de côté par mois ». Reprends leurs réponses, et montre-leur le résultat avec une date.`,
        },
      ],
    },
    {
      time: "9:30",
      title: "Le cadeau",
      mode: "visage",
      beats: [
        {
          say: `Pour que tu n'aies pas à tout noter, j'ai mis tout cet onboarding dans un document : les douze questions mot à mot, à quoi sert chacune, l'écran du plan, le paywall, et un prompt qui réécrit le tout pour ton app. Tu le donnes à ton IA et tu as la base de ton onboarding. Il est gratuit, le lien est en premier dans la description.`,
          show: `Texte à l'écran : « Le modèle d'onboarding de Shinobi, lien en description », 4 secondes, sans couper la parole.`,
        },
      ],
    },
    {
      time: "10:00",
      title: "Partie 3 : le paywall",
      mode: "sans-visage",
      beats: [
        { show: "Carte de chapitre : « 3. LE PAYWALL »." },
        {
          say: `Le paywall, maintenant. Premier choix, le plus gros : depuis septembre, sur iPhone, il est obligatoire pour les nouveaux utilisateurs. Pas de bouton « continuer gratuitement ». Soit tu commences l'essai, soit tu ne vas pas plus loin.`,
          show: `Le paywall en plein écran : les trois couvertures d'histoires, « Lis du vrai japonais. Gratuit pendant 7 jours. »`,
        },
        {
          say: `Ça fait peur, et ce n'est pas pour toutes les apps. Ça marche quand l'onboarding a déjà fait son travail et que l'essai est gratuit : la personne n'a rien à payer aujourd'hui. Sur Android, où les gens paient moins, on laisse une porte de sortie gratuite.`,
        },
        {
          say: `Deuxième choix : l'essai gratuit de 7 jours est seulement sur l'abonnement annuel. Le mensuel existe, mais sans essai. Ça pousse doucement vers l'annuel, et l'annuel, c'est un an d'argent d'un coup, plutôt qu'un mois que les gens annulent.`,
        },
        {
          say: `Troisième choix : on affiche le prix par semaine. Le même abonnement, présenté par semaine, paraît beaucoup plus petit qu'un chiffre annuel. Et on affiche la réduction de l'annuel par rapport au mensuel.`,
          show: `Zoom sur les deux plans : annuel avec « 7 jours gratuits » et le badge de réduction, mensuel en dessous. Prix affichés par semaine.`,
        },
        {
          say: `Quatrième choix, et c'est celui que je te recommande le plus : la timeline. « Aujourd'hui : accès complet. Jour 6 : rappel. Jour 7 : fin de l'essai. » Et sous le bouton : « Aucun paiement aujourd'hui, annulable à tout moment ».`,
          show: `Zoom sur la timeline, puis sur « Aucun paiement aujourd'hui · Annulable à tout moment ».`,
        },
        {
          say: `La plus grosse peur devant un essai gratuit, c'est d'oublier d'annuler et de se faire prélever. La timeline enlève cette peur. Et on tient la promesse : l'app envoie un rappel 24 heures et 6 heures avant la fin de l'essai. Ça paraît contre-productif, mais quelqu'un qui se sent piégé demande un remboursement et laisse une mauvaise note. Quelqu'un qu'on a prévenu et qui reste, il reste vraiment.`,
        },
        {
          say: `Et autour de tout ça, de la preuve : la note sur l'App Store, le nombre d'apprenants, des avis. Mets uniquement des vrais avis, jamais des avis inventés : Apple peut refuser ton app pour ça, et tes utilisateurs le sentent.`,
        },
      ],
    },
    {
      time: "12:30",
      title: "Partie 4 : ce qui a perdu dans nos tests",
      mode: "visage",
      beats: [
        { show: "Carte de chapitre : « 4. CE QUI A PERDU », puis retour face caméra." },
        {
          say: `Maintenant, ce qui n'a pas marché. Parce que tout ce que je viens de te montrer, c'est ce qui reste après avoir perdu beaucoup de tests.`,
        },
        {
          say: `Un : l'abonnement à la semaine. Beaucoup de grosses apps le font, alors on l'a testé à la place du mensuel. Il a perdu, et on est revenus au mensuel.`,
          show: `Texte à l'écran : « Abonnement à la semaine : ❌ perdu ».`,
        },
        {
          say: `Deux : cacher le mensuel pour ne laisser que l'annuel. On s'est dit que ça forcerait les gens vers l'annuel. Ça a perdu aussi. Les gens ont besoin de voir une option moins chère pour trouver l'annuel intéressant.`,
          show: `Texte à l'écran : « Cacher le mensuel : ❌ perdu ».`,
        },
        {
          say: `Trois : la durée de l'essai. Quand on est passés au paywall obligatoire, on a commencé avec 3 jours d'essai. On a testé 3 jours contre 7 jours, et aujourd'hui, tout le monde a 7 jours.`,
          show: `Texte à l'écran : « Essai de 3 jours : remplacé par 7 jours ».`,
        },
        {
          say: `La leçon, ce n'est pas « fais l'inverse de nous ». C'est que ce qui marche chez les grosses apps ne marchera pas forcément chez toi. Teste une seule chose à la fois, garde ce qui gagne, et remets tout le reste comme avant.`,
        },
      ],
    },
    {
      time: "14:00",
      title: "Quand la personne ferme le paywall, et le compte à la fin",
      mode: "sans-visage",
      beats: [
        {
          say: `Dernière chose : que se passe-t-il quand la personne veut fermer le paywall ? La croix n'apparaît qu'au bout de cinq secondes, le temps de lire. Et quand elle appuie dessus, on lui fait une offre unique : l'annuel environ 40 % moins cher, payé tout de suite, sans essai. Avec ce texte : « Ce prix n'est affiché qu'une seule fois. »`,
          show: `Le paywall, la croix qui apparaît en fondu, puis l'offre « Offre unique · Attends ! » qui monte du bas.`,
        },
        {
          say: `Et c'est vrai : on ne la remontre jamais. Une offre « unique » qui revient tous les jours, les gens finissent par le comprendre, et plus personne ne paie le prix normal.`,
        },
        {
          say: `Et le compte, alors ? On ne le demande qu'après le paiement : « Bienvenue dans Premium ! Garde ta progression ». Et même là, il y a un bouton « Plus tard ». Chaque écran avant le paywall coûte des gens. Un formulaire d'inscription, c'est l'écran qui en coûte le plus, pour une information dont tu n'as pas besoin pour vendre.`,
          show: `L'écran « Bienvenue dans Premium ! », le bouton « Plus tard ».`,
        },
      ],
    },
    {
      time: "15:00",
      title: "Récap et fin",
      mode: "visage",
      beats: [
        {
          say: `On est passés à cet onboarding avec paywall obligatoire en septembre. Octobre a été notre meilleur mois des douze derniers, avec 42 845 dollars de revenus. Je ne vais pas te dire que c'est seulement grâce à ça, mais c'est la plus grosse chose qu'on ait changée.`,
          show: `Capture RevenueCat d'octobre 2026, « Revenue $42,845 », 3 secondes.`,
        },
        {
          say: `Si tu ne dois faire que trois choses ce soir sur ton app : enlève l'inscription du début, ajoute une question « pourquoi » dont tu réutilises la réponse dans un écran « ton plan est prêt », et mets une timeline avec un rappel sur ton paywall. Le modèle complet est en premier dans la description.`,
        },
        {
          say: `Et si tu veux qu'on regarde ensemble l'onboarding de ton app, tu peux réserver un appel avec mon équipe, le lien est aussi dans la description.`,
        },
        {
          say: `Dis-moi en commentaire combien d'écrans il y a entre l'ouverture de ton app et ton paywall. Et si cette vidéo t'a servi, abonne-toi : je montre tout ce qu'on fait sur nos apps.`,
        },
      ],
    },
  ],
  description: `🎁 Le modèle GRATUIT de l'onboarding de Shinobi (les 12 questions, l'écran du plan, le paywall, et le prompt pour l'adapter à ton app) : https://www.jeremypitault.com/guide/onboarding-shinobi?${UTM_C}

🎯 Mon Plan d'Action gratuit pour créer une app mobile qui génère 30K$/mois : https://www.jeremypitault.com/plan-action?${UTM_C}

📞 BESOIN D'UN ACCOMPAGNEMENT ?
Réserve ton appel stratégique personnalisé de 30 mins avec un expert APP MASTERY : https://www.jeremypitault.com/rdv?${UTM_C}

Je te montre l'intérieur de Shinobi, mon app de japonais à 400 000 $ par an : tout ce que voit un nouvel utilisateur entre l'ouverture de l'app et le paiement. Les 12 questions et ce qu'elles font vraiment, l'écran du plan personnalisé, chaque choix du paywall (obligatoire, essai sur l'annuel, prix à la semaine, timeline), les tests qu'on a perdus, et l'offre quand quelqu'un ferme le paywall.

👉 Dis-moi en commentaire combien d'écrans il y a entre l'ouverture de ton app et ton paywall.

0:00 Introduction
1:45 L'onboarding, c'est la vente
2:45 Les 12 questions
7:00 Montrer l'app avant de faire payer
7:45 Le plan personnalisé
10:00 Le paywall
12:30 Ce qui a perdu dans nos tests
14:00 Quand on ferme le paywall
15:00 Récap

#applicationmobile #onboarding #paywall #créeruneapp #appmobile #abonnement #entrepreneur`,
  shorts: [
    "« La fausse fenêtre qui fait accepter les notifications » (partie 1, 35 s).",
    "« Personne n'achète des minutes : ça représente 80 mots par semaine » (partie 1, 30 s).",
    "« 3 tests qu'on a perdus sur notre paywall » (partie 4, 45 s).",
  ],
  prepare: [
    "Filmer l'onboarding complet sur un iPhone où Shinobi n'est pas installé (ou après suppression), en français, du « Commencer » jusqu'au paywall, puis l'offre de sortie (elle ne s'affiche qu'une fois par compte : filmer d'un trait).",
    "IMPORTANT : le carrousel d'avis de l'écran « Je crée ton plan » affiche des avis provisoires inventés (Sarah M., Lucas T., Emma K., marqués TODO dans PreparingReviewsCarousel.tsx). Les remplacer par de vrais avis de l'App Store avant de filmer, ou couper ce passage au montage. Ne pas filmer non plus la phrase « 3.6x plus vite » du tutoriel si on ne peut pas la sourcer.",
    "Vérifier le chiffre « 80 mots par semaine » à l'écran selon l'objectif choisi pendant le tournage, et dire le chiffre affiché.",
    "Créer la page du cadeau /guide/onboarding-shinobi (modèle + prompt) avant de publier.",
    "Capture RevenueCat d'octobre 2026 (Revenue 42 845 $) pour la fin.",
    "Recaler les chapitres de la description sur le montage réel (skill youtube-description).",
  ],
  checklist: [
    { point: "Un seul public : app qui rapporte, pas développeurs (aucun code montré)", state: "OK" },
    { point: "3 vidéos à plus de 50 000 vues sur le sujet", state: "OK (410 000, 205 000, 63 000), aucune en français" },
    { point: "Argent dans le titre, format prouvé, psychologie écrite", state: "OK" },
    { point: "Sujet différent des vidéos A et B (après le téléchargement, pas le contenu)", state: "OK" },
    { point: "Pure valeur : aucun élève, un seul chiffre en dollars, ce qui a marché et ce qui a perdu", state: "OK" },
    { point: "Ouverture : promesse, preuve, plan, public, pas d'abonnement avant la valeur", state: "OK" },
    { point: "RDV en 1 ou 2 phrases, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "À créer (modèle d'onboarding)" },
    { point: "Miniature : 3 mots, preuve visible, visage à droite, ne répète pas le titre", state: "OK" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

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
    { label: "Montage", value: "Sans visage (direction C), sauf trois moments face caméra : « qui je suis » juste après l'intro, le cadeau suivi de l'accompagnement, et la fin. Tout le reste en voix seule sur les classements, les pages App Store et les captures des apps" },
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
    note: "Page à créer avant de publier, à partir des classements du 23 nov. (~/Projects/reports/2026-11-23-apps-ennuyeuses/charts) : garder les apps de métier, de passion et de galère, enlever les grandes marques, faire la recherche App Store de chaque niche (nombre d'apps, combien sous 20 avis), relever les prix et les avis à 1 et 2 étoiles de l'app qui domine. Annoncé face caméra après la partie 3 (la première grosse valeur), juste avant l'annonce de l'accompagnement, rappelé à la fin.",
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
          show: `Le classement des utilitaires : Case Tracker (25e) s'allume, puis AreaMap (53e). À côté d'AreaMap, l'étiquette « sortie le 29 sept. 2026 ».`,
          say: `Chez les utilitaires, il y a une app pour suivre son dossier d'immigration. Et une app qui calcule combien de piquets il faut pour une clôture. Elle est sortie il y a huit semaines.`,
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
      title: "Le cadeau, et l'accompagnement",
      mode: "visage",
      beats: [
        {
          say: `J'ai relevé ces classements catégorie par catégorie, et j'en ai sorti les 50 niches ennuyeuses qui rapportent. Pour chacune : l'app qui domine, ce qu'elle coûte, son nombre d'avis, combien d'apps de la même niche n'ont presque rien, et ce que ses utilisateurs lui reprochent. C'est gratuit, le lien est en premier dans la description.`,
          show: `À côté de toi, la couverture du guide des 50 niches, et en dessous « lien en description », 4 secondes, sans couper la parole.`,
        },
        {
          say: `Et d'ailleurs, j'accompagne personnellement des gens qui créent leur app. Si tu en as déjà une, ou si tu aimerais que je t'aide à trouver ton idée, il y a aussi un lien dans la description pour réserver un appel avec mon équipe. On regarde ensemble où tu en es, comment je peux t'aider, et si ton profil correspond aux personnes que j'accompagne.`,
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
          show: `La fiche d'AreaMap : « 53e · Utilitaires », « sortie le 29 sept. 2026 », « 261 avis », « 69,99 $ par an ». À côté, les deux plus anciennes avec « absente des classements » en gris.`,
          say: `Résultat : avec seulement 261 avis, AreaMap est déjà 53e des utilitaires qui rapportent le plus aux États-Unis. Les deux plus anciennes, avec leurs 10 000 avis, ne sont dans aucun des classements que j'ai relevés.`,
        },
        {
          show: `Côte à côte : à gauche les captures des anciennes (« Measure Routes », « Flexible Export Formats »), à droite celles d'AreaMap (« How many T-posts? 290 »).`,
          say: `La leçon : ne vends pas ce que fait ton app. Vends la réponse à la question que ton utilisateur se pose.`,
        },
        {
          show: `Les captures de rackline.ai : « Score any buck in seconds », la photo du cerf et le score. Sa fiche : « 54e · Sport », « sortie en sept. 2025 ».`,
          say: `Deuxième exemple, et il montre un autre piège. Aux États-Unis, les chasseurs donnent un score aux bois des cerfs, en les mesurant. rackline.ai le fait avec l'IA, à partir d'une simple photo. Elle est sortie en septembre 2025, et elle est 54e des apps de sport qui rapportent le plus aux États-Unis.`,
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
          say: `La liste des 50 niches ennuyeuses est en premier dans la description. Et si tu veux que je t'aide avec ton app ou ton idée, tu peux réserver un appel avec mon équipe, le lien est aussi dans la description.`,
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
2:40 Les apps des métiers
4:27 Les apps des passions
6:46 Les apps des galères
11:09 Pourquoi personne n'en parle
12:10 Ce qui floppe
15:06 Trouver ta niche
18:30 Récap

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
    { point: "Ton accompagnement et l'appel au milieu, juste après le cadeau (demandé par Jeremy le 23/11), rappelé en 1 phrase à la fin, jamais « la formation »", state: "OK" },
    { point: "Cadeau lié au sujet, après la première grosse valeur", state: "À créer (les 50 niches)" },
    { point: "Miniature : 3 ou 4 mots, preuve visible, visage à droite, ne répète pas le titre", state: "OK" },
    { point: "Ligne dans le tableau de suivi après publication", state: "À faire" },
  ],
};

// D en premier : la vidéo de jeudi 26 nov. 2026.
export const SCRIPTS: VideoScript[] = [SCRIPT_D, SCRIPT_C, SCRIPT_A, SCRIPT_B];
