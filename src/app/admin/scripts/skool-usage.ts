import type { VideoScript } from "./types";

// Fichier lu seulement par page.tsx (côté serveur) : ne jamais l'importer dans un
// composant client.
//
// Grande vidéo Skool « Comment utiliser ce Skool » (fiche de /admin/videos-skool,
// idée de Jeremy du 19 nov. 2026 : faire lire le Skool à son Claude Code par Claude
// in Chrome, pour qu'il réfléchisse avec la méthode). Jeremy la lit lui-même :
// phrases complètes, ponctuation normale.
// Sources : les pages de « Commence ici » (Le parcours en 7 étapes, Comment on
// travaille ensemble, Comment me joindre), l'arbre réel du Skool relevé le 26 nov.
// 2026 et la documentation officielle de Claude Code avec Chrome
// (code.claude.com/docs/en/chrome et /desktop), lue le 26 nov. 2026.

const PROMPT = `Lis le Skool App Mastery dans mon Chrome, où je suis déjà connecté, pour m'aider ensuite avec cette méthode plutôt qu'avec des conseils généraux.

Mon étape actuelle : [ÉCRIS TON ÉTAPE, par exemple « Étape 4 · Créer ton app »]

1. Ouvre https://www.skool.com/app-secrets-mobile-web-4073/classroom
2. Dans le cours « 👉🏼 Commence ici », lis « Le parcours en 7 étapes » et « Comment on travaille ensemble ».
3. Ouvre le cours de mon étape et lis chaque leçon dans l'ordre, puis chaque page du dossier « ❓ FAQ » de ce cours. Pour une leçon vidéo, lis le texte sous la vidéo.
4. Tu lis seulement : ne publie rien, ne commente rien, ne like rien et ne modifie rien sur le Skool.
5. Écris un résumé dans docs/methode-app-mastery.md : pour chaque leçon, son titre, les règles, les chiffres et les erreurs à éviter, tels que le Skool les donne, sans ajouter tes propres conseils. Si le fichier existe déjà, complète-le.
6. Ajoute dans le CLAUDE.md de mon projet cette consigne : avant de me conseiller sur mon idée, mon onboarding, mon paywall, mon contenu ou mes chiffres, relis docs/methode-app-mastery.md et applique cette méthode, même quand elle contredit tes habitudes.
7. Vérifie que ce projet n'est pas sur un dépôt GitHub public. S'il l'est, préviens-moi avant d'enregistrer quoi que ce soit.
8. À partir de maintenant, quand tu me conseilles, dis-moi de quelle leçon vient ton conseil. Si le Skool ne dit rien sur ma question, dis-le-moi au lieu d'inventer.`;

