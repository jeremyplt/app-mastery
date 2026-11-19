#!/usr/bin/env python3
"""Construit le PDF « 100 contenus viraux à copier pour ton app ».

Cadeau de la vidéo YouTube B (« J'ai analysé 1 633 vidéos d'apps et j'ai appris
ça »). Les contenus sont les plus vus de la GIGA BANQUE, gardés seulement quand
leur format peut marcher pour n'importe quelle app (pas de niche trop précise,
pas de vidéo d'élève, pas de vues qui ont l'air payées). Données dans
100-contenus-viraux.json : vues relues sur TikTok les 12 et 18/11/2026 quand
« verified » est vrai (rapports du 12/11 et du 18/11 dans ~/Projects/reports),
sinon vues écrites dans la banque.

Usage : python3 lead-magnets/build-100-contenus-viraux.py
Produit le HTML et le PDF dans lead-magnets/, sa copie dans public/downloads/,
et l'image de couverture de la page d'optin. Même style que le PDF des 32 leçons.
"""
import html
import importlib.util
import json
import shutil
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATA = HERE / "100-contenus-viraux.json"
OUT_HTML = HERE / "100-contenus-viraux.html"
OUT_PDF = HERE / "100-contenus-viraux-a-copier-pour-ton-app.pdf"
PUBLIC_PDF = ROOT / "public/downloads/100-contenus-viraux-t4n8w2.pdf"
PREVIEW = ROOT / "public/proof/100-contenus-viraux-preview.jpg"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CALL_URL = "https://www.jeremypitault.com/appel?utm_source=pdf&utm_medium=lead-magnet&utm_campaign=100-contenus-viraux"
TITLE = "100 contenus viraux à copier pour ton app"

# Même feuille de style que le PDF des 32 leçons.
_spec = importlib.util.spec_from_file_location("build32", HERE / "build-32-lecons-videos.py")
_build32 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_build32)

CSS = _build32.CSS + """
  @page flow { size: A4; margin: 14mm 0 14mm; }
  .flow { page: flow; padding: 0 17mm; }
  .cat { margin-top: 9mm; }
  .cat:first-child { margin-top: 0; }
  .cat .head { break-inside: avoid; }
  .item { display: flex; gap: 4mm; padding: 3.2mm 0; border-bottom: 1px solid #e6e6e6; break-inside: avoid; }
  .item .n { flex: 0 0 10mm; font-weight: 800; color: #0A84FF; font-size: 13pt; }
  .item .t { font-weight: 700; font-size: 12.5pt; }
  .item .t a { color: #0060df; }
  .item .meta { font-weight: 700; color: #111; font-size: 10.8pt; white-space: nowrap; }
  .item .meta .ok { color: #0a7d32; }
  .item .hook { font-size: 11.3pt; margin-top: 1mm; color: #222; }
  .item .copy { font-size: 11.3pt; margin-top: 1mm; color: #222; }
  .item b.k { color: #111; }
  .toc { columns: 2; column-gap: 8mm; padding-left: 5mm; margin: 0 0 5mm; font-size: 11.5pt; }
  .toc li { margin-bottom: 1.6mm; break-inside: avoid; }
"""

HOOK_LABEL = {
    "P": "Phrase d'ouverture",
    "T": "Phrase d'ouverture (traduite)",
    "V": "On voit",
}


def esc(text: str) -> str:
    return html.escape(text, quote=False)


def render_item(n: int, row: dict) -> str:
    views = f'{row["plat"]} · {row["views"]} de vues' if "M" in row["views"] else f'{row["plat"]} · {row["views"]} vues'
    ok = ' · <span class="ok">vérifié</span>' if row["verified"] else ""
    hook = f'« {esc(row["hook"])} »' if row["kind"] in ("P", "T") else esc(row["hook"])
    return (
        f'<div class="item"><div class="n">{n}</div><div>'
        f'<div class="t"><a href="{html.escape(row["url"])}">{esc(row["label"])}</a> '
        f'<span class="meta">{esc(views)}{ok}</span></div>'
        f'<div class="hook"><b class="k">{HOOK_LABEL[row["kind"]]} :</b> {hook}</div>'
        f'<div class="copy"><b class="k">À copier :</b> {esc(row["copy"])}</div>'
        f"</div></div>"
    )


def build_html(cats: list) -> str:
    rows = [r for c in cats for r in c["rows"]]
    assert len(rows) == 100, f"{len(rows)} contenus au lieu de 100"
    urls = [r["url"] for r in rows]
    assert len(set(urls)) == len(urls), "lien en double"
    for r in rows:
        for field in ("label", "hook", "copy"):
            assert "—" not in r[field], f"tiret cadratin dans {r['url']}"

    n = 0
    sections = []
    toc = []
    for i, c in enumerate(cats, 1):
        first = n + 1
        items = []
        for r in c["rows"]:
            n += 1
            items.append(render_item(n, r))
        toc.append(f'<li><b>{esc(c["title"])}</b>, n° {first} à {n}</li>')
        sections.append(
            f'<div class="cat"><div class="head"><div class="part-kicker">Format {i} sur {len(cats)} · contenus {first} à {n}</div>'
            f'<h2>{esc(c["title"])}</h2><p class="lead">{esc(c["lead"])}</p>{items[0]}</div>'
            + "\n".join(items[1:])
            + "</div>"
        )
    verified = sum(1 for r in rows if r["verified"])

    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{TITLE}</title>
