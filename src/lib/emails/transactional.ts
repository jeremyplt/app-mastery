// Gabarits des emails transactionnels envoyés par le site (hors séquence B,
// voir sequence-b.ts). Chaque fonction rend l'objet et le corps HTML : les
// routes les envoient, et l'admin (/admin/crm/emails) les prévisualise.

export type BuiltEmail = { subject: string; html: string; tag: string };

function greeting(firstName?: string) {
  return firstName ? `Salut ${firstName},` : "Salut,";
}

// Formulaire /appel rempli sans créneau choisi.
export function appelDecouverte(firstName?: string): BuiltEmail {
  const html = `
<p>${greeting(firstName)}</p>

<p>Merci d'avoir rempli le formulaire pour réserver un appel découverte.</p>

<p>Si tu n'as pas encore choisi de créneau, voici le lien direct pour le faire maintenant :</p>

<p><a href="https://www.jeremypitault.com/appel/reserver">Réserver mon appel</a></p>

<p>Avant qu'on se parle, prends 2 minutes pour bien comprendre l'objectif de cet appel :</p>

<ul>
  <li>On fait le point sur ton projet d'app et ta situation actuelle</li>
  <li>Je te dis honnêtement si un accompagnement peut t'aider</li>
  <li>Si oui, on définit ensemble la solution la plus adaptée</li>
  <li>Si non, je te donne quand même un plan d'action concret pour avancer seul</li>
</ul>

<p>L'idée de l'appel, c'est vraiment de voir ensemble si on peut travailler ensemble. Pour que ce soit utile pour toi, viens en étant ouvert à investir sur toi et sur ton projet, c'est ce qui fait toute la différence.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu as des questions avant l'appel, réponds directement à cet email. Je lis tout.</p>
`;
  return { subject: "Ton appel découverte est presque réservé", html, tag: "appel-decouverte" };
}

// Accès à la conférence après l'optin /conference.
export function vslAccess(firstName?: string): BuiltEmail {
  const html = `
<p>${greeting(firstName)}</p>

<p>Merci de t'être inscrit à la conférence privée.</p>

<p>Voici ton accès direct : <a href="https://www.jeremypitault.com/conference/live">Accéder à la conférence</a></p>

<p>Dedans, tu vas découvrir :</p>

<ul>
  <li>Pourquoi 93% des applications ne sont jamais rentables (et comment éviter ce piège)</li>
  <li>Les 3 piliers indispensables pour générer jusqu'à 10 000€ par mois avec une seule app</li>
  <li>La méthode exacte pour créer ton app avec l'IA en moins d'une semaine, sans coder</li>
</ul>

<p>Regarde-la en entier. À la fin, tu sauras exactement quoi faire pour lancer ton app rentable.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu as des questions, réponds directement à cet email. Je lis tout.</p>
`;
  return { subject: "Ton accès à la conférence privée", html, tag: "vsl-conference" };
}

// Accès au Plan d'action après l'optin /plan-action.
export function planAction(firstName?: string): BuiltEmail {
  const html = `
<p>${greeting(firstName)}</p>

<p>Merci d'avoir demandé le Plan d'Action.</p>

<p>Voici ton accès : <a href="https://www.jeremypitault.com/plan-action/video">Regarder le Plan d'Action</a></p>

<p>Dedans, tu vas découvrir :</p>

<ul>
  <li>Comment j'ai trouvé et validé mon idée d'app (et l'erreur qui m'a fait perdre 3 mois)</li>
  <li>Le workflow exact que j'utilise pour créer des apps avec l'IA, sans coder moi-même</li>
  <li>La stratégie marketing qui a généré des millions de vues en organique</li>
  <li>La stratégie de scaling pour atteindre 10k MRR</li>
</ul>

<p>Prends quelques minutes pour la regarder. C'est la version condensée de tout ce que j'ai appris en 3 ans.</p>

<p>Mais il y a un truc que je n'ai pas mis dans la vidéo.</p>

<p>C'est le moment précis où tout a basculé pour moi. Le jour où j'ai failli tout abandonner, et ce qui s'est passé juste après.</p>

<p>Je t'en parle demain.</p>

<p>En attendant, si tu as déjà une app ou un projet en tête, je propose un appel découverte. On fait le point sur ton projet et on voit si on peut travailler ensemble. Réponds à quelques questions et choisis ton créneau :</p>

<p><a href="https://www.jeremypitault.com/appel?utm_source=email&utm_medium=email&utm_campaign=plan-action">Réserver mon appel découverte</a></p>

<p>À demain,<br>Jeremy</p>

<p>P.S. Si tu as des questions après avoir regardé le Plan d'Action, réponds directement à cet email. Je lis tout.</p>
`;
  return { subject: "Ton Plan d'Action est prêt", html, tag: "plan-action" };
}