export const SCRIPT_SKOOL_USAGE: VideoScript = {
  slug: "skool-usage",
  kind: "skool",
  label: "Skool · Utiliser le Skool",
  status: "Prêt à tourner",
  updatedAt: "26 nov. 2026",
  title: "Comment utiliser ce Skool, et le faire lire à ton Claude Code",
  why: `Les élèves demandent où retrouver une rediffusion, comment voir les messages de la communauté, ou s'il faut tout recommencer après avoir regardé les vidéos. Et c'est ton idée du 19 nov. : leur Claude Code conseille comme pour n'importe quel projet tant qu'il n'a pas lu le Skool. Cette vidéo montre comment le Skool est rangé, puis comment le brancher à leur Claude Code avec Claude in Chrome, pour qu'il réfléchisse avec ta méthode à chaque session.`,
  facts: [
    { label: "Durée", value: "Environ 11 min (1 650 mots)" },
    { label: "Style", value: "Tu lis le script avec ta vraie voix, les captures du Skool et du terminal passent à l'écran pendant que tu parles" },
    { label: "Où la mettre", value: "Dans « 👉🏼 Commence ici », juste après « Le parcours en 7 étapes »" },
    { label: "Titre Skool", value: "« Utiliser ce Skool avec ton Claude Code » (39 caractères, Skool en accepte 50)" },
    { label: "Sources", value: "Les pages de « Commence ici », l'arbre réel du Skool (26 nov.), la documentation officielle de Claude Code avec Chrome" },
  ],
  altTitles: [],
  plan: [],
  sections: [
    {
      time: "0:00",
      title: "Intro",
      beats: [
        {
          say: `Dans cette vidéo, je vais te montrer comment te servir de ce Skool, et comment le faire lire à ton Claude Code. Avant tout, je veux que ce soit clair : tu peux tout à fait regarder les vidéos. Je les ai toutes faites moi-même, et elles sont vraiment intéressantes. Mais il y a deux profils différents ici, et ils ne vont pas se servir du Skool de la même façon.`,
        },
        {
          say: `Le premier profil, c'est la personne qui s'y connaît déjà en IA, qui utilise bien Claude Code, et qui a parfois déjà une application. Si c'est ton cas, je ne te recommande pas forcément de regarder toutes les vidéos. Regarde seulement celles dont tu as besoin, et surtout celles qu'il faut absolument maîtriser : le cours sur le marketing, qui est extrêmement important, la vidéo sur l'onboarding et la vidéo sur le paywall. Pour tout le reste, je te recommande de suivre la suite de cette vidéo et de connecter ton Claude Code au Skool. Il lira les leçons pour toi, et il te conseillera avec la méthode.`,
          show: `Les deux profils côte à côte. Puis le cours « Étape 6 · Faire connaître ton app », et les leçons « Les clés d'un bon onboarding » et « Les clés d'un bon paywall » (Étape 3 · Branding & outils, dossier Onboarding et paywall).`,
        },
        {
          say: `Le deuxième profil, c'est la personne qui débute avec l'IA et avec Claude Code. Dans ce cas, tu suis le parcours dans l'ordre, étape par étape, en regardant les vidéos de ton étape. Et tu branches quand même ton Claude Code au Skool, pour qu'il t'aide à appliquer chaque leçon.`,
        },
        {
          say: `Je vais d'abord te montrer comment tout est rangé, pour que tu trouves toujours ce dont tu as besoin. Ensuite, on va brancher ton Claude Code au Skool. Par défaut, Claude te conseille comme il conseillerait n'importe qui, sur n'importe quel projet. Une fois qu'il a lu le Skool, il réfléchit avec la méthode qu'on utilise ensemble, et c'est là que ses conseils changent vraiment.`,
        },
      ],
    },
    {
      time: "1:30",
      title: "Partie 1 · Comment le Skool est rangé",
      beats: [
        {
          say: `En haut du Skool, trois onglets comptent. Community, c'est la communauté : les posts de tout le monde, mes annonces quand une nouvelle vidéo sort, et le post épinglé où tu te présentes. Classroom, ce sont les cours, et c'est là que tu passes le plus de temps. Calendar, c'est le calendrier des lives.`,
          show: `Les onglets Community, Classroom et Calendar surlignés un par un.`,
        },
        {
          say: `Dans Classroom, le premier cours s'appelle Commence ici. C'est le point de départ : la bienvenue, comment me joindre, ta première semaine, et surtout Le parcours en 7 étapes, qui est la carte de tout l'accompagnement.`,
          show: `Le cours « 👉🏼 Commence ici » ouvert, puis la page « Le parcours en 7 étapes ».`,
        },
        {
          say: `Ensuite, tu as un cours par étape, numérotés de 1 à 7 : l'introduction, trouver et valider ton idée, le branding et les outils, créer ton app, la publier, la faire connaître, et aller plus loin. Dans chaque cours, les vidéos sont rangées dans des dossiers, dans l'ordre où tu en as besoin. Par exemple, dans l'étape 4, tu lances le projet, puis tu peaufines, puis tu branches la connexion et les abonnements, et tu finis par ce qu'il faut faire avant le lancement.`,
          show: `La liste des 7 cours, puis l'étape 4 ouverte avec ses dossiers : Lancer le projet, Peaufiner, Connexion et abonnements, Avant le lancement.`,
        },
        {
          say: `Enfin, il y a les cours sans numéro : Claude Code en profondeur, Git et GitHub, les rediffusions des lives, et quelques autres. Ceux-là servent à toutes les étapes. Tu n'as pas à les suivre dans l'ordre, tu y vas quand tu en as besoin.`,
          show: `Les cours sans numéro, en bas de la liste.`,
        },
      ],
    },
    {
      time: "2:50",
      title: "Partie 2 · Une étape à la fois",
      beats: [
        {
          say: `Si tu débutes, la règle la plus importante, c'est de ne suivre qu'une étape à la fois. Tu regardes les vidéos de ton étape, tu les appliques, et tu passes à la suivante. Le parcours en 7 étapes te dit, pour chaque étape, quand elle commence et à quel moment elle est terminée. Par exemple, l'étape 5 est faite quand ton app est en ligne et que le paiement marche. Tant que ce n'est pas le cas, tu restes sur l'étape 5.`,
          show: `« Le parcours en 7 étapes », avec la ligne « C'est fait quand » de l'étape 5 surlignée.`,
        },
        {
          say: `Je vois souvent des gens qui regardent tout d'un coup, puis qui se demandent s'ils ne devraient pas tout recommencer. Ça ne sert à rien, et ça fait perdre des semaines. Le marketing, par exemple, attend que ton app soit construite, parce qu'avant, tu n'as rien à filmer. Et dans l'étape 6, la publicité et les promotions sont à la fin du cours : tu les gardes pour le moment où ton app vend.`,
        },
        {
          say: `Et si tu arrives avec une app déjà faite, tu ne repars pas de zéro : tu passes directement à l'étape 4, et on commence par l'audit.`,
        },
      ],
    },
    {
      time: "4:00",
      title: "Partie 3 · Les FAQ, les lives et tes questions",
      beats: [
        {
          say: `À la fin de chaque étape, tu as un dossier FAQ. Ce sont les questions qu'on me pose le plus souvent à ce moment-là, avec ma réponse écrite, et chacune se lit en une minute. Par exemple, dans l'étape 2, comment savoir si ton idée est bonne ou quel prix mettre pour ton abonnement. Dans l'étape 6, sur combien de comptes publier, à quel rythme, ou quoi faire quand tu as des vues sans téléchargements. Avant de me poser une question, regarde la FAQ de ton étape, parce que la réponse y est souvent.`,
          show: `Le dossier « ❓ FAQ » de l'étape 6 ouvert, avec ses questions.`,
        },
        {
          say: `Ensuite, il y a les lives, le jeudi à 20 heures, environ deux fois par mois. Tu les trouves dans l'onglet Calendar. Si tu en rates un, la rediffusion est dans le cours Rediffusions des Coachings. La première page de ce cours, c'est le sommaire des lives par sujet : tu cherches ton sujet, et le lien t'emmène directement à la bonne minute du bon live.`,
          show: `La page « Sommaire des lives par sujet », puis un clic qui ouvre un live à la bonne minute.`,
        },
        {
          say: `Pour tes questions, tu m'écris sur WhatsApp, en texte ou en vocal, avec des captures d'écran ou une vidéo de ton écran, parce que je vois le problème beaucoup plus vite. Si ta question peut aider tout le monde, pose-la dans la communauté. Et si un problème ne se règle pas par message, on prend un appel, le mardi ou le jeudi après-midi, pendant 30 minutes, réservé au moins 48 heures à l'avance. Le lien est dans Commence ici, sur la page Comment me joindre.`,
          show: `La page « Comment me joindre et quand on s'appelle ».`,
        },
      ],
    },
    {
      time: "5:30",
      title: "Partie 4 · Pourquoi donner le Skool à ton Claude Code",
      beats: [
        {
          say: `Maintenant, la deuxième partie. Ton Claude Code est très fort pour coder, mais il ne connaît pas la méthode. Sans le Skool, il te conseille comme pour n'importe quel projet. Il te propose d'ajouter des fonctionnalités, de faire un test A/B avec 50 utilisateurs, ou de refaire ton paywall alors que tu n'as eu que 200 téléchargements.`,
        },
        {
          say: `Avec le Skool, il réfléchit comme on le fait ensemble. Si tu lui dis que tes utilisateurs ne paient pas, il commence par regarder combien tu as de téléchargements, et en dessous de 1 000, il te dit que le problème vient de ton contenu, pas de ton app. C'est la même chose pour ton idée, ton onboarding, ton paywall ou tes vidéos : il applique les critères des leçons au lieu de ses habitudes.`,
          show: `La même demande posée deux fois à Claude, sans le Skool puis avec le Skool, les deux réponses côte à côte.`,
        },
      ],
    },
    {
      time: "6:30",
      title: "Partie 5 · Brancher Claude Code à Chrome",
      beats: [
        {
          say: `Pour que Claude lise le Skool, il faut qu'il puisse ouvrir des pages dans ton navigateur. C'est ce que fait l'extension Claude in Chrome. Il te faut Google Chrome, ou un navigateur proche comme Edge, Brave ou Arc, et un abonnement Claude, Pro ou Max, avec lequel tu es connecté dans Claude Code. Une clé d'API ne suffit pas.`,
        },
        {
          say: `Installe l'extension Claude in Chrome depuis le Chrome Web Store, et connecte-la avec le même compte Claude que ton Claude Code. Ensuite, ouvre le Skool dans ce même Chrome et connecte-toi à ton compte. Claude utilise les connexions de ton navigateur, donc il verra le Skool exactement comme toi.`,
          show: `La page de l'extension sur le Chrome Web Store, puis le Skool ouvert et connecté dans Chrome.`,
        },
        {
          say: `Dans le terminal, lance Claude Code avec claude --chrome. Pour ne plus avoir à le taper, tape /chrome une fois et active Chrome par défaut. Si tu utilises l'application Claude, installe quand même l'extension : le navigateur intégré à l'application n'a pas tes connexions, donc il ne peut pas ouvrir le Skool, alors que l'extension passe par ton Chrome.`,
          show: `Le terminal avec « claude --chrome », puis le menu de /chrome avec l'option pour l'activer par défaut.`,
        },
        {
          say: `La première fois que Claude ouvre le Skool, il te demande l'autorisation. Autorise-le pour skool.com, et tu le verras ouvrir un nouvel onglet et lire les pages en direct. Si tu veux voir l'installation en détail, j'ai fait une vidéo dans le cours Claude Code en profondeur, la leçon Claude Chrome.`,
          show: `La demande d'autorisation, puis Claude qui ouvre le Skool dans un nouvel onglet.`,
        },
      ],
    },
    {
      time: "8:00",
      title: "Partie 6 · Ce qu'il faut lui demander",
      beats: [
        {
          say: `Une fois que c'est branché, ouvre Claude Code dans le dossier de ton projet et donne-lui le prompt qui est dans la description de cette leçon. Tu remplaces seulement ton étape.`,
          show: `Le prompt collé dans Claude Code, avec l'étape à remplacer surlignée.`,
        },
        {
          say: `Ce prompt lui demande de lire Le parcours en 7 étapes, puis toutes les leçons de ton étape et sa FAQ. Il écrit ensuite un résumé dans un fichier de ton projet, avec les règles, les chiffres et les erreurs à éviter, et il ajoute une consigne dans ton CLAUDE.md pour relire ce fichier avant de te conseiller. Comme ça, il s'en sert à chaque session, sans tout relire.`,
          show: `Claude qui lit les leçons dans Chrome, puis le fichier docs/methode-app-mastery.md et la consigne ajoutée dans CLAUDE.md.`,
        },
        {
          say: `Le prompt lui demande aussi de te dire de quelle leçon vient chaque conseil. C'est important, parce que tu peux vérifier, et parce que s'il ne trouve rien dans le Skool sur ta question, il doit te le dire au lieu d'inventer.`,
        },
        {
          say: `Quand tu passes à l'étape suivante, tu relances le même prompt avec ta nouvelle étape, et il complète son résumé. Ce fichier reste chez toi : ton projet peut être sur GitHub, mais jamais sur un dépôt public.`,
        },
      ],
    },
    {
      time: "9:20",
      title: "Partie 7 · Ses limites",
      beats: [
        {
          say: `Claude lit le texte des pages, il ne regarde pas les vidéos. Presque toutes les leçons vidéo ont un résumé écrit en dessous, donc il en retient l'essentiel, mais la vidéo en dit toujours plus. C'est pour ça que le marketing, l'onboarding et le paywall, tu les regardes en vidéo, quel que soit ton profil.`,
        },
        {
          say: `Il ne remplace pas non plus mon avis. Pour savoir si ton idée tient la route, pour l'audit de ton app ou pour une décision importante, tu m'en parles. Claude t'aide à avancer entre deux échanges, avec la même méthode.`,
        },
        {
          say: `Et il lit seulement : le prompt lui interdit de publier, de commenter ou de modifier quoi que ce soit sur le Skool.`,
        },
      ],
    },
    {
      time: "10:10",
      title: "Récap",
      beats: [
        {
          say: `Si je résume : si tu t'y connais déjà en IA, tu regardes le marketing, l'onboarding et le paywall, et tu laisses ton Claude Code lire le reste. Si tu débutes, tu suis une seule étape à la fois, en commençant par Le parcours en 7 étapes. Avant de poser une question, tu regardes la FAQ de ton étape et le sommaire des lives. Ensuite, tu branches Claude Code à Chrome avec l'extension Claude in Chrome, tu lui donnes le prompt de la description, et il réfléchit avec la méthode à chaque session. Quand tu passes à l'étape suivante, tu relances le prompt.`,
        },
      ],
    },
  ],
  description: `Comment utiliser ce Skool, et le faire lire à ton Claude Code

🎯 Objectif de la vidéo
Savoir où trouver ce dont tu as besoin à ton étape, et brancher ton Claude Code au Skool pour qu'il réfléchisse avec la méthode au lieu de te donner des conseils généraux.

👥 Deux façons de suivre ce Skool
• Tu t'y connais déjà en IA, tu utilises bien Claude Code ou tu as déjà une app : regarde seulement les vidéos dont tu as besoin, et surtout le cours marketing (Étape 6), la vidéo sur l'onboarding et celle sur le paywall (Étape 3). Pour tout le reste, connecte ton Claude Code au Skool
• Tu débutes avec l'IA et Claude Code : suis le parcours dans l'ordre, étape par étape, et branche aussi ton Claude Code au Skool

📚 Comment le Skool est rangé
• Community : les posts, les annonces des nouvelles vidéos et le post épinglé pour te présenter
• Classroom : les cours. Calendar : les lives
• 👉🏼 Commence ici : la bienvenue, comment me joindre, ta première semaine et Le parcours en 7 étapes
• Un cours par étape, de 1 à 7, avec les vidéos rangées dans des dossiers dans l'ordre
• Les cours sans numéro (Claude Code en profondeur, Git/GitHub, les rediffusions…) servent à toutes les étapes

🪜 Si tu débutes : une étape à la fois
• Regarde les vidéos de ton étape, applique, puis passe à la suivante
• Le parcours en 7 étapes dit quand chaque étape commence et quand elle est faite
• Tu as déjà une app : passe directement à l'étape 4, on commence par l'audit
• La publicité et les promotions sont à la fin de l'étape 6, pour quand ton app vend

💬 Les FAQ, les lives et tes questions
• Chaque étape finit par un dossier ❓ FAQ : regarde-le avant de poser ta question
• Les lives : le jeudi à 20 h, environ deux fois par mois, dans Calendar
• Les rediffusions : dans Rediffusions des Coachings, avec le sommaire des lives par sujet en première page
• Tes questions : sur WhatsApp, en texte ou en vocal, avec des captures. Les questions utiles à tous : dans la communauté
• Un appel : le mardi ou le jeudi après-midi, 30 minutes, réservé 48 h à l'avance (lien dans Commence ici > Comment me joindre)

🔌 Brancher ton Claude Code au Skool
1. Il te faut Google Chrome (ou Edge, Brave, Arc) et un abonnement Claude Pro ou Max connecté dans Claude Code (une clé d'API ne suffit pas)
2. Installe l'extension Claude in Chrome : https://chromewebstore.google.com/detail/claude/fcoeoabgfenejglbffodgkkbkcdhcgfn
3. Connecte-la avec le même compte Claude que ton Claude Code
4. Ouvre le Skool dans ce Chrome et connecte-toi
5. Dans le terminal : claude --chrome (ou /chrome une fois pour l'activer par défaut). Dans l'application Claude, installe aussi l'extension : son navigateur intégré n'a pas tes connexions
6. Autorise Claude sur skool.com quand il te le demande
📺 L'installation en vidéo : la leçon Claude Chrome du cours Claude Code en profondeur

⚠️ Ses limites
• Claude lit le texte des pages, il ne regarde pas les vidéos : le marketing, l'onboarding et le paywall, regarde-les en vidéo
• Il ne remplace ni mon avis sur ton idée, ni l'audit, ni nos appels
• Il lit seulement : le prompt lui interdit de publier ou de modifier quoi que ce soit sur le Skool

🤖 Le prompt à copier
Ouvre Claude Code dans le dossier de ton projet, colle ce prompt et remplace ton étape. Relance-le à chaque nouvelle étape.

${PROMPT}

✅ À retenir
• Déjà à l'aise avec l'IA : le marketing, l'onboarding et le paywall en vidéo, le reste par ton Claude Code
• Tu débutes : une seule étape à la fois, en commençant par Le parcours en 7 étapes
• La FAQ de ton étape et le sommaire des lives avant de poser une question
• Claude in Chrome + le prompt : ton Claude Code réfléchit avec la méthode à chaque session
• Nouvelle étape, nouveau prompt`,
  prepare: [
    "Captures du Skool : les onglets Community, Classroom et Calendar, la liste des cours, l'étape 4 avec ses dossiers",
    "La page « Le parcours en 7 étapes », avec la ligne « C'est fait quand » de l'étape 5",
    "Le dossier « ❓ FAQ » de l'étape 6, puis la page « Sommaire des lives par sujet » et un clic vers un live",
    "La page « Comment me joindre et quand on s'appelle »",
    "La page de l'extension Claude in Chrome sur le Chrome Web Store",
    "Le terminal avec claude --chrome, puis le menu de /chrome",
    "Un enregistrement de ton Claude Code qui lit le Skool avec le prompt, puis le fichier docs/methode-app-mastery.md et la consigne dans CLAUDE.md",
    "La même demande posée à Claude sans le Skool puis avec le Skool, pour la comparaison de la partie 4",
  ],
  checklist: [
    { point: "Prompt testé sur ton Claude Code avec le Skool ouvert : regarder ce qu'il retient d'une leçon vidéo", state: "À faire" },
    { point: "110 des 114 leçons vidéo ont un texte sous la vidéo ; presque rien sous Les MCPs, Les Hooks, Les Multi-Agents (Claude Code en profondeur) et l'Introduction de Git/GitHub", state: "À compléter" },
    { point: "Application Claude (desktop) : vérifier qu'elle passe bien par l'extension pour ouvrir le Skool (la doc dit qu'elle s'en sert quand l'extension est installée)", state: "À vérifier" },
    { point: "WhatsApp : « 6 jours sur 7 » dans Le parcours et Comment on travaille ensemble, « du lundi au vendredi » dans Comment me joindre. Le script ne donne pas de jours", state: "À trancher" },
    { point: "Leçon « Claude Chrome » citée (Claude Code en profondeur) : c'est bien une vidéo", state: "OK" },
    { point: "Description collée sous la leçon Skool, avec les chapitres réels après le montage", state: "À faire" },
  ],
};
