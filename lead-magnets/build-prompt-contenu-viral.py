#!/usr/bin/env python3
"""Construit le PDF « Le prompt contenu viral » à partir de prompt-contenu-viral.txt.

Usage : python3 lead-magnets/build-prompt-contenu-viral.py
Produit prompt-contenu-viral.html, le PDF dans lead-magnets/ et sa copie dans
public/downloads/, plus l'image de couverture de la page d'optin.
"""
import html
import re
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC = HERE / "prompt-contenu-viral.txt"
OUT_HTML = HERE / "prompt-contenu-viral.html"
OUT_PDF = HERE / "Le-prompt-contenu-viral.pdf"
PUBLIC_PDF = ROOT / "public/downloads/prompt-contenu-viral-r8t3w6.pdf"
PREVIEW = ROOT / "public/proof/prompt-contenu-viral-preview.jpg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CALL_URL = "https://www.jeremypitault.com/appel?utm_source=pdf&utm_medium=lead-magnet&utm_campaign=prompt-contenu-viral"


def inline(text: str) -> str:
    # Les passages à remplir ([nom de l'app], [...]) ressortent en bleu.
    return re.sub(r"(\[[^\]]*\])", r'<span class="fill">\1</span>', html.escape(text))


def render_prompt(raw: str) -> str:
    out = []
    for line in raw.rstrip("\n").split("\n"):
        if not line.strip():
            out.append('<div class="gap"></div>')
        elif line.startswith("## "):
            out.append(f'<div class="ph">{inline(line[3:])}</div>')
        elif line.startswith("  · "):
            out.append(f'<div class="li l2"><span class="mk">·</span>{inline(line[4:])}</div>')
        elif line.startswith("   "):
            out.append(f'<div class="li l1 cont">{inline(line.strip())}</div>')
        elif line.startswith("- "):
            out.append(f'<div class="li l1"><span class="mk">-</span>{inline(line[2:])}</div>')
        elif m := re.match(r"^(\d+)\. (.*)$", line):
            out.append(f'<div class="li l1"><span class="mk n">{m[1]}.</span>{inline(m[2])}</div>')
        else:
            out.append(f'<div class="p">{inline(line)}</div>')
    return "\n".join(out)


