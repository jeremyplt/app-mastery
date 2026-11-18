// Scripts de vidéos YouTube, affichés dans /admin/scripts.
// Les données vivent dans scripts-data.ts, lu côté serveur seulement : elles
// ne partent au navigateur qu'une fois l'accès propriétaire vérifié.

// Un moment du script : ce que Jeremy dit, et ce qu'on voit à l'écran.
export type Beat = { say?: string; show?: string };

// mode : « visage » si Jeremy est face caméra, « sans-visage » si c'est sa voix
// seule sur le montage. Absent pour les scripts tournés entièrement face caméra.
// links : les vidéos citées dans la section, pour que Jeremy les regarde avant de tourner.
export type ScriptSection = {
  time: string;
  title: string;
  mode?: "visage" | "sans-visage";
  beats: Beat[];
  links?: { label: string; url: string }[];
};

export type VideoScript = {
  slug: string;
  // Repère court affiché dans les onglets (« Vidéo A », « Vidéo B »).
  label: string;
  status: string;
  updatedAt: string;
  title: string;
  // Pourquoi cette vidéo, en deux ou trois phrases.
  why: string;
  facts: { label: string; value: string }[];
  altTitles: { title: string; why: string }[];
  thumbnail: { text: string; layout: string; variant: string; prompt: string };
  gift: { name: string; url: string; note: string };
  // Ce qui doit être vrai à la fin pour que le titre soit vrai.
  plan: string[];
  sections: ScriptSection[];
  description: string;
  shorts: string[];
  prepare: string[];
  checklist: { point: string; state: string }[];
};