// Livraison du pack Metabase.
export function metabase(firstName?: string): BuiltEmail {
  const html = `
<p>${greeting(firstName)}</p>

<p>Merci d'avoir demandé le pack Metabase. Voici ton fichier à télécharger :</p>

<p><a href="https://www.jeremypitault.com/downloads/metabase-hostinger-m9k4p2.zip">Télécharger le pack .zip</a></p>

<p>Dedans, tu trouveras :</p>

<ul>
  <li>Le tutoriel pas à pas pour préparer ton VPS Hostinger (KVM 2)</li>
  <li>Le prompt IA qui installe et sécurise Metabase pour toi, en Docker</li>
  <li>Tout ce qu'il faut pour avoir ton dashboard analytics auto-hébergé en HTTPS</li>
</ul>

<p>Suis le tutoriel d'abord, il te prépare le VPS et te donne les infos à copier dans le prompt. Ensuite, tu envoies le prompt à l'IA et tu la laisses installer Metabase.</p>

<p>À très vite,<br>Jeremy</p>

<p>P.S. Si tu bloques quelque part, réponds directement à cet email. Je lis tout.</p>
`;
  return { subject: "Ton pack Metabase est prêt", html, tag: "metabase" };
}

// Candidature : réponse au prospect selon la qualification.
export function candidatureProspect(firstName: string, email: string, qualified: boolean): BuiltEmail {
  const html = qualified
    ? `
      <p>Salut ${firstName},</p>
      <p>Merci pour ta candidature, elle est validée.</p>
      <p>Dernière étape : choisis ton créneau pour qu'on se parle 30 minutes de ton projet.</p>
      <p><a href="https://www.jeremypitault.com/appel/reserver?firstName=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}">Réserver mon appel</a></p>
      <p>Tant que tu n'as pas choisi de créneau, rien n'est réservé.</p>
      <p>À très vite,<br>Jeremy</p>`
    : `
      <p>Salut ${firstName},</p>
      <p>Merci pour ta candidature.</p>
      <p>Vu là où tu en es, le mieux est de commencer par poser des bases solides avant un appel. Voici par où démarrer, gratuitement :</p>
      <p><a href="https://www.jeremypitault.com/plan-action/video">Le plan d'action gratuit</a></p>
      <p>Avance avec ça, et on se reparle quand ton projet aura pris de l'ampleur.</p>
      <p>À bientôt,<br>Jeremy</p>`;
  return {
    subject: qualified ? "Ta candidature est validée, réserve ton appel" : "Merci pour ta candidature",
    html,
    tag: qualified ? "candidature-qualifie" : "candidature-non-qualifie",
  };
}

// Lien de connexion à l'espace membres (valide 1 h).
export function magicLink(link: string): BuiltEmail {
  const html = `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h2 style="color: #111; font-size: 20px;">Connexion à ton espace App Mastery</h2>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              Clique sur le bouton ci-dessous pour accéder à tes cours. Ce lien expire dans 1 heure.
            </p>
            <a href="${link}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; margin-top: 16px;">
              Accéder à mes cours
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">
              Si tu n'as pas demandé ce lien, ignore cet email.
            </p>
          </div>
        `;
  return { subject: "Ton lien de connexion App Mastery", html, tag: "magic-link" };
}

// Identifiants des modèles Brevo utilisés tels quels (guides gratuits et
// bienvenue selon le plan), pour la prévisualisation admin.
export const BREVO_TEMPLATE_IDS: Record<string, number> = {
  "piscine-epitech": 16,
  "prompt-50-saas": 17,
  "workflow-make": 19,
  monetisation: 11,
  openclaw: 14,
  "welcome-essentiel": 8,
  "welcome-complet": 9,
  "welcome-vip": 10,
};
