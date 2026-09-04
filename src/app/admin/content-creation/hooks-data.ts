// Hub création de contenu : hooks traduits / adaptés depuis des reels
// Instagram de référence. Chaque hook garde sa version originale, une
// version française qui sonne naturel, et un exemple adapté à App Mastery
// (apps mobiles + IA + marketing viral, audience non-développeurs).

export type HookCategory =
  | "secret"
  | "verite"
  | "question"
  | "urgence"
  | "confession"
  | "recit"
  | "template"
  | "visuel";

export const CATEGORY_LABELS: Record<HookCategory, string> = {
  secret: "Secret / interdit",
  verite: "Vérité / contradiction",
  question: "Question",
  urgence: "Urgence / perte",
  confession: "Confession / perso",
  recit: "Récit / expérience",
  template: "À trous",
  visuel: "Visuel",
};

export const CATEGORY_HINTS: Record<HookCategory, string> = {
  secret:
    "On donne l'impression d'un accès privilégié. Le cerveau veut savoir ce qu'on n'était pas censé voir.",
  verite:
    "On contredit ce que tout le monde répète. Ça crée un désaccord que le spectateur veut trancher.",
  question:
    "Une question ouverte laisse un trou d'information. On reste pour la réponse.",
  urgence:
    "Menace de perte (argent, temps, opportunité). Zapper devient un risque.",
  confession:
    "Aveu personnel, vulnérabilité. On se sent dans la confidence.",
  recit:
    "Une expérience vécue avec un résultat à découvrir. Format qui marche dans n'importe quel domaine.",
  template:
    "Structures à trous avec des millions de vues. Remplis les blancs avec ton sujet.",
  visuel:
    "Ce qui se passe à l'écran avant même qu'un mot soit lu. Ça casse le schéma habituel et stoppe le scroll.",
};

export type Source = {
  id: string;
  url: string;
  author: string;
  handle: string;
  title: string;
  likes: number;
  comments: number;
  date: string;
  lang: "en" | "fr";
  summary: string;
  transcript: string;
};