PAGE = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Le prompt contenu viral</title>
<style>
  @page { size: A4; margin: 16mm 17mm 16mm; }
  @page full { margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, "PingFang SC", sans-serif; color: #111; background: #fff; font-size: 12.5pt; line-height: 1.45; }
  .page { page: full; width: 210mm; height: 297mm; padding: 18mm 18mm 16mm; break-after: page; position: relative; overflow: hidden; }

  /* Couverture */
  .cover { background: #0a0a0a; color: #fff; display: flex; flex-direction: column; justify-content: space-between; }
  .kicker { color: #0A84FF; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 11pt; }
  .cover h1 { font-size: 42pt; line-height: 1.05; margin: 14mm 0 8mm; font-weight: 800; letter-spacing: -0.02em; }
  .cover h1 span, .cta h2 span { color: #0A84FF; }
  .cover .sub { font-size: 16pt; color: #d0d0d0; max-width: 155mm; }
  .cover .formats { display: flex; gap: 5mm; margin-top: 12mm; }
  .cover .formats div { flex: 1; border: 1px solid #2a2a2a; background: #151515; border-radius: 12px; padding: 5mm; font-size: 11pt; color: #cfcfcf; }
  .cover .formats b { display: block; color: #fff; font-size: 14pt; margin-bottom: 1.5mm; }
  .cover .bottom { display: flex; justify-content: space-between; align-items: flex-end; }
  .cover .author { font-size: 13pt; font-weight: 700; }
  .cover .author small { display: block; font-weight: 400; color: #9a9a9a; font-size: 10.5pt; margin-top: 2mm; }
  .cover .badge { background: #0A84FF; color: #fff; border-radius: 12px; padding: 5mm 7mm; font-weight: 700; font-size: 12pt; text-align: center; line-height: 1.25; }
  .cover .badge small { display: block; font-weight: 400; font-size: 9.5pt; opacity: .9; }

  /* Mode d'emploi */
  h2 { font-size: 22pt; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 3mm; }
  .lead { font-size: 12.5pt; color: #333; margin: 0 0 6mm; }
  .step { display: flex; gap: 4mm; padding: 3.2mm 0; border-bottom: 1px solid #e6e6e6; }
  .step:last-of-type { border-bottom: none; }
  .step .n { flex: 0 0 9mm; height: 9mm; border-radius: 50%; background: #0A84FF; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 12pt; }
  .step .t { font-weight: 700; font-size: 12.5pt; }
  .step .d { color: #444; font-size: 11pt; margin-top: .8mm; }
  .callout { background: #f2f6ff; border-left: 4px solid #0A84FF; border-radius: 6px; padding: 4mm 5mm; margin: 4mm 0 0; font-size: 11pt; }
  .callout b { color: #0A84FF; }
  .proof { display: flex; gap: 5mm; align-items: center; background: #0a0a0a; color: #d0d0d0; border-radius: 12px; padding: 5mm; margin-top: 4mm; font-size: 11pt; }
  .proof b { color: #fff; }
  .proof .big { flex: 0 0 auto; color: #0A84FF; font-size: 24pt; font-weight: 800; letter-spacing: -0.02em; line-height: 1; text-align: center; }
  .proof .big small { display: block; font-size: 9.5pt; color: #cfcfcf; font-weight: 600; letter-spacing: 0; margin-top: 1.5mm; }
  .footer { position: absolute; left: 18mm; right: 18mm; bottom: 8mm; display: flex; justify-content: space-between; font-size: 9pt; color: #888; border-top: 1px solid #e6e6e6; padding-top: 2.5mm; }

  /* Le prompt (texte qui coule sur plusieurs pages) */
  .prompt-head { margin-bottom: 5mm; }
  .prompt-head .kicker { font-size: 9.5pt; margin-bottom: 1.5mm; }
  .prompt-head p { margin: 0; color: #444; font-size: 11pt; }
  .prompt { -webkit-box-decoration-break: clone; box-decoration-break: clone; border: 1.5px solid #0A84FF; border-radius: 10px; padding: 6mm 6.5mm; font-size: 10.6pt; line-height: 1.5; color: #1a1a1a; }
  .prompt .p { margin: 0; }
  .prompt .gap { height: 2.6mm; }
  .prompt .ph { font-weight: 800; font-size: 12pt; color: #0a0a0a; margin: 2mm 0 1.2mm; padding-top: 2.5mm; border-top: 1px solid #e3e9f5; break-after: avoid; }
  .prompt .li { position: relative; padding-left: 5.5mm; margin: .5mm 0; }
  .prompt .li.l2 { padding-left: 10mm; }
  .prompt .li.cont { padding-left: 5.5mm; }
  .prompt .mk { position: absolute; left: 0; color: #0A84FF; font-weight: 700; }
  .prompt .l2 .mk { left: 5.5mm; }
  .prompt .fill { background: #e3efff; color: #0A5FD0; font-weight: 700; border-radius: 3px; padding: 0 1mm; }

  /* Dernière page */
  .cta { background: #0a0a0a; color: #fff; display: flex; flex-direction: column; justify-content: center; break-after: auto; }
  .cta h2 { color: #fff; font-size: 30pt; }
  .cta p { color: #d0d0d0; font-size: 13pt; max-width: 160mm; margin: 0 0 4mm; }
  .cta p b { color: #fff; }
  .cta .btn { display: inline-block; align-self: flex-start; background: #0A84FF; color: #fff; font-weight: 800; padding: 5mm 8mm; border-radius: 12px; font-size: 14pt; margin: 4mm 0 3mm; text-decoration: none; }
  .cta .url { color: #9a9a9a; font-size: 10.5pt; word-break: break-all; }
</style>
</head>
<body>

<section class="page cover">
  <div>
    <div class="kicker">Prompt gratuit</div>
    <h1>Le prompt qui transforme<br>un post viral en <span>post pour ton app</span></h1>
    <div class="sub">Ton assistant IA devient ton monteur vidéo, ton designer et ton community manager. Tu lui envoies un post qui a déjà cartonné, il te rend le même avec ton app à la place, prêt à publier.</div>
    <div class="formats">
      <div><b>Reels</b>Réaction face caméra ou plans filmés au téléphone, montés au même rythme que l'original.</div>
      <div><b>Carrousels</b>Les slides du mode photo TikTok et d'Instagram, ton app à la bonne place.</div>
      <div><b>Légendes</b>Le texte du post, les hashtags et le commentaire à épingler.</div>
    </div>
  </div>
  <div class="bottom">
    <div class="author">Jeremy Pitault<small>Créateur de Shinobi Japanese, 400 000 $ par an avec une seule app</small></div>
    <div class="badge">À copier-coller<small>tel quel dans ton IA</small></div>
  </div>
</section>

<section class="page">
  <h2>Comment utiliser ce prompt</h2>
  <p class="lead">Sur TikTok et Instagram, les posts qui font décoller une app reprennent presque toujours un format qui a déjà marché ailleurs. Ce prompt fait ce travail pour toi, de l'analyse du post d'origine jusqu'à la légende prête à copier.</p>

  <div class="step"><div class="n">1</div><div><div class="t">Prends une IA qui peut travailler sur un ordinateur</div><div class="d">Elle doit pouvoir télécharger un post, monter une vidéo et créer des images, pas seulement écrire du texte. Claude Code fait tout ça, et tu peux lui parler depuis ton téléphone.</div></div></div>
  <div class="step"><div class="n">2</div><div><div class="t">Remplis la partie « Mon contexte »</div><div class="d">Tout ce qui est surligné en bleu dans le prompt : le nom de ton app, ce qu'elle fait, ce qu'il faut montrer, ton public, tes plateformes et leur langue.</div></div></div>
  <div class="step"><div class="n">3</div><div><div class="t">Colle le prompt en entier</div><div class="d">De la première à la dernière ligne, dans une nouvelle conversation. L'IA commence par te demander ce qui lui manque.</div></div></div>
  <div class="step"><div class="n">4</div><div><div class="t">Envoie ta première inspiration</div><div class="d">Le lien d'un post de ta niche qui a fait beaucoup de vues, avec des vidéos et des captures de ton app. L'IA te montre d'abord son analyse, puis elle crée le post.</div></div></div>

  <div class="callout"><b>Pourquoi copier au lieu d'inventer ?</b> Un post qui a fait des millions de vues a déjà prouvé qu'il marche. Tu changes le contenu (ton app, tes textes, ta réaction), pas la recette. Chaque idée « originale » est un pari, une inspiration éprouvée ne l'est pas.</div>
  <div class="proof"><div class="big">7 300 $<small>en 14 jours</small></div><div><b>C'est exactement la méthode de Wassim</b>, 22 ans, un de mes élèves. Il reprend les vidéos des apps qui explosent, demande à Claude de les adapter à son app, puis se filme avec son iPhone. Résultat : 7 300 $ en 14 jours, dont 1 700 $ en une seule journée, sans un euro de publicité.</div></div>
  <div class="callout"><b>Où trouver tes inspirations ?</b> Tape le sujet de ton app dans la recherche TikTok et Instagram (« apprendre l'anglais », « réviser le bac », « perdre du poids »). Garde les posts qui ont fait beaucoup plus de vues que les autres posts du même compte : c'est le format qui a marché, pas le compte.</div>

  <div class="footer"><span>Le prompt contenu viral</span><span>jeremypitault.com</span></div>
</section>

<div class="prompt-head">
  <div class="kicker">Le prompt</div>
  <h2>Copie tout, puis remplis les parties en bleu</h2>
  <p>Sélectionne le texte du cadre ci-dessous, de « Tu es mon monteur vidéo » jusqu'à la dernière ligne.</p>
</div>
<div class="prompt">
__PROMPT__
</div>

<section class="page cta">
  <div class="kicker">Et maintenant ?</div>
  <h2>Tu veux qu'on fasse<br>décoller ton app <span>ensemble ?</span></h2>
  <p>Ce prompt, c'est une partie de la méthode que j'applique avec les élèves que j'accompagne : une niche précise, une app construite avec l'IA, et du contenu tous les jours pour la faire connaître.</p>
  <p>C'est comme ça que Wassim, 22 ans, a fait <b>7 300 $ en 14 jours</b> avec son app, dont <b>1 700 $ en une seule journée</b>. Seul, <b>sans dépenser un euro en publicité</b>, avec 3 à 4 heures de contenu par jour. Avant, il n'avait jamais fait de marketing.</p>
  <p>Sur un appel de 30 minutes, on regarde où tu en es et on pose ton plan d'action.</p>
  <a class="btn" href="__CALL__">Réserver mon appel</a>
  <div class="url">jeremypitault.com/appel</div>
</section>

</body>
</html>
"""


def main() -> None:
    page = PAGE.replace("__PROMPT__", render_prompt(SRC.read_text(encoding="utf-8"))).replace("__CALL__", CALL_URL)
    OUT_HTML.write_text(page, encoding="utf-8")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={OUT_PDF}", OUT_HTML.as_uri()],
        check=True, capture_output=True,
    )
    shutil.copyfile(OUT_PDF, PUBLIC_PDF)
    # Couverture pour la page d'optin (même format que les autres guides).
    tmp = HERE / "_cover"
    subprocess.run(["pdftoppm", "-jpeg", "-r", "120", "-f", "1", "-l", "1", "-singlefile", str(OUT_PDF), str(tmp)], check=True)
    subprocess.run(["magick", f"{tmp}.jpg", "-resize", "989x1400!", "-quality", "85", str(PREVIEW)], check=True)
    Path(f"{tmp}.jpg").unlink()
    pages = subprocess.run(["pdfinfo", str(OUT_PDF)], capture_output=True, text=True).stdout
    print(next(l for l in pages.splitlines() if l.startswith("Pages")))


if __name__ == "__main__":
    main()
