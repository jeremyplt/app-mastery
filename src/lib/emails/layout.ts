// Briques HTML communes aux emails écrits dans le code (séquences A et B) :
// un email de Jeremy, texte simple, un seul bouton, une image légendée.

export const SITE = "https://www.jeremypitault.com";
export const PARIS = "Europe/Paris";

export const P = 'style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#1d1d1f"';
export const LI = 'style="margin:0 0 10px;font-size:16px;line-height:1.6;color:#1d1d1f"';

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Ajoute les UTM de suivi : on saura quel email fait prendre des rendez-vous.
export function utm(url: string, campaign: string): string {
  const u = new URL(url);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_medium", "email");
  u.searchParams.set("utm_campaign", campaign);
  return u.toString();
}

export function button(label: string, href: string): string {
  return `<p style="margin:26px 0"><a href="${href}" style="display:inline-block;background:#0a84ff;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:13px 24px;border-radius:10px">${esc(label)}</a></p>`;
}

// Image pleine largeur (560 px max) avec une légende en dessous. `maxWidth`
// sert aux captures verticales (téléphone) pour ne pas écraser l'email.
export function image(src: string, alt: string, caption: string, maxWidth = 560): string {
  return `<p style="margin:0 0 6px"><img src="${src}" alt="${esc(alt)}" width="${maxWidth}" style="display:block;width:100%;max-width:${maxWidth}px;height:auto;border-radius:12px" /></p>
<p style="margin:0 0 22px;font-size:14px;line-height:1.5;color:#6e6e73;font-style:italic">${esc(caption)}</p>`;
}

// Deux photos côte à côte, une légende commune.
export function imagePair(
  left: { src: string; alt: string },
  right: { src: string; alt: string },
  caption: string,
): string {
  const cell = (img: { src: string; alt: string }) =>
    `<td style="width:50%;padding:0 5px;vertical-align:top"><img src="${img.src}" alt="${esc(img.alt)}" width="270" style="display:block;width:100%;max-width:270px;height:auto;border-radius:12px" /></td>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;border-collapse:collapse;margin:0 0 6px"><tr>${cell(left)}${cell(right)}</tr></table>
<p style="margin:0 0 22px;font-size:14px;line-height:1.5;color:#6e6e73;font-style:italic">${esc(caption)}</p>`;
}

export function wrap(body: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#ffffff">
<div style="max-width:600px;margin:0 auto;padding:28px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
${body}
</div></body></html>`;
}

export function signature(closing: string): string {
  return `<p ${P}>${closing},<br>Jeremy</p>`;
}

// Mention de bas d'email, en petit et gris.
export function footnote(text: string): string {
  return `<p style="margin:26px 0 0;font-size:13px;line-height:1.5;color:#8a8a93">${esc(text)}</p>`;
}