export const SOURCES: Source[] = [
  {
    id: "DaGtKEuuQG9",
    url: "https://www.instagram.com/reel/DaGtKEuuQG9/",
    author: "Mino Lee",
    handle: "Mino Lee",
    title: "6 hooks viraux en 60 secondes",
    likes: 11894,
    comments: 3530,
    date: "2026-06-27",
    lang: "en",
    summary:
      "6 structures de hooks avec les vues obtenues pour chacune (690K à 30M). Le dernier lui a rapporté 30M de vues et 100K abonnés.",
    transcript: `Fuck it, I'm gonna give y'all six viral hooks in 60 seconds. And the last one got me 30 million views and 100,000 followers.
Hook number one, this one got me 690k views: Everyone tells you X, but no one tells you Y. Everyone will tell you, start posting content, start a personal brand, it's the cheat code to wealth. But no one actually talks about what it's like to...
Two: Let's come clean about the reality of X.
Three: [thing] explained. My credibility: been an intern at Amazon...
Four: explaining something to a five-year-old hook. Phone addiction? Grace, your phone.
Five: People are beginning to realize that [insert weird statement]. People are beginning to realize that the Jester Hero archetype is actually the most optimized version of yourself.
If you want to find the best possible viral hook for your next video, I made an AI that searches through over a thousand viral hooks. Comment AI and I'll send it to you.
The last one, my favorite: Is it possible to [outcome] in [extremely short time frame]? Is it possible to ace a midterm after studying for just one hour?`,
  },
  {
    id: "Dbaz3Lns1_I",
    url: "https://www.instagram.com/reel/Dbaz3Lns1_I/",
    author: "eabhabranded",
    handle: "eabhabranded",
    title: "10 hooks qui marchent à tous les coups",
    likes: 7816,
    comments: 316,
    date: "2026-07-30",
    lang: "en",
    summary:
      "10 phrases d'ouverture courtes, dites face caméra avec le texte à l'écran. Toutes jouent sur le secret ou la perte.",
    transcript: `Fuck it, here are 10 hooks that always work.
One, I shouldn't be saying this.
Two, I have a question.
Three, what would happen if...
Four, I almost didn't post this.
Five, I bet you didn't know this.
Six, you weren't supposed to see this.
Seven, this will cost you money.
Eight, most of you will skip this.
Nine, nobody tells you this.
Ten, you won't believe what I just found.
Follow for more.`,
  },
  {
    id: "DWzni9xEcxL",
    url: "https://www.instagram.com/reel/DWzni9xEcxL/",
    author: "Richard Ens Jr",
    handle: "richardensjr",
    title: "10 hooks qui marchent toujours",
    likes: 89529,
    comments: 6262,
    date: "2026-04-09",
    lang: "en",
    summary:
      "10 hooks très courts (3 à 6 mots), comptés sur les doigts. 89K likes, 6K commentaires.",
    transcript: `Ten hooks that always work.
1. Nobody mentions this.
2. I wish I knew this earlier.
3. Pause for a second.
4. Ever notice this pattern?
5. Here's the real truth.
6. Let me save you hours.
7. This may surprise you.
8. You need this now.
9. You may not agree with this.
10. I just figured this out.`,
  },
  {
    id: "DcOdgWchrQp",
    url: "https://www.instagram.com/reel/DcOdgWchrQp/",
    author: "Heather",
    handle: "heaheelee",
    title: "6 hooks à trous avec les vues",
    likes: 23441,
    comments: 1277,
    date: "2026-08-19",
    lang: "en",
    summary:
      "6 structures à trous, chacune illustrée par la vidéo originale et ses vues (1,4M à 16M).",
    transcript: `1. Me with X / Me without X. (7.4M)
2. In case no one told you this X before. (1.4M)
3. 10 out of 10 habits to X (realistic version). (2.8M)
4. I have no idea what to do in X, I feel so lost. (11.8M)
5. Let's start X together. (16M)
6. Every X idea is taken. (5M)`,
  },
  {
    id: "Db6C7oppvwe",
    url: "https://www.instagram.com/reel/Db6C7oppvwe/",
    author: "Fanny",
    handle: "Feminine Business Coach",
    title: "7 hooks qui fonctionnent à chaque fois (FR)",
    likes: 3,
    comments: 1728,
    date: "2026-08-11",
    lang: "fr",
    summary:
      "7 hooks déjà en français. Explique aussi pourquoi ils marchent : ils créent un manque d'information que le cerveau veut combler, tout en donnant une raison de croire que la réponse sera utile.",
    transcript: `7 hooks qui fonctionnent à chaque fois, pour n'importe quel domaine.
1. Si je devais repartir de zéro, voici exactement ce que je ferais en premier.
2. Personne n'en parle mais...
3. J'ai testé [stratégie] pendant [durée], et voici ce qu'il s'est passé.
Petite pause avant de les utiliser : tu dois absolument comprendre que tous ces hooks fonctionnent pour la même raison. Ils créent un manque d'information que ton cerveau veut combler, tout en lui donnant une raison de penser que la réponse va être utile pour lui. Et c'est ça un bon hook : pas juste donner envie de connaître la suite, mais faire sentir que ça vaut le coup de la connaître.
4. J'ai arrêté de [action], et voici ce qu'il s'est passé depuis.
5. Je trouve qu'on parle pas assez du fait que...
6. J'aurais aimé savoir ça plus tôt. (dans la description)
7. Ça va peut-être te surprendre mais... (dans la description)`,
  },
  {
    id: "DaD_1DKq74G",
    url: "https://www.instagram.com/reel/DaD_1DKq74G/",
    author: "Rachel Martinez",
    handle: "Rachel Martinez",
    title: "Casser le schéma avec un hook visuel",
    likes: 115979,
    comments: 676,
    date: "2026-06-26",
    lang: "en",
    summary:
      "116K likes. Montre 4 façons de commencer une vidéo qui font s'arrêter le cerveau : angle bizarre, scène vue comme dans la vraie vie, plan inhabituel, mouvement.",
    transcript: `If you start your videos like this, they stop because their brain is trying to figure out what's happening.
If you start your video like this, it feels less like a video and more like they're watching you in real life.
If you start your video like this, it's not an angle they're used to seeing, so they're gonna pause.
If you start your videos with something like this, you are going to hook the viewer in and stop them from scrolling.
(Description) Visual hooks are underused and the ones that are used are overused. Have fun with it and get creative! A good visual hook works because it interrupts the scroll. Something is out of context, doesn't make sense at first or a movement is so magnetic that they stop.`,
  },
  {
    id: "Dbjls8lz191",
    url: "https://www.instagram.com/reel/Dbjls8lz191/",
    author: "In Your Corner",
    handle: "Marketing for Photographers",
    title: "5 hooks visuels pour garder l'attention",
    likes: 1342,
    comments: 25,
    date: "2026-08-02",
    lang: "en",
    summary:
      "Pas de voix. 5 gestes filmés à la suite : balayage de main devant l'objectif, caméra retournée, arrivée dans le cadre, page qui cache l'objectif, écran d'ordi qui s'ouvre.",
    transcript: `(Vidéo sans parole. Texte à l'écran : 5 visual hooks to keep people watching.)
1. Main qui balaie devant l'objectif, comme un swipe.
2. Caméra qui tourne, plafond à l'envers, puis retour sur le visage.
3. On s'assoit et on entre dans le cadre d'un coup.
4. Page de carnet retournée devant l'objectif qui cache puis révèle.
5. Écran de MacBook qui s'ouvre, la webcam découvre le visage.
(Description) You get about one second before someone keeps watching or keeps scrolling. A visual hook is how you win it. It's whatever happens on screen before a word is read, the movement or first frame that stops the thumb.`,
  },
  {
    id: "DaneCv1vi9C",
    url: "https://www.instagram.com/reel/DaneCv1vi9C/",
    author: "Maibella",
    handle: "maibella.creates",
    title: "Entrée dans le cadre + gros texte",
    likes: 2417,
    comments: 71,
    date: "2026-07-10",
    lang: "en",
    summary:
      "Pub de créatrice UGC. Elle marche vers la caméra, un gros bloc de texte noir apparaît avec l'offre. Format simple, réutilisable pour une pub.",
    transcript: `(Vidéo sans parole utile. Texte à l'écran : Hire Maibella to be your next UGC/content creator, she also does social media management.)
Plan fixe dans la rue, elle arrive en marchant puis saute, le texte apparaît par-dessus en gros.`,
  },
  {
    id: "Dbu46DFAqJy",
    url: "https://www.instagram.com/reel/Dbu46DFAqJy/",
    author: "Brock Johnson",
    handle: "brock11johnson",
    title: "7 façons de commencer une vidéo (mouvement caméra)",
    likes: 5731,
    comments: 145,
    date: "2026-08-07",
    lang: "en",
    summary:
      "Texte à l'écran : Steal these hooks. 7 mouvements de caméra ou de corps pour ouvrir une vidéo face caméra : marcher vers la caméra, retourner le téléphone, poser le téléphone, le ramasser au sol, le rapprocher du visage, zoomer, jump cut serré.",
    transcript: `(Texte à l'écran : Steal these hooks.)
Start your video by walking towards the camera.
Start your video by flipping the phone towards yourself on a wide angle lens.
Start your video by putting your phone down and leaning forwards.
Start your video by taking a phone up off the ground.
Start your video and then bring your phone close to your face.
Start your video and then zoom in on your face.
Start your video and then jump cut to a close up of your face.`,
  },
];