<style>{CSS}</style>
</head>
<body>

<section class="page cover">
  <div>
    <div class="kicker">Cadeau gratuit</div>
    <h1>100 contenus viraux <span>à&nbsp;copier pour ton&nbsp;app</span></h1>
    <div class="sub">Les vidéos et carrousels les plus vus parmi les 1 633 qu'on a analysés, gardés seulement quand leur format peut marcher pour n'importe quelle application. Pour chacun : le lien, les vues, la phrase d'ouverture et ce qu'il faut copier.</div>
  </div>
  <div class="bottom">
    <div class="author">Jeremy Pitault<small>Créateur de Shinobi Japanese, plus de 30 000 $ par mois avec une seule app</small></div>
    <div class="badge">100 contenus<small>{len(cats)} formats, un lien pour chacun</small></div>
  </div>
</section>

<section class="page intro">
  <h2>Comment t'en servir</h2>
  <p class="lead">Tu n'as pas besoin d'être dans la même niche que l'exemple. Ce que tu copies, c'est la structure : la phrase d'ouverture, l'ordre des plans, la durée et le son.</p>
  <ol class="how">
    <li><b>Choisis un format</b> qui colle à ce que fait ton app, et ouvre ses exemples.</li>
    <li><b>Regarde chaque exemple plusieurs fois</b> et note la phrase d'ouverture, le moment où l'app apparaît, la durée et le son.</li>
    <li><b>Refais-le avec ton app</b> : même structure, même durée, même son, et la phrase d'ouverture adaptée à ta cible.</li>
    <li><b>Poste-le plusieurs fois avant de juger.</b> Le même format peut faire 963 300 vues puis 5 400 trois jours plus tard sur le même compte. Compte au moins 10 essais par format.</li>
  </ol>
  <div class="callout"><b>D'où viennent les chiffres :</b> « vérifié » veut dire que les vues ont été relues une par une sur TikTok les 12 et 18 novembre 2026 ({verified} contenus sur 100). Les autres chiffres viennent de notre banque de contenus, relevés en novembre 2026 (c'est le cas de toutes les vidéos Instagram). Un « M » veut dire un million.<br><b>Les phrases d'ouverture</b> sont recopiées telles quelles. « Traduite » : on te la donne en français. « On voit » : on ne connaît pas la phrase exacte, c'est une description courte de la vidéo.</div>
  <h2 style="font-size:16pt;margin-top:6mm">Les {len(cats)} formats</h2>
  <ol class="toc">{"".join(toc)}</ol>
  <div class="footer"><span>{TITLE}</span><span>jeremypitault.com</span></div>
</section>

<section class="flow">
{"".join(sections)}
</section>

<section class="page cta">
  <div class="part-kicker">Et maintenant</div>
  <h2>Tu veux qu'on trouve ensemble <span>les vidéos qui feront vendre ton app</span> ?</h2>
  <p>Ces 100 contenus, c'est la base. Le plus dur, c'est de trouver le format qui marche pour ta niche à toi, puis de tenir le rythme jusqu'à ce qu'une vidéo décolle. C'est ce qu'on fait avec les personnes que j'accompagne pendant trois mois.</p>
  <p>Tout commence par un appel de 30 minutes avec mon associé Nolan ou avec moi. On regarde ton projet et le temps que tu peux y consacrer, et on te dit franchement si l'accompagnement est fait pour toi.</p>
  <a class="btn" href="{CALL_URL}">Réserver mon appel</a>
  <div class="url">{CALL_URL}</div>
</section>

</body>
</html>
"""


def main() -> None:
    cats = json.loads(DATA.read_text(encoding="utf-8"))
    OUT_HTML.write_text(build_html(cats), encoding="utf-8")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
         f"--print-to-pdf={OUT_PDF}", OUT_HTML.as_uri()],
        check=True, capture_output=True,
    )
    shutil.copyfile(OUT_PDF, PUBLIC_PDF)
    tmp = HERE / "_cover100"
    subprocess.run(["pdftoppm", "-jpeg", "-r", "120", "-f", "1", "-l", "1", "-singlefile", str(OUT_PDF), str(tmp)], check=True)
    subprocess.run(["magick", f"{tmp}.jpg", "-resize", "989x1400!", "-quality", "85", str(PREVIEW)], check=True)
    Path(f"{tmp}.jpg").unlink()
    pages = subprocess.run(["pdfinfo", str(OUT_PDF)], capture_output=True, text=True).stdout
    print(next(l for l in pages.splitlines() if l.startswith("Pages")))


if __name__ == "__main__":
    main()