export type Hook = {
  id: string;
  sourceId: string;
  category: HookCategory;
  fr: string;
  en?: string;
  exemple: string;
  note?: string;
  views?: string;
};

export const HOOKS: Hook[] = [
  // Mino Lee
  {
    id: "mino-1",
    sourceId: "DaGtKEuuQG9",
    category: "verite",
    fr: "Tout le monde te dit X. Personne ne te dit Y.",
    en: "Everyone tells you X, but no one tells you Y.",
    exemple:
      "Tout le monde te dit de lancer un SaaS. Personne ne te dit que le marché est saturé et que l'argent se fait sur les apps mobiles.",
    views: "690K vues",
  },
  {
    id: "mino-2",
    sourceId: "DaGtKEuuQG9",
    category: "confession",
    fr: "Soyons honnêtes deux minutes sur X.",
    en: "Let's come clean about the reality of X.",
    exemple:
      "Soyons honnêtes deux minutes sur ce que ça fait vraiment de vivre de ses apps.",
    views: "2,1M vues",
  },
  {
    id: "mino-3",
    sourceId: "DaGtKEuuQG9",
    category: "verite",
    fr: "X, expliqué par quelqu'un qui l'a vraiment fait.",
    en: "[thing] explained (+ credibility)",
    exemple:
      "Comment une app rapporte 400K par an, expliqué par quelqu'un qui en vit.",
    note: "Ajouter sa crédibilité en une phrase juste après.",
  },
  {
    id: "mino-4",
    sourceId: "DaGtKEuuQG9",
    category: "verite",
    fr: "X, expliqué comme à un enfant de 5 ans.",
    en: "Explaining something to a five-year-old hook.",
    exemple:
      "Comment une app gagne de l'argent, expliqué comme à un enfant de 5 ans.",
    views: "2,3M vues",
  },
  {
    id: "mino-5",
    sourceId: "DaGtKEuuQG9",
    category: "verite",
    fr: "Les gens commencent à comprendre que [phrase inattendue].",
    en: "People are beginning to realize that [weird statement].",
    exemple:
      "Les gens commencent à comprendre que les apps mobiles sont le nouveau dropshipping, en mieux.",
    views: "725K vues",
  },
  {
    id: "mino-6",
    sourceId: "DaGtKEuuQG9",
    category: "question",
    fr: "Est-ce que c'est possible de [résultat] en [temps très court] ?",
    en: "Is it possible to [outcome] in [extremely short time frame]?",
    exemple:
      "Est-ce que c'est possible de mettre une app sur l'App Store en 7 jours sans savoir coder ?",
    views: "12,4M vues, 30M cumulées",
    note: "Son préféré : 30M de vues et 100K abonnés avec cette structure.",
  },

  // eabhabranded
  {
    id: "eabha-1",
    sourceId: "Dbaz3Lns1_I",
    category: "secret",
    fr: "Je ne devrais pas dire ça.",
    en: "I shouldn't be saying this.",
    exemple:
      "Je ne devrais pas dire ça, mais la plupart des apps qui rapportent sont ridiculement simples.",
  },
  {
    id: "eabha-2",
    sourceId: "Dbaz3Lns1_I",
    category: "question",
    fr: "J'ai une question.",
    en: "I have a question.",
    exemple:
      "J'ai une question : pourquoi tu passes 4 heures par jour sur des apps que d'autres ont créées ?",
  },
  {
    id: "eabha-3",
    sourceId: "Dbaz3Lns1_I",
    category: "question",
    fr: "Qu'est-ce qui se passerait si...",
    en: "What would happen if...",
    exemple:
      "Qu'est-ce qui se passerait si tu lançais une app cette semaine, sans écrire une ligne de code ?",
  },
  {
    id: "eabha-4",
    sourceId: "Dbaz3Lns1_I",
    category: "confession",
    fr: "J'ai failli ne pas poster ça.",
    en: "I almost didn't post this.",
    exemple:
      "J'ai failli ne pas poster ça. Voilà ce que mon app rapporte chaque mois.",
  },
  {
    id: "eabha-5",
    sourceId: "Dbaz3Lns1_I",
    category: "secret",
    fr: "Je parie que tu ne savais pas ça.",
    en: "I bet you didn't know this.",
    exemple:
      "Je parie que tu ne savais pas qu'une petite app de niche peut rapporter plus qu'un SaaS.",
  },
  {
    id: "eabha-6",
    sourceId: "Dbaz3Lns1_I",
    category: "secret",
    fr: "Tu n'étais pas censé voir ça.",
    en: "You weren't supposed to see this.",
    exemple:
      "Tu n'étais pas censé voir ça : les vrais chiffres de mon app, sans filtre.",
  },
  {
    id: "eabha-7",
    sourceId: "Dbaz3Lns1_I",
    category: "urgence",
    fr: "Ça va te coûter de l'argent.",
    en: "This will cost you money.",
    exemple:
      "Ne pas savoir ça va te coûter de l'argent : l'erreur numéro 1 quand on lance une app.",
  },
  {
    id: "eabha-8",
    sourceId: "Dbaz3Lns1_I",
    category: "urgence",
    fr: "La plupart des gens vont zapper cette vidéo.",
    en: "Most of you will skip this.",
    exemple:
      "La plupart des gens vont zapper cette vidéo. Ceux qui restent vont comprendre pourquoi les apps mobiles sont la meilleure opportunité de 2026.",
  },
  {
    id: "eabha-9",
    sourceId: "Dbaz3Lns1_I",
    category: "secret",
    fr: "Personne ne te dit ça.",
    en: "Nobody tells you this.",
    exemple:
      "Personne ne te dit ça : tu n'as pas besoin de savoir coder pour vivre d'une app.",
  },
  {
    id: "eabha-10",
    sourceId: "Dbaz3Lns1_I",
    category: "secret",
    fr: "Tu ne vas pas croire ce que je viens de trouver.",
    en: "You won't believe what I just found.",
    exemple:
      "Tu ne vas pas croire ce que je viens de trouver sur l'App Store : une app à 3 écrans qui fait 20K par mois.",
  },

  // Richard Ens Jr
  {
    id: "richard-1",
    sourceId: "DWzni9xEcxL",
    category: "secret",
    fr: "Personne n'en parle.",
    en: "Nobody mentions this.",
    exemple:
      "Personne n'en parle : les apps mobiles rapportent encore énormément en 2026.",
  },
  {
    id: "richard-2",
    sourceId: "DWzni9xEcxL",
    category: "confession",
    fr: "J'aurais aimé savoir ça plus tôt.",
    en: "I wish I knew this earlier.",
    exemple:
      "J'aurais aimé savoir ça avant de lancer ma première app.",
  },
  {
    id: "richard-3",
    sourceId: "DWzni9xEcxL",
    category: "urgence",
    fr: "Arrête-toi deux secondes.",
    en: "Pause for a second.",
    exemple:
      "Arrête-toi deux secondes. Tu es en train de scroller une app que quelqu'un a créée et qui lui rapporte de l'argent pendant que tu regardes.",
  },
  {
    id: "richard-4",
    sourceId: "DWzni9xEcxL",
    category: "question",
    fr: "T'as déjà remarqué ce truc ?",
    en: "Ever notice this pattern?",
    exemple:
      "T'as déjà remarqué ? Les apps qui cartonnent font toutes exactement la même chose.",
  },
  {
    id: "richard-5",
    sourceId: "DWzni9xEcxL",
    category: "verite",
    fr: "Voilà la vérité.",
    en: "Here's the real truth.",
    exemple:
      "Voilà la vérité : coder n'a jamais été le problème. Le problème, c'est que personne ne connaît ton app.",
  },
  {
    id: "richard-6",
    sourceId: "DWzni9xEcxL",
    category: "urgence",
    fr: "Je vais te faire gagner des heures.",
    en: "Let me save you hours.",
    exemple:
      "Je vais te faire gagner des mois : voilà comment on crée une app avec l'IA en 2026.",
  },
  {
    id: "richard-7",
    sourceId: "DWzni9xEcxL",
    category: "verite",
    fr: "Ça va peut-être te surprendre.",
    en: "This may surprise you.",
    exemple:
      "Ça va peut-être te surprendre, mais mon app la plus rentable m'a pris 3 semaines.",
  },
  {
    id: "richard-8",
    sourceId: "DWzni9xEcxL",
    category: "urgence",
    fr: "T'as besoin de ça, maintenant.",
    en: "You need this now.",
    exemple:
      "Si tu veux lancer une app cette année, t'as besoin de voir ça maintenant.",
  },
  {
    id: "richard-9",
    sourceId: "DWzni9xEcxL",
    category: "verite",
    fr: "Tu ne vas peut-être pas être d'accord.",
    en: "You may not agree with this.",
    exemple:
      "Tu ne vas peut-être pas être d'accord, mais le SaaS est mort pour les débutants.",
  },
  {
    id: "richard-10",
    sourceId: "DWzni9xEcxL",
    category: "confession",
    fr: "Je viens de comprendre un truc.",
    en: "I just figured this out.",
    exemple:
      "Je viens de comprendre pourquoi 90 % des apps ne rapportent rien.",
  },

  // Heather (à trous)
  {
    id: "heather-1",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "Moi avec ___ / Moi sans ___.",
    en: "Me with ___ / Me without ___.",
    exemple:
      "Moi sans l'IA pour créer mon app / Moi avec l'IA.",
    views: "7,4M vues",
  },
  {
    id: "heather-2",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "Au cas où personne ne te l'a jamais dit : ___.",
    en: "In case no one told you this ___ before.",
    exemple:
      "Au cas où personne ne te l'a jamais dit : tu peux créer une app sans savoir coder.",
    views: "1,4M vues",
  },
  {
    id: "heather-3",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "10 habitudes sur 10 pour ___ (version réaliste).",
    en: "10/10 habits to ___ (realistic version).",
    exemple:
      "10 habitudes sur 10 pour lancer une app en 30 jours (version réaliste).",
    views: "2,8M vues",
  },
  {
    id: "heather-4",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "Je ne sais pas quoi faire pour ___, je suis complètement perdu.",
    en: "I have no idea what to do in ___, I feel so lost.",
    exemple:
      "\"Je ne sais pas par où commencer pour créer mon app, je suis complètement perdu.\" Ok, voilà exactement quoi faire.",
    views: "11,8M vues",
    note: "Format : on cite un message reçu, puis on répond.",
  },
  {
    id: "heather-5",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "On lance ___ ensemble ?",
    en: "Let's start a ___ together.",
    exemple:
      "On lance une app ensemble ? Jour 1.",
    views: "16M vues",
  },
  {
    id: "heather-6",
    sourceId: "DcOdgWchrQp",
    category: "template",
    fr: "\"Toutes les idées de ___ sont déjà prises.\"",
    en: "Every ___ idea is taken.",
    exemple:
      "\"Toutes les idées d'app sont déjà prises.\" Faux. Regarde ça.",
    views: "5M vues",
  },

  // Fanny (FR)
  {
    id: "fanny-1",
    sourceId: "Db6C7oppvwe",
    category: "recit",
    fr: "Si je devais repartir de zéro, voici exactement ce que je ferais en premier.",
    exemple:
      "Si je devais repartir de zéro dans les apps mobiles, voilà exactement ce que je ferais en premier.",
  },
  {
    id: "fanny-2",
    sourceId: "Db6C7oppvwe",
    category: "secret",
    fr: "Personne n'en parle mais...",
    exemple:
      "Personne n'en parle mais les petites apps de niche rapportent plus que les grosses apps.",
  },
  {
    id: "fanny-3",
    sourceId: "Db6C7oppvwe",
    category: "recit",
    fr: "J'ai testé [stratégie] pendant [durée], et voici ce qu'il s'est passé.",
    exemple:
      "J'ai testé les vidéos virales pour mon app pendant 30 jours, et voici ce qu'il s'est passé.",
  },
  {
    id: "fanny-4",
    sourceId: "Db6C7oppvwe",
    category: "recit",
    fr: "J'ai arrêté de [action], et voici ce qu'il s'est passé depuis.",
    exemple:
      "J'ai arrêté de coder moi-même, et voici ce qu'il s'est passé depuis.",
  },
  {
    id: "fanny-5",
    sourceId: "Db6C7oppvwe",
    category: "verite",
    fr: "Je trouve qu'on ne parle pas assez du fait que...",
    exemple:
      "Je trouve qu'on ne parle pas assez du fait que tout le monde a oublié les apps mobiles.",
  },
  {
    id: "fanny-6",
    sourceId: "Db6C7oppvwe",
    category: "confession",
    fr: "J'aurais aimé savoir ça plus tôt.",
    exemple:
      "J'aurais aimé savoir ça plus tôt : une app, ça se vend avant même d'être finie.",
  },
  {
    id: "fanny-7",
    sourceId: "Db6C7oppvwe",
    category: "verite",
    fr: "Ça va peut-être te surprendre mais...",
    exemple:
      "Ça va peut-être te surprendre mais mes meilleures apps n'ont rien d'original.",
  },

  // Visuels : Rachel Martinez
  {
    id: "rachel-1",
    sourceId: "DaD_1DKq74G",
    category: "visuel",
    fr: "Commencer sur une image hors contexte.",
    en: "Their brain is trying to figure out what's happening.",
    exemple:
      "Premier plan : un truc qui ne colle pas (tu es dans un placard, à l'envers, en plein mouvement). Le cerveau s'arrête pour comprendre.",
  },
  {
    id: "rachel-2",
    sourceId: "DaD_1DKq74G",
    category: "visuel",
    fr: "Filmer comme si on te surprenait dans la vraie vie.",
    en: "It feels less like a video and more like they're watching you in real life.",
    exemple:
      "Plan miroir en train de te préparer, ou en train de bosser sur ton app, et tu te retournes vers la caméra pour parler.",
  },
  {
    id: "rachel-3",
    sourceId: "DaD_1DKq74G",
    category: "visuel",
    fr: "Un angle qu'on n'a pas l'habitude de voir.",
    en: "It's not an angle they're used to seeing, so they're gonna pause.",
    exemple:
      "Allongé sur le lit, caméra au-dessus de toi. Ou vue de très haut, très bas. Pas le plan face caméra classique.",
  },
  {
    id: "rachel-4",
    sourceId: "DaD_1DKq74G",
    category: "visuel",
    fr: "Un mouvement magnétique dès la première image.",
    en: "A movement so magnetic that they stop.",
    exemple:
      "Tu marches vers la caméra, tu poses le téléphone, tu te retournes. Il se passe quelque chose avant le premier mot.",
  },

  // Visuels : In Your Corner
  {
    id: "iyc-1",
    sourceId: "Dbjls8lz191",
    category: "visuel",
    fr: "Balayage de main devant l'objectif.",
    exemple:
      "Ta main passe devant la caméra comme un swipe, et le plan suivant s'ouvre sur toi.",
  },
  {
    id: "iyc-2",
    sourceId: "Dbjls8lz191",
    category: "visuel",
    fr: "Caméra retournée puis remise à l'endroit.",
    exemple:
      "Le plafond à l'envers, la caméra tourne, et ton visage arrive. Une seconde de confusion qui retient.",
  },
  {
    id: "iyc-3",
    sourceId: "Dbjls8lz191",
    category: "visuel",
    fr: "Entrer dans le cadre d'un coup.",
    exemple:
      "Cadre vide, tu t'assois et tu apparais d'un coup face caméra. Marche aussi en arrivant en marchant (voir Maibella).",
  },
  {
    id: "iyc-4",
    sourceId: "Dbjls8lz191",
    category: "visuel",
    fr: "Une page qui cache puis révèle.",
    exemple:
      "Tu tournes la page d'un carnet devant l'objectif, elle cache l'écran, puis découvre ton visage ou ton écran d'app.",
  },
  {
    id: "iyc-5",
    sourceId: "Dbjls8lz191",
    category: "visuel",
    fr: "Ouvrir l'écran du Mac face à la webcam.",
    exemple:
      "Filmé depuis la webcam : l'écran s'ouvre et découvre ton visage. Parfait pour une vidéo sur la création d'app avec l'IA.",
  },

  // Visuels : Maibella
  {
    id: "maibella-1",
    sourceId: "DaneCv1vi9C",
    category: "visuel",
    fr: "Marcher vers la caméra + gros bloc de texte avec l'offre.",
    exemple:
      "Plan fixe, tu arrives en marchant, un gros texte noir apparaît : \"Tu veux lancer une app sans coder ? Regarde ça.\" Format simple pour une pub.",
  },
  // Visuels : Brock Johnson
  {
    id: "brock-1",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Marcher vers la caméra en parlant.",
    en: "Start your video by walking towards the camera.",
    exemple:
      "Téléphone posé, tu es à 3 mètres, tu avances vers l'objectif en lançant ta première phrase. Le mouvement arrête le pouce avant le premier mot.",
  },
  {
    id: "brock-2",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Retourner le téléphone vers soi en grand angle.",
    en: "Start your video by flipping the phone towards yourself on a wide angle lens.",
    exemple:
      "Caméra 0,5x, bras tendu, tu fais pivoter le téléphone vers ton visage. Le décor défile une demi-seconde puis tu apparais.",
  },
  {
    id: "brock-3",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Poser le téléphone puis se pencher vers l'objectif.",
    en: "Start your video by putting your phone down and leaning forwards.",
    exemple:
      "Tu poses le téléphone sur le bureau, tu t'assois et tu te penches en avant vers la caméra. Impression de confidence, comme si tu allais dire un secret.",
  },
  {
    id: "brock-4",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Ramasser le téléphone au sol.",
    en: "Start your video by taking a phone up off the ground.",
    exemple:
      "Le téléphone est au sol, caméra vers le plafond. Tu le ramasses et il arrive sur ton visage. Première image bizarre, le cerveau veut comprendre.",
  },
  {
    id: "brock-5",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Rapprocher le téléphone du visage.",
    en: "Start your video and then bring your phone close to your face.",
    exemple:
      "Plan normal, puis tu ramènes le téléphone très près de ton visage sur un mot clé. Marche bien pour appuyer un chiffre ou une vérité qui pique.",
  },
  {
    id: "brock-6",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Zoom progressif sur le visage.",
    en: "Start your video and then zoom in on your face.",
    exemple:
      "Tu zoomes doucement pendant la première phrase (au montage ou avec les doigts). Le cadre bouge, l'œil reste accroché.",
  },
  {
    id: "brock-7",
    sourceId: "Dbu46DFAqJy",
    category: "visuel",
    fr: "Jump cut vers un gros plan du visage.",
    en: "Start your video and then jump cut to a close up of your face.",
    exemple:
      "Plan large sur les 3 premiers mots, coupe sèche sur un plan très serré pour la suite. La coupe brutale relance l'attention.",
  },
];
